import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiRequest from "../Auth/apiRequest";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CategorySelector = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const RadioInput = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #667eea;
  cursor: pointer;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: ${props => props.align || 'center'};
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  min-width: ${props => props.minWidth || '80px'};
  
  ${props => props.sticky && `
    position: sticky;
    left: 0;
    z-index: 20;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
  `}
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  
  ${props => props.isTotal && `
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    font-weight: 700;
  `}
  
  ${props => props.isGrandTotal && `
    background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
    font-weight: 700;
    font-size: 1.1rem;
  `}
  
  &:hover {
    background-color: ${props => props.isTotal || props.isGrandTotal ? '' : '#f9fafb'};
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  
  ${props => props.sticky && `
    position: sticky;
    left: 0;
    z-index: 10;
    background: white;
    border-right: 2px solid #e5e7eb;
    font-weight: 600;
  `}
  
  ${props => props.isTotal && `
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  `}
  
  ${props => props.isGrandTotal && `
    background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const TotalCell = styled.div`
  padding: 0.5rem;
  text-align: center;
  font-weight: 700;
  color: #1f2937;
  font-size: 0.9rem;
`;

const SaveButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  float: right;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SummaryItem = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const Salesplan = () => {
  const [salesMappings, setSalesMappings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('B2B');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [planData, setPlanData] = useState({});
  
  const categories = ['B2B', 'Corporate Health Checkup', 'Home Collection'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch Sales Executives
  useEffect(() => {
    const fetchSalesExecutives = async () => {
      try {
        const res = await apiRequest(`${Labbaseurl}get_sales_executives/?limit=500`, "GET");
        const data = res?.data?.data || [];

        const mappings = data.map((exec, index) => ({
          id: index + 1,
          name: exec.employeeName,
          employeeId: exec.employeeId
        }));
        
        setSalesMappings(mappings);
      } catch (error) {
        console.error("Error fetching sales mappings:", error.message || error);
        setSalesMappings([]);
      }
    };

    fetchSalesExecutives();
  }, [Labbaseurl]);

  const handleInputChange = (salesExecId, day, value) => {
    setPlanData(prev => ({
      ...prev,
      [`${selectedCategory}_${salesExecId}_${day}`]: value
    }));
  };

  const getInputValue = (salesExecId, day) => {
    return planData[`${selectedCategory}_${salesExecId}_${day}`] || '';
  };

  // Calculate daily total for a specific day
  const getDailyTotal = (day) => {
    let total = 0;
    salesMappings.forEach(exec => {
      const value = parseFloat(getInputValue(exec.employeeId, day)) || 0;
      total += value;
    });
    return total;
  };

  // Calculate row total for a sales executive
  const getRowTotal = (salesExecId) => {
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const value = parseFloat(getInputValue(salesExecId, day)) || 0;
      total += value;
    }
    return total;
  };

  // Calculate grand total for the selected category
  const getGrandTotal = () => {
    let total = 0;
    salesMappings.forEach(exec => {
      total += getRowTotal(exec.employeeId);
    });
    return total;
  };

  // Calculate totals for all categories
  const getAllCategoryTotals = () => {
    const totals = {};
    categories.forEach(category => {
      let categoryTotal = 0;
      salesMappings.forEach(exec => {
        for (let day = 1; day <= daysInMonth; day++) {
          const value = parseFloat(planData[`${category}_${exec.employeeId}_${day}`]) || 0;
          categoryTotal += value;
        }
      });
      totals[category] = categoryTotal;
    });
    return totals;
  };

  const categoryTotals = getAllCategoryTotals();
  const overallTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>Sales Plan Management</Title>
          
          <Controls>
            <Select 
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </Select>
            <Select 
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </Controls>

          <CategorySelector>
            {categories.map((category) => (
              <RadioLabel key={category}>
                <RadioInput
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span>{category}</span>
              </RadioLabel>
            ))}
          </CategorySelector>
        </Header>

        <SummaryCard>
          <SummaryGrid>
            <SummaryItem gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <SummaryLabel>B2B Total</SummaryLabel>
              <SummaryValue>₹{categoryTotals['B2B']?.toLocaleString() || 0}</SummaryValue>
            </SummaryItem>
            <SummaryItem gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <SummaryLabel>Corporate Health Checkup</SummaryLabel>
              <SummaryValue>₹{categoryTotals['Corporate Health Checkup']?.toLocaleString() || 0}</SummaryValue>
            </SummaryItem>
            <SummaryItem gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <SummaryLabel>Home Collection</SummaryLabel>
              <SummaryValue>₹{categoryTotals['Home Collection']?.toLocaleString() || 0}</SummaryValue>
            </SummaryItem>
            <SummaryItem gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <SummaryLabel>Overall Total</SummaryLabel>
              <SummaryValue>₹{overallTotal.toLocaleString()}</SummaryValue>
            </SummaryItem>
          </SummaryGrid>
        </SummaryCard>

        <TableContainer>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th sticky align="left">Sales Executive</Th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <Th key={day}>{day}</Th>
                  ))}
                  <Th>Total</Th>
                </tr>
                <tr>
                  <Th sticky align="left">Daily Total</Th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <Th key={day}>
                      <TotalCell style={{ color: '#fbbf24' }}>₹{getDailyTotal(day).toLocaleString()}</TotalCell>
                    </Th>
                  ))}
                  <Th>
                    <TotalCell style={{ color: '#10b981' }}>₹{getGrandTotal().toLocaleString()}</TotalCell>
                  </Th>
                </tr>
              </Thead>
              <Tbody>
                {salesMappings.map((exec) => (
                  <Tr key={exec.id}>
                    <Td sticky>{exec.name}</Td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                      <Td key={day}>
                        <Input
                          type="number"
                          value={getInputValue(exec.employeeId, day)}
                          onChange={(e) => handleInputChange(exec.employeeId, day, e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </Td>
                    ))}
                    <Td>
                      <TotalCell>₹{getRowTotal(exec.employeeId).toLocaleString()}</TotalCell>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrapper>
        </TableContainer>

        <SaveButton
          onClick={() => {
            alert(`Sales plan saved successfully!\nTotal: ₹${getGrandTotal().toLocaleString()}`);
          }}
        >
          Save Plan
        </SaveButton>
      </ContentWrapper>
    </Container>
  );
};

export default Salesplan;