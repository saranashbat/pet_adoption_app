import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import Header from '../../extra/Header';

const Profile1 = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const auth = getAuth()

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      setDisplayName(user.displayName || '')
      setEmail(user.email);
      setNewDisplayName(user.displayName || '')
    }
  }, [])

  const handleUpdateName = async () => {
    if (loading) return

    const user = auth.currentUser
    if (user) {
      setLoading(true)

      try {
        //update display name in Firebase
        await updateProfile(user, { displayName: newDisplayName })
        setDisplayName(newDisplayName)
        Alert.alert('Name updated successfully');

      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={"Adopt a Pet Today!"} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Display Name (Non-editable) */}
        <Text style={{fontSize:30, fontWeight:'bold', marginBottom: 20}}>Welcome, {displayName}!</Text>

        {/* Editable Display Name */}
        <Text style={styles.label}>Update Name</Text>
        <TextInput
          style={styles.input}
          value={newDisplayName}
          onChangeText={setNewDisplayName}
          placeholder="Enter new display name"
        />

        {/* Update Name Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdateName}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Name'}</Text>
        </TouchableOpacity>

        {/* Email (Non-editable) */}
        <Text style={styles.label}>Email</Text>
        <Text style={styles.text}>{email}</Text>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBDFF',
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 10,  
    paddingVertical: 5,  
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 20
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc', 
  },
  logoutButton: {
    backgroundColor: '#f44336', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile1;
