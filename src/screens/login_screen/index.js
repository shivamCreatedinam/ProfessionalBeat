/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useRef, useMemo, useState } from 'react';
import {
    Image,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Dimensions,
    StatusBar,
    Alert
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import RadioGroup from 'react-native-radio-buttons-group';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { useNavigation } from "@react-navigation/native";
import { OtplessModule } from 'otpless-react-native';
import Global from '../../../common/env';
import axios from 'axios';

const LoginScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(false);
    const [loader, serLoader] = React.useState(false);
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [refrelID, setRefrelID] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [LoginType, setLoginType] = React.useState('');
    const [errors, setErrors] = React.useState('');
    const [selectedId, setSelectedId] = React.useState();
    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Parents',
            value: 'Parent'
        },
        {
            id: '2',
            label: 'Tutor',
            value: 'Tutor'
        }
    ]), []);

    // OTP LESS
    const module = new OtplessModule();
    const extra = {
        method: 'get',
        params: {
            cid: 'M6GAHIABAZU42JVAOV11QIP7ST7CPZ8E',
        },
    };

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
            text1: msg,
            text2: msg,
        });
        setTimeout(() => {
            // setTimeout
            navigation.replace('OTPSubmitScreen', { mobileNumber: email, userType: LoginType, refrelID: refrelID });
        }, 2000);
    }

    const setUserData = async () => {

    }

    const openPrivacyPolicy = async () => {
        try {
            const oldStyle = StatusBar.pushStackEntry({ barStyle: 'dark-content', animated: false });
            await InAppBrowser.open(Global.PRIVACY_POLICY)
            StatusBar.popStackEntry(oldStyle);
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    const showErrorToast = () => Toast.show({ type: 'error', text1: 'Please accept terms & conditions', });

    const showErrorMobileToast = () => Toast.show({ type: 'error', text1: 'Please Enter Valid Mobile Number', });

    const showErrorIdentityToast = () => Toast.show({ type: 'error', text1: 'Please Select your identity', });

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        console.log('validation3', secure + '' + selectedId);

        if (secure === false) {
            showErrorToast();
        } else {
            if (selectedId === undefined) {
                showErrorIdentityToast();
            } else {
                if (email.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(email.match(/0{5,}/))) {
                    console.log('validation4');
                    loggedUsingMobileIn();
                }
                else {
                    console.log('validation7');
                    showErrorMobileToast();
                }
            }
        }
    }

    const loggedUsingMobileIn = () => {
        serLoader(true);
        var authOptions = {
            method: 'POST',
            url: Global.API_BASE_URL + 'requesting_for_otp',
            data: JSON.stringify({ "mobile": email, 'user_type': LoginType, 'refferal_id': refrelID }), // refrelID
            headers: {
                'Content-Type': 'application/json',
            },
            json: true
        };
        axios(authOptions)
            .then((response) => {
                console.log('loggedUsingMobileIn', JSON.stringify(response));
                if (response?.data?.status) {
                    serLoader(false);
                    console.log(response.data);
                    showSuccessToast(response.data.message);
                } else {
                    serLoader(false);
                    Toast.show({
                        type: 'error',
                        text1: response.data.message,
                        text2: response.data.message + ' Please register this app!',
                    });
                    console.log(response.data);
                }
            })
            .catch((error) => {
                serLoader(false);
                Alert.alert(error)
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

    const setSelectedxId = (xx) => {
        console.log('---->> ', LoginType);
        if (Number(xx) === 1) {
            console.log('Parent')
            setSelectedId(xx)
            setLoginType('Parent');
        } else if (Number(xx) === 2) {
            console.log('Tutor')
            setSelectedId(xx)
            setLoginType('Tutor');
        }
    }

    const moveToLogin = () => {
        navigation.navigate('RegisterScreen');
    }

    const ClickForOTPLess = async () => {
        module.showLoginPage((data) => {
            let message = '';
            if (data.data === null || data.data === undefined) {
                message = data.errorMessage;
            } else {
                message = data.data.token;
                // todo here
                module.onSignInCompleted();
            }
            console.warn('ClickForOTPLess', message);
        }, extra);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10 }}
            behavior='height'
            enabled
            keyboardVerticalOffset={10}>
            <ScrollView>
                <View style={{ elevation: 10, height: Dimensions.get('screen').height - 70, margin: 10, padding: 20, backgroundColor: '#ffffff', borderRadius: 10, marginBottom: 50, top: 35, }}>
                    <View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                        <Image style={{ height: 200, width: 200, resizeMode: 'cover', marginBottom: 10, borderRadius: 150 }} source={require('../../assets/notification_logo.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            Welcome to TuitionBot
                        </Text>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: '#000', fontSize: 12 }}>Select your identity</Text>
                        <RadioGroup
                            containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                            radioButtons={radioButtons}
                            onPress={(ox) => setSelectedxId(ox)}
                            selectedId={selectedId}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#ffffff', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Mobile</Text>
                        <TextInput autoCapitalize="none" autoCorrect={false} inputMode='tel' maxLength={10} placeholder='Enter 10 digit mobile number' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, fontWeight: 'bold' }} onChangeText={(e) => setEmail(e)} />
                    </View>
                    {LoginType === 'Tutor' ? <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#ffffff', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Refferal Code</Text>
                        <TextInput autoCapitalize='characters' autoCorrect={false} inputMode='text' keyboardType='ascii-capable' maxLength={8} placeholder='Enter 8 digit refferal code (optional)' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, fontWeight: 'bold' }} onChangeText={(e) => setRefrelID(e)} />
                    </View> : null}
                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setSecure(!secure)}>
                            <Image style={{ tintColor: secure === false ? 'grey' : 'green', width: 20, height: 20, marginRight: 5 }} source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, letterSpacing: 1.7 }} numberOfLines={2} >By clicking the button you agree with the <TouchableOpacity onPress={() => openPrivacyPolicy()}><Text style={{ fontWeight: 'bold', color: '#000', fontSize: 10 }}>Terms & Conditions and Privacy Policy</Text></TouchableOpacity></Text>
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
                    <Text style={{ textAlign: 'center', padding: 20 }}>Or</Text>
                    <TouchableOpacity onPress={() => ClickForOTPLess()} style={{ alignItems: 'center', padding: 10, backgroundColor: '#000', paddingVertical: 15, borderRadius: 5, elevation: 5 }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}>OTP LESS LOGIN</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


export default LoginScreen;