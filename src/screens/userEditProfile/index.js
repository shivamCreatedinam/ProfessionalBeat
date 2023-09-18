/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    TextInput,
    ScrollView,
    StyleSheet
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import TutorHeader from '../../components/TutorHeader';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect, useNavigation } from "@react-navigation/native";

const userEditProfile = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [data, setData] = React.useState({});
    const [name, setName] = React.useState('');
    const [City, setCity] = React.useState([]);
    const [State, setState] = React.useState([]);
    const [Email, setEmail] = React.useState('');
    const [mobile, setMobile] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [pincode, setPincode] = React.useState('');
    const [age, setAge] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    let [verified, setVerified] = React.useState('Yes');
    const [uploadProfile, setuploadProfile] = React.useState(null);
    const [visible, setVisible] = React.useState(true);
    // state
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    // city
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);
    // gender
    const [valueGender, setValueGender] = React.useState(null);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    const gender = [{ label: 'Female', value: '1' }, { label: 'Male', value: '2' }];


    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            getStateData();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadProfile = async () => {
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
        // console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                console.log("response", response)
                setLoading(false)
                setData(response.data);
                setName(response.data?.user?.name);
                setEmail(response.data?.user?.email);
                setAddress(response.data?.user?.localty);
                setMobile(response.data?.user?.mobile);
                setStreet(response.data?.user?.street);
                setPincode(response.data?.user?.pincode);
                // console.log('loadProfilex', JSON.stringify(response.data?.user?.mobile));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const uplodProfilePhotoCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadProfile(image.path);
            updateUserProfile();
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
        fetch(globle.API_BASE_URL + 'api/updateProfile', requestOptions)
            .then(response => response.json())
            .then(result => {
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

    const getStateData = async () => {
        setLoading(true);
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
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setState(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const getCityData = async (state) => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'cities/' + state,
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setCity(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const updateUserDemoProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('name', name);
        formdata.append('email', Email);
        formdata.append('mobile', mobile);
        formdata.append('city', valueCity);
        formdata.append('state', value);
        formdata.append('street', street);
        formdata.append('l_name', name);
        formdata.append('latitude', '65.25236409');
        formdata.append('localty', address);
        formdata.append('longitude', '23.065083094');
        formdata.append('password', '123456');
        formdata.append('pincode', pincode);
        formdata.append('gender', valueGender);
        formdata.append('city', valueCity);
        formdata.append('state', value);
        // formdata.append("profile_image", { uri: uploadProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append('gender', valueGender);
        console.log('formdata', formdata)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        // console.log('uploadProfile', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'updateProfile', requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('uploadProfileX', result)
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


    return (
        <View style={{ flex: 1, marginTop: 25, backgroundColor: '#000000' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 10, backgroundColor: '#F1F6F9', height: Dimensions.get('screen').height }}>
                <TutorHeader />
                <ScrollView
                    style={{ flex: 1, padding: 0, backgroundColor: '#F1F6F9' }}
                    contentContainerStyle={{ padding: 5, zIndex: 9999, paddingBottom: 80 }}>
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity
                            onPress={() => uplodProfilePhotoCard()}
                            style={{ paddingTop: 20, alignItems: 'center' }}>
                            {uploadProfile !== null ? <Image style={{ height: 120, width: 120, resizeMode: 'contain', alignSelf: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 150, borderColor: 'rgb(68,114,199)', borderWidth: 1 }} source={{ uri: uploadProfile }} /> :
                                <Image style={{ height: 120, width: 120, resizeMode: 'contain', alignSelf: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 150, borderColor: 'rgb(68,114,199)', borderWidth: 2 }} source={{ uri: globle.IMAGE_BASE_URL + data?.user?.profile_image }} />}
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <TextInput style={{ marginLeft: 15 }} defaultValue={data?.user?.name} placeholder='Enter Full Name' onChangeText={(e) => setName(e)} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <TextInput style={{ marginLeft: 15 }} defaultValue={data?.user?.email} placeholder='Enter Email' onChangeText={(e) => setEmail(e)} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <TextInput editable={false} style={{ marginLeft: 15 }} defaultValue={data?.user?.mobile} placeholder='Enter Mobile' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <Dropdown
                                style={[styles.dropdown1, isFocusGender && { borderColor: 'blue' }]}
                                selectedTextStyle={styles.selectedTextStyle1}
                                data={gender}
                                maxHeight={300}
                                labelField="label"
                                valueField="id"
                                placeholder={!isFocusGender ? 'Select Gender' : valueGender}
                                onFocus={() => setIsFocusGender(true)}
                                onBlur={() => setIsFocusGender(false)}
                                onChange={item => {
                                    console.log('setValueGender', item.label)
                                    setValueGender(item.label);
                                    setIsFocusGender(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <TextInput style={{ marginLeft: 15 }} defaultValue={data?.user?.localty} placeholder='Enter Address' onChangeText={(e) => setAddress(e)} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <TextInput style={{ marginLeft: 15 }} defaultValue={data?.user?.street} placeholder='Enter Street' onChangeText={(e) => setStreet(e)} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                            <Dropdown
                                style={[styles.dropdown1, isFocus && { borderColor: 'blue' }]}
                                selectedTextStyle={styles.selectedTextStyle1}
                                data={State}
                                maxHeight={300}
                                labelField="name"
                                valueField="id"
                                placeholder={!isFocus ? 'Select State' : value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setValue(item.label);
                                    getCityData(item.id);
                                    setIsFocus(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                            <Dropdown
                                style={[styles.dropdown1, isFocusCity && { borderColor: 'blue' }]}
                                selectedTextStyle={styles.selectedTextStyle1}
                                data={City}
                                maxHeight={300}
                                labelField={"name"}
                                valueField={"id"}
                                placeholder={!isFocusCity ? 'Select City' : valueCity}
                                onFocus={() => setIsFocusCity(true)}
                                onBlur={() => setIsFocusCity(false)}
                                onChange={item => {
                                    setValueCity(item.label);
                                    setIsFocusCity(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                            <TextInput style={{ marginLeft: 15 }} maxLength={6} keyboardType='number-pad' defaultValue={data?.user?.pincode} placeholder='Enter Pincode' onChangeText={(e) => setPincode(e)} />
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <TouchableOpacity onPress={() => updateUserDemoProfile()} style={{ padding: 20, alignItems: 'center', backgroundColor: '#000', borderRadius: 50, }}>
                                <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Update Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    dropdown1: {
        height: 50,
        width: 350,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    selectedTextStyle1: {
        fontSize: 16,
    },
});

export default userEditProfile;