import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #ffffff;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const SearchInput = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid transparent;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
    background: #ffffff;
  }

  &::placeholder {
    color: #666;
    font-style: italic;
  }
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-height: 600px;
`;

const ScrollableTableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  border-radius: 16px;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Arial", sans-serif;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderRow = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderCell = styled.th`
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #ffffff;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;

  &:nth-child(even) {
    background: linear-gradient(90deg, #f8f9ff 0%, #ffffff 100%);
  }

  &:hover {
    background: linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #333;
  font-size: 0.9rem;
  vertical-align: middle;
  min-width: 150px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "#ffffff")};
  color: ${(props) => (props.disabled ? "#6c757d" : "#333")};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
    background: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "#ffffff")};
  color: ${(props) => (props.disabled ? "#6c757d" : "#333")};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
    background: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ReadOnlyInput = styled(Input)`
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaf6 100%);
  border: 2px solid #e0e0e0;
  color: #5f6368;
  font-weight: 600;
`;

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;

  ${(props) =>
    props.save
      ? `
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(17, 153, 142, 0.6);
    }
  `
      : `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
  `}

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4facfe;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-weight: 500;
  border-radius: 12px 12px 0 0;

  span {
    font-size: 0.9rem;
  }
`;

const ClearButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const SalesDetailsEdit = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [salesMapping, setSalesMapping] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [loadingSalesPersons, setLoadingSalesPersons] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    referrerCode: "",
    clinicalname: "",
    salesMapping: "",
    phone: "",
  });

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
    const res = await apiRequest(`${Labbaseurl}get_all_clinicalnames/?limit=500`, "GET");

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

 // ✅ Clean apiRequest usage
  const fetchSalesMapping = async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_sales_executives/?limit=500`, "GET");
      const salesMappingArray = [
        { id: 0, name: "All" },
        ...res.data.data.map((person, index) => ({
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
      const matchesReferrerCode =
        !searchFilters.referrerCode ||
        (record.referrerCode &&
          record.referrerCode
            .toLowerCase()
            .includes(searchFilters.referrerCode.toLowerCase()));

      const matchesClinicalName =
        !searchFilters.clinicalname ||
        (record.clinicalname &&
          record.clinicalname
            .toLowerCase()
            .includes(searchFilters.clinicalname.toLowerCase()));

      const matchesSalesMapping =
        !searchFilters.salesMapping ||
        (record.salesMapping &&
          record.salesMapping
            .toLowerCase()
            .includes(searchFilters.salesMapping.toLowerCase()));

      const matchesPhone =
        !searchFilters.phone ||
        (record.phone &&
          record.phone
            .toLowerCase()
            .includes(searchFilters.phone.toLowerCase()));

      return (
        matchesReferrerCode &&
        matchesClinicalName &&
        matchesSalesMapping &&
        matchesPhone
      );
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
    });
  };

  const handleEdit = (record) => {
    setEditingCode(record.referrerCode);
    setFormData(record);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Clean apiRequest usage
  const handleSave = async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}clinicalname_update/`, "PUT", formData);
      alert("Updated successfully");
      setEditingCode(null);
      fetchRecords();
    } catch (error) {
      alert("Update failed");
    }
  };
  const handleCancel = () => {
    setEditingCode(null);
    setFormData({});
  };

  const hasActiveFilters = Object.values(searchFilters).some(
    (filter) => filter !== ""
  );

  if (loading) {
    return (
      <Container>
        <Title>Edit Sales Details</Title>
        <TableWrapper>
          <LoadingSpinner />
        </TableWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Edit Sales Details</Title>

      <SearchContainer>
        <SearchInput
          type="text"
          name="referrerCode"
          placeholder="Search by Referrer Code..."
          value={searchFilters.referrerCode}
          onChange={handleSearchChange}
        />
        <SearchInput
          type="text"
          name="clinicalname"
          placeholder="Search by Clinical Name..."
          value={searchFilters.clinicalname}
          onChange={handleSearchChange}
        />
        <SearchInput
          type="text"
          name="salesMapping"
          placeholder="Search by Sales Mapping..."
          value={searchFilters.salesMapping}
          onChange={handleSearchChange}
        />
        <SearchInput
          type="text"
          name="phone"
          placeholder="Search by Phone..."
          value={searchFilters.phone}
          onChange={handleSearchChange}
        />
      </SearchContainer>

      <TableWrapper>
        <ResultsInfo>
          <span>
            Showing {filteredRecords.length} of {records.length} records
            {hasActiveFilters && " (filtered)"}
          </span>
          {hasActiveFilters && (
            <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
          )}
        </ResultsInfo>

        <ScrollableTableContainer>
          <StyledTable>
            <TableHeader>
              <HeaderRow>
                <HeaderCell>Referrer Code</HeaderCell>
                <HeaderCell>Clinical Name</HeaderCell>
                <HeaderCell>Type</HeaderCell>
                <HeaderCell>Sales Mapping</HeaderCell>
                <HeaderCell>Phone</HeaderCell>
                <HeaderCell>Actions</HeaderCell>
              </HeaderRow>
            </TableHeader>

            <TableBody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <TableCell colSpan="6">
                    <EmptyState>
                      {hasActiveFilters
                        ? "No records match your search criteria"
                        : "No records found"}
                    </EmptyState>
                  </TableCell>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.referrerCode}>
                    <TableCell>
                      <ReadOnlyInput value={record.referrerCode} readOnly />
                    </TableCell>

                    <TableCell>
                      <Input
                        name="clinicalname"
                        value={
                          editingCode === record.referrerCode
                            ? formData.clinicalname || ""
                            : record.clinicalname || ""
                        }
                        onChange={handleChange}
                        disabled={editingCode !== record.referrerCode}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        name="type"
                        value={
                          editingCode === record.referrerCode
                            ? formData.type || ""
                            : record.type || ""
                        }
                        onChange={handleChange}
                        disabled={editingCode !== record.referrerCode}
                      />
                    </TableCell>

                    <TableCell>
                      {editingCode === record.referrerCode ? (
                        <Select
                          name="salesMapping"
                          value={formData.salesMapping || ""}
                          onChange={handleChange}
                          disabled={loadingSalesPersons}
                        >
                          <option value="">
                            {loadingSalesPersons
                              ? "Loading..."
                              : "Select Sales Person"}
                          </option>
                          <option value="Vacant">Vacant</option>
                          {salesPersons.map((person) => (
                            <option
                              key={person.id || person.name}
                              value={person.name}
                            >
                              {person.name}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          name="salesMapping"
                          value={record.salesMapping || ""}
                          disabled={true}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <Input
                        name="phone"
                        value={
                          editingCode === record.referrerCode
                            ? formData.phone || ""
                            : record.phone || ""
                        }
                        onChange={handleChange}
                        disabled={editingCode !== record.referrerCode}
                      />
                    </TableCell>

                    <TableCell>
                      {editingCode === record.referrerCode ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <ActionButton save onClick={handleSave}>
                            Save
                          </ActionButton>
                          <ActionButton onClick={handleCancel}>
                            Cancel
                          </ActionButton>
                        </div>
                      ) : (
                        <ActionButton onClick={() => handleEdit(record)}>
                          Edit
                        </ActionButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </ScrollableTableContainer>
      </TableWrapper>
    </Container>
  );
};

export default SalesDetailsEdit;