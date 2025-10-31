"use client"

import { useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import JsBarcode from "jsbarcode"
import { format } from "date-fns"
import { Download, RefreshCw } from "lucide-react"
import { toast } from "react-toastify"

const Container = styled.div`
  max-width: 1200px;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;

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

function PreethamHospitalReport() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const fetchPatients = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates")
      return
    }

    setLoading(true)
    try {
      const url = `${Labbaseurl}preetham_hospital_report/?from_date=${fromDate}&to_date=${toDate}`
      const response = await axios.get(url)
      setPatients(response.data)
      toast.success(`Loaded ${response.data.length} patients`)
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast.error("Failed to load patient data")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true)

      const barcode = patient.barcode || "N/A"
      console.log("[v0] Fetching patient details for barcode:", barcode)

      const response = await axios.get(`${Labbaseurl}get_patient_test_details/?barcode=${barcode}`)

      if (!response.data) {
        console.error("[v0] Failed to fetch patient details:", response.error)
        toast.error(response.error || "Failed to fetch patient details")
        setLoading(false)
        return null
      }

      console.log("[v0] API Response:", response.data)
      let patientDetails = response.data
      if (Array.isArray(response.data)) {
        patientDetails = {
          ...response.data[0],
          testdetails: response.data.flatMap((record) => record.testdetails || []),
        }
      }

      console.log("[v0] Processed Patient Details:", patientDetails)
      if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
        console.error("[v0] No test details found for the patient.")
        toast.error("No test details found for the patient.")
        setLoading(false)
        return null
      }

      // Unicode character mapping for medical units
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
        "\\u03bc": "µ",
        "\\u00b5": "µ",
        "\\u00b0": "°",
        "\\u00b1": "±",
        "\\u00b2": "²",
        "\\u00b3": "³",
      }

      const processUnicodeText = (text) => {
        if (!text) return ""
        let processedText = text
        processedText = processedText.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          const char = String.fromCharCode(Number.parseInt(hex, 16))
          return unicodeMap[char] || char
        })
        Object.keys(unicodeMap).forEach((unicode) => {
          const regex = new RegExp(unicode, "g")
          processedText = processedText.replace(regex, unicodeMap[unicode])
        })
        return processedText
      }

      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A"
        const numberPart = refNo.split("+")[0]
        return numberPart
      }

      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. Vijayan Ph.D.", "Consultant Biochemist"],
      ]

      const patientRefNo = patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || barcode || "N/A"
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo)

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
      const disclaimerHeight = 0
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
          value: format(new Date(patientDetails.testdetails[0].samplecollected_time), "dd MMM yy / HH:mm") || "N/A",
        },
        {
          label: "Received On",
          value: format(new Date(patientDetails.testdetails[0].received_time), "dd MMM yy / HH:mm") || "N/A",
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
          doc.setFont("helvetica", "bold")
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
                rightValueX + doc.getTextWidth(right.value) - 10,
                patientInfoY + 2,
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
        const signaturesY = pageHeight - footerHeight - signatureHeight - 10
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
        } else if (reference.includes("<")) {
          const max = Number.parseFloat(reference.replace("<", ""))
          if (!isNaN(max) && numValue > max) return "H"
        } else if (reference.includes(">")) {
          const min = Number.parseFloat(reference.replace(">", ""))
          if (!isNaN(min) && numValue < min) return "L"
        }

        return null
      }

      const drawArrowSymbol = (doc, x, y, direction) => {
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)

        if (direction === "up") {
          doc.line(x, y, x + 1, y - 1)
          doc.line(x + 1, y - 1, x + 2, y)
          doc.line(x + 1, y - 1, x + 1, y + 2)
        } else if (direction === "down") {
          doc.line(x, y, x + 1, y + 1)
          doc.line(x + 1, y + 1, x + 2, y)
          doc.line(x + 1, y + 1, x + 1, y - 2)
        }
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

      if (patientDetails.testdetails.length) {
        isTableStarted = true
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight)

        let yPos = currentYPosition
        yPos = drawTableHeader(yPos)

        const testsByDepartment = patientDetails.testdetails.reduce((acc, test) => {
          ;(acc[test.department] = acc[test.department] || []).push(test)
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
            const parametersBySubtitle = {}

            if (test.parameters && test.parameters.length > 0) {
              test.parameters.forEach((param) => {
                const subtitle = param.sub_title || ""
                if (!parametersBySubtitle[subtitle]) {
                  parametersBySubtitle[subtitle] = []
                }
                parametersBySubtitle[subtitle].push(param)
              })
            }

            const testHeaderHeight = 20
            yPos = checkForNewPage(yPos, testHeaderHeight)

            doc.setFontSize(10)

            let xPos = leftMargin

            doc.setFont("helvetica", "bold")
            const testNameText = test.testname
            const testNameHeight = wrapText(doc, testNameText, colWidths[0] - 2, xPos, yPos, 4)
            xPos += colWidths[0]

            doc.setFont("helvetica", "normal")

            const specimenHeight = wrapText(doc, test.specimen_type || "", colWidths[1] - 2, xPos, yPos, 4)
            xPos += colWidths[1]

            xPos += colWidths[2]

            const statusIndicator = test.isHigh
              ? "H"
              : test.isLow
                ? "L"
                : getHighLowStatus(test.value, test.reference_range)

            const valueText = test.value || ""

            if (statusIndicator) {
              doc.setFont("helvetica", "bold")
              if (statusIndicator === "H") {
                doc.setTextColor(255, 0, 0)
              } else if (statusIndicator === "L") {
                doc.setTextColor(0, 0, 255)
              }
              const valueHeight = wrapText(doc, valueText, colWidths[3] - 2, xPos, yPos, 4)

              const valueWidth = doc.getTextWidth(valueText)
              if (statusIndicator === "H") {
                drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "up")
              } else if (statusIndicator === "L") {
                drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "down")
              }
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
            const methodText = (test.method || "").replace(/\bMethod\b/i, "").trim()
            const methodHeight = wrapText(doc, methodText, colWidths[6] - 2, xPos, yPos, 4)

            const maxContentHeight = Math.max(
              testNameHeight,
              specimenHeight,
              referenceRangeHeight,
              methodHeight,
              unitHeight,
            )
            yPos += Math.max(maxContentHeight, 6) + 2

            doc.setFont("helvetica", "normal")
            doc.setTextColor(0, 0, 0)

            Object.keys(parametersBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                const subtitleWithParamHeight = 25
                yPos = checkForNewPage(yPos, subtitleWithParamHeight)

                doc.setFont("helvetica", "bold")
                doc.setFontSize(10)
                doc.text(subtitle, leftMargin, yPos)
                yPos += 6
              }

              parametersBySubtitle[subtitle].forEach((currentTest) => {
                const estimatedHeight = 18
                yPos = checkForNewPage(yPos, estimatedHeight)

                doc.setFontSize(10)
                let xPos = leftMargin

                doc.setFont("helvetica", "normal")
                const testNameText = currentTest.name
                const testNameHeight = wrapText(doc, testNameText, colWidths[0] - 2, xPos, yPos, 4)
                xPos += colWidths[0]

                const specimenHeight = wrapText(doc, currentTest.specimen_type || "", colWidths[1] - 2, xPos, yPos, 4)
                xPos += colWidths[1]

                xPos += colWidths[2]

                const statusIndicator = currentTest.isHigh
                  ? "H"
                  : currentTest.isLow
                    ? "L"
                    : getHighLowStatus(currentTest.value, currentTest.reference_range)

                const valueText = currentTest.value || ""
                let valueHeight = 0

                if (statusIndicator) {
                  doc.setFont("helvetica", "bold")
                  if (statusIndicator === "H") {
                    doc.setTextColor(255, 0, 0)
                  } else if (statusIndicator === "L") {
                    doc.setTextColor(0, 0, 255)
                  }
                  valueHeight = wrapText(doc, valueText, colWidths[3] - 2, xPos, yPos, 4)

                  const valueWidth = doc.getTextWidth(valueText)
                  if (statusIndicator === "H") {
                    drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "up")
                  } else if (statusIndicator === "L") {
                    drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "down")
                  }
                  doc.setTextColor(0, 0, 0)
                  doc.setFont("helvetica", "normal")
                } else {
                  valueHeight = wrapText(doc, valueText, colWidths[3] - 2, xPos, yPos, 4)
                }
                xPos += colWidths[3]

                const unitHeight = wrapText(
                  doc,
                  processUnicodeText(currentTest.unit || ""),
                  colWidths[4] - 2,
                  xPos,
                  yPos,
                  4,
                )
                xPos += colWidths[4]

                const referenceRangeHeight = wrapText(
                  doc,
                  currentTest.reference_range || "",
                  colWidths[5] - 2,
                  xPos,
                  yPos,
                  4,
                )
                xPos += colWidths[5]

                const methodText = (currentTest.method || "").replace(/\bMethod\b/i, "").trim()
                const methodHeight = wrapText(doc, methodText, colWidths[6] - 2, xPos, yPos, 4)

                const maxContentHeight = Math.max(
                  testNameHeight,
                  specimenHeight,
                  valueHeight,
                  unitHeight,
                  referenceRangeHeight,
                  methodHeight,
                )
                yPos += Math.max(maxContentHeight, 6) + 2

                doc.setFont("helvetica", "normal")
                doc.setTextColor(0, 0, 0)
              })
            })

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text(`Verified by: ${test.verified_by || "N/A"}`, leftMargin, yPos)
            yPos += 8

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
          })

          yPos += 4
        })

        currentYPosition = yPos
      }

      isTableStarted = false

      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height
        const footerStart = pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12)

        if (currentYPosition + 10 >= footerStart) {
          addSignatures()
          doc.addPage()
          pageCount++
          addHeaderFooter()
          return addPatientInfo(contentYStart)
        }
        return currentYPosition
      }

      currentYPosition = ensureSpaceForFooter(currentYPosition)

      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      const centerX = leftMargin + contentWidth / 2
      doc.text("**End of the Report**", centerX, currentYPosition, { align: "center" })

      addSignatures()

      const finalPageCount = pageCount

      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i)
        const pageHeight = doc.internal.pageSize.height
        const pageNumberY = pageHeight - footerHeight - 10
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        const centerX = leftMargin + contentWidth / 2
        doc.text(`Page ${i} of ${finalPageCount}`, centerX, pageNumberY, { align: "center" })
      }

      const patientID = patientDetails.patient_id || "Unknown"
      const pdfFileName = `PatientReport_${patientID}.pdf`
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)

      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = pdfFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(pdfUrl)

      setLoading(false)
      toast.success("PDF downloaded successfully")
      return pdfBlob
    } catch (error) {
      console.error("[v0] Error while generating the PDF:", error)
      toast.error("An unexpected error occurred while generating the PDF")
      setLoading(false)
      return null
    }
  }

  const generateBulkReport = () => {
    if (patients.length === 0) {
      toast.error("No patients to export")
      return
    }

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 10

      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("PREETHAM HOSPITAL - Patient Report", margin, 15)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Date Range: ${fromDate} to ${toDate}`, margin, 22)
      doc.text(`Total Patients: ${patients.length}`, margin, 28)

      const tableData = patients.map((p) => [
        p.date,
        p.patient_id,
        p.patient_name,
        p.age,
        p.gender,
        p.no_of_tests,
        `₹${p.total_amount}`,
        p.status,
      ])

      doc.autoTable({
        head: [["Date", "Patient ID", "Name", "Age", "Gender", "Tests", "Amount", "Status"]],
        body: tableData,
        startY: 35,
        margin: margin,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [102, 126, 234], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 251] },
      })

      doc.save(`PreethamHospital_Report_${fromDate}_to_${toDate}.pdf`)
      toast.success("Bulk report downloaded successfully")
    } catch (error) {
      console.error("Error generating bulk report:", error)
      toast.error("Failed to generate bulk report")
    }
  }

  return (
    <Container>
      <Card>
        <CardHeader>
          <h1>PREETHAM HOSPITAL - Patient Report</h1>
          <p>Filter and view patient records by date range</p>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </FilterGroup>
          </FilterRow>

          <ButtonContainer>
            <Button onClick={fetchPatients} disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner /> Loading...
                </>
              ) : (
                <>
                  <RefreshCw size={18} /> Load Patients
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={generateBulkReport} disabled={patients.length === 0}>
              <Download size={18} /> Download Report
            </Button>
          </ButtonContainer>
        </FiltersContainer>
      </Card>

      {patients.length === 0 ? (
        <Card>
          <EmptyState>
            <p>No patients found. Select dates and click "Load Patients" to begin.</p>
          </EmptyState>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Tests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index}>
                    <td>{patient.date}</td>
                    <td>{patient.patient_id}</td>
                    <td>{patient.patient_name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.no_of_tests}</td>
                    <td>₹{patient.total_amount}</td>
                    <td>
                      <StatusBadge status={patient.status}>{patient.status}</StatusBadge>
                    </td>
                    <td>
                      <Button
                        onClick={() => handlePrint(patient)}
                        style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                      >
                        <Download size={16} /> PDF
                      </Button>
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
