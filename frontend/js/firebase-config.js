// Firebase Configuration
// 
// ⚠️ IMPORTANT: Replace ALL placeholder values with your actual Firebase config!
// Get these values from: Firebase Console > Project Settings > Your apps > Web app
//
// Steps to get your config:
// 1. Go to https://console.firebase.google.com
// 2. Select your project
// 3. Click the gear icon (⚙️) > Project Settings
// 4. Scroll down to "Your apps" section
// 5. Click the Web icon (</>)
// 6. Copy the firebaseConfig object
// 7. Paste below (replace the placeholder values)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// YOUR Firebase configuration
// ⚠️ REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDFYdo0ClJJ7r8QmeRbrBGDZoSmTL-DwYg",
    authDomain: "p-club-7a89e.firebaseapp.com",
    projectId: "p-club-7a89e",
    storageBucket: "p-club-7a89e.firebasestorage.app",
    messagingSenderId: "327721096729",
    appId: "1:327721096729:web:dc0e941dc33240326cfc88"
};

// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('💡 Make sure you have replaced the placeholder values in firebase-config.js!');
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the config for reference (optional)
export { firebaseConfig };