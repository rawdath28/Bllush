import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ProfileScreen from './ProfileScreen';

type ResultsScreenProps = {
  onStartOver: () => void;
  matchId: string;
  validatedCount: number;
  matchedUserName: string;
  matchedUserProfileImage: string;
  currentUserProfileImage: string;
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  onStartOver, 
  matchId, 
  validatedCount, 
  matchedUserName,
  matchedUserProfileImage,
  currentUserProfileImage
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    compatibilityScore: number;
    compatibilityInsight: string;
  }>({
    compatibilityScore: 85,
    compatibilityInsight: "Vous partagez de nombreux intérêts en commun et vos personnalités semblent bien s'équilibrer. Vos réponses suggèrent une bonne communication et des valeurs partagées, ce qui est une excellente base pour une relation enrichissante.",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No need to fetch AI analysis anymore
    setLoading(false);
  }, [matchId]);

  if (showProfile) {
    // Extract the other user's ID from the match ID
    const otherUserId = matchId.split('_').find(id => id !== matchId);
    return <ProfileScreen onBack={() => setShowProfile(false)} userId={otherUserId} />;
  }

  // Determine badge image based on compatibility score
  const getBadgeImage = () => {
    if (!aiAnalysis || !aiAnalysis.compatibilityScore) {
      return require('../assets/images/perfect.png');
    }
    
    const score = aiAnalysis.compatibilityScore;
    if (score >= 80) {
      return require('../assets/images/perfect.png');
    } else if (score >= 60) {
      return require('../assets/images/logo.png'); // Using logo.png as it exists
    } else {
      return require('../assets/images/logo.png'); // Using logo.png as it exists
    }
  };

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
          <TouchableOpacity style={styles.iconButton} onPress={onStartOver}>
            <Feather name="refresh-ccw" size={24} color="#0B1009" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.matchContainer}>
        <View style={styles.matchHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onStartOver}>
            <Feather name="x" size={24} color="#0B1009" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="more-vertical" size={24} color="#0B1009" />
          </TouchableOpacity>
        </View>

        <View style={styles.matchContent}>
          <View style={styles.profileImages}>
            <Image
                source={currentUserProfileImage ? { uri: currentUserProfileImage } : require('../assets/images/quentin.png')}
              style={[styles.profileImage, { zIndex: 1, left: 20, top: 20, transform: [{ rotate: '-15deg' }] }]}
              resizeMode="cover"
            />
            <Image
                source={matchedUserProfileImage ? { uri: matchedUserProfileImage } : require('../assets/images/mel.png')}
              style={[styles.profileImage, { zIndex: 2, right: 20, top: 20, transform: [{ rotate: '15deg' }] }]}
              resizeMode="cover"
            />
            <View style={styles.matchBadge}>
              <Image 
                  source={getBadgeImage()}
                style={styles.matchIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.matchTextContainer}>
            <Text style={styles.matchTitle}>C'est un match !</Text>
            <Text style={styles.matchSubtitle}>
            Vous vous êtes trouvés au bon moment.
            </Text>

              {/* {loading ? (
                <ActivityIndicator size="large" color="#FFC629" style={styles.loader} />
              ) : (
                <View style={styles.analysisContainer}>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Compatibilité</Text>
                    <Text style={styles.scoreValue}>{aiAnalysis.compatibilityScore}%</Text>
                  </View>
                  
                  <View style={styles.insightContainer}>
                    <Text style={styles.insightLabel}>Ce que nous pensons de vous deux :</Text>
                    <Text style={styles.insightText}>{aiAnalysis.compatibilityInsight}</Text>
                  </View>
                </View>
              )} */}
            </View>
          </View>

          <TouchableOpacity style={styles.viewProfileButton} onPress={() => setShowProfile(true)}>
            <Text style={styles.viewProfileText}>Voir son profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
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
  matchContainer: {
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
  matchContent: {
    alignItems: 'center',
    gap: 42,
  },
  profileImages: {
    width: 313,
    height: 313,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 137.96,
    height: 190.6,
    borderRadius: 11,
    position: 'absolute',
  },
  matchBadge: {
    position: 'absolute',
    width: 80.23,
    height: 83.78,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchIcon: {
    top: 50,
    width: 62,
    height: 64,
  },
  matchTextContainer: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  matchTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1009',
    textAlign: 'center',
  },
  matchSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  pendingAnalysis: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 198, 41, 0.1)',
    borderRadius: 8,
    width: '100%',
  },
  pendingText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 14,
    color: '#0B1009',
    marginBottom: 8,
  },
  analysisContainer: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11, 16, 9, 0.1)',
  },
  scoreLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1009',
  },
  scoreValue: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFC629',
  },
  insightContainer: {
    width: '100%',
  },
  insightLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 14,
    fontWeight: '600',
    color: '#0B1009',
    marginBottom: 8,
  },
  insightText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.8)',
    lineHeight: 20,
  },
  viewProfileButton: {
    width: '100%',
    height: 59,
    backgroundColor: '#FFC629',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  viewProfileText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1009',
  },
});

export default ResultsScreen; 