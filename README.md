# CollabCanvas

A real-time collaborative design tool built with React, TypeScript, and Firebase.

## Features

- **Real-time collaboration** with multiple users
- **Multiplayer cursors** with name labels
- **Presence awareness** (who's online)
- **Basic shapes**: rectangles, circles, text
- **Pan and zoom** canvas
- **Object selection, moving, and resizing**
- **Layer management** (z-index)
- **User authentication** with Firebase Auth

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase project with Firestore and Realtime Database enabled

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env.local` file with your Firebase configuration:**

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to the local development URL**

## Firebase Setup

### 1. Create a Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Firestore Database and Realtime Database

### 2. Configure Authentication

- Enable Email/Password authentication in Firebase Console

### 3. Set Security Rules

**Firestore Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    match /canvases/{canvasId}/objects/{objectId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

**Realtime Database Security Rules:**

```json
{
  "rules": {
    "cursors": {
      ".read": "auth != null",
      "$userId": {
        ".write": "auth.uid == $userId"
      }
    },
    "presence": {
      ".read": "auth != null",
      "$userId": {
        ".write": "auth.uid == $userId"
      }
    }
  }
}
```

## Usage

### Tools

- **Select (↖)**: Click objects to select, drag to move
- **Rectangle (□)**: Click to create rectangles
- **Circle (○)**: Click to create circles
- **Text (T)**: Click to create text (double-click to edit)
- **Pan (✋)**: Drag to pan the canvas

### Keyboard Shortcuts

- **Delete**: Delete selected objects
- **Ctrl/Cmd+D**: Duplicate selected objects
- **Shift+Click**: Multi-select objects

### Controls

- **Mouse wheel**: Zoom in/out
- **Zoom controls**: Use the +/- buttons in the bottom-right
- **Reset**: Return to default zoom and position

## Architecture

Built with:

- **React 18** + **TypeScript**
- **Vite** for fast development
- **Firebase** (Firestore + Realtime Database + Auth)
- **Konva.js** + **react-konva** for canvas rendering
- **Tailwind CSS** for styling
- **React Router** for navigation

## Performance Targets

- 60 FPS during all interactions
- <100ms object sync latency
- <50ms cursor sync latency
- Support 500+ objects
- Support 5+ concurrent users

## License

MIT
