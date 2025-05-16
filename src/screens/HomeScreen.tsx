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
      <View style={styles.contentWrapper}>
        <View style={styles.mainContainer}>
          <View style={styles.contentTop}>
            {/* Illustration */}
            <Image
              source={require('../assets/images/home-illustration.svg')}
              style={styles.illustration}
              resizeMode="contain"
            />
            
            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>C'est l'heure !</Text>
              <Text style={styles.subtitle}>
                5 questions. 2 minutes. 1 chance de matcher.
              </Text>
            </View>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  logoContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainContainer: {
    width: 337,
    backgroundColor: '#FEFBF4',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTop: {
    alignItems: 'center',
    marginBottom: 22,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 42,
  },
  textContainer: {
    alignItems: 'center',
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
});

export default HomeScreen; 