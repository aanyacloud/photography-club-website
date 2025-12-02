// Firestore Database Functions
import { db } from './firebase-config.js';
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    setDoc,
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Collection names
const COLLECTIONS = {
    USERS: 'users',
    APPLICATIONS: 'applications',
    FEEDBACK: 'feedback',
    GALLERY: 'gallery',
    EVENTS: 'events',
    WORKSHOPS: 'workshops'
};

// ============================================
// Application Functions
// ============================================

/**
 * Submit a new application
 * @param {Object} applicationData - Application form data
 * @returns {Promise<string>} - Document ID
 */
export async function submitApplication(applicationData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), {
            ...applicationData,
            status: 'pending',
            createdAt: serverTimestamp(),
            submittedAt: applicationData.submittedAt || new Date().toISOString()
        });
        
        console.log('✅ Application submitted:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error submitting application:', error);
        throw new Error('Failed to submit application. Please try again.');
    }
}

/**
 * Get all applications (Admin only)
 * @returns {Promise<Array>} - Array of applications
 */
export async function getAllApplications() {
    try {
        const q = query(
            collection(db, COLLECTIONS.APPLICATIONS),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const applications = [];
        
        querySnapshot.forEach((doc) => {
            applications.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${applications.length} applications`);
        return applications;
    } catch (error) {
        console.error('❌ Error loading applications:', error);
        throw new Error('Failed to load applications.');
    }
}

/**
 * Update application status (Admin only)
 * @param {string} applicationId - Application document ID
 * @param {string} status - New status (pending/approved/rejected)
 */
export async function updateApplicationStatus(applicationId, status) {
    try {
        const docRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
        
        console.log('✅ Application status updated');
    } catch (error) {
        console.error('❌ Error updating application:', error);
        throw new Error('Failed to update application status.');
    }
}

// ============================================
// Feedback Functions
// ============================================

/**
 * Submit feedback
 * @param {Object} feedbackData - Feedback form data
 * @returns {Promise<string>} - Document ID
 */
export async function submitFeedback(feedbackData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACK), {
            ...feedbackData,
            createdAt: serverTimestamp(),
            submittedAt: feedbackData.submittedAt || new Date().toISOString()
        });
        
        console.log('✅ Feedback submitted:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error submitting feedback:', error);
        throw new Error('Failed to submit feedback. Please try again.');
    }
}

/**
 * Get all feedback (Admin only)
 * @returns {Promise<Array>} - Array of feedback
 */
export async function getAllFeedback() {
    try {
        const q = query(
            collection(db, COLLECTIONS.FEEDBACK),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const feedback = [];
        
        querySnapshot.forEach((doc) => {
            feedback.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${feedback.length} feedback items`);
        return feedback;
    } catch (error) {
        console.error('❌ Error loading feedback:', error);
        throw new Error('Failed to load feedback.');
    }
}

// ============================================
// User Functions
// ============================================

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>} - Array of users
 */
export async function getAllUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
        const users = [];
        
        querySnapshot.forEach((doc) => {
            users.push({
                uid: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${users.length} users`);
        return users;
    } catch (error) {
        console.error('❌ Error loading users:', error);
        throw new Error('Failed to load users.');
    }
}

/**
 * Get user by ID
 * @param {string} uid - User ID
 * @returns {Promise<Object>} - User data
 */
export async function getUserById(uid) {
    try {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                uid: docSnap.id,
                ...docSnap.data()
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting user:', error);
        throw new Error('Failed to get user data.');
    }
}

// ============================================
// Gallery Functions (Optional - for future use)
// ============================================

/**
 * Add image to gallery
 * @param {Object} imageData - Image data
 * @returns {Promise<string>} - Document ID
 */
export async function addGalleryImage(imageData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.GALLERY), {
            ...imageData,
            createdAt: serverTimestamp(),
            likes: 0,
            views: 0
        });
        
        console.log('✅ Image added to gallery:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding image:', error);
        throw new Error('Failed to add image to gallery.');
    }
}

/**
 * Get all gallery images
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} - Array of images
 */
export async function getGalleryImages(category = null) {
    try {
        let q = query(collection(db, COLLECTIONS.GALLERY), orderBy('createdAt', 'desc'));
        
        if (category && category !== 'all') {
            q = query(
                collection(db, COLLECTIONS.GALLERY),
                where('category', '==', category),
                orderBy('createdAt', 'desc')
            );
        }
        
        const querySnapshot = await getDocs(q);
        const images = [];
        
        querySnapshot.forEach((doc) => {
            images.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${images.length} gallery images`);
        return images;
    } catch (error) {
        console.error('❌ Error loading gallery:', error);
        throw new Error('Failed to load gallery images.');
    }
}

/**
 * Update image views/likes
 * @param {string} imageId - Image document ID
 * @param {string} field - Field to increment ('views' or 'likes')
 */
export async function incrementImageField(imageId, field) {
    try {
        const docRef = doc(db, COLLECTIONS.GALLERY, imageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const currentValue = docSnap.data()[field] || 0;
            await updateDoc(docRef, {
                [field]: currentValue + 1
            });
        }
    } catch (error) {
        console.error(`❌ Error updating ${field}:`, error);
        // Don't throw error - this is non-critical
    }
}

// ============================================
// Events Functions (Optional - for future use)
// ============================================

/**
 * Get all events
 * @returns {Promise<Array>} - Array of events
 */
export async function getAllEvents() {
    try {
        const q = query(
            collection(db, COLLECTIONS.EVENTS),
            orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const events = [];
        
        querySnapshot.forEach((doc) => {
            events.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${events.length} events`);
        return events;
    } catch (error) {
        console.error('❌ Error loading events:', error);
        // Return empty array instead of throwing - events might not exist yet
        return [];
    }
}

/**
 * Add new event (Admin only)
 * @param {Object} eventData - Event data
 * @returns {Promise<string>} - Document ID
 */
export async function addEvent(eventData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
            ...eventData,
            createdAt: serverTimestamp()
        });
        
        console.log('✅ Event added:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding event:', error);
        throw new Error('Failed to add event.');
    }
}

// ============================================
// Workshops Functions (Optional - for future use)
// ============================================

/**
 * Get all workshops
 * @returns {Promise<Array>} - Array of workshops
 */
export async function getAllWorkshops() {
    try {
        const q = query(
            collection(db, COLLECTIONS.WORKSHOPS),
            orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const workshops = [];
        
        querySnapshot.forEach((doc) => {
            workshops.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${workshops.length} workshops`);
        return workshops;
    } catch (error) {
        console.error('❌ Error loading workshops:', error);
        // Return empty array instead of throwing
        return [];
    }
}

/**
 * Add new workshop (Admin only)
 * @param {Object} workshopData - Workshop data
 * @returns {Promise<string>} - Document ID
 */
export async function addWorkshop(workshopData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.WORKSHOPS), {
            ...workshopData,
            createdAt: serverTimestamp()
        });
        
        console.log('✅ Workshop added:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding workshop:', error);
        throw new Error('Failed to add workshop.');
    }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Delete document (Admin only)
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 */
export async function deleteDocument(collectionName, docId) {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log('✅ Document deleted');
    } catch (error) {
        console.error('❌ Error deleting document:', error);
        throw new Error('Failed to delete document.');
    }
}

/**
 * Get document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} - Document data
 */
export async function getDocumentById(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting document:', error);
        throw new Error('Failed to get document.');
    }
}