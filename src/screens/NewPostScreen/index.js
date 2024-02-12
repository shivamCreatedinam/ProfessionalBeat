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
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import TutorHeader from '../../components/TutorHeader';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import Modal from "react-native-modal";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import styles from './styles';
import CommonHeader from '../../components/CommonHeader';


const NewPostScreen = () => {

    const navigate = useNavigation();
    const getFeeList = async () => {

    }
    const [loading, setLoading] = React.useState(false);
    const [submitPost, setSubmitPost] = React.useState(false);
    const [name, setName] = React.useState('');
    const [FullAddress, setFullAddress] = React.useState('');
    const [Locality, setLocality] = React.useState('');
    const [ZipCode, setZipCode] = React.useState('110099');
    const [visiblePopup, setVisiblePopup] = React.useState(false);
    // subjects 
    const [ChildList, setChildList] = React.useState([]);
    // subjects 
    const [SubjectsData, setSubjectsData] = React.useState([]);
    const [selectSubject, setSubjectsValue] = React.useState([]);
    const [valueSubject, setSubjectValue] = React.useState(null);
    const [isSubjectFocus, setIssubjectFocus] = React.useState(false);
    // qualification
    const [Qualification, setQualification] = React.useState([]);
    const [valueGender, setValueGender] = React.useState(null);
    const [selected, setSelected] = React.useState([]);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    // state
    const [State, setCountryState] = React.useState([]);
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
    // child
    const [valueToClasses, setValueToClasses] = React.useState(null);
    const [isFocusToClasses, setIsFocusToClasses] = React.useState(false);

    React.useEffect(() => {
        navigate.addListener('focus', () => {
            getChildList();
            loadCcity();
            getSubjectsData();
        });
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const valueX = await AsyncStorage.getItem('@autoUserGroup');
            let data = JSON.parse(valueX)?.token;
            const config = { headers: { 'Authorization': 'Bearer ' + data } };

            const [childResponse, cityResponse, subjectsResponse, classesResponse, boardResponse] = await Promise.all([
                axios.get(globle.API_BASE_URL + 'get-parent-child', config),
                axios.get(globle.API_BASE_URL + 'states', config),
                axios.get(globle.API_BASE_URL + 'subjects', config),
                axios.get(globle.API_BASE_URL + 'classes', config),
                axios.get(globle.API_BASE_URL + 'boards', config)
            ]);
            console.log(JSON.stringify(childResponse));
            setLoading(false);
            setChildList(childResponse.data?.data);
            setCountryState(cityResponse.data?.data);
            setSubjectsData(subjectsResponse.data?.data);
            setClasses(classesResponse.data?.data);
            setBoard(boardResponse.data?.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setQualification(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const loadSessionStorage = async () => {
        // api/boards
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-parent-child',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setChildList(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setSubjectsData(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const getChildList = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-parent-child',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false);
                    setChildList(response.data?.data);
                } else {
                    setLoading(false);
                    // setChildList([]);
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const loadCcity = async () => {
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
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false);
                    setCountryState(response.data?.data);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setCity(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setBoard(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setClasses(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const saveChildProfile = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        selected.map((data, index) =>
            formdata.append(`subject_id[${index}]`, data)
        )
        formdata.append('board_id', valueBoard);
        formdata.append('class_id', valueClasses);
        formdata.append('name', name);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        fetch(globle.API_BASE_URL + 'add-parent-child', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false);
                    setVisiblePopup(false);
                    getChildList();
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
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }

    const validationCheck = () => {
        if (value === null) {
            showErrorMessage("Please Select State");
        } else {
            if (valueCity === null) {
                showErrorMessage("Please Select City");
            } else {
                if (!Locality.trim()) {
                    showErrorMessage("Please Enter Locality Address");
                } else {
                    if (selected === null) {
                        showErrorMessage("Please select Children Profile.");
                    } else {
                        if (selectSubject === null) {
                            showErrorMessage("Please select tuition Subjects");
                        } else {
                            updateUserDemoProfile();
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
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        selectSubject.map((data, index) =>
            formdata.append(`subject_id[${index}]`, data)
        )
        selected.map((data, index) =>
            formdata.append(`child_id[${index}]`, data)
        )
        formdata.append('open_for', true);
        formdata.append('address', 'not_required');
        formdata.append('locality', Locality);
        formdata.append('pincode', ZipCode);
        formdata.append('state', value);
        formdata.append('city', valueCity);
        formdata.append('latitude', '23.5348934');
        formdata.append('longitude', '23.9850292');
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        setLoading(true);
        fetch(globle.API_BASE_URL + 'create-parent-post', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false);
                    setSubmitPost(true);
                    setVisiblePopup(false);
                    resetValues();
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                } else {
                    setLoading(false);
                    setSubmitPost(true);
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
                setSubmitPost(true);
            });
    }

    const resetValues = () => {
        setFullAddress();
        setLocality('');
        setValue();
        setValueCity();
        setValueClasses();
        setFullAddress();
        setSelected([]);
        // PostDone();
    }

    const PostDone = () => {
        // Alert.alert(
        //     'Post Uploaded Successfully!',
        //     'You post uploaded Successfully',
        //     [
        //         { text: 'ok', },
        //     ]
        // );
    }

    const RadioGroupCustom = ({ options, selectedValue, onSelect }) => {
        return (
            <View>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onSelect(option.value)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            margin: 2,
                            padding: 7,
                            backgroundColor: option.value === selectedValue ? 'red' : "#fff"
                        }}
                    >
                        <Icon
                            name={'circle-o'}
                            size={15} // Adjust the size as needed
                            color={'black'} // Change the color
                        />
                        <Text style={{ marginLeft: 8 }}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const radioButtons = [
        {
            label: 'Individual tuition',
            value: 'Individual tuition',
        },
        {
            label: 'Group tuition',
            value: 'Group tuition',
        },
    ];

    return (
        <View style={styles.container}>
            <CommonHeader />
            <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#F1F6F9' }} contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={{ color: 'black', fontSize: 12 }}
                />
                <View style={{ flex: 1, backgroundColor: '#F1F6F9', borderRadius: 10, marginBottom: 10, elevation: 5, padding: 20 }} >
                    {/* <TextInput onChangeText={(e) => setFullAddress(e)} placeholder='Full Address' style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, height: 45, paddingLeft: 15, fontWeight: 'bold', color: '#000' }} /> */}
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
                    <TextInput onChangeText={(e) => setLocality(e)} placeholder='Locality' style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, height: 45, paddingLeft: 20, color: '#000', }} />
                    {/* <TextInput maxLength={6} onChangeText={(e) => setZipCode(e)} placeholder='Zip Code' style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, height: 45, paddingLeft: 15, fontWeight: 'bold', color: '#000' }} /> */}
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                        <Dropdown
                            style={[styles.dropdown1, isFocusClasses && { borderColor: 'blue' }]}
                            selectedTextStyle={styles.selectedTextStyle1}
                            data={ClassesData}
                            maxHeight={300}
                            labelField={"class_name"}
                            valueField={"id"}
                            placeholder={!isFocusClasses ? 'Select Class' : valueClasses}
                            onFocus={() => setIsFocusClasses(true)}
                            onBlur={() => setIsFocusClasses(false)}
                            onChange={item => {
                                setValueClasses(item.id);
                                setIsFocusClasses(false);
                            }}
                        /> 
                    </View> */}
                    <View style={[{ marginTop: 0, paddingLeft: 10, paddingRight: 10, marginBottom: 10, }]}>
                        <View style={[{ marginTop: 15, marginLeft: -10, zIndex: 9999, }]}>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={ChildList}
                                maxHeight={300}
                                labelField="child_name"
                                valueField="id"
                                placeholder={!isFocusGender ? 'Select Children Profile' : valueGender}
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
                    <View style={[{ marginTop: 0, paddingLeft: 10, paddingRight: 10, marginBottom: 10, }]}>
                        <View style={[{ marginTop: 15, marginLeft: -10, zIndex: 9999, }]}>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={SubjectsData}
                                maxHeight={300}
                                labelField={"subject_name"}
                                valueField="id"
                                placeholder={!isSubjectFocus ? 'Select Subjects' : valueSubject}
                                onFocus={() => setIssubjectFocus(true)}
                                onBlur={() => setIssubjectFocus(false)}
                                value={selectSubject}
                                onChange={item => {
                                    setSubjectsValue(item);
                                }}
                                selectedStyle={styles.selectedStyle}
                            />
                        </View>
                    </View>
                    {/* <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity onPress={() => setVisiblePopup(true)} style={{ padding: 15, alignItems: 'center', backgroundColor: 'rgb(68,114,199)', borderRadius: 50, marginTop: 15, }}>
                            <Text style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' }}>+ New Child</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                        <TouchableOpacity disabled={submitPost} onPress={() => validationCheck()} style={{ padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 10, marginTop: 15, }}>
                            {submitPost === true ? <ActivityIndicator color={'white'} style={{ alignSelf: 'center' }} /> : <Text style={{ color: '#ffffff', textTransform: 'uppercase' }}>Create New Post</Text>}
                        </TouchableOpacity>
                    </View>
                    <Dialog
                        visible={visiblePopup}
                        dialogAnimation={new SlideAnimation({
                            slideFrom: 'bottom',
                        })}
                        dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width + 120, borderColor: '#000', borderWidth: 1 }}
                    >
                        <DialogContent>
                            <View>
                                <View style={{ marginTop: 45, alignSelf: 'center', width: '100%' }}>
                                    <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20, fontWeight: 'bold' }}>Add New Child Profile</Text>
                                    <TextInput onChangeText={(e) => setName(e)} placeholder='Child Name' style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, height: 45, paddingLeft: 15, fontWeight: 'bold', color: '#000' }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15, zIndex: 999 }}>
                                        <Dropdown
                                            style={[styles.dropdown1, isFocusClasses && { borderColor: 'blue' }]}
                                            selectedTextStyle={styles.selectedTextStyle1}
                                            data={ClassesData}
                                            maxHeight={300}
                                            labelField={"class_name"}
                                            valueField={"id"}
                                            placeholder={!isFocusClasses ? 'Select Class' : valueClasses}
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
                                </View>
                                <View style={[{ marginTop: 0, paddingLeft: 10, paddingRight: 10, marginBottom: 10, }]}>
                                    <View style={[{ marginTop: 15, marginLeft: -10, zIndex: 9999, }]}>
                                        <MultiSelect
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            data={SubjectsData}
                                            maxHeight={300}
                                            labelField="subject_name"
                                            valueField="id"
                                            placeholder={!isFocusGender ? 'Select Subjects' : valueGender}
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                    <TouchableOpacity style={{ padding: 8, backgroundColor: '#FFA500', borderRadius: 8, width: '40%', alignSelf: 'center', marginTop: 20, marginRight: 5 }}
                                        onPress={() => setVisiblePopup(!visiblePopup)}>
                                        <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>​Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgb(68,114,199)', borderRadius: 8, width: '40%', alignSelf: 'center', marginTop: 20 }}
                                        onPress={() => saveChildProfile()}>
                                        <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>​​Apply Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </DialogContent>
                    </Dialog>
                </View>
                <Modal isVisible={submitPost}>
                    <View style={{ backgroundColor: '#ffffff', height: 300, width: 300, alignSelf: 'center', borderRadius: 10 }}>
                        <View style={{ backgroundColor: 'green', flex: 1, padding: 20, borderRadius: 10, borderBottomLeftWidth: 1 }}>
                            <Image style={{ width: 80, height: 80, resizeMode: 'contain', alignSelf: 'center', marginTop: 30 }} source={require('../../assets/success.png')} />
                        </View>
                        <View style={{ flex: 1, padding: 10 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '900', marginTop: 20 }} >Post Upload Successfully</Text>
                            <Text style={{ textAlign: 'center' }}>Your post is live,</Text>
                            <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, backgroundColor: 'green', width: 120, alignSelf: 'center', borderRadius: 10, elevation: 5, marginTop: 15 }} onPress={() => navigate.replace('UserBottomNavigation')}>
                                <Text style={{ color: '#fff' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6, marginTop: 20 }}>
                    <Text style={{ fontSize: 12, letterSpacing: 1 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Note: </Text>Your post visible after varification by admin, and it's visible for you selected location or city whcih you selected.</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const style = StyleSheet.create({
    dropdown: {
        height: 30,
        borderColor: 'gray',
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: 100
    },
    dropdown1: {
        height: 30,
        width: '20%',
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 10,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
});

export default NewPostScreen;