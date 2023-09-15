/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import TutorHeader from '../../components/TutorHeader';
import globle from '../../../common/env';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import { Image } from 'react-native-elements';

const QualificationScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [loading, setLoading] = React.useState(false);
    const [AddharNumber, setAddharNumber] = React.useState('');
    const [Qualification, setQualification] = React.useState([]);
    const [uploadAFProfile, setuploadAFProfile] = React.useState(null);
    const [uploadABProfile, setuploadABProfile] = React.useState(null);
    const [valueGender, setValueGender] = React.useState(null);
    const [selected, setSelected] = React.useState([]);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    const [valueExprence, setValueExprence] = React.useState(null);
    const [isFocusExprence, setIsFocusExprence] = React.useState(false);
    const experience = [{ label: 'Yes', value: '1' }, { label: 'No', value: '2' }];

    useFocusEffect(
        React.useCallback(() => {
            getStateData();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const updateUserDemoProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('aadhar_no', AddharNumber);
        formdata.append('qualification_id', selected);
        formdata.append('aadhar_back_image', valueGender);
        formdata.append("aadhar_back_image", { uri: uploadAFProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append("aadhar_front_image", { uri: uploadABProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        console.log('uploadProfile', valueX)
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
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
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

    const getStateData = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'qualificatoins',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setQualification(response.data?.data);
                console.log('Profile', response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
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

    return (
        <View style={{ flex: 1, marginTop: 25, backgroundColor: '#000000' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 0, backgroundColor: '#000000', height: Dimensions.get('screen').height }}>
                <View
                    style={{ flex: 1, padding: 10, backgroundColor: '#F1F6F9' }}
                    contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                    <TutorHeader />
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 22 }}>Qualification Details</Text>
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15 }}>
                            <TextInput style={{ marginLeft: 15 }} maxLength={12} keyboardType='number-pad' defaultValue={AddharNumber} placeholder='Aadhar Number' onChangeText={(e) => setAddharNumber(e)} />
                        </View>
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity onPress={() => uploadAdharFrontCard()} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15 }}>
                            <Text numberOfLines={1} style={{ marginLeft: 5, padding: 15, flex: 1 }}>{uploadAFProfile === null ? 'Aadhar Front Image' : uploadAFProfile}</Text>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../assets/camera.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity onPress={() => uploadAdharBackCard()} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15 }}>
                            <Text numberOfLines={1} style={{ marginLeft: 5, padding: 15, flex: 1 }}>{uploadABProfile === null ? 'Aadhar Back Image' : uploadABProfile}</Text>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../assets/camera.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10, }]}>
                        <View style={[styles.searchInputContainer, { marginTop: 15 }]}>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={Qualification}
                                maxHeight={300}
                                labelField="qualifications"
                                valueField="id"
                                placeholder={!isFocusGender ? 'Select Qualifications' : valueGender}
                                onFocus={() => setIsFocusGender(true)}
                                onBlur={() => setIsFocusGender(false)}
                                value={selected}
                                onChange={item => {
                                    setSelected(item);
                                }}
                                selectedStyle={styles.selectedStyle}
                            />
                        </View>
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10, }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15, paddingLeft: 10, paddingRight: 10, }}>
                            <Dropdown
                                style={[styles.dropdown1, isFocusExprence && { borderColor: 'blue' }]}
                                selectedTextStyle={styles.selectedTextStyle1}
                                data={experience}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocusExprence ? 'Do you have any Experience?' : valueExprence}
                                onFocus={() => setIsFocusExprence(true)}
                                onBlur={() => setIsFocusExprence(false)}
                                onChange={item => {
                                    console.log('setValueExprence', item.label);
                                    setValueExprence(item.label);
                                    setIsFocusExprence(false);
                                }}
                            />
                        </View>
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity onPress={() => updateUserDemoProfile()} style={{ padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 10, marginTop: 15, }}>
                            <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Update Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};


export default QualificationScreen;