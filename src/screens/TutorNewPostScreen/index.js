/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Alert,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import TutorHeader from '../../components/TutorHeader';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import styles from './styles';

const TutorNewPostScreen = () => {

    const navigate = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [Locality, setLocality] = React.useState(null);
    const [postUploaded, isPostUploaded] = React.useState(false);
    // subjects 
    const [SubjectsData, setSubjectsData] = React.useState([]);
    const [valueSubject, setSubjectValue] = React.useState(null);
    const [selectSubject, setSubjectsValue] = React.useState([]);
    const [isSubjectFocus, setIssubjectFocus] = React.useState(false);
    // qualification
    const [Qualification, setQualification] = React.useState([]);
    const [valueGender, setValueGender] = React.useState(null);
    const [selected, setSelected] = React.useState([]);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    // state
    const [State, setState] = React.useState([]);
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    // fees
    const [fees, setFees] = React.useState([{ "fees": '500', "id": 1, "status": 1 }, { "fees": '1000', "id": 2, "status": 1 }]);
    const [FeesValue, setFeesValue] = React.useState(null);
    const [isFeesFocus, setIsFeesFocus] = React.useState(false);
    // city
    const [City, setCity] = React.useState([]);
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);
    // Board
    const [BoardData, setBoard] = React.useState([]);
    const [valueBoard, setValueBoard] = React.useState(null);
    const [isFocusBoard, setIsFocusBoard] = React.useState(false);
    // Classes from
    const [ClassesData, setClasses] = React.useState([]);
    const [valueClasses, setValueClasses] = React.useState(null);
    const [isFocusClasses, setIsFocusClasses] = React.useState(false);
    // class to
    const [valueToClasses, setValueToClasses] = React.useState(null);
    const [isFocusToClasses, setIsFocusToClasses] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            loadCcity();
            getQualificationData();
            getSubjectsData();
            getClasses();
            getBoard();
            resetFieldValues();
            resetValues();
        }, [])
    );

    const resetFieldValues = () => {
        setCity([]);
        setLocality('');
        setFeesValue(null);
        setIsFeesFocus(true);
        setSubjectsValue([]);
    }

    const getQualificationData = async () => {
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

    const getSubjectsData = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'subjects',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setSubjectsData(response.data?.data);
                console.log('getSubjectsData', response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const getFeeList = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-fees',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('getFeeList', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setFees(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

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
                console.log('GetSubscription', JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
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

    const getBoard = async () => {
        // api/boards
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'boards',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('getFeeList', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setBoard(response.data?.data);
                console.log('getFeeList', response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }


    const getClasses = async () => {
        // api/boards
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'classes',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('getClasses', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setClasses(response.data?.data);
                console.log('getClasses', response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const validationBeforeSubmit = () => {
        if (value === null) {
            showErrorMessage("Please Select State");
        } else {
            if (valueCity === null) {
                showErrorMessage("Please Select City");
            } else {
                if (Locality === null) {
                    showErrorMessage("Please Enter Locality");
                } else {
                    if (selectSubject.length === 0) {
                        showErrorMessage("Please Select Subject's");
                    } else {
                        if (FeesValue === null) {
                            showErrorMessage("Please Enter Tuition Fees");
                        } else {
                            if (valueBoard === null) {
                                showErrorMessage("Please Select Board");
                            } else {
                                if (valueClasses === null) {
                                    showErrorMessage("Please Select Class From");
                                } else {
                                    if (valueToClasses === null) {
                                        showErrorMessage("Please Select Class To");
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

    const showErrorMessage = (msg) => {
        Toast.show({
            type: 'error',
            text1: 'Your ' + msg,
            text2: msg,
        });
    }


    const updateUserDemoProfile = async () => {
        setLoading(true);
        console.log('Class Save');
        console.log('saveChildProfile');
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        selectSubject.map((data, index) =>
            formdata.append(`subject_id[${index}]`, data)
        )
        formdata.append(`board_id[0]`, valueBoard)
        formdata.append('class_from', valueClasses);
        formdata.append('class_to', valueToClasses);
        formdata.append('open_for', '2');
        formdata.append('english_spoken', 'Yes');
        formdata.append('lang_eng', 'Yes');
        formdata.append('lang_hind', 'Yes');
        formdata.append('fees_id', FeesValue);
        formdata.append('address', 'no_address');
        formdata.append('locality', Locality);
        formdata.append('pincode', '110099');
        formdata.append('state', value);
        formdata.append('city', valueCity);
        formdata.append('latitude', '32.84579293');
        formdata.append('longitude', '64.82083292');
        formdata.append('agree_terms', 'Yes');
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('saveChildProfile', JSON.stringify(requestOptions) + data)
        fetch(globle.API_BASE_URL + 'tutor-create-post', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('saveChildProfile', result)
                if (result.status) {
                    setLoading(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    PostDone();
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

    const resetValues = () => {
        setLocality("");
        setValue([]);
        setValueCity([]);
        setValueClasses([]);
        setSubjectsValue([]);
        setFeesValue([]);
        setValueBoard([]);
        setValueClasses([]);
        setValueToClasses([]);

    }

    console.log("loc", Locality)

    const PostDone = () => {
        isPostUploaded(true)
        // Alert.alert(
        //     'Post Uploaded Successfully!',
        //     'You post uploaded Successfully',
        //     [
        //         { text: 'ok', onPress: () => { resetValues(); navigate.navigate('HomeScreen') } },
        //     ]
        // );
    }

    return (
        <View style={styles.container}>
            <TutorHeader />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 10, backgroundColor: '#F1F6F9' }} contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={{ color: 'black', fontSize: 12 }}
                />
                <View style={{ flex: 1, backgroundColor: '#F1F6F9', borderRadius: 10, marginBottom: 10, elevation: 5, padding: 20 }} >
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
                                setValue(item.id);
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
                                setValueCity(item.id);
                                setIsFocusCity(false);
                            }}
                        />
                    </View>
                    <TextInput value={Locality} onChangeText={(e) => setLocality(e)} placeholder='Locality' style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, height: 45, paddingLeft: 20, fontWeight: '600', color: '#000' }} />
                    {/* <View style={[{ marginTop: 0, paddingLeft: 10, paddingRight: 10, }]}>
                        <View style={[{ marginTop: 15, marginLeft: -10 }]}>
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
                    </View> */}
                    <View style={[{ marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <View style={[{ marginTop: 15, marginLeft: -10 }]}>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={SubjectsData}
                                maxHeight={300}
                                labelField="subject_name"
                                valueField="id"
                                placeholder={!isSubjectFocus ? 'Select Subjects' : valueSubject}
                                onFocus={() => setIssubjectFocus(true)}
                                onBlur={() => setIssubjectFocus(false)}
                                value={selectSubject}
                                onChange={item => {
                                    console.log(item);
                                    setSubjectsValue(item);
                                }}
                                selectedStyle={styles.selectedStyle}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                        <Dropdown
                            style={[styles.dropdown1, isFeesFocus && { borderColor: 'blue' }]}
                            selectedTextStyle={styles.selectedTextStyle1}
                            data={fees}
                            maxHeight={300}
                            labelField={"fees"}
                            valueField={"id"}
                            placeholder={!isFeesFocus ? 'Select Tutor Fees' : FeesValue}
                            onFocus={() => setIsFeesFocus(true)}
                            onBlur={() => setIsFeesFocus(false)}
                            onChange={item => {
                                setFeesValue(item.id);
                                setIsFeesFocus(false);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                        <Dropdown
                            style={[styles.dropdown1, isFocusBoard && { borderColor: 'blue' }]}
                            selectedTextStyle={styles.selectedTextStyle1}
                            data={BoardData}
                            maxHeight={300}
                            labelField={"board_name"}
                            valueField={"id"}
                            placeholder={!isFocusBoard ? 'Select Board' : valueBoard}
                            onFocus={() => setIsFocusBoard(true)}
                            onBlur={() => setIsFocusBoard(false)}
                            onChange={item => {
                                setValueBoard(item.id);
                                setIsFocusBoard(false);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                        <Dropdown
                            style={[styles.dropdown1, isFocusClasses && { borderColor: 'blue' }]}
                            selectedTextStyle={styles.selectedTextStyle1}
                            data={ClassesData}
                            maxHeight={300}
                            labelField={"class_name"}
                            valueField={"id"}
                            placeholder={!isFocusClasses ? 'Class From' : valueClasses}
                            onFocus={() => setIsFocusClasses(true)}
                            onBlur={() => setIsFocusClasses(false)}
                            onChange={item => {
                                setValueClasses(item.id);
                                setIsFocusClasses(false);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                        <Dropdown
                            style={[styles.dropdown1, isFocusToClasses && { borderColor: 'blue' }]}
                            selectedTextStyle={styles.selectedTextStyle1}
                            data={ClassesData}
                            maxHeight={300}
                            labelField={"class_name"}
                            valueField={"id"}
                            placeholder={!isFocusToClasses ? 'Class To' : valueToClasses}
                            onFocus={() => setIsFocusToClasses(true)}
                            onBlur={() => setIsFocusToClasses(false)}
                            onChange={item => {
                                setValueToClasses(item.id);
                                setIsFocusToClasses(false);
                            }}
                        />
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity onPress={() => validationBeforeSubmit()} style={{ padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 10, marginTop: 15, }}>
                            <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Create New Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6, marginTop: 20, marginBottom: 30 }}>
                    <Text style={{ fontSize: 12, letterSpacing: 1 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Note: </Text>Your post visible after varification by admin, and it's visible for you selected location or city whcih you selected.</Text>
                </View>
            </ScrollView>
            <Modal isVisible={postUploaded}>
                <View style={{ backgroundColor: '#ffffff', height: '50%', width: 300, alignSelf: 'center', borderRadius: 10 }}>
                    <View style={{ backgroundColor: 'green', flex: 1, padding: 20, borderRadius: 10, borderBottomLeftWidth: 1 }}>
                        <Image style={{ width: 80, height: 80, resizeMode: 'contain', alignSelf: 'center', marginTop: 30 }} source={require('../../assets/success.png')} />
                    </View>
                    <View style={{ flex: 1, padding: 10 }}>
                        <Text style={{ textAlign: 'center', fontWeight: '900', marginTop: 20 }} >Post Upload Successfully</Text>
                        <Text style={{ textAlign: 'center' }}>Your post is live,</Text>
                        <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, backgroundColor: 'green', width: 120, alignSelf: 'center', borderRadius: 10, elevation: 5, marginTop: 25 }} onPress={() => navigate.replace('HomeBottomNavigation')}>
                            <Text style={{ color: '#fff' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TutorNewPostScreen;

{/* <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
</View> */}