import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: string;
};

type ConversationScreenProps = {
  chatId: string;
  onBack: () => void;
};

// Mock conversation data
const mockUsers = {
  '1': {
    id: '1',
    name: 'Sophie',
    avatar: require('../assets/images/girl.png'),
  },
  '2': {
    id: '2',
    name: 'Thomas',
    avatar: require('../assets/images/boy.png'),
  },
  '3': {
    id: '3',
    name: 'Léa',
    avatar: null,
  },
};

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Salut ! Comment ça va aujourd\'hui ?', isSent: false, timestamp: '14:22' },
    { id: '2', text: 'Ça va bien, et toi ?', isSent: true, timestamp: '14:23' },
    { id: '3', text: 'Très bien ! J\'ai vu que tu aimais la photographie. Tu as des endroits préférés pour shooter à Paris ?', isSent: false, timestamp: '14:30' },
    { id: '4', text: 'J\'adore les quais de Seine et le jardin du Luxembourg ! Tu aimes photographier quoi généralement ?', isSent: true, timestamp: '14:35' },
    { id: '5', text: 'J\'aime beaucoup la photographie urbaine et les portraits. Ça te dit de se voir demain ?', isSent: false, timestamp: '18:30' },
  ],
  '2': [
    { id: '1', text: 'Hello ! J\'ai adoré tes réponses aux questions !', isSent: false, timestamp: '12:30' },
    { id: '2', text: 'Merci beaucoup ! Les tiennes étaient aussi très intéressantes :)', isSent: true, timestamp: '12:35' },
    { id: '3', text: 'J\'ai adoré notre conversation !', isSent: false, timestamp: '12:45' },
  ],
  '3': [
    { id: '1', text: 'Hey ! Ravi d\'avoir matché avec toi !', isSent: true, timestamp: '10:15' },
    { id: '2', text: 'Pareil pour moi ! Qu\'est-ce que tu fais ce weekend ?', isSent: false, timestamp: '10:20' },
    { id: '3', text: 'Je vais probablement faire une randonnée. Tu veux te joindre à moi ?', isSent: true, timestamp: '10:25' },
    { id: '4', text: 'Ok super, à bientôt!', isSent: false, timestamp: 'Hier' },
  ],
};

const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <View style={[
      styles.messageBubble,
      message.isSent ? styles.sentBubble : styles.receivedBubble,
    ]}>
      <Text style={[
        styles.messageText,
        message.isSent && styles.sentMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={[
        styles.messageTime,
        message.isSent && styles.sentMessageTime
      ]}>
        {message.timestamp}
      </Text>
    </View>
  );
};

const ConversationScreen: React.FC<ConversationScreenProps> = ({ chatId, onBack }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages[chatId] || []);
  const flatListRef = useRef<FlatList>(null);
  const user = mockUsers[chatId];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      text: inputMessage.trim(),
      isSent: true,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          {user?.avatar ? (
            <Image source={user.avatar} style={styles.avatar} />
          ) : (
            <View style={styles.initialAvatar}>
              <Text style={styles.initialText}>{user?.name.charAt(0) || '?'}</Text>
            </View>
          )}
          <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={24} color="#0B1009" />
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <View style={styles.messageListContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Commencez la conversation !
              </Text>
            </View>
          }
        />
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachButton}>
            <Feather name="paperclip" size={24} color="#0B1009" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Écrivez un message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            maxLength={500}
            placeholderTextColor="rgba(11, 16, 9, 0.5)"
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              inputMessage.trim() === '' && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={inputMessage.trim() === ''}
          >
            <Feather name="send" size={24} color={inputMessage.trim() === '' ? "#CCCCCC" : "#FFC629"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E5D5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  initialAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  initialText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageListContainer: {
    flex: 1,
    backgroundColor: '#FEFBF4',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  sentBubble: {
    backgroundColor: '#0B1009',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(11, 16, 9, 0.5)',
    alignSelf: 'flex-end',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  sentMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1E5D5',
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F0E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
    marginHorizontal: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(11, 16, 9, 0.5)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default ConversationScreen; 