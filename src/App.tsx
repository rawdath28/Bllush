import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExplanationScreen from './screens/ExplanationScreen';
import QuestionScreen from './screens/QuestionScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';

type ScreenType = 'home' | 'explanation' | 'questions';
type TabType = 'home' | 'profile' | 'chats';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Debug the navigation flow
  useEffect(() => {
    console.log('Current screen changed to:', currentScreen);
  }, [currentScreen]);

  const handleStartExplanation = () => {
    console.log('handleStartExplanation called');
    setCurrentScreen('explanation');
  };

  const handleStartQuestions = () => {
    console.log('handleStartQuestions called');
    setCurrentScreen('questions');
  };

  const handleReturnHome = () => {
    console.log('handleReturnHome called');
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const handleTabPress = (tab: TabType) => {
    console.log('handleTabPress called with tab:', tab);
    // If user is not in home screen, return to home screen first
    if (currentScreen !== 'home') {
      setCurrentScreen('home');
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'questions':
        return <QuestionScreen onBack={handleReturnHome} />;
      case 'explanation':
        return <ExplanationScreen onStartQuestions={handleStartQuestions} onBack={handleReturnHome} />;
      case 'home':
        switch (activeTab) {
          case 'home':
            return <HomeScreen onStartQuestions={handleStartExplanation} />;
          case 'profile':
            return <ProfileScreen onBack={() => setActiveTab('home')} />;
          case 'chats':
            // A placeholder for now - you can implement a ChatsScreen later
            return <HomeScreen onStartQuestions={handleStartExplanation} />;
          default:
            return <HomeScreen onStartQuestions={handleStartExplanation} />;
        }
      default:
        return <HomeScreen onStartQuestions={handleStartExplanation} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderContent()}
        {currentScreen === 'home' && (
          <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
        )}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
