import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, Dimensions, View, Image } from 'react-native';
import { db, auth } from '../../config'; 
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import Header from '../../extra/Header';
import { Card } from 'react-native-paper'; 
import { useFocusEffect } from '@react-navigation/native'; 

const { width, height } = Dimensions.get('window')
const myFontSize = (width + height) * 0.02

const Category = ({ route, navigation }) => {
  const { category } = route.params
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [userFavorites, setUserFavorites] = useState([])
  const userId = auth.currentUser?.uid

  //Fetches pets from the database based on the category
  const fetchPets = async () => {
    try {
      const petsCollection = collection(db, category)
      const querySnapshot = await getDocs(petsCollection)
      const petsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(petsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching pets: ', error)
    }
  };

  //Fetch the user's favorites from Firestore
  const fetchUserFavorites = async () => {
    if (userId) {
      const userDoc = doc(db, 'favorites', userId) //Use 'favorites' collection, and each document is user-specific
      const userSnap = await getDoc(userDoc)

      if (userSnap.exists()) {
        //User document exists, get the favorites if available
        setUserFavorites(userSnap.data().favorites || []) 
      } else {
        //If the user document doesn't exist, create it with an empty favorites array
        await setDoc(userDoc, { favorites: [] })
        setUserFavorites([])
      }
    }
  };

  //handle toggling of the favorite status
  const toggleFavorite = async (id) => {

    const userDoc = doc(db, 'favorites', userId) //Reference to the user's document in the 'favorites' collection
    const petData = { id, category } //Create an object with both pet ID and category

    if (userFavorites.some(fav => fav.id === id && fav.category === category)) {
      //Remove the pet from the user's favorites
      await updateDoc(userDoc, {
        favorites: arrayRemove(petData), //Remove the pet object from the favorites array
      });
      setUserFavorites(prevFavorites => prevFavorites.filter(fav => !(fav.id === id && fav.category === category)))
    } else {
      //Add the pet to the user's favorites
      await updateDoc(userDoc, {
        favorites: arrayUnion(petData), //Add the pet object to the favorites array
      });
      setUserFavorites(prevFavorites => [...prevFavorites, petData])
    }
  };

  //useFocusEffect to refetch user favorites whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserFavorites()
      fetchPets()
    }, [])
  )

  useEffect(() => {
    fetchPets()
    fetchUserFavorites()
  }, [category, userId])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: myFontSize * 1.5, fontWeight: 'bold' }}>Loading pets...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Adopt a Pet Today!"} />

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.body}>
          <Text style={styles.pageTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
          {pets.length === 0 ? (
            <Text>No pets available in this category.</Text>
          ) : (
            pets.map((pet) => (
              <Card key={pet.id} style={styles.card}>
                <Card.Content>
                  <Image source={{ uri: pet.photo_url }} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{pet.name}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(pet.id)} //Toggle the favorite status
                    >
                      <Icon
                        name={userFavorites.some(fav => fav.id === pet.id && fav.category === category) ? 'heart' : 'hearto'} //Filled heart if favorited
                        size={50}
                        color={userFavorites.some(fav => fav.id === pet.id && fav.category === category) ? 'red' : '#ccc'} //Red if favorited
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => navigation.navigate('Details', { category: category, petId: pet.id })}
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBDFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  body: {
    width: '100%',
    alignItems: 'center',
  },
  pageTitle: {
    alignSelf: 'flex-start',
    fontSize: myFontSize * 1.5,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
  },
  card: {
    width: width * 0.85,
    marginBottom: height * 0.02,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: myFontSize * 1.2,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  favoriteButton: {
    padding: 5,
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#4b6ad1',
    padding: 10,
    borderRadius: 5,
  },
  viewButtonText: {
    color: 'white',
    fontSize: myFontSize * 0.8,
    fontWeight: 'bold',
  },
})
