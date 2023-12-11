/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    FlatList,
    Dimensions,
    Image
} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../components/CommonHeader';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import styles from './styles';

const AddChildProfileScreen = () => {

    const navigate = useNavigation();
    const [name, setName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [visiblePopup, setVisiblePopup] = React.useState(false);
    // qualification
    const [Qualification, setQualification] = React.useState([]);
    const [valueGender, setValueGender] = React.useState(null);
    const [selected, setSelected] = React.useState([]);
    const [isFocusGender, setIsFocusGender] = React.useState(false);
    // Board
    const [BoardData, setBoard] = React.useState([]);
    const [valueBoard, setValueBoard] = React.useState(null);
    const [isFocusBoard, setIsFocusBoard] = React.useState(false);
    // Classes from
    const [ClassesData, setClasses] = React.useState([]);
    const [valueClasses, setValueClasses] = React.useState(null);
    const [isFocusClasses, setIsFocusClasses] = React.useState(false);
    // subjects 
    const [ChildList, setChildList] = React.useState([]);
    // subjects 
    const [SubjectsData, setSubjectsData] = React.useState([]);
    const [selectSubject, setSubjectsValue] = React.useState(null);
    const [isSubjectFocus, setIssubjectFocus] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                // setTimeout
                getQualificationData();
                loadSessionStorage();
                getSubjectsData();
                getClasses();
                getBoard();
            }, 30);
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
        console.log('getQualificationData', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setQualification(response.data?.data);
                console.log('getQualificationData', response.data?.data);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setClasses(response.data?.data);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setBoard(response.data?.data);
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
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setSubjectsData(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
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
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('loadSessionStorage', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setChildList(response.data?.data);
                console.log('loadSessionStorage', response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const saveChildProfile = async () => {
        console.log('saveChildProfile');
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        selected.map((data, index) =>
            formdata.append(`subject_id[${index}]`, data)
        )
        formdata.append('board_id', valueBoard);
        formdata.append('class_id', valueClasses);
        formdata.append('name', name);
        console.log('uploadProfile', valueX)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('saveChildProfile', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'add-parent-child', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('saveChildProfile', result)
                if (result.status) {
                    setLoading(false);
                    setVisiblePopup(false);
                    loadSessionStorage();
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
                console.log('error--->', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }

    const renderItems = (items) => {
        return (
            <View style={{ padding: 20, backgroundColor: '#ffffff', marginBottom: 4, elevation: 5, borderRadius: 15, margin: 5 }}>
                <Text><Text style={{ fontWeight: 'bold' }}>Name :</Text> {items?.item?.child_name}</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Class :</Text> {items?.item?.class_name}</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Board :</Text> {items?.item?.board_name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',width:'100%'  }}>
                    <Text style={{ fontWeight: 'bold' }}>Subjects : </Text>
                    {items?.item?.subjects.map((data) =>
                        <View style={{ display: 'flex' }}>
                            <Text numberOfLines={2} style={{  }}  >{data?.subject_name}, </Text>
                        </View>
                    )}
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CommonHeader />
            <View style={{ flex: 1, padding: 10, backgroundColor: '#F1F6F9' }} contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={{ color: 'black', fontSize: 12 }}
                />
                <View style={[styles.searchInputContainer, { marginTop: 0, paddingLeft: 10, paddingRight: 10 }]}>
                    <TouchableOpacity onPress={() => setVisiblePopup(true)} style={{ padding: 15, alignItems: 'center', backgroundColor: 'rgb(68,114,199)', borderRadius: 50, marginTop: 15, }}>
                        <Text style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase' }}>+ New Child</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <FlatList
                        style={{ marginTop: 10, marginBottom: 100 }}
                        data={ChildList}
                        keyExtractor={(ids) => ids}
                        renderItem={(items) => renderItems(items)}
                    />
                </View>
            </View>
            <Dialog
                visible={visiblePopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width + 70, borderColor: '#000', borderWidth: 1 }} >
                <DialogContent>
                    <ScrollView
                        showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 15, alignSelf: 'center', width: '100%' }}>
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
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ padding: 8, backgroundColor: '#FFA500', borderRadius: 8, width: '40%', alignSelf: 'center', marginTop: 20, marginRight: 10 }}
                                onPress={() => setVisiblePopup(!visiblePopup)}>
                                <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>​Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgb(68,114,199)', borderRadius: 8, width: '40%', alignSelf: 'center', marginTop: 20 }}
                                onPress={() => saveChildProfile()}>
                                <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>​Create New</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </DialogContent>
            </Dialog>
        </View>
    );
};

export default AddChildProfileScreen;