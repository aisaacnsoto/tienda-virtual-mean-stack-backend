require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

const connect = () => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Conexión exitosa a MongoDB.'))
    .catch(err => console.error('Error en la conexión a MongoDB: ', err));
};

module.exports = connect;