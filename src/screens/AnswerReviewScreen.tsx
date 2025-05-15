import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ResultsScreen from './ResultsScreen';
import NoMatchScreen from './NoMatchScreen';
import Slider from '@react-native-community/slider';

type AnswerReviewScreenProps = {
  onBack: () => void;
};

// Sample other user's answers
const otherUserAnswers = [
  {
    id: 1,
    type: 'truefalse',
    tag: 'Social Media',
    question: 'Do you prefer meaningful conversations over social media interactions?',
    answer: 'true',
    userAnswer: 'Vrai',
    otherUserAnswer: 'Vrai',
    matched: true
  },
  {
    id: 2,
    type: 'multiple',
    tag: 'Relationships',
    question: 'What are you looking for in a relationship?',
    answer: 'serious',
    userAnswer: 'Serious Relationship',
    otherUserAnswer: 'Serious Relationship',
    matched: true
  },
  {
    id: 3,
    type: 'slider',
    tag: 'Preferences',
    question: 'How much do you like to plan versus going with the flow?',
    answer: 75,
    userAnswer: '75%',
    otherUserAnswer: '80%',
    matched: true
  },
  {
    id: 4,
    type: 'audio',
    tag: 'Voice',
    question: 'Describe what you are looking for in a partner',
    answer: 'recording.m4a',
    userAnswer: '[Audio recording]',
    otherUserAnswer: '[Audio recording]',
    matched: false
  },
  {
    id: 5,
    type: 'photo',
    tag: 'Visual',
    question: 'Add a photo that represents your personality',
    answer: 'photo.jpg',
    userAnswer: '[Photo]',
    otherUserAnswer: '[Photo]',
    matched: true
  }
];

const AnswerReviewScreen: React.FC<AnswerReviewScreenProps> = ({ onBack }) => {
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);

  // Calculate if there's a match based on the number of matching answers
  const calculateMatch = () => {
    const matchCount = otherUserAnswers.filter(answer => answer.matched).length;
    return matchCount >= 3; // Match if at least 3 answers match
  };

  const handleFlipCard = () => {
    if (isFlipped) {
      // If the card is already flipped, move to the next answer
      if (currentAnswerIndex < otherUserAnswers.length - 1) {
        // Reset flip animation first
        Animated.timing(flipAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsFlipped(false);
          setCurrentAnswerIndex(prev => prev + 1);
        });
      } else {
        // If this was the last answer, show the results
        setReviewCompleted(true);
        setTimeout(() => {
          setShowResults(true);
        }, 500);
      }
    } else {
      // Flip the card to show the other user's answer
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipped(true);
      });
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  if (showResults) {
    // Show match or no match based on the calculated result
    return calculateMatch() 
      ? <ResultsScreen onStartOver={onBack} /> 
      : <NoMatchScreen onStartOver={onBack} />;
  }

  const currentAnswer = otherUserAnswers[currentAnswerIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Les réponses</Text>
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {otherUserAnswers.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentAnswerIndex && styles.activeDot,
              index < currentAnswerIndex && styles.completedDot,
            ]}
          />
        ))}
      </View>

      {/* Main Content - Flip Card */}
      <View style={styles.cardContainer}>
        {/* Front Card (Your Answer) */}
        <Animated.View 
          style={[styles.card, frontAnimatedStyle, 
            { zIndex: isFlipped ? 0 : 1, opacity: isFlipped ? 0 : 1 }]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.tagContainer}>
              <Feather name="tag" size={20} color="#0B1009" />
              <Text style={styles.tagText}>{currentAnswer.tag}</Text>
            </View>
            <Text style={styles.questionText}>{currentAnswer.question}</Text>
          </View>

          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Votre réponse:</Text>
            <View style={styles.answerCard}>
              <Text style={styles.answerText}>{currentAnswer.userAnswer}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.flipButton} onPress={handleFlipCard}>
            <Text style={styles.flipButtonText}>Voir leur réponse</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Back Card (Their Answer) */}
        <Animated.View 
          style={[styles.card, styles.cardBack, backAnimatedStyle, 
            { zIndex: isFlipped ? 1 : 0, opacity: isFlipped ? 1 : 0 }]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.tagContainer}>
              <Feather name="tag" size={20} color="#0B1009" />
              <Text style={styles.tagText}>{currentAnswer.tag}</Text>
            </View>
            <Text style={styles.questionText}>{currentAnswer.question}</Text>
          </View>

          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Leur réponse:</Text>
            <View style={[styles.answerCard, 
              currentAnswer.matched ? styles.matchedAnswer : styles.unmatchedAnswer]}>
              <Text style={styles.answerText}>{currentAnswer.otherUserAnswer}</Text>
              {currentAnswer.matched ? (
                <View style={styles.matchIndicator}>
                  <Feather name="check" size={24} color="#FFC629" />
                  <Text style={styles.matchText}>Match!</Text>
                </View>
              ) : (
                <View style={styles.matchIndicator}>
                  <Feather name="x" size={24} color="#FF6B6B" />
                  <Text style={[styles.matchText, { color: '#FF6B6B' }]}>Pas de match</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.flipButton} onPress={handleFlipCard}>
            <Text style={styles.flipButtonText}>
              {currentAnswerIndex < otherUserAnswers.length - 1 
                ? 'Question suivante' 
                : 'Voir les résultats'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={styles.footerText}>
        Question {currentAnswerIndex + 1} sur {otherUserAnswers.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
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
    marginTop: 16,
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '80%',
    backgroundColor: '#FEFBF4',
    borderRadius: 12,
    padding: 24,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#FEFBF4',
  },
  cardHeader: {
    marginBottom: 32,
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
  tagText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0B1009',
    lineHeight: 32,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  answerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1009',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  answerCard: {
    width: '100%',
    backgroundColor: '#F1E5D5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  matchedAnswer: {
    backgroundColor: 'rgba(255, 198, 41, 0.2)',
    borderWidth: 1,
    borderColor: '#FFC629',
  },
  unmatchedAnswer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  answerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0B1009',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    marginBottom: 16,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  matchText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFC629',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  flipButton: {
    backgroundColor: '#FFC629',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#0B1009',
    marginTop: 20,
    marginBottom: 28,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default AnswerReviewScreen; 