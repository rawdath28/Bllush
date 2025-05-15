import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function LoadingAnimation() {
  // Animation values for the dots
  const dot1Animation = useRef(new Animated.Value(0)).current;
  const dot2Animation = useRef(new Animated.Value(0)).current;
  const dot3Animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Create an animation sequence for the dots
    const animateDots = () => {
      // Reset animations
      dot1Animation.setValue(0);
      dot2Animation.setValue(0);
      dot3Animation.setValue(0);
      
      // Sequence of animations
      Animated.stagger(200, [
        Animated.timing(dot1Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Repeat the animation
        setTimeout(animateDots, 300);
      });
    };
    
    // Start the animation
    animateDots();
    
    // Cleanup function
    return () => {
      dot1Animation.stopAnimation();
      dot2Animation.stopAnimation();
      dot3Animation.stopAnimation();
    };
  }, [dot1Animation, dot2Animation, dot3Animation]);
  
  // Map the animation values to the desired output range
  const dot1Scale = dot1Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1],
  });
  
  const dot2Scale = dot2Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1],
  });
  
  const dot3Scale = dot3Animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1],
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.loadingText}>Finding Your Match</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[
            styles.dot, 
            { transform: [{ scale: dot1Scale }] }
          ]} />
          <Animated.View style={[
            styles.dot, 
            { transform: [{ scale: dot2Scale }] }
          ]} />
          <Animated.View style={[
            styles.dot, 
            { transform: [{ scale: dot3Scale }] }
          ]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFC629',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFC629',
    marginHorizontal: 6,
  },
}); 