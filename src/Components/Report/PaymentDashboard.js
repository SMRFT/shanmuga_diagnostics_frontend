import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  Calendar,
  Filter,
  Users,
  DollarSign,
  CreditCard,
  Briefcase,
} from "lucide-react";

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
  background-color: #f5f8fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
`;

const DateFilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background-color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
`;

const DateInput = styled.input`
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  color: #2c3e50;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #7f8c8d;
  margin-right: 4px;
`;

const FilterButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 500;
`;

const CardValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${(props) => props.backgroundColor || "#3498db"};
`;

const HalfContainer = styled.div`
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background-color: #f8f9fa;
`;

const TH = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
  border-bottom: 1px solid #e1e5e9;
`;

const TD = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e1e5e9;
  font-size: 14px;
  color: #2c3e50;
`;

const TR = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const ErrorContainer = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const Select = styled.select`
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  color: #2c3e50;
  outline: none;
  background-color: white;
  cursor: pointer;

  &:focus {
    border-color: #3498db;
  }
`;

const FilterBadge = styled.div`
  background-color: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
`;

const ActiveFilters = styled.div`
  display: flex;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
`;

// Dashboard Component
const PaymentDashboard = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // Set current date as default when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setFromDate(formattedDate);
    setToDate(formattedDate);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;
      if (paymentMethod) params.payment_method = paymentMethod;

      const response = await axios.get(`${Labbaseurl}dashboard-data/`, {
        params,
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilter = () => {
    fetchDashboardData();
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const clearPaymentFilter = () => {
    setPaymentMethod("");
    fetchDashboardData();
  };

  // Calculate payment method specific stats
  const getPaymentMethodStats = () => {
    if (!dashboardData) return { count: 0, amount: 0 };

    if (!paymentMethod) {
      return {
        count: dashboardData.total_patients,
        amount: dashboardData.total_revenue,
      };
    }

    return {
      count: dashboardData.payment_methods[paymentMethod] || 0,
      amount: dashboardData.payment_method_amounts
        ? dashboardData.payment_method_amounts[paymentMethod] || 0
        : 0,
    };
  };

  const paymentStats = getPaymentMethodStats();

  if (loading) {
    return (
      <DashboardContainer>
        <Header>
          <Title>Payment Dashboard</Title>
        </Header>
        <LoadingContainer>
          <div>Loading dashboard data...</div>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <Title>Payment Dashboard</Title>
        </Header>
        <ErrorContainer>{error}</ErrorContainer>
        <DateFilterContainer>
          <Label>From:</Label>
          <DateInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Label>To:</Label>
          <DateInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <FilterButton onClick={handleFilter}>
            <Calendar size={16} />
            Apply Filter
          </FilterButton>
        </DateFilterContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Payment Dashboard</Title>

        <DateFilterContainer>
          <Label>From:</Label>
          <DateInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Label>To:</Label>
          <DateInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Label>Payment:</Label>
          <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Credit">Credit</option>
          </Select>
          <FilterButton onClick={handleFilter}>
            <Filter size={16} />
            Apply Filters
          </FilterButton>
        </DateFilterContainer>
      </Header>

      {paymentMethod && (
        <ActiveFilters>
          <FilterBadge>
            Payment Method: {paymentMethod}
            <span
              onClick={clearPaymentFilter}
              style={{ cursor: "pointer", marginLeft: "6px" }}
            >
              ×
            </span>
          </FilterBadge>
        </ActiveFilters>
      )}

      <GridContainer>
        <Card>
          <CardHeader>
            <CardTitle>
              {paymentMethod ? `${paymentMethod} Patients` : "Total Patients"}
            </CardTitle>
            <CardIcon backgroundColor="#3498db">
              <Users size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>{paymentStats.count}</CardValue>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {paymentMethod ? `${paymentMethod} Revenue` : "Total Revenue"}
            </CardTitle>
            <CardIcon backgroundColor="#2ecc71">
              <DollarSign size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>₹{paymentStats.amount.toLocaleString()}</CardValue>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Pending</CardTitle>
            <CardIcon backgroundColor="#e74c3c">
              <CreditCard size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>
            ₹{dashboardData.credit_statistics.credit_pending.toLocaleString()}
          </CardValue>
        </Card>
      </GridContainer>

      <FlexContainer>
        <HalfContainer>
          <CardTitle style={{ marginBottom: "16px", fontSize: "16px" }}>
            Payment Summary
          </CardTitle>
          <TableContainer>
            <Table>
              <THead>
                <TR>
                  <TH>Payment Method</TH>
                  <TH>Count</TH>
                  <TH>Amount (₹)</TH>
                  <TH>Percentage</TH>
                </TR>
              </THead>
              <tbody>
                {Object.entries(dashboardData.payment_methods)
                  .filter(([_, count]) => count > 0)
                  .map(([method, count]) => (
                    <TR
                      key={method}
                      style={{
                        backgroundColor:
                          method === paymentMethod ? "#ebf5fb" : "inherit",
                        fontWeight:
                          method === paymentMethod ? "bold" : "normal",
                      }}
                    >
                      <TD>{method}</TD>
                      <TD>{count}</TD>
                      <TD>
                        ₹
                        {dashboardData.payment_method_amounts[
                          method
                        ].toLocaleString()}
                      </TD>
                      <TD>
                        {((count / dashboardData.total_patients) * 100).toFixed(
                          1
                        )}
                        %
                      </TD>
                    </TR>
                  ))}
                <TR style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                  <TD>Total</TD>
                  <TD>{dashboardData.total_patients}</TD>
                  <TD>₹{dashboardData.total_revenue.toLocaleString()}</TD>
                  <TD>100%</TD>
                </TR>
              </tbody>
            </Table>
          </TableContainer>
        </HalfContainer>

        <HalfContainer>
          <CardTitle style={{ marginBottom: "16px", fontSize: "16px" }}>
            Credit Overview
          </CardTitle>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <Card style={{ flex: 1, margin: 0 }}>
              <CardHeader>
                <CardTitle>Total Credit</CardTitle>
              </CardHeader>
              <CardValue>
                ₹{dashboardData.credit_statistics.total_credit.toLocaleString()}
              </CardValue>
            </Card>
            <Card style={{ flex: 1, margin: 0 }}>
              <CardHeader>
                <CardTitle>Credit Paid</CardTitle>
              </CardHeader>
              <CardValue>
                ₹{dashboardData.credit_statistics.credit_paid.toLocaleString()}
              </CardValue>
            </Card>
            <Card style={{ flex: 1, margin: 0 }}>
              <CardHeader>
                <CardTitle>Credit Pending</CardTitle>
              </CardHeader>
              <CardValue>
                ₹
                {dashboardData.credit_statistics.credit_pending.toLocaleString()}
              </CardValue>
            </Card>
          </div>
        </HalfContainer>
      </FlexContainer>
    </DashboardContainer>
  );
};

export default PaymentDashboard;
