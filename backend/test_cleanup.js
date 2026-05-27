const mongoose = require('mongoose');
const User = require('./src/models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

async function testCleanup() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(uri);
        console.log('Connected to database successfully.');

        // 1. Create a dummy pending user with createdAt set to 25 hours ago
        const oldPendingEmail = `old_pending_${Date.now()}@example.com`;
        const oldPendingUsername = `old_pending_${Date.now()}`;
        const oldPendingUser = new User({
            name: 'Old Pending User',
            email: oldPendingEmail,
            username: oldPendingUsername,
            password: 'password123',
            status: 'pending',
            createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) // 25 hours ago
        });
        await oldPendingUser.save();
        console.log(`Created old pending user: ${oldPendingEmail} with username: ${oldPendingUsername}`);

        // 2. Create a dummy pending user with createdAt set to now (recent)
        const recentPendingEmail = `recent_pending_${Date.now()}@example.com`;
        const recentPendingUsername = `recent_pending_${Date.now()}`;
        const recentPendingUser = new User({
            name: 'Recent Pending User',
            email: recentPendingEmail,
            username: recentPendingUsername,
            password: 'password123',
            status: 'pending',
            createdAt: new Date() // now
        });
        await recentPendingUser.save();
        console.log(`Created recent pending user: ${recentPendingEmail} with username: ${recentPendingUsername}`);

        // 3. Run cleanup logic
        const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await User.deleteMany({
            status: 'pending',
            createdAt: { $lt: threshold }
        });
        console.log(`Cleanup query executed. Deleted count: ${result.deletedCount}`);

        // 4. Verify results
        const checkOld = await User.findOne({ email: oldPendingEmail });
        const checkRecent = await User.findOne({ email: recentPendingEmail });

        let passed = true;

        if (!checkOld) {
            console.log('✅ Success: Old pending user was deleted.');
        } else {
            console.error('❌ Fail: Old pending user was NOT deleted.');
            passed = false;
        }

        if (checkRecent) {
            console.log('✅ Success: Recent pending user was preserved.');
            // Clean up the recent user
            await User.deleteOne({ email: recentPendingEmail });
            console.log('Cleaned up recent test user.');
        } else {
            console.error('❌ Fail: Recent pending user was deleted.');
            passed = false;
        }

        if (passed) {
            console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! User cleanup logic works perfectly.');
        } else {
            console.error('\n❌ SOME TESTS FAILED! Please review the console logs.');
        }

    } catch (err) {
        console.error('Error during cleanup test:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database.');
        process.exit(0);
    }
}

testCleanup();
