import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type BottomNavBarProps = {
  activeTab: 'home' | 'chats' | 'profile';
  onTabPress: (tab: 'home' | 'chats' | 'profile') => void;
};

const BottomNavBar = ({ activeTab, onTabPress }: BottomNavBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'home' && styles.activeTab]}
        onPress={() => onTabPress('home')}
      >
        <Feather 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? '#FFC629' : '#0B1009'} 
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'home' && styles.activeTabLabel,
        ]}>
          Accueil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'chats' && styles.activeTab]}
        onPress={() => onTabPress('chats')}
      >
        <Feather 
          name="message-square" 
          size={24} 
          color={activeTab === 'chats' ? '#FFC629' : '#0B1009'} 
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'chats' && styles.activeTabLabel,
        ]}>
          Chats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'profile' && styles.activeTab]}
        onPress={() => onTabPress('profile')}
      >
        <Feather 
          name="user" 
          size={24} 
          color={activeTab === 'profile' ? '#FFC629' : '#0B1009'} 
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'profile' && styles.activeTabLabel,
        ]}>
          Profil
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#F1E5D5',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#FFC629',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0B1009',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif',
  },
  activeTabLabel: {
    color: '#FFC629',
    fontWeight: '700',
  },
});

export default BottomNavBar; 