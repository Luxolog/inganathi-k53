# Inganathi Driving Academy — Android app

This is an Android Studio project for an initial Android APK. It wraps the existing Inganathi K53 website in an Android WebView; it does not copy or replace the website or its content.

## Open in Android Studio

1. Download or clone the repository: https://github.com/Luxolog/inganathi-k53
2. In Android Studio, choose **Open**.
3. Select the **android-app** folder (not the repository root).
4. Allow Gradle sync to finish. Use JDK 17 if Android Studio asks.
5. Connect an Android phone with USB debugging enabled, or start an emulator.
6. Press **Run** to install and test the app.

## Build an APK

For a quick test APK:
1. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
2. When the build completes, select **locate** in the notification.
3. The debug APK is normally at `app/build/outputs/apk/debug/app-debug.apk`.

For a release APK:
1. Select **Build → Generate Signed Bundle / APK**.
2. Choose **APK**.
3. Create and securely store a signing key (keystore); do not commit it to GitHub.
4. Select the release build variant and complete the wizard.
5. Keep the keystore and passwords safe; future app updates should use the same signing key.

## App configuration

- Package: `za.co.inganathi.drivingacademy`
- Version: `1.0.0` (versionCode 1)
- Minimum Android: API 23
- Website: `https://luxolog.github.io/inganathi-k53/`
- Requires an internet connection.

## Important notes

- The app loads the live GitHub Pages site. Website changes appear in the app without rebuilding the APK.
- The learner survey will only submit responses once its Google Apps Script endpoint has been configured and deployed.
- This first version is a WebView app, not a fully offline native K53 app. Offline study, push notifications, native downloads and Play Store release preparation can be added as a later phase.
- Only HTTPS links on the Inganathi GitHub Pages host remain inside the app; other links open in the device browser.
