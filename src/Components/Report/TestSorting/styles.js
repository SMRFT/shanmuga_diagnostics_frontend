// Styled-components used by TestSorting.
// Extracted verbatim from the original monolithic TestSorting.js
// (no styling changes — purely relocated).
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: white;
  padding: 30px;
  width: 70%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

export const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #db9bb9;
    box-shadow: 0 0 0 2px rgba(219, 155, 185, 0.2);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

export const TestList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 10px 0;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #db9bb9;
    border-radius: 10px;
  }
`;

export const TestItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  margin: 8px 0;
  transition: all 0.2s;

  &:hover {
    background: #f9f0f4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const TestInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid ${(props) => (props.checked ? "#DB9BB9" : "#d1d1d1")};
  border-radius: 6px;
  margin-right: 15px;
  transition: all 0.2s;
  background: ${(props) => (props.checked ? "#DB9BB9" : "transparent")};
  cursor: pointer;

  &:hover {
    border-color: #db9bb9;
  }
`;

export const TestName = styled.span`
  font-size: 15px;
  color: #333;
  font-weight: ${(props) => (props.selected ? "600" : "400")};

  .nabl-asterisk {
    color: #db9bb9;
    font-weight: bold;
    margin-left: 4px;
  }
`;

export const DispatchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background-color: ${(props) => (props.dispatched ? "#28A745" : "#DB9BB9")};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 6px;
  margin-left: 10px;

  &:hover {
    background-color: ${(props) => (props.dispatched ? "#218838" : "#c985a7")};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

export const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.primary &&
    `
    background-color: #DB9BB9;
    color: white;

    &:hover {
      background-color: #c985a7;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${(props) =>
    props.secondary &&
    `
    background-color: #f5f5f5;
    color: #333;

    &:hover {
      background-color: #e9e9e9;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SelectedCount = styled.div`
  background-color: #f0f0f0;
  color: #555;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  margin-left: 10px;
`;

export const PrintOptions = styled.div`
  position: absolute;
  bottom: 70px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  transition: all 0.3s;
  transform-origin: bottom right;
  transform: ${(props) => (props.show ? "scale(1)" : "scale(0)")};
  opacity: ${(props) => (props.show ? "1" : "0")};
`;

export const PrintOption = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #f9f0f4;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  border-radius: 16px;
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #db9bb9;
  border-radius: 50%;
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

export const LoadingText = styled.p`
  margin-top: 20px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
`;
