const mongoose = require('mongoose');
const { WATemplate } = require('./backend/dist/models-nosql/waTemplate.model.js');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/laundryku_wa');
  const temp = await WATemplate.find({});
  console.log('Templates found:', temp.length);
  process.exit(0);
}
test();
