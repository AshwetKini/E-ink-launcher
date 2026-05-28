# E-Ink Launcher - Android APK Build Instructions

## Responsive Design Features

The launcher now includes responsive layouts for all screen sizes:
- **Small screens** (< 400px): Compact UI with smaller fonts and icons
- **Medium screens** (400-767px): Standard mobile layout
- **Tablets** (>= 768px): Optimized grid layouts, larger touch targets, and better spacing

## Building the Android APK

### Option 1: EAS Build (Recommended - Easy)

EAS Build is Expo's cloud build service that handles APK generation automatically.

#### Prerequisites
1. Create an Expo account at https://expo.dev
2. Install EAS CLI: `npm install -g eas-cli`
3. Log in to your Expo account: `eas login`

#### Build Steps
```bash
# Build APK for Android (Preview build)
eas build --platform android --profile preview

# Or build for production
eas build --platform android --profile production
```

After the build completes (usually 5-15 minutes), you'll receive a download link for the APK.

### Option 2: Local Build (Advanced)

If you prefer building locally or need more control:

#### Prerequisites
1. Install Android Studio
2. Set up Android SDK (API level 34 recommended)
3. Configure ANDROID_HOME environment variable
4. Install Java JDK 17 or higher

#### Build Steps
```bash
# Generate native Android project
npx expo prebuild --platform android

# Navigate to android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Or build release APK (requires signing)
./gradlew assembleRelease
```

The APK will be located at:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### Option 3: Using EAS Local Build

```bash
# Requires Android SDK setup
eas build --platform android --profile preview --local
```

## APK Installation

### On Android Device
1. Enable "Install from unknown sources" in Settings > Security
2. Transfer the APK to your device
3. Open the APK file and tap "Install"
4. When the installation completes, tap "Open"

### Setting as Default Launcher
1. After installation, press the Home button
2. Android will prompt you to choose a default launcher
3. Select "E-Ink Launcher" and tap "Always"

## Build Profiles

The `eas.json` file contains three build profiles:

- **development**: For testing during development
- **preview**: Builds an APK for quick testing
- **production**: Optimized build for distribution

## Customizing the Build

### App Name and Icon
Edit `app.json` to change:
- App display name
- App icon (`./assets/images/icon.png`)
- Package name (`com.eink.launcher`)

### Version Management
Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

## Troubleshooting

### Build Fails
1. Check you're logged in: `eas whoami`
2. Clear cache: `eas build --clear-cache`
3. Verify app.json configuration

### Installation Fails
1. Uninstall previous version first
2. Ensure sufficient storage space
3. Check Android version compatibility (API 21+)

### App Crashes on Launch
1. Check logcat for errors: `adb logcat`
2. Ensure all dependencies are installed: `npm install`
3. Build a clean project: `rm -rf node_modules && npm install`

## Download Pre-built APK

If you have an Expo account, you can use EAS Build service to generate the APK in the cloud. The free tier includes:
- 30 builds per month
- Android and iOS support
- Automatic code signing

## Next Steps After Building

1. Test the APK on multiple devices
2. Verify all features work correctly
3. Test offline functionality
4. Check responsive layouts on different screen sizes
5. Set the launcher as default home app

## Support

For issues with:
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo general: https://docs.expo.dev/
- React Native: https://reactnative.dev/
