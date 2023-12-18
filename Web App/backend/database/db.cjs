const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

const conn = mongoose.connection;

conn.on('error', () => console.error('Connection Error'));

conn.once('open', () => console.info('Connection to Database is successful'));

module.exports = conn;
