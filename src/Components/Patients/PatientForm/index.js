"use client"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Search, ToggleRight, ToggleLeft, Plus, X, Upload, FileText, Calendar, Camera } from "lucide-react"
import RefBy from "../../Forms/RefBy"

import usePatientFormData from "./usePatientFormData"
import { formatAddress } from "./helpers"
import {
  FormContainer,
  FormCard,
  StyledTitle,
  SearchAndAppointmentContainer,
  SearchWrapper,
  SearchContainer,
  PatientSelectionModal,
  ModalContent,
  CloseButton,
  PatientCard,
  Fieldset,
  Row,
  FormGroup,
  SearchableInputWrapper,
  SearchableInput,
  FieldHint,
  SearchableDropdown,
  DropdownItem,
  NoResults,
  FileUploadWrapper,
  FieldWithButton,
  ToggleContainer,
  RadioGroup,
  RequiredIndicator,
  SubmitButton,
  ButtonContainer,
  StatusIndicator,
  SpinnerIcon,
  AppointmentButton,
} from "./styles"

const PatientForm = () => {
  const {
    showRefByForm,
    setShowRefByFormForm,
    showPatientModal,
    setShowPatientModal,
    multiplePatients,
    prescriptionFile,
    showAppointmentModal,
    setShowAppointmentModal,
    appointmentPatients,
    isLoadingAppointments,
    patientSelectionSource,
    refBySearchValue,
    showRefByDropdown,
    setShowRefByDropdown,
    clinicalSearchValue,
    showClinicalDropdown,
    setShowClinicalDropdown,
    isRefBySelectedFromDropdown,
    isClinicalSelectedFromDropdown,
    refByError,
    clinicalError,
    formData,
    isB2BEnabled,
    isHomeCollectionEnabled,
    isEmergencyEnabled,
    dropdownOptions,
    searchValue,
    isSubmitting,
    isExistingPatient,
    handleChange,
    handleFileChange,
    handleB2BToggle,
    handleHomeCollectionToggle,
    handleEmergencyToggle,
    handleClinicalNameSearch,
    handleClinicalNameSelect,
    handleRefBySearch,
    handleRefBySelect,
    getFilteredRefBys,
    getFilteredClinicalNames,
    handleSearchChange,
    handlePatientSelect,
    handleSubmit,
    fetchTodayAppointments,
    handleAppointmentSelect,
    shouldDisableField,
  } = usePatientFormData()

  return (
    <FormContainer>
      <FormCard>
        <StyledTitle>Patient Registration & Billing System</StyledTitle>

        <SearchAndAppointmentContainer>
          <SearchWrapper>
            <SearchContainer>
              <Search size={18} />
              <input
                type="text"
                placeholder="Enter 10-digit Mobile Number to search patient"
                value={searchValue}
                onChange={handleSearchChange}
                maxLength={10}
              />
            </SearchContainer>

            {showPatientModal && (
              <PatientSelectionModal>
                <ModalContent>
                  <CloseButton onClick={() => setShowPatientModal(false)}>
                    <X />
                  </CloseButton>
                    <h3>
                      Select Patient ({multiplePatients.length} found with phone {searchValue})
                    </h3>

                    {multiplePatients.map((patient, index) => (
                      <PatientCard key={index} onClick={() => handlePatientSelect(patient)}>
                        <div className="patient-header">
                          {patient.patient_id && <span className="patient-id-badge">{patient.patient_id}</span>}
                          {patient.emergency && <span className="emergency-badge">🚨 EMERGENCY</span>}
                        </div>

                        <div className="patient-info">
                          <div className="info-item">
                            <span className="label">Name</span>
                            <span className="value">{patient.patientname || "N/A"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Age</span>
                            <span className="value">
                              {patient.age} {patient.age_type || "Years"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Gender</span>
                            <span className="value">{patient.gender || "N/A"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Phone</span>
                            <span className="value">{patient.phone || "N/A"}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Email</span>
                            <span className={`value ${!patient.email ? "empty" : ""}`}>
                              {patient.email || "Not provided"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Address</span>
                            <span className={`value ${formatAddress(patient.address) === "N/A" ? "empty" : ""}`}>
                              {formatAddress(patient.address)}
                            </span>
                          </div>
                          {patient.patient_history && (
                            <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                              <span className="label">Medical History</span>
                              <span className="value">{patient.patient_history}</span>
                            </div>
                          )}
                        </div>

                        <button
                          className="select-button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePatientSelect(patient)
                          }}
                        >
                          Select This Patient
                        </button>
                      </PatientCard>
                    ))}
                  </ModalContent>
              </PatientSelectionModal>
            )}

            {showAppointmentModal && (
              <PatientSelectionModal>
                <ModalContent>
                  <CloseButton onClick={() => setShowAppointmentModal(false)}>
                    <X />
                  </CloseButton>
                  <h3>Today's Appointments ({appointmentPatients.length} found)</h3>

                  {appointmentPatients.map((appointment, index) => (
                    <PatientCard
                      key={index}
                      onClick={() => {
                        if (appointment.status !== "Registered") {
                          handleAppointmentSelect(appointment)
                        }
                      }}
                      style={appointment.status === "Registered" ? { opacity: 0.7, cursor: "not-allowed" } : {}}
                    >
                      <div className="patient-header">
                        <span className="patient-id-badge">
                          {appointment.patient_id || `APT-${appointment.appointment_id || index + 1}`}
                        </span>
                        {appointment.emergency && <span className="emergency-badge">🚨 EMERGENCY</span>}
                      </div>

                      <div className="patient-info">
                        <div className="info-item">
                          <span className="label">Name</span>
                          <span className="value">{appointment.patient_name || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Appointment Time</span>
                          <span className="value">
                            {appointment.appointment_date
                              ? new Date(appointment.appointment_date).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Age</span>
                          <span className="value">
                            {appointment.age} {appointment.age_type || "Years"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Gender</span>
                          <span className="value">{appointment.gender || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Phone</span>
                          <span className="value">{appointment.mobile_number || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email</span>
                          <span className={`value ${!appointment.email ? "empty" : ""}`}>
                            {appointment.email || "Not provided"}
                          </span>
                        </div>
                        {appointment.patient_history && (
                          <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                            <span className="label">Medical History</span>
                            <span className="value">{appointment.patient_history}</span>
                          </div>
                        )}
                      </div>

                      <button
                        className="select-button"
                        disabled={appointment.status === "Registered"}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (appointment.status !== "Registered") {
                            handleAppointmentSelect(appointment)
                          }
                        }}
                        style={appointment.status === "Registered" ? { background: "#ccc", color: "#666", cursor: "not-allowed" } : {}}
                      >
                        {appointment.status === "Registered" ? "Already Registered" : "Load This Patient"}
                      </button>
                    </PatientCard>
                  ))}
                </ModalContent>
              </PatientSelectionModal>
            )}
          </SearchWrapper>

          <AppointmentButton onClick={fetchTodayAppointments} disabled={isLoadingAppointments}>
            <Calendar />
            {isLoadingAppointments ? "Loading..." : "Today's Appointments"}
          </AppointmentButton>
        </SearchAndAppointmentContainer>

        {patientSelectionSource === "search" && isExistingPatient && (
          <StatusIndicator className="existing">✓ Existing Patient Found - Fields are Read-Only</StatusIndicator>
        )}

        {patientSelectionSource === "appointment" && isExistingPatient && (
          <StatusIndicator className="new">📅 Appointment Patient Loaded - Fields are Editable</StatusIndicator>
        )}

        {isEmergencyEnabled && (
          <StatusIndicator className="emergency">🚨 EMERGENCY CASE - Priority Processing</StatusIndicator>
        )}

        {showPatientModal && (
          <StatusIndicator className="multiple">⚠ Multiple Patients Found - Please Select One</StatusIndicator>
        )}

        <form onSubmit={handleSubmit}>
          <Fieldset>
            <h4>Lab Details</h4>
            <input type="hidden" name="lab_id" value={formData.lab_id} />
            <Row className="row-4">
              <FormGroup>
                <label>Date & Time</label>
                <input type="text" name="date" value={formData.date} onChange={handleChange} disabled />
              </FormGroup>

              {/* ---- Ref By with dropdown-selection enforcement ---- */}
              <FieldWithButton>
                <FormGroup className="field-input">
                  <label>
                    Ref By<RequiredIndicator>*</RequiredIndicator>
                  </label>
                  <SearchableInputWrapper>
                    <SearchableInput
                      type="text"
                      value={refBySearchValue}
                      onChange={handleRefBySearch}
                      onFocus={() => setShowRefByDropdown(true)}
                      onBlur={() => setTimeout(() => setShowRefByDropdown(false), 200)}
                      placeholder="Type to search, then select"
                      required
                      $hasError={refByError}
                    />
                    {showRefByDropdown && (
                      <SearchableDropdown>
                        {getFilteredRefBys().length > 0 ? (
                          getFilteredRefBys().map((refby, index) => (
                            <DropdownItem
                              key={index}
                              onMouseDown={(e) => {
                                e.preventDefault()
                                handleRefBySelect(refby)
                              }}
                            >
                              {refby.name}
                            </DropdownItem>
                          ))
                        ) : (
                          <NoResults>No matching referrers found</NoResults>
                        )}
                      </SearchableDropdown>
                    )}
                  </SearchableInputWrapper>
                  {refByError && (
                    <FieldHint $error>⚠ Please select from the dropdown list</FieldHint>
                  )}
                  {!refByError && refBySearchValue && !isRefBySelectedFromDropdown && (
                    <FieldHint>Type and select an option from the list</FieldHint>
                  )}
                </FormGroup>
                <button type="button" onClick={() => setShowRefByFormForm(true)} title="Add new Refby">
                  <Plus />
                </button>
              </FieldWithButton>

              <FormGroup>
                <label>
                  Branch<RequiredIndicator>*</RequiredIndicator>
                </label>
                <select name="branch" value={formData.branch} onChange={handleChange} required>
                  <option value="">Select a Branch</option>
                  <option value="Shanmuga Reference Lab">Shanmuga Reference Lab</option>
                </select>
              </FormGroup>

              <ToggleContainer>
                <label>Emergency</label>
                <div onClick={handleEmergencyToggle}>
                  {isEmergencyEnabled ? (
                    <ToggleRight size={40} color="red" />
                  ) : (
                    <ToggleLeft size={40} color="grey" />
                  )}
                </div>
              </ToggleContainer>
            </Row>

            <Row className="row-4">
              <ToggleContainer>
                <label>B2B</label>
                <div onClick={handleB2BToggle} className={isHomeCollectionEnabled ? "disabled" : ""}>
                  {isB2BEnabled ? (
                    <ToggleRight size={40} color="green" />
                  ) : (
                    <ToggleLeft size={40} color="grey" />
                  )}
                </div>
              </ToggleContainer>

              {/* ---- Clinical Name with dropdown-selection enforcement ---- */}
              <FormGroup>
                <label>Clinical Name{isB2BEnabled && <RequiredIndicator>*</RequiredIndicator>}</label>
                <SearchableInputWrapper>
                  <SearchableInput
                    type="text"
                    value={clinicalSearchValue}
                    onChange={handleClinicalNameSearch}
                    onFocus={() => isB2BEnabled && setShowClinicalDropdown(true)}
                    onBlur={() => setTimeout(() => setShowClinicalDropdown(false), 200)}
                    placeholder="Type to search, then select"
                    disabled={!isB2BEnabled}
                    required={isB2BEnabled}
                    $hasError={clinicalError}
                  />
                  {showClinicalDropdown && isB2BEnabled && (
                    <SearchableDropdown>
                      {getFilteredClinicalNames().length > 0 ? (
                        getFilteredClinicalNames().map((clinical, index) => (
                          <DropdownItem
                            key={index}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              handleClinicalNameSelect(clinical)
                            }}
                          >
                            {clinical.clinicalname}
                          </DropdownItem>
                        ))
                      ) : (
                        <NoResults>No matching clinical names found</NoResults>
                      )}
                    </SearchableDropdown>
                  )}
                </SearchableInputWrapper>
                {clinicalError && (
                  <FieldHint $error>⚠ Please select from the dropdown list</FieldHint>
                )}
                {!clinicalError && clinicalSearchValue && isB2BEnabled && !isClinicalSelectedFromDropdown && (
                  <FieldHint>Type and select an option from the list</FieldHint>
                )}
              </FormGroup>

              <FormGroup>
                <label>Sales Representative</label>
                <input type="text" name="salesMapping" value={formData.salesMapping} onChange={handleChange} readOnly />
              </FormGroup>

              <FormGroup>
                <label>Area of B2B</label>
                <input type="text" name="b2b_area" value={formData.b2b_area || ""} onChange={handleChange} readOnly />
              </FormGroup>
            </Row>

            <Row className="row-4">
              <ToggleContainer>
                <label>Home Collection</label>
                <div onClick={handleHomeCollectionToggle} className={isB2BEnabled ? "disabled" : ""}>
                  {isHomeCollectionEnabled ? (
                    <ToggleRight size={40} color="green" />
                  ) : (
                    <ToggleLeft size={40} color="grey" />
                  )}
                </div>
              </ToggleContainer>

              <FormGroup>
                <label>
                  Sample Collector<RequiredIndicator>*</RequiredIndicator>
                </label>
                <select name="sample_collector" value={formData.sample_collector} onChange={handleChange} required>
                  <option value="">Select Sample Collector</option>
                  {dropdownOptions.sampleCollectors.map((collector, index) => (
                    <option key={index} value={collector.employeeId}>
                      {collector.employeeName}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Row>
          </Fieldset>

          <Fieldset>
            <h4>Personal Details</h4>
            <Row className="row-5">
              <FormGroup>
                <label>Patient ID</label>
                <input type="text" name="patient_id" value={formData.patient_id} readOnly />
              </FormGroup>
              <FormGroup>
                <label>Title</label>
                <select name="Title" value={formData.Title} onChange={handleChange} disabled={shouldDisableField()}>
                  <option value="Mr.">Mr</option>
                  <option value="Mrs.">Mrs</option>
                  <option value="Ms.">Ms</option>
                  <option value="Master.">Master</option>
                  <option value="Miss.">Miss</option>
                  <option value="Dr.">Dr</option>
                  <option value="Baby.">Baby</option>
                  <option value="Baby of.">Baby of</option>
                </select>
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
                  disabled={shouldDisableField()}
                />
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
                  required
                  disabled={shouldDisableField()}
                />
              </FormGroup>
              <FormGroup>
                <label>Age Type</label>
                <select
                  name="age_type"
                  value={formData.age_type}
                  onChange={handleChange}
                  disabled={shouldDisableField()}
                >
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </select>
              </FormGroup>
            </Row>

            <Row>
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
                      disabled={shouldDisableField()}
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
                      disabled={shouldDisableField()}
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
                      disabled={shouldDisableField()}
                    />
                    Other
                  </label>
                </RadioGroup>
              </FormGroup>
            </Row>
          </Fieldset>

          <Fieldset disabled={isB2BEnabled}>
            <h4>Contact Details {isB2BEnabled && "(Auto-filled from Clinical)"}</h4>
            <Row className="row-4">
              <FormGroup>
                <label>Phone Number{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={shouldDisableField() || isB2BEnabled}
                  required={isHomeCollectionEnabled}
                  maxLength={15}
                />
              </FormGroup>
              <FormGroup>
                <label>Email ID{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={shouldDisableField() || isB2BEnabled}
                  required={isHomeCollectionEnabled}
                />
              </FormGroup>
              <FormGroup>
                <label>Area{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}</label>
                <input
                  type="text"
                  name="area"
                  value={formData.address.area}
                  onChange={handleChange}
                  disabled={shouldDisableField()}
                  required={isHomeCollectionEnabled}
                />
              </FormGroup>
              <FormGroup>
                <label>Pin Code{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  disabled={shouldDisableField()}
                  required={isHomeCollectionEnabled}
                  maxLength={6}
                />
              </FormGroup>
            </Row>
          </Fieldset>

          <Fieldset>
            <h4>Medical Details</h4>
            <Row>
              <FormGroup>
                <label>Patient History (Optional)</label>
                <textarea
                  name="patient_history"
                  value={formData.patient_history}
                  onChange={handleChange}
                  placeholder="Enter patient medical history, previous conditions, allergies, etc."
                  rows={4}
                  disabled={shouldDisableField()}
                />
              </FormGroup>
            </Row>

            {!isExistingPatient && (
              <Row>
                <FormGroup>
                  <label>Upload Prescription (Optional)</label>
                  <FileUploadWrapper>
                    <input
                      type="file"
                      id="prescription-upload"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="prescription-upload" className="file-upload-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Camera />
                      <Upload />
                      {prescriptionFile ? "Change Photo / File" : "Take Photo / Upload"}
                    </label>

                    {prescriptionFile && (
                      <div className="file-name" style={{ marginTop: "10px" }}>
                        <FileText />
                        {prescriptionFile.name}
                      </div>
                    )}
                  </FileUploadWrapper>
                  <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
                    Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
                  </small>
                </FormGroup>
              </Row>
            )}
          </Fieldset>

          <ButtonContainer>
            {/* Button is only disabled while submitting — NOT for dropdown validation */}
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Processing...
                </>
              ) : patientSelectionSource === "search" && isExistingPatient ? (
                "Create Bill"
              ) : (
                "Register Patient & Create Bill"
              )}
            </SubmitButton>
          </ButtonContainer>
        </form>
      </FormCard>

      <RefBy show={showRefByForm} setShow={setShowRefByFormForm} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </FormContainer>
  )
}

export default PatientForm
