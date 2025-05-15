import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import QuestionScreen from './src/screens/QuestionScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ValidationScreen from './src/screens/ValidationScreen';
import AnswerReviewScreen from './src/screens/AnswerReviewScreen';
import ValidationResponseScreen from './src/screens/ValidationResponseScreen';
import ChatScreen from './src/screens/ChatScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import ExplanationScreen from './src/screens/ExplanationScreen';
import BottomNavBar from './src/components/BottomNavBar';

export default function App() {
  const [showQuestions, setShowQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'chats' | 'profile'>('home');
  const [showValidation, setShowValidation] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [showValidationResponse, setShowValidationResponse] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  // Debug log the current state
  console.log('Current states:', {
    showQuestions,
    showExplanation,
    activeTab,
    showValidation
  });

  const handleStartExplanation = () => {
    console.log('Starting explanation screen');
    setShowExplanation(true);
  };

  const handleStartQuestions = () => {
    console.log('Starting questions');
    setShowExplanation(false);
    setShowQuestions(true);
  };

  const handleReturnHome = () => {
    setShowQuestions(false);
    setShowValidation(false);
    setShowAnswerReview(false);
    setShowValidationResponse(false);
    setShowExplanation(false);
    setActiveTab('home');
  };

  const handleTabPress = (tab: 'home' | 'chats' | 'profile') => {
    // If user is in any screen other than main screens, return to home first
    if (showQuestions || showValidation || showAnswerReview || showConversation || 
        showValidationResponse || showExplanation) {
      setShowQuestions(false);
      setShowValidation(false);
      setShowAnswerReview(false);
      setShowConversation(false);
      setShowValidationResponse(false);
      setShowExplanation(false);
      setSelectedChatId(null);
    }
    setActiveTab(tab);
  };

  const handleQuestionsCompleted = () => {
    setShowQuestions(false);
    setShowValidation(true);
  };

  const handleValidate = () => {
    setShowValidation(false);
    setShowValidationResponse(true);
  };

  const handleDiscoverResponses = () => {
    setShowValidation(false);
    setShowValidationResponse(true);
  };

  const handleValidationResponseComplete = () => {
    setShowValidationResponse(false);
    setShowAnswerReview(true);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowConversation(true);
  };

  const handleBackFromConversation = () => {
    setShowConversation(false);
    setSelectedChatId(null);
  };

  const handleStartValidationResponse = () => {
    setShowValidationResponse(true);
  };

  const renderContent = () => {
    if (showExplanation) {
      return <ExplanationScreen onStartQuestions={handleStartQuestions} onBack={handleReturnHome} />;
    }

    if (showQuestions) {
      return <QuestionScreen onBack={handleReturnHome} onComplete={handleQuestionsCompleted} />;
    }

    if (showValidation) {
      return <ValidationScreen 
        onBack={handleReturnHome} 
        onValidate={handleValidate}
        onDiscoverResponses={handleDiscoverResponses}
        userName="Alexandra" 
      />;
    }

    if (showValidationResponse) {
      return <ValidationResponseScreen onBack={handleReturnHome} />;
    }

    if (showAnswerReview) {
      return <AnswerReviewScreen onBack={handleReturnHome} />;
    }

    if (showConversation && selectedChatId) {
      return <ConversationScreen chatId={selectedChatId} onBack={handleBackFromConversation} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen 
          onStartQuestions={handleStartExplanation} 
          onStartValidationResponse={handleStartValidationResponse}
        />;
      case 'profile':
        return <ProfileScreen onBack={() => setActiveTab('home')} />;
      case 'chats':
        return <ChatScreen onChatSelect={handleChatSelect} />;
      default:
        return <HomeScreen 
          onStartQuestions={handleStartExplanation}
          onStartValidationResponse={handleStartValidationResponse}
        />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#F8F0E5" />
      <View style={styles.container}>
        {renderContent()}
        {!showQuestions && !showValidation && !showAnswerReview && !showConversation && 
         !showValidationResponse && !showExplanation && (
          <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
        )}
      </View>
    </SafeAreaProvider>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 