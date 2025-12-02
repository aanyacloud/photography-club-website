// Authentication Functions
// Import Firebase modules
import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Domain restriction - only these domains can sign up
const ALLOWED_DOMAIN = 'iiitnr.edu.in';

/**
 * Check if email domain is allowed
 * @param {string} email - Email to check
 * @returns {boolean} - True if domain is allowed
 */
function isAllowedDomain(email) {
    if (!email) return false;
    const domain = email.split('@')[1];
    return domain === ALLOWED_DOMAIN;
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<User>} - Firebase user object
 */
export async function signInWithEmail(email, password) {
    try {
        // Check domain before attempting sign in
        if (!isAllowedDomain(email)) {
            throw new Error(`Only @${ALLOWED_DOMAIN} emails are allowed to sign in!`);
        }
        
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Sign in successful');
        return result.user;
    } catch (error) {
        console.error('❌ Sign in error:', error);
        
        // User-friendly error messages
        if (error.code === 'auth/user-not-found') {
            throw new Error('No account found with this email. Please register first.');
        } else if (error.code === 'auth/wrong-password') {
            throw new Error('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email format.');
        } else {
            throw new Error(error.message);
        }
    }
}

/**
 * Create new user account
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise<User>} - Firebase user object
 */
export async function createUser(email, password, displayName) {
    try {
        // Check domain before creating account
        if (!isAllowedDomain(email)) {
            throw new Error(`Only @${ALLOWED_DOMAIN} emails can register!`);
        }
        
        // Create Firebase Auth account
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Update display name
        await updateProfile(user, { displayName });
        
        // Create user profile in Firestore
        await createUserProfile(user.uid, {
            email,
            displayName: displayName || email.split('@')[0],
            createdAt: serverTimestamp(),
            registrationDate: new Date().toISOString(),
            emailVerified: user.emailVerified
        });
        
        console.log('✅ Account created successfully');
        return user;
    } catch (error) {
        console.error('❌ Account creation error:', error);
        
        // User-friendly error messages
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('An account with this email already exists. Please sign in.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password is too weak. Use at least 6 characters.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email format.');
        } else {
            throw new Error(error.message);
        }
    }
}

/**
 * Create user profile in Firestore
 * @param {string} uid - User ID
 * @param {Object} userData - User data to store
 */
async function createUserProfile(uid, userData) {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, userData);
        console.log('✅ User profile created in Firestore');
    } catch (error) {
        console.error('❌ Error creating user profile:', error);
        throw error;
    }
}

/**
 * Get user profile from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - User profile data
 */
export async function getUserProfile(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting user profile:', error);
        throw error;
    }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('✅ Sign out successful');
    } catch (error) {
        console.error('❌ Sign out error:', error);
        throw new Error('Failed to sign out. Please try again.');
    }
}

/**
 * Get current authenticated user
 * @returns {User|null} - Current user or null
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Listen for authentication state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function
 */
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Update last login time
            try {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    lastLoginAt: serverTimestamp()
                }, { merge: true });
            } catch (error) {
                console.error('Error updating last login:', error);
            }
        }
        callback(user);
    });
}

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<User>} - Updated user object
 */
export async function updateUserProfile(updates) {
    try {
        const user = getCurrentUser();
        if (!user) throw new Error('No user logged in');
        
        // Update Firebase Auth profile
        if (updates.displayName || updates.photoURL) {
            await updateProfile(user, updates);
        }
        
        // Update Firestore profile
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            ...updates,
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log('✅ Profile updated successfully');
        return user;
    } catch (error) {
        console.error('❌ Profile update error:', error);
        throw new Error('Failed to update profile. Please try again.');
    }
}