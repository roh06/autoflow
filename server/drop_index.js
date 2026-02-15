const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garage-db';

const fixIndexes = async () => {
    try {
        console.log('Connecting to MongoDB at:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        // Check if collection exists
        const collections = await mongoose.connection.db.listCollections({ name: 'customers' }).toArray();
        if (collections.length === 0) {
            console.log('Customer collection not found. Nothing to drop.');
            process.exit(0);
        }

        const collection = mongoose.connection.db.collection('customers');
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        const oldIndex = indexes.find(i => i.name === 'phone_1');
        if (oldIndex) {
            console.log('Found conflicting index "phone_1". Dropping it...');
            await collection.dropIndex('phone_1');
            console.log('SUCCESS: Dropped "phone_1" index.');
        } else {
            console.log('Index "phone_1" not found.');
            // Check for any other unique index on phone only
            const uniquePhoneIndex = indexes.find(i => i.key.phone === 1 && Object.keys(i.key).length === 1 && i.unique);
            if (uniquePhoneIndex) {
                console.log(`Found another unique phone index: "${uniquePhoneIndex.name}". Dropping it...`);
                await collection.dropIndex(uniquePhoneIndex.name);
                console.log(`SUCCESS: Dropped "${uniquePhoneIndex.name}" index.`);
            }
        }

        console.log('Verifying indexes...');
        const newIndexes = await collection.indexes();
        console.log('New Indexes:', newIndexes.map(i => i.name));

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('FATAL ERROR:', err);
        process.exit(1);
    }
};

fixIndexes();
