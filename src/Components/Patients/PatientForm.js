import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// <CHANGE> Updated styled components for better UI
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #F8FAFC;
  min-height: 100vh;
`;
const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
`;
const Title = styled.h2`
  text-align: center;
  color: #1E293B;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;
const Fieldset = styled.fieldset`
  border: 2px solid #E2E8F0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  legend {
    padding: 0 10px;
    font-weight: 600;
    color: #1E293B;
    font-size: 18px;
  }
`;
const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
  }
  input, select {
    padding: 10px 12px;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
    &:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    &:disabled {
      background-color: #F3F4F6;
      cursor: not-allowed;
    }
  }
`;
const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: normal;
    cursor: pointer;
    input[type="radio"] {
      margin: 0;
    }
  }
`;
const RequiredIndicator = styled.span`
  color: #EF4444;
  margin-left: 4px;
`;
const SubmitButton = styled.button`
  background: ${props => props.disabled ? '#9CA3AF' : '#3B82F6'};
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover:not(:disabled) {
    background: #2563EB;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const PatientForm = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // <CHANGE> Updated form data structure to match backend models
  const [formData, setFormData] = useState({
    patient_id: "",
    patientname: "",
    age: "",
    age_type: "Year",
    gender: "Male",
    phone: "",
    email: "",
    address: { area: "", pincode: "" },
    branch: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  // <CHANGE> Generate new patient ID on component mount
  useEffect(() => {
    generateNewPatientId();
  }, []);
  const generateNewPatientId = async () => {
    try {
      const response = await fetch(`${Labbaseurl}latest-patient-id/`);
      const data = await response.json();
      setFormData(prev => ({ ...prev, patient_id: data.patient_id }));
    } catch (error) {
      console.error("Error generating patient ID:", error);
      toast.error("Failed to generate patient ID");
    }
  };
  // <CHANGE> Form validation
  useEffect(() => {
    const isValid = formData.patientname.trim() !== "" &&
                   formData.age !== "" &&
                   formData.phone.trim() !== "";
    setIsFormValid(isValid);
  }, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "area" || name === "pincode") {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  // <CHANGE> Updated submit handler to match backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      // <CHANGE> Prepare data according to backend Patient model
      const patientData = {
        patient_id: formData.patient_id,
        patientname: formData.patientname,
        age: parseInt(formData.age),
        age_type: formData.age_type,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        branch: formData.branch,
      };
      const response = await fetch(`${Labbaseurl}create_patient/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      if (response.ok) {
        const result = await response.json();
        toast.success("Patient registered successfully!");
        // Reset form and generate new patient ID
        setFormData({
          patient_id: "",
          patientname: "",
          age: "",
          age_type: "Year",
          gender: "Male",
          phone: "",
          email: "",
          address: { area: "", pincode: "" },
          branch: "",
        });
        generateNewPatientId();
      } else {
        const errorData = await response.json();
        toast.error("Failed to register patient: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to register patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Container>
      <FormCard>
        <Title>Patient Registration Form</Title>
        <form onSubmit={handleSubmit}>
          <Fieldset>
            <legend>Personal Details</legend>
            <FormRow>
              <FormGroup>
                <label>Patient ID</label>
                <input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <label>
                  Patient Name<RequiredIndicator>*</RequiredIndicator>
                </label>
                <input
                  type="text"
                  name="patientname"
                  value={formData.patientname}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <label>
                  Age<RequiredIndicator>*</RequiredIndicator>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Age Type</label>
                <select
                  name="age_type"
                  value={formData.age_type}
                  onChange={handleChange}
                >
                  <option value="Year">Year</option>
                  <option value="Month">Month</option>
                  <option value="Day">Day</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Gender</label>
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
            </FormRow>
          </Fieldset>
          <Fieldset>
            <legend>Contact Details</legend>
            <FormRow>
              <FormGroup>
                <label>
                  Phone Number<RequiredIndicator>*</RequiredIndicator>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <label>Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.address.area}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <label>Pin Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </Fieldset>
          <Fieldset>
            <legend>Lab Details</legend>
            <FormRow>
              <FormGroup>
                <label>Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                />
              </FormGroup>
            </FormRow>
          </Fieldset>
          <ButtonContainer>
            <SubmitButton
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                "Register Patient"
              )}
            </SubmitButton>
          </ButtonContainer>
        </form>
      </FormCard>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </Container>
  );
};
export default PatientForm;