import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import apiRequest from "../Auth/apiRequest";
import { Search, Trash2, Calculator, Info, RefreshCw } from "lucide-react";

/* ═══════════════════════════════════════════════
   DESIGN SYSTEM — viewport-locked, no page scroll
═══════════════════════════════════════════════ */
const Shell = styled.div`
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  box-sizing: border-box;
  padding: 1.25rem;
  gap: 1rem;
  border-radius: 24px;

  @media (max-width: 768px) { padding: 0.75rem; gap: 0.75rem; border-radius: 12px; }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  @media (max-width: 768px) { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 1.35rem;
  color: #1e293b;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.4px;
  @media (max-width: 768px) { font-size: 1.1rem; }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const FilterBar = styled.div`
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-end;
  flex-shrink: 0;
  background: #fafbfd;

  @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
`;

const FGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: ${p => p.grow || "0 1 auto"};
  min-width: ${p => p.minW || "150px"};
`;

const FLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FInput = styled.input`
  padding: 0.55rem 0.75rem;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  font-size: 0.85rem;
  color: #1e293b;
  outline: none;
  transition: all 0.15s;
  background: white;

  &:focus {
    border-color: #a777e3;
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: ${p => p.pad || "0.55rem 0.85rem"};
  border-radius: 14px;
  border: none;
  background: ${p => p.bg || "#a777e3"};
  color: ${p => p.color || "white"};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { filter: brightness(0.94); transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(167, 119, 227, 0.06);
  padding: 0.4rem 0.85rem;
  border-radius: 14px;
  border: 1px solid rgba(167, 119, 227, 0.15);
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 44px;
  height: 24px;
  background: ${(props) => (props.isOn ? "#10b981" : "#cbd5e1")};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &::before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${(props) => (props.isOn ? "23px" : "3px")};
    transition: all 0.2s;
  }
`;

const ToggleStatus = styled.span`
  color: ${(props) => (props.isB2B ? "#10b981" : "#ef4444")};
  font-weight: 700;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 6px;
`;

const DropdownItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.15s;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f8fafc;
    transform: translateX(2px);
  }
`;

const TestName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.85rem;
`;

const TestRate = styled.span`
  background: ${(props) => (props.isB2B ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)")};
  color: ${(props) => (props.isB2B ? "#10b981" : "#ef4444")};
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TableWrap = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;

  &::-webkit-scrollbar { width: 5px; height: 5px; }
  &::-webkit-scrollbar-track { background: #f8fafc; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;

  th {
    text-align: left;
    padding: 0.75rem 1.25rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.12s;

  &:hover { background-color: #f8faff; }

  td {
    padding: 0.7rem 1.25rem;
    color: #334155;
    font-size: 0.88rem;
    vertical-align: middle;
  }
`;

const RemoveButton = styled.button`
  background: #fee2e2;
  color: #ef4444;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

const TotalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
  flex-shrink: 0;
`;

const TotalLabelText = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TotalAmountVal = styled.span`
  font-size: 1.6rem;
  font-weight: 800;
  color: #a777e3;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 14px;
  margin-bottom: 20px;
  text-align: center;
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const Estimate = () => {
  // State Management
  const [isB2B, setIsB2B] = useState(localStorage.getItem("role") === "Clinical Reports");
  const [testOptions, setTestOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch test details from API
  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let rawData = null;
      try {
        const response = await apiRequest(`${Labbaseurl}get_test_details_estimate/`, "GET");
        if (response && response.success && response.data) {
          rawData = response.data?.data || response.data;
        }
      } catch (e) {
        console.warn("apiRequest failed, attempting fallback fetch:", e);
      }

      if (!rawData) {
        const res = await fetch(`${Labbaseurl}get_test_details_estimate/`);
        const json = await res.json();
        rawData = json.data || json;
      }

      const tests = Array.isArray(rawData) ? rawData : [];

      if (!Array.isArray(tests)) {
        throw new Error("Invalid data format received from API");
      }

      // Normalize the data with proper validation
      const normalizedData = tests.map((test) => {
        const testId = test.test_id !== undefined && test.test_id !== null
          ? String(test.test_id)
          : `temp_${Math.random().toString(36).substr(2, 9)}`;

        return {
          ...test,
          uniqueId: testId,
          test_name: (test.test_name || "").trim(),
          shortcut: (test.shortcut || "").trim(),
          MRP: Number(test.MRP) || 0,
          L2L_Rate_Card: Number(test.L2L_Rate_Card) || 0,
          test_code: test.test_code || "",
          department: test.department || "",
          specimen_type: test.specimen_type || "",
        };
      });

      setTestOptions(normalizedData);
      setFilteredOptions(normalizedData);

      if (normalizedData.length === 0) {
        setError("No tests available in the system");
      }
    } catch (err) {
      console.error("Error fetching test details:", err);
      setError(err.message || "Failed to load test details");
      toast.error("Failed to load test details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, [Labbaseurl]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredOptions(testOptions);
      setShowDropdown(false);
    } else {
      const queryLower = query.toLowerCase().trim();

      const filtered = testOptions.filter((test) => {
        const testName = (test.test_name || "").toLowerCase();
        const shortcut = (test.shortcut || "").toLowerCase();
        const testCode = (test.test_code || "").toLowerCase();
        const department = (test.department || "").toLowerCase();

        return (
          testName.includes(queryLower) ||
          shortcut.includes(queryLower) ||
          testCode.includes(queryLower) ||
          department.includes(queryLower)
        );
      });

      setFilteredOptions(filtered);
      setShowDropdown(filtered.length > 0);
    }
  };

  // Handle test selection
  const handleTestSelect = (test) => {
    // Check if test is already selected using uniqueId
    const isAlreadySelected = selectedTests.some(
      (selectedTest) => selectedTest.uniqueId === test.uniqueId
    );

    if (!isAlreadySelected) {
      setSelectedTests((prevTests) => [...prevTests, test]);
    } else {
      toast.info(`${test.test_name} is already selected`);
    }

    // Clear search and close dropdown
    setSearchQuery("");
    setShowDropdown(false);
    setFilteredOptions(testOptions);
  };

  // Handle test removal
  const handleRemoveTest = (testId) => {
    setSelectedTests((prevTests) =>
      prevTests.filter((test) => test.uniqueId !== testId)
    );
  };

  // Calculate total amount
  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => {
      const rate = isB2B ? (test.L2L_Rate_Card || 0) : (test.MRP || 0);
      return total + rate;
    }, 0);
  };

  // Get rate based on B2B status
  const getRate = (test) => {
    return isB2B ? (test.L2L_Rate_Card || 0) : (test.MRP || 0);
  };

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setTimeout(() => setShowDropdown(false), 150);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearEstimate = () => {
    setSelectedTests([]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <Shell>
      {/* Top Bar */}
      <TopBar>
        <TitleGroup>
          <Calculator size={22} color="#a777e3" />
          <Title>Test Rate Estimator</Title>
        </TitleGroup>
        <IconBtn bg="#a777e3" color="#f1f5f9" onClick={fetchTestDetails} disabled={loading} title="Refresh">
          <RefreshCw size={16} />
        </IconBtn>
      </TopBar>

      <Card>
        {/* Controls / FilterBar styling */}
        <FilterBar>
          {localStorage.getItem("role") !== "Clinical Reports" && (
            <FGroup minW="180px">
              <FLabel>Pricing Mode</FLabel>
              <ToggleContainer>
                <ToggleSwitch isOn={isB2B} onClick={() => setIsB2B(!isB2B)} />
                <ToggleStatus isB2B={isB2B}>
                  {isB2B ? "B2B Rates" : "MRP Rates"}
                </ToggleStatus>
              </ToggleContainer>
            </FGroup>
          )}

          <FGroup grow="1" minW="260px" style={{ position: 'relative' }}>
            <FLabel>Search Test</FLabel>
            <SearchContainer className="search-container">
              <div style={{ position: "relative" }}>
                <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <FInput
                  type="text"
                  placeholder="Search by name, shortcut, code..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchQuery.trim() && filteredOptions.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  disabled={loading || error}
                  style={{ paddingLeft: "2.2rem", width: "100%", boxSizing: "border-box" }}
                />
              </div>

              {showDropdown && filteredOptions.length > 0 && (
                <DropdownContainer>
                  {filteredOptions.map((test) => (
                    <DropdownItem
                      key={test.uniqueId}
                      onClick={() => handleTestSelect(test)}
                    >
                      <div>
                        <TestName>{test.test_name}</TestName>
                        {test.shortcut && (
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {test.shortcut} {test.test_code && `• ${test.test_code}`}
                          </div>
                        )}
                      </div>
                      <TestRate isB2B={isB2B}>₹{getRate(test)}</TestRate>
                    </DropdownItem>
                  ))}
                </DropdownContainer>
              )}

              {showDropdown && searchQuery.trim() && filteredOptions.length === 0 && (
                <DropdownContainer>
                  <DropdownItem style={{ cursor: 'default', textAlign: 'center', color: '#94a3b8' }}>
                    No tests found matching "{searchQuery}"
                  </DropdownItem>
                </DropdownContainer>
              )}
            </SearchContainer>
          </FGroup>
          <IconBtn bg="#f1f5f9" color="#475569" onClick={clearEstimate} title="Clear">Clear</IconBtn>
        </FilterBar>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TableWrap>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Sl.No</th>
                <th>Test Name</th>
                <th style={{ textAlign: 'center' }}>Rate</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Action</th>
              </tr>
            </TableHead>
            <tbody>
              {loading ? (
                <Tr><td colSpan={4} style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>Loading test details...</td></Tr>
              ) : selectedTests.length > 0 ? (
                selectedTests.map((test, index) => (
                  <Tr key={test.uniqueId}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{test.test_name}</div>
                      {test.shortcut && (
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {test.shortcut}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>₹{getRate(test)}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <RemoveButton
                          onClick={() => handleRemoveTest(test.uniqueId)}
                          title="Remove test"
                        >
                          <Trash2 size={16} />
                        </RemoveButton>
                      </div>
                    </td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <td colSpan="4">
                    <EmptyState>
                      <Info size={36} style={{ opacity: 0.25, marginBottom: '0.50rem' }} />
                      <div>No tests selected. Use the search box above to add tests.</div>
                    </EmptyState>
                  </td>
                </Tr>
              )}
            </tbody>
          </Table>
        </TableWrap>

        <TotalFooter>
          <TotalLabelText>Total Estimate</TotalLabelText>
          <TotalAmountVal>₹{calculateTotal().toLocaleString('en-IN')}</TotalAmountVal>
        </TotalFooter>
      </Card>
    </Shell>
  );
};

export default Estimate;