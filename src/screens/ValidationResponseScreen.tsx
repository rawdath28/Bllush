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
import ResultsScreen from './ResultsScreen';
import NoMatchScreen from './NoMatchScreen';
import LoadingAnimation from '../components/LoadingAnimation';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';

type ValidationResponseScreenProps = {
  onBack: () => void;
};

// Define response types
type BaseResponse = {
  id: number;
  tag: string;
  question: string;
  type: 'truefalse' | 'multiplechoice' | 'slider' | 'audio' | 'filepicker';
  validated: boolean | null;
};

type TrueFalseResponse = BaseResponse & {
  type: 'truefalse';
  otherUserAnswer: 'Pour' | 'Contre';
};

type MultipleChoiceResponse = BaseResponse & {
  type: 'multiplechoice';
  options: {
    id: string;
    text: string;
  }[];
  selectedOptionId: string;
};

type SliderResponse = BaseResponse & {
  type: 'slider';
  minEmoji: string;
  maxEmoji: string;
  value: number; // 0-100
};

type AudioResponse = BaseResponse & {
  type: 'audio';
  audioUri: any; // Can be a require'd file or a URI string
  duration: number; // in seconds
};

type FilePickerResponse = BaseResponse & {
  type: 'filepicker';
  imageUri: number; // Image require statement
};

type ResponseData = TrueFalseResponse | MultipleChoiceResponse | SliderResponse | AudioResponse | FilePickerResponse;

// Sample response data
const responseData: ResponseData[] = [
  {
    id: 1,
    tag: 'Voyages',
    question: 'Les auberges de jeunesse?',
    type: 'truefalse',
    otherUserAnswer: 'Pour', // True
    validated: null,
  },
  {
    id: 2,
    tag: 'Tchatcheur',
    question: 'Un surnom que tu  donnerais à ton/ta crush.',
    type: 'multiplechoice',
    options: [
      { id: 'option1', text: 'Bébé' },
      { id: 'option2', text: 'Mon coeur' },
      { id: 'option3', text: 'Ma libellule' },
    ],
    selectedOptionId: 'option3',
    validated: null,
  },
  {
    id: 3,
    tag: 'Habitudes',
    question: 'Garder ses chaussettes dans le lit?',
    type: 'slider',
    minEmoji: '🥶', // Cold/Planning
    maxEmoji: '🥵', // Hot/Spontaneous
    value: 2, // 0-100 where 100 is max
    validated: null,
  },
  {
    id: 4,
    tag: 'En 15 secondes',
    question: 'Joue le citation de ton film préféré.',
    type: 'audio',
    // Use a local audio file
    audioUri: require('../assets/audio/sample.mp3'),
    duration: 15, // 15 seconds
    validated: null,
  },
  {
    id: 5,
    tag: 'En une photo',
    question: 'Ton plus gros green flag ?',
    type: 'filepicker',
    imageUri: require('../assets/images/img_mel.png'),
    validated: null,
  }
];

// Simple AudioPlayer Component with real functionality
const AudioPlayer = ({ audioUri, duration }: { audioUri: any, duration: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [positionTimer, setPositionTimer] = useState<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

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
      if (positionTimer) {
        clearInterval(positionTimer);
      }
    };
  }, [sound, positionTimer]);

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
      
      if (positionTimer) {
        clearInterval(positionTimer);
        setPositionTimer(null);
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
                if (positionTimer) {
                  clearInterval(positionTimer);
                  setPositionTimer(null);
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
      if (!positionTimer) {
        // Update position more frequently for smoother timer
        const timer = setInterval(async () => {
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
                  clearInterval(timer);
                  setPositionTimer(null);
                }
              }
            } catch (timerErr) {
              console.log('Timer error:', timerErr);
            }
          }
        }, 250); // Update 4 times per second for smoother updates
        
        setPositionTimer(timer);
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      setError('Error playing audio. Please check the file format.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format seconds to display current position in standard format
  const formatTime = (seconds: number) => {
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
const FilePicker = ({ imageUri }: { imageUri: number }) => {
  // For a real implementation, we would use expo-image-picker to handle image selection
  // This is a simplified version showing the UI according to the Figma design
  
  const handleTakePhoto = () => {
    // In a real implementation, this would open the camera
    console.log('Take photo');
  };
  
  const handlePickFromGallery = () => {
    // In a real implementation, this would open the gallery
    console.log('Pick from gallery');
  };
  
  return (
    <View style={styles.filePickerWrapper}>
      <View style={styles.filePickerContainer}>
        <Image 
          source={imageUri} 
          style={styles.filePickerImage}
          resizeMode="cover"
        />
      </View>
      
      {/* This would be included in a real implementation */}
      {/* <View style={styles.filePickerActions}>
        <TouchableOpacity 
          style={styles.filePickerButton}
          onPress={handleTakePhoto}
        >
          <Feather name="camera" size={20} color="#0B1009" />
          <Text style={styles.filePickerButtonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filePickerButton}
          onPress={handlePickFromGallery}
        >
          <Feather name="image" size={20} color="#0B1009" />
          <Text style={styles.filePickerButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const ValidationResponseScreen: React.FC<ValidationResponseScreenProps> = ({ onBack }) => {
  const [responses, setResponses] = useState<ResponseData[]>(responseData);
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
          // Use number values instead of constants for interruption modes
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

  const handleValidateResponse = (validated: boolean) => {
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

  const currentResponse = responses[currentQuestion];

  if (showResults) {
    // Show match or no match screen
    return isMatch() 
      ? <ResultsScreen 
          onStartOver={onBack} 
          matchId="sample_match_123"
          validatedCount={responses.filter(r => r.validated === true).length}
          matchedUserName="Sophie"
          matchedUserProfileImage=""
          currentUserProfileImage=""
        /> 
      : <NoMatchScreen onStartOver={onBack} />;
  }

  if (showLoading) {
    // Show loading animation
    return <LoadingAnimation />;
  }

  // Render slider component based on the Figma design
  const renderSlider = (response: SliderResponse) => (
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
  const renderAudioPlayer = (response: AudioResponse) => (
    <AudioPlayer 
      audioUri={response.audioUri}
      duration={response.duration}
    />
  );

  // Render file picker component
  const renderFilePicker = (response: FilePickerResponse) => (
    <FilePicker imageUri={response.imageUri} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Découvre ce qu' elle pense</Text>
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
          {currentResponse.type === 'truefalse' ? (
            // True/False Options - Showing only the selected option based on Figma
            <View style={styles.responseOptions}>
              {/* True Button - Only showing this as it's the selected one in Figma */}
              <View style={styles.responseButton}>
                <View style={styles.responseIconContainer}>
                  <Feather name="heart" size={24} color="#0B1009" />
                </View>
                <Text style={styles.responseText}>Pour</Text>
              </View>
            </View>
          ) : currentResponse.type === 'multiplechoice' ? (
            // Multiple Choice Options - Updated to match Figma design
            <View style={styles.multipleChoiceContainer}>
              {/* Only showing the selected option as per Figma design */}
              <View style={styles.multipleChoiceSelectedOption}>
                <View style={styles.multipleChoiceIconContainer}>
                  <Feather name="heart" size={20} color="#0B1009" />
                </View>
                <Text style={styles.multipleChoiceSelectedText}>
                  {(currentResponse as MultipleChoiceResponse).options.find(
                    option => option.id === (currentResponse as MultipleChoiceResponse).selectedOptionId
                  )?.text || "Selected Option"}
                </Text>
              </View>
              
              {/* Instruction text below the option */}
              {/* <Text style={styles.instructionText}>Rorem ipsum dolor sit amet</Text> */}
            </View>
          ) : currentResponse.type === 'slider' ? (
            // Slider Response
            renderSlider(currentResponse as SliderResponse)
          ) : currentResponse.type === 'audio' ? (
            // Audio Response
            renderAudioPlayer(currentResponse as AudioResponse)
          ) : (
            // File Picker Response
            renderFilePicker(currentResponse as FilePickerResponse)
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    height: 1000,
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
    width: '100%',
    height: 500,
  },
  responseOptions: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 150,
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
    marginTop: 150,
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
  instructionText: {
    fontSize: 14,
    color: '#0B1009',
    textAlign: 'center',
    marginTop: 28,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    letterSpacing: -0.32,
  },
  // Keep existing styles for other question types
  multipleChoiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFBF4',
    borderWidth: 1,
    borderColor: '#0B1009',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  selectedMultipleChoiceOption: {
    backgroundColor: '#FFC629',
  },
  multipleChoiceText: {
    fontSize: 16,
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    flex: 1,
  },
  // Slider specific styles
  sliderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    marginTop: 80,
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
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
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
    alignItems: 'center',
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
    height: 250,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filePickerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  filePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1E5D5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filePickerButtonText: {
    fontSize: 14,
    color: '#0B1009',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default ValidationResponseScreen; 