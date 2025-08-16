# Getting Started with Homework Planner App

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

### 3. Run on Your Device
- **Option A: Use Expo Go (Recommended)**
  - Download "Expo Go" app from App Store/Google Play
  - Open Expo Go and scan the QR code from your terminal
  - The app will load on your phone

- **Option B: Use Android Emulator**
  - Install Android Studio
  - Set up an Android emulator
  - Run: `npm run android`

- **Option C: Use iOS Simulator (Mac only)**
  - Install Xcode
  - Run: `npm run ios`

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Run `npm install` again
   - Clear cache: `npx expo start --clear`

2. **App won't load on device**
   - Make sure your phone and computer are on the same WiFi network
   - Try using a tunnel connection: `npx expo start --tunnel`

3. **Build errors**
   - Clear all caches: `npx expo start --clear`
   - Delete `node_modules` and run `npm install` again

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Visit the [React Native documentation](https://reactnative.dev/)
- Ask questions on [Stack Overflow](https://stackoverflow.com/)

## Next Steps

Once the app is running, you can:
1. Add your first homework assignment
2. Explore the different screens
3. Try the search and filter features
4. Check out the settings

Happy coding! 🚀
