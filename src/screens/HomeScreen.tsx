import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import QuestionScreen from './QuestionScreen';

type HomeScreenProps = {
  onStartQuestions: () => void;
  onStartValidationResponse?: () => void;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuestions, onStartValidationResponse }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="bell" size={24} color="#0B1009" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="info" size={24} color="#0B1009" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="refresh-ccw" size={24} color="#0B1009" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContainer}>
        {/* Circle Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../assets/images/Simplification.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>C'est l'heure !</Text>
          <Text style={styles.subtitle}>
            5 questions. 2 minutes. 1 chance de matcher.
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => {
            console.log('Je commence button pressed');
            onStartQuestions();
          }}
        >
          <Text style={styles.startButtonText}>Je commence</Text>
        </TouchableOpacity>
        
        {/* Test button for validation - Only in development */}
        {/* {onStartValidationResponse && (
          <TouchableOpacity 
            style={[styles.startButton, styles.testButton]} 
            onPress={onStartValidationResponse}
          >
            <Text style={styles.startButtonText}>Tester Validation</Text>
          </TouchableOpacity>
        )} */}
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  logoContainer: {
    height: 40,
    justifyContent: 'center',
  },
  logo: {
    width: 27,
    height: 27,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 17,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FEFBF4',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  illustration: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1009',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
  startButton: {
    width: '100%',
    height: 59,
    backgroundColor: '#0B1009',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  testButton: {
    marginTop: 12,
    backgroundColor: '#FFC629',
  },
});

export default HomeScreen; 