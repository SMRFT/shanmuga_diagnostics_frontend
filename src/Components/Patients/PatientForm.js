"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaSearch, FaToggleOn, FaToggleOff, FaPlus, FaTimes, FaUpload, FaFileAlt, FaCalendar, FaCamera } from "react-icons/fa"
import apiRequest from "../Auth/apiRequest"
import RefBy from "../Forms/RefBy"

// ============================================================================
// STYLED COMPONENTS - All styling with styled-components
// ============================================================================

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

const StyledTitle = styled.h2`
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

const SearchAndAppointmentContainer = styled.div`
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

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  z-index: 100;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`

const SearchContainer = styled.div`
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

const PatientSelectionModal = styled.div`
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

const ModalContent = styled.div`
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

const CloseButton = styled.button`
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

const PatientCard = styled.div`
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

const Fieldset = styled.fieldset`
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

const Row = styled.div`
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

const FormGroup = styled.div`
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

const SearchableInputWrapper = styled.div`
  position: relative;
  width: 100%;
`

const SearchableInput = styled.input`
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

const FieldHint = styled.span`
  font-size: 11px;
  color: ${(props) => (props.$error ? "#ef4444" : "#999")};
  margin-top: 4px;
  display: block;
`

const SearchableDropdown = styled.div`
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

const DropdownItem = styled.div`
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

const NoResults = styled.div`
  padding: 10px 12px;
  color: #999;
  font-style: italic;
  font-size: 14px;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const FileUploadWrapper = styled.div`
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

const FieldWithButton = styled.div`
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

const ToggleContainer = styled.div`
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

const RadioGroup = styled.div`
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

const RequiredIndicator = styled.span`
  color: #f093fb;
  margin-left: 4px;
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

const ButtonContainer = styled.div`
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

const StatusIndicator = styled.div`
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

const AppointmentButton = styled.button`
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

// ============================================================================
// PATIENT FORM COMPONENT
// ============================================================================

const PatientForm = () => {
  const getCurrentDateWithTime = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const day = String(currentDate.getDate()).padStart(2, "0")
    const hours = String(currentDate.getHours()).padStart(2, "0")
    const minutes = String(currentDate.getMinutes()).padStart(2, "0")
    const seconds = String(currentDate.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const storedName = localStorage.getItem("name") || "system"

  const [showRefByForm, setShowRefByFormForm] = useState(false)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [multiplePatients, setMultiplePatients] = useState([])
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentPatients, setAppointmentPatients] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)

  const [patientSelectionSource, setPatientSelectionSource] = useState(null)
  const [originalPatientName, setOriginalPatientName] = useState("")

  const [refBySearchValue, setRefBySearchValue] = useState("")
  const [showRefByDropdown, setShowRefByDropdown] = useState(false)
  const [clinicalSearchValue, setClinicalSearchValue] = useState("")
  const [showClinicalDropdown, setShowClinicalDropdown] = useState(false)

  // ---- Dropdown selection tracking flags ----
  const [isRefBySelectedFromDropdown, setIsRefBySelectedFromDropdown] = useState(false)
  const [isClinicalSelectedFromDropdown, setIsClinicalSelectedFromDropdown] = useState(false)

  // ---- Inline error hints shown after a failed submit attempt ----
  const [refByError, setRefByError] = useState(false)
  const [clinicalError, setClinicalError] = useState(false)

  const [formData, setFormData] = useState({
    patient_id: "",
    date: getCurrentDateWithTime(),
    lab_id: "",
    refby: "",
    branch: "",
    B2B: "",
    segment: "Walk-in",
    Title: "Mr.",
    patientname: "",
    gender: "Male",
    age: "",
    age_type: "Years",
    phone: "",
    email: "",
    address: { area: "", pincode: "" },
    sample_collector: "",
    testdetails: [],
    totalAmount: 0,
    discount: 0,
    payment_method: {},
    credit_amount: 0,
    registeredby: storedName,
    bill_no: "",
    bill_date: null,
    salesMapping: "",
    b2b_area: "",
    MultiplePayment: [],
    emergency: false,
    patient_history: "",
  })

  const [isB2BEnabled, setIsB2BEnabled] = useState(false)
  const [isHomeCollectionEnabled, setIsHomeCollectionEnabled] = useState(false)
  const [isHospitalBillEnabled, setIsHospitalBillEnabled] = useState(false)
  const [isEmergencyEnabled, setIsEmergencyEnabled] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState({
    clinicalNames: [],
    sampleCollectors: [],
    referrers: [],
  })
  const [searchValue, setSearchValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isExistingPatient, setIsExistingPatient] = useState(false)

  // -----------------------------------------------------------------------
  // Form validation — does NOT include dropdown-selection checks so the
  // submit button stays enabled regardless of whether the user typed or
  // selected from the dropdown. Dropdown validation happens at submit time.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const basicFieldsValid = formData.patientname.trim() !== "" && formData.age !== ""
    const refByValid = formData.refby.trim() !== ""
    const sampleCollectorValid = formData.sample_collector.trim() !== ""
    const branchValid = formData.branch.trim() !== ""
    const b2bFieldsValid = !isB2BEnabled || formData.B2B.trim() !== ""

    const homeCollectionValid =
      !isHomeCollectionEnabled ||
      (formData.phone.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.address.area.trim() !== "" &&
        formData.address.pincode.trim() !== "")

    if (
      basicFieldsValid && refByValid && sampleCollectorValid && branchValid && b2bFieldsValid && homeCollectionValid
    ) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }, [formData, isB2BEnabled, isHomeCollectionEnabled, isHospitalBillEnabled])

  const loadDropdownOptions = async () => {
    try {
      const [clinical, collector, refby] = await Promise.all([
        apiRequest(`${Labbaseurl}clinical_name/`, "GET"),
        apiRequest(`${Labbaseurl}sample-collector/`, "GET"),
        apiRequest(`${Labbaseurl}refby/`, "GET"),
      ])

      if (clinical.success) {
        setDropdownOptions((prev) => ({ ...prev, clinicalNames: clinical.data }))
      }
      if (collector.success) {
        setDropdownOptions((prev) => ({ ...prev, sampleCollectors: collector.data }))
      }
      if (refby.success) {
        setDropdownOptions((prev) => ({ ...prev, referrers: refby.data }))
      }
    } catch (error) {
      console.error("Error loading dropdown options:", error)
      toast.error("Failed to load dropdown options")
    }
  }

  const generateNewPatientId = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}latest-patient-id/`, "GET")

      if (response && response.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: response.patient_id }))
      } else if (response && response.data && response.data.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: response.data.patient_id }))
      } else {
        console.error("Invalid patient ID response format:", response)
        toast.error("Failed to generate patient ID - Refresh and try again")
      }
    } catch (error) {
      console.error("Error generating patient ID:", error)
      toast.error("Failed to generate patient ID")
    }
  }

  useEffect(() => {
    generateNewPatientId()
    loadDropdownOptions()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    let updatedGender = formData.gender
    if (name === "Title") {
      if (value === "Mr." || value === "Master." || value === "Dr.") {
        updatedGender = "Male"
      } else if (value === "Mrs." || value === "Ms." || value === "Miss." || value === "Baby.") {
        updatedGender = "Female"
      } else if (value === "Baby of.") {
        updatedGender = "Other"
      }
    }

    if (name === "area" || name === "pincode") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "Title" && { gender: updatedGender }),
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB")
        return
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, JPEG, and PNG files are allowed")
        return
      }
      setPrescriptionFile(file)
    }
  }

  const handleB2BToggle = () => {
    if (isHomeCollectionEnabled || isHospitalBillEnabled) {
      toast.error("Please disable other segments first before enabling B2B")
      return
    }

    const newB2BState = !isB2BEnabled
    setIsB2BEnabled(newB2BState)

    if (newB2BState) {
      setFormData((prev) => ({
        ...prev,
        segment: "B2B",
        address: { area: "", pincode: "" },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        segment: "Walk-in",
        B2B: "",
        lab_id: "",
        salesMapping: "",
        b2b_area: "",
        phone: "",
        email: "",
      }))
      setClinicalSearchValue("")
      setIsClinicalSelectedFromDropdown(false)
      setClinicalError(false)
    }
  }

  const handleHomeCollectionToggle = () => {
    if (isB2BEnabled || isHospitalBillEnabled) {
      toast.error("Please disable other segments first before enabling Home Collection")
      return
    }

    const newHomeCollectionState = !isHomeCollectionEnabled
    setIsHomeCollectionEnabled(newHomeCollectionState)
    setFormData((prev) => ({
      ...prev,
      segment: newHomeCollectionState ? "Home Collection" : "Walk-in",
    }))
  }

  const handleHospitalToggle = () => {
    if (isB2BEnabled || isHomeCollectionEnabled) {
      toast.error("Please disable other segments first before enabling Hospital Bill")
      return
    }

    const newHospitalState = !isHospitalBillEnabled
    setIsHospitalBillEnabled(newHospitalState)
    setFormData((prev) => ({
      ...prev,
      segment: newHospitalState ? "Hospital" : "Walk-in",
    }))
  }

  const handleEmergencyToggle = () => {
    const newEmergencyState = !isEmergencyEnabled
    setIsEmergencyEnabled(newEmergencyState)
    setFormData((prev) => ({
      ...prev,
      emergency: newEmergencyState,
    }))
  }

  // -----------------------------------------------------------------------
  // Clinical Name handlers
  // -----------------------------------------------------------------------
  const handleClinicalNameSearch = (e) => {
    const value = e.target.value
    setClinicalSearchValue(value)
    setShowClinicalDropdown(true)
    // User is typing — clear the "selected from dropdown" flag and any error
    setIsClinicalSelectedFromDropdown(false)
    setClinicalError(false)

    setFormData((prev) => ({
      ...prev,
      B2B: value,
    }))
  }

  const handleClinicalNameSelect = (clinical) => {
    setClinicalSearchValue(clinical.clinicalname)
    setIsClinicalSelectedFromDropdown(true) // ✅ properly selected
    setClinicalError(false)
    setFormData((prev) => ({
      ...prev,
      B2B: clinical.clinicalname,
      lab_id: clinical.referrerCode || "",
      salesMapping: clinical.salesMapping || "",
      b2b_area: clinical.area || "",
      phone: clinical.phone || "",
      email: clinical.email || "",
    }))
    setShowClinicalDropdown(false)
  }

  // -----------------------------------------------------------------------
  // Ref By handlers
  // -----------------------------------------------------------------------
  const handleRefBySearch = (e) => {
    const value = e.target.value
    setRefBySearchValue(value)
    setShowRefByDropdown(true)
    // User is typing — clear the "selected from dropdown" flag and any error
    setIsRefBySelectedFromDropdown(false)
    setRefByError(false)

    setFormData((prev) => ({
      ...prev,
      refby: value,
    }))
  }

  const handleRefBySelect = (refby) => {
    setRefBySearchValue(refby.name)
    setIsRefBySelectedFromDropdown(true) // ✅ properly selected
    setRefByError(false)
    setFormData((prev) => ({
      ...prev,
      refby: refby.name,
    }))
    setShowRefByDropdown(false)
  }

  const getFilteredRefBys = () => {
    if (!refBySearchValue) return dropdownOptions.referrers
    return dropdownOptions.referrers.filter((refby) =>
      refby.name.toLowerCase().includes(refBySearchValue.toLowerCase()),
    )
  }

  const getFilteredClinicalNames = () => {
    if (!clinicalSearchValue) return dropdownOptions.clinicalNames
    return dropdownOptions.clinicalNames.filter((clinical) =>
      clinical.clinicalname.toLowerCase().includes(clinicalSearchValue.toLowerCase()),
    )
  }

  const handleSearchChange = (e) => {
    const input = e.target.value
    const numericInput = input.replace(/\D/g, "")
    setSearchValue(numericInput)

    if (numericInput.length === 10) {
      searchPatientByPhone(numericInput)
    } else if (numericInput.length === 0) {
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      setPatientSelectionSource(null)
      generateNewPatientId()
      setFormData((prev) => ({
        ...prev,
        patientname: "",
        age: "",
        age_type: "Years",
        gender: "Male",
        phone: isB2BEnabled ? prev.phone : "",
        email: isB2BEnabled ? prev.email : "",
        address: { area: "", pincode: "" },
        patient_history: "",
      }))
      setPrescriptionFile(null)
    } else if (numericInput.length < 10) {
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      setPatientSelectionSource(null)
    }
  }

  const searchPatientByPhone = async (phoneNumber) => {
    try {
      const response = await apiRequest(`${Labbaseurl}patient-get/?phone=${phoneNumber}`, "GET")

      if (response && response.success) {
        let patients = []

        if (Array.isArray(response.data)) {
          patients = response.data
        } else if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            patients = response.data.data
          } else {
            patients = [response.data.data] // Extract the actual patient object
          }
        } else if (response.data && typeof response.data === "object") {
          patients = [response.data]
        }

        if (patients.length >= 1) {
          setMultiplePatients(patients)
          setShowPatientModal(true)
          setIsExistingPatient(false)
          setPatientSelectionSource(null)
          toast.info(`Found ${patients.length} patient(s) with this phone number. Please select one.`)
        } else {
          throw new Error("Patient not found")
        }
      } else {
        throw new Error(response?.error || "Patient not found")
      }
    } catch (error) {
      console.error("Error fetching patient details:", error)
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      setPatientSelectionSource(null)
      generateNewPatientId()
    }
  }

  const getTitleFromName = (name) => {
    const prefixMatch = name.match(/^(MR\.?|MRS\.?|MS\.?|MASTER\.?|MISS\.?|DR\.?|BABY\.?|BABY OF\.?)\s+/i)
    if (prefixMatch) {
      const prefix = prefixMatch[1].toUpperCase().replace(/\.$/, "")
      const titleMap = {
        MR: "Mr.",
        MRS: "Mrs.",
        MS: "Ms.",
        MASTER: "Master.",
        MISS: "Miss.",
        DR: "Dr.",
        BABY: "Baby.",
        "BABY OF": "Baby of.",
      }
      return titleMap[prefix] || "Mr."
    }
    return "Mr."
  }

  const loadPatientData = (data, source = null) => {
    const prefixes = /^(MR\.?|MRS\.?|MS\.?|MASTER\.?|MISS\.?|DR\.?|BABY\.?|BABY OF\.?)\s+/i
    const cleanedName = data.patientname ? data.patientname.replace(prefixes, "").trim() : ""
    const extractedTitle = getTitleFromName(data.patientname || "")

    let parsedAddress = { area: "", pincode: "" }
    if (data.address) {
      if (typeof data.address === "string") {
        try {
          parsedAddress = JSON.parse(data.address)
        } catch (e) {
          console.error("Error parsing address:", e)
          parsedAddress = { area: "", pincode: "" }
        }
      } else if (typeof data.address === "object") {
        parsedAddress = data.address
      }
    }

    let patientGender = data.gender || "Male"
    if (!data.gender) {
      if (extractedTitle === "Mr." || extractedTitle === "Master." || extractedTitle === "Dr.") {
        patientGender = "Male"
      } else if (
        extractedTitle === "Mrs." ||
        extractedTitle === "Ms." ||
        extractedTitle === "Miss." ||
        extractedTitle === "Baby."
      ) {
        patientGender = "Female"
      }
    }

    setOriginalPatientName(cleanedName)

    setFormData((prev) => ({
      ...prev,
      patient_id: data.patient_id || prev.patient_id, // Load the existing ID!
      Title: extractedTitle,
      patientname: cleanedName,
      age: data.age || "",
      age_type: data.age_type || "Years",
      gender: patientGender,
      phone: isB2BEnabled ? prev.phone : (data.phone ? data.phone.replace(/[^0-9]/g, "").slice(-10) : ""),
      email: isB2BEnabled ? prev.email : data.email || "",
      address: isB2BEnabled ? { area: "", pincode: "" } : parsedAddress,
      patient_history: data.patient_history || "",
      appointment_id: data.appointment_id || "",
      sample_collector: data.sample_collector || prev.sample_collector,
    }))

    if (data.emergency) {
      setIsEmergencyEnabled(true)
    } else {
      setIsEmergencyEnabled(false)
    }

    setIsExistingPatient(source === "appointment" ? true : false)
    setShowPatientModal(false)
    setPatientSelectionSource(source)
  }

  const handlePatientSelect = (patient) => {
    loadPatientData(patient, "search")
    toast.success("Patient details loaded (read-only). Ready for billing.")
  }

  const formatAddress = (address) => {
    if (!address) return "N/A"

    let addressObj = address

    if (typeof address === "string") {
      try {
        addressObj = JSON.parse(address)
      } catch (e) {
        console.error("Error parsing address:", e)
        return address || "N/A"
      }
    }

    if (typeof addressObj === "object") {
      const area = addressObj.area || ""
      const pincode = addressObj.pincode || ""

      if (!area && !pincode) return "N/A"
      if (!area) return pincode
      if (!pincode) return area

      return `${area}, ${pincode}`
    }

    return "N/A"
  }

  const validateRequiredFields = () => {
    const errors = []

    if (!formData.patientname.trim()) errors.push("Patient Name is required")
    if (!formData.age) errors.push("Age is required")
    if (!formData.refby.trim()) errors.push("Ref By is required")
    if (!formData.sample_collector.trim()) errors.push("Sample Collector is required")
    if (!formData.branch.trim()) errors.push("Branch is required")

    if (isB2BEnabled && !formData.B2B.trim()) {
      errors.push("Clinical Name is required when B2B is enabled")
    }

    if (isHomeCollectionEnabled) {
      if (!formData.phone.trim()) errors.push("Phone Number is required for Home Collection")
      if (!formData.email.trim()) errors.push("Email ID is required for Home Collection")
      if (!formData.address.area.trim()) errors.push("Area is required for Home Collection")
      if (!formData.address.pincode.trim()) errors.push("Pin Code is required for Home Collection")
    }

    return errors
  }

  // -----------------------------------------------------------------------
  // Submit handler — dropdown-selection validation happens here so the
  // button is always clickable and users get a clear toast message.
  // -----------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    let hasDropdownError = false

    // Validate Ref By — must be chosen from dropdown, not just typed
    if (formData.refby.trim() && !isRefBySelectedFromDropdown) {
      toast.error("Please select Ref By from the dropdown list")
      setRefByError(true)
      hasDropdownError = true
    }

    // Validate Clinical Name — must be chosen from dropdown when B2B is enabled
    if (isB2BEnabled && formData.B2B.trim() && !isClinicalSelectedFromDropdown) {
      toast.error("Please select Clinical Name from the dropdown list")
      setClinicalError(true)
      hasDropdownError = true
    }

    if (hasDropdownError) return

    // Standard field validation
    const validationErrors = validateRequiredFields()
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error))
      return
    }

    setIsSubmitting(true)

    try {
      const fullPatientName = `${formData.Title} ${formData.patientname}`
      const addressData = { area: formData.address.area, pincode: formData.address.pincode }

      let segmentValue = "Walk-in"
      if (isB2BEnabled) segmentValue = "B2B"
      else if (isHomeCollectionEnabled) segmentValue = "Home Collection"
      else if (isHospitalBillEnabled) segmentValue = "Hospital"

      const patientHistory = formData.patient_history.trim() || ""

      // Check if it's a search load and if the name changed
      let finalSelectionSource = patientSelectionSource
      let finalPatientId = formData.patient_id

      if (patientSelectionSource === "search") {
        const isNameChanged = formData.patientname.trim().toLowerCase() !== originalPatientName.trim().toLowerCase()
        if (isNameChanged) {
          finalSelectionSource = null // Treat as new patient!

          // Fetch a NEW patient ID right before submitting
          try {
            const idResponse = await apiRequest(`${Labbaseurl}latest-patient-id/`, "GET")
            if (idResponse && idResponse.patient_id) {
              finalPatientId = idResponse.patient_id
            } else if (idResponse && idResponse.data && idResponse.data.patient_id) {
              finalPatientId = idResponse.data.patient_id
            }
          } catch (e) {
            console.error("Failed to generate new ID for changed name:", e)
          }
        }
      }

      const baseData = {
        patient_id: finalPatientId,
        patientname: fullPatientName,
        age: formData.age,
        age_type: formData.age_type,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address.area.trim() || formData.address.pincode.trim() ? addressData : {},
        registeredby: formData.registeredby,
        emergency: isEmergencyEnabled,
        patient_history: patientHistory,
      }

      const billData = {
        ...baseData,
        date: formData.date,
        lab_id: formData.lab_id,
        refby: formData.refby,
        branch: formData.branch,
        B2B: isB2BEnabled ? formData.B2B : "",
        segment: segmentValue,
        salesMapping: formData.salesMapping,
        sample_collector: formData.sample_collector,
        testdetails: formData.testdetails,
        totalAmount: formData.totalAmount,
        discount: formData.discount,
        payment_method: formData.payment_method,
        credit_amount: formData.credit_amount,
        MultiplePayment: formData.MultiplePayment,
        status: "Registered",
        emergency: isEmergencyEnabled,
        patient_history: patientHistory,
        appointment_id: formData.appointment_id,
      }

      let billPayload = billData
      let headers = {}

      if (prescriptionFile) {
        const billFormData = new FormData()

        Object.keys(billData).forEach((key) => {
          const value = billData[key]
          if (value === null || value === undefined) return

          if (typeof value === "object" && !(value instanceof Date) && key !== "date") {
            billFormData.append(key, JSON.stringify(value))
          } else {
            billFormData.append(key, value)
          }
        })

        billFormData.append("prescription_file", prescriptionFile)
        billPayload = billFormData
        headers = { "Content-Type": undefined }
      }

      if (finalSelectionSource === "search") {
        const billResult = await apiRequest(`${Labbaseurl}create_bill/`, "POST", billPayload, headers)
        if (billResult && billResult.success) {
          toast.success(`Bill created successfully for revisit patient!`)
          resetForm()
        } else {
          toast.error("Failed to create bill. Please try again.")
        }
      } else {
        try {
          const patientResult = await apiRequest(`${Labbaseurl}create_patient/`, "POST", baseData)

          if (patientResult && patientResult.success) {
            const actualPatientId = patientResult.patient_id || patientResult.data?.patient_id || finalPatientId;

            // Update bill payload with actual patient_id if backend generated a new one
            if (billPayload instanceof FormData) {
              billPayload.set("patient_id", actualPatientId);
            } else {
              billPayload.patient_id = actualPatientId;
            }

            const billResult = await apiRequest(`${Labbaseurl}create_bill/`, "POST", billPayload, headers)

            if (billResult && billResult.success) {
              toast.success(`Patient registered and bill created successfully! Patient ID: ${actualPatientId}`, { autoClose: 5000 })
              resetForm()
            } else {
              toast.error("Patient created but failed to create bill. Please create bill manually.")
            }
          } else {
            toast.error("Failed to create patient. Please try again.")
          }
        } catch (error) {
          console.error("Error in patient/bill creation:", error)
          toast.error("Error creating patient or bill. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error saving data:", error)
      toast.error("Error saving data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSearchValue("")
    setIsExistingPatient(false)
    setIsB2BEnabled(false)
    setIsHomeCollectionEnabled(false)
    setIsHospitalBillEnabled(false)
    setIsEmergencyEnabled(false)
    setShowPatientModal(false)
    setMultiplePatients([])
    setPrescriptionFile(null)
    setPatientSelectionSource(null)
    setRefBySearchValue("")
    setClinicalSearchValue("")
    // Reset dropdown flags and errors
    setIsRefBySelectedFromDropdown(false)
    setIsClinicalSelectedFromDropdown(false)
    setRefByError(false)
    setClinicalError(false)

    setFormData({
      patient_id: "",
      date: getCurrentDateWithTime(),
      lab_id: "",
      refby: "",
      branch: "",
      B2B: "",
      segment: "Walk-in",
      Title: "Mr.",
      patientname: "",
      gender: "Male",
      age: "",
      age_type: "Years",
      phone: "",
      email: "",
      address: { area: "", pincode: "" },
      sample_collector: "",
      testdetails: [],
      totalAmount: 0,
      discount: 0,
      payment_method: {},
      credit_amount: 0,
      registeredby: storedName,
      bill_no: "",
      bill_date: null,
      salesMapping: "",
      MultiplePayment: [],
      emergency: false,
      patient_history: "",
      appointment_id: "",
    })

    generateNewPatientId()
  }

  const fetchTodayAppointments = async () => {
    try {
      setIsLoadingAppointments(true)

      const response = await apiRequest(`${Labbaseurl}appointments/`, "GET")

      let appointments = []

      if (response) {
        if (Array.isArray(response)) {
          appointments = response
        } else if (response.success && Array.isArray(response.appointments)) {
          appointments = response.appointments
        } else if (response.success && Array.isArray(response.data)) {
          appointments = response.data
        } else if (Array.isArray(response.data)) {
          appointments = response.data
        } else if (response.data && Array.isArray(response.data.appointments)) {
          appointments = response.data.appointments
        } else if (response.data && Array.isArray(response.data.data)) {
          appointments = response.data.data
        }
      }

      if (appointments.length === 0) {
        toast.info("No appointments found in the system")
        setAppointmentPatients([])
        setShowAppointmentModal(false)
        return
      }

      const today = new Date()
      const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

      const todayAppointments = appointments.filter((appointment) => {
        if (!appointment.appointment_date) return false;
        if (appointment.status === "Cancelled") return false;
        const appointmentDateStr = appointment.appointment_date.split("T")[0].split(" ")[0];
        return appointmentDateStr === todayDate;
      })

      if (todayAppointments.length > 0) {
        setAppointmentPatients(todayAppointments)
        setShowAppointmentModal(true)
        toast.info(`Found ${todayAppointments.length} appointments for today`)
      } else {
        toast.info("No appointments booked for today")
        setAppointmentPatients([])
        setShowAppointmentModal(false)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to fetch appointments. Please try again.")
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const handleAppointmentSelect = (appointment) => {
    const patientData = {
      patient_id: formData.patient_id || "",
      patientname: appointment.patient_name || "",
      age: appointment.age || "",
      age_type: appointment.age_type || "Years",
      gender: appointment.gender || "Male",
      phone: appointment.mobile_number || "",
      email: appointment.email || "",
      address: appointment.address || { area: "", pincode: "" },
      patient_history: appointment.patient_history || "",
      emergency: appointment.emergency || false,
      appointment_id: appointment.appointment_id || "",
      sample_collector: appointment.sample_collector || "",
    }

    loadPatientData(patientData, "appointment")
    setShowAppointmentModal(false)
    toast.success("Appointment patient loaded successfully. Fields are editable.")
  }

  const shouldDisableField = () => {
    return patientSelectionSource === "search" && isExistingPatient
  }

  return (
    <FormContainer>
      <FormCard>
        <StyledTitle>Patient Registration & Billing System</StyledTitle>

        <SearchAndAppointmentContainer>
          <SearchWrapper>
            <SearchContainer>
              <FaSearch size={18} />
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
                    <FaTimes />
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
                    <FaTimes />
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
            <FaCalendar />
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
                  <FaPlus />
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
                    <FaToggleOn style={{ fontSize: "40px", color: "red" }} />
                  ) : (
                    <FaToggleOff style={{ fontSize: "40px", color: "grey" }} />
                  )}
                </div>
              </ToggleContainer>
            </Row>

            <Row className="row-4">
              <ToggleContainer>
                <label>B2B Bill</label>
                <div onClick={handleB2BToggle} className={(isHomeCollectionEnabled || isHospitalBillEnabled) ? "disabled" : ""}>
                  {isB2BEnabled ? (
                    <FaToggleOn style={{ fontSize: "40px", color: "green" }} />
                  ) : (
                    <FaToggleOff style={{ fontSize: "40px", color: "grey" }} />
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
                <div onClick={handleHomeCollectionToggle} className={(isB2BEnabled || isHospitalBillEnabled) ? "disabled" : ""}>
                  {isHomeCollectionEnabled ? (
                    <FaToggleOn style={{ fontSize: "40px", color: "green" }} />
                  ) : (
                    <FaToggleOff style={{ fontSize: "40px", color: "grey" }} />
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

              <ToggleContainer>
                <label>Hospital Bill</label>
                <div onClick={handleHospitalToggle} className={(isB2BEnabled || isHomeCollectionEnabled) ? "disabled" : ""}>
                  {isHospitalBillEnabled ? (
                    <FaToggleOn style={{ fontSize: "40px", color: "blue" }} />
                  ) : (
                    <FaToggleOff style={{ fontSize: "40px", color: "grey" }} />
                  )}
                </div>
              </ToggleContainer>
            </Row>
          </Fieldset>

          <Fieldset>
            <h4>Personal Details</h4>
            <Row className="row-5">
              {patientSelectionSource && (
                <FormGroup>
                  <label>Patient ID</label>
                  <input type="text" name="patient_id" value={formData.patient_id} readOnly />
                </FormGroup>
              )}
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
                      <FaCamera />
                      <FaUpload />
                      {prescriptionFile ? "Change Photo / File" : "Take Photo / Upload"}
                    </label>

                    {prescriptionFile && (
                      <div className="file-name" style={{ marginTop: "10px" }}>
                        <FaFileAlt />
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