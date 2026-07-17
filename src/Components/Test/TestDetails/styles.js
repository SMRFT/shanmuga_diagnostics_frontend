// Styled-components used by TestDetails.
// Extracted verbatim from the original monolithic TestDetails.js
// (no styling changes — purely relocated).
import styled, { createGlobalStyle } from "styled-components";
import { ChevronDown } from "lucide-react";

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee; --primary-light: #4895ef; --secondary: #3f37c9;
    --success: #4cc9f0; --danger: #f72585; --warning: #f8961e;
    --info: #90e0ef; --light: #f8f9fa; --dark: #212529;
    --gray: #6c757d; --gray-light: #e9ecef;
    --border-radius: 8px; --box-shadow: 0 4px 6px rgba(0,0,0,0.1); --transition: all 0.3s ease;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb; color: var(--dark); line-height: 1.5;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;
export const Title = styled.h1`
  font-size: 1.75rem;
  color: var(--dark);
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;
export const PatientInfoBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const InfoItem = styled.div`
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  span {
    font-weight: 600;
    margin-right: 0.5rem;
  }
`;
export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  &:hover {
    background-color: var(--primary-light);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
  &:disabled {
    background-color: var(--gray-light);
    color: var(--gray);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
export const BackButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);
  &:hover {
    background-color: var(--gray-light);
  }
`;
export const SaveButton = styled(Button)`
  background-color: var(--success);
  &:hover {
    background-color: var(--info);
  }
  &:disabled {
    background-color: var(--gray-light);
    color: var(--gray);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
export const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  font-size: 1.125rem;
  color: var(--gray);
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const TestCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;
export const TestHeader = styled.div`
  background-color: var(--primary);
  color: white;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
`;
export const TestContent = styled.div`
  padding: 1rem;
`;
export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray);
`;
export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;
export const WrappedInput = styled(Input)`
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  min-height: 2rem;
  height: auto;
  resize: none;
  line-height: 1.2;
`;
export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
export const CommentBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-light);
`;
export const CommentLabel = styled(Label)`
  color: var(--secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
`;
// Critical comment textarea gets a red border hint
export const CommentTextArea = styled(TextArea)`
  min-height: 5px;
  min-width: 100%;
  background-color: white;
  ${(props) =>
    props.isCritical &&
    `
    border-color: var(--danger);
    background-color: #fff5f5;
  `}
`;
export const CriticalBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  margin-left: 0.5rem;
  background-color: #fff0f0;
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
`;
export const ParameterSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid var(--gray-light);
  padding-top: 1.5rem;
`;
export const ParameterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--secondary);
`;
export const ParameterCard = styled.div`
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;
export const RemarksSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
`;
export const SubtitleSection = styled.div`
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
export const SubtitleHeader = styled.div`
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
export const ParameterGrid = styled.div`
  display: grid;
  gap: 1rem;
`;
export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  appearance: none;
  background-color: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;
export const SelectIcon = styled(ChevronDown)`
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
  color: var(--gray);
`;

export const MultiSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: white;
  cursor: pointer;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;
export const InterpretationSection = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  overflow: hidden;
`;
export const InterpretationTitle = styled.div`
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
export const InterpretationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th {
    background-color: #f0f3ff;
    color: var(--secondary);
    padding: 0.6rem 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid var(--gray-light);
    border-right: 1px solid var(--gray-light);
    &:last-child {
      border-right: none;
    }
  }
  td {
    padding: 0.55rem 1rem;
    border-bottom: 1px solid var(--gray-light);
    border-right: 1px solid var(--gray-light);
    vertical-align: middle;
    &:last-child {
      border-right: none;
    }
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:nth-child(even) td {
    background-color: #fafbff;
  }
`;

export const LodTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th {
    background-color: #f0f3ff;
    color: var(--secondary);
    padding: 0.6rem 1rem;
    text-align: center;
    font-weight: 600;
    border: 1px solid var(--gray-light);
  }
  th.sample-header {
    background-color: #f0f3ff;
    text-align: left;
  }
  th.group-header {
    background-color: #e8ecff;
    text-align: center;
    font-size: 0.8rem;
  }
  td {
    padding: 0.55rem 1rem;
    border: 1px solid var(--gray-light);
    vertical-align: middle;
    text-align: center;
  }
  td.sample-cell {
    text-align: left;
    font-weight: 600;
    background-color: #fafbff;
  }
  tr:hover td {
    background-color: #f0f3ff;
  }
  tr:hover td.sample-cell {
    background-color: #e8ecff;
  }
`;

export const HLBadge = styled.span`
  display: inline-block;
  padding: 0.1rem 0.45rem;
  margin-left: 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  vertical-align: middle;
  animation: blink 1s step-start infinite;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  ${({ direction }) =>
    direction === "H"
      ? `background-color: #fff0f0; color: var(--danger); border: 1px solid var(--danger);`
      : `background-color: #fff8ec; color: var(--warning); border: 1px solid var(--warning);`}
`;
