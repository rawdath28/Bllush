import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type ChatScreenProps = {
  onChatSelect: (chatId: string) => void;
};

// Mock data for chat list
const chatData = [
  {
    id: '1',
    name: 'Sophie',
    avatar: require('../assets/images/girl.png'),
    lastMessage: 'Ça te dit de se voir demain?',
    time: '18:30',
    unread: 2,
  },
  {
    id: '2',
    name: 'Thomas',
    avatar: require('../assets/images/boy.png'),
    lastMessage: 'J\'ai adoré notre conversation!',
    time: '12:45',
    unread: 0,
  },
  {
    id: '3',
    name: 'Léa',
    avatar: null, // Will use initials if no avatar
    lastMessage: 'Ok super, à bientôt!',
    time: 'Hier',
    unread: 0,
  },
];

// Chat item component
const ChatItem = ({ item, onPress }: { item: any, onPress: () => void }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <View style={styles.avatarContainer}>
      {item.avatar ? (
        <Image source={item.avatar} style={styles.avatar} />
      ) : (
        <View style={styles.initialAvatar}>
          <Text style={styles.initialText}>{item.name.charAt(0)}</Text>
        </View>
      )}
    </View>
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatTime}>{item.time}</Text>
      </View>
      <View style={styles.messageRow}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ChatScreen: React.FC<ChatScreenProps> = ({ onChatSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChatPress = (chatId: string) => {
    onChatSelect(chatId);
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="refresh-ccw" size={24} color="#0B1009" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#0B1009" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un match..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(11, 16, 9, 0.5)"
          />
        </View>
      </View>

      {/* Chat List */}
      <View style={styles.chatListContainer}>
        <FlatList
          data={chatData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem 
              item={item} 
              onPress={() => handleChatPress(item.id)} 
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="message-circle" size={50} color="#F1E5D5" />
              <Text style={styles.emptyStateText}>
                Pas encore de messages
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Commencez par valider des profils pour matcher
              </Text>
            </View>
          }
        />
      </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  chatListContainer: {
    flex: 1,
    backgroundColor: '#FEFBF4',
    margin: 16,
    borderRadius: 12,
    marginBottom: 80, // Space for bottom nav
    paddingTop: 16,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E5D5',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  initialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1009',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  chatTime: {
    fontSize: 12,
    color: 'rgba(11, 16, 9, 0.5)',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  unreadBadge: {
    backgroundColor: '#FFC629',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1009',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(11, 16, 9, 0.7)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
});

export default ChatScreen; 