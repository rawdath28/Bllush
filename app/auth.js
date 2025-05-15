import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const handleAuth = () => {
    // In a real app, this would handle login/signup logic
    router.replace('/(tabs)/home');
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="chevron-left" size={24} color="#0B1009" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isLogin ? 'Log In' : 'Sign Up'}
            </Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.formSection}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#7A7A7A"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#7A7A7A"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#7A7A7A"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              
              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
            >
              <Text style={styles.authButtonText}>
                {isLogin ? 'Log In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.alternateAuthContainer}>
              <Text style={styles.alternateAuthText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.alternateAuthAction}>
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101009',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEFBF4',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEFBF4',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A18',
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FEFBF4',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FFC629',
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: '#FFC629',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B1009',
  },
  alternateAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  alternateAuthText: {
    fontSize: 16,
    color: '#FEFBF4',
    marginRight: 4,
  },
  alternateAuthAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC629',
  },
}); 