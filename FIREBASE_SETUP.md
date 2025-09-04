# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "teaching-assistant-prompt-generator")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 6. Deploy Firestore Security Rules

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init firestore`
4. Deploy the rules: `firebase deploy --only firestore:rules`

## 7. Seed Initial Data

The app will automatically seed prompt templates when you first run it. If you need to manually seed them, you can do so through the Firebase Console or by running the app.

## 8. Test the Application

1. Run `npm run dev`
2. Open your browser to the local development URL
3. Try creating an account and creating prompts
4. Verify that data appears in your Firestore database

## Security Notes

- The provided Firestore rules ensure users can only access their own prompts
- Prompt templates are read-only for all authenticated users
- Make sure to review and customize the security rules for production use
