import { StyleSheet, Dimensions, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image} from 'react-native';
import React, { useState } from 'react';
import { auth } from '../../config';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const { width, height } = Dimensions.get('window');
const myFontSize = (width + height) * 0.02;

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    if (!email || !password || !name) {
      setMessage('All fields are required!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        //Update user profile with their name
        return updateProfile(user, {
          displayName: name,
        });
      })
      .then(() => {
        console.log('User registered successfully');
        setMessage('Registration Successful!');
        
      })
      .catch((error) => {
        console.error('Error registering:', error.message);

        // Handle specific Firebase errors
        if (error.code === 'auth/invalid-email') {
          setMessage('Invalid email format.');
        } else if (error.code === 'auth/weak-password') {
          setMessage('Password must be at least 6 characters.');
        } else {
          setMessage(`Error: ${error.message}`);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image style={styles.img} source={require("../images/logo.png")}/>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 20}}>
        <TextInput
          placeholder="Name"
          style={styles.txtIn}
          value={name}
          onChangeText={(txt) => setName(txt)}
        />

        <TextInput
          placeholder="Email"
          style={styles.txtIn}
          value={email}
          onChangeText={(txt) => setEmail(txt)}
        />

        <TextInput
          placeholder="Password"
          style={styles.txtIn}
          secureTextEntry
          value={password}
          onChangeText={(txt) => setPassword(txt)}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
          {message ? <Text style={{ fontSize: 18, color: 'red', fontWeight: 'bold'}}>{message}</Text> : ''}
      </View>

      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={{ fontSize: 22, textAlign: 'center' }}>Register</Text>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DBDFF',
  },
  txtIn: {
    backgroundColor: 'snow',
    padding: myFontSize * 0.5,
    width: width * 0.75,
    marginTop: height * 0.02,
    borderRadius: 10,
    fontSize: 16,
  },
  registerBtn: {
    width: width / 3,
    backgroundColor: '#FFD7C4',
    marginTop: height * 0.02,
    padding: myFontSize * 0.5,
    borderRadius: 10,
  },
  img: {
    width: width , 
    height: height * 0.25, 
    resizeMode: 'contain', 
    marginBottom: 20, 
  }
});
