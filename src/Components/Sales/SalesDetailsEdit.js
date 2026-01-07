import React, { useEffect, useState } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { Search, Phone, Mail, MapPin, User, Building2, Hash, FileText, Briefcase } from "lucide-react";

// --- Styled Components ---

const Container = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1e293b;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
`;

const InputGroup = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    pointer-events: none;
    width: 18px;
    height: 18px;
    transition: color 0.3s ease;
  }

  &:focus-within svg {
    color: #4f46e5;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  color: #1e293b;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;

  span {
    color: #64748b;
    font-weight: 600;
    font-size: 0.95rem;
  }
`;

const ClearButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }
`;

const ScrollableTable = styled.div`
  max-height: 600px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
`;

const Tr = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    
    td {
      color: #1e293b;
    }
  }
`;

const Td = styled.td`
  padding: 1.25rem 1.5rem;
  color: #64748b;
  font-size: 0.95rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.color === 'blue' ? '#eff6ff' : '#f0fdf4'};
  color: ${props => props.color === 'blue' ? '#2563eb' : '#16a34a'};
`;

const EditButton = styled.button`
  background: white;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #4f46e5;
`;

// --- Modal Components ---

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #f1f5f9;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
  }
`;

const ModalInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: ${props => props.readOnly ? '#f1f5f9' : 'white'};
  color: ${props => props.readOnly ? '#64748b' : '#1e293b'};

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ModalTextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ModalSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.primary ? `
    background: #4f46e5;
    color: white;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1);

    &:hover {
      background: #4338ca;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }
  ` : `
    background: white;
    color: #475569;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  `}
`;

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '800px',
    width: '90%',
    padding: 0,
    border: 'none',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
};

const SalesDetailsEdit = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesMapping, setSalesMapping] = useState([]);

  // Search State with restored fields
  const [searchFilters, setSearchFilters] = useState({
    referrerCode: "",
    clinicalname: "",
    salesMapping: "",
    phone: "",
    email: "", // Keeping email search as extra utility
  });

  // Modal State
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchRecords();
    fetchSalesMapping();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchFilters]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`${Labbaseurl}get_all_clinicalnames/`, "GET");
      console.log("API Response:", res.data);

      const recordsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [res.data];
      setRecords(recordsArray);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesMapping = async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_sales_executives/`, "GET");
      const salesMappingArray = [
        { id: 0, name: "All" },
        ...res.data.map((person, index) => ({
          id: index + 1,
          name: person.employeeName,
          employeeId: person.employeeId,
        })),
      ];
      setSalesMapping(salesMappingArray);
    } catch (error) {
      console.error("Error fetching salesMapping:", error);
    }
  };

  const filterRecords = () => {
    const filtered = records.filter((record) => {
      const matchesReferrerCode = !searchFilters.referrerCode ||
        (record.referrerCode && record.referrerCode.toLowerCase().includes(searchFilters.referrerCode.toLowerCase()));

      const matchesClinicalName = !searchFilters.clinicalname ||
        (record.clinicalname && record.clinicalname.toLowerCase().includes(searchFilters.clinicalname.toLowerCase()));

      const matchesSalesMapping = !searchFilters.salesMapping ||
        (record.salesMapping && record.salesMapping.toLowerCase().includes(searchFilters.salesMapping.toLowerCase()));

      const matchesPhone = !searchFilters.phone ||
        (record.phone && record.phone.toString().includes(searchFilters.phone));

      const matchesEmail = !searchFilters.email ||
        (record.email && record.email.toLowerCase().includes(searchFilters.email.toLowerCase()));

      return matchesReferrerCode && matchesClinicalName && matchesSalesMapping && matchesPhone && matchesEmail;
    });

    setFilteredRecords(filtered);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({
      referrerCode: "",
      clinicalname: "",
      salesMapping: "",
      phone: "",
      email: "",
    });
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData(record);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRecord(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await apiRequest(`${Labbaseurl}clinicalname_update/`, "PUT", formData);
      // alert("Updated successfully"); // Toast is better if available, but staying consistent with simple feedback for now
      closeModal();
      fetchRecords();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const hasActiveFilters = Object.values(searchFilters).some(filter => filter !== "");

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          Loading Sales Details...
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <User size={32} />
          Sales Details Management
        </Title>
      </Header>

      <SearchGrid>
        <InputGroup>
          <Hash />
          <StyledInput
            name="referrerCode"
            placeholder="Search Referrer Code..."
            value={searchFilters.referrerCode}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <InputGroup>
          <Building2 />
          <StyledInput
            name="clinicalname"
            placeholder="Search Clinical Name..."
            value={searchFilters.clinicalname}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <InputGroup>
          <Briefcase />
          <StyledInput
            name="salesMapping"
            placeholder="Search Sales Mapping..."
            value={searchFilters.salesMapping}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <InputGroup>
          <Phone />
          <StyledInput
            name="phone"
            placeholder="Search Phone..."
            value={searchFilters.phone}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <InputGroup>
          <Mail />
          <StyledInput
            name="email"
            placeholder="Search Email..."
            value={searchFilters.email}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <InputGroup>
          <FileText />
          <StyledInput
            name="b2bType"
            placeholder="Search B2B Type..."
            value={searchFilters.b2bType}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </SearchGrid>

      <TableCard>
        <ResultsHeader>
          <span>Showing {filteredRecords.length} records</span>
          {hasActiveFilters && (
            <ClearButton onClick={clearFilters}>
              Filter Active (Clear)
            </ClearButton>
          )}
        </ResultsHeader>

        <ScrollableTable>
          <Table>
            <thead>
              <tr>
                <Th>Referrer Code</Th>
                <Th>Clinical Name</Th>
                <Th>Sales Mapping</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                {/* <Th>B2B Type</Th> */}
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <Tr>
                  <Td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    No records found matching your criteria
                  </Td>
                </Tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <Tr key={`${record.referrerCode}-${index}`}>
                    <Td><Badge color="blue">{String(record.referrerCode || '-')}</Badge></Td>
                    <Td style={{ fontWeight: 500, color: '#334155' }}>{String(record.clinicalname || '-')}</Td>
                    <Td>{record.salesMapping ? String(record.salesMapping) : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unmapped</span>}</Td>
                    <Td>{String(record.phone || '-')}</Td>
                    <Td>{String(record.email || '-')}</Td>
                    {/* <Td>{String(record.b2bType || '-')}</Td> */}
                    <Td>
                      <EditButton onClick={() => handleEdit(record)}>
                        Edit Details
                      </EditButton>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </ScrollableTable>
      </TableCard>

      {/* Modern Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
      >
        <ModalContent>
          <ModalHeader>
            <h2>
              <FileText size={24} color="#4f46e5" />
              Edit Clinical Details
            </h2>
            <div style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={closeModal}>
              <IoMdClose size={24} />
            </div>
          </ModalHeader>

          <ModalBody>
            <FieldGroup>
              <label>Referrer Code</label>
              <ModalInput
                value={formData.referrerCode || ""}
                readOnly
              />
            </FieldGroup>

            <FieldGroup>
              <label>Clinical Name</label>
              <ModalInput
                name="clinicalname"
                value={formData.clinicalname || ""}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup>
              <label>Type</label>
              <ModalInput
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                placeholder="e.g. Hospital, Clinic"
              />
            </FieldGroup>

            <FieldGroup>
              <label>Sales Mapping</label>
              <ModalSelect
                name="salesMapping"
                value={formData.salesMapping || ""}
                onChange={handleChange}
              >
                <option value="">Select Sales Person</option>
                <option value="Vacant">Vacant</option>
                {salesMapping.map((person) => (
                  <option key={person.id || person.name} value={person.name}>
                    {person.name}
                  </option>
                ))}
              </ModalSelect>
            </FieldGroup>

            <FieldGroup>
              <label>Email Address</label>
              <ModalInput
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </FieldGroup>

            <FieldGroup>
              <label>B2B Type</label>
              <ModalInput
                name="b2bType"
                value={formData.b2bType || ""}
                onChange={handleChange}
                placeholder="e.g. Credit, Prepaid"
              />
            </FieldGroup>

            <FieldGroup>
              <label>Phone Number</label>
              <ModalInput
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup fullWidth>
              <label>Address</label>
              <ModalTextArea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter full address..."
              />
            </FieldGroup>
          </ModalBody>

          <ModalFooter>
            <Button onClick={closeModal}>Cancel</Button>
            <Button primary onClick={handleSave}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SalesDetailsEdit;