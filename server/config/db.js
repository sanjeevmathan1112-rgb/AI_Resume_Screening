const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/ai-resume-screening';

  if (primaryUri && primaryUri !== fallbackUri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`\n[WARNING] MongoDB Atlas connection failed: ${error.message}`);
      console.warn('NOTE: Your current public IP is likely not whitelisted on MongoDB Atlas Network Access.');
      console.log('Switching to local MongoDB fallback so the app stays functional...\n');
    }
  }

  try {
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Fatal: Could not connect to MongoDB. ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
