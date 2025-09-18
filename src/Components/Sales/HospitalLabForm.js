import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiRequest from "../Auth/apiRequest";
const HospitalLabForm = ({ show, handleClose, username }) => {
  const initialFormData = {
    date: new Date(),
    clinicalname: "",
    type: "StandAlone",
    contactPerson: "",
    contactNumber: "",
    emailId: "",
    salesMapping: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [message, setMessage] = useState({ type: "", text: "" });
  // Update salesMapping when username prop changes or modal opens
  useEffect(() => {
    if (username && show) {
      setFormData((prev) => ({
        ...prev,
        salesMapping: username,
      }));
    }
  }, [username, show]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };
  const handleSubmitHospitalLabForm = async (e) => {
  e.preventDefault();
  try {
    const formattedDate = format(new Date(formData.date), "yyyy-MM-dd");
    // If apiRequest is a wrapper around axios, make sure it supports POST
const response = await apiRequest(
  `${Labbaseurl}hospitallabform/`,
  "POST", // method must be a string
  {
    ...formData,
    hospitalName: formData.clinicalname, // :white_check_mark: map to backend field
    date: formattedDate,
  }
);
    if (response.status === 201 || response.status === 200) {
      setMessage({
        type: "success",
        text: response.data?.message || "Hospital/Lab details saved successfully!",
      });
      setFormData({
        ...initialFormData,
        salesMapping: username, // Keep username
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
        handleClose();
      }, 2000);
    } else {
      setMessage({
        type: "danger",
        text: "Failed to submit Hospital/Lab form.",
      });
    }
  } catch (error) {
    console.error("Error submitting hospital form:", error);
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const errorMessage = errorData.message
        ? errorData.message
        : Object.values(errorData).flat().join(", ");
      setMessage({ type: "danger", text: errorMessage });
    } else {
      setMessage({ type: "danger", text: "Server error. Try again later." });
    }
  }
};
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Row className="w-100">
          <Col>
            <Modal.Title>Hospital/Lab Details</Modal.Title>
          </Col>
          <Col className="d-flex align-items-center">
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              dateFormat="dd-MM-yyyy"
              className="form-control"
            />
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        {message.text && (
          <Alert
            variant={message.type}
            onClose={() => setMessage({ type: "", text: "" })}
            dismissible
          >
            {message.text}
          </Alert>
        )}
        <Form>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="clinicalname">
                <Form.Label>Hospital/Lab Name</Form.Label>
                <Form.Control
                  type="text"
                  name="clinicalname"
                  value={formData.clinicalname}
                  onChange={handleChange}
                  placeholder="Enter hospital/lab name"
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="StandAlone">StandAlone</option>
                  <option value="Lab">Lab</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="contactPerson">
                <Form.Label>Contact Person</Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Enter contact person's name"
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="contactNumber">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="emailId">
                <Form.Label>Email ID</Form.Label>
                <Form.Control
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="Enter email ID"
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="salesMapping">
                <Form.Label>Sales Person Name</Form.Label>
                <Form.Control
                  type="text"
                  name="salesMapping"
                  value={formData.salesMapping}
                  onChange={handleChange}
                  placeholder="Enter sales person name"
                  required
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmitHospitalLabForm}
            className="mt-3"
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default HospitalLabForm;