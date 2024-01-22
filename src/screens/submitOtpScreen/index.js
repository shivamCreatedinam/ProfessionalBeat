/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform
} from 'react-native';
import OTPInput from 'react-native-otp';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';

import axios from 'axios';

const OTPSubmitScreen = () => {

    const navigation = useNavigation();
    const routes = useRoute();
    let otpInput = useRef(null);
    const isPlatformIOS = Platform.OS == 'ios';
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loader, serLoader] = React.useState(false);
    const [OTP, setUserOTP] = React.useState(null);
    const [email, setEmail] = React.useState(routes?.params?.mobileNumber); // userType
    const [userType, setUserType] = React.useState(routes?.params?.userType); // userType
    const [refrelID, setRefrelID] = React.useState(routes?.params?.refrelID);
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');

    // Handle user state changes
    function onAuthStateChanged(user) {
        // setUser(user);
        setUserData(user);
        if (initializing) setInitializing(false);
    }

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return () => subscriber; // unsubscribe on unmount
    }, []);


    // using methods
    React.useEffect(() => {
        if (!isPlatformIOS) {
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(otpHandler))
                .catch(p => console.log("err", p));
        }
        return () => RNOtpVerify.removeListener();
    }, []);

    const otpHandler = (message) => {
        console.log('SMS :: ', message)
        let detectedCode = getCodeFromText(message)
        setUserOTP(detectedCode);
    }

    function getCodeFromText(msg) {
        var numb = msg.match(/\d/g);
        var stringNumber = numb.slice(0, 4).toString();
        return stringNumber.replace(/,/g, '');
    }

    React.useEffect(() => {
        console.log('addEventListener', JSON.stringify(routes?.params?.mobileNumber));
        console.log('addEventListener', JSON.stringify(routes?.params?.userType));// refrelID
        console.log('addEventListener', JSON.stringify(routes?.params?.refrelID));
        return () => {
            console.log('addEventListener', JSON.stringify(routes));
        };
    }, [false]);

    const showSuccessToast = (value) => {
        Toast.show({
            type: 'success',
            text1: 'OTP Submit Successfully',
            text2: value
        });
        storeData(value);
        // navigation.navigate('HomeBottomNavigation');
    }

    const showOTPSendToast = (value) => {
        Toast.show({
            type: 'success',
            text1: value,
            text2: value
        });
    }

    const showSuccessErrorToast = (value) => {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: value
        });
        storeData(value);
        // navigation.navigate('HomeBottomNavigation');
    }

    const clearText = () => {
        otpInput.current.clear();
    }

    const setText = () => {
        otpInput.current.setValue("1234");
    }

    const setUserData = async () => {

    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@autoUserType', value?.user?.user_type);
            await AsyncStorage.setItem('@autoUserGroup', jsonValue);
            console.log('storeData', value?.user?.user_type)
            if (value?.user?.user_type === 'Tutor') {
                navigation.replace('HomeBottomNavigation');
            } else {
                if (value?.user?.is_update === 1) {
                    navigation.replace('UserBottomNavigation');
                } else if (value?.user?.is_update === 0) {
                    navigation.replace('UserEditProfileScreen', { screenType: 'NewUser' });
                }
            }
        } catch (e) {
            // saving error
        }
    };

    const showErrorToast = () => Toast.show({ type: 'error', text1: 'Invalid Mobile Number', });

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        console.log('validation3', OTP);
        if (OTP.length === 4) {
            console.log('validation4');
            loggedUsingSubmitMobileIn();
        }
        else {
            console.log('validation7');
            showErrorToast();
        }
    }

    const loggedUsingSubmitMobileIn = () => {
        serLoader(true);
        var authOptions = {
            method: 'POST',
            url: globle.API_BASE_URL + 'otp_verify',
            data: JSON.stringify({ "mobile": email, 'otp': OTP, 'user_type': userType, 'refferal_id': refrelID }),
            headers: {
                'Content-Type': 'application/json',
            },
            json: true
        };
        console.log('loggedUsingSubmitMobileIn', authOptions);
        axios(authOptions)
            .then((response) => {
                console.log('loggedUsingSubmitMobileIn', response.data);
                if (response.data.status) {
                    serLoader(false);
                    showSuccessToast(response.data);
                } else {
                    console.log('errors', response?.data?.error?.otp[0]);
                    if (response?.data?.error?.otp[0] !== undefined) {
                        // showSuccessErrorToast(response?.data?.error?.otp[0]);
                        serLoader(false);
                    } else {
                        // message
                        Toast.show({
                            type: 'error',
                            text1: 'Something went wrong',
                            text2: response?.data?.message
                        });
                        serLoader(false);
                    }
                }
            })
            .catch((error) => {
                // alert(error)
                console.log('errors', error);
                showSuccessErrorToast(error);
                serLoader(false);
            });
    }

    const repeatUsingMobileIn = () => {
        serLoader(true);
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'requesting_for_otp',
            data: JSON.stringify({ "mobile": email, 'user_type': userType, 'refferal_id': refrelID }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        console.log('repeatUsingMobileIn', authOptions)
        axios(authOptions)
            .then((response) => {
                if (response.status) {
                    serLoader(false);
                    console.log(response.data);
                    showOTPSendToast(response.data.message);
                } else {
                    serLoader(false);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                alert(error)
            });
    }


    return (
        <View style={{ padding: 20, flex: 1 }}>
            <ScrollView style={{ elevation: 5, flex: 1, height: Dimensions.get('screen').height - 100, padding: 20, backgroundColor: '#ffffff', borderRadius: 10, marginBottom: 50, top: 30 }}>
                <View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                    <Image style={{ height: 200, width: 200, resizeMode: 'cover', marginBottom: 20, borderRadius: 150 }} source={require('../../assets/notification_logo.png')} />
                </View>
                <View>
                    <OTPInput
                        tintColor="#FB6C6A"
                        offTintColor="#BBBCBE"
                        value={OTP}
                        otpLength={4}
                        onChange={(code) => setUserOTP(code)}
                        fontWeight={'900'}
                    />
                </View>
                {/* <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Password</Text>
                    <TextInput placeholder='Enter user password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setPassword(e)} />
                    <Pressable onPress={() => setSecure(!secure)} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/icons_eye.png')} />
                    </Pressable>
                </View> */}
                {/* <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ tintColor: 'green', width: 20, height: 20, marginRight: 5 }} source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }} />
                    <Text style={{ fontSize: 8 }} >by clicking the button you agree with the <Text style={{ fontWeight: 'bold' }}>Terms & Conditions and Privacy Policy</Text></Text>
                </View> */}
                <TouchableOpacity style={{
                    width: '100%',
                    marginTop: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 14,
                    backgroundColor: 'black',
                    borderRadius: 5,
                    elevation: 6,
                }} onPress={validation}>
                    {loader ? <ActivityIndicator color={'#fff'} size={'small'} /> :
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>Submit</Text>}
                </TouchableOpacity>
                <View style={{ marginTop: 20, alignSelf: 'flex-end', marginRight: 10 }}>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => repeatUsingMobileIn()}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000000' }}>Resend OTP</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                </View>
            </ScrollView>
        </View>
    );
};


export default OTPSubmitScreen;