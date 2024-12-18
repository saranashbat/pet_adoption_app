import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { db, auth } from '../../config';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../../extra/Header';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const myFontSize = (width + height) * 0.02;

const Applications1 = ({ navigation }) => {
  const userId = auth.currentUser?.uid;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications from Firebase
  const fetchApplications = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userDoc = doc(db, 'applications', userId);

    try {
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApplications(data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications when the component mounts
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchApplications();
    }, [userId])
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={{ fontSize: myFontSize * 1.5, fontWeight: 'bold' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Adopt a Pet Today!"} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {applications.length === 0 ? (
          <Text style={{ fontSize: myFontSize }}>You have no applications yet.</Text>
        ) : (
          applications.map((app, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: app.petPhoto }} style={styles.petImage} />
              <View style={styles.cardContent}>
                <Text style={styles.petName}>{app.petName}</Text>
                <Text style={styles.petCategory}>Category: {app.category}</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() =>
                    navigation.navigate('ApplicationDetails', {
                      application: app, 
                      userId, 
                    })
                  }
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Applications1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBDFF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, 
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Adjust to start content from the top
    alignItems: 'center',
    padding: width * 0.05,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  petName: {
    fontSize: myFontSize * 1.2,
    fontWeight: 'bold',
    color: '#333',
  },
  petCategory: {
    fontSize: myFontSize,
    color: '#666',
    marginVertical: 5,
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#4b6ad1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: myFontSize * 0.9,
    fontWeight: 'bold',
  },
});
