const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());


const placesRouter = require('./routes/places');
app.use('/api/places', placesRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlandı ✅'))
  .catch(err => console.log('Xəta:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir 🚀`));