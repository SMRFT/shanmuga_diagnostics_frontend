import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from 'styled-components';
import apiRequest from "../Auth/apiRequest";

// Styled Components
const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 0.5rem;
    border: none;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .modal-header {
    border-bottom: 1px solid #f0f5fa;
    padding: 1.25rem 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const SaveButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3182ce;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #4a5568;
  }
  
  &:focus {
    outline: none;
  }
`;

const ModalTitle = styled.h5`
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f5fa;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const RefBy = ({ show, setShow, onRefByAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        qualification: '',
        specialization: '',
        email: '',
        phone: ''
    });
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRefBySave = async (e) => {
    e.preventDefault();
    try {
        await apiRequest(`${Labbaseurl}refby/`, "POST", formData);
        toast.success("RefBy saved successfully!");
        setShow(false);
        onRefByAdded(); // refresh dropdown/list
    } catch (error) {
        console.error("Error saving refby:", error.message);
        toast.error("Error saving RefBy. Please try again.");
    }
    };

    
    const handleClose = () => {
        setShow(false);
    };

    return (
        <StyledModal show={show} onHide={handleClose} centered>
            <ModalHeader>
                <ModalTitle>Add Referring Doctor</ModalTitle>
                <CloseButton onClick={handleClose}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
                <FormContainer onSubmit={handleRefBySave}>
                    <FormGroup>
                        <Label htmlFor="name">Doctor Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter doctor's name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input
                            id="qualification"
                            type="text"
                            placeholder="Enter qualification"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                            id="specialization"
                            type="text"
                            placeholder="Enter specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            
                        />
                    </FormGroup>

                    <SaveButton type="submit">
                        Save Doctor
                    </SaveButton>
                </FormContainer>
            </ModalBody>
        </StyledModal>
    );
};

export default RefBy;