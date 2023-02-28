const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const pillRoutes = require("./routes/pillRoute");

const app = express();

//.Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", pillRoutes);

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`is running on port ${PORT}`);
      setInterval(() => {
        console.log("Pinging the app to keep it awake...");
        fetch("https://<your-project-name>.glitch.me")
          .then((response) => console.log("App is awake"))
          .catch((error) => console.log("Error while pinging the app"));
      }, 4 * 60 * 1000); // ping every 4 minutes
    });
  })
  .catch((err) => console.log(err));
