import React, { useState, useEffect } from "react";
import axios from "axios";

const Form = () => {
  const [forms, setForms] = useState([]); // State to store all forms
  const [selectedFormId, setSelectedFormId] = useState(""); // State to store the selected form ID
  const [formData, setFormData] = useState({ user_email: "", data: "" }); // State to store form data

  // Fetch all forms from the backend
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/builder/forms");
        console.log("Forms fetched successfully:", response.data);   
        // Ensure the response contains _id and form_name
        const formattedForms = response.data.map((form) => ({
          _id: form._id,
          form_name: form.form_name,
        }));
        
        setForms(formattedForms);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/form/submit", {
        ...formData,
        _id: selectedFormId, // Pass the selected form ID
      });
      alert(response.data.message);
      setFormData({ user_email: "", data: "" }); // Clear the form after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Fill Out a Form</h2>
      <div style={styles.formList}>
        {forms.map((form) => (
          <div
            key={form._id}
            style={styles.formItem}
            onClick={() => setSelectedFormId(form._id)} // Use _id instead of form_id
          >
            <h3 style={styles.formName}>{form.form_name}</h3>
          </div>
        ))}
      </div>
      {selectedFormId && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="user_email" style={styles.label}>
              User Email:
            </label>
            <input
              type="email"
              id="user_email"
              placeholder="Enter your email"
              value={formData.user_email}
              onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="data" style={styles.label}>
              Data:
            </label>
            <input
              type="text"
              id="data"
              placeholder="Enter data"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Form;

// Styles for the Form-Filling UI
const styles = {
  container: {
    maxWidth: "800px",
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
  formList: {
    marginBottom: "20px",
  },
  formItem: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
  formName: {
    margin: "0",
    color: "#007bff",
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
};