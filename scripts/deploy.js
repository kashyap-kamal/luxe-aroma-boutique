const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting production deployment preparation...');

// Check for required environment variables
console.log('\n⚙️  Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('\n⚠️  WARNING: The following environment variables are not set:');
  missingVars.forEach(varName => console.warn(`   - ${varName}`));
  console.warn('\n   These should be set to your production values before building.');
  console.warn('   Example: NEXT_PUBLIC_APP_URL=https://aromeluxe.in');
  console.warn('\n   The build will continue using fallback values (https://aromeluxe.in)');
  console.warn('   but it\'s recommended to set them explicitly.\n');
}

try {
  // 1. Build the project
  console.log('📦 Building static site...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 2. Check if build was successful
  if (!fs.existsSync('out')) {
    console.error('❌ Build failed: "out" directory not found.');
    process.exit(1);
  }

  // 3. Create archive
  console.log('compressing "out" directory...');
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveName = `deploy-${date}.tar.gz`;
  
  // Using tar command which is available on most systems (including Windows 10+)
  // We change directory to 'out' so the archive doesn't include the 'out' folder itself, just contents
  try {
    execSync(`tar -czf ../${archiveName} .`, { cwd: 'out', stdio: 'inherit' });
    console.log(`✅ Archive created: ${archiveName}`);
  } catch (error) {
    console.error('❌ Failed to create archive. Ensure "tar" is available in your path.');
    console.error(error);
    process.exit(1);
  }

  console.log('\n🎉 Deployment package ready!');
  console.log(`\nTo deploy to Hostinger:`);
  console.log(`1. Upload "${archiveName}" to your public_html directory.`);
  console.log(`2. Extract the archive.`);
  console.log(`3. Verify your site is working.`);
  console.log('\nAlternatively, use an FTP client to upload the contents of the "out" folder directly.');

} catch (error) {
  console.error('❌ Deployment preparation failed.');
  console.error(error);
  process.exit(1);
}

