# 🚀 Quick Start Guide - Razorpay Checkout

## Problem: "Can't checkout properly" - Form doesn't work

If you're seeing validation errors or the checkout form isn't working, follow these steps:

## ⚡ Quick Fix (1 minute setup)

### Step 1: Create Environment File
Create a `.env.local` file in your project root with this content:

```env
# Razorpay Test Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Luxe Aroma Boutique
VITE_RAZORPAY_TEST_MODE=true
```

### Step 2: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test the Checkout
1. Add items to cart
2. Go to checkout
3. Fill the form (use any test data)
4. The yellow warning should disappear
5. Form validation errors will now show clearly

## 📋 Test Data Examples

Use this test data to quickly fill the form:

```
First Name: John
Last Name: Doe
Email: john.doe@example.com
Phone: 9876543210 (or +91 9876543210)
Address: 123 Test Street
City: Mumbai
State: Maharashtra
Postal Code: 400001
Country: India
```

## 🔍 Debug Information

The checkout form now includes detailed debug logging:
- Open browser console (F12) when submitting
- Look for emoji-prefixed logs (🚀, 📝, 🔍, etc.)
- This will show exactly what's happening

## ⚠️ Common Issues & Solutions

### 1. Yellow Warning: "Payment System Not Configured"
**Solution:** Create the `.env.local` file as shown above

### 2. Form Validation Errors Not Showing
**Solution:** Check the red error box at the top of the form - it now lists all errors

### 3. Phone Number Validation Failing
**Solution:** Use 10-digit number starting with 6-9 (e.g., 9876543210)

### 4. Terms and Conditions Error
**Solution:** Make sure to check the checkbox at the bottom

### 5. Console Errors
**Solution:** Check browser console for detailed error messages with emojis

## 🧪 Testing Payment Flow

With the test key provided:
1. ✅ Form validation will work
2. ✅ Payment modal will open (Razorpay test environment)
3. ✅ You can test with fake payment methods
4. ✅ Order success page will display

## 🔑 Production Setup

For production, replace the test key with your real Razorpay key:
1. Sign up at https://razorpay.com
2. Get your live API keys
3. Replace `VITE_RAZORPAY_KEY_ID` in your production environment

## 📞 Still Having Issues?

If checkout still doesn't work:
1. Clear browser cache
2. Check browser console for errors
3. Ensure you have items in cart
4. Try with different test data
5. Check network tab for failed requests

---

*The debug logging and improved error display should make it much easier to identify what's going wrong!* 