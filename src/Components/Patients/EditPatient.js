import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import apiRequest from "../Auth/apiRequest";
import {
  FaUser,
  FaSearch,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaSave,
  FaTimes,
  FaIdCard,
  FaEdit,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  padding: 30px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #f4f7f6;
  animation: ${fadeIn} 0.4s ease-out;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);

  h2 {
    margin: 0;
    color: #7c70e7;
    font-size: 28px;
    font-weight: 700;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e0e6ed;
  border-radius: 30px;
  padding: 5px 20px;
  width: 350px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px;
    font-size: 15px;
    outline: none;
    color: #333;
  }

  svg {
    color: #7f8c8d;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const TableScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #edf2f9;
  }

  th {
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    color: #334155;
    font-size: 15px;
  }

  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: #f8fafc;
    }
  }
`;

const ActionButton = styled.button`
  background: #e0e7ff;
  color: #4f46e5;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #4f46e5;
    color: white;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #edf2f9;
  flex-shrink: 0;

  .page-info {
    color: #64748b;
    font-size: 14px;
  }

  .controls {
    display: flex;
    gap: 10px;

    button {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      color: #334155;
      font-weight: 500;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #f1f5f9;
        border-color: #94a3b8;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  padding: 25px 30px 15px 30px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: #7c70e7;
    font-size: 28px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  button {
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #ef4444;
    }
  }
`;

const ModalBody = styled.div`
  padding: 30px;
  overflow-y: auto;
  flex: 1;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

// Form Styles
const Fieldset = styled.fieldset`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  background: #f8fafc;

  legend {
    font-size: 16px;
    font-weight: 600;
    color: #475569;
    padding: 0 15px;
    background: white;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 8px;
    font-weight: 700;
    color: #6b46c1;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: #6b46c1;
    }
  }

  input, select, textarea {
    padding: 10px 15px;
    border: 1.5px solid #bfdbfe;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    background: white;
    color: #334155;

    &:focus {
      border-color: #7c70e7;
      box-shadow: 0 0 0 3px rgba(124, 112, 231, 0.15);
      outline: none;
    }
    
    &:disabled {
      background: #f1f5f9;
      cursor: not-allowed;
      color: #94a3b8;
    }
  }
`;

const RequiredIndicator = styled.span`
  color: #f472b6;
  margin-left: 4px;
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background: #f8fafc;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &.primary {
    background: #4f46e5;
    color: white;

    &:hover {
      background: #4338ca;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
    }
  }

  &.secondary {
    background: white;
    color: #475569;
    border: 1px solid #cbd5e1;

    &:hover {
      background: #f1f5f9;
    }
  }
`;

const EditPatient = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  
  // Table state
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        `${Labbaseurl}patient_list/?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,
        "GET"
      );

      if (response && response.success) {
        setPatients(response.data.patients || []);
        setTotalPages(response.data.total_pages || 1);
        setTotalCount(response.data.total_count || 0);
      } else {
        toast.error("Failed to load patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("An error occurred while fetching patients.");
    } finally {
      setLoading(false);
    }
  }, [Labbaseurl, currentPage, debouncedSearch, limit]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Open Edit Modal
  const handleEditClick = (patient) => {
    let patientName = patient.patientname || patient.patient_name || "";
    let extractedTitle = "Mr.";
    let cleanedName = patientName;

    const titles = ["Mr.", "Mrs.", "Miss.", "Master.", "Dr.", "Baby.", "B/O."];
    for (const title of titles) {
      if (patientName.startsWith(title)) {
        extractedTitle = title;
        cleanedName = patientName.substring(title.length).trim();
        break;
      }
    }

    let parsedAddress = { area: "", pincode: "" };
    if (patient.address) {
      if (typeof patient.address === "string") {
        try {
          parsedAddress = JSON.parse(patient.address);
        } catch (e) {
          parsedAddress.area = patient.address;
        }
      } else if (typeof patient.address === "object") {
        parsedAddress = patient.address;
      }
    }

    setFormData({
      patient_id: patient.patient_id || "",
      Title: extractedTitle,
      patientname: cleanedName,
      age: patient.age || "",
      age_type: patient.age_type || "Years",
      gender: patient.gender || "Male",
      phone: patient.phone ? patient.phone.replace(/[^0-9]/g, "").slice(-10) : "",
      email: patient.email || "",
      address: parsedAddress,
      patient_history: patient.patient_history || "",
    });

    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "area" || name === "pincode") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    } else {
      let updatedGender = formData.gender;
      if (name === "Title") {
        if (["Mr.", "Master.", "B/O."].includes(value)) updatedGender = "Male";
        else if (["Mrs.", "Miss.", "Baby."].includes(value)) updatedGender = "Female";
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "Title" && { gender: updatedGender }),
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.patient_id) return;

    setIsSubmitting(true);

    try {
      const fullPatientName = `${formData.Title} ${formData.patientname}`;
      const addressData = { area: formData.address.area, pincode: formData.address.pincode };

      const updateData = {
        patientname: fullPatientName,
        age: formData.age,
        age_type: formData.age_type,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: addressData,
        patient_history: formData.patient_history,
      };

      const result = await apiRequest(`${Labbaseurl}update_patient/${formData.patient_id}/`, "PUT", updateData);
      
      if (result && result.success) {
        toast.success("Patient details updated successfully!");
        setIsModalOpen(false);
        fetchPatients(); // Refresh the table
      } else {
        toast.error("Failed to update patient details.");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("An error occurred while updating the patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <h2>Patient Directory</h2>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by ID, Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </HeaderSection>

      <TableContainer>
        <TableScrollWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age & Gender</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No patients found matching your search.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.patient_id}>
                    <td><strong>{patient.patient_id}</strong></td>
                    <td>{patient.patientname}</td>
                    <td>{patient.age} {patient.age_type} / {patient.gender}</td>
                    <td>{patient.phone || "-"}</td>
                    <td>
                      <ActionButton onClick={() => handleEditClick(patient)}>
                        <FaEdit /> Edit
                      </ActionButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </TableScrollWrapper>

        {!loading && patients.length > 0 && (
          <Pagination>
            <div className="page-info">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} patients
            </div>
            <div className="controls">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={12} /> Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next <FaChevronRight size={12} />
              </button>
            </div>
          </Pagination>
        )}
      </TableContainer>

      {/* Edit Patient Modal */}
      {isModalOpen && formData && (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader>
              <h3><FaUser /> Edit Patient: {formData.patient_id}</h3>
              <button onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </ModalHeader>
            
            <StyledForm onSubmit={handleUpdate}>
              <ModalBody>
                <Fieldset>
                  <legend>Personal Information</legend>
                  <Row style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr" }}>
                    <FormGroup>
                      <label>Title</label>
                      <select name="Title" value={formData.Title} onChange={handleFormChange}>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss.">Miss.</option>
                        <option value="Master.">Master.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Baby.">Baby.</option>
                        <option value="B/O.">B/O.</option>
                      </select>
                    </FormGroup>
                    
                    <FormGroup>
                      <label><FaUser /> Name <RequiredIndicator>*</RequiredIndicator></label>
                      <input
                        type="text"
                        name="patientname"
                        value={formData.patientname}
                        onChange={handleFormChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Age <RequiredIndicator>*</RequiredIndicator></label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleFormChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Age Type</label>
                      <select name="age_type" value={formData.age_type} onChange={handleFormChange}>
                        <option value="Years">Years</option>
                        <option value="Months">Months</option>
                        <option value="Days">Days</option>
                      </select>
                    </FormGroup>
                  </Row>

                  <Row style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <FormGroup>
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleFormChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormGroup>
                    <FormGroup>
                      <label><FaIdCard /> Patient ID</label>
                      <input type="text" value={formData.patient_id} disabled />
                    </FormGroup>
                  </Row>
                </Fieldset>

                <Fieldset>
                  <legend>Contact Details</legend>
                  <Row style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    <FormGroup>
                      <label><FaPhoneAlt /> Phone <RequiredIndicator>*</RequiredIndicator></label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        maxLength={15}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <label><FaEnvelope /> Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </FormGroup>
                  </Row>
                  
                  <Row style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    <FormGroup>
                      <label><FaMapMarkerAlt /> Area</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.address.area}
                        onChange={handleFormChange}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <label>Pin Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleFormChange}
                        maxLength={6}
                      />
                    </FormGroup>
                  </Row>
                </Fieldset>
              </ModalBody>
              
              <ModalFooter>
                <StyledButton type="button" className="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </StyledButton>
                <StyledButton type="submit" className="primary" disabled={isSubmitting}>
                  <FaSave />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </StyledButton>
              </ModalFooter>
            </StyledForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default EditPatient;
