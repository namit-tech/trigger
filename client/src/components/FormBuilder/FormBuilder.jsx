import React, { useState } from "react";
import axios from "axios";

const FormBuilder = () => {
  const [formName, setFormName] = useState(""); // State to store form name
  const [message, setMessage] = useState(""); // State to display success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to the backend
      const response = await axios.post("http://localhost:5000/api/builder/create-form", {
        form_name: formName,
      });

      // Display success message
      setMessage(`Form created successfully! Form ID: ${response.data.form.form_id}`);
      setFormName(""); // Clear the input field
    } catch (error) {
      // Display error message
      setMessage(`Error creating form: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create a New Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="formName" style={styles.label}>
            Form Name:
          </label>
          <input
            type="text"
            id="formName"
            placeholder="Enter form name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Create Form
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default FormBuilder;

// Styles for the Form Builder UI
const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    color: "#28a745",
    textAlign: "center",
  },
};