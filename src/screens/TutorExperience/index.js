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
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioGroup from 'react-native-radio-buttons-group';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import TutorHeader from '../../components/TutorHeader';
import globle from '../../../common/env';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import { Image } from 'react-native-elements';

const TutorExperienceScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(null);
    const [ExperienceDate, setExperienceDate] = React.useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const [isDateDetailsVisible, setisDateDetailsVisible] = React.useState(false);
    const [QualificationSelected, setQualificationSelected] = React.useState(false);
    const [AddharNumber, setAddharNumber] = React.useState('');
    const [UploadCertificate, setUploadCertificate] = React.useState(null);
    const [uploadAFProfile, setuploadAFProfile] = React.useState(null);
    const [uploadABProfile, setuploadABProfile] = React.useState(null);
    const [valueGender, setValueGender] = React.useState(null);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    const [valueExprence, setValueExprence] = React.useState(null);
    const [isFocusExprence, setIsFocusExprence] = React.useState(false);
    const [tutionPrefrences] = [{ label: 'Individual Tuition', value: '1' }, { label: 'Group Tuition', value: '2' }, { label: 'Online tuition', value: '3' }, { label: 'All', value: '4' }]
    const experience = [{ label: 'Yes', value: '1' }, { label: 'No', value: '2' }];
    // 
    const [isFocusEnglishSpk, setIsFocusEnglishSpk] = React.useState(false);
    const [ValueEnglishSpk, setEnglishSpk] = React.useState(null);
    const EnglishSpk = [{ label: 'Yes', id: '1' }, { label: 'No', id: '2' }];
    // employment
    const [isFocusEmployment, setIsFocusEmployment] = React.useState(false);
    const [ValueEmployment, setEmployment] = React.useState(null);
    const employment = [{ label: 'Government employee', value: '1' }, { label: 'Private sector employee', value: '2' }, { label: 'Self employed', value: '3' }];
    const [selectedId, setSelectedId] = React.useState(null);
    const [selectedSpokenId, setSelectedSpokenId] = React.useState(null);
    // Qualification
    const [State, setState] = React.useState([]);
    const [value, setValue] = React.useState(null);
    const [valueName, setValueName] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    // formet Date
    const [FormetDate, setFormetDate] = React.useState(null);
    const [CollageSchoolName, setCollageSchoolName] = React.useState(null);
    const [PercentageCgpa, setPercentageCgpa] = React.useState(null);
    // experience details
    const [CompanyOrigination, setCompanyOrigination] = React.useState(null);
    const [Designation, setDesignation] = React.useState(null);
    const [Experience, setExperience] = React.useState(null);
    const [DateExperience, setDateExperience] = React.useState(null);

    const [exp, setExp] = React.useState(false);
    const [uploadImageFirst, setuploadImageFirst] = React.useState(false);

    const radioButtons = React.useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Yes',
            value: 'No'
        },
        {
            id: '2',
            label: 'No',
            value: 'No'
        }
    ]), []);

    const setSelectedxId = (ids) => {
        setSelectedId(ids)
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const formattedDate = moment(date).format('YYYY');
        console.warn(">>>", formattedDate);
        setDate(date)
        setFormetDate(formattedDate)
        hideDatePicker();
    };

    const handleExperienceConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        setExperience(date)
        setDateExperience(getParsedDate(date))
        hideDatePicker();
    };

    const getParsedDate = (strDate) => {
        let date = moment(strDate).format('DD-MM-YYYY');
        return date;
    }

    useFocusEffect(
        React.useCallback(() => {
            getQualificationData();
            getExperienceData();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );


    const getQualificationData = async () => {
        setLoading(true)
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
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setState(response.data?.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    };

    const getExperienceData = async () => {
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
                setLoading(false)
                console.log('getExperienceData', JSON.stringify(response.data?.data));
                setExperienceDate(response.data?.data);
                setExp(response.data?.data?.experience); // year
                setCompanyOrigination(response.data?.data?.experiences[0]?.organization);
                setDesignation(response.data?.data?.experiences[0]?.designation);
                setDateExperience(response.data?.data?.experiences[0]?.month);
                setuploadAFProfile(response.data?.data?.experiences[0]?.emp_type);
                setSelectedId(response.data?.data?.experience === null ? '2' : '1')
                // 
                setValueExprence(response.data?.data?.experiences[0]?.emp_type);
                setValue(response.data?.data?.qualification_id);
                setCollageSchoolName(response.data?.data?.college);
                setPercentageCgpa(response.data?.data?.percentage);
                setUploadCertificate(response.data?.data?.certificate_image);
                setSelectedSpokenId(response.data?.data?.experiences?.length === 0 ? '2' : '1');
                if (Number(response.data?.data?.qualification_id) !== 0) {
                    setQualificationSelected(true);
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    };

    const updateUserDemoProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        // selected.map((items) => formdata.append('qualification_id', selected))
        formdata.append('aadhar_no', AddharNumber);
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
    };

    const uploadAdharFrontCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadAFProfile(image.path);
        });
    };

    const uploadCertificateFrontCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadImageFirst(true);
            setUploadCertificate(image.path);
        });
    };

    const uploadAdharBackCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadABProfile(image.path);
        });
    };

    const validationCheck = () => {
        if (selectedId === null) {
            showErrorMessage("Please Select Language Prefrences");
        } else {
            if (selectedSpokenId === null) {
                showErrorMessage("Please Select Experience");
            } else {
                if (selectedSpokenId === '2') {
                    // upload without exp
                    // showErrorMessage("All Set Without Experience");
                    updateOrExpereance();
                } else {
                    if (CompanyOrigination === null) {
                        showErrorMessage("Please Enter Company / Organization Name");
                    } else {
                        if (Designation === null) {
                            showErrorMessage("Please Enter Your Designation");
                        } else {
                            if (DateExperience === null) {
                                showErrorMessage("Please Enter Experience in years (Digits 1 to 10)");
                            } else {
                                if (uploadAFProfile === null) {
                                    showErrorMessage("Please Upload Certificate Image");
                                } else {
                                    showErrorMessage("All Set");
                                    updateOrExpereance();
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

    const updateOrExpereance = async () => {
        // setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        // formdata.append("experience", { uri: UploadCertificate, name: 'file_certificate_photo.png', filename: 'file_certificate_photo.png', type: 'image/png' });
        formdata.append("experience", exp);
        formdata.append('emp_type[0]', valueExprence);
        formdata.append('organization[0]', CompanyOrigination);
        formdata.append('designation[0]', Designation);
        formdata.append('start_date[0]', value);
        formdata.append('end_date[0]', DateExperience);
        formdata.append('year[0]', DateExperience);
        formdata.append('month[0]', DateExperience);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('updateOrExpereance', requestOptions)
        fetch(globle.API_BASE_URL + 'tutor_step_fourth_update_profile', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    navigate.replace('HomeBottomNavigation');
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

    const onQualificationSelect = (info) => {
        setValue(info.id);
        setQualificationSelected(true);
        setValueName(info.qualifications);
        setIsFocus(false);
    }

    const setExpFull = (info) => {
        if (info === '2') {
            setSelectedSpokenId(info);
            setExp('No');
        } else {
            setSelectedSpokenId(info);
            setExp('Yes');
        }
    }

    return (
        <View style={{ paddingTop: 15, backgroundColor: '#F1F6F9', padding: 10, height: Dimensions.get('screen').height }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            <ScrollView
                style={{ padding: 0, backgroundColor: '#F1F6F9' }}>
                <KeyboardAvoidingView
                    behavior="padding" enabled
                    style={{ padding: 0, backgroundColor: '#F1F6F9' }}
                    contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                    <View style={{ padding: 10 }}>
                        <Text style={
                            { fontWeight: 'bold', textAlign: 'center', fontSize: 22 }
                        }>Tutor Experience</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '95%', borderRadius: 10, marginTop: 15, marginLeft: 10, marginRight: 20 }}>
                        <Text style={{ flex: 1 }}>Do you english spoken?</Text>
                        <RadioGroup
                            containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                            radioButtons={EnglishSpk}
                            onPress={(ox) => setSelectedxId(ox)}
                            selectedId={selectedId}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '95%', borderRadius: 10, marginTop: 15, marginLeft: 10, marginRight: 20 }}>
                        <Text style={{ flex: 1 }}>Do you have any Experience?</Text>
                        <RadioGroup
                            containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                            radioButtons={radioButtons}
                            onPress={(ox) => setExpFull(ox)}
                            selectedId={selectedSpokenId}
                        />
                    </View>
                    {exp === 'Yes' ? <View style={{ padding: 15, marginTop: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: 'grey' }}>Experience Details</Text>
                        <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10, }]}>
                            <Dropdown
                                style={[styles.dropdown1, { backgroundColor: '#fff' }, isFocusExprence && { borderColor: 'blue', backgroundColor: '#fff' }]}
                                selectedTextStyle={styles.selectedTextStyle1}
                                data={employment}
                                value={valueExprence}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocusExprence ? 'Type of employment' : valueExprence}
                                onFocus={() => setIsFocusExprence(true)}
                                onBlur={() => setIsFocusExprence(false)}
                                onChange={item => {
                                    console.log('setValueExprence', item.value);
                                    setValueExprence(item.value);
                                    setIsFocusExprence(false);
                                }}
                            />
                        </View>
                        <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 5 }}>
                                <TextInput style={{ marginLeft: 15 }} keyboardType={'default'} defaultValue={CompanyOrigination} placeholder='Company / Organization name' onChangeText={(e) => setCompanyOrigination(e)} />
                            </View>
                        </View>
                        <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15 }}>
                                <TextInput style={{ marginLeft: 15 }} keyboardType={'default'} defaultValue={Designation} placeholder='Designation' onChangeText={(e) => setDesignation(e)} />
                            </View>
                        </View>
                        <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                            <TouchableOpacity onPress={() => showDatePicker()} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15 }}>
                                <TextInput style={{ marginLeft: 15 }} maxLength={2} keyboardType='number-pad' defaultValue={DateExperience} placeholder={Experience === null ? 'Experience in years (Digits 1 to 10)' : '' + DateExperience} onChangeText={(e) => setDateExperience(e)} />
                            </TouchableOpacity>
                        </View>
                        {/* <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 0, paddingRight: 0 }]}>
                            <TouchableOpacity onPress={() => uploadAdharFrontCard()} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 10, marginTop: 15, }}>
                                <Text numberOfLines={1} style={{ marginLeft: 5, padding: 15, flex: 1, color: 'grey' }}>{uploadAFProfile === null ? 'Certificate Image' : uploadAFProfile}</Text>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../assets/camera.png')} />
                            </TouchableOpacity>
                        </View> */}
                    </View> : null}
                    <View style={[styles.searchInputContainer, { marginBottom: 150 }]}>
                        <TouchableOpacity onPress={() => validationCheck()} style={{ padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 10, marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Update Experience</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};


export default TutorExperienceScreen;