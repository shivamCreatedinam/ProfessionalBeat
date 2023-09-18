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
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import styles from './styles';

const TutorNewPostScreen = () => {

    const navigate = useNavigation();
    const [loading, setLoading] = React.useState(false);
    // subjects 
    const [SubjectsData, setSubjectsData] = React.useState([]);
    const [selectSubject, setSubjectsValue] = React.useState(null);
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
    const [FeesValue, setFeesValue] = React.useState('');
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
            // getFeeList();
        }, [])
    );

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
                console.log('getFeeList', response.data?.data);
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


    const updateUserDemoProfile = async () => {
        console.log('Class Save');
    }

    return (
        <View style={styles.container}>
            <TutorHeader />
            <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#F1F6F9' }} contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
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
                    <View style={[{ marginTop: 0, paddingLeft: 10, paddingRight: 10, }]}>
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
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                        <Dropdown
                            style={[styles.dropdown1, isSubjectFocus && { borderColor: 'blue' }]}
                            selectedTextStyle={styles.selectedTextStyle1}
                            data={SubjectsData}
                            maxHeight={300}
                            labelField={"subject_name"}
                            valueField={"id"}
                            placeholder={!isSubjectFocus ? 'Select Subjects' : selectSubject}
                            onFocus={() => setIssubjectFocus(true)}
                            onBlur={() => setIssubjectFocus(false)}
                            onChange={item => {
                                setSubjectsValue(item.label);
                                setIssubjectFocus(false);
                            }}
                        />
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
                                // setFeesValue(item.label);
                                // setIsFeesFocus(false);
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
                                setValueBoard(item.label);
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
                                setValueClasses(item.label);
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
                                setValueToClasses(item.label);
                                setIsFocusToClasses(false);
                            }}
                        />
                    </View>
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity onPress={() => updateUserDemoProfile()} style={{ padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 10, marginTop: 15, }}>
                            <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Create New Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default TutorNewPostScreen;

{/* <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
</View> */}