
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../Auth/apiRequest";
import { Search, Calendar, RefreshCw, AlertCircle } from "lucide-react";

// --- Styled Components ---

const PageContainer = styled.div`
  padding: 30px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleIcon = styled.div`
  background: #fee2e2;
  color: #ef4444;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  align-items: flex-end;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 45px;

  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
  }
`;

const ResetButton = styled.button`
  padding: 12px 24px;
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  height: 45px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f8fafc;
  padding: 16px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;
  vertical-align: middle;

  &:last-child {
    border-bottom: none;
  }
`;

const Tr = styled.tr`
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  background: #fef2f2; 
  color: #dc2626;
`;

const NoDatacontainer = styled.div`
  padding: 60px;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

// --- Main Component ---

const RejectedSamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Set default dates to today on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    fetchRejectedSamples(today, today);
  }, []);

  const fetchRejectedSamples = async (start, end) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiRequest(
        `${Labbaseurl}get_rejected_samples/`,
        "POST",
        {
          from_date: start,
          to_date: end
        }
      );

      if (response.success && response.data && response.data.data) {
        setSamples(response.data.data);
        toast.success(`Found ${response.data.count} rejected samples`);
      } else {
        setSamples([]);
        toast.info(response.error || "No rejected samples found");
      }
    } catch (error) {
      console.error("Error fetching rejected samples:", error);
      toast.error("Failed to fetch rejected samples");
      setSamples([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select both From Date and To Date");
      return;
    }
    fetchRejectedSamples(fromDate, toDate);
  };

  const handleReset = () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    fetchRejectedSamples(today, today);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <PageContainer>
      <ToastContainer position="top-right" autoClose={3000} />

      <Header>
        <Title>
          <TitleIcon>
            <AlertCircle size={24} />
          </TitleIcon>
          Rejected Samples Report
        </Title>
      </Header>

      <FilterCard>
        <FormGroup>
          <Label>From Date</Label>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label>To Date</Label>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>
        </FormGroup>

        <div style={{ display: 'flex', gap: '10px' }}>
          <SearchButton onClick={handleSearch} disabled={loading}>
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            Search Records
          </SearchButton>
          <ResetButton onClick={handleReset}>
            <RefreshCw size={18} />
            Reset
          </ResetButton>
        </div>
      </FilterCard>

      <TableCard>
        {samples.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Test Date</Th>
                  <Th>Rejected Time</Th>
                  <Th>Patient ID</Th>
                  <Th>Barcode</Th>
                  <Th>Test Name</Th>
                  <Th>Sample Collector</Th>
                  <Th>Rejected By</Th>
                  <Th>Remarks</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample, index) => (
                  <Tr key={index}>
                    <Td>{formatDate(sample.date).split(',')[0]}</Td>
                    <Td style={{ fontWeight: 500 }}>{formatDate(sample.rejected_time)}</Td>
                    <Td style={{ fontWeight: 600, color: '#6366f1' }}>{sample.patient_id}</Td>
                    <Td>{sample.barcode}</Td>
                    <Td style={{ fontWeight: 500, color: '#1e293b' }}>{sample.testname}</Td>
                    <Td>{sample.samplecollector}</Td>
                    <Td>{sample.rejected_by}</Td>
                    <Td style={{ color: '#ef4444', fontStyle: 'italic' }}>{sample.remarks}</Td>
                    <Td>
                      <StatusBadge>{sample.samplestatus}</StatusBadge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <NoDatacontainer>
            <AlertCircle size={48} color="#e2e8f0" />
            <h3>No Rejected Samples Found</h3>
            <p>Try adjusting the date range filters.</p>
          </NoDatacontainer>
        )}
      </TableCard>
    </PageContainer>
  );
};

export default RejectedSamples;
