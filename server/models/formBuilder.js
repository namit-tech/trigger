const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  form_name: { type: String, required: true, unique: true }, // e.g., "Leads"
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Form", formSchema);