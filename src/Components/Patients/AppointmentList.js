import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendarAlt, FaUser, FaPhone, FaTimesCircle, FaVial, FaInfoCircle } from "react-line-awesome";
import apiRequest from "../Auth/apiRequest";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const PageContainer = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #4a5568;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #f093fb, #667eea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    color: #718096;
    font-size: 16px;
  }
`;

const DateGroup = styled.div`
  margin-bottom: 40px;
`;

const DateHeader = styled.h2`
  font-size: 20px;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const AppointmentCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;

  ${props => props.status === 'Cancelled' && `
    opacity: 0.7;
    filter: grayscale(0.5);
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.status === 'Cancelled' ? '#e53e3e' : 'linear-gradient(to bottom, #f093fb, #667eea)'};
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.status === 'Cancelled' ? '#fed7d7' : '#c6f6d5'};
  color: ${props => props.status === 'Cancelled' ? '#c53030' : '#2f855a'};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #4a5568;
  font-size: 15px;
  
  strong {
    color: #2d3748;
    font-weight: 600;
    margin-right: 5px;
    width: 80px;
  }
`;

const CancelButton = styled.button`
  margin-top: 15px;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid #fc8181;
  color: #e53e3e;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fff5f5;
    box-shadow: 0 2px 8px rgba(229, 62, 62, 0.2);
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;
  justify-content: center;
  
  input {
    padding: 10px;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    font-family: inherit;
  }
  
  button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #f093fb, #667eea);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #a0aec0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 2px dashed #cbd5e0;

  h3 {
    color: #4a5568;
    margin-bottom: 10px;
  }
`;

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const fetchAppointments = async () => {
    setLoading(true);
    let url = `${Labbaseurl}appointments_by_date/`;
    if (fromDate || toDate) {
      const params = new URLSearchParams();
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      url += `?${params.toString()}`;
    }
    
    const result = await apiRequest(url, "GET");
    if (result.success && result.data.appointments) {
      setAppointments(result.data.appointments);
    } else {
      toast.error("Failed to load appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const result = await apiRequest(`${Labbaseurl}appointments/${id}/cancel/`, "PATCH");
      if (result.success) {
        toast.success("Appointment cancelled successfully");
        fetchAppointments(); // Refresh list
      } else {
        toast.error(result.data.message || "Failed to cancel appointment");
      }
    }
  };

  const groupedAppointments = appointments.reduce((acc, curr) => {
    const dateStr = curr.appointment_date.split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(a) - new Date(b));

  const formatDateLabel = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <PageContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <PageHeader>
        <h1>Appointments</h1>
        <p>Manage and track all booked appointments</p>
      </PageHeader>
      
      <FilterSection>
        <div>
          <label style={{marginRight: '8px', color: '#4a5568'}}>From:</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <div>
          <label style={{marginRight: '8px', color: '#4a5568'}}>To:</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
        <button onClick={fetchAppointments}>Search</button>
      </FilterSection>

      {loading ? (
        <EmptyState>
          <h3>Loading appointments...</h3>
        </EmptyState>
      ) : sortedDates.length === 0 ? (
        <EmptyState>
          <h3>No appointments found</h3>
          <p>Book a new appointment to see it listed here.</p>
        </EmptyState>
      ) : (
        sortedDates.map((date) => (
          <DateGroup key={date}>
            <DateHeader>
              📅 {formatDateLabel(date)}
            </DateHeader>
            <CardsGrid>
              {groupedAppointments[date].map((apt) => {
                const aptId = apt.appointment_id;
                return (
                <AppointmentCard key={aptId || apt._id} status={apt.status}>
                  <StatusBadge status={apt.status}>{apt.status || 'Active'}</StatusBadge>
                  
                  <InfoRow>
                    <strong>ID:</strong> {aptId || 'N/A'}
                  </InfoRow>
                  
                  <InfoRow>
                    <strong>Name:</strong> {apt.patient_name}
                  </InfoRow>
                  
                  <InfoRow>
                    <strong>Details:</strong> {apt.age} Yrs / {apt.gender}
                  </InfoRow>
                  
                  <InfoRow>
                    <strong>Mobile:</strong> {apt.mobile_number}
                  </InfoRow>
                  
                  <InfoRow>
                    <strong>Collector:</strong> {apt.sample_collector || 'Not assigned'}
                  </InfoRow>

                  {(!apt.status || apt.status === 'Active') && (
                    <CancelButton onClick={() => handleCancel(aptId)}>
                      Cancel Appointment
                    </CancelButton>
                  )}
                </AppointmentCard>
                );
              })}
            </CardsGrid>
          </DateGroup>
        ))
      )}
    </PageContainer>
  );
};

export default AppointmentList;
