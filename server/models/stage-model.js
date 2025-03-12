const mongoose = require("mongoose");

const pipelineStageSchema = new mongoose.Schema({
  stage_name: { type: String, required: true, unique: true }, // Name of the stage (e.g., "Lead Qualification")
  order: { type: Number, required: true }, // Order of the stage in the pipeline
});

module.exports = mongoose.model("PipelineStage", pipelineStageSchema);