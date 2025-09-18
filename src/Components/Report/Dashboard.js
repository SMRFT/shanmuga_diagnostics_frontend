"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Users,
  Home,
  ClipboardCheck,
  Wallet,
  Calendar,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import styled from "styled-components";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const DashboardContainer = styled(motion.div)`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
`;

const Title = styled(motion.h1)`
  text-align: center;
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const AmountContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const AmountBox = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ color }) => color};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
`;

const Heading = styled.h2`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
`;

const AmountValue = styled(motion.p)`
  font-size: 2rem;
  font-weight: bold;
  color: #1e293b;
`;

const ChartContainer = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  margin-top: 2rem;

  h3 {
    margin-bottom: 1.5rem;
    color: #1e293b;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  /* Ensure everything stays in one row */
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateFilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const FilterLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuickFilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const QuickFilterButton = styled(motion.button)`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #e2e8f0;
  }

  &.active {
    background: #3b82f6;
    color: white;
  }
`;

const StyledSelect = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  min-width: 200px;
  color: #1e293b;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  min-width: 200px;
  color: #1e293b;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ActiveFilterBadge = styled.div`
  background: #f1f5f9;
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  span {
    font-weight: 500;
  }
`;

const Dashboard = () => {
  // Helper function to format ISO date to YYYY-MM-DD
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Helper function to get date only part from ISO string
  const getDatePart = (isoString) => {
    return new Date(isoString).toISOString().split("T")[0];
  };

  // Initialize dates with current date
  const getCurrentDate = () => formatDateForInput(new Date());

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [registeredPatients, setRegisteredPatients] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [homeVisits, setHomeVisits] = useState(0);
  const [b2bNames, setB2bNames] = useState([]);
  const [selectedB2b, setSelectedB2b] = useState("");
  const [startDate, setStartDate] = useState(getCurrentDate()); // Initialize with current date
  const [endDate, setEndDate] = useState(getCurrentDate()); // Initialize with current date
  const [chartData, setChartData] = useState([]);
  const [activeQuickFilter, setActiveQuickFilter] = useState("today");
  const [isLoading, setIsLoading] = useState(false);
  const [dateFilterApplied, setDateFilterApplied] = useState(false);
  const [periodLabel, setPeriodLabel] = useState("Today's");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${Labbaseurl}patient_overview/`);
      const data = response.data;
      setPatients(data);
      setFilteredPatients(data);
      const uniqueB2bNames = [
        ...new Set(data.map((patient) => patient.B2B)),
      ].filter(Boolean);
      setB2bNames(uniqueB2bNames);

      // Process data for time series chart
      const processedData = processTimeSeriesData(data);
      setChartData(processedData);

      // Apply today's filter by default but skip updating date inputs to preserve initial current date
      applyQuickFilter("today", true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTimeSeriesData = (data) => {
    const dateMap = new Map();

    data.forEach((patient) => {
      // Extract just the date part from the ISO string
      const date = getDatePart(patient.date);
      const amount = Number.parseFloat(patient.totalAmount) || 0;

      if (dateMap.has(date)) {
        const current = dateMap.get(date);
        dateMap.set(date, {
          date,
          amount: current.amount + amount,
          patients: current.patients + 1,
        });
      } else {
        dateMap.set(date, {
          date,
          amount,
          patients: 1,
        });
      }
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days
  };

  // Update metrics based on filtered patients
  useEffect(() => {
    // Calculate metrics for the filtered patients
    const total = filteredPatients.reduce(
      (sum, patient) => sum + (Number.parseFloat(patient.totalAmount) || 0),
      0
    );
    const credit = filteredPatients.reduce(
      (sum, patient) => sum + (Number.parseFloat(patient.credit_amount) || 0),
      0
    );

    setTotalAmount(total);
    setCreditAmount(credit);
    setRegisteredPatients(filteredPatients.length);

    const tests = filteredPatients.reduce((count, patient) => {
      if (Array.isArray(patient.testname)) {
        return count + patient.testname.filter((test) => test.testname).length;
      }
      return count;
    }, 0);

    setTestCount(tests);

    const visits = filteredPatients.filter(
      (patient) => patient.B2B == null || patient.home_collection
    ).length;
    setHomeVisits(visits);
  }, [filteredPatients]);

  const handleB2bChange = (event) => {
    const selected = event.target.value;
    setSelectedB2b(selected);

    let filtered = patients;

    if (selected) {
      filtered = filtered.filter((patient) => patient.B2B === selected);
    }

    if (dateFilterApplied && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Set end time to end of day
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((patient) => {
        const patientDate = new Date(patient.date);
        return patientDate >= start && patientDate <= end;
      });
    }

    setFilteredPatients(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    setIsLoading(true);
    setActiveQuickFilter("custom");
    setDateFilterApplied(true);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set start time to beginning of day
    start.setHours(0, 0, 0, 0);

    // Set end time to end of day
    end.setHours(23, 59, 59, 999);

    // Update period label for custom date range
    setPeriodLabel("Selected Period");

    let filtered = patients;

    if (selectedB2b) {
      filtered = filtered.filter((patient) => patient.B2B === selectedB2b);
    }

    filtered = filtered.filter((patient) => {
      const patientDate = new Date(patient.date);
      return patientDate >= start && patientDate <= end;
    });

    setFilteredPatients(filtered);
    setIsLoading(false);
  };

  const resetFilters = () => {
    window.location.reload();
  };

  const applyQuickFilter = (filterType, skipDateUpdate = false) => {
    setIsLoading(true);
    setActiveQuickFilter(filterType);

    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    // Set start time to beginning of day
    start.setHours(0, 0, 0, 0);

    // Set end time to end of day
    end.setHours(23, 59, 59, 999);

    let filtered = patients;
    let newPeriodLabel = "Today's";

    switch (filterType) {
      case "today":
        // Start and end are already set to today
        newPeriodLabel = "Today's";
        break;
      case "yesterday":
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        newPeriodLabel = "Yesterday's";
        break;
      case "thisWeek":
        start.setDate(today.getDate() - today.getDay());
        start.setHours(0, 0, 0, 0);
        newPeriodLabel = "This Week's";
        break;
      case "lastWeek":
        start.setDate(today.getDate() - today.getDay() - 7);
        start.setHours(0, 0, 0, 0);
        end.setDate(today.getDate() - today.getDay() - 1);
        end.setHours(23, 59, 59, 999);
        newPeriodLabel = "Last Week's";
        break;
      case "thisMonth":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        newPeriodLabel = "This Month's";
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        newPeriodLabel = "Last Month's";
        break;
      case "last30Days":
        start.setDate(today.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        newPeriodLabel = "Last 30 Days'";
        break;
      case "last90Days":
        start.setDate(today.getDate() - 90);
        start.setHours(0, 0, 0, 0);
        newPeriodLabel = "Last 90 Days'";
        break;
      default:
        // No filter, return all patients
        setFilteredPatients(filtered);
        setIsLoading(false);
        return;
    }

    // Update the period label
    setPeriodLabel(newPeriodLabel);

    // Only update date inputs if not skipping date update and not custom filter
    if (!skipDateUpdate && filterType !== "custom") {
      setStartDate(formatDateForInput(start));
      setEndDate(formatDateForInput(end));
      setDateFilterApplied(true);
    }

    if (selectedB2b) {
      filtered = filtered.filter((patient) => patient.B2B === selectedB2b);
    }

    filtered = filtered.filter((patient) => {
      const patientDate = new Date(patient.date);
      return patientDate >= start && patientDate <= end;
    });

    setFilteredPatients(filtered);
    setIsLoading(false);
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const statsCards = [
    {
      title: `${periodLabel} Total Amount`,
      value: totalAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      }),
      icon: <Wallet size={24} />,
      color: "#10b981",
    },
    {
      title: `${periodLabel} Credit Amount`,
      value: creditAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      }),
      icon: <Activity size={24} />,
      color: "#f59e0b",
    },
    {
      title: `${periodLabel} Registered Patients`,
      value: registeredPatients,
      icon: <Users size={24} />,
      color: "#ef4444",
    },
    {
      title: `${periodLabel} Total Tests`,
      value: testCount,
      icon: <ClipboardCheck size={24} />,
      color: "#8b5cf6",
    },
    {
      title: `${periodLabel} Home Visits`,
      value: homeVisits,
      icon: <Home size={24} />,
      color: "#ec4899",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const pieData = b2bNames.map((b2bName) => {
    const count = filteredPatients.filter(
      (patient) => patient.B2B === b2bName
    ).length;
    return { name: b2bName, value: count };
  });

  return (
    <DashboardContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Title variants={itemVariants}>Patient Analytics Dashboard</Title>

      <FilterContainer variants={itemVariants}>
        <FilterSection>
          <FilterLabel>Lab</FilterLabel>
          <StyledSelect onChange={handleB2bChange} value={selectedB2b}>
            <option value="">All Labs</option>
            {b2bNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </StyledSelect>
        </FilterSection>

        <FilterSection>
          <FilterLabel>Date Range</FilterLabel>
          <DateFilterGroup>
            <StyledInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <StyledInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </DateFilterGroup>

          {/* <QuickFilterContainer>
            <QuickFilterButton
              className={activeQuickFilter === "today" ? "active" : ""}
              onClick={() => applyQuickFilter("today")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </QuickFilterButton>
            <QuickFilterButton
              className={activeQuickFilter === "yesterday" ? "active" : ""}
              onClick={() => applyQuickFilter("yesterday")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yesterday
            </QuickFilterButton>
            <QuickFilterButton
              className={activeQuickFilter === "thisWeek" ? "active" : ""}
              onClick={() => applyQuickFilter("thisWeek")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              This Week
            </QuickFilterButton>
            <QuickFilterButton
              className={activeQuickFilter === "lastWeek" ? "active" : ""}
              onClick={() => applyQuickFilter("lastWeek")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Last Week
            </QuickFilterButton>
            <QuickFilterButton
              className={activeQuickFilter === "thisMonth" ? "active" : ""}
              onClick={() => applyQuickFilter("thisMonth")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              This Month
            </QuickFilterButton>
            <QuickFilterButton
              className={activeQuickFilter === "lastMonth" ? "active" : ""}
              onClick={() => applyQuickFilter("lastMonth")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Last Month
            </QuickFilterButton>
            <QuickFilterButton
              className={activeQuickFilter === "last30Days" ? "active" : ""}
              onClick={() => applyQuickFilter("last30Days")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Last 30 Days
            </QuickFilterButton>
          </QuickFilterContainer> */}
        </FilterSection>

        <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
          <StyledButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDateFilter}
            disabled={isLoading}
          >
            <Calendar size={16} />
            Apply Filter
          </StyledButton>

          <StyledButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetFilters}
            disabled={isLoading}
            style={{ background: "#64748b" }}
          >
            <RefreshCw size={16} />
            Reset
          </StyledButton>
        </div>

        {dateFilterApplied && (
          <ActiveFilterBadge>
            <Calendar size={14} />
            <span>Date Range:</span> {formatDateRange()}
          </ActiveFilterBadge>
        )}
      </FilterContainer>

      <AmountContainer variants={containerVariants}>
        {statsCards.map((card, index) => (
          <AmountBox
            key={index}
            variants={itemVariants}
            color={card.color}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconWrapper color={card.color}>{card.icon}</IconWrapper>
            <Heading>{card.title}</Heading>
            <AmountValue
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {card.value}
            </AmountValue>
          </AmountBox>
        ))}
      </AmountContainer>

      <AnimatePresence mode="wait">
        <motion.div
          key="weekly-trend"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={chartVariants}
        >
          <ChartContainer>
            <h3 className="text-xl font-semibold">Weekly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        <motion.div
          key="charts-grid"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={chartVariants}
        >
          <ChartsGrid>{/* Charts can be added here */}</ChartsGrid>
        </motion.div>
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default Dashboard;