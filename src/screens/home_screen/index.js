/**
 * Sample React Native App
 * https://github.com/facebook/react-native 
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    View,
    FlatList,
    Text,
    Image,
    Dimensions,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import RNCallKeep from 'react-native-callkeep';
import MarqueeText from 'react-native-marquee';
import BottomSheet from "react-native-gesture-bottom-sheet";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import TutorHeader from '../../components/TutorHeader';
import messaging from '@react-native-firebase/messaging';
import globle from '../../../common/env';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = () => {

    const navigate = useNavigation();
    const bottomSheet = React.useRef();
    const [dataHome, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [alert, setAlert] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(false);
    const [currentCallId, setCurrentCallId] = React.useState(null);
    let [driverData, setDriverData] = React.useState(false);
    const [dutyStatus, setDutyStatus] = React.useState('Off');
    const [driver_activated, setDriverActivated] = React.useState(false);
    const [errorMsg, setErrorMessage] = React.useState('');
    const [userData, setTutorData] = React.useState(null);
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [location, setLocation] = React.useState({ latitude: 60.1098678, longitude: 24.7385084, });
    const [Pickupstate, setPickupState] = React.useState({ pickupCords: {} });
    const [searchText, setSearchText] = React.useState('');
    // state
    const [State, setState] = React.useState([]);
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    // city
    const [City, setCity] = React.useState([]);
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);
    const handleSearch = (text) => {
        setSearchText(text);
    }

    const getCurrentCallId = () => {
        let caller_id = null;
        if (!currentCallId) {
            caller_id = uuid.v4();
            setCurrentCallId(caller_id);
        }

        return caller_id;
    };


    useFocusEffect(
        React.useCallback(() => {
            getTutorPostForUser();
            loadCcity();
            saveToken();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const saveToken = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        console.log('saveToken', fcmToken);
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('fcm_token', fcmToken);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('updateFcmToken', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'updateFcmToken', requestOptions)
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
                console.log('error--->', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
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

    const updatePostLocation = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('city', valueCity);
        formdata.append('state', value);
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
                    bottomSheet.current.hide();
                    getTutorPostForUser();
                } else {
                    setLoading(false)
                    bottomSheet.current.hide();
                    console.log('formdata', JSON.stringify(result))
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

    const setCallNotification = async (info) => {
        console.log('setCallNotification', JSON.stringify(info))
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        console.log('saveToken', fcmToken);
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('parent_id', info?.user_id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('CallTuitorNotification', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'tutor-call-back', requestOptions)
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
                console.log('error--->', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }

    const setDirectCallNotification = () => {
        const options = {
            ios: {
                appName: 'ReactNativeWazoDemo',
                imageName: 'sim_icon',
                supportsVideo: false,
                maximumCallGroups: '1',
                maximumCallsPerCallGroup: '1',
            },
            android: {
                alertTitle: 'Permissions Required',
                alertDescription:
                    'This application needs to access your phone calling accounts to make calls',
                cancelButton: 'Cancel',
                okButton: 'ok',
                imageName: 'sim_icon',
                additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS]
            }
        };

        try {
            RNCallKeep.setup(options);
            RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
            RNCallKeep.startCall(getCurrentCallId(), '57d6g7dhh3hd8d', 'Shivam');
        } catch (err) {
            console.error('initializeCallKeep error:', err.message);
        }
    }

    const getTutorPostForUser = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get_tutor_post',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('getTutorPostForUser', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response.data?.data);
                console.log('getTutorPostForUser', JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const sendNotification = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer AAAAPtYIrjk:APA91bH08K8usDvoiH-R45u8w-2TPvGQE7up5wR1O63QstD2QdrpSFeukpg9MtUcTTQ19y05M8D7PUK6H2CV4TiuQyL-7MjhfmDhb1ChfcsjqgENIhzYP2VZeahGe6t_R4m1kgzIIP_K");

        var raw = JSON.stringify({
            "to": "dBEJqVryRwS5YKmeFOJsPn:APA91bFhI4X2EeDWZ1LmcnLu47-uUMfokr30WUUSg5ux7q5PSsI5w149e1XDKrVsyPoojCTnax0_DCE9nzLzh2MXVUsKa0mqn7aeyh-QU70pfu64P_amTcMIZmSsDgeYtjNqQ6x6uneq",
            "notification": {
                "title": "Hello Test",
                "body": "Some body",
                "sound": "noti_sound1.wav",
                "android_channel_id": "new_email_arrived_channel"
            },
            "content_available": true,
            "priority": "high"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    const getProfileActiveStatus = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        console.log('ProfileActiveStatus', data);
        let url_driverProfile = globle.API_BASE_URL + 'getProfile';
        setLoading(true);
        var authOptions = {
            method: 'get',
            maxBodyLength: Infinity,
            url: url_driverProfile,
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false); // driver_activated
                    console.log('ProfileActiveStatus', response.data?.user?.profile_image);
                    setTutorData(response.data?.user);
                    // setDriverActivated(response.data?.driver_activated);
                    // setErrorMessage(response.data?.message);
                } else {
                    setLoading(false);
                    console.log('ProfileActiveStatusX', response.data);
                    // setDriverActivated(response.data?.driver_activated);
                    // setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });

    }

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    async function onAddToFavourite(post_id) {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('post_id', post_id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('updateFcmToken', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'add_to_favourite', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('onAddToFavourite', JSON.stringify(result))
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    getTutorPostForUser();
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

    async function onRemoveToFavourite(post_id) {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('post_id', post_id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('updateFcmToken', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'remove_to_favourite', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('onRemoveToFavourite', JSON.stringify(result))
                if (result.status) {
                    getTutorPostForUser();
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

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardFooter}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/clock.png')} />
                <Text style={[styles.beds, {}]}>{getTimesAgo(item?.created_at)}</Text>
                {item?.favourite === 'Yes' ? <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -10 }}
                    onPress={() => onRemoveToFavourite(item?.id)} >
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center', tintColor: 'rgb(68,114,199)' }} source={require('../../assets/star.png')} />
                </TouchableOpacity> : <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -10 }}
                    onPress={() => onAddToFavourite(item?.id)} >
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center' }} source={require('../../assets/star.png')} />
                </TouchableOpacity>}
                <TouchableOpacity>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/share.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
                <Text style={{ marginTop: -10 }}>{item?.child?.length > 1 ? 'Gruop tuition at parent’s home' : 'Individual tuition at parent’s home'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} />
                            <Text numberOfLines={1} style={{ fontWeight: 'bold' }}>{item?.child[0]?.child_name} {item?.child?.length > 1 ? `+${Number(item?.child?.length) - 1}` : null}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{item?.child[0]?.class_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/books.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{item?.child[0]?.board_name}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/medium.png')} />
                            <Text style={{ fontWeight: 'bold' }}>x</Text>
                        </View> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/search_books.png')} />
                            <MarqueeText
                                style={{ fontSize: 24, marginRight: 0 }}
                                speed={1}
                                marqueeOnStart={true}
                                loop={true}
                                delay={1000} >
                                {item?.child[0]?.subject.map((items) => <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{items?.subject_name}, </Text>)}
                            </MarqueeText>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/placeholder.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{item?.locality}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/routes.png')} />
                <Text style={{ flex: 1, marginLeft: 10 }}>{item?.user_id} km away </Text>
                <TouchableOpacity onPress={() => setCallNotification(item)} style={{ flex: 1, padding: 10, backgroundColor: '#22A699', elevation: 5, borderRadius: 60 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const onRefresh = () => {
        getTutorPostForUser();
    }

    return (
        <View style={{ flex: 1, marginTop: 5, backgroundColor: '#F1F6F9', padding: 10 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => bottomSheet.current.show()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/filter.png')} />
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>City</Text>
                </TouchableOpacity>
            </View>
            <View style={{ padding: 0, backgroundColor: '#F1F6F9', }}>
                <FlatList
                    style={{ height: Dimensions.get('screen').height - 200 }}
                    data={dataHome}
                    renderItem={renderItem}
                    onRefresh={() => onRefresh()}
                    refreshing={isFetching}
                    keyExtractor={(item) => item.id}
                />
                {/* <View style={{ flex: 1, alignItems: 'center', marginTop: Dimensions.get('screen').width / 3 }}>
                        <Image style={{ width: 300, height: 300, resizeMode: 'cover' }} source={require('../../assets/no_record.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000' }}>No Request Found</Text>
                    </View> */}
            </View>
            <Dialog
                visible={alert}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 60 }}
                dialogTitle={<DialogTitle title="Calling" />}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="CANCEL"
                            onPress={() => setAlert(false)}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => setAlert(false)}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent>
                    <View>
                        <View>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 20, fontSize: 18 }}>Do you want to call Pratik Shahu?</Text>
                            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12 }}>Calling time: <Text style={{ fontWeight: 'bold', }}>9AM to 9pm only</Text></Text>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
            <BottomSheet hasDraggableIcon ref={bottomSheet} height={600} >
                <View style={{ flex: 1, padding: 20 }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>File By Location</Text>
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
                    <TouchableOpacity onPress={() => updatePostLocation()} style={{ padding: 20, backgroundColor: '#000000', borderRadius: 20, marginTop: 20 }}>
                        {loading === true ? <ActivityIndicator color={'#fff'} size={'large'} /> : <Text style={{ fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', color: '#ffffff' }}>Update Location</Text>}
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'black'
    },
    searchInputContainer: {
        paddingHorizontal: 10,
        borderBottomColor: 'grey',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        marginBottom: 10,
        fontSize: 11,
        paddingLeft: 20,
        elevation: 5
    },
    propertyListContainer: {
        paddingHorizontal: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    image: {
        height: 150,
        marginBottom: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    cardBody: {
        marginBottom: 10,
        padding: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5
    },
    address: {
        fontSize: 16,
        marginBottom: 5
    },
    squareMeters: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666'
    },
    cardFooter: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    beds: {
        fontSize: 14,
        color: '#000000',
        flex: 1,
        marginLeft: 10
    },
    baths: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    },
    parking: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    }, dropdown1: {
        height: 45,
        flexGrow: 1,
        paddingLeft: 25,
        paddingRight: 25,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    selectedTextStyle1: {
        fontSize: 16,
    },
    dropdown: {
        height: 45,
        flexGrow: 1,
        backgroundColor: '#fff',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderRadius: 40,
        paddingLeft: 15,
        paddingRight: 15,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});

export default HomeScreen;