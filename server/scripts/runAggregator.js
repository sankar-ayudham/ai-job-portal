import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fetchRemoteOKJobs } from '../services/jobAggregator.js';
import User from '../models/User.js';

// Removed the custom path. Since you run this from the 'server' directory, 
// default dotenv config will perfectly find 'server/.env'
dotenv.config(); 

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('Error: MONGO_URI is missing. Please ensure your .env file is inside the server folder.');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Job Aggregation');

        // Find the first user in your DB to assign these external jobs to
        const adminUser = await User.findOne();
        
        if (!adminUser) {
            console.error('Error: You need at least one registered user to assign external jobs to.');
            process.exit(1);
        }

        console.log(`Assigning imported jobs to User ID: ${adminUser._id}`);
        
        // Execute the fetch
        await fetchRemoteOKJobs(adminUser._id);
        
        console.log('Aggregation complete. Exiting script.');
        process.exit(0);
    } catch (err) {
        console.error('Script Failed:', err);
        process.exit(1);
    }
};

run();