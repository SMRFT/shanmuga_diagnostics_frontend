"use client"

import { useEffect, useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { format } from "date-fns"
import JsBarcode from "jsbarcode"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import "react-datepicker/dist/react-datepicker.css"
import { Search, Printer, X } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
// Import images
import headerImage from "../Images/Header.png"
import FooterImage from "../Images/Footer.png"
import Vijayan from "../Images/Vijayan.png"
import apiRequest from "../Auth/apiRequest"

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
 
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
 
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`

const FiltersContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
`

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`

const SearchFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: 1 / -1;
`

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`

const ClearButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);

  &:hover {
    background-color: var(--gray-light);
  }
`

const TableContainer = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`

const TableHead = styled.thead`
  background-color: var(--gray-light);

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }

  td {
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
  font-style: italic;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => props.color || "var(--gray)"};
  color: white;
`

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: var(--border-radius);
  background-color: ${(props) => (props.disabled ? "var(--gray-light)" : "var(--primary)")};
  color: ${(props) => (props.disabled ? "var(--gray)" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.disabled ? "var(--gray-light)" : "var(--primary-dark)")};
  }
`

const PreethamHospital = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [statuses, setStatuses] = useState({})
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  // Fetch patients from preetham_hospital_report endpoint
  useEffect(() => {
    const fetchPreethamHospitalData = async () => {
      setLoading(true)
      const formattedStartDate = startDate.toISOString().split("T")[0]
      const formattedEndDate = endDate.toISOString().split("T")[0]

      const url = `${Labbaseurl}preetham_hospital_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`

      const result = await apiRequest(url, "GET")

      if (result.success) {
        const patientData = result.data

        // Set the full and filtered patient list
        setPatients(patientData)
        setFilteredPatients(patientData)

        const statusMap = {}
        patientData.forEach((patient) => {
          statusMap[patient.patient_id] = {
            status: patient.status,
            barcode: patient.barcode,
          }
        })
        setStatuses(statusMap)
      } else {
        console.error("Error fetching preetham hospital data:", result.error)
        setError("Failed to load patient data")
        toast.error(result.error || "Failed to load patient data")
      }

      setLoading(false)
    }

    if (startDate && endDate) {
      fetchPreethamHospitalData()
    }
  }, [startDate, endDate, Labbaseurl])

  // Filter patients based on search query (patient ID, patient name, barcode)
  useEffect(() => {
    const startOfDay = new Date(startDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)

    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.date)
      const matchesDate = patientDate >= startOfDay && patientDate <= endOfDay

      // Search filter: check patient_id, patient_name, and barcode
      const matchesSearch =
        !searchQuery ||
        patient.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.barcode?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesDate && matchesSearch
    })

    setFilteredPatients(filtered)
  }, [startDate, endDate, patients, searchQuery])

  const clearFilters = () => {
    setStartDate(new Date())
    setEndDate(new Date())
    setSearchQuery("")
    setFilteredPatients(patients)
  }

  // Determine if print and mail are enabled based on status
  const isPrintAndMailEnabled = (status) =>
    status === "Approved" || status === "Partially Approved" || status === "Dispatched"

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      console.log("Fetching patient details for barcode:", patient.barcode)
      const response = await apiRequest(`${Labbaseurl}get_patient_test_details/?barcode=${patient.barcode}`, "GET")

      if (!response.success) {
        console.error("Failed to fetch patient details:", response.error)
        toast.error(response.error || "Failed to fetch patient details")
        return null
      }

      console.log("API Response:", response.data)
      let patientDetails = response.data
      if (Array.isArray(response.data)) {
        // Merge testdetails from all records
        patientDetails = {
          ...response.data[0], // Use first record for base patient info
          testdetails: response.data.flatMap((record) => record.testdetails || []),
        }
      }

      console.log("Processed Patient Details:", patientDetails)
      if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
        console.error("No test details found for the patient.")
        toast.error("No test details found for the patient.")
        return null
      }

      // Enhanced Unicode character mapping for medical units
      const unicodeMap = {
        // Greek letters
        μ: "µ",
        α: "α",
        β: "β",
        γ: "γ",
        δ: "δ",
        Ω: "Ω",
        // Superscript numbers
        "²": "²",
        "³": "³",
        "⁴": "⁴",
        // Medical symbols
        "°": "°",
        "±": "±",
        "×": "x",
        "÷": "/",
        // Common Unicode escapes
        "\\u03bc": "µ",
        "\\u00b5": "µ",
        "\\u00b0": "°",
        "\\u00b1": "±",
        "\\u00b2": "²",
        "\\u00b3": "³",
      }

      // Enhanced function to handle Unicode characters in text
      const processUnicodeText = (text) => {
        if (!text) return ""

        let processedText = text

        // Handle Unicode escape sequences first
        processedText = processedText.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          const char = String.fromCharCode(Number.parseInt(hex, 16))
          return unicodeMap[char] || char
        })

        // Handle direct Unicode characters
        Object.keys(unicodeMap).forEach((unicode) => {
          const regex = new RegExp(unicode, "g")
          processedText = processedText.replace(regex, unicodeMap[unicode])
        })

        return processedText
      }

      // Function to extract the number from patient_ref_no
      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A"
        const numberPart = refNo.split("+")[0]
        return numberPart
      }

      // Adding Consultant names and qualifications
      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. Vijayan Ph.D.", "Consultant Biochemist", Vijayan],
      ]

      const patientRefNo = patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A"
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo)

      // Generate Barcode only if patientRefNoNumber is not "N/A"
      let barcodeImage = null
      if (patientRefNoNumber !== "N/A") {
        const barcodeCanvas = document.createElement("canvas")
        JsBarcode(barcodeCanvas, patientRefNoNumber, {
          format: "CODE128",
          lineColor: "#000",
          width: 1.5,
          height: 10,
          displayValue: false,
          margin: 0,
        })
        barcodeImage = barcodeCanvas.toDataURL("image/png")
      }

      // Define consistent margins and dimensions regardless of letterpad
      const leftMargin = 10
      const rightMargin = leftMargin + 190
      const contentWidth = rightMargin - leftMargin

      // Consistent header and footer heights regardless of letterpad
      const headerHeight = 30
      const footerHeight = 20

      // Create jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = headerHeight + 5

      // Add header and footer if withLetterpad is true
      if (withLetterpad) {
        pdf.addImage(headerImage, "PNG", 0, 0, 210, headerHeight)
        pdf.addImage(FooterImage, "PNG", 0, pageHeight - footerHeight, 210, footerHeight)
      }

      // Patient Information
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")

      const patientInfoY = yPosition
      pdf.text(`Patient Name: ${patientDetails.patientname || "N/A"}`, leftMargin, patientInfoY)
      pdf.text(
        `Age/Gender: ${patientDetails.age || "N/A"}/${patientDetails.gender || "N/A"}`,
        leftMargin,
        patientInfoY + 5,
      )
      pdf.text(`Ref. By: ${patientDetails.refby || "N/A"}`, leftMargin, patientInfoY + 10)

      pdf.text(`Patient ID: ${patientDetails.patient_id || "N/A"}`, rightMargin - 60, patientInfoY)
      pdf.text(
        `Sample Date: ${patientDetails.collected_date ? format(new Date(patientDetails.collected_date), "dd-MM-yyyy") : "N/A"}`,
        rightMargin - 60,
        patientInfoY + 5,
      )
      pdf.text(`Report Date: ${format(new Date(), "dd-MM-yyyy")}`, rightMargin - 60, patientInfoY + 10)

      // Add barcode if available
      if (barcodeImage) {
        pdf.addImage(barcodeImage, "PNG", rightMargin - 30, patientInfoY - 2, 30, 12)
      }

      yPosition = patientInfoY + 18

      // Test Details Table
      const tableColumn = ["Test Name", "Result", "Unit", "Normal Range"]
      const tableRows = []

      patientDetails.testdetails.forEach((test) => {
        const testName = processUnicodeText(test.testname || "N/A")
        const result = processUnicodeText(test.result || "N/A")
        const unit = processUnicodeText(test.unit || "")
        const normalRange = processUnicodeText(test.normalrange || "")

        tableRows.push([testName, result, unit, normalRange])
      })

      pdf.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: yPosition,
        margin: { left: leftMargin, right: 210 - rightMargin },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [67, 97, 238],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didDrawPage: (data) => {
          // Add header and footer on every page if withLetterpad
          if (withLetterpad && data.pageNumber > 1) {
            pdf.addImage(headerImage, "PNG", 0, 0, 210, headerHeight)
            pdf.addImage(FooterImage, "PNG", 0, pageHeight - footerHeight, 210, footerHeight)
          }
        },
      })

      // Add consultants at the bottom
      const finalY = pdf.lastAutoTable.finalY + 10
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")

      consultants.forEach((consultant, index) => {
        const xPos = leftMargin + index * 65
        if (consultant[2]) {
          // If image is available
          pdf.addImage(consultant[2], "PNG", xPos, finalY, 15, 15)
        }
        pdf.text(consultant[0], xPos, finalY + 18)
        pdf.setFont("helvetica", "normal")
        pdf.text(consultant[1], xPos, finalY + 22)
        pdf.setFont("helvetica", "bold")
      })

      // Save or return PDF
      const pdfBlob = pdf.output("blob")
      pdf.save(`${patientDetails.patientname}_TestDetails.pdf`)
      toast.success("PDF generated successfully!")
      return pdfBlob
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF.")
      return null
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Registered":
        return "#6c757d"
      case "Sample Collected":
        return "#17a2b8"
      case "Approved":
        return "#28a745"
      case "Partially Approved":
        return "#ffc107"
      case "Dispatched":
        return "#007bff"
      default:
        return "#6c757d"
    }
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <CardHeader>
            <Title>Preetham Hospital - Patient Overview</Title>
          </CardHeader>

          <FiltersContainer>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>From Date</FilterLabel>
                <FilterInput
                  type="date"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>To Date</FilterLabel>
                <FilterInput
                  type="date"
                  value={format(endDate, "yyyy-MM-dd")}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </FilterGroup>
            </FilterRow>

            <FilterRow>
              <SearchFilterGroup>
                <FilterLabel>Search (Patient ID, Patient Name, Barcode)</FilterLabel>
                <SearchInput
                  type="text"
                  placeholder="Search by Patient ID, Patient Name, or Barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchFilterGroup>
            </FilterRow>

            <ButtonContainer>
              <ClearButton onClick={clearFilters}>
                <X size={16} />
                Clear Filters
              </ClearButton>
            </ButtonContainer>
          </FiltersContainer>

          <TableContainer>
            {loading ? (
              <NoData>Loading patient data...</NoData>
            ) : error ? (
              <NoData>{error}</NoData>
            ) : filteredPatients.length === 0 ? (
              <NoData>No patients found matching the criteria.</NoData>
            ) : (
              <Table>
                <TableHead>
                  <tr>
                    <th>Date</th>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Barcode</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {filteredPatients.map((patient, index) => {
                    const patientStatus = statuses[patient.patient_id]?.status || patient.status
                    const isPrintMailEnabled = isPrintAndMailEnabled(patientStatus)

                    return (
                      <tr key={index}>
                        <td>{patient.date}</td>
                        <td>{patient.patient_id}</td>
                        <td>{patient.patient_name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.barcode}</td>
                        <td>
                          <Badge color={getStatusColor(patientStatus)}>{patientStatus}</Badge>
                        </td>
                        <td>
                          <ActionContainer>
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              onClick={() => isPrintMailEnabled && handlePrint(patient, true)}
                              title="Print with Letterpad"
                            >
                              <Printer size={14} />
                              With Letterpad
                            </ActionButton>
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              onClick={() => isPrintMailEnabled && handlePrint(patient, false)}
                              title="Print without Letterpad"
                            >
                              <Printer size={14} />
                              Without Letterpad
                            </ActionButton>
                          </ActionContainer>
                        </td>
                      </tr>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Card>
      </Container>
    </>
  )
}

export default PreethamHospital
