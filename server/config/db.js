const mongoose = require('mongoose');

const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const conn = await mongoose.connect(
                process.env.MONGODB_URI || 'mongodb://localhost:27017/website-builder',
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }
            );

            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            retries++;
            console.error(`❌ MongoDB connection attempt ${retries} failed:`, error.message);

            if (retries < maxRetries) {
                console.log(`⏳ Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('💥 Max retries reached. Database features will be unavailable.');
                // Don't exit, allow the server to run (at least for health checks)
                // process.exit(1);
            }
        }
    }
};

module.exports = connectDB;
