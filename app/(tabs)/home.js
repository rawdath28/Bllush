import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  
  const goToQuestionScreen = () => {
    router.push('/question');
  };
  
  const goToValidationScreen = () => {
    router.push('/validation');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BuddyApp</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#FEFBF4" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Find your match</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={goToQuestionScreen}
          >
            <View style={styles.cardIcon}>
              <Feather name="help-circle" size={32} color="#0B1009" />
            </View>
            <Text style={styles.cardTitle}>Answer Questions</Text>
            <Text style={styles.cardDescription}>Tell us about yourself to find better matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={goToValidationScreen}
          >
            <View style={styles.cardIcon}>
              <Feather name="check-circle" size={32} color="#0B1009" />
            </View>
            <Text style={styles.cardTitle}>Validate Matches</Text>
            <Text style={styles.cardDescription}>Review potential matches and decide</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC629',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEFBF4',
    marginBottom: 20,
  },
  actionsContainer: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#FEFBF4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardIcon: {
    backgroundColor: '#FFC629',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1009',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#0B1009',
    opacity: 0.8,
  },
}); 