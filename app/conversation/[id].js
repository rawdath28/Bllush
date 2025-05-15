import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  
  // For this demo, we're using hardcoded data
  // In a real app, you would fetch this from an API
  const matchedUser = {
    id: id,
    name: id === '1' ? 'Sophie' : id === '2' ? 'Emma' : 'Jack',
  };
  
  // Sample messages
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey, how are you doing today?',
      sender: 'them',
      timestamp: '10:45 AM',
    },
    {
      id: '2',
      text: 'I\'m doing great! Just got back from a hike. How about you?',
      sender: 'me',
      timestamp: '10:47 AM',
    },
    {
      id: '3',
      text: 'That sounds wonderful! I love hiking too. Where did you go?',
      sender: 'them',
      timestamp: '10:50 AM',
    },
    {
      id: '4',
      text: 'I went to Mount Rainier. The views were incredible!',
      sender: 'me',
      timestamp: '10:52 AM',
    },
    {
      id: '5',
      text: 'No way! I\'ve been wanting to go there. We should plan a trip sometime.',
      sender: 'them',
      timestamp: '10:55 AM',
    },
  ]);
  
  const sendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: String(messages.length + 1),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate a response after a short delay
    setTimeout(() => {
      const responseMessage = {
        id: String(messages.length + 2),
        text: 'That sounds great! 😊',
        sender: 'them',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };
  
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#0B1009" />
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{matchedUser.name.charAt(0)}</Text>
          </View>
          <Text style={styles.headerName}>{matchedUser.name}</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Feather name="more-vertical" size={24} color="#FEFBF4" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Feather name="plus" size={24} color="#0B1009" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#7A7A7A"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() === '' ? styles.sendButtonDisabled : {}
            ]}
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <Feather name="send" size={20} color={message.trim() === '' ? "#7A7A7A" : "#0B1009"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B1009',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEFBF4',
  },
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    marginBottom: 16,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: '#FFC629',
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#1A1A18',
    borderTopLeftRadius: 0,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#0B1009',
    marginBottom: 4,
  },
  messageTimestamp: {
    fontSize: 12,
    color: 'rgba(11, 16, 9, 0.6)',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A18',
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FEFBF4',
    paddingVertical: 10,
    paddingHorizontal: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
}); 