#!/usr/bin/env node

/**
 * Generate NextAuth Secret Key
 * Run this script to generate a secure random secret for NEXTAUTH_SECRET
 * Usage: node generate-auth-secret.js
 */

const crypto = require("crypto")

// Generate a 32-byte random secret
const secret = crypto.randomBytes(32).toString("hex")

console.log("\n=".repeat(60))
console.log("🔐 NEXTAUTH_SECRET Generated Successfully!")
console.log("=".repeat(60))
console.log("\nYour secure secret key:")
console.log("\n" + secret)
console.log("\n" + "=".repeat(60))
console.log("\nAdd this to your .env.local file:")
console.log(`\nNEXTAUTH_SECRET=${secret}\n`)
console.log("=".repeat(60))
console.log("\n⚠️  Keep this secret safe and never commit it to git!\n")
