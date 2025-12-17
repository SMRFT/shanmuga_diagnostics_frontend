import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  Save,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

// Global styles
const GlobalStyle = createGlobalStyle`
 :root {
 --primary: #4361ee;
 --primary-light: #4895ef;
 --primary-dark: #3a0ca3;
 --secondary: #3f37c9;
 --success: #4cc9f0;
 --danger: #f72585;
 --warning: #f8961e;
 --info: #90e0ef;
 --light: #f8f9fa;
 --dark: #212529;
 --gray: #6c757d;
 --gray-light: #e9ecef;
 --border-radius: 8px;
 --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 --transition: all 0.3s ease;
 }
 
 * {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
 }
 
 body {
 font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
 Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
 background-color: #f5f7fb;
 color: var(--dark);
 line-height: 1.5;
 }
`;

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: 1.5rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "var(--primary)" : "var(--gray)")};
  border-bottom: 2px solid
    ${(props) => (props.active ? "var(--primary)" : "transparent")};
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  padding: 1.5rem;
  background-color: var(--light);
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-light);
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: var(--gray);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${(props) =>
    props.required &&
    `
 &::after {
 content: '*';
 color: var(--danger);
 }
 `}
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }

  ${(props) =>
    props.hasIcon &&
    `
 padding-left: 2.5rem;
 `}
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #007bff;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.primary ? "var(--primary)" : "white")};
  color: ${(props) => (props.primary ? "white" : "var(--gray)")};
  border: 1px solid
    ${(props) => (props.primary ? "var(--primary)" : "var(--gray-light)")};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};

  &:hover {
    background-color: ${(props) =>
      props.primary ? "var(--primary-dark)" : "var(--gray-light)"};
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ProgressText = styled.span`
  font-size: 0.875rem;
  color: var(--gray);
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: var(--gray-light);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--primary);
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  ${(props) =>
    props.type === "success" &&
    `
 background-color: rgba(76, 201, 240, 0.1);
 border-left: 4px solid var(--success);
 color: var(--primary-dark);
 `}

  ${(props) =>
    props.type === "error" &&
    `
 background-color: rgba(247, 37, 133, 0.1);
 border-left: 4px solid var(--danger);
 color: var(--danger);
 `}
`;

const LoadingSpinner = styled.div`
  border: 2px solid var(--gray-light);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Toast Component
const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${(props) =>
    props.type === "error" ? "var(--danger)" : "var(--success)"};
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 3.5s forwards;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const B2B = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [salesPersons, setSalesPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL || "";
  
  const [formData, setFormData] = useState({
    // General Tab
    clinicalname: "",
    referrerCode: "",
    type: "",
    salesMapping: "",
    reportDelivery: "",
    report: "",

    // Communication Tab
    email: "",
    phone: "",
    alternateNumber: "",
    address: "",
    area: "",
    state: "",
    city: "",
    pincode: "",

    // Finance Tab
    b2bType: "",
    creditType: "",
    mouCopy: null,
    creditLimit: "",
    invoicePeriod: "",
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

useEffect(() => {
  const fetchSalesPersons = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `${Labbaseurl}sales_person/`,
        "GET"
      );

      console.log("API RESPONSE:", response);
      setSalesPersons(response.data || []);
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchSalesPersons();
}, []);



  // Tab management object
  const tabConfig = {
    general: [
      "clinicalname",
      "referrerCode",
      "type",
      "salesMapping",
      "reportDelivery",
      "report",
    ],
    communication: [
      "email",
      "phone",
      "alternateNumber",
      "address",
      "area",
      "state",
      "city",
      "pincode",
    ],
    finance: [
      "b2bType",
      "creditType",
      "mouCopy",
      "creditLimit",
      "invoicePeriod",
    ],
  };

  // Validation functions for each tab
  const tabValidations = {
    general: () => formData.clinicalname.trim() !== "",
    communication: () => true, // No mandatory fields in communication
    finance: () => {
      if (formData.b2bType === "") return false;
      // If Credit is selected, MOU copy is mandatory
      if (formData.b2bType === "Credit" && !formData.mouCopy) {
        return false;
      }
      return true;
    },
  };

  // Fetch last referrer code on component mount
useEffect(() => {
  handleGetLastReferrerCode();
}, []);

const handleGetLastReferrerCode = async () => {
  try {
    const response = await apiRequest(
      `${Labbaseurl}clinical_name/last/`,
      "GET"
    );

    console.log("API RESPONSE:", response);

    const lastReferrerCode =
      response?.data?.referrerCode || "SD0000";

    const numericPart = parseInt(lastReferrerCode.slice(2), 10) + 1;

    const nextReferrerCode = `SD${String(numericPart).padStart(4, "0")}`;

    setFormData((prev) => ({
      ...prev,
      referrerCode: nextReferrerCode,
    }));
  } catch (error) {
    console.error("Error fetching last referrer code:", error);
    showToast("Failed to generate referrer code", "error");
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate finance tab before submission
    if (!tabValidations.finance()) {
      if (formData.b2bType === "Credit" && !formData.mouCopy) {
        showToast("MOU copy is mandatory for Credit type", "error");
      } else {
        showToast("Please complete all required fields", "error");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          if (key === "mouCopy" && formData[key] instanceof File) {
            submitFormData.append(key, formData[key], formData[key].name);
          } else {
            submitFormData.append(key, formData[key]);
          }
        }
      });

      // Submit directly to clinical_name endpoint using apiRequest
      await apiRequest(
        `${Labbaseurl}clinical_name/`,
        "POST",
        submitFormData
      );

      // Show success toast
      showToast("B2B details successfully added!");

      // Reset form after successful submission
      setFormData({
        clinicalname: "",
        referrerCode: "",
        type: "",
        salesMapping: "",
        reportDelivery: "",
        report: "",
        email: "",
        phone: "",
        alternateNumber: "",
        address: "",
        area: "",
        state: "",
        city: "",
        pincode: "",
        b2bType: "",
        creditType: "",
        mouCopy: null,
        creditLimit: "",
        invoicePeriod: "",
      });

      setActiveTab("general");
      handleGetLastReferrerCode();
    } catch (error) {
      console.error("Error adding clinical name:", error);
      showToast(error.message || "Error saving B2B details. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabSwitch = (tab) => {
    // Prevent form refresh by handling tab change as an event
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const handleNextTab = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const tabs = ["general", "communication", "finance"];
    const currentIndex = tabs.indexOf(activeTab);

    // Validate current tab before moving
    if (!tabValidations[activeTab]()) {
      showToast(`Please complete the ${activeTab} tab requirements`, "error");
      return;
    }

    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevTab = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const tabs = ["general", "communication", "finance"];
    const currentIndex = tabs.indexOf(activeTab);

    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const getTabProgress = () => {
    const tabs = ["general", "communication", "finance"];
    return ((tabs.indexOf(activeTab) + 1) / tabs.length) * 100;
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <CardHeader>
            <Title>B2B Master</Title>
          </CardHeader>

          <CardBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              <TabContainer>
                {Object.keys(tabConfig).map((tab) => (
                  <Tab
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => handleTabSwitch(tab)}
                    type="button"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Tab>
                ))}
              </TabContainer>

              {/* General Tab */}
              {activeTab === "general" && (
                <FormSection>
                  <SectionTitle>General Information</SectionTitle>
                  <FormRow>
                    <FormGroup>
                      <Label required>Clinical Name</Label>
                      <Input
                        type="text"
                        name="clinicalname"
                        value={formData.clinicalname}
                        onChange={handleInputChange}
                        placeholder="Enter clinical name"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Referrer Code</Label>
                      <Input
                        type="text"
                        name="referrerCode"
                        value={formData.referrerCode}
                        onChange={handleInputChange}
                        placeholder="Enter referrer code"
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Type</Label>
                      <RadioGroup>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="type"
                            value="Standalone Lab"
                            checked={formData.type === "Standalone Lab"}
                            onChange={handleInputChange}
                          />
                          Standalone Lab
                        </RadioLabel>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="type"
                            value="Hospital"
                            checked={formData.type === "Hospital"}
                            onChange={handleInputChange}
                          />
                          Hospital
                        </RadioLabel>
                      </RadioGroup>
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>Sales Mapping</Label>
                      {isLoading ? (
                        <p>Loading sales persons...</p>
                      ) : (
                      <Select
                        name="salesMapping"
                        value={formData.salesMapping}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Sales Person</option>

                        {salesPersons.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </Select>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label>Report Delivery</Label>
                      <Select
                        name="reportDelivery"
                        value={formData.reportDelivery}
                        onChange={handleInputChange}
                      >
                        <option value="">Select delivery method</option>
                        <option value="Email">Email</option>
                        <option value="Hard Copy">Hard Copy</option>
                        <option value="WhatsApp">WhatsApp</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Report</Label>
                      <RadioGroup>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="report"
                            value="With Letterpad"
                            checked={formData.report === "With Letterpad"}
                            onChange={handleInputChange}
                          />
                          With Letterpad
                        </RadioLabel>
                        <RadioLabel>
                          <input
                            type="radio"
                            name="report"
                            value="Without Letterpad"
                            checked={formData.report === "Without Letterpad"}
                            onChange={handleInputChange}
                          />
                          Without Letterpad
                        </RadioLabel>
                      </RadioGroup>
                    </FormGroup>
                  </FormRow>
                </FormSection>
              )}

              {/* Communication Tab */}
              {activeTab === "communication" && (
                <FormSection>
                  <SectionTitle>Communication Details</SectionTitle>

                  <FormRow>
                    <FormGroup>
                      <Label>Email</Label>
                      <InputWrapper>
                        <InputIcon>
                          <Mail size={16} />
                        </InputIcon>
                        <Input
                          hasIcon
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                        />
                      </InputWrapper>
                    </FormGroup>
                    <FormGroup>
                      <Label>Phone</Label>
                      <InputWrapper>
                        <InputIcon>
                          <Phone size={16} />
                        </InputIcon>
                        <Input
                          hasIcon
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                        />
                      </InputWrapper>
                    </FormGroup>
                    <FormGroup>
                      <Label>Alternate Number</Label>
                      <Input
                        type="tel"
                        name="alternateNumber"
                        value={formData.alternateNumber}
                        onChange={handleInputChange}
                        placeholder="Enter alternate phone number"
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup fullWidth>
                      <Label>Address</Label>
                      <Textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter full address"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Area</Label>
                      <Input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="Enter area"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>City</Label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>State</Label>
                      <Input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Pincode</Label>
                      <Input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                      />
                    </FormGroup>
                  </FormRow>
                </FormSection>
              )}

              {/* Finance Tab */}
              {activeTab === "finance" && (
                <FormSection>
                  <SectionTitle>Financial Information</SectionTitle>
                  <FormRow>
                    <FormGroup>
                      <Label required>B2B Type</Label>
                      <RadioGroup>
                        <RadioLabel>
                          <RadioInput
                            type="radio"
                            name="b2bType"
                            value="Cash"
                            checked={formData.b2bType === "Cash"}
                            onChange={handleInputChange}
                          />
                          Cash
                        </RadioLabel>
                        <RadioLabel>
                          <RadioInput
                            type="radio"
                            name="b2bType"
                            value="Credit"
                            checked={formData.b2bType === "Credit"}
                            onChange={handleInputChange}
                          />
                          Credit
                        </RadioLabel>
                      </RadioGroup>
                    </FormGroup>

                    {formData.b2bType === "Credit" && (
                      <>
                        <FormGroup>
                          <Label>Credit Type</Label>
                          <RadioGroup>
                            <RadioLabel>
                              <RadioInput
                                type="radio"
                                name="creditType"
                                value="Weekly"
                                checked={formData.creditType === "Weekly"}
                                onChange={handleInputChange}
                              />
                              Weekly
                            </RadioLabel>
                            <RadioLabel>
                              <RadioInput
                                type="radio"
                                name="creditType"
                                value="Monthly"
                                checked={formData.creditType === "Monthly"}
                                onChange={handleInputChange}
                              />
                              Monthly
                            </RadioLabel>
                          </RadioGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label>Credit Limit</Label>
                          <Input
                            type="text"
                            name="creditLimit"
                            value={formData.creditLimit}
                            onChange={handleInputChange}
                            placeholder="Enter credit limit"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Invoice Period</Label>
                          <Input
                            type="text"
                            name="invoicePeriod"
                            value={formData.invoicePeriod}
                            onChange={handleInputChange}
                            placeholder="Enter invoice period"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label required>MOU Copy</Label>
                          <Input
                            type="file"
                            name="mouCopy"
                            onChange={handleInputChange}
                            accept=".pdf,.doc,.docx"
                          />
                          {formData.mouCopy && (
                            <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>
                              Selected: {formData.mouCopy.name}
                            </span>
                          )}
                        </FormGroup>
                      </>
                    )}
                  </FormRow>
                </FormSection>
              )}

              <ProgressContainer>
                <ProgressText>
                  Step{" "}
                  {["general", "communication", "finance"].indexOf(activeTab) +
                    1}{" "}
                  of 3
                </ProgressText>
                <ProgressBar>
                  <ProgressFill progress={getTabProgress()} />
                </ProgressBar>
              </ProgressContainer>

              <ButtonContainer>
                <div>
                  {activeTab !== "general" && (
                    <Button type="button" onClick={handlePrevTab}>
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {activeTab !== "finance" ? (
                    <Button type="button" primary onClick={handleNextTab}>
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      primary
                      disabled={!tabValidations[activeTab]() || isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Submit
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </ButtonContainer>
            </Form>
          </CardBody>
        </Card>
      </Container>

      {/* Success Toast */}
      {showToast && (
        <Toast>
          <Check size={16} />
          B2B details successfully added!
        </Toast>
      )}
    </>
  );
};

export default B2B;