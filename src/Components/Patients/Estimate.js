import { toast } from "react-toastify";
import apiRequest from "../Auth/apiRequest";
import { Search, Trash2, Calculator, Info, CheckCircle, XCircle } from "lucide-react";
import styled from "styled-components";
import { useState, useEffect } from "react";


// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem 2rem;
  font-family: 'Poppins', sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3, #e56f8f);
  color: white;
  padding: 3rem 2rem;
  border-radius: 24px;
  margin-bottom: 2.5rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(110, 142, 251, 0.15);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const ControlsSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.5);
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 16px;
  width: fit-content;
`;

const ToggleLabel = styled.label`
  font-weight: 600;
  color: #475569;
  font-size: 1rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 56px;
  height: 32px;
  background: ${(props) => (props.isOn ? "#10b981" : "#cbd5e1")};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);

  &::before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    top: 4px;
    left: ${(props) => (props.isOn ? "28px" : "4px")};
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleStatus = styled.span`
  font-weight: 600;
  color: ${(props) => (props.isB2B ? "#10b981" : "#ef4444")};
  font-size: 0.95rem;
  min-width: 80px;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  color: #94a3b8;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #1e293b;

  &:focus {
    border-color: #a777e3;
    background: white;
    box-shadow: 0 0 0 4px rgba(167, 119, 227, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 320px;
  overflow-y: auto;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 8px;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background-color: #f8fafc;
    transform: translateX(4px);
  }
`;

const TestInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TestName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
`;

const TestRate = styled.span`
  background: ${(props) => (props.isB2B ? "#dcfce7" : "#fee2e2")};
  color: ${(props) => (props.isB2B ? "#15803d" : "#b91c1c")};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid rgba(0,0,0,0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;

const TableRow = styled.tr`
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1.5rem;
  text-align: ${(props) => (props.center ? "center" : "left")};
  font-size: 0.95rem;
  color: #475569;
  vertical-align: middle;
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem 1.5rem;
  text-align: ${(props) => (props.center ? "center" : "left")};
  font-weight: 600;
  color: #64748b;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RemoveButton = styled.button`
  background: #fee2e2;
  color: #ef4444;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.05);
  }
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3, #e56f8f);
  color: white;
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(110, 142, 251, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
`;

const TotalLabel = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  opacity: 0.9;
`;

const TotalAmount = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -1px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const Estimate = () => {
  // State Management
  const [isB2B, setIsB2B] = useState(false);
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
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiRequest(`${Labbaseurl}testdetails/`, "GET");

        // Handle the response structure: { success: true, data: [...], count: N }
        const tests = response.data?.data || [];

        if (!Array.isArray(tests)) {
          throw new Error("Invalid data format received from API");
        }

        // Normalize the data with proper validation
        const normalizedData = tests.map((test) => {
          // Ensure test_id exists and convert to string for uniqueId
          const testId = test.test_id !== undefined && test.test_id !== null
            ? String(test.test_id)
            : `temp_${Math.random().toString(36).substr(2, 9)}`;

          return {
            ...test,
            uniqueId: testId, // Use test_id as uniqueId
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
      } catch (error) {
        console.error("Error fetching test details:", error);
        setError(error.message || "Failed to load test details");
        toast.error("Failed to load test details");
      } finally {
        setLoading(false);
      }
    };

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
      toast.success(`${test.test_name} added to estimate`);
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
    toast.success("Test removed from estimate");
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

  return (
    <Container>
      <Header>
        <Title>
          <Calculator size={32} />
          Test Rate Estimator
        </Title>
      </Header>

      <ControlsSection>
        <ToggleContainer>
          <ToggleLabel>Pricing Mode:</ToggleLabel>
          <ToggleSwitch isOn={isB2B} onClick={() => setIsB2B(!isB2B)} />
          <ToggleStatus isB2B={isB2B}>
            {isB2B ? "B2B Rates" : "MRP Rates"}
          </ToggleStatus>
        </ToggleContainer>

        <SearchContainer className="search-container">
          <SearchInputWrapper>
            <SearchIconWrapper>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search by test name, shortcut, code, or department..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim() && filteredOptions.length > 0) {
                  setShowDropdown(true);
                }
              }}
              disabled={loading || error}
            />
          </SearchInputWrapper>

          {showDropdown && filteredOptions.length > 0 && (
            <DropdownContainer>
              {filteredOptions.map((test) => (
                <DropdownItem
                  key={test.uniqueId}
                  onClick={() => handleTestSelect(test)}
                >
                  <TestInfo>
                    <div>
                      <TestName>{test.test_name}</TestName>
                      {test.shortcut && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
                          {test.shortcut} {test.test_code && `• ${test.test_code}`}
                        </div>
                      )}
                    </div>
                    <TestRate isB2B={isB2B}>₹{getRate(test)}</TestRate>
                  </TestInfo>
                </DropdownItem>
              ))}
            </DropdownContainer>
          )}

          {showDropdown && searchQuery.trim() && filteredOptions.length === 0 && (
            <DropdownContainer>
              <DropdownItem style={{ cursor: 'default', textAlign: 'center', color: '#666' }}>
                No tests found matching "{searchQuery}"
              </DropdownItem>
            </DropdownContainer>
          )}
        </SearchContainer>
      </ControlsSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell center>Sl.No</TableHeaderCell>
                  <TableHeaderCell>Test Name</TableHeaderCell>
                  <TableHeaderCell>Code</TableHeaderCell>
                  <TableHeaderCell center>Rate (₹)</TableHeaderCell>
                  <TableHeaderCell center>Action</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {selectedTests.length > 0 ? (
                  selectedTests.map((test, index) => (
                    <TableRow key={test.uniqueId}>
                      <TableCell center>{index + 1}</TableCell>
                      <TableCell>
                        {test.test_name}
                        {test.shortcut && (
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>
                            {test.shortcut}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{test.test_code || '-'}</TableCell>
                      <TableCell center>
                        <TestRate isB2B={isB2B}>₹{getRate(test)}</TestRate>
                      </TableCell>
                      <TableCell center>
                        <RemoveButton
                          onClick={() => handleRemoveTest(test.uniqueId)}
                          title="Remove test"
                        >
                          <Trash2 size={18} />
                        </RemoveButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5">
                      <EmptyState>
                        <Info size={48} style={{ opacity: 0.5 }} />
                        <div>No tests selected. Use the search box above to add tests.</div>
                      </EmptyState>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </TableContainer>

          {selectedTests.length > 0 && (
            <TotalSection>
              <TotalLabel>Total Estimate</TotalLabel>
              <TotalAmount>₹{calculateTotal().toLocaleString('en-IN')}</TotalAmount>
            </TotalSection>
          )}
        </>
      )}
    </Container>
  );
};

export default Estimate;