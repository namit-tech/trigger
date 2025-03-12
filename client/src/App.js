import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Form from "./components/Form/Form";
import TriggerBuilder from "./components/TriggerBuilder/TriggerBuilder";
import Stage from "./components/pipline/Stages";
import Leads from "./components/pipline/Leads";
import FormBuilder from "./components/FormBuilder/FormBuilder";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Form</Link>
              <Link to="/formbuilder">FormBuilder</Link>
            </li>
            <li>
              <Link to="/trigger-builder">Trigger Builder</Link>
            </li>
            <li>
              <Link to="/stages">Pipeline</Link>
              <Link to="/leads">Leads</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/trigger-builder" element={<TriggerBuilder />} />
          <Route path="/stages" element={<Stage />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/formbuilder" element={<FormBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;