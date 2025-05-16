import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type ExplanationScreenProps = {
  onStartQuestions: () => void;
  onBack: () => void;
};

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ 
  onStartQuestions,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101009" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
      </View>

      {/* Main Content - 3 Steps */}
      <View style={styles.mainContainer}>
        
        {/* Step 1 */}
        <View style={styles.stepRow}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Réponds aux 5 questions</Text>
            <Text style={styles.stepDescription}>Ta vision, ton humour, ton énergie</Text>
          </View>
        </View>
        
        {/* Step 2 */}
        <View style={styles.stepRow}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Découvre ses réponses</Text>
            <Text style={styles.stepDescription}>Sans filtre, sans mise en scène.</Text>
          </View>
        </View>
        
        {/* Step 3 */}
        <View style={styles.stepRow}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>C'est un match ?</Text>
            <Text style={styles.stepDescription}>Alors vous pouvez discuter, avec vos réponses comme point de départ.</Text>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={onStartQuestions}
      >
        <Text style={styles.startButtonText}>Je réponds à mes questions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 10,
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
    marginTop: 10,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 45,
    width: 370,
    alignSelf: 'center',
    marginTop: 70,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
    width: '100%',
  },
  stepNumberContainer: {
    width: 67,
    height: 67,
    borderRadius: 39,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'sans-serif',
    fontSize: 30,
    fontWeight: '700',
    color: '#000000',
  },
  stepTextContainer: {
    flex: 1,
    gap: 6,
    width: 275,
  },
  stepTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    lineHeight: 24.5,
  },
  stepDescription: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    color: 'black',
    lineHeight: 20.8,
  },
  startButton: {
    backgroundColor: '#0B1009',
    height: 59,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
    marginTop: 100,
  },
  startButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ExplanationScreen; 