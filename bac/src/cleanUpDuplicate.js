// cleanupDuplicates.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DBURL = process.env.DBURL;

mongoose.connect(DBURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
    console.log("Connected to MongoDB");

    try {
        const meetingsCollection = db.collection('meetings');

        // Find duplicate meetingCodes with creator_id: null
        const duplicates = await meetingsCollection.aggregate([
            { $match: { creator_id: null } },
            { $group: { _id: "$meetingCode", count: { $sum: 1 }, ids: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]).toArray();

        for (const dup of duplicates) {
            // Keep the first document and remove the rest
            const [firstId, ...duplicateIds] = dup.ids;
            await meetingsCollection.deleteMany({ _id: { $in: duplicateIds } });
            console.log(`Removed duplicates for meetingCode '${dup._id}':`, duplicateIds);
        }

        console.log("Duplicate cleanup completed.");
    } catch (error) {
        console.error("An error occurred during cleanup:", error);
    } finally {
        mongoose.connection.close();
    }
});