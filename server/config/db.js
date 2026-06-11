import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // If we don't have a database URL yet, safely skip connecting
        if (!process.env.MONGO_URI) {
            console.log('[Database] MONGO_URI missing in .env. Skipping database connection (Will configure in Phase 3).');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database Error] Connection failed: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;