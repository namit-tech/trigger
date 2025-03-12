const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const triggerRoutes = require("./routes/triggerRoutes");
const formRoutes = require("./routes/formRoutes");
const stageRoutes = require("./routes/stageRoute");
const formBuilderRoutes = require("./routes/formBuilderRoutes");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Sample Route
app.get('/', (req, res) => {
    res.send('MERN Server is Running');
});

app.use("/api/trigger", triggerRoutes);
app.use("/api/form", formRoutes);
app.use("/api/pipeline", stageRoutes);
app.use("/api/builder", formBuilderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});