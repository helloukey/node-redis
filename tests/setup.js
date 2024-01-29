require('dotenv').config();
require('../models/User');
 
const mongoose = require('mongoose');
 
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
afterAll(async () => {
  await mongoose.disconnect();
});