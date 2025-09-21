const express = require("express");
const cors = require("cors");
const hpp = require("hpp");

const { default: helmet } = require("helmet");
const apiRoutes = require("./routes/apiRoutes");
const errorHandler = require("./middlewere/errorhandler");
require("./config/database");

require("dotenv").config();
require("./utils/relations");
const app = express();


app.use(cors());
app.use(helmet());
app.use(hpp());

app.use(express.json());
app.use(errorHandler);

app.use("/api", apiRoutes);

const PORT = process.env.DEFAULT_PORT || 3000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
