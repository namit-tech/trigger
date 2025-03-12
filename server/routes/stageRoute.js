const express = require("express");
const PipelineStage = require("../models/stage-model");

const router = express.Router();

// Create a new pipeline stage
router.post("/create", async (req, res) => {
  const { stage_name, order } = req.body;

  try {
    const newStage = new PipelineStage({ stage_name, order });
    await newStage.save();
    res.status(201).json({
      message: "Pipeline stage created successfully",
      stage: newStage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating pipeline stage", error: error.message });
  }
});

// Get all pipeline stages
router.get("/", async (req, res) => {
  try {
    const stages = await PipelineStage.find().sort({ order: 1 }); // Sort by order
    res.status(200).json(stages);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pipeline stages",
      error: error.message,
    });
  }
});

router.get("/stages", async (req, res) => {
  try {
    const stages = await PipelineStage.find(
      {},
      { _id: 1, stage_name: 1 }
    ).lean();
    console.log("stages", stages);
    res.status(200).json(stages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stages", error: error.message });
  }
});

// Update a pipeline stage
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { stage_name, order } = req.body;

  try {
    const updatedStage = await PipelineStage.findByIdAndUpdate(
      id,
      { stage_name, order },
      { new: true } // Return the updated document
    );
    res.status(200).json({
      message: "Pipeline stage updated successfully",
      stage: updatedStage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating pipeline stage", error: error.message });
  }
});

// Delete a pipeline stage
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await PipelineStage.findByIdAndDelete(id);
    res.status(200).json({ message: "Pipeline stage deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pipeline stage", error: error.message });
  }
});

module.exports = router;
