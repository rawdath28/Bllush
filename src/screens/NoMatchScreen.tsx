import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type NoMatchScreenProps = {
  onStartOver: () => void;
};

const NoMatchScreen: React.FC<NoMatchScreenProps> = ({ onStartOver }) => {
  return (
    <View style={styles.container}>
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
      <View style={styles.noMatchContainer}>
        <View style={styles.matchHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onStartOver}>
            <Feather name="x" size={24} color="#0B1009" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="more-vertical" size={24} color="#0B1009" />
          </TouchableOpacity>
        </View>

        <View style={styles.noMatchContent}>
          <View style={styles.noMatchIconContainer}>
            <Image
              source={require('../assets/images/nomatch.png')}
              style={styles.noMatchImage}
                resizeMode="contain"
              />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Pas de match ce soir</Text>
            <Text style={styles.subtitle}>
            Pas grave. Chaque question te rapproche d'une vraie compatibilité.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startOverButton} onPress={onStartOver}>
          <Text style={styles.startOverText}>Être alerté(e) pour le prochain macth</Text>
        </TouchableOpacity>
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
  noMatchContainer: {
    flex: 1,
    backgroundColor: '#FEFBF4',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    justifyContent: 'space-between',
    marginBottom: 80, // Added space for bottom nav
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F0E5',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchContent: {
    alignItems: 'center',
    gap: 42,
  },
  noMatchIconContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchImage: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1009',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
  },
  startOverButton: {
    width: '100%',
    height: 59,
    backgroundColor: '#0B1009',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startOverText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default NoMatchScreen; 