/**
 * MongoDB Index Fixer
 * Fixes the email/phone/username indexes to support phone-only login
 * 
 * Run: node fix-mongodb-indexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  console.log('🔧 Starting MongoDB Index Fixer...\n');
  
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    console.log('📊 Checking current indexes...');
    const existingIndexes = await users.indexes();
    console.log('Current indexes:', existingIndexes.map(i => i.name).join(', '));
    console.log('');
    
    // Fix email index
    console.log('🔨 Fixing email index...');
    try {
      await users.dropIndex('email_1');
      console.log('  ✅ Dropped old email index');
    } catch (err) {
      console.log('  ⚠️  Email index not found (already fixed or never existed)');
    }
    
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('  ✅ Created sparse email index (allows multiple nulls)\n');
    
    // Fix phone index
    console.log('🔨 Fixing phone index...');
    try {
      await users.dropIndex('phone_1');
      console.log('  ✅ Dropped old phone index');
    } catch (err) {
      console.log('  ⚠️  Phone index not found (already fixed or never existed)');
    }
    
    await users.createIndex({ phone: 1 }, { unique: true, sparse: true });
    console.log('  ✅ Created sparse phone index\n');
    
    // Fix username index
    console.log('🔨 Fixing username index...');
    try {
      await users.dropIndex('username_1');
      console.log('  ✅ Dropped old username index');
    } catch (err) {
      console.log('  ⚠️  Username index not found (already fixed or never existed)');
    }
    
    await users.createIndex({ username: 1 }, { unique: true, sparse: true });
    console.log('  ✅ Created sparse username index\n');
    
    // Verify
    console.log('✨ Verifying fixes...');
    const newIndexes = await users.indexes();
    const emailIdx = newIndexes.find(i => i.key.email);
    const phoneIdx = newIndexes.find(i => i.key.phone);
    const usernameIdx = newIndexes.find(i => i.key.username);
    
    console.log('\nFinal Index Configuration:');
    console.log('  Email:', emailIdx ? `✅ Sparse: ${emailIdx.sparse || false}` : '❌ Missing');
    console.log('  Phone:', phoneIdx ? `✅ Sparse: ${phoneIdx.sparse || false}` : '❌ Missing');
    console.log('  Username:', usernameIdx ? `✅ Sparse: ${usernameIdx.sparse || false}` : '❌ Missing');
    
    console.log('\n🎉 All indexes fixed successfully!');
    console.log('💡 You can now use phone OTP login with multiple users.');
    console.log('🚀 Try logging in with different phone numbers!\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Error fixing indexes:', err.message);
    console.error('\nFull error:', err);
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Make sure MONGO_URI is set in backend/.env');
    console.log('  2. Make sure MongoDB Atlas is accessible');
    console.log('  3. Check that your IP is whitelisted in Atlas');
    console.log('  4. Verify database connection string is correct\n');
    process.exit(1);
  }
}

// Run the fixer
fixIndexes();
