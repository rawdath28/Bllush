import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ValidationScreen() {
  const router = useRouter();
  
  // Sample potential match data
  const potentialMatches = [
    {
      id: '1',
      name: 'Sophie',
      age: 27,
      bio: 'Adventure seeker looking for someone to explore with',
      interests: ['Travel', 'Photography', 'Hiking'],
      compatibility: 85,
    },
    {
      id: '2',
      name: 'Emma',
      age: 25,
      bio: 'Book lover and coffee enthusiast',
      interests: ['Reading', 'Coffee', 'Movies'],
      compatibility: 72,
    },
    {
      id: '3',
      name: 'Julia',
      age: 26,
      bio: 'Art and design are my passion',
      interests: ['Art', 'Design', 'Museums'],
      compatibility: 68,
    },
  ];
  
  const handleValidateMatch = (matchId) => {
    // Navigate to the validation response screen
    router.push('/validation-response');
  };
  
  const renderMatchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.matchCard}
      onPress={() => handleValidateMatch(item.id)}
    >
      <View style={styles.matchHeader}>
        <View style={styles.matchAvatar}>
          <Text style={styles.matchInitial}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.name}, {item.age}</Text>
          <Text style={styles.matchBio} numberOfLines={2}>{item.bio}</Text>
        </View>
      </View>
      
      <View style={styles.matchInterests}>
        {item.interests.map((interest, index) => (
          <View key={index} style={styles.interestBadge}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.matchFooter}>
        <View style={styles.compatibilityContainer}>
          <Text style={styles.compatibilityLabel}>Compatibility</Text>
          <View style={styles.compatibilityBar}>
            <View 
              style={[
                styles.compatibilityFill,
                { width: `${item.compatibility}%` }
              ]} 
            />
          </View>
          <Text style={styles.compatibilityValue}>{item.compatibility}%</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.validateButton}
          onPress={() => handleValidateMatch(item.id)}
        >
          <Text style={styles.validateButtonText}>Validate</Text>
          <Feather name="arrow-right" size={18} color="#0B1009" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validate Matches</Text>
      </View>
      
      <Text style={styles.subtitle}>Review potential matches and see if your answers match!</Text>
      
      <FlatList
        data={potentialMatches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchList}
      />
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
  subtitle: {
    fontSize: 16,
    color: '#FEFBF4',
    opacity: 0.8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  matchList: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  matchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  matchInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B1009',
  },
  matchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1009',
    marginBottom: 4,
  },
  matchBio: {
    fontSize: 14,
    color: '#0B1009',
    opacity: 0.8,
  },
  matchInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  interestBadge: {
    backgroundColor: '#F1E5D5',
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 12,
    color: '#0B1009',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compatibilityContainer: {
    flex: 1,
  },
  compatibilityLabel: {
    fontSize: 14,
    color: '#0B1009',
    marginBottom: 4,
  },
  compatibilityBar: {
    height: 6,
    backgroundColor: '#F1E5D5',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  compatibilityFill: {
    height: '100%',
    backgroundColor: '#FFC629',
    borderRadius: 3,
  },
  compatibilityValue: {
    fontSize: 12,
    color: '#0B1009',
    opacity: 0.8,
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC629',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  validateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B1009',
    marginRight: 8,
  },
}); 