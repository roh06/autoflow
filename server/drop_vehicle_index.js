const mongoose = require('mongoose');
require('dotenv').config();

// Use MONGODB_URI from .env
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error('FATAL: MONGODB_URI is not defined in .env');
    process.exit(1);
}

const dropIndex = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB:', mongoose.connection.name);

        const collection = mongoose.connection.db.collection('vehicles');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        const plateIndex = indexes.find(i => i.name === 'plateNumber_1');
        if (plateIndex) {
            console.log('Found "plateNumber_1" index. Dropping it...');
            await collection.dropIndex('plateNumber_1');
            console.log('SUCCESS: Dropped "plateNumber_1" index.');
        } else {
            console.log('"plateNumber_1" index not found.');
        }

        // Verify again
        const newIndexes = await collection.indexes();
        console.log('Indexes after drop attempt:', newIndexes.map(i => i.name));

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

dropIndex();
