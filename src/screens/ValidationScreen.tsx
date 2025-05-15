import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';

type ValidationScreenProps = {
  onDiscoverResponses?: () => void;
  userName?: string;
  onBack?: () => void;
  onValidate?: () => void;
};

const ValidationScreen: React.FC<ValidationScreenProps> = ({ 
  onDiscoverResponses,
  userName = 'Alexandra',
  onBack,
  onValidate
}) => {
  // Handle button press with fallbacks
  const handleButtonPress = () => {
    if (onValidate) {
      onValidate();
    } else if (onDiscoverResponses) {
      onDiscoverResponses();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101009" />
      
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundRectangle} />
      </View>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Avatar/Character container */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {/* We would need to implement/import the avatar SVG */}
            <Image 
              source={require('../../assets/images/character-avatar.png')} 
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.mainTitle}>
              Découvre ce que {userName} à répondu
            </Text>
            <Text style={styles.subtitle}>
              Alors, tu valides ?
            </Text>
          </View>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleButtonPress}
        >
          <Text style={styles.actionButtonText}>Découvrir ses réponses</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  backgroundRectangle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#101009',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 52,
  },
  avatarContainer: {
    width: 313,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  mainTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#FEFBF4',
    textAlign: 'center',
    lineHeight: 28.6,
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(254, 251, 244, 0.7)',
    textAlign: 'center',
    lineHeight: 20.8,
  },
  actionButton: {
    width: 337,
    height: 59,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 300,
  },
  actionButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
  },
});

export default ValidationScreen; 