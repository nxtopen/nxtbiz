const mongoose = require('mongoose');
const initAdmin = require('./initAdmin'); // Ensure the path is correct

global.mongoose = global.mongoose || { conn: null, promise: null };

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

const cached = global.mongoose;

const dbConnect = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
            // await initAdmin(); // Ensure the admin user is initialized here
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

module.exports = dbConnect;