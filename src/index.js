const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const { default: helmet } = require('helmet');
const apiRoutes = require('./routes/apiRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(hpp());

app.use(express.json());

app.use('/api',apiRoutes);

PORT = process.env.DEFAULT_PORT;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});