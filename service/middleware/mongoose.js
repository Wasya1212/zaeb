const mongoose = require('mongoose');

mongoose
  .connect('mongodb://wasya1212:wasya1212@ds042677.mlab.com:42677/practic', { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected..."))
  .catch(err => console.error(err));

module.exports = mongoose;
