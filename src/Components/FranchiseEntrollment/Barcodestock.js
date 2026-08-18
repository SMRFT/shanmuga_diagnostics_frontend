// Barcodestock.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import apiRequest from '../Auth/apiRequest';

// === COLORS FROM SIDEBAR PALETTE ===
const colors = {
  primary: {
    darkTeal: '#5a6fd6',
    deepTeal: '#6e8efb',
    teal: '#8e7fe8',
    mediumTeal: '#a777e3',
    brightTeal: '#c471d0',
    lightTeal: '#e0a0c0',
    paleTeal: '#e56f8f',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)',
    secondary: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)',
    accent: 'linear-gradient(135deg, #a777e3 0%, #e56f8f 100%)',
    background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)',
    dualTone: 'linear-gradient(145deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)',
  },
  backgrounds: {
    main: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)',
    page: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)',
    liquid: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 50%, #e56f8f 100%)'
  }
};

// Floating animation for background elements
const float = keyframes`
  0%, 100% { 
    transform: translate(0, 0) rotate(0deg) scale(1); 
  }
  33% { 
    transform: translate(30px, -30px) rotate(120deg) scale(1.1); 
  }
  66% { 
    transform: translate(-20px, 20px) rotate(240deg) scale(0.9); 
  }
`;

const Barcodestock = () => {
// apiRequest is imported from Auth/apiRequest

  const [formData, setFormData] = useState({
    startbarcode: '',
    endbarcode: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // === Barcode list / table state ===
  const todayStr = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [barcodeList, setBarcodeList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [editRows, setEditRows] = useState({}); // { [barcode_id]: { startbarcode, endbarcode } }
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchBarcodeList = async (fromVal = fromDate, toVal = toDate) => {
    setIsTableLoading(true);
    const response = await apiRequest(
      `${Labbaseurl}getandupdatebarcode/?from_date=${fromVal}&to_date=${toVal}`,
      'GET'
    );
    if (response.success) {
      setBarcodeList(Array.isArray(response.data) ? response.data : []);
    } else {
      setIsError(true);
      setMessage(response.error);
      setBarcodeList([]);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchBarcodeList(fromDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const getFieldValue = (row, field) =>
    editRows[row.barcode_id]?.[field] ?? row[field];

  const handleEditChange = (barcode_id, field, value) => {
    setEditRows((prev) => ({
      ...prev,
      [barcode_id]: {
        ...prev[barcode_id],
        [field]: value,
      },
    }));
  };

  const handleUpdateRow = async (row) => {
    setUpdatingId(row.barcode_id);
    const currentUserId =
      localStorage.getItem('employeeId') ||
      localStorage.getItem('employee_id') ||
      localStorage.getItem('auth-user-id') ||
      localStorage.getItem('name') ||
      localStorage.getItem('username') ||
      '';

    const payload = {
      barcode_id: row.barcode_id,
      startbarcode: getFieldValue(row, 'startbarcode'),
      endbarcode: getFieldValue(row, 'endbarcode'),
      modifedby: currentUserId,
    };

    const response = await apiRequest(
      `${Labbaseurl}getandupdatebarcode/`,
      'PUT',
      payload
    );

    if (response.success) {
      setIsError(false);
      setMessage(response.data?.message || 'Barcode updated successfully');
      setEditRows((prev) => {
        const copy = { ...prev };
        delete copy[row.barcode_id];
        return copy;
      });
      fetchBarcodeList(fromDate, toDate);
    } else if (response.status === 400) {
      const fieldErrors = response.data;
      const firstErrorMsg =
        fieldErrors && typeof fieldErrors === 'object'
          ? Object.values(fieldErrors)[0]?.[0]
          : null;
      setIsError(true);
      setMessage(firstErrorMsg || response.error);
    } else {
      setIsError(true);
      setMessage(response.error);
    }
    setUpdatingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const response = await apiRequest(
      `${Labbaseurl}stockbarcode/`,
      'POST',
      formData
    );

    if (response.success) {
      // Backend success response, e.g. { message: 'Barcode stock saved successfully' }
      setIsError(false);
      setMessage(response.data?.message || 'Saved successfully');
      setFormData({ startbarcode: '', endbarcode: '' });
      if (fromDate <= todayStr && toDate >= todayStr) {
        fetchBarcodeList(fromDate, toDate);
      }
    } else if (response.status === 400) {
      // response.data here is serializer.errors, e.g. { startbarcode: ['This field is required.'] }
      const fieldErrors = response.data;
      const firstErrorMsg =
        fieldErrors && typeof fieldErrors === 'object'
          ? Object.values(fieldErrors)[0]?.[0]
          : null;
      setIsError(true);
      setMessage(firstErrorMsg || response.error);
    } else {
      // 401, 500, network error, etc. — apiRequest already gives a friendly message
      setIsError(true);
      setMessage(response.error);
    }

    setIsLoading(false);
  };

  return (
    <PageWrapper>
      <AnimatedBackground>
        <FloatingShape delay="0s" />
        <FloatingShape delay="2s" />
        <FloatingShape delay="4s" />
      </AnimatedBackground>

      {message && (
        <Toast $isError={isError}>
          <ToastIcon>{isError ? '⚠️' : '✅'}</ToastIcon>
          <ToastText>{message}</ToastText>
          <ToastClose onClick={() => setMessage('')}>×</ToastClose>
        </Toast>
      )}

      <FormCard>
        <Header>
            <Icon>🔖</Icon>
            <div>
              <Title>Barcode Stock Entry</Title>
              <Subtitle>Enter barcode range to manage stock efficiently</Subtitle>
            </div>
          </Header>

          <Form onSubmit={handleSubmit} autoComplete="off">
            <InputGroup>
              <Label htmlFor="startbarcode">Start Barcode</Label>
              <Input
                id="startbarcode"
                type="text"
                name="startbarcode"
                value={formData.startbarcode}
                onChange={handleChange}
                placeholder="Eg: 000123"
                required
                autoComplete="off"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="endbarcode">End Barcode</Label>
              <Input
                id="endbarcode"
                type="text"
                name="endbarcode"
                value={formData.endbarcode}
                onChange={handleChange}
                placeholder="Eg: 000234"
                required
                autoComplete="off"
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : <>💾 Save Barcode Stock</>}
            </SubmitButton>
          </Form>
        </FormCard>

        <TableCard>
          <TableHeaderRow>
            <TableTitle>📋 Barcode Stock Details</TableTitle>
            <DateFilterGroup>
              <DatePickerWrap>
                <DateLabel htmlFor="fromBarcodeDate">From</DateLabel>
                <DateInput
                  id="fromBarcodeDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </DatePickerWrap>
              <DatePickerWrap>
                <DateLabel htmlFor="toBarcodeDate">To</DateLabel>
                <DateInput
                  id="toBarcodeDate"
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </DatePickerWrap>
            </DateFilterGroup>
          </TableHeaderRow>

          {isTableLoading ? (
            <TableStatus>
              <Spinner /> Loading barcode details...
            </TableStatus>
          ) : barcodeList.length === 0 ? (
            <TableStatus>No barcode stock entries found for this date range.</TableStatus>
          ) : (
            <TableScroll>
              <StyledTable>
                <thead>
                  <tr>
                    <Th>Barcode ID</Th>
                    <Th>Start Barcode</Th>
                    <Th>End Barcode</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {barcodeList.map((row) => (
                    <tr key={row.barcode_id}>
                      <Td>{row.barcode_id}</Td>
                      <Td>
                        <EditInput
                          type="text"
                          value={getFieldValue(row, 'startbarcode')}
                          onChange={(e) =>
                            handleEditChange(row.barcode_id, 'startbarcode', e.target.value)
                          }
                        />
                      </Td>
                      <Td>
                        <EditInput
                          type="text"
                          value={getFieldValue(row, 'endbarcode')}
                          onChange={(e) =>
                            handleEditChange(row.barcode_id, 'endbarcode', e.target.value)
                          }
                        />
                      </Td>
                      <Td>
                        <UpdateButton
                          type="button"
                          disabled={updatingId === row.barcode_id}
                          onClick={() => handleUpdateRow(row)}
                        >
                          {updatingId === row.barcode_id ? <Spinner /> : 'Update'}
                        </UpdateButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableScroll>
          )}
        </TableCard>
        </PageWrapper>

  );
};

// ====== STYLED COMPONENTS ======

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8fafc;
  min-height: 100vh;
  padding: 20px;
`;

const AnimatedBackground = styled.div`
  display: none;
`;

const FloatingShape = styled.div`
  display: none;
`;

const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  max-width: 1400px;
  width: 100%;
  min-width: 0;
  padding: 1.75rem 2rem;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
    border-radius: 14px;
  }
`;

const Header = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  line-height: 1;
  color: #6366f1;

  @media (max-width: 600px) {
    font-size: 1.6rem;
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #4338ca;
  letter-spacing: -0.01em;
  margin: 0 0 0.2rem 0;

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 360px;
  color: ${props => (props.$isError ? '#ef4444' : '#4338ca')};
  font-weight: 500;
  background: #ffffff;
  border: 1px solid ${props => (props.$isError ? '#fecaca' : '#c7d2fe')};
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  animation: ${slideIn} 0.35s ease-out;

  @media (max-width: 480px) {
    left: 16px;
    right: 16px;
    top: 16px;
    max-width: none;
  }
`;

const ToastIcon = styled.span`
  font-size: 1.1rem;
  line-height: 1;
`;

const ToastText = styled.span`
  flex: 1;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0 0 0.4rem;

  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.2rem;

  @media (max-width: 900px) {
    gap: 1rem;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1 1 220px;
  min-width: 180px;

  @media (max-width: 900px) {
    flex: 1 1 160px;
    min-width: 140px;
  }

  @media (max-width: 640px) {
    flex: 0 0 auto;
    min-width: 0;
    width: 100%;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #4338ca;
  font-size: 0.92rem;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
  
  &:focus {
    background: #ffffff;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &:hover:not(:focus) {
    border-color: #94a3b8;
  }
`;

const SubmitButton = styled.button`
  background: #6366f1;
  color: #ffffff;
  padding: 0.85rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);

  @media (max-width: 640px) {
    width: 100%;
  }
  
  &:hover:not(:disabled) {
    background: #4f46e5;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TableCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  max-width: 1400px;
  width: 100%;
  padding: 1.75rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin-top: 1.25rem;
  }
`;

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const TableTitle = styled.h3`
  color: #4338ca;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: 100%;
    gap: 0.75rem;
  }
`;

const DatePickerWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const DateLabel = styled.label`
  font-weight: 600;
  color: #4338ca;
  font-size: 0.9rem;
`;

const DateInput = styled.input`
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  @media (max-width: 480px) {
    flex: 1;
    min-width: 0;
  }
`;

const TableStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: #64748b;
  padding: 2rem 0;
  font-size: 0.95rem;
  text-align: center;
`;

const TableScroll = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.85rem 1rem;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: #6366f1;
  border-bottom: 1px solid #4f46e5;
  z-index: 1;

  @media (max-width: 600px) {
    padding: 0.65rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const Td = styled.td`
  padding: 0.85rem 1rem;
  color: #334155;
  font-size: 0.92rem;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
  background: #ffffff;

  @media (max-width: 600px) {
    padding: 0.65rem 0.75rem;
    font-size: 0.85rem;
  }
`;

const EditInput = styled.input`
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.9rem;
  outline: none;
  width: 120px;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  @media (max-width: 600px) {
    width: 100px;
    padding: 0.4rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const UpdateButton = styled.button`
  background: #6366f1;
  color: #ffffff;
  padding: 0.45rem 0.9rem;
  font-weight: 600;
  font-size: 0.82rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #4f46e5;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

export default Barcodestock;