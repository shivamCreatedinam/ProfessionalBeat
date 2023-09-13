/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useRef } from 'react';
import {
    Image,
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
import Global from '../../../common/env';
import axios from 'axios';

const LoginScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loader, serLoader] = React.useState(false);
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        setUserData(user);
        if (initializing) setInitializing(false);
    }

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const showSuccessToast = (msg) => {
        Toast.show({
            type: 'success',
            text1: 'Login Success',
            text2: msg,
        });
        setTimeout(() => {
            // setTimeout
            navigation.replace('OTPSubmitScreen', { mobileNumber: email, userType: 'Parent' });
        }, 2000);
    }

    const setUserData = async () => {

    }

    const showErrorToast = () => Toast.show({ type: 'error', text1: 'Invalid Mobile Number', });

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        console.log('validation3');
        if (email.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(email.match(/0{5,}/))) {
            console.log('validation4');
            loggedUsingMobileIn();
        }
        else {
            console.log('validation7');
            showErrorToast();
        }
    }

    const loggedUsingMobileIn = () => {
        serLoader(true);
        var authOptions = {
            method: 'POST',
            url: Global.API_BASE_URL + 'requesting_for_otp',
            data: JSON.stringify({ "mobile": email, 'user_type': 'Parent', refferal_id: '' }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        axios(authOptions)
            .then((response) => {
                if (response.status) {
                    serLoader(false);
                    console.log(response.data);
                    showSuccessToast(response.data.message + '\n your OTP is: ' + response.data.otp);
                } else {
                    serLoader(false);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                serLoader(false);
                alert(error)
            });
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

    const moveToLogin = () => {
        navigation.navigate('RegisterScreen');
    }

    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ padding: 20, flex: 1 }}>
            <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 100, top: 35 }}>
                <View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                    <Image style={{ height: 200, width: 200, resizeMode: 'cover', marginBottom: 20, borderRadius: 150 }} source={require('../../assets/logo.jpg')} />
                </View>
                <View>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Mobile</Text>
                    <TextInput autoCapitalize="none" autoCorrect={false} inputMode='tel' maxLength={10} placeholder='Enter 10 digit mobile number' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, fontWeight: 'bold' }} onChangeText={(e) => setEmail(e)} />
                </View>
                {/* <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Password</Text>
                    <TextInput placeholder='Enter user password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setPassword(e)} />
                    <Pressable onPress={() => setSecure(!secure)} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/icons_eye.png')} />
                    </Pressable>
                </View> */}
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ tintColor: 'green', width: 20, height: 20, marginRight: 5 }} source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }} />
                    <Text style={{ fontSize: 8 }} >by clicking the button you agree with the <Text style={{ fontWeight: 'bold', color: '#000' }}>Terms & Conditions and Privacy Policy</Text></Text>
                </View>
                <TouchableOpacity style={{
                    width: '100%',
                    marginTop: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 14,
                    backgroundColor: 'rgb(68,114,199)',
                    borderRadius: 5,
                    elevation: 6,
                }} onPress={validation}>
                    {loader ? <ActivityIndicator color={'#fff'} size={'small'} /> :
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>Send OTP</Text>}
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                </View>
                <View style={{ marginTop: 20, alignSelf: 'center', marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ alignItems: 'center', marginRight: 5 }} onPress={() => moveToLogin()}>
                        <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'rgb(254,92,54)', textTransform: 'uppercase' }}>Partner with us</Text>
                    </TouchableOpacity>
                    <Image style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: 'rgb(254,92,54)' }} source={require('../../assets/teach.png')} />
                </View>
                {/* <Pressable onPress={() => logOut()}>
                    <Text>Logout</Text>
                </Pressable>
                <View>
                    <Text>Welcome {user?.email}</Text>
                    <Text>Welcome {JSON.stringify(user?.uid)}</Text>
                </View> */}
            </View>
        </ScrollView>
    );
};


export default LoginScreen;