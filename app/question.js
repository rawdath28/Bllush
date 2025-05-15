import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function QuestionScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Sample questions
  const questions = [
    {
      id: 1,
      tag: 'Lifestyle',
      text: 'How much do you like to plan versus going with the flow?',
      type: 'slider',
    },
    {
      id: 2,
      tag: 'Values',
      text: 'Is honesty the most important quality in a relationship?',
      type: 'truefalse',
    },
    {
      id: 3,
      tag: 'Interests',
      text: 'What do you prefer to do on a weekend?',
      type: 'multiplechoice',
      options: [
        'Outdoor activities',
        'Staying in with a movie',
        'Social gatherings',
        'Creative projects'
      ]
    }
  ];
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Go back to home after completing questions
      router.replace('/(tabs)/home');
    }
  };
  
  const handleSkip = () => {
    // Skip to next question or go back if last one
    handleNext();
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Answer Questions</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1}/{questions.length}
        </Text>
      </View>
      
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.tagContainer}>
            <Feather name="box" size={20} color="#0B1009" />
            <Text style={styles.tagText}>{currentQuestion.tag}</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>
        
        <View style={styles.answerContainer}>
          {currentQuestion.type === 'truefalse' && (
            <View style={styles.trueFalseContainer}>
              <TouchableOpacity style={styles.trueFalseButton}>
                <Text style={styles.trueFalseButtonText}>True</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.trueFalseButton}>
                <Text style={styles.trueFalseButtonText}>False</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {currentQuestion.type === 'multiplechoice' && (
            <View style={styles.multipleChoiceContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity key={index} style={styles.multipleChoiceOption}>
                  <Text style={styles.multipleChoiceText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {currentQuestion.type === 'slider' && (
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>This is a placeholder for a slider</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Feather name="arrow-right" size={20} color="#0B1009" />
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
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A1A18',
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC629',
    borderRadius: 4,
  },
  progressText: {
    color: '#FEFBF4',
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 28,
    flex: 1,
    maxHeight: 500,
  },
  questionHeader: {
    marginBottom: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFC4',
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  tagText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
    marginLeft: 8,
  },
  questionText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#0B1009',
    lineHeight: 34,
  },
  answerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  trueFalseContainer: {
    gap: 16,
  },
  trueFalseButton: {
    backgroundColor: '#F1E5D5',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  trueFalseButtonText: {
    fontSize: 18,
    color: '#0B1009',
    fontWeight: '600',
  },
  multipleChoiceContainer: {
    gap: 12,
  },
  multipleChoiceOption: {
    backgroundColor: '#F1E5D5',
    borderRadius: 8,
    padding: 16,
  },
  multipleChoiceText: {
    fontSize: 16,
    color: '#0B1009',
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F1E5D5',
    borderRadius: 8,
    height: 100,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#0B1009',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 40,
    marginTop: 20,
  },
  skipButton: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#FEFBF4',
    fontSize: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC629',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1009',
    marginRight: 8,
  },
}); 