import mongoose from 'mongoose';

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/expense_tracker';

/**
 * Connects to MongoDB using MONGO_URI from environment variables.
 * Automatically falls back to local MongoDB if an unconfigured placeholder is detected.
 */
const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<cluster>')) {
    console.warn('⚠️ Placeholder detected in MONGO_URI. Falling back to local MongoDB:', DEFAULT_LOCAL_URI);
    uri = DEFAULT_LOCAL_URI;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB primary connection failed (${uri}): ${error.message}`);
    
    // If Atlas connection failed and wasn't already local, try local MongoDB as fallback
    if (uri !== DEFAULT_LOCAL_URI) {
      console.log('🔄 Attempting fallback to local MongoDB instance...');
      try {
        const fallbackConn = await mongoose.connect(DEFAULT_LOCAL_URI);
        console.log(`✅ Connected to local MongoDB fallback: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`❌ Local MongoDB fallback also failed: ${fallbackError.message}`);
      }
    }

    process.exit(1);
  }
};

export default connectDB;
