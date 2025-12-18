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
     (MAIN FIX)
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
      "POST", // ✅ CHANGE FROM GET TO POST
      {
        sampleCollector: collectorName, // ✅ PAYLOAD
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
      <DashboardHeader>
        <HeaderContent>
          <Title>Logistics Dashboard</Title>
          <Subtitle>Track and monitor sample collection metrics in real-time</Subtitle>
        </HeaderContent>
        <HeaderGlow />
      </DashboardHeader>

      <FilterCard>
        <FilterHeader>
          <FilterIcon>
            <Filter size={18} />
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
          <LoadingSpinner>
            <Loader2 className="spinner" size={48} />
          </LoadingSpinner>
          <LoadingText>Loading analytics data...</LoadingText>
        </LoadingContainer>
      ) : (
        <StatsContainer>
          <StatCard $gradient="primary">
            <StatCardInner>
              <StatHeader>
                <StatTitle>Today's Collections</StatTitle>
                <IconWrapper $color="#6366f1">
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
              <StatLabel>samples collected</StatLabel>
              <StatGlow $color="rgba(99, 102, 241, 0.3)" />
            </StatCardInner>
          </StatCard>

          <StatCard $gradient="secondary">
            <StatCardInner>
              <StatHeader>
                <StatTitle>Week To Date</StatTitle>
                <IconWrapper $color="#ec4899">
                  <TrendingUp size={22} />
                </IconWrapper>
              </StatHeader>
              
              <StatValue>{wtdCount}</StatValue>
              <StatLabel>samples this week</StatLabel>
              <StatGlow $color="rgba(236, 72, 153, 0.3)" />
            </StatCardInner>
          </StatCard>

          <StatCard $gradient="tertiary">
            <StatCardInner>
              <StatHeader>
                <StatTitle>Month To Date</StatTitle>
                <IconWrapper $color="#14b8a6">
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
              <StatLabel>samples this month</StatLabel>
              <StatGlow $color="rgba(20, 184, 166, 0.3)" />
            </StatCardInner>
          </StatCard>
        </StatsContainer>
      )}
    </DashboardContainer>
  );
};

/* ============================
   KEYFRAME ANIMATIONS
   ============================ */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

/* ============================
   STYLED COMPONENTS
   ============================ */

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 135, 135, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(99, 102, 241, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const DashboardHeader = styled.div`
  margin-bottom: 3rem;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
`;

const HeaderGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 1;
  animation: ${glowPulse} 4s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
`;

const FilterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 24px;
  margin-bottom: 2rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FilterIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
`;

const FilterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  
  svg {
    color: #667eea;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  
  &:hover {
    border-color: #667eea;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
  
  option {
    padding: 0.75rem;
  }
`;

const SelectIconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  pointer-events: none;
  transition: transform 0.3s ease;
  
  ${StyledSelect}:focus ~ & {
    transform: translateY(-50%) rotate(180deg);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const StatCard = styled.div`
  background: ${props => {
    if (props.$gradient === 'primary') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (props.$gradient === 'secondary') return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  }};
  border-radius: 24px;
  padding: 2px;
  animation: ${fadeIn} 0.6s ease-out ${props => {
    if (props.$gradient === 'primary') return '0.2s';
    if (props.$gradient === 'secondary') return '0.3s';
    return '0.4s';
  }} both;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%
    );
    animation: ${shimmer} 3s infinite;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  }
`;

const StatCardInner = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 22px;
  padding: 2rem;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const StatGlow = styled.div`
  position: absolute;
  bottom: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: ${props => props.$color};
  border-radius: 50%;
  filter: blur(60px);
  animation: ${float} 6s ease-in-out infinite;
  pointer-events: none;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #475569;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.$color}15;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const DateInputWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #cbd5e1;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.05);
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const LoadingSpinner = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  margin-bottom: 1.5rem;
  
  .spinner {
    animation: ${spin} 1s linear infinite;
    color: #667eea;
  }
`;

const LoadingText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

export default LogisticsDashboard;
