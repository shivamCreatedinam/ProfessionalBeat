/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React, { useMemo, useState } from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Alert
} from 'react-native';
import axios from 'axios';
import RadioGroup from 'react-native-radio-buttons-group';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from "react-native-flash-message";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SelectList } from 'react-native-dropdown-select-list';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import styles from './styles';

const UserEditProfileScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [data, setData] = React.useState({});
    let [verified, setVerified] = React.useState('No');
    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [selected, setSelected] = React.useState("");
    const [mobile, setMobile] = React.useState(null);
    const [uploadProfile, setuploadProfile] = React.useState(null);
    const [selectedId, setSelectedId] = React.useState();
    let [driverData, setDriverData] = React.useState(false);
    const [location, setLocation] = React.useState({ latitude: 60.1098678, longitude: 24.7385084, });

    const handleLocationPermission = async () => {
        let permissionCheck = '';
        if (Platform.OS === 'ios') {
            permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                );
                permissionRequest === RESULTS.GRANTED ? console.warn('Location permission granted.') : console.warn('Location perrmission denied.');
            }
        }

        if (Platform.OS === 'android') {
            permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                );
                permissionRequest === RESULTS.GRANTED
                    ? console.warn('Location permission granted.')
                    : console.warn('Location perrmission denied.');
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            // loadStateList();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadStateList = async () => {
        console.log('loadProfile');
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'states',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false)
                    setData(response.data);
                    let ling = response.data.user.gender === 'male' ? 1 : 2;
                    setSelectedId(ling);
                    setName(response.data.user.name);
                    setEmail(response.data.user.email);
                    console.log('loadProfileX ' + ling, response.data);
                } else {
                    setLoading(false)
                    setData(response.data);
                    console.log('loadProfile', response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    React.useEffect(() => {
        handleLocationPermission();
    }, []);

    React.useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }, []);

    const radioButtons = useMemo(() => ([
        {
            id: 1, // acts as primary key, should be unique and non-empty string
            label: 'Male',
            value: 'option1'
        },
        {
            id: 2,
            label: 'Female',
            value: 'option2'
        }
    ]), []);

    const loadProfile = async () => {
        console.log('loadProfile');
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'getProfile',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false)
                    setData(response.data);
                    setName(response.data.user.name);
                    setEmail(response.data.user.email);
                    setMobile(response.data.user.mobile);
                    if (response.data?.user?.gender !== null) {
                        let ling = response.data.user?.gender === 'male' ? 1 : 2;
                        setSelectedId(ling);
                    }
                    console.log('loadProfileX ', JSON.stringify(response.data));
                } else {
                    setLoading(false)
                    setData(response.data);
                    console.log('loadProfile', response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const checkValidation = () => {
        if (uploadProfile !== null) {

        } else {
            showMessage({
                message: "Loggout Successfull!",
                description: "Congratulations, Loggout successfully!",
                type: "success",
            });
        }
    }

    function goBackEndTrip() {
        Alert.alert(
            'Driver Loggout',
            'Are you sure, want to logged out?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => loggoutUser() },
            ]
        );
    }

    const loggoutUser = async () => {
        let keys = [];
        try {
            keys = await AsyncStorage.getAllKeys();
            console.log(`Keys: ${keys}`) // Just to see what's going on
            await AsyncStorage.multiRemove(keys);
            await AsyncStorage.multiRemove(keys);
            navigate.navigate('SplashAppScreen');
            showMessage({
                message: "Loggout Successfull!",
                description: "Congratulations, Loggout successfully!",
                type: "success",
            });
            navigate.reset();
        } catch (e) {
            console.log(e)
        }
        console.log('Done')
    }

    const updateUserDemoProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('name', name);
        formdata.append('email', email);
        formdata.append('mobile', mobile);
        formdata.append('city', data?.user?.mobile);
        formdata.append('state', data?.user?.mobile);
        formdata.append('street', data?.user?.mobile);
        formdata.append('l_name', name);
        formdata.append('latitude', data?.user?.mobile);
        formdata.append('localty', data?.user?.mobile);
        formdata.append('longitude', data?.user?.mobile);
        formdata.append('password', data?.user?.mobile);
        formdata.append('pincode', data?.user?.mobile);
        formdata.append("profile_image", { uri: uploadProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append('gender', selectedId === 1 ? 'male' : 'female');
        console.log('uploadProfile', valueX)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('uploadProfile', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'updateProfile', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfileX', result)
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    loadProfile();
                } else {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error--->', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }


    const updateUserProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append("profile_image", { uri: uploadProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        console.log('uploadProfile', valueX)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('uploadProfile', requestOptions)
        fetch(globle.API_BASE_URL + 'updateProfileImage', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfileX', result)
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                } else {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }

    const uplodProfilePhotoCard = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadProfile(image.path);
            // updateUserProfile();
        });
    }

    const showSuccessToast = (msg) => {
        Toast.show({
            type: 'success',
            text1: 'Login Success',
            text2: msg,
        });
        // navigate.navigate('UserEditProfileScreen');
    }

    const GoBackByConditions = () => {
        console.log('GoBackByConditions', routes.params?.screenType);
        if (routes.params?.screenType === 'NewUser') {
            navigate.replace('UserBottomNavigation');
        } else if (routes.params?.screenType === 'OldUser') {
            navigate.replace('UserBottomNavigation');
        }
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 9999 }}>
                <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 15 }} onPress={() => GoBackByConditions()}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', padding: 10 }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold', marginLeft: -20, color: 'black', fontSize: 18 }} >Profile</Text>
                <TouchableOpacity onPress={() => goBackEndTrip()}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/power_off.png')} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => uplodProfilePhotoCard()}
                style={{ paddingTop: 20, alignItems: 'center' }}>
                {uploadProfile !== null ? <Image style={{ height: 120, width: 120, resizeMode: 'contain', alignSelf: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 150, borderColor: '#000', borderWidth: 1 }} source={{ uri: uploadProfile }} /> :
                    <Image style={{ height: 120, width: 120, resizeMode: 'contain', alignSelf: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 150, borderColor: '#000', borderWidth: 1 }} source={{ uri: globle.IMAGE_BASE_URL + data?.user?.profile_image }} />}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {verified === 'Yes' ? <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 4 }} source={require('../../assets/verified.png')} /> : null}
                <Text>{data?.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                <TextInput style={{ marginLeft: 15 }} defaultValue={data?.user?.name} placeholder='Enter User Name' onChangeText={(e) => setName(e)} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                <TextInput style={{ marginLeft: 15 }} defaultValue={data?.user?.email} placeholder='Enter User Email' onChangeText={(e) => setEmail(e)} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                <Text style={{ marginLeft: 10 }}>Gender</Text>
                <RadioGroup
                    containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                <TextInput editable={false} style={{ marginLeft: 15 }} defaultValue={data?.user?.mobile} placeholder='Enter User Mobile' />
            </View>
            <TouchableOpacity style={[styles.button, { width: '100%', borderRadius: 50, marginTop: 15, backgroundColor: '#000' }]} onPress={() => updateUserDemoProfile()}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', padding: 10 }}>Update</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserEditProfileScreen;