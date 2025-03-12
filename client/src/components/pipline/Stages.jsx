import React, { useState, useEffect } from "react";
import axios from "axios";

const Stage = () => {
  const [stages, setStages] = useState([]);
  const [stageName, setStageName] = useState("");
  const [order, setOrder] = useState("");

  // Fetch all pipeline stages
  const fetchStages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pipeline");
      setStages(response.data);
    } catch (error) {
      console.error("Error fetching pipeline stages:", error);
    }
  };

  // Create a new pipeline stage
  const createStage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/pipeline/create", {
        stage_name: stageName,
        order: parseInt(order),
      });
      alert(response.data.message);
      fetchStages(); // Refresh the list
    } catch (error) {
      console.error("Error creating pipeline stage:", error);
    }
  };

  // Delete a pipeline stage
  const deleteStage = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/pipeline/${id}`);
      alert(response.data.message);
      fetchStages(); // Refresh the list
    } catch (error) {
      console.error("Error deleting pipeline stage:", error);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  return (
    <div>
      <h1>Pipeline Stages</h1>
      <div>
        <input
          type="text"
          placeholder="Stage Name"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
        <button onClick={createStage}>Create Stage</button>
      </div>
      <ul>
        {stages.map((stage) => (
          <li key={stage._id}>
            {stage.stage_name} (Order: {stage.order})
            <button onClick={() => deleteStage(stage._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stage;