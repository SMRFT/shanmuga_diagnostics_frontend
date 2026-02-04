"use client"

import { useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import JsBarcode from "jsbarcode"
import { format } from "date-fns"
import { Download, RefreshCw, Search, Printer } from "lucide-react"
import { toast } from "react-toastify"
import apiRequest from "../Auth/apiRequest";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f7fb;
  min-height: 100vh;
`

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  p {
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }
`

const FiltersContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
`

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
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
  font-size: 0.85rem;
  color: #495057;
  font-weight: 600;
`

const FilterInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #667eea;
  pointer-events: none;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.variant === "secondary" ? "#6c757d" : "#667eea")};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.variant === "secondary" ? "#5a6268" : "#5568d3")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const TableContainer = styled.div`
  overflow-x: auto;
  padding: 1.5rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  thead {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
  }

  tbody tr {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8f9fa;
    }
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status) {
      case "Registered":
        return "#e7f3ff"
      case "Collected":
        return "#f6ffed"
      case "Received":
        return "#fff7e6"
      case "Tested":
        return "#f9f0ff"
      case "Approved":
        return "#f0f9ff"
      case "Dispatched":
        return "#e6f7ff"
      default:
        return "#f5f5f5"
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Registered":
        return "#1890ff"
      case "Collected":
        return "#52c41a"
      case "Received":
        return "#faad14"
      case "Tested":
        return "#722ed1"
      case "Approved":
        return "#1890ff"
      case "Dispatched":
        return "#13c2c2"
      default:
        return "#666"
    }
  }};
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6c757d;

  p {
    margin: 0.5rem 0;
    font-size: 1rem;
  }
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: #5568d3;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

function PreethamHospitalReport() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(false)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const fetchPatients = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates")
      return
    }

    setLoading(true)
    try {
      const url = `${Labbaseurl}preetham_hospital_report/?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`
      console.log("Fetching dashboard data from:", url)

      const response = await apiRequest(url, "GET")
      setPatients(response.data)
      setFilteredPatients(response.data)
      toast.success(`Loaded ${response.data.length} records`)
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast.error("Failed to load patient data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredPatients(patients)
    } else {
      const lowerQuery = query.toLowerCase()
      const filtered = patients.filter(
        (patient) =>
          patient.patient_id?.toLowerCase().includes(lowerQuery) ||
          patient.patient_name?.toLowerCase().includes(lowerQuery) ||
          patient.barcode?.toLowerCase().includes(lowerQuery)
      )
      setFilteredPatients(filtered)
    }
  }

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true)

      const barcode = patient.barcode || "N/A"
      console.log("Fetching patient details for barcode:", barcode)

      const url = `${Labbaseurl}get_preethampatient_test_details/?barcode=${encodeURIComponent(barcode)}`
      const response = await apiRequest(url, "GET")

      if (!response || !response.data) {
        toast.error("Failed to fetch patient details")
        return
      }

      let patientDetails = response.data

      // If backend returns array → normalize
      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap(
            (record) => record.testdetails || []
          ),
        }
      }

      if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
        toast.error("No test details found for the patient.")
        return
      }

      const unicodeMap = {
        μ: "µ",
        α: "α",
        β: "β",
        γ: "γ",
        δ: "δ",
        Ω: "Ω",
        "²": "²",
        "³": "³",
        "⁴": "⁴",
        "°": "°",
        "±": "±",
        "×": "x",
        "÷": "/",
      }

      const processUnicodeText = (text) => {
        if (!text) return ""
        let processedText = text
        Object.keys(unicodeMap).forEach((unicode) => {
          const regex = new RegExp(unicode, "g")
          processedText = processedText.replace(regex, unicodeMap[unicode])
        })
        return processedText
      }

      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. Vijayan Ph.D.", "Consultant Biochemist"],
      ]

      const patientRefNo = patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || barcode || "N/A"
      const patientRefNoNumber = patientRefNo.split("+")[0] || "N/A"

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

      const leftMargin = 10
      const rightMargin = leftMargin + 190
      const contentWidth = rightMargin - leftMargin
      const headerHeight = 30
      const footerHeight = 20
      const contentYStart = headerHeight + 20
      const signatureHeight = 25
      const disclaimerHeight = withLetterpad ? 0 : 15
      const tableHeaderHeight = 10

      const colWidths = [
        contentWidth * 0.28,
        contentWidth * 0.12,
        contentWidth * 0.05,
        contentWidth * 0.13,
        contentWidth * 0.1,
        contentWidth * 0.17,
        contentWidth * 0.15,
      ]

      const leftDetails = [
        { label: "Reg.ID", value: patientDetails.patient_id || "N/A" },
        { label: "Name", value: patientDetails.patientname || "No name provided" },
        {
          label: "Age/Gender",
          value: `${patientDetails.age || "N/A"} ${patientDetails.age_type || ""}/ ${patientDetails.gender || "N/A"}`,
        },
        { label: "Referral", value: patientDetails.refby || "SELF" },
        { label: "Branch", value: patientDetails.branch || "N/A" },
        { label: "Source", value: patientDetails.B2B || "N/A" },
      ]

      const rightDetails = [
        {
          label: "Collected On",
          value: patientDetails.testdetails[0]?.samplecollected_time
            ? format(new Date(patientDetails.testdetails[0].samplecollected_time), "dd MMM yy / HH:mm")
            : "N/A",
        },
        {
          label: "Received On",
          value: patientDetails.testdetails[0]?.received_time
            ? format(new Date(patientDetails.testdetails[0].received_time), "dd MMM yy / HH:mm")
            : "N/A",
        },
        {
          label: "Reported Date",
          value: format(new Date(), "dd MMM yy / hh:mm"),
        },
        { label: "Patient Ref.No", value: patientRefNoNumber },
      ]

      const calculateMaxLabelWidth = (details) => {
        const tempDoc = new jsPDF()
        return Math.max(...details.map((item) => tempDoc.getTextWidth(item.label)))
      }

      const doc = new jsPDF()
      let pageCount = 1
      let isTableStarted = false

      const addPatientInfo = (yPos) => {
        const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails)
        const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails)
        const centerPoint = (leftMargin + rightMargin) / 2
        const leftLabelX = leftMargin
        const leftColonX = leftLabelX + leftMaxLabelWidth + 2
        const leftValueX = leftColonX + 3
        const rightLabelX = centerPoint + 28
        const rightColonX = rightLabelX + rightMaxLabelWidth + 2
        const rightValueX = rightColonX + 1

        doc.setFontSize(10)
        let patientInfoY = yPos

        for (let i = 0; i < leftDetails.length; i++) {
          const left = leftDetails[i]
          const right = rightDetails[i]

          doc.setFont("helvetica", "bold")
          doc.text(left.label, leftLabelX, patientInfoY)
          doc.text(":", leftColonX, patientInfoY)
          doc.setFont("helvetica", "normal")
          doc.text(left.value, leftValueX, patientInfoY)

          if (right) {
            doc.setFont("helvetica", "bold")
            doc.text(right.label, rightLabelX, patientInfoY)
            doc.text(":", rightColonX, patientInfoY)
            doc.setFont("helvetica", "normal")
            doc.text(right.value, rightValueX, patientInfoY)

            if (right.label === "Patient Ref.No" && patientRefNoNumber !== "N/A" && barcodeImage) {
              doc.addImage(
                barcodeImage,
                "PNG",
                rightValueX + doc.getTextWidth(right.value) + 2,
                patientInfoY - 2,
                25,
                8,
              )
            }
          }

          patientInfoY += 5
        }

        return patientInfoY
      }

      const addHeaderFooter = () => {
        if (withLetterpad) {
          doc.setFontSize(8)
          doc.setFont("helvetica", "normal")
          doc.text("PREETHAM HOSPITAL", leftMargin, 15)
        } else {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.text("Sample Processed at SHANMUGA HOSPITAL", leftMargin, 15)
        }
      }

      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0
        const splitText = doc.splitTextToSize(text, maxWidth)
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight)
        })
        return splitText.length * lineHeight
      }

      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height
        const signaturesY = pageHeight - footerHeight - signatureHeight - disclaimerHeight - 10

        const signatureWidth = 35
        const availableWidth = contentWidth - (signatureWidth / 2) * 2
        const signatureSpacing = availableWidth / (consultants.length - 1)

        consultants.forEach((consultant, index) => {
          const xPosition = leftMargin + index * signatureSpacing
          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          doc.text(consultant[0], xPosition, signaturesY + 15)
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
          doc.text(consultant[1], xPosition, signaturesY + 20)
        })

        if (!withLetterpad) {
          const disclaimerY = pageHeight - footerHeight - disclaimerHeight
          doc.setFontSize(8)
          doc.setFont("helvetica", "italic")
          doc.text("Sample Processed at SHANMUGA HOSPITAL", leftMargin, disclaimerY, {
            maxWidth: contentWidth,
            align: "center",
          })
        }
      }

      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height
        const footerStart = pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12)

        if (yPos + estimatedHeight >= footerStart) {
          addSignatures()
          doc.addPage()
          pageCount++
          addHeaderFooter()

          let newYPos = contentYStart
          newYPos = addPatientInfo(newYPos)

          if (isTableStarted) {
            newYPos = drawTableHeader(newYPos)
          }

          return newYPos
        }
        return yPos
      }

      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) return null

        if (reference.includes("-")) {
          const [min, max] = reference.split("-").map((v) => Number.parseFloat(v))
          if (!isNaN(min) && !isNaN(max)) {
            if (numValue < min) return "L"
            if (numValue > max) return "H"
          }
        }
        return null
      }

      const drawTableHeader = (yPos) => {
        doc.line(leftMargin, yPos, rightMargin, yPos)
        yPos += 5

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")

        const headers = ["Test", "Specimen", "", "Result", "Units", "Reference Value", "Method"]

        let xPos = leftMargin

        headers.forEach((header, index) => {
          if (header) {
            doc.text(header, xPos, yPos)
          }
          xPos += colWidths[index]
        })

        yPos += 3
        doc.line(leftMargin, yPos, rightMargin, yPos)
        yPos += 5

        return yPos
      }

      addHeaderFooter()

      let currentYPosition = addPatientInfo(contentYStart)

      if (patientDetails.testdetails && patientDetails.testdetails.length) {
        isTableStarted = true
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight)

        let yPos = currentYPosition
        yPos = drawTableHeader(yPos)

        const testsByDepartment = patientDetails.testdetails.reduce((acc, test) => {
          ; (acc[test.department] = acc[test.department] || []).push(test)
          return acc
        }, {})

        Object.keys(testsByDepartment).forEach((department) => {
          const departmentHeight = 25
          yPos = checkForNewPage(yPos, departmentHeight)

          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          const textWidth = doc.getTextWidth(department.toUpperCase())
          const centerX = leftMargin + contentWidth / 2
          doc.text(department.toUpperCase(), centerX, yPos, { align: "center" })
          doc.line(centerX - textWidth / 2, yPos + 2, centerX + textWidth / 2, yPos + 2)

          yPos += 10

          testsByDepartment[department].forEach((test) => {
            const testHeaderHeight = 20
            yPos = checkForNewPage(yPos, testHeaderHeight)

            doc.setFontSize(10)

            let xPos = leftMargin

            doc.setFont("helvetica", "bold")
            const testNameText = test.testname || ""
            const testNameHeight = wrapText(doc, testNameText, colWidths[0] - 2, xPos, yPos, 4)
            xPos += colWidths[0]

            doc.setFont("helvetica", "normal")

            const specimenHeight = wrapText(doc, test.specimen_type || "", colWidths[1] - 2, xPos, yPos, 4)
            xPos += colWidths[1]

            xPos += colWidths[2]

            const statusIndicator = test.isHigh ? "H" : test.isLow ? "L" : getHighLowStatus(test.value, test.reference_range)

            const valueText = test.value || ""

            if (statusIndicator) {
              doc.setFont("helvetica", "bold")
              if (statusIndicator === "H") {
                doc.setTextColor(255, 0, 0)
              } else if (statusIndicator === "L") {
                doc.setTextColor(0, 0, 255)
              }
              const valueHeight = wrapText(doc, valueText, colWidths[3] - 2, xPos, yPos, 4)
              doc.setTextColor(0, 0, 0)
              doc.setFont("helvetica", "normal")
            } else {
              const valueHeight = wrapText(doc, valueText, colWidths[3] - 2, xPos, yPos, 4)
            }
            xPos += colWidths[3]

            const unitHeight = wrapText(doc, processUnicodeText(test.unit || ""), colWidths[4] - 2, xPos, yPos, 4)
            xPos += colWidths[4]

            const referenceRangeHeight = wrapText(doc, test.reference_range || "", colWidths[5] - 2, xPos, yPos, 4)
            xPos += colWidths[5]

            doc.setTextColor(0, 0, 0)

            yPos += Math.max(testNameHeight, specimenHeight, 4, 4, unitHeight, referenceRangeHeight) + 2
          })

          yPos += 5
        })
      }

      addSignatures()

      const fileName = `${patientDetails.patient_id || "Patient"}_Report_${format(new Date(), "ddMMyyyy")}.pdf`
      doc.save(fileName)

      setLoading(false)
      toast.success("Report downloaded successfully")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate report")
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFromDate(new Date().toISOString().split("T")[0])
    setToDate(new Date().toISOString().split("T")[0])
    setSearchQuery("")
    setPatients([])
    setFilteredPatients([])
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <div>
            <h1>Preetham Hospital Report</h1>
            <p>View and manage hospital billing records</p>
          </div>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>From Date</FilterLabel>
              <FilterInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>To Date</FilterLabel>
              <FilterInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Search (Patient ID / Name / Barcode)</FilterLabel>
              <SearchInputWrapper>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Enter patient ID, name, or barcode..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </SearchInputWrapper>
            </FilterGroup>
          </FilterRow>

          <ButtonContainer>
            <Button onClick={fetchPatients} disabled={loading}>
              {loading ? <LoadingSpinner /> : <RefreshCw size={18} />}
              Load Data
            </Button>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </ButtonContainer>
        </FiltersContainer>
      </Card>

      {filteredPatients.length === 0 && !loading && (
        <Card>
          <EmptyState>
            <p>No records found. Please adjust your filters and try again.</p>
          </EmptyState>
        </Card>
      )}

      {filteredPatients.length > 0 && (
        <Card>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Barcode</th>
                  <th>Age/Gender</th>
                  <th>Tests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, idx) => (
                  <tr key={idx}>
                    <td>{patient.date}</td>
                    <td>{patient.bill_no}</td>
                    <td>{patient.patient_id}</td>
                    <td>{patient.patient_name}</td>
                    <td>{patient.barcode}</td>
                    <td>
                      {patient.age}/{patient.gender}
                    </td>
                    <td>{patient.no_of_tests}</td>
                    <td>₹{patient.total_amount}</td>
                    <td>
                      <StatusBadge status={patient.status}>{patient.status}</StatusBadge>
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton
                          onClick={() => handlePrint(patient, true)}
                          disabled={loading}
                          title="Print with letterpad"
                        >
                          <Printer size={14} />
                          With Pad
                        </ActionButton>
                        <ActionButton
                          onClick={() => handlePrint(patient, false)}
                          disabled={loading}
                          title="Print without letterpad (SHANMUGA HOSPITAL)"
                        >
                          <Printer size={14} />
                          Without Pad
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Container>
  )
}

export default PreethamHospitalReport
