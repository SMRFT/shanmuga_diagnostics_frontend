import apiRequest from "../Auth/apiRequest";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  Loader2,
  User,
  Filter,
  ChevronDown,
} from "lucide-react";

const LogisticsDashboard = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [logisticData, setLogisticData] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [wtdCount, setWtdCount] = useState(0);
  const [mtdCount, setMtdCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /* ============================
     FETCH SAMPLE COLLECTORS
     ============================ */
  useEffect(() => {
    const fetchCollectors = async () => {
      if (!Labbaseurl) return;

      try {
        const response = await apiRequest(
          `${Labbaseurl}get_sample_collectors/`,
          "GET"
        );
        setCollectors(response.data || []);
      } catch (err) {
        console.error("Error fetching collectors:", err);
      }
    };

    fetchCollectors();
  }, [Labbaseurl]);

  /* ============================
     HANDLE COLLECTOR CHANGE
     ============================ */
  const handleCollectorChange = async (e) => {
    const collectorName = e.target.value;
    setSelectedCollector(collectorName);

    if (!collectorName) {
      setLogisticData([]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiRequest(
        `${Labbaseurl}logisticdashboard/`,
        "POST",
        {
          sampleCollector: collectorName,
        }
      );

      const data = result?.data || result;
      setLogisticData(data || []);
    } catch (error) {
      console.error("Error fetching logistics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     CALCULATE COUNTS
     ============================ */
  useEffect(() => {
    if (!logisticData.length) {
      setTodayCount(0);
      setWtdCount(0);
      setMtdCount(0);
      return;
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    let todayCnt = 0;
    let wtdCnt = 0;
    let mtdCnt = 0;

    logisticData.forEach((item) => {
      const itemDate = new Date(item.date);
      const itemDateStr = itemDate.toISOString().split("T")[0];
      const itemMonthStr = itemDate.toISOString().slice(0, 7);

      if (itemDateStr === selectedDate) todayCnt++;
      if (itemDate >= startOfWeek && itemDate <= today) wtdCnt++;
      if (itemMonthStr === selectedMonth) mtdCnt++;
    });

    setTodayCount(todayCnt);
    setWtdCount(wtdCnt);
    setMtdCount(mtdCnt);
  }, [logisticData, selectedDate, selectedMonth]);

  /* ============================
     UI
     ============================ */
  return (
    <DashboardContainer>
      <HeaderSection>
        <Title>Logistics Dashboard</Title>
        <Subtitle>Track and monitor sample collection metrics in real-time</Subtitle>
      </HeaderSection>

      <FilterCard>
        <FilterHeader>
          <FilterIcon>
            <Filter size={20} />
          </FilterIcon>
          <FilterTitle>Filter Options</FilterTitle>
        </FilterHeader>

        <FormGroup>
          <Label>
            <User size={16} />
            Sample Collector
          </Label>

          <SelectWrapper>
            <StyledSelect value={selectedCollector} onChange={handleCollectorChange}>
              <option value="">-- Select Collector --</option>
              {collectors.map((collector) => (
                <option
                  key={collector.employeeId}
                  value={collector.employeeName}
                >
                  {collector.employeeName}
                </option>
              ))}
            </StyledSelect>
            <SelectIconWrapper>
              <ChevronDown size={20} />
            </SelectIconWrapper>
          </SelectWrapper>
        </FormGroup>
      </FilterCard>

      {isLoading ? (
        <LoadingContainer>
          <Loader2 className="spinner" size={48} />
          <LoadingText>Loading analytics data...</LoadingText>
        </LoadingContainer>
      ) : (
        <StatsContainer>
          <StatCard>
            <StatHeader>
              <StatTitle>Today's Collections</StatTitle>
              <IconWrapper $color="#6e8efb">
                <Calendar size={22} />
              </IconWrapper>
            </StatHeader>

            <DateInputWrapper>
              <DateInput
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </DateInputWrapper>

            <StatValue>{todayCount}</StatValue>
            <StatLabel>Samples Collected</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Week To Date</StatTitle>
              <IconWrapper $color="#a777e3">
                <TrendingUp size={22} />
              </IconWrapper>
            </StatHeader>

            <Spacer />

            <StatValue>{wtdCount}</StatValue>
            <StatLabel>Samples This Week</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Month To Date</StatTitle>
              <IconWrapper $color="#e56f8f">
                <BarChart3 size={22} />
              </IconWrapper>
            </StatHeader>

            <DateInputWrapper>
              <DateInput
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </DateInputWrapper>

            <StatValue>{mtdCount}</StatValue>
            <StatLabel>Samples This Month</StatLabel>
          </StatCard>
        </StatsContainer>
      )}
    </DashboardContainer>
  );
};

/* ============================
   STYLED COMPONENTS
   ============================ */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #2d3436;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3, #e56f8f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #64748B;
  font-size: 1.1rem;
  margin: 0;
`;

const FilterCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #E2E8F0;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.2);
`;

const FilterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3436;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  
  svg {
    color: #6e8efb;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.1);
  }
`;

const SelectIconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
  pointer-events: none;
`;

const StatsContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #E2E8F0;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #64748B;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.$color}15; /* 15% opacity */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
`;

const DateInputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #334155;
  outline: none;
  &:focus {
    border-color: #6e8efb;
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.1);
  }
`;

const Spacer = styled.div`
  height: 42px; /* Roughly matches the height of date input */
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: #2d3436;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  color: #64748b;
  
  .spinner {
    animation: ${spin} 1s linear infinite;
    color: #6e8efb;
    margin-bottom: 1.5rem;
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
`;

export default LogisticsDashboard;
