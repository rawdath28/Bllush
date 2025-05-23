import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

// Define response types
const responseTypes = {
  TRUEFALSE: 'truefalse',
  MULTIPLECHOICE: 'multiplechoice',
  SLIDER: 'slider',
  AUDIO: 'audio',
  FILEPICKER: 'filepicker',
};

// Sample response data
const responseData = [
  {
    id: 1,
    tag: 'Tagbis',
    question: 'Le rem ipsum dolor sit amet, consectetur vulputate libero et velit ?',
    type: responseTypes.TRUEFALSE,
    otherUserAnswer: 'Vrai', // True
    validated: null,
  },
  {
    id: 2,
    tag: 'Tagbis',
    question: 'Le rem ipsum dolor sit amet, consectetur vulputate libero et velit ?',
    type: responseTypes.MULTIPLECHOICE,
    options: [
      { id: 'option1', text: 'Le rem ipsum dolor sit amet' },
      { id: 'option2', text: 'Casual & Fun' },
      { id: 'option3', text: 'Friends First' },
    ],
    selectedOptionId: 'option1',
    validated: null,
  },
  {
    id: 3,
    tag: 'Personality',
    question: 'How much do you like to plan versus going with the flow?',
    type: responseTypes.SLIDER,
    minEmoji: '🥶', // Cold/Planning
    maxEmoji: '🥵', // Hot/Spontaneous
    value: 75, // 0-100 where 100 is max
    validated: null,
  },
  {
    id: 4,
    tag: 'Audio Response',
    question: 'Le rem ipsum dolor sit amet, consectetur vulputate libero et velit ?',
    type: responseTypes.AUDIO,
    // Using a local audio file instead of a URL
    audioUri: require('../src/assets/audio/sample.mp3'),
    duration: 15, // 15 seconds
    validated: null,
  },
  {
    id: 5,
    tag: 'Photo',
    question: 'Le rem ipsum dolor sit amet, consectetur vulputate libero et velit ?',
    type: responseTypes.FILEPICKER,
    // We'll need to add the image to the assets folder
    imageUri: null, // Will be displayed as a placeholder
    validated: null,
  }
];

// AudioPlayer Component with real functionality
const AudioPlayer = ({ audioUri, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const positionTimerRef = useRef(null);
  const soundRef = useRef(null);
  
  // For debugging
  useEffect(() => {
    console.log("Position updated:", position);
  }, [position]);
  
  // Generate random heights for waveform bars to match Figma design
  const waveformHeights = useMemo(() => {
    return Array.from({ length: 40 }).map(() => 2 + Math.random() * 20);
  }, []);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionTimerRef.current) {
        clearInterval(positionTimerRef.current);
      }
    };
  }, [sound]);
  
  // Update sound reference
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  
  // Real audio playback functionality
  const handlePlayPress = async () => {
    if (isPlaying && sound) {
      // Just pause the audio but keep the sound object
      try {
        await sound.pauseAsync();
        setIsPlaying(false);
      } catch (err) {
        console.error('Error pausing audio:', err);
      }
      
      if (positionTimerRef.current) {
        clearInterval(positionTimerRef.current);
        positionTimerRef.current = null;
      }
      return;
    }
    
    setIsLoading(true);
    setError(null); // Reset any previous errors
    
    try {
      if (sound) {
        // Resume playback with the existing sound object
        console.log("Resuming audio playback");
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        // First-time loading
        console.log("Loading audio from local file");
        
        // Load and play the sound - handles both URLs and local require'd files
        const { sound: newSound } = await Audio.Sound.createAsync(
          audioUri,
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              if (!status.isPlaying && status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
                if (positionTimerRef.current) {
                  clearInterval(positionTimerRef.current);
                  positionTimerRef.current = null;
                }
              }
            } else if (!status.isLoaded && status.error) {
              // Handle the error case when loading fails
              console.error('Playback error:', status.error);
              setError(`Playback error: ${status.error}`);
              setIsPlaying(false);
            }
          }
        );
        
        setSound(newSound);
        soundRef.current = newSound;
        setIsPlaying(true);
      }
      
      // Start position tracking timer only if not already running
      if (!positionTimerRef.current) {
        // Update position more frequently for smoother timer
        positionTimerRef.current = setInterval(async () => {
          const currentSound = soundRef.current;
          if (currentSound) {
            try {
              const status = await currentSound.getStatusAsync();
              if (status.isLoaded) {
                // Update position in seconds
                const currentPosition = status.positionMillis / 1000;
                console.log("Current position:", currentPosition);
                setPosition(currentPosition);
                
                // If we've reached the end, stop the timer
                if (status.durationMillis !== undefined && status.positionMillis >= status.durationMillis) {
                  clearInterval(positionTimerRef.current);
                  positionTimerRef.current = null;
                }
              }
            } catch (timerErr) {
              console.log('Timer error:', timerErr);
            }
          }
        }, 250); // Update 4 times per second for smoother updates
      }
    } catch (err) {
      setError('Error playing audio. Please check the file format.');
      console.error('Audio playback error:', err);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format seconds to display current position in standard format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  return (
    <View style={styles.audioContainer}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {isPlaying ? `${formatTime(position)} / ${formatTime(duration)}` : `0:00 / ${formatTime(duration)}`}
        </Text>
      </View>
      
      {error && (
        <Text style={styles.audioError}>{error}</Text>
      )}
      
      <View style={styles.audioWaveformContainer}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={handlePlayPress}
          disabled={isLoading}
        >
          <View style={styles.playButtonCircle}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#0B1009" />
            ) : isPlaying ? (
              <Feather name="pause" size={20} color="#0B1009" />
            ) : (
              <Feather name="play" size={20} color="#0B1009" />
            )}
          </View>
        </TouchableOpacity>
        
        {/* Waveform visualization */}
        <View style={styles.waveform}>
          {waveformHeights.map((height, i) => (
            <View 
              key={i} 
              style={[
                styles.waveformBar,
                { 
                  height,
                  opacity: isPlaying ? 0.8 : 0.3
                }
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// File picker response component
const FilePicker = ({ imageUri }) => {
  return (
    <View style={styles.filePickerWrapper}>
      <View style={styles.filePickerContainer}>
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }}
            style={styles.filePickerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.filePickerPlaceholder}>
            <Feather name="image" size={40} color="#0B1009" />
            <Text style={styles.filePickerPlaceholderText}>Image Preview</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Loading Animation Component
const LoadingAnimation = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFC629" />
      <Text style={styles.loadingText}>Checking your match...</Text>
    </View>
  );
};

// Results Screen Component
const ResultsScreen = ({ onStartOver, matchId, validatedCount, matchedUserName }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>It's a match!</Text>
          <Text style={styles.resultSubtitle}>
            You and {matchedUserName} matched on {validatedCount} answers
          </Text>
        </View>
        
        <View style={styles.matchContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>Y</Text>
            </View>
            <View style={[styles.avatar, styles.matchedAvatar]}>
              <Text style={styles.avatarText}>{matchedUserName.charAt(0)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => {}}
          >
            <Feather name="message-circle" size={20} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.continueButton]}
            onPress={onStartOver}
          >
            <Text style={styles.continueButtonText}>Continue Matching</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// No Match Screen Component
const NoMatchScreen = ({ onStartOver }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>No Match</Text>
          <Text style={styles.resultSubtitle}>
            Don't worry, there are many more potential matches!
          </Text>
        </View>
        
        <View style={styles.noMatchIcon}>
          <Feather name="x-circle" size={80} color="#FF4D4F" />
        </View>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.continueButton]}
          onPress={onStartOver}
        >
          <Text style={styles.continueButtonText}>Continue Matching</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function ValidationResponseScreen() {
  const router = useRouter();
  const [responses, setResponses] = useState(responseData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [validationCompleted, setValidationCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Setup audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Configure audio
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          allowsRecordingIOS: false,
          // Use number values for interruption modes
          interruptionModeIOS: 1, // DO_NOT_MIX
          interruptionModeAndroid: 1, // DO_NOT_MIX
        });
        console.log('Audio configured successfully');
      } catch (err) {
        console.error('Audio config error:', err);
      }
    };

    setupAudio();
  }, []);

  const handleValidateResponse = (validated) => {
    // Update the current response validation status
    const updatedResponses = [...responses];
    updatedResponses[currentQuestion].validated = validated;
    
    // Animate fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setResponses(updatedResponses);
      
      // Move to next question or show results
      if (currentQuestion < responses.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        
        // Animate fade in for the new question
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        // All questions answered
        setValidationCompleted(true);
        // Show loading animation
        setShowLoading(true);
        
        // Simulate processing time with setTimeout
        setTimeout(() => {
          setShowLoading(false);
          setShowResults(true);
        }, 2000); // Show loading for 2 seconds
      }
    });
  };

  const isMatch = () => {
    // Count validated answers (true = matching)
    const matchCount = responses.filter(response => response.validated === true).length;
    return matchCount >= 3; // Match if at least 3 answers match
  };
  
  const handleStartOver = () => {
    router.replace('/(tabs)/home');
  };

  const currentResponse = responses[currentQuestion];

  if (showResults) {
    // Show match or no match screen
    return isMatch() 
      ? <ResultsScreen 
          onStartOver={handleStartOver} 
          matchId="sample_match_123"
          validatedCount={responses.filter(r => r.validated === true).length}
          matchedUserName="Sophie"
        /> 
      : <NoMatchScreen onStartOver={handleStartOver} />;
  }

  if (showLoading) {
    // Show loading animation
    return <LoadingAnimation />;
  }

  // Render slider component based on the Figma design
  const renderSlider = (response) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderTrack}>
        <Slider
          minimumValue={0}
          maximumValue={100}
          value={response.value}
          minimumTrackTintColor="#F6F2EC"
          maximumTrackTintColor="#F6F2EC"
          thumbTintColor="#FFC629"
          disabled={true}
        />
      </View>
      <View style={styles.emojiContainer}>
        <Text style={styles.emojiText}>{response.minEmoji}</Text>
        <Text style={styles.emojiText}>{response.maxEmoji}</Text>
      </View>
    </View>
  );

  // Render audio player component
  const renderAudioPlayer = (response) => (
    <AudioPlayer 
      audioUri={response.audioUri}
      duration={response.duration}
    />
  );

  // Render file picker component
  const renderFilePicker = (response) => (
    <FilePicker imageUri={response.imageUri} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Découvre ce qu'elle pense</Text>
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {responses.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentQuestion ? styles.activeDot : 
              index < currentQuestion ? styles.completedDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>

      {/* Response Card */}
      <Animated.View style={[styles.responseCard, { opacity: fadeAnim }]}>
        {/* Question Header */}
        <View style={styles.questionHeader}>
          <View style={styles.tagContainer}>
            <Feather name="box" size={20} color="#0B1009" />
            <Text style={styles.tagText}>{currentResponse.tag}</Text>
          </View>
          <Text style={styles.questionText}>{currentResponse.question}</Text>
        </View>

        {/* Response Content */}
        <View style={styles.responseContentContainer}>
          {currentResponse.type === responseTypes.TRUEFALSE ? (
            // True/False Options - Showing only the selected option based on Figma
            <View style={styles.responseOptions}>
              {/* True Button - Only showing this as it's the selected one in Figma */}
              <View style={styles.responseButton}>
                <View style={styles.responseIconContainer}>
                  <Feather name="heart" size={24} color="#0B1009" />
                </View>
                <Text style={styles.responseText}>Vrai</Text>
              </View>
            </View>
          ) : currentResponse.type === responseTypes.MULTIPLECHOICE ? (
            // Multiple Choice Options - Updated to match Figma design
            <View style={styles.multipleChoiceContainer}>
              {/* Only showing the selected option as per Figma design */}
              <View style={styles.multipleChoiceSelectedOption}>
                <View style={styles.multipleChoiceIconContainer}>
                  <Feather name="heart" size={20} color="#0B1009" />
                </View>
                <Text style={styles.multipleChoiceSelectedText}>
                  {currentResponse.options.find(
                    option => option.id === currentResponse.selectedOptionId
                  )?.text || "Selected Option"}
                </Text>
              </View>
            </View>
          ) : currentResponse.type === responseTypes.SLIDER ? (
            // Slider Response
            renderSlider(currentResponse)
          ) : currentResponse.type === responseTypes.AUDIO ? (
            // Audio Response
            renderAudioPlayer(currentResponse)
          ) : (
            // File Picker Response
            renderFilePicker(currentResponse)
          )}
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* X Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleValidateResponse(false)}
        >
          <Feather name="x" size={30} color="#0B1009" />
        </TouchableOpacity>

        {/* Heart Button */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.heartButton]}
          onPress={() => handleValidateResponse(true)}
        >
          <Feather name="heart" size={30} color="#0B1009" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101009',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FEFBF4',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 14,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: '#FFC629',
  },
  completedDot: {
    backgroundColor: '#F8F0E5',
  },
  inactiveDot: {
    backgroundColor: '#F8F0E5',
  },
  responseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 28,
    flex: 1,
    justifyContent: 'space-between',
    maxHeight: 492,
  },
  questionHeader: {
    marginBottom: 22,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFC4',
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 22,
  },
  tagText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  questionText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#0B1009',
    lineHeight: 34,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  responseContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  responseOptions: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#0B1009',
    borderRadius: 8,
    padding: 28,
    justifyContent: 'center',
    height: 88,
    width: '100%',
  },
  responseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1E5D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  responseText: {
    fontSize: 22,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  // Updated Multiple Choice styles to match Figma design
  multipleChoiceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  multipleChoiceSelectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#0B1009',
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 20,
    height: 88,
    width: '100%',
  },
  multipleChoiceIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1E5D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 17,
  },
  multipleChoiceSelectedText: {
    fontSize: 16,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  // Slider specific styles
  sliderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  sliderTrack: {
    width: '100%',
    height: 40,
    marginBottom: 30,
  },
  emojiContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 26,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  // Audio player styles
  audioContainer: {
    backgroundColor: '#FEFBF4',
    borderRadius: 8,
    padding: 32,
    paddingHorizontal: 12,
    marginTop: 0,
    alignItems: 'center',
    width: '100%',
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  timerText: {
    fontSize: 16,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  audioTimestamp: {
    fontSize: 16,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    marginBottom: 22,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  audioError: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  audioWaveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F6F2EC',
    borderRadius: 8,
    width: '100%',
  },
  playButton: {
    marginRight: 14,
  },
  playButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  waveformBar: {
    width: 2,
    backgroundColor: 'black',
    borderRadius: 1,
    marginHorizontal: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
    marginTop: 20,
    width: 370,
    alignSelf: 'center',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  heartButton: {
    backgroundColor: '#FFC629',
  },
  // File picker styles
  filePickerWrapper: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  filePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    height: 235,
    width: '100%',
    backgroundColor: '#F1E5D5',
  },
  filePickerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  filePickerPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  filePickerPlaceholderText: {
    fontSize: 16,
    color: '#0B1009',
    marginTop: 8,
  },
  // Loading Animation styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101009',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#FEFBF4',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  // Result Screen styles
  resultContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFC629',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#FEFBF4',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  matchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  matchedAvatar: {
    backgroundColor: '#F8F0E5',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0B1009',
  },
  messageButton: {
    flexDirection: 'row',
    backgroundColor: '#0B1009',
    width: '100%',
    height: 56,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#FFC629',
    width: '100%',
    height: 56,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#0B1009',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMatchIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 