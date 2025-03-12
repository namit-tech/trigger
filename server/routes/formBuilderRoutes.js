const express = require("express");
const Form = require("../models/formBuilder");
const router = express.Router();

// Route to create a new form
router.post("/create-form", async (req, res) => {
  const { form_name } = req.body;

  try {
    // Generate a unique form ID (you can use a library like `uuid` or `nanoid`)
    const form_id = `form_${Math.random().toString(36).substring(2, 9)}`; // Example: "form_abc123"

    // Save the form details
    const newForm = new Form({ form_name, form_id });
    await newForm.save();

    res.status(201).json({ message: "Form created successfully", form: newForm });
  } catch (error) {
    res.status(500).json({ message: "Error creating form", error: error.message });
  }
});

router.get("/forms", async (req, res) => {
  try {
    console.log("Fetching all forms...");
    const forms = await Form.find({}, { id: 1, form_name: 1 });
    console.log("Forms fetched successfully:", forms);
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Error fetching forms", error: error.message });
  }
});

module.exports = router;