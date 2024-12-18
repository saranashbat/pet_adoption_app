import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Dimensions, View, Image, ScrollView } from 'react-native';
import { db, auth } from '../../config'; 
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore'; 
import Icon from 'react-native-vector-icons/AntDesign'; 
import { useNavigation } from '@react-navigation/native'; 
import Header from '../../extra/Header';

const { width, height } = Dimensions.get('window')
const myFontSize = (width + height) * 0.02

const Details = ({ navigation, route }) => {
  const { petId, category } = route.params
  const [pet, setPet] = useState(null)
  const [userFavorites, setUserFavorites] = useState([])
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid

  //Fetch pet details and user favorites when the component loads or when user is logged in
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const petDocRef = doc(db, category, petId) 
        const petSnap = await getDoc(petDocRef)

        if (petSnap.exists()) {
          setPet({ id: petSnap.id, ...petSnap.data() })
          setLoading(false)
        } else {
          console.error('Pet not found!')
        }
      } catch (error) {
        console.error('Error fetching pet details: ', error)
      }
    };

    const fetchUserFavorites = async () => {
      if (userId) {
        const userDoc = doc(db, 'favorites', userId)
        const userSnap = await getDoc(userDoc)

        if (userSnap.exists()) {
          setUserFavorites(userSnap.data().favorites || [])
        } else {
          await setDoc(userDoc, { favorites: [] }) //Create the user document if it doesn't exist
          setUserFavorites([])
        }
      }
    };

    fetchPetDetails()
    fetchUserFavorites()
  }, [category, petId, userId])

  //handle toggling of the favorite status
  const toggleFavorite = async () => {

    const userDoc = doc(db, 'favorites', userId) //Reference to the user's document in the 'favorites' collection

    const favoritePet = { id: pet.id, category: category } //Creates a favorite object with id and category

    if (userFavorites.some(fav => fav.id === pet.id && fav.category === category)) {
      //If the pet is already in favorites, remove it
      await updateDoc(userDoc, {
        favorites: arrayRemove(favoritePet),
      });
      setUserFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== pet.id || fav.category !== category))
    } else {
      //If the pet is not in favorites, add it
      await updateDoc(userDoc, {
        favorites: arrayUnion(favoritePet),
      });
      setUserFavorites(prevFavorites => [...prevFavorites, favoritePet])
    }
  };

  if (loading || !pet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: myFontSize * 1.5, fontWeight: 'bold' }}>Loading pet details...</Text>
      </SafeAreaView>
    );
  }

  const arrivalDateString = pet.arrival_date ? new Date(pet.arrival_date.seconds * 1000).toLocaleDateString() : 'N/A'

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Adopt a Pet Today!"} />
    
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={{uri: pet.photo_url}} style={styles.cardImage} />
          
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{pet.name}</Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
              <Icon
                name={userFavorites.some(fav => fav.id === pet.id && fav.category === category) ? 'heart' : 'hearto'} 
                size={50}
                color={userFavorites.some(fav => fav.id === pet.id && fav.category === category) ? 'red' : '#ccc'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardText}>Gender: {pet.gender}</Text>
            <Text style={styles.cardText}>Age: {pet.age} years</Text>
            <Text style={styles.cardText}>Arrival Date: {arrivalDateString}</Text>
            
            <View style={styles.separator} />

            <Text style={styles.cardText}>{pet.description}</Text>
          </View>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('Form', {category: category, petId: petId, petName: pet.name, petPhoto: pet.photo_url})}
          >
            <Text style={styles.viewButtonText}>Fill Adoption Application Form</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: myFontSize * 1.7,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#333',
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  cardInfo: {
    marginBottom: 20,
    width: '100%',
  },
  cardText: {
    fontSize: myFontSize * 0.9,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
    color: '#555',
  },
  favoriteButton: {
    padding: 10,
  },
  viewButton: {
    backgroundColor: '#4b6ad1',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    marginTop: 20,
  },
  viewButtonText: {
    color: 'white',
    fontSize: myFontSize * 0.8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc', 
    marginVertical: 15,
  },
});
