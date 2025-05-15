import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, 
  query, where, serverTimestamp, deleteDoc, limit, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from './config';
import { ResponseTypes } from './models';

/**
 * User Profile Functions
 */

// Create or update a user profile
export const saveUserProfile = async (userProfile) => {
  try {
    // Generate user ID if not provided
    const userId = userProfile.id || uuidv4();
    const userRef = doc(db, 'users', userId);
    
    // Add timestamps
    const profileData = {
      ...userProfile,
      id: userId,
      updatedAt: serverTimestamp(),
      createdAt: userProfile.createdAt || serverTimestamp(),
    };
    
    await setDoc(userRef, profileData, { merge: true });
    return { ...profileData, id: userId };
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get a user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Get potential matches for a user based on preferences
export const getPotentialMatches = async (userId, limit = 10) => {
  try {
    // Get the user's profile to check preferences
    const userProfile = await getUserProfile(userId);
    if (!userProfile) throw new Error('User profile not found');
    
    // Build query based on user preferences
    const usersRef = collection(db, 'users');
    let matchQuery = query(
      usersRef,
      where('id', '!=', userId),
      limit(limit)
    );
    
    // Apply gender preference filter if specified
    if (userProfile.preferences?.genderPreference) {
      matchQuery = query(
        matchQuery,
        where('gender', '==', userProfile.preferences.genderPreference)
      );
    }
    
    // Get users matching the criteria
    const querySnapshot = await getDocs(matchQuery);
    const potentialMatches = [];
    
    querySnapshot.forEach((doc) => {
      const matchData = doc.data();
      
      // Additional filtering that can't be done in the query
      const matchAge = matchData.age || 0;
      const minAge = userProfile.preferences?.ageMin || 18;
      const maxAge = userProfile.preferences?.ageMax || 99;
      
      if (matchAge >= minAge && matchAge <= maxAge) {
        potentialMatches.push({ id: doc.id, ...matchData });
      }
    });
    
    return potentialMatches;
  } catch (error) {
    console.error('Error getting potential matches:', error);
    throw error;
  }
};

/**
 * User Responses Functions
 */

// Save a user's response to a question
export const saveUserResponse = async (userId, responseData) => {
  try {
    // Generate response ID if not provided
    const responseId = responseData.id || uuidv4();
    const responseRef = doc(db, 'users', userId, 'responses', responseId);
    
    // Add timestamps and user ID
    const updatedResponse = {
      ...responseData,
      id: responseId,
      userId,
      updatedAt: serverTimestamp(),
      createdAt: responseData.createdAt || serverTimestamp(),
    };
    
    await setDoc(responseRef, updatedResponse, { merge: true });
    return { ...updatedResponse, id: responseId };
  } catch (error) {
    console.error('Error saving user response:', error);
    throw error;
  }
};

// Get all responses for a user
export const getUserResponses = async (userId) => {
  try {
    const responsesRef = collection(db, 'users', userId, 'responses');
    const querySnapshot = await getDocs(responsesRef);
    
    const responses = [];
    querySnapshot.forEach((doc) => {
      responses.push({ id: doc.id, ...doc.data() });
    });
    
    return responses;
  } catch (error) {
    console.error('Error getting user responses:', error);
    throw error;
  }
};

// Upload a file (audio or image) for a response
export const uploadResponseFile = async (userId, file, fileType) => {
  try {
    const fileId = uuidv4();
    const fileExtension = file.name ? file.name.split('.').pop() : 'file';
    const storageRef = ref(storage, `responses/${userId}/${fileId}.${fileExtension}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    return {
      fileId,
      fileUrl: downloadUrl,
      fileName: file.name || `${fileId}.${fileExtension}`,
      fileType,
    };
  } catch (error) {
    console.error('Error uploading response file:', error);
    throw error;
  }
};

/**
 * Validation Functions
 */

// Save a validation (approve/reject) of another user's response
export const saveValidation = async (validatorUserId, targetUserId, responseId, isValidated) => {
  try {
    // Create a unique ID for this validation
    const validationId = `${validatorUserId}_${targetUserId}_${responseId}`;
    const validationRef = doc(db, 'validations', validationId);
    
    const validationData = {
      id: validationId,
      validatorUserId,
      targetUserId,
      responseId,
      isValidated,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    
    await setDoc(validationRef, validationData, { merge: true });
    
    // After validation is saved, check if there's a match
    await checkForMatch(validatorUserId, targetUserId);
    
    return { ...validationData, id: validationId };
  } catch (error) {
    console.error('Error saving validation:', error);
    throw error;
  }
};

// Get all validations by a user
export const getValidationsByUser = async (validatorUserId) => {
  try {
    const validationsRef = collection(db, 'validations');
    const querySnapshot = await getDocs(
      query(validationsRef, where('validatorUserId', '==', validatorUserId))
    );
    
    const validations = [];
    querySnapshot.forEach((doc) => {
      validations.push({ id: doc.id, ...doc.data() });
    });
    
    return validations;
  } catch (error) {
    console.error('Error getting validations by user:', error);
    throw error;
  }
};

// Get validations of a user's responses
export const getValidationsForUser = async (targetUserId) => {
  try {
    const validationsRef = collection(db, 'validations');
    const querySnapshot = await getDocs(
      query(validationsRef, where('targetUserId', '==', targetUserId))
    );
    
    const validations = [];
    querySnapshot.forEach((doc) => {
      validations.push({ id: doc.id, ...doc.data() });
    });
    
    return validations;
  } catch (error) {
    console.error('Error getting validations for user:', error);
    throw error;
  }
};

/**
 * Matching Functions
 */

// Check if two users have a match based on validations
export const checkForMatch = async (user1Id, user2Id) => {
  try {
    // Get validations from user1 to user2
    const validationsRef1 = collection(db, 'validations');
    const querySnapshot1 = await getDocs(
      query(
        validationsRef1, 
        where('validatorUserId', '==', user1Id),
        where('targetUserId', '==', user2Id)
      )
    );
    
    // Get validations from user2 to user1
    const validationsRef2 = collection(db, 'validations');
    const querySnapshot2 = await getDocs(
      query(
        validationsRef2, 
        where('validatorUserId', '==', user2Id),
        where('targetUserId', '==', user1Id)
      )
    );
    
    // Count positive validations
    const user1Validations = [];
    querySnapshot1.forEach((doc) => {
      const data = doc.data();
      if (data.isValidated === true) {
        user1Validations.push(data);
      }
    });
    
    const user2Validations = [];
    querySnapshot2.forEach((doc) => {
      const data = doc.data();
      if (data.isValidated === true) {
        user2Validations.push(data);
      }
    });
    
    // Check if both users have validated at least 3 responses from each other
    const isMatch = user1Validations.length >= 3 && user2Validations.length >= 3;
    
    if (isMatch) {
      // Create a match
      const matchId = [user1Id, user2Id].sort().join('_');
      const matchRef = doc(db, 'matches', matchId);
      
      // Check if match already exists
      const matchDoc = await getDoc(matchRef);
      if (!matchDoc.exists()) {
        const matchData = {
          id: matchId,
          users: [user1Id, user2Id],
          validatedResponsesCount: Math.min(user1Validations.length, user2Validations.length),
          isActive: true,
          createdAt: serverTimestamp(),
          lastInteractionAt: serverTimestamp(),
        };
        
        await setDoc(matchRef, matchData);
        
        return { isMatch: true, matchData };
      }
      
      return { isMatch: true, matchData: { id: matchId, ...matchDoc.data() } };
    }
    
    return { isMatch: false };
  } catch (error) {
    console.error('Error checking for match:', error);
    throw error;
  }
};

// Get all matches for a user
export const getUserMatches = async (userId) => {
  try {
    const matchesRef = collection(db, 'matches');
    const querySnapshot = await getDocs(
      query(
        matchesRef, 
        where('users', 'array-contains', userId),
        where('isActive', '==', true),
        orderBy('lastInteractionAt', 'desc')
      )
    );
    
    const matches = [];
    querySnapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    
    return matches;
  } catch (error) {
    console.error('Error getting user matches:', error);
    throw error;
  }
};

/**
 * Question Generation Functions
 */

// Generate personalized questions based on user profile
export const generatePersonalizedQuestions = async (userId) => {
  try {
    // Get the user's profile to personalize questions
    const userProfile = await getUserProfile(userId);
    if (!userProfile) throw new Error('User profile not found');
    
    // Base questions that are adaptable to user profile
    const questionTemplates = [
      // True/False questions
      {
        type: ResponseTypes.TRUEFALSE,
        templates: [
          {
            question: `Do you enjoy ${userProfile.preferences?.interests?.[0] || 'outdoor'} activities?`,
            tag: 'lifestyle'
          },
          {
            question: `Is ${userProfile.location?.city || 'traveling'} important to you?`,
            tag: 'location'
          },
          {
            question: `Do you prefer quiet evenings over going out?`,
            tag: 'personality'
          }
        ]
      },
      // Multiple choice questions
      {
        type: ResponseTypes.MULTIPLECHOICE,
        templates: [
          {
            question: `What's your ideal first date with someone ${userProfile.preferences?.genderPreference || 'you like'}?`,
            tag: 'dating',
            options: [
              { id: '1', text: 'A quiet dinner' },
              { id: '2', text: 'An outdoor activity' },
              { id: '3', text: 'A cultural event' },
              { id: '4', text: 'Coffee and conversation' }
            ]
          },
          {
            question: `How would you describe your ideal weekend?`,
            tag: 'lifestyle',
            options: [
              { id: '1', text: 'Relaxing at home' },
              { id: '2', text: 'Exploring the city' },
              { id: '3', text: 'Socializing with friends' },
              { id: '4', text: 'Adventure and nature' }
            ]
          }
        ]
      },
      // Slider questions
      {
        type: ResponseTypes.SLIDER,
        templates: [
          {
            question: `How important is it that your partner shares your views on ${userProfile.preferences?.importantValues?.[0] || 'life goals'}?`,
            tag: 'values',
            minEmoji: '😌',
            maxEmoji: '😍'
          },
          {
            question: `How spontaneous are you versus planned?`,
            tag: 'personality',
            minEmoji: '📝',
            maxEmoji: '🤪'
          }
        ]
      },
      // Audio questions
      {
        type: ResponseTypes.AUDIO,
        templates: [
          {
            question: `Describe your perfect day in ${userProfile.location?.city || 'your city'}`,
            tag: 'lifestyle'
          },
          {
            question: `What are you looking for in a relationship?`,
            tag: 'dating'
          }
        ]
      },
      // File picker questions
      {
        type: ResponseTypes.FILEPICKER,
        templates: [
          {
            question: `Share a photo from your favorite place`,
            tag: 'interests'
          },
          {
            question: `Share a photo that represents your hobby`,
            tag: 'lifestyle'
          }
        ]
      }
    ];
    
    // Select one question of each type
    const personalizedQuestions = [];
    
    questionTemplates.forEach(templateGroup => {
      // Select a random template from each type
      const randomIndex = Math.floor(Math.random() * templateGroup.templates.length);
      const selectedTemplate = templateGroup.templates[randomIndex];
      
      // Create the question object based on type
      const questionBase = {
        id: uuidv4(),
        type: templateGroup.type,
        question: selectedTemplate.question,
        tag: selectedTemplate.tag
      };
      
      // Add type-specific data
      switch (templateGroup.type) {
        case ResponseTypes.TRUEFALSE:
          questionBase.trueFalseData = { answer: null };
          break;
        case ResponseTypes.MULTIPLECHOICE:
          questionBase.multipleChoiceData = {
            options: selectedTemplate.options || [],
            selectedOptionId: null
          };
          break;
        case ResponseTypes.SLIDER:
          questionBase.sliderData = {
            minEmoji: selectedTemplate.minEmoji || '😐',
            maxEmoji: selectedTemplate.maxEmoji || '😄',
            value: 50
          };
          break;
        case ResponseTypes.AUDIO:
          questionBase.audioData = { audioUrl: '', duration: 0 };
          break;
        case ResponseTypes.FILEPICKER:
          questionBase.filePickerData = { imageUrl: '' };
          break;
      }
      
      personalizedQuestions.push(questionBase);
    });
    
    return personalizedQuestions;
  } catch (error) {
    console.error('Error generating personalized questions:', error);
    throw error;
  }
}; 