/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import TutorHeader from '../../components/TutorHeader';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import { Dropdown } from 'react-native-element-dropdown';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect, useNavigation } from "@react-navigation/native";

const EditTutorProfileScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [data, setData] = React.useState({});
    const [name, setName] = React.useState(null);
    const [City, setCity] = React.useState([]);
    const [State, setState] = React.useState([]);
    const [Email, setEmail] = React.useState(null);
    const [mobile, setMobile] = React.useState('');
    const [address, setAddress] = React.useState(null);
    const [AddharNumber, setAddharNumber] = React.useState(null);
    const [street, setStreet] = React.useState('No-Address');
    const [Qualification, setQualification] = React.useState([]);
    const [uploadAFProfile, setuploadAFProfile] = React.useState(null);
    const [uploadABProfile, setuploadABProfile] = React.useState(null);
    const [pincode, setPincode] = React.useState(null);
    const [age, setAge] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    let [verified, setVerified] = React.useState('Yes');
    const [uploadProfile, setuploadProfile] = React.useState(null);
    const [visible, setVisible] = React.useState(true);
    // state
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    const [valName, sValName] = React.useState(null);

    // city
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);
    // gender
    const [Gender, setGender] = React.useState(1);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    const gender = [{ label: 'Female', value: '1' }, { label: 'Male', value: '2' }];
    const [selectedId, setSelectedId] = React.useState(1);


    const [stName, setStName] = useState(null);
    const [ctName, setCtName] = useState(null);
    // React.useEffect(() => {
    //     if (value !== null && State.length > 0) {
    //         console.log("Selected value:", Number(value));
    //         const selectedState = State.find(stateItem => stateItem.id === value);
    //         console.log("iddd", selectedState)
    //         if (selectedState) {
    //             console.log("Selected state:", selectedState);
    //             setValue(selectedState.name);
    //         } else {
    //             console.warn('No matching state found in the State array.');
    //             console.log("All States:", State);
    //             console.log("Type of value:", typeof Number(value));
    //             console.log("Type of state IDs:", State.map(state => state.id).map(id => typeof id));
    //         }
    //     }
    // }, [value, State]);



    const setSelectedxId = (xx) => {
        if (Number(xx) === 1) {
            console.log('Male')
            setSelectedId(xx)
        } else if (Number(xx) === 2) {
            console.log('Female')
            setSelectedId(xx)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            console.log('--------------------------editProfile------>>>>', JSON.stringify(routes?.params?.screenType))
            getStateData();
            loadProfile();
            loadAadharData();
            loadCcity();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const radioButtons = React.useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Male',
            value: 'Male'
        },
        {
            id: '2',
            label: 'Female',
            value: 'Female'
        }
    ]), []);

    const loadCcity = async () => {
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
        console.log('GetSubscription', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setState(response.data?.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }


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
        axios.request(config)
            .then((response) => {
                console.log("res", response?.data)
                setLoading(false)
                console.log('-------><><><><>', JSON.stringify(response.data));
                setData(response.data);
                setName(response.data?.user?.name);
                setValueCity(response.data?.user?.city);
                setValue(response?.data?.user?.state)
                // const selectedStateId = response.data?.user?.state;
                // sValName(selectedStateId);
                // if (sValName === value) {
                //     console.log("inside", sValName === value)
                //     setValue(response.data?.user?.state_name);
                // }
                // else {
                //     console.log("in else")
                // }
                setStName(response?.data?.user?.state_name);
                setCtName(response?.data?.user?.city_name);
                setEmail(response.data?.user?.email);
                setAddress(response.data?.user?.localty);
                setMobile(response.data?.user?.mobile);
                setStreet(response.data?.user?.street);
                setPincode(response.data?.user?.pincode);
                setSelectedId(response.data?.user?.gender);
                setuploadProfile(globle.IMAGE_BASE_URL + response.data?.user?.profile_image);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    useEffect(() => {
        const filteredState = State?.filter(st => st.id === value)
        console.log("filteredState", filteredState[0]?.name)
        sValName(filteredState[0]?.name ? filteredState[0]?.name : "")
    }, [State, value])

    const loadAadharData = async () => {
        // api/
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get_tutor_documents_and_experience',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response?.data?.status !== false) {
                    setLoading(false)
                    console.log('loadAadharDatax', JSON.stringify(response?.data));
                    setAddharNumber(response.data?.data?.aadhar_no);
                    setuploadAFProfile(response.data?.data?.aadhar_front_image);
                    setuploadABProfile(response.data?.data?.aadhar_back_image);
                } else {
                    setLoading(false)
                    console.log('loadAadharDataxx', 'false');
                    setAddharNumber(null);
                    setuploadAFProfile(null);
                    setuploadABProfile(null);
                }
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
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        fetch(globle.API_BASE_URL + 'updateProfileImage', requestOptions)
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

    const validationCheck = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        let pincode_regex = /^\d{6}$/;
        if (uploadProfile === null) {
            showErrorMessage("Please Upload Profile Picture!");
        } else {
            if (name === null || name.trim().length < 4) {
                showErrorMessage("Please Enter Name!");
            } else {
                if (Email === null || reg.test(Email) === false) {
                    showErrorMessage("Please Enter Email!");
                } else {
                    if (selectedId === null) {
                        showErrorMessage("Please Enter Gender!");
                    } else {
                        if (AddharNumber === null) {
                            showErrorMessage("Please Enter Addhar Number!");
                        } else {
                            if (uploadAFProfile === null) {
                                showErrorMessage("Please Upload Aadhar Front Image!");
                            } else {
                                if (uploadABProfile === null) {
                                    showErrorMessage("Please Upload Aadhar Back Image!");
                                } else {
                                    if (value === null) {
                                        showErrorMessage("Please Select State!");
                                    } else {
                                        if (valueCity === null) {
                                            showErrorMessage("Please Select City!");
                                        } else {
                                            if (address === null || address.trim().length < 4) {
                                                showErrorMessage("Please Enter Locality!");
                                            } else {
                                                if (pincode_regex.test(pincode) === false) {
                                                    showErrorMessage("Please Enter Pincode!");
                                                } else {
                                                    updateUserDemoProfile();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const showErrorMessage = (msg) => {
        Toast.show({
            type: 'error',
            text1: 'Your ' + msg,
            text2: msg,
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
        formdata.append('city', Number(valueCity));
        formdata.append('state', Number(value));
        formdata.append('street', address);
        formdata.append('l_name', name);
        formdata.append('gender', Number(selectedId));
        formdata.append('latitude', '65.25236409');
        formdata.append('localty', address);
        formdata.append('longitude', '23.065083094');
        formdata.append('password', '123456');
        formdata.append('pincode', Number(pincode));
        // formdata.append('profile_image', uploadProfile);
        console.log('****', valueX, formdata)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('uploadProfileeewwww', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'updateProfile', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: result?.message,
                        text2: result?.message,
                    });
                    if (routes?.params?.screenType !== 'editProfile') {
                        updateUserAadharrofile();
                    }
                } else {
                    setLoading(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error--->', error);
                setLoading(false)
            });
    }

    const checkORUploadImage = () => {
        if (uploadAFProfile !== null) {
            Alert.alert(
                'Aadhar Front Image',
                'Please Select Any Of One Option',
                [
                    { text: 'View', onPress: () => console.log('View') },
                    { text: 'Upload', onPress: () => uploadAdharFrontCard() },
                ]
            );
        } else {
            uploadAdharFrontCard();
        }
    }

    const checkAadharBackORUploadImage = () => {
        if (uploadABProfile !== null) {
            Alert.alert(
                'Aadhar Back Image',
                'Please Select Any Of One Option',
                [
                    { text: 'View', onPress: () => console.log('View') },
                    { text: 'Upload', onPress: () => uploadAdharBackCard() },
                ]
            );
        } else {
            uploadAdharBackCard();
        }
    }

    const uploadAdharFrontCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadAFProfile(image.path);
        });
    }

    const uploadAdharBackCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadABProfile(image.path);
        });
    }

    const updateUserAadharrofile = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('aadhar_no', AddharNumber);
        formdata.append('qualification_id', 0);
        formdata.append("aadhar_back_image", { uri: uploadAFProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append("aadhar_front_image", { uri: uploadABProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('uploadProfile', JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'tutor_step_two_update_profile', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfileX', result);
                if (result.status) {
                    setLoading(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations! Profile, Update!',
                        text2: result?.message,
                    });
                    navigate.replace('QualificationScreen');
                    // loadProfile();
                } else {
                    setLoading(false);
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
        <View style={{ flex: 1, paddingTop: 15, backgroundColor: '#F1F6F9' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 10, backgroundColor: '#F1F6F9', height: Dimensions.get('screen').height }}>
                <TutorHeader />
                <KeyboardAvoidingView
                    style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 5 }}
                    behavior='height'
                    enabled
                    keyboardVerticalOffset={10}>
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
                                <TextInput style={{ marginLeft: 15, flex: 1 }} defaultValue={data?.user?.name} placeholder='Enter Full Name' onChangeText={(e) => setName(e)} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                <TextInput style={{ marginLeft: 15, flex: 1, textTransform: 'lowercase' }} defaultValue={data?.user?.email} placeholder='Enter Email' onChangeText={(e) => setEmail(e)} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                <TextInput editable={false} style={{ marginLeft: 15, flex: 1 }} defaultValue={data?.user?.mobile} placeholder='Enter Mobile' />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                <RadioGroup
                                    containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                                    radioButtons={radioButtons}
                                    onPress={(ox) => setSelectedxId(ox)}
                                    selectedId={selectedId}
                                />
                            </View>
                            <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                    <TextInput style={{ marginLeft: 15, flex: 1 }} maxLength={12} keyboardType='number-pad' defaultValue={AddharNumber} placeholder='Aadhar Number' onChangeText={(e) => setAddharNumber(e)} />
                                </View>
                            </View>
                            <View>
                                {routes?.params?.screenType === 'editProfile' ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                        <View style={[styles.searchInputContainer, { marginTop: 0, alignItems: 'center', flex: 1 }]}>
                                            <View>
                                                <Image style={{ width: 120, height: 120, resizeMode: 'contain' }} source={{ uri: globle.IMAGE_BASE_URL + uploadAFProfile }} />
                                                <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }} >Addhar Card Front</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.searchInputContainer, { marginTop: 0, alignItems: 'center', flex: 1 }]}>
                                            <View>
                                                <Image style={{ width: 120, height: 120, resizeMode: 'contain' }} source={{ uri: globle.IMAGE_BASE_URL + uploadABProfile }} />
                                                <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }} >Addhar Card Back</Text>
                                            </View>
                                        </View>
                                    </View> :
                                    <View>
                                        <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                                            <TouchableOpacity onPress={() => checkORUploadImage()} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                                <Text numberOfLines={1} style={{ marginLeft: 5, padding: 15, flex: 1 }}>{uploadAFProfile === null ? 'Aadhar Front Image' : uploadAFProfile}</Text>
                                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }} source={require('../../assets/camera.png')} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                                            <TouchableOpacity onPress={() => checkAadharBackORUploadImage()} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                                <Text numberOfLines={1} style={{ marginLeft: 5, padding: 15, flex: 1 }}>{uploadABProfile === null ? 'Aadhar Back Image' : uploadABProfile}</Text>
                                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }} source={require('../../assets/camera.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={{ alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999, display: routes?.params?.screenType === 'editProfile' ? 'none' : 'flex' }}>
                                <Dropdown
                                    style={[styles.dropdown1, isFocus && { borderColor: 'blue' }]}
                                    selectedTextStyle={styles.selectedTextStyle1}
                                    placeholderStyle={styles.placeholderStyle}
                                    iconStyle={styles.iconStyle}
                                    data={State}
                                    maxHeight={300}
                                    labelField="name"
                                    valueField="id"
                                    placeholder={!isFocus ? 'Select State' : stName}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setValue(item.id);
                                        getCityData(item.id);
                                        setIsFocus(false);

                                    }}
                                />
                            </View>
                            <View style={{ alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999, display: routes?.params?.screenType === 'editProfile' ? 'none' : 'flex' }}>
                                <Dropdown
                                    style={[styles.dropdown1, isFocusCity && { borderColor: 'blue' }]}
                                    selectedTextStyle={styles.selectedTextStyle1}
                                    placeholderStyle={styles.placeholderStyle}
                                    iconStyle={styles.iconStyle}
                                    data={City}
                                    maxHeight={300}
                                    labelField={"name"}
                                    valueField={"id"}
                                    placeholder={!isFocusCity ? 'Select City' : ctName}
                                    onFocus={() => setIsFocusCity(true)}
                                    onBlur={() => setIsFocusCity(false)}
                                    onChange={item => {
                                        setValueCity(item.id);
                                        setIsFocusCity(false);
                                    }}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                <TextInput style={{ marginLeft: 15, flex: 1 }} defaultValue={data?.user?.localty} placeholder='Locality' onChangeText={(e) => setAddress(e)} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                                <TextInput style={{ marginLeft: 15, flex: 1 }} maxLength={6} keyboardType='number-pad' defaultValue={data?.user?.pincode} placeholder='Enter Pincode' onChangeText={(e) => setPincode(e)} />
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <TouchableOpacity onPress={() => validationCheck()} style={{ padding: 20, alignItems: 'center', backgroundColor: '#000', borderRadius: 50, }}>
                                    <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Update Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown1: {
        height: 50,
        width: 350,
        paddingLeft: 20,
        paddingRight: 20,
        borderColor: 'gray',
        borderRadius: 8,
        // paddingHorizontal: 5,
    },
    selectedTextStyle1: {
        fontSize: 14,
        paddingLeft: 12
    },
    placeholderStyle: {
        fontSize: 14,
        paddingLeft: 12,
        color: '#000'
    },
    iconStyle: {
        width: 20,
        height: 20,
        marginRight: 8
    },
});

export default EditTutorProfileScreen;