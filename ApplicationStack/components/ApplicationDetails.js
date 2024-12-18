import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, View, Image } from 'react-native';
import { db } from '../../config'; 
import { doc, updateDoc, arrayRemove, getDoc, arrayUnion } from 'firebase/firestore'; 
import Header from '../../extra/Header';

const { width, height } = Dimensions.get('window');
const myFontSize = (width + height) * 0.02;

const ApplicationDetails = ({ route, navigation }) => {
  const { application, userId } = route.params;

  const { category, petId, petName, petPhoto, submittedAt } = application;

  //editable fields with initial values from the application
  const [firstName, setFirstName] = useState(application.firstName);
  const [lastName, setLastName] = useState(application.lastName);
  const [address, setAddress] = useState(application.address);
  const [phone, setPhone] = useState(application.phone);
  const [reason, setReason] = useState(application.reason);

  const handleUpdate = async () => {
    try {
      const userDocRef = doc(db, 'applications', userId)

      //remove the old application
      await updateDoc(userDocRef, {
        applications: arrayRemove(application),
      });

      //add the updated application
      const updatedApplication = {
        category,
        petId,
        petName,
        petPhoto,
        firstName,
        lastName,
        address,
        phone,
        reason,
        submittedAt,
      };

      await updateDoc(userDocRef, {
        applications: arrayUnion(updatedApplication),
      });

      alert('Application updated successfully!')
      navigation.goBack()
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application.')
    }
  };

  const handleDelete = async () => {
    try {
      //reference to the user's document
      const userDocRef = doc(db, 'applications', userId);

      const userDoc = await getDoc(userDocRef);
      const applications = userDoc.data()?.applications;

      //check if the application with the given petId exists
      const applicationToDelete = applications?.find(app => app.petId === petId);

      if (!applicationToDelete) {
        console.log('No matching application found for the given petId.');
        alert('Application with this petId does not exist.');
        return;
      }

      //remove the application from the 'applications' array by matching the petId
      await updateDoc(userDocRef, {
        applications: arrayRemove(applicationToDelete),
      });

      console.log('Application deleted successfully!')
      alert('Application deleted successfully!')
      navigation.goBack()
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Failed to delete application.')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Application Details" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Pet Details */}
        <View style={styles.petDetailsContainer}>
          <Image source={{ uri: petPhoto }} style={styles.petImage} />
          <View>
            <Text style={styles.petName}>{petName}</Text>
            <Text style={styles.petCategory}>Category: {category}</Text>
          </View>
        </View>

        {/* Form Fields */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Reason for Adoption</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Buttons */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Application</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplicationDetails;

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
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: myFontSize * 1.1,
    fontWeight: 'bold',
    color: '#fff',
  },
});
