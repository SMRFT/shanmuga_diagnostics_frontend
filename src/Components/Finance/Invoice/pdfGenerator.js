import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from "react-toastify";

// Import header and footer images
import headerImage from "../../Images/Header.png";
import FooterImage from "../../Images/Footer.png";

// Generates the "Patient Details Report" PDF for a given invoice and
// triggers a browser download. Extracted verbatim from the Invoice
// component body - it does not read any component state, only the
// `invoice` argument, so it is safe to call from anywhere.
export const generatePDF = async (invoice) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let headerImgData = null;
  let footerImgData = null;

  try {
    // Preload header image
    const headerImg = new Image();
    headerImg.crossOrigin = "anonymous";
    headerImgData = await new Promise((resolve, reject) => {
      headerImg.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = headerImg.width;
        canvas.height = headerImg.height;
        ctx.drawImage(headerImg, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      headerImg.onerror = reject;
      headerImg.src = headerImage;
    });

    // Preload footer image
    const footerImg = new Image();
    footerImg.crossOrigin = "anonymous";
    footerImgData = await new Promise((resolve, reject) => {
      footerImg.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = footerImg.width;
        canvas.height = footerImg.height;
        ctx.drawImage(footerImg, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      footerImg.onerror = reject;
      footerImg.src = FooterImage;
    });

    // Add header content to first page
    doc.addImage(headerImgData, "PNG", 10, 10, 190, 30);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("PATIENT DETAILS REPORT", 105, 55, { align: "center" });

    // Invoice details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 70);
    doc.text(
      `Clinical Name: ${invoice.clinicalName || invoice.labName}`,
      14,
      77
    );
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 84);

    if (invoice.fromDate && invoice.toDate) {
      doc.text(
        `Period: ${new Date(
          invoice.fromDate
        ).toLocaleDateString()} - ${new Date(
          invoice.toDate
        ).toLocaleDateString()}`,
        14,
        91
      );
    }

    // Patient Details Table with Test Names
    if (invoice.patients && invoice.patients.length > 0) {
      const tableData = invoice.patients.map((patient, index) => {
        // Parse proportional credits
        const proportionalCredits = invoice.proportionalCredits
          ? typeof invoice.proportionalCredits === "string"
            ? JSON.parse(invoice.proportionalCredits)
            : invoice.proportionalCredits
          : [];

        const proportionalCredit =
          proportionalCredits.find((p) => p.patient_id === patient.patient_id)
            ?.proportionalCredit || "0.00";

        // Format testname properly - extract from array if it's an array and include amount in brackets with numbering

        let testNameFormatted = "";

        if (Array.isArray(patient.testdetails)) {
          testNameFormatted = patient.testdetails
            .map((test, testIndex) => {
              const amount = test.MRP ? ` (${test.MRP})` : "";
              const tName = test.testname || test.test_name || "N/A";
              return `${testIndex + 1}. ${tName}${amount}`;
            })
            .join("\n");
        } else if (
          typeof patient.testdetails === "object" &&
          patient.testdetails !== null
        ) {
          const amount = patient.testdetails.MRP
            ? ` (${patient.testdetails.MRP})`
            : "";
          const tName = patient.testdetails.testname || patient.testdetails.test_name || "N/A";
          testNameFormatted = `1. ${tName}${amount}`;
        } else {
          testNameFormatted = "N/A";
        }


        return [
          (index + 1).toString(),
          patient.patient_id,
          patient.patientname,
          new Date(patient.bill_date).toLocaleDateString(),
          testNameFormatted,
          `${Number.parseFloat(patient.credit_amount).toFixed(2)}`,
          `${proportionalCredit}`,
          `${(
            Number.parseFloat(patient.credit_amount) - proportionalCredit
          ).toFixed(2)}`,
        ];
      });

      // FIXED: Use standalone autoTable function instead of doc.autoTable
      autoTable(doc, {
        startY: 105,
        head: [
          [
            "S.No",
            "Patient ID",
            "Patient Name",
            "Date",
            "Test Name",
            "Net(Rs).",
            "Rec(Rs).",
            "Due(Rs).",
          ],
        ],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        columnStyles: {
          4: { cellWidth: 50 }, // Test Name column wider
          5: { halign: "right" }, // Net column right aligned
          6: { halign: "right" }, // Received column right aligned
          7: { halign: "right" }, // Due column right aligned
        },
        margin: { top: 20, bottom: 20 },
        pageBreak: "auto",
        showHead: "everyPage",
        didDrawPage: function (data) {
          const pageNumber = data.pageNumber;
          const pageHeight = doc.internal.pageSize.height;
          const pageWidth = doc.internal.pageSize.width;

          // Add header only to first page
          if (pageNumber === 1) {
            // Header is already added above for first page
            // No need to add again here
          }

          // Don't add page numbers here - they will be added later to avoid overlap
        },
      });
    }

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80); // Reset text color
    doc.text("Summary", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Patients: ${invoice.patients.length}`, 14, finalY + 7);
    doc.text(
      `Total Original Credit Amount: ${invoice.totalCreditAmount}`,
      14,
      finalY + 14
    );
    doc.text(`Paid: ${invoice.paidAmount || "0.00"}`, 14, finalY + 21);
    doc.text(
      `Pending: ${invoice.pendingAmount || invoice.totalCreditAmount}`,
      14,
      finalY + 28
    );

    // Add footer only to the last page after all content is added
    const totalPages = doc.internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Go to the last page
    doc.setPage(totalPages);

    // Add footer image
    doc.addImage(footerImgData, "PNG", 10, pageHeight - 40, 190, 25);

    // Add footer text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.text(
      `Generated on: ${new Date().toLocaleString()} | Patient Details Report`,
      14,
      pageHeight - 10
    );

    // Update page numbers to show total pages
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, {
        align: "center",
      });
    }

    doc.save(`Patient-Details-${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF", { autoClose: 3000 });
  }
};
