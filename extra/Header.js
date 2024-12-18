import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get window dimensions

const Header = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../images/logo.png')} // Adjust path as per your logo location
        style={styles.logo}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: width, // Full width of the screen
    height: height * 0.15, // Responsive height (adjust as needed)
    backgroundColor: '#dee8fc', // Header background color
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
    padding: 10,
  },
  logo: {
    width: width * 0.22, // Responsive logo width
    height: width * 0.22, // Make logo size proportional
    borderRadius: width * 0.06, // Circular logo (half the width for perfect circle)
    marginRight: 20, // Spacing between logo and title
  },
  title: {
    fontSize: width * 0.07, // Responsive font size based on screen width
    fontWeight: 'bold',
    color: '#333', // Title text color
  },
});

export default Header;
