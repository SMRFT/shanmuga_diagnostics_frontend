// Pure utility/formatting functions extracted from the Invoice (B2BPatients)
// component. None of these read component state directly - all inputs are
// passed in explicitly - so behavior is identical to the original inline
// versions, just callable/testable on their own.

// Filters a list of B2B patients down to those whose `date` falls within
// the given (inclusive) date range. Mirrors the original inline
// `getFilteredPatients` body exactly, but takes the patients/fromDate/toDate
// as explicit arguments instead of closing over component state.
export function filterPatientsByDateRange(patients, fromDate, toDate) {
  return patients.filter((p) => {
    const recordDate = new Date(p.date);

    const startDate = fromDate ? new Date(fromDate) : null;
    const endDate = toDate ? new Date(toDate) : null;

    // Fix: make endDate include the entire day
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    const isDateMatch =
      (!startDate || recordDate >= startDate) &&
      (!endDate || recordDate <= endDate);

    return isDateMatch;
  });
}

// Filters the invoice list down to those whose clinical/lab name matches
// the search query. Mirrors the original inline `getFilteredInvoices` body.
export function filterInvoicesBySearch(invoices, searchQuery) {
  return invoices.filter((invoice) =>
    (invoice.clinicalName || invoice.labName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
}

// Splits a paid amount proportionally across patients based on each
// patient's share of the total original credit amount.
export function calculateProportionalCredits(patients, totalPaid, totalCredit) {
  const proportionalCredits = [];
  let remainingPaid = Number(totalPaid);

  // Use the sum of actual patient credits as the base for proportion
  const sumOriginalCredits = patients.reduce((sum, p) => sum + Number(p.credit_amount), 0);

  patients.forEach((patient, index) => {
    const patientCredit = Number(patient.credit_amount);
    const proportion = sumOriginalCredits > 0 ? (patientCredit / sumOriginalCredits) : 0;

    if (index === patients.length - 1) {
      proportionalCredits.push({
        ...patient,
        proportionalCredit: Math.max(0, remainingPaid).toFixed(2),
        proportion: (proportion * 100).toFixed(1),
      });
    } else {
      const proportionalAmount = Number(totalPaid) * proportion;
      proportionalCredits.push({
        ...patient,
        proportionalCredit: proportionalAmount.toFixed(2),
        proportion: (proportion * 100).toFixed(1),
      });
      remainingPaid -= proportionalAmount;
    }
  });

  return proportionalCredits;
}

// Computes summary stats (totals, averages, payment %) for a single invoice.
export function calculateInvoiceStats(invoice) {
  const patients = invoice.patients || [];
  const totalTests = patients.reduce(
    (sum, patient) => sum + (patient.test_count || 1),
    0
  );
  const totalPatients = patients.length;
  const avgCreditPerPatient =
    totalPatients > 0
      ? Number.parseFloat(invoice.totalCreditAmount) / totalPatients
      : 0;

  return {
    totalPatients,
    totalTests,
    avgCreditPerPatient: avgCreditPerPatient.toFixed(2),
    totalAmount: Number.parseFloat(invoice.totalCreditAmount || 0),
    paidAmount: Number.parseFloat(invoice.paidAmount || 0),
    pendingAmount: Number.parseFloat(
      invoice.pendingAmount || invoice.totalCreditAmount || 0
    ),
    paymentPercentage:
      invoice.totalCreditAmount > 0
        ? (
          (Number.parseFloat(invoice.paidAmount || 0) /
            Number.parseFloat(invoice.totalCreditAmount)) *
          100
        ).toFixed(1)
        : 0,
  };
}

// Safely parses an invoice's paymentHistory field, which may come back
// from the API as a JSON string, an array, or be missing entirely.
export function getPaymentHistory(invoice) {
  if (!invoice?.paymentHistory) return [];

  try {
    if (typeof invoice.paymentHistory === "string") {
      return JSON.parse(invoice.paymentHistory);
    }
    if (Array.isArray(invoice.paymentHistory)) {
      return invoice.paymentHistory;
    }
    return [];
  } catch (error) {
    console.error("Error parsing payment history:", error);
    return [];
  }
}

// Computes aggregate stats (counts, averages, most used method) over a
// parsed payment history array.
export function getPaymentHistoryStats(paymentHistory) {
  if (!paymentHistory || paymentHistory.length === 0) {
    return {
      totalPayments: 0,
      totalAmount: 0,
      averagePayment: 0,
      lastPaymentDate: null,
      mostUsedMethod: "N/A",
    };
  }

  const totalAmount = paymentHistory.reduce(
    (sum, payment) => sum + Number.parseFloat(payment.paymentAmount || 0),
    0
  );
  const totalPayments = paymentHistory.length;
  const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  const lastPayment = paymentHistory[paymentHistory.length - 1];
  const lastPaymentDate = lastPayment ? new Date(lastPayment.date) : null;

  const methodCounts = paymentHistory.reduce((acc, payment) => {
    const method = payment.paymentMethod || "Unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const mostUsedMethod = Object.keys(methodCounts).reduce(
    (a, b) => (methodCounts[a] > methodCounts[b] ? a : b),
    "N/A"
  );

  return {
    totalPayments,
    totalAmount,
    averagePayment,
    lastPaymentDate,
    mostUsedMethod,
  };
}

// Builds CSV text (header row + one row per invoice) for the "export CSV"
// action. Mirrors the original inline logic in `handleExportCSV` exactly.
export function buildInvoicesCsv(filteredInvoices) {
  const headers = [
    'Invoice Number',
    'Clinical Name',
    'Generated Date',
    'Date Range',
    'Total Amount',
    'Paid Amount',
    'Pending Amount'
  ];

  const rows = filteredInvoices.map(invoice => {
    const generatedDate = invoice.generateDate ? new Date(invoice.generateDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A";
    const dateRange = invoice.fromDate && invoice.toDate ? `${new Date(invoice.fromDate).toLocaleDateString()} - ${new Date(invoice.toDate).toLocaleDateString()}` : "N/A";

    return [
      invoice.invoiceNumber,
      invoice.clinicalName || invoice.labName || "",
      generatedDate,
      dateRange,
      invoice.totalCreditAmount || "0",
      invoice.paidAmount || "0.00",
      invoice.pendingAmount || invoice.totalCreditAmount || "0"
    ];
  });

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}
