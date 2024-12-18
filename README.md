# Animal Shelter Pet Adoption Mobile Application

## Overview
The Pet Adoption Mobile Application is a simple and user-friendly platform designed to connect users with pets in need of homes. Users can browse available pets, favorite them, and "apply" for adoption through the app. The application supports basic CRUD operations.
## Features
- **User Accounts**: 
  - Create user accounts and log in.
- **Pet Listings**:
  - View a list of pets available for adoption, including their details and photos.
- **Favorite Pets**:
  - Mark pets as favorites for quick access.
- **Adoption Applications**:
  - Fill out and submit adoption applications directly through the app.
- **CRUD Operations**:
  - Supports Create, Read, Update, and Delete operations for the adoption applications. 

## Technology Stack
- **Frontend**: React Native
- **Database and Authentication**: Google Firebase

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd pet-adoption-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up Firebase:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Replace the placeholders in the project configuration file (config.js) with your Firebase project details (API key, project ID, etc.).
5. Start the development servers:
   ```bash
   npm start
   ```

## Usage
- Launch the app on your emulator or physical device.
- Sign up or log in to your account.
- Browse pets, favorite ones you like, and submit adoption applications.

## Future Enhancements
- Implement an admin panel for managing pets and users.
- Add push notifications to alert users about new pet listings.

## Contributing
If you would like to contribute to this project:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a pull request.
