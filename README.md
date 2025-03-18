# DinCharya - Task Management App

A modern task management application built with React and Firebase, featuring personal, business, and future task categorization.

## Features

- 🔐 User Authentication
- 📋 Task Categories (Personal, Business, Future)
- ✅ Task Status Management
- 📅 Due Date Tracking
- 🎯 Task Progress Tracking

## Tech Stack

- React with TypeScript
- Firebase (Authentication & Firestore)
- Tailwind CSS for styling

## Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Firebase project and get your configuration:

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase configuration from Project Settings

4. Create a `.env` file in the root directory and add your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. Update the Firebase configuration in `src/config/firebase.ts` with your environment variables

6. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Future Enhancements

- [ ] WhatsApp Integration
- [ ] Voice Message Support
- [ ] Team Collaboration Features
- [ ] Multi-language Support

## Contributing

Feel free to open issues and pull requests for any improvements you'd like to add!
