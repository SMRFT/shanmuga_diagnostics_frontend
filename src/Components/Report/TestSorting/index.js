import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  X,
  Printer,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Flag,
  MessageCircle,
} from "lucide-react";

import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Title,
  SearchContainer,
  SearchInput,
  SearchIcon,
  TestList,
  TestItem,
  TestInfo,
  CheckboxContainer,
  TestName,
  DispatchButton,
  ModalFooter,
  SelectAllContainer,
  ButtonGroup,
  Button,
  SelectedCount,
  PrintOptions,
  PrintOption,
  LoadingOverlay,
  LoadingSpinner,
  LoadingText,
} from "./styles";
import useTestSortingData from "./useTestSortingData";
import generateSortedTestsPdf from "./generateSortedTestsPdf";

const TestSorting = ({ patient, onClose }) => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);

  const {
    tests,
    isLoading,
    loadingMessage,
    dispatchedTests,
    handleDispatchTest,
    handleDispatchAll,
  } = useTestSortingData({ patient, Labbaseurl });

  const handleSelectTest = (test) => {
    const isMolBio = test.department === "Molecular Biology";

    setSelectedTests((prev) => {
      const isSelected = prev.some((t) => t.test_id === test.test_id);

      if (isSelected) {
        return prev.filter((t) => t.test_id !== test.test_id);
      }

      if (isMolBio) {
        // Select this Mol Bio test only — clear everything else
        return [test];
      }

      // Non-Mol Bio selected — clear any Mol Bio and add this one
      const withoutMolBio = prev.filter(
        (t) => t.department !== "Molecular Biology",
      );
      return [...withoutMolBio, test];
    });
  };

  const handleSelectAll = () => {
    const nonMolBioTests = tests.filter(
      (t) => t.department !== "Molecular Biology",
    );
    if (selectAllChecked) {
      setSelectedTests([]);
    } else {
      setSelectedTests([...nonMolBioTests]);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  // PDF generation lives in its own module — this is just a thin call-through
  // so the rest of the component (and the WhatsApp-share flow below) can keep
  // calling `handlePrint(withLetterpad)`.
  const handlePrint = (withLetterpad) =>
    generateSortedTestsPdf(selectedTests, tests, patient, withLetterpad, Labbaseurl);

  const handleWhatsAppShare = async (patient, withLetterpad = true) => {
    if (!patient || !patient.phone) {
      toast.error("Patient phone number is missing");
      return;
    }

    const phoneNumber = patient.phone.startsWith("+91")
      ? patient.phone.replace("+", "")
      : `91${patient.phone}`;

    try {
      const pdfBlob = await handlePrint(withLetterpad); // Generate PDF (no download)
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }

      const pdfName = `${patient.patient_name || "Patient"}_TestDetails.pdf`;
      const pdfFile = new File([pdfBlob], pdfName, { type: "application/pdf" });

      // Upload PDF to server
      const formData = new FormData();
      formData.append("file", pdfFile);

      const uploadResponse = await axios.post(
        `${Labbaseurl}upload-pdf/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const fileUrl = uploadResponse.data.file_url;
      if (!fileUrl) {
        toast.error("File upload failed");
        return;
      }

      // Call Django proxy instead of Botify directly
      const res = await axios.post(`${Labbaseurl}send-whatsapp/`, {
        patient_name: patient.patient_name || "Valued Patient",
        phone: phoneNumber,
        collection_time: patient.collection_time || "N/A",
        collected_date: patient.collected_date || "N/A",
        file_url: fileUrl,
        pdf_name: pdfName,
        patient_id: patient.patient_id,
      });

      if (res.data.success) {
        toast.success("WhatsApp PDF message sent successfully!");
      } else {
        toast.error("Failed to send WhatsApp template message.");
        console.error("Backend error:", res.data.error);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  const filteredTests = tests.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ModalOverlay>
      <ModalContent>
        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>{loadingMessage}</LoadingText>
          </LoadingOverlay>
        )}
        <ModalHeader>
          <Title>Sort and Select Tests</Title>
        </ModalHeader>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
        </SearchContainer>

        <SelectAllContainer>
          <CheckboxContainer
            checked={selectAllChecked}
            onClick={handleSelectAll}
          >
            {selectAllChecked && <Check size={14} color="white" />}
          </CheckboxContainer>
          <span>Select All</span>
          {selectedTests.length > 0 && (
            <SelectedCount>{selectedTests.length} selected</SelectedCount>
          )}
          <DispatchButton
            style={{ marginLeft: "auto" }}
            dispatched={tests.every((t) => dispatchedTests.has(t.test_id))}
            disabled={tests.every((t) => dispatchedTests.has(t.test_id))}
            onClick={handleDispatchAll}
            title="Dispatch all undispatched tests"
          >
            <Flag size={14} />
            {tests.every((t) => dispatchedTests.has(t.test_id))
              ? "All Dispatched"
              : "Dispatch All"}
          </DispatchButton>
        </SelectAllContainer>

        <TestList>
          {filteredTests.length === 0 ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#888" }}
            >
              No tests found matching your search
            </div>
          ) : (
            filteredTests.map((test) => {
              const isSelected = selectedTests.some(
                (t) => t.test_id === test.test_id,
              );
              const isDispatched = dispatchedTests.has(test.test_id);

              return (
                <TestItem
                  key={test.test_id}
                  onClick={() => handleSelectTest(test)}
                >
                  <TestInfo>
                    <CheckboxContainer checked={isSelected}>
                      {isSelected && <Check size={14} color="white" />}
                    </CheckboxContainer>
                    <TestName selected={isSelected}>
                      {test.test_name}
                      {test.NABL && <span className="nabl-asterisk">*</span>}
                    </TestName>
                  </TestInfo>
                  <DispatchButton
                    dispatched={isDispatched}
                    onClick={(e) => handleDispatchTest(test, e)}
                    disabled={isDispatched}
                    title={
                      isDispatched ? "Already Dispatched" : "Dispatch Test"
                    }
                  >
                    <Flag size={14} />
                    {isDispatched ? "Dispatched" : "Dispatch"}
                  </DispatchButton>
                </TestItem>
              );
            })
          )}
        </TestList>

        <ModalFooter>
          <Button secondary onClick={onClose}>
            <X size={16} />
            Close
          </Button>

          <ButtonGroup>
            {/* WhatsApp Dropdown */}
            <div style={{ position: "relative" }}>
              <Button
                primary
                disabled={selectedTests.length === 0}
                onClick={() => {
                  setShowPrintOptions(false);
                  setShowWhatsAppOptions(!showWhatsAppOptions);
                }}
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={16} />
                WhatsApp
                {showWhatsAppOptions ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>

              <PrintOptions show={showWhatsAppOptions}>
                <PrintOption
                  onClick={() => {
                    handleWhatsAppShare(patient, true);
                    setShowWhatsAppOptions(false);
                  }}
                >
                  <MessageCircle size={16} />
                  Send with Letterhead
                </PrintOption>
                <PrintOption
                  onClick={() => {
                    handleWhatsAppShare(patient, false);
                    setShowWhatsAppOptions(false);
                  }}
                >
                  <MessageCircle size={16} />
                  Send without Letterhead
                </PrintOption>
              </PrintOptions>
            </div>
            {/* Print Dropdown */}
            <div style={{ position: "relative" }}>
              <Button
                primary
                disabled={selectedTests.length === 0}
                onClick={() => {
                  setShowWhatsAppOptions(false);
                  setShowPrintOptions(!showPrintOptions);
                }}
              >
                <Printer size={16} />
                Print Options
                {showPrintOptions ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>

              <PrintOptions show={showPrintOptions}>
                <PrintOption onClick={() => handlePrint(true)}>
                  <Printer size={16} />
                  Print with Letterhead
                </PrintOption>
                <PrintOption onClick={() => handlePrint(false)}>
                  <Printer size={16} />
                  Print without Letterhead
                </PrintOption>
              </PrintOptions>
            </div>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TestSorting;
