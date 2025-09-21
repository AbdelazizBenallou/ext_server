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

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENTSECRET,
  authorizationParams: {
    response_type: "code",
    scope: "openid profile email",
  },
};

app.use(cors());
app.use(helmet());
app.use(hpp());

app.use(express.json());
app.use(errorHandler);

app.use("/api", apiRoutes);

const PORT = process.env.DEFAULT_PORT || 4000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
