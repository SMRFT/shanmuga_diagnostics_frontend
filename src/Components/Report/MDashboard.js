import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import apiRequest from "../Auth/apiRequest";
import { toast } from "react-toastify";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #f3e5f5 100%);
  min-height: 100vh;
  font-family: 'Outfit', 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: ${fadeIn} 0.5s ease-out;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(167, 119, 227, 0.4);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  background: #fff;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  font-size: 0.95rem;
  outline: none;
  background: #f8f9fa;
  transition: all 0.3s;
  font-family: inherit;

  &:focus {
      border-color: #a777e3;
      background: white;
      box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(167, 119, 227, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(167, 119, 227, 0.5);
  }

  &:active {
    transform: translateY(0);    
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const VolumeGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const SegmentGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const ChartsGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${props => props.bg || "rgba(255, 255, 255, 0.9)"};
  backdrop-filter: blur(20px);
  color: ${props => props.color || "#333"};
  padding: 1.8rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(167, 119, 227, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justify || "space-between"};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: ${props => props.minHeight || "auto"};
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: ${fadeIn} 0.6s ease-out backwards;
  animation-delay: ${props => props.delay || '0s'};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(167, 119, 227, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const IconBox = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: ${props => props.iconBg || 'rgba(0,0,0,0.05)'};
  color: ${props => props.iconColor || 'inherit'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const CardLabel = styled.span`
  font-size: 0.95rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
`;

const CardValue = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 24px;
    background: linear-gradient(to bottom, #6e8efb, #a777e3);
    border-radius: 3px;
  }
`;

const FinancialSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  animation: ${fadeIn} 0.8s ease-out backwards;
`;

const FinancialCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(167, 119, 227, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  height: 100%;
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: background 0.2s;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        background: rgba(167, 119, 227, 0.05);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        margin-left: -0.5rem;
        margin-right: -0.5rem;
        border-radius: 8px;
    }
`;

const TableLabel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`;

const MainLabel = styled.span`
    font-size: 1rem;
    color: #444;
    font-weight: 600;
`;

const SubLabel = styled.span`
    font-size: 0.8rem;
    color: #888;
`;

const TableValue = styled.span`
    font-size: 1.2rem;
    color: #2d3436;
    font-weight: 700;
    font-family: 'Space Mono', monospace;
`;

const COLORS = ['#6e8efb', '#a777e3', '#e56f8f', '#00b894'];

const MDashboard = () => {
    const [data, setData] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFromDate(today);
        setToDate(today);
        fetchData(today, today);
    }, []);

    const fetchData = async (start, end) => {
        setLoading(true);
        try {
            const response = await apiRequest(`${Labbaseurl}m-dashboard-stats/`, "POST", {
                from_date: start,
                to_date: end
            });

            if (response.success && response.data.success) {
                setData(response.data.data);
            } else {
                console.error("Error fetching dashboard data", response.error);
                toast.error("Failed to load dashboard data");
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchData(fromDate, toDate);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    // Prepare Chart Data
    const prepareSegmentData = () => {
        if (!data) return [];
        return [
            { name: 'Home Coll.', value: data.samples.segments.home_collection || 0, fill: '#6e8efb' },
            { name: 'B2B', value: data.samples.segments.b2b || 0, fill: '#a777e3' },
            { name: 'Shanmuga 360', value: data.samples.segments.shanmuga_360 || 0, fill: '#8b5cf6' },
            { name: 'Hospital', value: data.samples.segments.hospital || 0, fill: '#fdcb6e' },
            { name: 'Franchise', value: data.samples.segments.franchise || 0, fill: '#e56f8f' },
            { name: 'Corp Health', value: data.samples.segments.company_health_check || 0, fill: '#00b894' },
        ];
    };

    const prepareRevenueData = () => {
        if (!data) return [];
        return [
            { name: 'Home Coll.', value: data.financials.gross.home_collection || 0 },
            { name: 'B2B', value: data.financials.gross.b2b || 0 },
            { name: 'Shanmuga 360', value: data.financials.gross.shanmuga_360 || 0 },
            { name: 'Hospital', value: data.financials.gross.hospital || 0 },
            { name: 'Franchise', value: data.financials.gross.franchise_share || 0 },
            { name: 'Corp Health', value: data.financials.gross.company_health_check || 0 },
        ].filter(item => item.value > 0);
    };

    if (loading && !data) return (
        <DashboardContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner-border" style={{ color: '#a777e3' }} role="status"></div>
            <h3 style={{ color: '#666' }}>Loading Analytics...</h3>
        </DashboardContainer>
    );

    const segmentData = prepareSegmentData();
    const revenueData = prepareRevenueData();

    return (
        <DashboardContainer>
            <Header>
                <TitleGroup>
                    <IconWrapper>
                        <i className="bi bi-grid-1x2-fill"></i>
                    </IconWrapper>
                    <Title>Analytics Overview</Title>
                </TitleGroup>
                <Controls>
                    <div style={{ position: 'relative' }}>
                        <i className="bi bi-calendar-event" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></i>
                        <Input type="date" value={fromDate} max={toDate || new Date().toISOString().split("T")[0]} onChange={(e) => setFromDate(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                    </div>
                    <span style={{ color: '#888' }}>to</span>
                    <div style={{ position: 'relative' }}>
                        <i className="bi bi-calendar-event" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></i>
                        <Input type="date" value={toDate} min={fromDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setToDate(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
                    </div>
                    <Button onClick={handleSearch}>
                        <i className="bi bi-search" style={{ marginRight: '8px' }}></i>
                        Search
                    </Button>
                </Controls>
            </Header>

            {data && (
                <>
                    <SectionTitle>Key Performance Indicators</SectionTitle>
                    <VolumeGrid>
                        {/* Card backgrounds updated to complement the sidebar theme */}
                        <Card bg="linear-gradient(135deg, #a777e3 0%, #6e8efb 100%)" color="white" delay="0.1s">
                            <CardHeader>
                                <CardLabel>Total Registered</CardLabel>
                                <IconBox iconBg="rgba(255,255,255,0.2)" iconColor="white">
                                    <i className="bi bi-people-fill"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue>{data.patients?.total_registered || 0}</CardValue>
                            <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>Patients Registered</div>
                        </Card>
                        <Card bg="linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)" color="white" delay="0.2s">
                            <CardHeader>
                                <CardLabel>Total Samples</CardLabel>
                                <IconBox iconBg="rgba(255,255,255,0.2)" iconColor="white">
                                    <i className="bi bi-droplet-half"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue>{data.samples.total}</CardValue>
                            <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>Collected Samples</div>
                        </Card>
                        <Card bg="linear-gradient(135deg, #e56f8f 0%, #ff9a9e 100%)" color="white" delay="0.3s">
                            <CardHeader>
                                <CardLabel>Total Tests</CardLabel>
                                <IconBox iconBg="rgba(255,255,255,0.2)" iconColor="white">
                                    <i className="bi bi-activity"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue>{data.tests.total}</CardValue>
                            <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>Processed Tests Count</div>
                        </Card>
                        <Card bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" color="white" delay="0.35s">
                            <CardHeader>
                                <CardLabel>Total Discount</CardLabel>
                                <IconBox iconBg="rgba(255,255,255,0.2)" iconColor="white">
                                    <i className="bi bi-percent"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ fontSize: '2rem' }}>{formatCurrency(data.financials?.total_discount || data.financials?.discount || 0)}</CardValue>
                            <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>Total Discounts Offered</div>
                        </Card>
                        <Card bg="linear-gradient(135deg, #6e8efb 0%, #4facfe 100%)" color="white" delay="0.4s">
                            <CardHeader>
                                <CardLabel>Total Revenue (Net)</CardLabel>
                                <IconBox iconBg="rgba(255,255,255,0.2)" iconColor="white">
                                    <i className="bi bi-currency-rupee"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ fontSize: '2rem' }}>{formatCurrency(data.financials.net_amount)}</CardValue>
                            <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>Across All Segments</div>
                        </Card>
                    </VolumeGrid>

                    <SectionTitle>Visual Analytics</SectionTitle>
                    <ChartsGrid>
                        <Card delay="0.4s" justify="flex-start" minHeight="400px">
                            <CardHeader style={{ marginBottom: '2rem' }}>
                                <CardLabel style={{ color: '#555', fontSize: '1.2rem' }}>Sample Volume by Segment</CardLabel>
                                <IconBox iconBg="rgba(110, 142, 251, 0.1)" iconColor="#6e8efb">
                                    <i className="bi bi-bar-chart-fill"></i>
                                </IconBox>
                            </CardHeader>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={segmentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
                                        {segmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>

                        <Card delay="0.5s" justify="flex-start" minHeight="400px">
                            <CardHeader style={{ marginBottom: '2rem' }}>
                                <CardLabel style={{ color: '#555', fontSize: '1.2rem' }}>Revenue Distribution</CardLabel>
                                <IconBox iconBg="rgba(167, 119, 227, 0.1)" iconColor="#a777e3">
                                    <i className="bi bi-pie-chart-fill"></i>
                                </IconBox>
                            </CardHeader>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={revenueData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={1500}
                                    >
                                        {revenueData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </ChartsGrid>

                    <SectionTitle>Segment Volume Breakdown</SectionTitle>
                    <SegmentGrid>
                        <Card delay="0.4s" style={{ borderLeft: '5px solid #6e8efb' }}>
                            <CardHeader>
                                <CardLabel style={{ color: '#555' }}>Home Collection</CardLabel>
                                <IconBox iconBg="rgba(110, 142, 251, 0.1)" iconColor="#6e8efb">
                                    <i className="bi bi-house-door"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ color: '#333' }}>{data.samples.segments.home_collection}</CardValue>
                        </Card>
                        <Card delay="0.5s" style={{ borderLeft: '5px solid #a777e3' }}>
                            <CardHeader>
                                <CardLabel style={{ color: '#555' }}>B2B / Clients</CardLabel>
                                <IconBox iconBg="rgba(167, 119, 227, 0.1)" iconColor="#a777e3">
                                    <i className="bi bi-briefcase"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ color: '#333' }}>{data.samples.segments.b2b}</CardValue>
                        </Card>
                        <Card delay="0.55s" style={{ borderLeft: '5px solid #8b5cf6' }}>
                            <CardHeader>
                                <CardLabel style={{ color: '#555' }}>Shanmuga 360</CardLabel>
                                <IconBox iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8b5cf6">
                                    <i className="bi bi-person-workspace"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ color: '#333' }}>{data.samples.segments.shanmuga_360 || 0}</CardValue>
                        </Card>
                        <Card delay="0.6s" style={{ borderLeft: '5px solid #e56f8f' }}>
                            <CardHeader>
                                <CardLabel style={{ color: '#555' }}>Franchise</CardLabel>
                                <IconBox iconBg="rgba(229, 111, 143, 0.1)" iconColor="#e56f8f">
                                    <i className="bi bi-shop"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ color: '#333' }}>{data.samples.segments.franchise}</CardValue>
                        </Card>
                        <Card delay="0.7s" style={{ borderLeft: '5px solid #00b894' }}>
                            <CardHeader>
                                <CardLabel style={{ color: '#555' }}>Corp Health</CardLabel>
                                <IconBox iconBg="rgba(0, 184, 148, 0.1)" iconColor="#00b894">
                                    <i className="bi bi-building"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ color: '#333' }}>{data.samples.segments.company_health_check}</CardValue>
                        </Card>
                        <Card delay="0.8s" style={{ borderLeft: '5px solid #fdcb6e' }}>
                            <CardHeader>
                                <CardLabel style={{ color: '#555' }}>Hospital</CardLabel>
                                <IconBox iconBg="rgba(253, 203, 110, 0.1)" iconColor="#fdcb6e">
                                    <i className="bi bi-hospital"></i>
                                </IconBox>
                            </CardHeader>
                            <CardValue style={{ color: '#333' }}>{data.samples.segments.hospital}</CardValue>
                        </Card>
                    </SegmentGrid>

                    <SectionTitle>Financial Intelligence</SectionTitle>
                    <FinancialSection>
                        <FinancialCard>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#333' }}>Revenue Sources (Net Amount)</h3>
                                <IconBox iconBg="linear-gradient(135deg, #a777e3, #e56f8f)" iconColor="white">
                                    <i className="bi bi-wallet2"></i>
                                </IconBox>
                            </div>

                            <TableRow>
                                <TableLabel>
                                    <MainLabel>B2B Revenue</MainLabel>
                                    <SubLabel>Business to Business</SubLabel>
                                </TableLabel>
                                <TableValue>{formatCurrency(data.financials.gross.b2b)}</TableValue>
                            </TableRow>
                            <TableRow>
                                <TableLabel>
                                    <MainLabel>Home Collection</MainLabel>
                                    <SubLabel>Direct to Consumer</SubLabel>
                                </TableLabel>
                                <TableValue>{formatCurrency(data.financials.gross.home_collection)}</TableValue>
                            </TableRow>
                            <TableRow>
                                <TableLabel>
                                    <MainLabel>Shanmuga 360</MainLabel>
                                    <SubLabel>360 Diagnostic Revenue</SubLabel>
                                </TableLabel>
                                <TableValue>{formatCurrency(data.financials.gross.shanmuga_360 || 0)}</TableValue>
                            </TableRow>
                            <TableRow>
                                <TableLabel>
                                    <MainLabel>Corporate Checkup</MainLabel>
                                    <SubLabel>Bulk Screening</SubLabel>
                                </TableLabel>
                                <TableValue>{formatCurrency(data.financials.gross.company_health_check)}</TableValue>
                            </TableRow>
                            <TableRow>
                                <TableLabel>
                                    <MainLabel>Franchise Share</MainLabel>
                                    <SubLabel>Partner Revenue</SubLabel>
                                </TableLabel>
                                <TableValue>{formatCurrency(data.financials.gross.franchise_share)}</TableValue>
                            </TableRow>
                        </FinancialCard>

                        <FinancialCard>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#333' }}>Consolidated Summary</h3>
                                <IconBox iconBg="linear-gradient(135deg, #6e8efb, #4facfe)" iconColor="white">
                                    <i className="bi bi-pie-chart"></i>
                                </IconBox>
                            </div>

                            <Card bg="#FFF5F5" style={{ marginBottom: '1.5rem', border: '1px solid #FFDada', height: 'auto', padding: '1.5rem', boxShadow: 'none' }}>
                                <CardLabel style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Pending Collections</CardLabel>
                                <CardValue style={{ fontSize: '1.8rem', color: '#c0392b' }}>{formatCurrency(data.financials.credit_amount)}</CardValue>
                                <div style={{ fontSize: '0.8rem', color: '#e74c3c', marginTop: '0.5rem' }}>
                                    <i className="bi bi-exclamation-circle-fill" style={{ marginRight: '5px' }}></i>
                                </div>
                            </Card>

                            <Card bg="#fffbe6" style={{ marginBottom: '1.5rem', border: '1px solid #ffe58f', height: 'auto', padding: '1.5rem', boxShadow: 'none' }}>
                                <CardLabel style={{ color: '#d48806', marginBottom: '0.5rem' }}>Total Discount Offered</CardLabel>
                                <CardValue style={{ fontSize: '1.8rem', color: '#d48806' }}>{formatCurrency(data.financials?.total_discount || data.financials?.discount || 0)}</CardValue>
                                <div style={{ fontSize: '0.8rem', color: '#d48806', marginTop: '0.5rem' }}>
                                    <i className="bi bi-percent" style={{ marginRight: '5px' }}></i>
                                    Discounts applied on billing
                                </div>
                            </Card>

                            <Card bg="#f0fdf4" style={{ border: '1px solid #bbf7d0', height: 'auto', padding: '1.5rem', boxShadow: 'none' }}>
                                <CardLabel style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Total Net Amount</CardLabel>
                                <CardValue style={{ fontSize: '2rem', color: '#16a34a' }}>{formatCurrency(data.financials.net_amount)}</CardValue>
                                <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.5rem' }}>
                                    <i className="bi bi-check-circle-fill" style={{ marginRight: '5px' }}></i>
                                    After discounts & adjustments
                                </div>
                            </Card>
                        </FinancialCard>
                    </FinancialSection>
                </>
            )}
        </DashboardContainer>
    );
};

export default MDashboard;