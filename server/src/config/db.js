const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // If no MongoDB URI is configured, use in-memory MongoDB for development/testing
    if (!uri || uri === 'mongodb://localhost:27017/hiresense') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log('🧪 Using in-memory MongoDB for development');
      } catch {
        uri = 'mongodb://localhost:27017/hiresense';
        console.log('📡 Connecting to local MongoDB...');
      }
    }

    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
