const express = require("express");
const cors = require("cors");

const app = express();

/* Middlewares */
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(express.json());

/* Models */
require("./models/Admin");
require("./models/Student");
require("./models/Shift");

/* Routes */
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/seats", require("./routes/seatRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/password", require("./routes/passwordRoutes"));

/* Health check */
app.get("/", (req, res) => {
  res.send("Library Admin Backend is running");
});

module.exports = app;