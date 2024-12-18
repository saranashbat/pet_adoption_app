import { Button, StyleSheet, TouchableOpacity, Dimensions, Text, TextInput, View, SafeAreaView, Image, ScrollView } from 'react-native';
import React from 'react';
import { db } from '../../config';
import Header from '../../extra/Header';
import { Card } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
const myFontSize = (width + height) * 0.02;

const Home1 = ({ route, navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Adopt a Pet Today!"} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.body}>
          <Text style={styles.pageTitle}>View Available Pets</Text>

          {/* Card for Cats */}
          <Card style={styles.card} onPress={() => navigation.navigate('Category', { category: 'cats' })}>
            <Card.Content>
              <Text style={styles.cardTitle}>Cats</Text>
              <Image source={require('../../images/cat.jpg')} style={styles.cardImage} />
            </Card.Content>
          </Card>

          {/* Card for Dogs */}
          <Card style={styles.card} onPress={() => navigation.navigate('Category', { category: 'dogs' })}>
            <Card.Content>
              <Text style={styles.cardTitle}>Dogs</Text>
              <Image source={require('../../images/dog.jpg')} style={styles.cardImage} />
            </Card.Content>
          </Card>

          {/* Card for Other Animals */}
          <Card style={styles.card} onPress={() => navigation.navigate('Category', { category: 'other' })}>
            <Card.Content>
              <Text style={styles.cardTitle}>Other</Text>
              <Image source={require('../../images/other.jpg')} style={styles.cardImage} />
            </Card.Content>
          </Card>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DBDFF',
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
    fontSize: myFontSize*1.2,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    alignSelf: 'flex-start',
    marginLeft: '8%',
  },
  card: {
    width: width * 0.85, 
    marginBottom: height * 0.02,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: myFontSize * 1.1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  txtIn: {
    backgroundColor: 'snow',
    padding: myFontSize * 0.5,
    width: width * 0.85,
    marginTop: height * 0.02,
    borderRadius: 10,
  },
  touch: {
    width: width / 4,
    backgroundColor: 'lightblue',
    marginTop: height * 0.02,
    padding: myFontSize * 0.5,
    borderRadius: 10,
  },
});
