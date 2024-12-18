import { StyleSheet, Dimensions, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../../config'
import { signInWithEmailAndPassword } from "firebase/auth"

const { width, height } = Dimensions.get('window')
const myFontSize = (width + height) * 0.02

const Login = ({ navigation, route }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = () => {
        if (!email || !password) {
            setMessage('All fields are required!')
            return
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log('Logged in')
                
            })
            .catch((error) => {
                console.error(error.message)
                setMessage('Login failed! Please check your email and password.')
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Image style={styles.img} source={require("../images/logo.png")}/>
            </View>

            <View>
                <Text style={styles.title}>Adopt a Pet Today!</Text>
            </View>

            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                <TextInput
                    placeholder='Email'
                    style={styles.txtIn}
                    onChangeText={(txt) => setEmail(txt)}
                    value={email}
                />
                <TextInput
                    placeholder='Password'
                    secureTextEntry
                    style={styles.txtIn}
                    onChangeText={(txt) => setPassword(txt)}
                    value={password}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                {message ? <Text style={{ fontSize: 18, color: 'red', fontWeight: 'bold'}}>{message}</Text> : ''}
            </View>

            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={{ fontSize: 22, textAlign: 'center' }}>Login</Text>
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>Don't Have an Account? Register Now!</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default Login

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
    loginBtn: {
        width: width / 4,
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
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
    
})
