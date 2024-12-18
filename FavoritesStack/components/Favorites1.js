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

const Favorites1 = ({ navigation }) => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [userFavorites, setUserFavorites] = useState([])
  const userId = auth.currentUser?.uid

  const fetchUserFavorites = async () => {
    try {
      const userDoc = doc(db, 'favorites', userId);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        console.log("User favorites fetched:", userSnap.data());
        const favorites = userSnap.data().favorites || []; 
        setUserFavorites(favorites);
      } else {
        console.log("No favorites found for this user. Creating a new document.");
    
        await setDoc(userDoc, { favorites: [] });
        setUserFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  const fetchPets = async () => {
    try {
      const allPets = [];
      for (let favorite of userFavorites) {
        const petsCollection = collection(db, favorite.category); 
        const petSnap = await getDocs(petsCollection);
        const pet = petSnap.docs.find(doc => doc.id === favorite.id); 

        if (pet) {
          allPets.push({ ...pet.data(), id: pet.id, category: favorite.category });
        }
      }

      setPets(allPets);
    } catch (error) {
      console.error('Error fetching pets: ', error);
    }
  };

  const toggleFavorite = async (id, category) => {
    const userDoc = doc(db, 'favorites', userId);

    const isFavorite = userFavorites.some(fav => fav.id === id && fav.category === category);

    if (isFavorite) {
      //remove the pet from the user's favorites 
      await updateDoc(userDoc, {
        favorites: arrayRemove({ id, category }),
      });

      //refetch the user favorites
      const userSnap = await getDoc(userDoc)
      if (userSnap.exists()) {
        const favorites = userSnap.data().favorites || []
        setUserFavorites(favorites)
      } else {
        setUserFavorites([])
      }

    } else {
      //add the pet to the user's favorites
      await updateDoc(userDoc, {
        favorites: arrayUnion({ id, category }),
      });

      setUserFavorites(prevFavorites => [...prevFavorites, { id, category }])
    }
  };

  //use useFocusEffect to refetch user favorites when component mounts
  useFocusEffect(
    useCallback(() => {
      setLoading(true);  
      fetchUserFavorites()
        .then(() => fetchPets())
        .finally(() => setLoading(false)); 
    }, [])
  );

  //use effect to fetch pets after the user favorites are set
  useEffect(() => {
    if (userFavorites.length > 0) {
      fetchPets();
    } else {
      setLoading(false);
    }
  }, [userFavorites]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: myFontSize * 1.5, fontWeight: 'bold' }}>Loading favorites...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Your Favorite Pets!"} />

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.body}>
          <Text style={styles.pageTitle}>Your Favorites</Text>
          {pets.length === 0 ? (
            <Text>No Favorites Yet.</Text>
          ) : (
            pets.map((pet) => (
              <Card key={pet.id} style={styles.card}>
                <Card.Content>
                  <Image
                    source={{ uri: pet.photo_url}} 
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>{pet.name || 'Unnamed Pet'}</Text>
                  <Text style={styles.cardCategory}>Category: {pet.category || 'Unknown Category'}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(pet.id, pet.category)}
                    >
                      <Icon
                        name={userFavorites.some(fav => fav.id === pet.id && fav.category === pet.category) ? 'heart' : 'hearto'}
                        size={50}
                        color={userFavorites.some(fav => fav.id === pet.id && fav.category === pet.category) ? 'red' : '#ccc'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => navigation.navigate('Details', { category: pet.category, petId: pet.id })}
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
  );
};

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
  cardCategory: {
    fontSize: myFontSize * 0.8,
    textAlign: 'center',
    color: '#777',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    marginLeft: 10,
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
});

export default Favorites1;
