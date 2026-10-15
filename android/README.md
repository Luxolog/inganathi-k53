# Inganathi Driving Academy for Android

This Android Studio project wraps the live Inganathi K53 site in a lightweight Android WebView. It uses the live GitHub Pages URL so the latest manual, question bank, road-sign numbering, and fixes appear without needing a new APK for every website content update.

- Application ID: `co.za.inganathi.driving`
- Minimum Android version: Android 6.0 (API 23)
- Compile SDK: 34
- Language: Java (no Compose)
- Brand colors: red `#D50203`, black `#02050E`

## Build in Android Studio

The repository includes a GitHub Actions workflow that automatically builds a debug APK whenever files under `android/` change.

1. Open Android Studio.
2. Choose **Open** and select this repository's `android` folder.
3. Allow Gradle sync to complete; install Android SDK Platform 34 if prompted.
4. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. The debug APK is generated at `app/build/outputs/apk/debug/app-debug.apk`.

The app requires internet access because it loads the hosted site at `https://luxolog.github.io/inganathi-k53/`. A network error screen lets the user tap to retry. This is the initial compatibility build; it is not an offline package.

For an installable release build, configure signing in Android Studio before generating the release APK. Do not share a release signing key publicly.
