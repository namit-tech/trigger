const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  form_name: { type: String, required: true }, // Add form_name field
  form_id: { type: String, required: true },
  user_email: { type: String, required: true },
  data: { type: Object, required: true }, // Additional form data
});

module.exports = mongoose.model("Submission", submissionSchema);
