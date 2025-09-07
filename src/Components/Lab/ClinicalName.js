import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { Search } from "lucide-react";

// Styled Components
const Container = styled.div`
  position: relative;
  width: 100%;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  color: #555;
`;

const RequiredStar = styled.span`
  color: #e53e3e;
  margin-left: 4px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.isError ? "#e53e3e" : "#e0e0e0")};
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #db9bb9;
    box-shadow: 0 0 0 3px rgba(219, 155, 185, 0.1);
  }

  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9e9e9e;
  pointer-events: none;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 0.25rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #db9bb9;
    border-radius: 10px;
  }
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f9f0f4;
  }

  .location {
    color: #9e9e9e;
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`;

const EmptyItem = styled.div`
  padding: 0.75rem 1rem;
  color: #9e9e9e;
  text-align: center;
`;

// Main Component
const ModernClinicalName = ({ isB2BEnabled, onClinicalNameSelect }) => {
  const [clinicalNames, setClinicalNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({ B2B: "" });
  const [touched, setTouched] = useState(false);
  const [previousB2BState, setPreviousB2BState] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Check if field is required and empty
  const isError = isB2BEnabled && touched && !formData.B2B;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        if (isB2BEnabled) {
          setTouched(true);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isB2BEnabled]);

  // Fetch clinical names on component mount
  useEffect(() => {
    axios
      .get(`${Labbaseurl}clinical_name/`)
      .then((response) => {
        setClinicalNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clinical names:", error);
      });
  }, [Labbaseurl]);

  // Track B2B state changes and handle clearing/resetting appropriately
  useEffect(() => {
    // First time initialization - don't do anything special
    if (previousB2BState === null) {
      setPreviousB2BState(isB2BEnabled);
      return;
    }

    // Handle B2B toggle from enabled to disabled
    if (previousB2BState && !isB2BEnabled) {
      setSearchTerm("");
      setFormData({ B2B: "" });
      setTouched(false);
      if (onClinicalNameSelect) {
        onClinicalNameSelect("", "", "");
      }
    }

    // Handle B2B toggle from disabled to enabled
    if (!previousB2BState && isB2BEnabled) {
      setTouched(false); // Reset touched state when newly enabled
    }

    // Update the previous state tracker
    setPreviousB2BState(isB2BEnabled);
  }, [isB2BEnabled, onClinicalNameSelect, previousB2BState]);

  // Filtered Clinical Names Based on Search Term
  const filteredClinicalNames = clinicalNames.filter((name) =>
    name.clinicalname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clinical name selection
  const handleClinicalOptionChange = (selectedName) => {
    setFormData({ ...formData, B2B: selectedName });
    setSearchTerm(selectedName);
    setShowDropdown(false);
    setTouched(true);

    // Find the selected clinical name object
    const selectedClinical = clinicalNames.find(
      (name) => name.clinicalname === selectedName
    );

    if (selectedClinical && onClinicalNameSelect) {
      onClinicalNameSelect(
        selectedName,
        selectedClinical.referrerCode,
        selectedClinical.salesMapping,
        selectedClinical.phone,
        selectedClinical.email
      );
    }
  };

  // Handle input blur
  const handleBlur = () => {
    if (isB2BEnabled) {
      setTouched(true);
    }
  };

  return (
    <Container>
      <LabelContainer>
        <Label>Clinical Name</Label>
        {isB2BEnabled && <RequiredStar>*</RequiredStar>}
      </LabelContainer>
      <InputContainer>
        <SearchIcon>
          <Search size={16} />
        </SearchIcon>
        <SearchInput
          ref={searchInputRef}
          type="text"
          placeholder="Search Clinical Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          disabled={!isB2BEnabled}
          isError={isError}
        />
      </InputContainer>

      {isError && <ErrorMessage>Please select a clinical name</ErrorMessage>}

      {showDropdown && (
        <Dropdown ref={dropdownRef}>
          {filteredClinicalNames.length === 0 ? (
            <EmptyItem>No results found</EmptyItem>
          ) : (
            filteredClinicalNames.map((name, index) => (
              <DropdownItem
                key={index}
                onClick={() => handleClinicalOptionChange(name.clinicalname)}
              >
                <span>{name.clinicalname}</span>
                {name.location && (
                  <span className="location">({name.location})</span>
                )}
              </DropdownItem>
            ))
          )}
        </Dropdown>
      )}
    </Container>
  );
};

export default ModernClinicalName;
