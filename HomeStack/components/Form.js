import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, View, Image } from 'react-native';
import { db, auth } from '../../config'; 
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'; 
import Header from '../../extra/Header';

const { width, height } = Dimensions.get('window')
const myFontSize = (width + height) * 0.02

const Form = ({ route, navigation }) => {
  const { category, petId, petName, petPhoto } = route.params
  const userId = auth.currentUser?.uid //Current logged-in user's ID

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = async () => {

    if (!firstName || !lastName || !address || !phone || !reason) {
      alert('Please fill in all the fields.')
      return
    }

    const userDoc = doc(db, 'applications', userId) //Reference to the user's document in 'applications' collection

    const newApplication = {
      category,
      petId,
      petName,
      petPhoto,
      firstName,
      lastName,
      address,
      phone,
      reason,
      submittedAt: new Date().toISOString(), //timestamp for when the application was submitted
    }

    try {
      const userSnap = await getDoc(userDoc)

      if (userSnap.exists()) {
        //If user document exists, update it
        await updateDoc(userDoc, {
          applications: arrayUnion(newApplication),
        })
      } else {
        //If user document doesn't exist, create it
        await setDoc(userDoc, { applications: [newApplication] })
      }

      alert('Application submitted successfully!');
      navigation.goBack() //go back to the previous screen

    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Something went wrong. Please try again later.')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Adoption Form" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Pet Details */}
        <View style={styles.petDetailsContainer}>
          <Image source={{ uri: petPhoto }} style={styles.petImage} />
          <View>
            <Text style={styles.petName}>{petName}</Text>
            <Text style={styles.petCategory}>Category: {category}</Text>
          </View>
        </View>

        {/* Form Title */}
        <Text style={styles.pageTitle}>Adopt Your Pet</Text>

        {/* Form Fields */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Reason for Adoption</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why do you want to adopt this pet?"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.05,
  },
  petDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  petName: {
    fontSize: myFontSize * 1.2,
    fontWeight: 'bold',
  },
  petCategory: {
    fontSize: myFontSize * 0.9,
    color: '#666',
  },
  pageTitle: {
    fontSize: myFontSize * 1.5,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  label: {
    fontSize: myFontSize * 1,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: myFontSize * 0.9,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: myFontSize * 1.1,
    fontWeight: 'bold',
    color: '#fff',
  },
});
