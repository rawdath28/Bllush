import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Dummy data for chat conversations
const chatData = [
  {
    id: '1',
    name: 'Sophie',
    lastMessage: 'Hey, how are you doing today?',
    time: '10:45 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Emma',
    lastMessage: 'That sounds amazing! When are you free?',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Jack',
    lastMessage: 'I\'ll send you the details later',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '4',
    name: 'Olivia',
    lastMessage: 'Did you see the new movie we talked about?',
    time: 'Monday',
    unread: 0,
  },
];

const ChatItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {/* Avatar placeholder */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        {item.unread > 0 && <View style={styles.unreadBadge} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const router = useRouter();
  
  const handleChatPress = (chatId) => {
    router.push(`/conversation/${chatId}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#FEFBF4" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem 
            item={item} 
            onPress={() => handleChatPress(item.id)} 
          />
        )}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEFBF4',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1009',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF4D4F',
    borderWidth: 2,
    borderColor: '#101009',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FEFBF4',
  },
  chatTime: {
    fontSize: 12,
    color: '#FEFBF4',
    opacity: 0.6,
  },
  chatMessage: {
    fontSize: 14,
    color: '#FEFBF4',
    opacity: 0.8,
  },
}); 