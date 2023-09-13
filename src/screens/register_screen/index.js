/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { Image } from 'react-native-elements';
import Global from '../../../common/env';
import axios from 'axios';

const RegisterScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loader, serLoader] = React.useState(false);
    const [userName, setNameUser] = React.useState();
    const [userMobile, setMobileUser] = React.useState();
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const showSuccessToast = (msg) => {
        Toast.show({
            type: 'success',
            text1: 'Send OTP Successfully',
            text2: msg,
        });
        setTimeout(() => {
            serLoader(false);
            navigation.replace('OTPSubmitScreen', { mobileNumber: userMobile, userType: 'Tutor' });
        }, 2000);
    }

    const loggedUsingMobileIn = () => {
        serLoader(true);
        var authOptions = {
            method: 'post',
            url: Global.API_BASE_URL + 'requesting_for_otp',
            data: JSON.stringify({ "mobile": userMobile, 'user_type': 'Tutor', 'refferal_id': '' }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        console.log('loggedUsingMobileIn:', authOptions);
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('check:', response.data);
                    serLoader(false);
                    // storeData(response.data?.driver);
                    showSuccessToast(response.data.message + '\n your OTP is: ' + response.data.otp);
                } else {
                    serLoader(false);
                    console.log(response.data.message);
                    // showErrorToast(response.data.message);
                }
            })
            .catch((error) => {
                alert(error)
            });
    }

    const showErrorToast = (msg) => {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong!',
            text2: msg
        });
    }

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
        const name_pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
        var pattern = new RegExp(/^[0-9\b]+$/);
        if (pattern.test(userMobile) === true) {
            loggedUsingMobileIn();
        } else {
            showErrorToast('Invalid Mobile, Please enter valid Mobile Number!');
        }
    }

    const loggedIn = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                showSuccessToast();
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found') {
                    setErrors('There is no user record corresponding to this identifier. The user may have been deleted.')
                }
            });
    }

    const registerUser = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                showSuccessToast();
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrors('That email address is already in use!');
                }
                if (error.code === 'auth/invalid-email') {
                    setErrors('That email address is invalid!');
                }
            });
    };

    const logOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }

    const moveToRegister = () => {
        navigation.navigate('LoginScreen');
    }

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <ScrollView style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 90, top: 35 }}>
                <View style={{ padding: 20 }}>
                    <Image style={{ height: 120, width: 120, resizeMode: 'cover', alignSelf: 'center', alignItems: 'center', marginLeft: 75, marginBottom: 20, borderRadius: 150 }} source={require('../../assets/logo.jpg')} />
                </View>
                <View style={{ marginTop: 125 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Mobile</Text>
                    <TextInput autoCapitalize="none" keyboardType="numeric" autoCorrect={false} maxLength={10} placeholder='Enter user Mobile' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setMobileUser(e)} />
                </View>
                <View
                    style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        style={{ tintColor: 'green', width: 20, height: 20, marginRight: 5 }}
                        source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }}
                    />
                    <Text
                        style={{ fontSize: 8 }} >by clicking the button you agree with the <Text style={{ fontWeight: 'bold' }}>Terms & Conditions and Privacy Policy</Text></Text>
                </View>
                <TouchableOpacity
                    style={{
                        width: '100%',
                        marginTop: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 14,
                        backgroundColor: 'rgb(68,114,199)',
                        borderRadius: 5,
                        elevation: 6,
                    }}
                    onPress={validation}>
                    {loader ? <ActivityIndicator color={'#fff'} size={'small'} /> :
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>Register</Text>}
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>Or</Text>
                <TouchableOpacity
                    style={{
                        width: '100%',
                        marginTop: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 14,
                        backgroundColor: 'rgb(68,114,199)',
                        borderRadius: 5,
                        elevation: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('DriverLoginScreen')}>
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        marginLeft: 120,
                    }}>Login</Text>
                    <Image style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: 'white', marginLeft: 10 }} source={require('../../assets/teach.png')} />
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                </View>
            </ScrollView>
        </View>
    );

};


export default RegisterScreen;