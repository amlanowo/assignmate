# AssignMate App Deployment Guide

## 🚀 How to Make Your App Available for Download

### **Current Setup:**
- ✅ Website is ready with download buttons
- ✅ Android download button points to `assets/assignmate.apk`
- ✅ Smart detection: shows message if APK doesn't exist yet

### **Step 1: Build Production APK**

Run this command in your project root:
```bash
eas build --platform android --profile production
```

This will:
- Create a production-ready APK
- Sign it with your app's certificate
- Make it installable on any Android device

### **Step 2: Download and Upload APK**

1. **Download the APK** from the EAS build link
2. **Rename it** to `assignmate.apk`
3. **Upload it** to your website's `assets/` folder
4. **Deploy your website** (Netlify, Vercel, etc.)

### **Step 3: Test the Download**

Once uploaded:
- Visit your website
- Click "Download for Android"
- The APK should download automatically
- Users can install it on their Android devices

### **Alternative: Google Play Store**

For wider distribution:
1. Create Google Play Developer account ($25)
2. Upload APK through Play Console
3. Update website to link to Play Store
4. Get more users and better discoverability

### **File Structure After Upload:**
```
website/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── icon.png
│   ├── favicon.png
│   └── assignmate.apk  ← Your app goes here
└── README.md
```

### **Security Note:**
- APK files are safe to host on websites
- Users need to enable "Install from unknown sources" on Android
- Consider adding installation instructions to your website

### **Next Steps:**
1. Build the production APK
2. Upload to website assets
3. Deploy website
4. Share your app with the world! 🎉

