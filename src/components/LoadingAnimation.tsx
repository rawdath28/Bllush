import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoadingAnimation = () => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}>
        <Ionicons name="heart" size={40} color="#FFC629" />
      </Animated.View>
      <Text style={styles.text}>Finding your perfect match...</Text>
      <Text style={styles.subText}>Analyzing compatibility</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginTop: 0,
    backgroundColor: '#FEFBF4',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0B1009',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default LoadingAnimation; 