import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type ProfileScreenProps = {
  onBack: () => void;
  userId?: string;
};

const InterestTag = ({ label }: { label: string }) => (
  <View style={styles.interestTag}>
    <Text style={styles.interestTagText}>{label}</Text>
  </View>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, userId }) => {
  // In a real app, you would use userId to fetch the user's profile data from Firebase
  // For now, we'll just display the static data

  const interests = [
    'Piano', 'Voyage', 'Cuisine', 'Cinéma', 'Lecture',
    'Nature', 'Photographie', 'Art', 'Musique', 'Danse'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/images/img_mel.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>Melissa, 24</Text>
            <Text style={styles.userLocation}>Paris, France</Text>
          </View>

          {/* Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.bioTitle}>À propos</Text>
            <Text style={styles.bioText}>
              Je suis une personne créative et dynamique. J'aime voyager et découvrir de nouvelles cultures. Passionnée de photographie et de lecture.
            </Text>
          </View>

          {/* Interests */}
          <View style={styles.interestsContainer}>
            <Text style={styles.interestsTitle}>Centres d'intérêt</Text>
            <View style={styles.interestTags}>
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>Photographie</Text>
              </View>
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>Voyages</Text>
              </View>
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>Lecture</Text>
              </View>
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>Musique</Text>
              </View>
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>Art</Text>
              </View>
              <View style={styles.interestTag}>
                <Text style={styles.interestTagText}>Marketing digital</Text>
              </View>
            </View>
          </View>

          {/* Contact Button */}
          <TouchableOpacity style={styles.contactButton}>
            <Feather name="message-circle" size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Envoyer un message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F0E5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F1E5D5',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: '#FEFBF4',
    borderRadius: 12,
    margin: 16,
    padding: 24,
    marginBottom: 80, // Space for bottom nav
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B1009',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  userLocation: {
    fontSize: 16,
    color: 'rgba(11, 16, 9, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  bioContainer: {
    marginBottom: 24,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1009',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(11, 16, 9, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  interestsContainer: {
    marginBottom: 24,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1009',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FFEFC4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  interestTagText: {
    fontSize: 14,
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  contactButton: {
    backgroundColor: '#0B1009',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default ProfileScreen; 