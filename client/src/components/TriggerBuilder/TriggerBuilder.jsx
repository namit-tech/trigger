import React, { useState, useEffect } from "react";
import axios from "axios";

const TriggerBuilder = () => {
  const [triggerData, setTriggerData] = useState({
    event_source: "",
    conditions: { form_id: "" },
    action: { move_to_stage: "" },
  });

  const [forms, setForms] = useState([]); // State to store form IDs
  const [stages, setStages] = useState([]); // State to store stage names
  const [eventSources, setEventSources] = useState([]); // State to store event sources
  const [predefinedTriggers, setPredefinedTriggers] = useState([]); // State to store predefined triggers

  // Fetch form IDs, stage names, event sources, and predefined triggers from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch forms
        const formsResponse = await axios.get("http://localhost:5000/api/form/forms");
        console.log("Forms response:", formsResponse.data);
        setForms(formsResponse.data);

        // Fetch stages
        const stagesResponse = await axios.get("http://localhost:5000/api/pipeline/stages");
        console.log("Stages response:", stagesResponse.data);
        setStages(stagesResponse.data);

        // Fetch event sources from the Trigger collection
        const eventSourcesResponse = await axios.get("http://localhost:5000/api/trigger/event-sources");
        console.log("Event sources response:", eventSourcesResponse.data);
        setEventSources(eventSourcesResponse.data);

        // Fetch predefined triggers
        const predefinedTriggersResponse = await axios.get("http://localhost:5000/api/trigger/predefined");
        console.log("Predefined triggers response:", predefinedTriggersResponse.data);
        setPredefinedTriggers(predefinedTriggersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateTrigger = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/trigger/create", triggerData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error creating trigger:", error);
    }
  };

  return (
    <form onSubmit={handleCreateTrigger}>
      <select
        value={triggerData.event_source}
        onChange={(e) => setTriggerData({ ...triggerData, event_source: e.target.value })}
      >
        <option value="">Select Event Source</option>
        {eventSources.map((eventSource, index) => (
          <option key={index} value={eventSource}>
            {eventSource}
          </option>
        ))}
      </select>
      <select
        value={triggerData.conditions.form_id}
        onChange={(e) =>
          setTriggerData({
            ...triggerData,
            conditions: { ...triggerData.conditions, form_id: e.target.value },
          })
        }
      >
        <option value="">Select Form ID</option>
        {forms.map((form) => (
          <option key={form._id} value={form.form_id}>
            {form.form_name}
          </option>
        ))}
      </select>
      <select
        value={triggerData.action.move_to_stage}
        onChange={(e) =>
          setTriggerData({
            ...triggerData,
            action: { ...triggerData.action, move_to_stage: e.target.value },
          })
        }
      >
        <option value="">Select Stage</option>
        {stages.map((stage) => (
          <option key={stage._id} value={stage._id}>
            {stage.stage_name}
          </option>
        ))}
      </select>
      <button type="submit">Create Trigger</button>

      {/* Display predefined triggers */}
      <div>
        <h3>Predefined Triggers</h3>
        {Array.isArray(predefinedTriggers) && predefinedTriggers.map((trigger) => (
          <div key={trigger._id}>
            <p>Event Source: {trigger.event_source}</p>
            <p>Conditions: {JSON.stringify(trigger.conditions)}</p>
            <p>Action: {JSON.stringify(trigger.action)}</p>
          </div>
        ))}
      </div>
    </form>
  );
};

export default TriggerBuilder;