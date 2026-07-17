import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  GlobalStyle,
  Container,
  Header,
  Title,
  PatientInfoBar,
  InfoItem,
  BackButton,
  SaveButton,
  NoData,
  Form,
  TestCard,
  TestHeader,
  TestContent,
  FormRow,
  FormGroup,
  Label,
  Input,
  WrappedInput,
  TextArea,
  CommentBox,
  CommentLabel,
  CommentTextArea,
  CriticalBadge,
  ParameterSection,
  ParameterTitle,
  ParameterCard,
  ButtonContainer,
  RemarksSection,
  SubtitleSection,
  SubtitleHeader,
  ParameterGrid,
  SelectWrapper,
  Select,
  SelectIcon,
  InterpretationSection,
  InterpretationTitle,
  InterpretationTable,
  LodTable,
  HLBadge,
} from "./styles";
import {
  getHLFlag,
  isParamDisabled,
  isSaveButtonEnabled,
  ALWAYS_EDITABLE_FIELDS,
} from "./helpers";
import MultiSelectDropdown from "./MultiSelectDropdown";
import useTestDetailsData from "./useTestDetailsData";

// ─── Component ────────────────────────────────────────────────────────────────

function TestDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const patientname = queryParams.get("patientname");
  const age = queryParams.get("age");
  const gender = queryParams.get("gender"); // NEW: read gender from URL
  const barcode = queryParams.get("barcode");
  const phone = queryParams.get("phone"); // NEW
  const ref_doctor = queryParams.get("ref_doctor"); // NEW
  const barcode_by = queryParams.get("barcode_by"); // NEW
  const barcode_date = queryParams.get("barcode_date"); // NEW
  const locationId = queryParams.get("locationId");
  const testId = queryParams.get("test_id");
  const testName = queryParams.get("test_name");
  const navigate = useNavigate();
  const verified_by = localStorage.getItem("name") || "";
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const handleBack = () => {
    navigate("/PatientDetails", {
      state: {
        barcode: location.state?.barcode,
        fromDate: location.state?.fromDate || new Date(),
        toDate: location.state?.toDate || new Date(),
      },
    });
  };

  const {
    testDetails,
    values,
    remarks,
    comments,
    parameterComments,
    parameterRemarks,
    loading,
    error,
    initialValues,
    isSubmitting,
    criticalKeys,
    specimenSelections,
    setSpecimenSelections,
    handleValueChange,
    handleParameterValueChange,
    handleRemarksChange,
    handleCommentChange,
    handleParameterCommentChange,
    handleParameterRemarksChange,
    handleSubmit,
  } = useTestDetailsData({
    barcode,
    testId,
    testName,
    gender,
    date,
    locationId,
    Labbaseurl,
    verified_by,
    onSaveSuccess: handleBack,
  });

  // ── Enter-key → next field ────────────────────────────────────────────────
  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key !== "Enter") return;

      // If focus is ON a button, let it click naturally
      if (e.target.tagName === "BUTTON") return;

      e.preventDefault();

      const focusable = Array.from(
        document.querySelectorAll("[data-focusable='true']"),
      ).filter((el) => el.offsetParent !== null && !el.disabled);

      const currentIndex = focusable.indexOf(e.target);
      if (currentIndex !== -1 && currentIndex < focusable.length - 1) {
        focusable[currentIndex + 1].focus();
      }
    };

    document.addEventListener("keydown", handleEnterKey);
    return () => document.removeEventListener("keydown", handleEnterKey);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Container>
        <GlobalStyle />
        <div>Loading test details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <div
          style={{
            color: "red",
            padding: "1rem",
            backgroundColor: "#ffe6e6",
            borderRadius: "8px",
          }}
        >
          <strong>Error:</strong> {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem" }}
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <GlobalStyle />
      <Header>
        <Title>Test Details</Title>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Patient Details
        </BackButton>
      </Header>

      {patientId && (
        <PatientInfoBar>
          <InfoItem>
            <span>Patient ID:</span> {patientId}
          </InfoItem>
          {patientname && (
            <InfoItem>
              <span>Patient Name:</span> {patientname}
            </InfoItem>
          )}
          {age && (
            <InfoItem>
              <span>Age:</span> {age}
            </InfoItem>
          )}
          {/* NEW: show gender if present */}
          {gender && (
            <InfoItem>
              <span>Gender:</span> {gender}
            </InfoItem>
          )}
          {date && (
            <InfoItem>
              <span>Date:</span> {date}
            </InfoItem>
          )}
          {barcode && (
            <InfoItem>
              <span>Barcode:</span> {barcode}
            </InfoItem>
          )}
          {/* NEW: barcode_by, barcode_date, phone, ref_doctor */}
          {barcode_by && (
            <InfoItem>
              <span>Barcode By:</span> {barcode_by}
            </InfoItem>
          )}
          {barcode_date && (
            <InfoItem>
              <span>Barcode Date:</span>{" "}
              {new Date(barcode_date).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </InfoItem>
          )}
          {phone && (
            <InfoItem>
              <span>Phone:</span> {phone}
            </InfoItem>
          )}
          {ref_doctor && (
            <InfoItem>
              <span>Ref. Doctor:</span> {ref_doctor}
            </InfoItem>
          )}
          {locationId && (
            <InfoItem>
              <span>From:</span> {locationId}
            </InfoItem>
          )}
        </PatientInfoBar>
      )}

      {testDetails.length === 0 ? (
        <NoData>
          No test details available for the selected patient.
          <br />
          <small style={{ marginTop: "1rem", display: "block" }}>
            Barcode: {barcode} | Test Name: {testName || "All tests"}
          </small>
        </NoData>
      ) : (
        <Form onSubmit={handleSubmit}>
          {testDetails.map((test, index) => (
            <TestCard key={index}>
              <TestHeader>{test.testname}</TestHeader>
              <TestContent>
                {!test.parametersBySubtitle ||
                  Object.keys(test.parametersBySubtitle).length === 0 ? (
                  // ── Single-value test ────────────────────────────────────
                  <>
                    <FormRow>
                      <FormGroup>
                        <Label>
                          Specimen Type
                          {test.specimen_options &&
                            test.specimen_options.length > 0 && (
                              <span style={{ color: "red" }}> *</span>
                            )}
                        </Label>
                        {test.specimen_options &&
                          test.specimen_options.length > 0 ? (
                          <SelectWrapper>
                            <Select
                              value={specimenSelections[test.testname] || ""}
                              onChange={(e) =>
                                setSpecimenSelections((prev) => ({
                                  ...prev,
                                  [test.testname]: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select specimen type</option>
                              {test.specimen_options.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                            <SelectIcon size={18} />
                          </SelectWrapper>
                        ) : (
                          <Input value={test.specimen_type || ""} disabled />
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Unit</Label>
                        <Input type="text" value={test.unit || ""} disabled />
                      </FormGroup>
                      <FormGroup>
                        <Label>Reference Range</Label>
                        <Input
                          type="text"
                          value={test.reference_range || ""}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Method</Label>
                        <Input type="text" value={test.method || ""} disabled />
                      </FormGroup>
                    </FormRow>
                    {/* ── Interpretation table ── */}
                    {test.interpretation &&
                      Object.keys(test.interpretation).length > 0 && (
                        <InterpretationSection>
                          <InterpretationTitle>
                            Interpretation
                          </InterpretationTitle>
                          <InterpretationTable>
                            <thead>
                              <tr>
                                <th>Results</th>
                                <th>Comments</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(test.interpretation).map(
                                ([result, comment], i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 500 }}>
                                      {result}
                                    </td>
                                    <td>{comment}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </InterpretationTable>
                        </InterpretationSection>
                      )}

                    {/* ── Critical range table ── */}
                    {test.critical_range &&
                      Object.keys(test.critical_range).length > 0 && (
                        <InterpretationSection>
                          <InterpretationTitle>
                            Critical Range
                          </InterpretationTitle>
                          <InterpretationTable>
                            <thead>
                              <tr>
                                <th>Result</th>
                                <th>Ct Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(test.critical_range).map(
                                ([result, ctvalue], i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 500 }}>
                                      {result}
                                    </td>
                                    <td>{ctvalue}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </InterpretationTable>
                        </InterpretationSection>
                      )}
                    {/* ── LOD table ── */}
                    {test.lod &&
                      Object.keys(test.lod).length > 0 &&
                      (() => {
                        const samples = Object.keys(test.lod);
                        const maxGenotypes = Math.max(
                          ...samples.map((s) => test.lod[s].length),
                        );
                        const genotypeLabels = Array.from(
                          { length: maxGenotypes },
                          (_, i) => `Genotype ${i + 1}`,
                        );

                        return (
                          <InterpretationSection>
                            <InterpretationTitle>
                              LOD in IU/ml
                            </InterpretationTitle>
                            <LodTable>
                              <thead>
                                <tr>
                                  <th className="sample-header" rowSpan={2}>
                                    SAMPLE
                                  </th>
                                  <th
                                    colSpan={maxGenotypes}
                                    style={{
                                      textAlign: "center",
                                      backgroundColor: "#e8ecff",
                                    }}
                                  >
                                    LOD in IU/ml
                                  </th>
                                </tr>
                                <tr>
                                  {genotypeLabels.map((label, i) => (
                                    <th key={i} className="group-header">
                                      {label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {samples.map((sample, rowIdx) => (
                                  <tr key={rowIdx}>
                                    <td className="sample-cell">{sample}</td>
                                    {test.lod[sample].map((val, colIdx) => (
                                      <td key={colIdx}>{val}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </LodTable>
                          </InterpretationSection>
                        );
                      })()}

                    <FormRow>
                      <FormGroup>
                        <Label>
                          Value{" "}
                          {(!initialValues[test.testname] ||
                            initialValues[test.testname].trim() === "") && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          {(() => {
                            const flag = getHLFlag(
                              values[test.testname],
                              test.reference_range,
                            );
                            return flag ? (
                              <HLBadge direction={flag}>{flag}</HLBadge>
                            ) : null;
                          })()}
                        </Label>
                        {test.value_option && test.value_option.length > 0 ? (
                          <div>
                            <Input
                              data-focusable="true"
                              type="text"
                              list={`options-${test.testname}`}
                              value={values[test.testname] || ""}
                              onChange={(e) =>
                                handleValueChange(test.testname, e)
                              }
                              placeholder="Select or type value"
                            />
                            <datalist id={`options-${test.testname}`}>
                              {test.value_option.map((option, optIndex) => (
                                <option key={optIndex} value={option} />
                              ))}
                            </datalist>
                          </div>
                        ) : (
                          <Input
                            data-focusable="true"
                            type="text"
                            value={values[test.testname] || ""}
                            onChange={
                              !initialValues[test.testname] ||
                                initialValues[test.testname].trim() === ""
                                ? (e) => handleValueChange(test.testname, e)
                                : undefined
                            }
                            disabled={
                              !!(
                                initialValues[test.testname] &&
                                initialValues[test.testname].trim() !== ""
                              )
                            }
                            placeholder={
                              !initialValues[test.testname] ||
                                initialValues[test.testname].trim() === ""
                                ? "Enter value"
                                : "Value available"
                            }
                          />
                        )}
                      </FormGroup>
                    </FormRow>

                    {/* Critical indicator for single-value test — reads from
                         criticalKeys (debounced) not values (live), so the badge
                         and red border only appear after typing settles. */}
                    {(() => {
                      const critical = !!criticalKeys[test.testname];
                      return (
                        <CommentBox>
                          <CommentLabel>
                            Comments (Optional)
                            {critical && (
                              <CriticalBadge>⚠ Critical</CriticalBadge>
                            )}
                          </CommentLabel>
                          {test.comment_options && test.comment_options.length > 0 && (
                            <div style={{ marginBottom: "8px" }}>
                              <Input
                                type="text"
                                list={`comments-search-${test.testname}`}
                                value={comments[test.testname] || ""}
                                onChange={(e) =>
                                  handleCommentChange(test.testname, e)
                                }
                                placeholder="🔍 Search or select comment option..."
                                style={{ width: "100%" }}
                              />
                              <datalist id={`comments-search-${test.testname}`}>
                                {test.comment_options.map((option, optIndex) => (
                                  <option key={optIndex} value={option} />
                                ))}
                              </datalist>
                            </div>
                          )}
                          <CommentTextArea
                            data-focusable="true"
                            isCritical={critical}
                            value={comments[test.testname] || ""}
                            onChange={(e) =>
                              handleCommentChange(test.testname, e)
                            }
                            placeholder="Add any comments or observations..."
                          />
                        </CommentBox>
                      );
                    })()}

                    {(!initialValues[test.testname] ||
                      initialValues[test.testname].trim() === "") &&
                      values[test.testname] &&
                      values[test.testname].trim() !== "" && (
                        <RemarksSection>
                          <FormGroup>
                            <Label>
                              Remarks (Required for edited values){" "}
                              <span style={{ color: "red" }}>*</span>
                            </Label>
                            <TextArea
                              data-focusable="true"
                              value={remarks[test.testname] || ""}
                              onChange={(e) =>
                                handleRemarksChange(test.testname, e)
                              }
                              onKeyDown={(e) => {
                                {
                                  /* ← ADD THIS */
                                }
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  document
                                    .querySelector("[data-save-button]")
                                    ?.focus();
                                }
                              }}
                              placeholder="Enter remarks (required)"
                              style={{
                                borderColor:
                                  !remarks[test.testname] ||
                                    remarks[test.testname].trim() === ""
                                    ? "red"
                                    : undefined,
                              }}
                            />
                          </FormGroup>
                        </RemarksSection>
                      )}
                  </>
                ) : (
                  // ── Parameter test ───────────────────────────────────────
                  <ParameterSection>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <ParameterTitle>
                        Parameters (
                        {Object.values(test.parametersBySubtitle).flat().length}
                        )
                      </ParameterTitle>
                    </div>

                    <FormRow style={{ marginBottom: "1.5rem" }}>
                      <FormGroup>
                        <Label>
                          Specimen Type
                          {test.specimen_options &&
                            test.specimen_options.length > 0 && (
                              <span style={{ color: "red" }}> *</span>
                            )}
                        </Label>
                        {test.specimen_options &&
                          test.specimen_options.length > 0 ? (
                          <SelectWrapper>
                            <Select
                              value={specimenSelections[test.testname] || ""}
                              onChange={(e) =>
                                setSpecimenSelections((prev) => ({
                                  ...prev,
                                  [test.testname]: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select specimen type</option>
                              {test.specimen_options.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                            <SelectIcon size={18} />
                          </SelectWrapper>
                        ) : (
                          <Input
                            type="text"
                            value={test.specimen_type || ""}
                            disabled
                          />
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Department</Label>
                        <Input
                          type="text"
                          value={test.department || ""}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>NABL</Label>
                        <Input
                          type="text"
                          value={test.NABL ? "Yes" : "No"}
                          disabled
                        />
                      </FormGroup>
                    </FormRow>

                    {Object.entries(test.parametersBySubtitle).map(
                      ([subtitle, parameters], subtitleIndex) => (
                        <SubtitleSection key={subtitleIndex}>
                          <SubtitleHeader>{subtitle}</SubtitleHeader>
                          <ParameterGrid>
                            {parameters.map((param, paramIndex) => {
                              const paramName = param.name || param.test_name;
                              const uniqueKey = `${test.testname}_${paramName}`;
                              const hasValueOptions =
                                param.value_option &&
                                param.value_option.length > 0;
                              const disabled = isParamDisabled(
                                param,
                                uniqueKey,
                                test.test_id,
                                initialValues,
                              );
                              const isAlwaysEditable =
                                ALWAYS_EDITABLE_FIELDS.includes(
                                  param.test_code,
                                ) || test.test_id === 429;

                              // Critical reads from criticalKeys (debounced) not values (live)
                              const critical = !!criticalKeys[uniqueKey];

                              return (
                                <ParameterCard key={paramIndex}>
                                  <FormRow>
                                    <FormGroup>
                                      <Label>Parameter Name</Label>
                                      <WrappedInput
                                        as="textarea"
                                        value={paramName}
                                        disabled
                                        style={{ resize: "none" }}
                                      />
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>
                                        Value{" "}
                                        {!disabled && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                        {isAlwaysEditable && (
                                          <span
                                            style={{
                                              color: "var(--secondary)",
                                              fontSize: "0.75rem",
                                              marginLeft: "0.4rem",
                                            }}
                                          >
                                            (editable)
                                          </span>
                                        )}
                                        {(() => {
                                          const flag = getHLFlag(
                                            values[uniqueKey],
                                            param.reference_range,
                                          );
                                          return flag ? (
                                            <HLBadge direction={flag}>
                                              {flag}
                                            </HLBadge>
                                          ) : null;
                                        })()}
                                      </Label>
                                      {(() => {
                                        const MULTI_SELECT_CODES = [
                                          "UR19",
                                          "UR20",
                                          "UR23",
                                        ];
                                        const isMultiSelect =
                                          hasValueOptions &&
                                          !disabled &&
                                          MULTI_SELECT_CODES.includes(
                                            param.test_code,
                                          );
                                        const isSingleSelect =
                                          hasValueOptions &&
                                          !disabled &&
                                          !MULTI_SELECT_CODES.includes(
                                            param.test_code,
                                          );

                                        if (isMultiSelect) {
                                          return (
                                            <MultiSelectDropdown
                                              options={param.value_option}
                                              value={values[uniqueKey] || ""}
                                              disabled={disabled}
                                              onChange={(val) =>
                                                handleParameterValueChange(
                                                  test.testname,
                                                  paramName,
                                                  { target: { value: val } },
                                                )
                                              }
                                            />
                                          );
                                        }

                                        if (isSingleSelect) {
                                          return (
                                            <div
                                              style={{ position: "relative" }}
                                            >
                                              <Input
                                                data-focusable="true"
                                                type="text"
                                                list={`options-${uniqueKey}`}
                                                value={values[uniqueKey] || ""}
                                                onChange={(e) =>
                                                  handleParameterValueChange(
                                                    test.testname,
                                                    paramName,
                                                    e,
                                                  )
                                                }
                                                disabled={disabled}
                                                placeholder="Select or type value"
                                                style={
                                                  critical
                                                    ? {
                                                      borderColor:
                                                        "var(--danger)",
                                                      backgroundColor:
                                                        "#fff5f5",
                                                    }
                                                    : {}
                                                }
                                              />
                                              <datalist
                                                id={`options-${uniqueKey}`}
                                              >
                                                {param.value_option.map(
                                                  (option, optIndex) => (
                                                    <option
                                                      key={optIndex}
                                                      value={option}
                                                    />
                                                  ),
                                                )}
                                              </datalist>
                                            </div>
                                          );
                                        }

                                        // No options — plain text input
                                        return (
                                          <Input
                                            data-focusable="true"
                                            type="text"
                                            value={values[uniqueKey] || ""}
                                            onChange={
                                              !disabled
                                                ? (e) =>
                                                  handleParameterValueChange(
                                                    test.testname,
                                                    paramName,
                                                    e,
                                                  )
                                                : undefined
                                            }
                                            disabled={disabled}
                                            placeholder={
                                              !disabled
                                                ? "Enter value"
                                                : "Value available"
                                            }
                                            style={
                                              critical
                                                ? {
                                                  borderColor:
                                                    "var(--danger)",
                                                  backgroundColor: "#fff5f5",
                                                }
                                                : {}
                                            }
                                          />
                                        );
                                      })()}
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>Unit</Label>
                                      <Input
                                        type="text"
                                        value={param.unit || ""}
                                        disabled
                                      />
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>Reference Range</Label>
                                      <Input
                                        type="text"
                                        value={param.reference_range || ""}
                                        disabled
                                      />
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>Method</Label>
                                      <Input
                                        type="text"
                                        value={param.method || ""}
                                        disabled
                                      />
                                    </FormGroup>
                                  </FormRow>

                                  {/* NEW: Critical badge + red comment box for parameter */}
                                  <CommentBox>
                                    <CommentLabel>
                                      Comments (Optional)
                                      {critical && (
                                        <CriticalBadge>
                                          ⚠ Critical
                                        </CriticalBadge>
                                      )}
                                    </CommentLabel>
                                    {test.comment_options && test.comment_options.length > 0 && (
                                      <div style={{ marginBottom: "8px" }}>
                                        <Input
                                          type="text"
                                          list={`comments-search-${uniqueKey}`}
                                          value={parameterComments[uniqueKey] || ""}
                                          onChange={(e) =>
                                            handleParameterCommentChange(
                                              test.testname,
                                              paramName,
                                              e,
                                            )
                                          }
                                          placeholder="🔍 Search or select comment option..."
                                          style={{ width: "100%" }}
                                        />
                                        <datalist id={`comments-search-${uniqueKey}`}>
                                          {test.comment_options.map((option, optIndex) => (
                                            <option key={optIndex} value={option} />
                                          ))}
                                        </datalist>
                                      </div>
                                    )}
                                    <CommentTextArea
                                      data-focusable="true"
                                      isCritical={critical}
                                      value={parameterComments[uniqueKey] || ""}
                                      onChange={(e) =>
                                        handleParameterCommentChange(
                                          test.testname,
                                          paramName,
                                          e,
                                        )
                                      }
                                      placeholder="Add any comments or observations for this parameter..."
                                    />
                                  </CommentBox>
                                </ParameterCard>
                              );
                            })}
                          </ParameterGrid>
                        </SubtitleSection>
                      ),
                    )}

                    {Object.values(test.parametersBySubtitle)
                      .flat()
                      .some((param) => {
                        const paramName = param.name || param.test_name;
                        const uniqueKey = `${test.testname}_${paramName}`;
                        const initialValue = initialValues[uniqueKey];
                        const currentValue = values[uniqueKey];
                        return (
                          (!initialValue || initialValue.trim() === "") &&
                          currentValue &&
                          currentValue.trim() !== ""
                        );
                      }) && (
                        <RemarksSection>
                          <FormGroup>
                            <Label>
                              Parameter Remarks (Required for edited parameters){" "}
                              <span style={{ color: "red" }}>*</span>
                            </Label>
                            <TextArea
                              data-focusable="true"
                              value={parameterRemarks || ""}
                              onChange={handleParameterRemarksChange}
                              onKeyDown={(e) => {
                                {
                                  /* ← ADD THIS */
                                }
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  document
                                    .querySelector("[data-save-button]")
                                    ?.focus();
                                }
                              }}
                              style={{
                                borderColor:
                                  !parameterRemarks ||
                                    parameterRemarks.trim() === ""
                                    ? "red"
                                    : undefined,
                              }}
                            />
                          </FormGroup>
                        </RemarksSection>
                      )}
                  </ParameterSection>
                )}
              </TestContent>
            </TestCard>
          ))}

          <ButtonContainer>
            <SaveButton
              data-focusable="true"
              data-save-button
              type="submit"
              disabled={
                !isSaveButtonEnabled({
                  isSubmitting,
                  testDetails,
                  values,
                  initialValues,
                  parameterRemarks,
                  remarks,
                })
              }
            >
              <Save size={18} />
              {isSubmitting ? "Saving..." : "Save Test Details"}
            </SaveButton>
          </ButtonContainer>
        </Form>
      )}
    </Container>
  );
}

export default TestDetails;
