import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import LoadingAnimation from '../components/LoadingAnimation';
import ResultsScreen from './ResultsScreen';
import NoMatchScreen from './NoMatchScreen';
import Slider from '@react-native-community/slider';
import ValidationScreen from './ValidationScreen';

type BaseQuestion = {
  id: number;
  tag: string;
  text: string;
  type: 'truefalse' | 'multiple' | 'slider' | 'audio' | 'photo';
};

type TrueFalseQuestion = BaseQuestion & {
  type: 'truefalse';
  options: {
    id: string;
    text: string;
  }[];
};

type MultipleChoiceQuestion = BaseQuestion & {
  type: 'multiple';
  options: {
    id: string;
    text: string;
    description: string;
  }[];
};

type SliderQuestion = BaseQuestion & {
  type: 'slider';
  minEmoji: string;
  maxEmoji: string;
  minValue: number;
  maxValue: number;
};

type AudioQuestion = BaseQuestion & {
  type: 'audio';
  maxDuration: number; // in seconds
};

type PhotoQuestion = BaseQuestion & {
  type: 'photo';
};

type Question = TrueFalseQuestion | MultipleChoiceQuestion | SliderQuestion | AudioQuestion | PhotoQuestion;

const questions: Question[] = [
  {
    id: 1,
    type: 'truefalse',
    tag: 'Voyages',
    text: 'Les auberges de jeunesse?',
    options: [
      { id: 'false', text: 'Contre' },
      { id: 'true', text: 'Pour' },
    ],
  },
  {
    id: 2,
    type: 'multiple',
    tag: 'Tchatcheur',
    text: 'Un surnom que tu  donnerais à ton/ta crush.',
    options: [
      { 
        id: 'fun', 
        text: 'Bébé',
        description: ''
      },
      { 
        id: 'serious', 
        text: 'Mon coeur',
        description: ''
      },
      { 
        id: 'friends', 
        text: 'Ma libellule',
        description: ''
      },
    ],
  },
  {
    id: 3,
    type: 'slider',
    tag: 'Habitudes',
    text: 'Garder ses chaussettes dans le lit ?',
    minEmoji: '🥶',
    maxEmoji: '🥵',
    minValue: 0,
    maxValue: 100,
  },
  {
    id: 4,
    type: 'audio',
    tag: 'En 15 secondes',
    text: 'Joue la citation de ton film préféré.',
    maxDuration: 15, // 15 seconds max
  },
  {
    id: 5,
    type: 'photo',
    tag: 'En une image',
    text: 'Ton plus gros green flag ?',
  },
];

// Update to only show 5 questions (1 of each type)
const visibleQuestions = questions;

// Update the component props
type QuestionScreenProps = {
  onBack: () => void;
  onComplete?: () => void;
};

const QuestionScreen = ({ onBack, onComplete }: QuestionScreenProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [answers, setAnswers] = useState<Record<number, string | number | null>>({});
  const [showLoading, setShowLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  // For audio questions
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioAnswer, setAudioAnswer] = useState<string | null>(null);
  
  // For photo questions
  const [photoAnswer, setPhotoAnswer] = useState<string | null>(null);
  const [hasPhotoPermission, setHasPhotoPermission] = useState<boolean | null>(null);
  
  // Timer ref for recording
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasPhotoPermission(status === 'granted');
      }
    })();
  }, []);

  const handleCompletedQuestions = () => {
    // Show loading animation
    setShowLoading(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setShowLoading(false);
      if (onComplete) {
        onComplete();
      } else {
        setShowValidation(true);
      }
    }, 2000); // Show loading for 2 seconds
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));

    setTimeout(() => {
      if (currentQuestion < visibleQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        handleCompletedQuestions();
      }
    }, 500);
  };

  const handleSliderComplete = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));

    // Automatically proceed to the next question after a short delay
    setTimeout(() => {
      if (currentQuestion < visibleQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSliderValue(50); // Reset slider value for next slider question
      } else {
        handleCompletedQuestions();
      }
    }, 800); // Slightly longer delay to give user time to see their selection
  };

  const handleStartOver = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSliderValue(50);
    setAudioAnswer(null);
    setPhotoAnswer(null);
    setRecordingTime(0);
    setIsRecording(false);
    setShowValidation(false);
    
    // Clear any ongoing recording timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setAnswers({});
    setShowResults(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start a timer to track recording time
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        const question = visibleQuestions[currentQuestion] as AudioQuestion;
        
        // Stop recording if max time reached
        if (newTime >= question.maxDuration) {
          handleStopRecording();
        }
        
        return newTime;
      });
    }, 1000);
    
    // TODO: In a real app, start actual audio recording here
    console.log('Recording started');
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Clear the recording timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    // TODO: In a real app, stop actual audio recording and get file URI
    const mockAudioURI = 'recording.m4a';
    setAudioAnswer(mockAudioURI);
    
    // Save the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: mockAudioURI
    }));
    
    console.log('Recording stopped');
  };
  
  const handleAudioSubmit = () => {
    // Move to next question
    setTimeout(() => {
      if (currentQuestion < visibleQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAudioAnswer(null);
        setRecordingTime(0);
      } else {
        handleCompletedQuestions();
      }
    }, 500);
  };
  
  const handleTakePhoto = async () => {
    if (hasPhotoPermission === false) {
      Alert.alert(
        "Permission required", 
        "We need camera permissions to take a photo.",
        [{ text: "OK" }]
      );
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setPhotoAnswer(photoUri);
        
        // Save the answer
        setAnswers(prev => ({
          ...prev,
          [currentQuestion]: photoUri
        }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };
  
  const handleChoosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setPhotoAnswer(photoUri);
        
        // Save the answer
        setAnswers(prev => ({
          ...prev,
          [currentQuestion]: photoUri
        }));
      }
    } catch (error) {
      console.error("Error choosing photo:", error);
      Alert.alert("Error", "Failed to select photo. Please try again.");
    }
  };
  
  const handlePhotoSubmit = () => {
    // Move to next question
    setTimeout(() => {
      if (currentQuestion < visibleQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setPhotoAnswer(null);
      } else {
        handleCompletedQuestions();
      }
    }, 500);
  };

  const handleValidate = () => {
    setShowValidation(false);
    setShowResults(true);
  };

  // if (showLoading) {
    // return <LoadingAnimation />;
  // }

  if (showValidation) {
    return <ValidationScreen onBack={handleStartOver} onValidate={handleValidate} />;
  }

  if (showResults) {
    // Calculate how many questions were answered
    const validatedCount = Object.keys(answers).length;
    
    // return <NoMatchScreen onStartOver={handleStartOver} />;
    return (
      <ResultsScreen 
        onStartOver={handleStartOver}
        matchId="sample_match_123"
        validatedCount={validatedCount}
        matchedUserName="Sophie"
        matchedUserProfileImage=""
        currentUserProfileImage=""
      />
    );
  }

  const question = visibleQuestions[currentQuestion];

  const renderTrueFalseOptions = (question: TrueFalseQuestion) => (
    <View style={styles.answerContainer}>
      {question.options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.answerButton,
            selectedAnswer === option.id && styles.selectedAnswer,
          ]}
          onPress={() => handleAnswerSelect(option.id)}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={[
              styles.radioButton,
              selectedAnswer === option.id && styles.selectedRadioButton,
            ]}>
              {option.id === 'false' ? (
                <Feather name="x" size={18} color="#0B1009" />
              ) : (
                <Feather name="heart" size={18} color="#0B1009" />
              )}
            </View>
            <Text style={[
              styles.answerText,
              selectedAnswer === option.id && styles.selectedAnswerText,
            ]}>
              {option.text}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMultipleChoiceOptions = (question: MultipleChoiceQuestion) => (
    <ScrollView 
      style={styles.multipleChoiceContainer}
      showsVerticalScrollIndicator={false}
    >
      {question.options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.multipleChoiceButton,
            selectedAnswer === option.id && styles.selectedMultipleChoice,
          ]}
          onPress={() => handleAnswerSelect(option.id)}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            paddingLeft: 10,
          }}>
            <View style={[
              styles.radioButton,
              selectedAnswer === option.id && styles.selectedRadioButton,
            ]}>
              <Feather name="heart" size={18} color="#0B1009" />
            </View>
            <Text style={[
              styles.answerText,
              selectedAnswer === option.id && styles.selectedAnswerText,
            ]}>
              {option.text}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSliderOptions = (question: SliderQuestion) => (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={question.minValue}
        maximumValue={question.maxValue}
        value={sliderValue}
        onValueChange={setSliderValue}
        onSlidingComplete={handleSliderComplete}
        minimumTrackTintColor="#FFC629"
        maximumTrackTintColor="#F6F2EC"
        thumbTintColor="#FFC629"
      />
      <View style={styles.emojiContainer}>
        <Text style={styles.emojiText}>{question.minEmoji}</Text>
        <Text style={styles.emojiText}>{question.maxEmoji}</Text>
      </View>
      {/* <TouchableOpacity 
        style={styles.sliderSubmitButton}
        onPress={() => handleSliderComplete(sliderValue)}
      >
        <Text style={styles.sliderSubmitText}>Confirmer</Text>
      </TouchableOpacity> */}
    </View>
  );
  
  const renderAudioOptions = (question: AudioQuestion) => (
    <View style={styles.audioContainer}>
      <Text style={styles.timerText}>
        {isRecording || audioAnswer 
          ? `${formatTime(recordingTime)} / ${formatTime(question.maxDuration)}`
          : `0:00 / ${formatTime(question.maxDuration)}`
        }
      </Text>
      
      {!isRecording && !audioAnswer ? (
        <View style={styles.audioButtonContainer}>
          <Text style={styles.audioButtonLabel}>Commencer l'enregistrement</Text>
          <TouchableOpacity 
            style={styles.recordButton}
            onPress={handleStartRecording}
          >
            <Feather name="mic" size={24} color="#0B1009" />
          </TouchableOpacity>
        </View>
      ) : isRecording ? (
        <View style={styles.audioButtonContainer}>
          {/* <View style={styles.recordingTimerContainer}>
            <Feather name="clock" size={20} color="#FF6B6B" />
            <Text style={styles.recordingTimerText}>
              {recordingTime}s
            </Text>
          </View> */}
          <Text style={styles.audioButtonLabel}>
            Enregistrement en cours...
          </Text>
          <TouchableOpacity 
            style={[styles.recordButton, styles.recordingActive]}
            onPress={handleStopRecording}
          >
            <Feather name="square" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.audioSubmitButton}
          onPress={handleAudioSubmit}
        >
          <Text style={styles.audioSubmitText}>Confirmer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderPhotoOptions = (question: PhotoQuestion) => (
    <View style={styles.photoContainer}>
      {photoAnswer ? (
        <View style={styles.photoPreviewContainer}>
          <View style={styles.photoPreview}>
            <Image 
              source={{ uri: photoAnswer }} 
              style={styles.photoPreviewImage} 
              resizeMode="cover" 
            />
          </View>
          <TouchableOpacity 
            style={styles.photoSubmitButton}
            onPress={handlePhotoSubmit}
          >
            <Text style={styles.photoSubmitText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoButtonContainer}>
          <View style={styles.photoButtonsRow}>
            {/* <TouchableOpacity 
              style={styles.photoButton}
              onPress={handleTakePhoto}
            >
              <Feather name="camera" size={24} color="#0B1009" />
              <Text style={styles.photoButtonText}>Prendre une photo</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={handleChoosePhoto}
            >
              <Feather name="image" size={24} color="#0B1009" />
              <Text style={styles.photoButtonText}>Ajouter une photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
  
  // Helper function to format time for audio recording
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partage un peu de toi</Text>
      </View>

      <View style={styles.progressContainer}>
        {visibleQuestions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentQuestion && styles.activeDot,
              index < currentQuestion && styles.completedDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.tagContainer}>
            {question.tag === 'Tagbis' ? (
              <Feather name="box" size={20} color="#0B1009" />
            ) : (
            <Ionicons name="cube-outline" size={20} color="#0B1009" />
            )}
            <Text style={styles.tagText}>{question.tag}</Text>
          </View>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {question.type === 'truefalse' 
          ? renderTrueFalseOptions(question)
          : question.type === 'multiple'
            ? renderMultipleChoiceOptions(question)
            : question.type === 'slider'
              ? renderSliderOptions(question)
              : question.type === 'audio'
                ? renderAudioOptions(question)
                : renderPhotoOptions(question)
        }
      </View>

      <Text style={styles.footerText}>
        Question {currentQuestion + 1} of {visibleQuestions.length}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F1E5D5',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 14,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    backgroundColor: '#0B1009',
  },
  completedDot: {
    backgroundColor: '#FFC629',
  },
  questionCard: {
    backgroundColor: '#FEFBF4',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 32,
    padding: 20,
    flex: 1,
    maxHeight: 546,
  },
  questionHeader: {
    marginBottom: 58,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFC4',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginBottom: 16,
  },
  tagIcon: {
    width: 20,
    height: 20,
  },
  tagText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  questionText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#0B1009',
    lineHeight: 34,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  // True/False styles
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    alignItems: 'center',
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEFBF4',
    borderWidth: 1,
    borderColor: '#0B1009',
    borderRadius: 8,
    padding: 28,
    marginHorizontal: 8,
    height: 88,
    marginTop: 200,
  },
  selectedAnswer: {
    backgroundColor: '#FFC629',
    borderColor: '#FFEFC4',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1E5D5',
  },
  selectedRadioButton: {
    backgroundColor: '#FFEFC4',
  },
  answerText: {
    marginLeft: 14,
    fontSize: 20,
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  selectedAnswerText: {
    fontWeight: '600',
  },
  // Multiple Choice styles
  multipleChoiceContainer: {
    flex: 1,
    marginTop: 'auto',
  },
  multipleChoiceButton: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-start',
    backgroundColor: '#FEFBF4',
    borderWidth: 1,
    borderColor: '#0B1009',
    borderRadius: 8,
    padding: 28,
    marginBottom: 16,
    minHeight: 88,
  },
  selectedMultipleChoice: {
    backgroundColor: '#FFC629',
    borderColor: '#FFEFC4',
  },
  multipleChoiceContent: {
    flex: 1,
    marginRight: 16,
  },
  multipleChoiceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0B1009',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  multipleChoiceDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  selectedMultipleChoiceText: {
    color: '#0B1009',
  },
  multipleChoiceCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0B1009',
    backgroundColor: '#FEFBF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMultipleChoiceCheck: {
    backgroundColor: '#FFEFC4',
  },
  // Slider styles
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    padding: 32,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  emojiText: {
    fontSize: 26,
    color: '#000000',
  },
  sliderSubmitButton: {
    backgroundColor: '#FFC629',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  sliderSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  // Audio styles
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    padding: 32,
  },
  timerText: {
    fontSize: 16,
    color: 'rgba(11, 16, 9, 0.7)',
    marginBottom: 22,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  audioButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  audioButtonLabel: {
    fontSize: 10,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: 'black',
  },
  audioSubmitButton: {
    backgroundColor: '#FFC629',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  audioSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  // Updated Photo styles
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    padding: 40,
  },
  photoButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
  },
  photoButtonLabel: {
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    marginBottom: 4,
  },
  photoButtonsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    backgroundColor: '#FFC629',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 50,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  photoPreviewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  photoPreview: {
    width: 250,
    height: 250,
    borderRadius: 8,
    backgroundColor: '#F1E5D5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoSubmitButton: {
    backgroundColor: '#FFC629',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  photoSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#0B1009',
    marginTop: 28,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    letterSpacing: -0.32,
  },
  recordingTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  recordingTimerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default QuestionScreen; 