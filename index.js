const dotenv = require('dotenv');
const connectToMongo = require('./db/conn');
const express = require('express')
var cors = require('cors');
connectToMongo();

dotenv.config({ path: './config.env' });

const app = express()
const port = process.env.PORT || 5000;

// To use req.body, we need to use middleware
app.use(express.json()); 
app.use(cors());
// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/records', require('./routes/records'));
app.use('/api/company', require('./routes/company'));



app.listen(port, () => {
  console.log(`T&P App listening at http://localhost:${port}`)
})