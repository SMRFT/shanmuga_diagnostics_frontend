"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, Users, FileText, CreditCard, TrendingUp } from "lucide-react"
import { toast } from "react-toastify"
import apiRequest from "../Auth/apiRequest";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f7fb;
  min-height: 100vh;
`

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #212529;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #6c757d;
    font-size: 1rem;
    margin: 0;
  }
`

const DateFilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const Button = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const MetricCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-left: 4px solid ${(props) => props.borderColor || "#667eea"};
`

const MetricIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: ${(props) => props.bgColor || "rgba(102, 126, 234, 0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color || "#667eea"};
  flex-shrink: 0;
`

const MetricContent = styled.div`
  flex: 1;
`

const MetricLabel = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
`

const MetricValue = styled.p`
  margin: 0;
  font-size: 1.8rem;
  color: #212529;
  font-weight: 700;
`

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.2rem;
    color: #212529;
  }
`

const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
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

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b"]

function PreethamBillingDashboard() {
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const fetchDashboardData = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates")
      return
    }

    setLoading(true)

    try {
      const url = `${Labbaseurl}preetham_billing_dashboard/?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`
      console.log("Fetching dashboard data from:", url)

      const result = await apiRequest(url, "GET")

      if (result?.success) {
        setDashboardData(result.data || {})
        toast.success("Dashboard data loaded successfully")
      } else {
        console.error(
          "Dashboard API error:",
          result?.error,
          "Status:",
          result?.status
        )
        toast.error(result?.error || "Failed to load dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchDashboardData()
  }, [])

  const paymentStatusData = dashboardData
    ? Object.entries(dashboardData.payment_status).map(([key, value]) => ({
      name: key || "Not Specified",
      value: value,
    }))
    : []

  const statusBreakdownData = dashboardData
    ? Object.entries(dashboardData.status_breakdown).map(([key, value]) => ({
      name: key || "Unknown",
      value: value,
    }))
    : []

  return (
    <Container>
      <Header>
        <h1>Preetham Hospital Billing Dashboard</h1>
        <p>Real-time billing metrics and patient statistics</p>
      </Header>

      <DateFilterContainer>
        <FilterGroup>
          <FilterLabel>From Date</FilterLabel>
          <FilterInput type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>To Date</FilterLabel>
          <FilterInput type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </FilterGroup>

        <FilterGroup>
          <Button onClick={fetchDashboardData} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner /> Loading...
              </>
            ) : (
              <>
                <TrendingUp size={16} style={{ marginRight: "0.5rem" }} />
                Refresh
              </>
            )}
          </Button>
        </FilterGroup>
      </DateFilterContainer>

      {dashboardData && (
        <>
          <MetricsGrid>
            <MetricCard borderColor="#667eea">
              <MetricIcon bgColor="rgba(102, 126, 234, 0.1)" color="#667eea">
                <DollarSign size={28} />
              </MetricIcon>
              <MetricContent>
                <MetricLabel>Total Billing Amount</MetricLabel>
                <MetricValue>₹{dashboardData.total_amount?.toLocaleString() || 0}</MetricValue>
              </MetricContent>
            </MetricCard>

            <MetricCard borderColor="#764ba2">
              <MetricIcon bgColor="rgba(118, 75, 162, 0.1)" color="#764ba2">
                <FileText size={28} />
              </MetricIcon>
              <MetricContent>
                <MetricLabel>Total Billings</MetricLabel>
                <MetricValue>{dashboardData.total_count || 0}</MetricValue>
              </MetricContent>
            </MetricCard>

            <MetricCard borderColor="#4facfe">
              <MetricIcon bgColor="rgba(79, 172, 254, 0.1)" color="#4facfe">
                <Users size={28} />
              </MetricIcon>
              <MetricContent>
                <MetricLabel>Total Patients</MetricLabel>
                <MetricValue>{dashboardData.unique_patients || 0}</MetricValue>
              </MetricContent>
            </MetricCard>

            <MetricCard borderColor="#f093fb">
              <MetricIcon bgColor="rgba(240, 147, 251, 0.1)" color="#f093fb">
                <CreditCard size={28} />
              </MetricIcon>
              <MetricContent>
                <MetricLabel>Total Credit Amount</MetricLabel>
                <MetricValue>₹{dashboardData.total_credit?.toLocaleString() || 0}</MetricValue>
              </MetricContent>
            </MetricCard>

            <MetricCard borderColor="#43e97b">
              <MetricIcon bgColor="rgba(67, 233, 123, 0.1)" color="#43e97b">
                <FileText size={28} />
              </MetricIcon>
              <MetricContent>
                <MetricLabel>Total Tests</MetricLabel>
                <MetricValue>{dashboardData.tests_count || 0}</MetricValue>
              </MetricContent>
            </MetricCard>


          </MetricsGrid>

          <Grid2Col>
            <ChartContainer>
              <h3>Payment Status Overview</h3>
              {paymentStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>No payment data available</p>
              )}
            </ChartContainer>

            <ChartContainer>
              <h3>Billing Status Breakdown</h3>
              {statusBreakdownData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#667eea" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No status data available</p>
              )}
            </ChartContainer>
          </Grid2Col>
        </>
      )}
    </Container>
  )
}

export default PreethamBillingDashboard
