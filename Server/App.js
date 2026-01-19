require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const student = require("./routes/studentRoute");
const teacher = require("./routes/teacherRoute");
const asana = require("./routes/asanaRoute");
const sequence = require("./routes/sequenceRoute");
const classRoute = require("./routes/classRoute");
const admin = require("./routes/adminRoute");
const formData = require("./routes/formRoute");


const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log("MongoDB connected and listening at ", process.env.PORT);
  });
})
.catch(err => console.error('MongoDB connection error:', err));

// app.set("view engine", "ejs");
app.use("/api/student", student);
app.use("/api/teacher", teacher);
app.use("/api/asana", asana);
app.use("/api/sequence", sequence);
app.use("/api/class",classRoute);
app.use("/api/admin", admin);
app.use('/api/form', formData);
