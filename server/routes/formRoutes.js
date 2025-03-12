const express = require("express");
const Submission = require("../models/form");
const Form = require("../models/formBuilder");
const Trigger = require("../models/Trigger-Model");
const PipelineStage = require("../models/stage-model");
const router = express.Router();
const mongoose = require("mongoose");
const { Types } = mongoose; // Import Types for ObjectId

router.post("/submit", async (req, res) => {
  const { user_email, data, _id } = req.body;

  console.log("Received request body:", req.body); // Log the entire request body

  try {
    // Log the start of form lookup
    console.log("Looking up form with form_id:", _id);

    // Find the form by form_id
    const form = await Form.findOne({ _id });
    if (!form) {
      console.log("Form not found for form_id:", _id); // Log if form is not found
      return res.status(404).json({ message: "Form not found" });
    }

    // Log the form details
    console.log("Form found:", form);

    // Log the start of submission creation
    console.log("Creating submission with form details:", {
      form_name: form.form_name,
      form_id: form._id,
      user_email,
      data,
    });

    // Save the submission with the form name and ID
    const submission = new Submission({
      form_name: form.form_name,
      form_id: form._id,
      user_email,
      data,
    });
    await submission.save();

    // Log the saved submission
    console.log("Submission saved successfully:", submission);

    // Log the start of trigger evaluation
    console.log("Fetching triggers for event_source: form_submission");

    // Evaluate triggers
    const triggers = await Trigger.find({ event_source: "form_submission" });
    console.log("Fetched triggers:", triggers);

    for (const trigger of triggers) {
      console.log("Evaluating trigger:", trigger);

      // Log the trigger conditions
      console.log("Trigger conditions:", trigger.conditions);

      if (trigger.conditions.form_id === _id) {
        console.log("Trigger condition matched for form_id:", _id);

        // Log the action to be taken
        console.log("Trigger action:", trigger.action);

        // Find the stage to move to
        const stage = await PipelineStage.findOne({
          stage_name: trigger.action.move_to_stage,
        });
        console.log("Fetched stage for action:", stage);

        if (stage) {
          // Log the stage details
          console.log("Stage found:", stage);

          // Update the submission with the new stage
          submission.current_stage_id = stage._id;
          await submission.save();

          // Log the updated submission
          console.log("Submission moved to stage:", stage.stage_name);
        } else {
          console.log(
            "Stage not found for action:",
            trigger.action.move_to_stage
          );
        }
      } else {
        console.log("Trigger condition did not match for form_id:", _id);
      }
    }

    // Log the successful submission response
    console.log("Form submitted successfully. Sending response.");

    res
      .status(201)
      .json({ message: "Form submitted successfully", submission });
  } catch (error) {
    // Log the error
    console.error("Error submitting form:", error);

    res
      .status(500)
      .json({ message: "Error submitting form", error: error.message });
  }
});


router.get("/leads-by-stages", async (req, res) => {
  try {
    console.log("Fetching triggers with event_source: form_submission...");

    // Fetch all triggers with event_source = "form_submission"
    const triggers = await Trigger.find({ event_source: "form_submission" });
    console.log("Triggers fetched successfully:", triggers);

    // Fetch all pipeline stages
    const stages = await PipelineStage.find().sort({ order: 1 });
    console.log("Stages fetched successfully:", stages);

    // Fetch all forms
    const forms = await Form.find();
    console.log("Forms fetched successfully:", forms);

    // Fetch leads for each trigger and group by stage
    const leadsByStages = await Promise.all(
      triggers.map(async (trigger) => {
        const { form_id } = trigger.conditions; // Extract form_id from trigger conditions
        const { move_to_stage } = trigger.action; // Extract move_to_stage from trigger action

        console.log(
          `Fetching submissions for form_id: ${form_id} and stage: ${move_to_stage}`
        );

        // Convert form_id and move_to_stage to ObjectId
        const formObjectId = new Types.ObjectId(form_id);
        const stageObjectId = new Types.ObjectId(move_to_stage);

        // Find the form by form_id
        const form = forms.find((f) => f._id.equals(formObjectId));
        console.log("formidss", form);
        
        if (!form) {
          console.log(`Form not found: ${form_id}`);
          return null;
        }

        // Find the stage by _id
        const stage = stages.find((s) => s._id.equals(stageObjectId));
        console.log("stageidss", stage);
        if (!stage) {
          console.log(`Stage not found: ${move_to_stage}`);
          return null;
        }

        // Fetch submissions for the form_id and current_stage_id
        const submissions = await Submission.find({
          _id: formObjectId, // Use ObjectId for form_id
        });

        console.log(
          `Submissions for form_id ${form_id}:`,
          submissions
        );

        return {
          stage: stage.stage_name,
          leads: form_id,
        };
      })
    );

    // Filter out null values (forms or stages not found)
    const filteredLeadsByStages = leadsByStages.filter((group) => group !== null);

    console.log("Leads by stages fetched successfully:", filteredLeadsByStages);
    res.status(200).json(filteredLeadsByStages);
  } catch (error) {
    console.error("Error fetching leads by trigger:", error);
    res.status(500).json({
      message: "Error fetching leads by trigger",
      error: error.message,
    });
  }
});

router.get("/forms", async (req, res) => {
  try {
    // Fetch forms and project _id as form_id
    const forms = await Submission.find({}, { form_id: 1, form_name: 1 }).lean(); // Use .lean() for plain JavaScript objects

    // Transform the response to rename _id to form_id
    const transformedForms = forms.map((form) => ({
      form_id: form.form_id, // Rename _id to form_id
      form_name: form.form_name, // Include form_name if needed
    }));

    console.log("Form IDs:", transformedForms); // Log the transformed data
    res.status(200).json(transformedForms); // Send the transformed response
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error: error.message });
  }
});

module.exports = router;
