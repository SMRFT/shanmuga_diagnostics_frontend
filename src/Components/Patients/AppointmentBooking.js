import { useState, useEffect } from "react"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaCalendarAlt, FaUser, FaPhone, FaSave } from "react-icons/fa"
import apiRequest from "../Auth/apiRequest"

const FormContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 10px;
  }
`

const StyledTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  &.row-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #4c51bf;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    @media (max-width: 480px) {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
  
  input, select {
    padding: 12px 15px;
    border: 2px solid #e1e8ff;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &::placeholder {
      color: #a0aec0;
    }
    
    @media (max-width: 480px) {
      padding: 10px 12px;
      font-size: 13px;
    }
  }
  
  select {
    cursor: pointer;
  }
`

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 8px;
  flex-wrap: wrap;
  
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
    padding: 10px 16px;
    border: 2px solid #e1e8ff;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.2s;
    margin-bottom: 0;
    font-size: 14px;
    
    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }
    
    input[type="radio"] {
      margin: 0;
      accent-color: #667eea;
      width: 18px;
      height: 18px;
    }
    
    &:has(input:checked) {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      color: #4c51bf;
      font-weight: 600;
    }
    
    @media (max-width: 480px) {
      padding: 8px 12px;
      font-size: 12px;
      gap: 5px;
    }
  }
`

const RequiredIndicator = styled.span`
  color: #f093fb;
  margin-left: 2px;
  font-weight: bold;
`

const SubmitButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #cbd5e0, #a0aec0)"
      : "linear-gradient(135deg, #f093fb, #667eea, #764ba2)"};
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 15px 40px;
  border: none;
  border-radius: 25px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.disabled ? "none" : "0 10px 25px rgba(240, 147, 251, 0.3)")};
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(240, 147, 251, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 25px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`

const SpinnerIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const InfoText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 14px;
  margin-top: 20px;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const AppointmentBooking = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const [formData, setFormData] = useState({
    appointment_date: "",
    patient_name: "",
    gender: "Male",
    age: "",
    mobile_number: "",
    sample_collector: "",
  })
  
  const [sampleCollectors, setSampleCollectors] = useState([])
  
  useEffect(() => {
    const fetchSampleCollectors = async () => {
      try {
        const result = await apiRequest(`${Labbaseurl}sample-collector/`, "GET");
        if (result.success) {
          setSampleCollectors(result.data);
        }
      } catch (error) {
        console.error("Error fetching sample collectors:", error);
      }
    };
    fetchSampleCollectors();
  }, [Labbaseurl]);

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!formData.appointment_date || !formData.patient_name || !formData.age || !formData.mobile_number) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (formData.mobile_number.length !== 10) {
    toast.error("Mobile number must be 10 digits");
    return;
  }

  if (formData.age < 1 || formData.age > 150) {
    toast.error("Please enter a valid age");
    return;
  }

  setIsSubmitting(true);

  try {
    const data = await apiRequest(
      `${Labbaseurl}appointments/`,
      "POST",
      formData
    );

    toast.success("Appointment booked successfully!");

    setFormData({
      appointment_date: "",
      patient_name: "",
      gender: "Male",
      age: "",
      mobile_number: "",
      sample_collector: "",
    });

  } catch (error) {
    console.error("Error:", error.message);
    toast.error(error.message || "Failed to book appointment");
  } finally {
    setIsSubmitting(false);
  }
};


  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <FormContainer>
      <FormCard>
        <StyledTitle>Book Your Appointment</StyledTitle>
        
        <form onSubmit={handleSubmit}>
          <Row>
            <FormGroup>
              <label>
                <FaCalendarAlt />
                Appointment Date<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
                <FaUser />
                Patient Name<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </FormGroup>
          </Row>

          <Row className="row-2">
            <FormGroup>
              <label>
                Gender<RequiredIndicator>*</RequiredIndicator>
              </label>
              <RadioGroup>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <label>
                Age<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="1"
                max="150"
                required
              />
            </FormGroup>
          </Row>

          <Row className="row-2">
            <FormGroup>
              <label>
                <FaPhone />
                Mobile Number<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
                Sample Collector<RequiredIndicator>*</RequiredIndicator>
              </label>
              <select
                name="sample_collector"
                value={formData.sample_collector}
                onChange={handleChange}
                required
              >
                <option value="">Select Collector</option>
                {sampleCollectors.map((sc) => (
                  <option key={sc.employeeId || sc.employeeName} value={sc.employeeId}>
                    {sc.employeeName}
                  </option>
                ))}
              </select>
            </FormGroup>
          </Row>



          <ButtonContainer>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Booking...
                </>
              ) : (
                <>
                  <FaSave />
                  Book Appointment
                </>
              )}
            </SubmitButton>
          </ButtonContainer>

          <InfoText>
            All appointments are subject to availability and confirmation
          </InfoText>
        </form>
      </FormCard>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormContainer>
  )
}

export default AppointmentBooking