import styled from "styled-components"

// ============================================================================
// STYLED COMPONENTS - All styling with styled-components
// ============================================================================

export const FormContainer = styled.div`
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

export const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 25px;
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 10px;
  }
`

export const StyledTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
    margin-bottom: 25px;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
`

export const SearchAndAppointmentContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  position: relative;

  @media (max-width: 1024px) {
    gap: 12px;
    margin-bottom: 25px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
`

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  z-index: 100;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

export const SearchContainer = styled.div`
  width: 100%;
  position: relative;

  input {
    width: 100%;
    padding: 12px 20px 12px 45px;
    border: 2px solid #e1e8ff;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &::placeholder {
      color: #6c757d;
    }

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    @media (max-width: 768px) {
      padding: 11px 20px 11px 40px;
      font-size: 15px;
    }

    @media (max-width: 480px) {
      padding: 10px 18px 10px 38px;
      font-size: 14px;
    }
  }

  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #6c757d;

    @media (max-width: 480px) {
      left: 12px;
      width: 16px;
      height: 16px;
    }
  }
`

export const PatientSelectionModal = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 15px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.25s ease;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1024px) {
    max-height: 450px;
    padding: 14px;
  }

  @media (max-width: 768px) {
    max-height: 400px;
    padding: 12px;
    top: calc(100% + 6px);
  }

  @media (max-width: 480px) {
    max-height: 350px;
    padding: 10px;
    top: calc(100% + 4px);
    left: -10px;
    right: -10px;
    width: calc(100% + 20px);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 10px;

    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
`

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  width: 100%;

  h3 {
    text-align: center;
    margin: 0 0 20px 0;
    padding: 0 30px 15px 0;
    color: #764ba2;
    font-size: 1.4rem;
    font-weight: 700;
    border-bottom: 2px solid #f0f4f8;

    @media (max-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 15px;
    }

    @media (max-width: 480px) {
      font-size: 1.1rem;
      margin-bottom: 15px;
    }
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(240, 147, 251, 0.1);
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    color: #f093fb;
    background: rgba(240, 147, 251, 0.2);
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 16px;
    top: 10px;
    right: 10px;
  }
`

export const PatientCard = styled.div`
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(145deg, #ffffff, #f8faff);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: #667eea;
    background: linear-gradient(145deg, #ffffff, #eef1ff);
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.15);
  }

  .patient-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e1e8ff;
    flex-wrap: wrap;
    gap: 8px;

    .patient-id-badge {
      background: linear-gradient(135deg, #f093fb, #667eea);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 12px;
      white-space: nowrap;

      @media (max-width: 480px) {
        font-size: 11px;
        padding: 3px 10px;
      }
    }

    .emergency-badge {
      background: #ef4444;
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;

      @media (max-width: 480px) {
        font-size: 9px;
        padding: 3px 8px;
      }
    }
  }

  .patient-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 15px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }

  .info-item {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 10px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 3px;
    }

    .value {
      font-size: 12px;
      color: #333;
      font-weight: 500;
      word-break: break-word;

      &.empty {
        color: #999;
        font-style: italic;
        font-weight: 400;
      }
    }
  }

  .select-button {
    margin-top: 10px;
    width: 100%;
    padding: 8px;
    background: linear-gradient(135deg, #f093fb, #667eea);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
    }

    @media (max-width: 480px) {
      font-size: 11px;
      padding: 7px;
    }
  }
`

export const Fieldset = styled.fieldset`
  border: 2px dashed #f093fb;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.3);
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  legend {
    font-size: 1.3rem;
    font-weight: bold;
    color: #764ba2;
    padding: 0 15px;
    background: linear-gradient(135deg, #f093fb, #667eea);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (max-width: 1024px) {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  h4 {
    text-align: center;
    color: #764ba2;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 1.2rem;

    @media (max-width: 1024px) {
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 15px;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 1024px) {
    padding: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 12px;
  }
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  align-items: end;

  &.row-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &.row-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &.row-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  &.row-5 {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 1400px) {
    gap: 18px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;

    &.row-4, &.row-5 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;

    &.row-3, &.row-4, &.row-5 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 15px;

    &.row-3, &.row-4, &.row-5 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 12px;

    &.row-2, &.row-3, &.row-4, &.row-5 {
      grid-template-columns: 1fr;
    }
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #4c51bf;
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
      margin-bottom: 6px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }

  input, select, textarea {
    padding: 10px 12px;
    border: 2px solid #e1e8ff;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
      background: #f7fafc;
      border-color: #e2e8f0;
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      padding: 9px 11px;
      font-size: 13px;
    }

    @media (max-width: 480px) {
      padding: 8px 10px;
      font-size: 12px;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    font-family: 'Poppins', sans-serif;
  }

  select {
    cursor: pointer;
  }
`

export const SearchableInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const SearchableInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid ${(props) => (props.$hasError ? "#ef4444" : "#e1e8ff")};
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#667eea")};
    box-shadow: 0 0 0 3px ${(props) => (props.$hasError ? "rgba(239,68,68,0.1)" : "rgba(102, 126, 234, 0.1)")};
  }

  &:disabled {
    background: #f7fafc;
    border-color: #e2e8f0;
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 9px 11px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`

export const FieldHint = styled.span`
  font-size: 11px;
  color: ${(props) => (props.$error ? "#ef4444" : "#999")};
  margin-top: 4px;
  display: block;
`

export const SearchableDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e8ff;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 10px;
  }
`

export const DropdownItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #333;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 9px 11px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`

export const NoResults = styled.div`
  padding: 10px 12px;
  color: #999;
  font-style: italic;
  font-size: 14px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`

export const FileUploadWrapper = styled.div`
  position: relative;

  input[type="file"] {
    display: none;
  }

  .file-upload-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    background: linear-gradient(135deg, #f093fb, #667eea);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(240, 147, 251, 0.4);
    }

    &.camera-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      margin-left: 10px;
      &:hover {
        box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
      }
    }

    svg {
      font-size: 16px;
    }

    @media (max-width: 480px) {
      padding: 8px 12px;
      font-size: 12px;
      gap: 6px;

      svg {
        font-size: 14px;
      }
    }
  }

  .file-name {
    margin-top: 8px;
    padding: 8px 12px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 6px;
    font-size: 13px;
    color: #4c51bf;
    display: flex;
    align-items: center;
    gap: 8px;
    word-break: break-word;

    svg {
      color: #667eea;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      padding: 6px 10px;
      gap: 6px;
    }
  }
`

export const FieldWithButton = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;

  .field-input {
    flex: 1;
  }

  button {
    background: linear-gradient(135deg, #f093fb, #667eea);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    height: 42px;
    min-width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-bottom: 1px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(240, 147, 251, 0.4);
    }

    @media (max-width: 768px) {
      font-size: 14px;
      height: 40px;
      padding: 9px 10px;
    }

    @media (max-width: 480px) {
      height: 38px;
      min-width: 38px;
      padding: 8px 8px;
      font-size: 13px;
    }
  }
`

export const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  label {
    margin-bottom: 0;
    font-weight: 600;
    color: #4c51bf;
    font-size: 14px;
    text-align: left;

    @media (max-width: 768px) {
      font-size: 13px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      color: #667eea;
      transition: all 0.3s ease;

      @media (max-width: 768px) {
        font-size: 32px;
      }

      @media (max-width: 480px) {
        font-size: 28px;
      }
    }
  }
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border: 2px solid #e1e8ff;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.2s;
    margin-bottom: 0;
    font-size: 14px;
    white-space: nowrap;

    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    input[type="radio"] {
      margin: 0;
      accent-color: #667eea;
      cursor: pointer;
    }

    &:has(input:checked) {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      color: #4c51bf;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      padding: 7px 11px;
      font-size: 13px;
    }

    @media (max-width: 480px) {
      padding: 6px 10px;
      font-size: 12px;
      gap: 5px;
    }
  }
`

export const RequiredIndicator = styled.span`
  color: #f093fb;
  margin-left: 4px;
  font-weight: bold;
`

export const SubmitButton = styled.button`
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

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(240, 147, 251, 0.4);
  }

  &:disabled {
    opacity: 0.6;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 13px 35px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 30px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 10px 25px;
    width: 100%;
    min-height: 45px;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 15px;
  }
`

export const StatusIndicator = styled.div`
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;

  &.existing {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    border: 2px solid rgba(34, 197, 94, 0.3);
  }

  &.new {
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    border: 2px solid rgba(59, 130, 246, 0.3);
  }

  &.multiple {
    background: rgba(255, 193, 7, 0.1);
    color: #f59e0b;
    border: 2px solid rgba(255, 193, 7, 0.3);
  }

  &.emergency {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 2px solid rgba(239, 68, 68, 0.3);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`

export const SpinnerIcon = styled.span`
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

export const AppointmentButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 16px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 500px;
    justify-content: center;
    padding: 11px 20px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px 18px;
    font-size: 13px;
    gap: 6px;

    svg {
      font-size: 16px;
    }
  }
`
