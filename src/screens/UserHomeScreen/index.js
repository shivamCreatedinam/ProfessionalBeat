/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Image,
    Dimensions,
    View,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Share
} from 'react-native';
import axios from 'axios';
import uuid from 'react-native-uuid';
import globle from '../../../common/env';
import moment from 'moment';
import MarqueeText from 'react-native-marquee';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BottomSheet from "react-native-gesture-bottom-sheet";
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Geolocation from 'react-native-geolocation-service';
import RadioGroup from 'react-native-radio-buttons-group';
import Toast from 'react-native-toast-message';
import apps from '../../../package.json';
// import Share from 'react-native-share';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
//  
import styles from './styles';

const UserHomeScreen = () => {

    const permModal = useRef();
    const navigate = useNavigation();
    const bottomSheet = React.useRef();
    const GOOGLE_API_KEY = '';
    const [data, setData] = React.useState(null);
    const [selectedId, setSelectedId] = useState();
    const [isFetching, setIsFetching] = React.useState(false);
    const [currentCallId, setCurrentCallId] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [visiblePopup, setVisiblePopup] = React.useState(false);
    const [scheduleCall, setScheduleCall] = React.useState(false);
    const [TimeSlotPopul, setTimeSlotPopup] = React.useState(false);
    const [tutionEndPopup, setTutEndPopup] = React.useState(false);
    const [feedbackPopup, setFeedbackPopup] = React.useState(false);
    const [dataTuitor, setTuitorData] = React.useState([]);
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' }, { id: 2, name: 'Prashant Verma' }, { id: 3, name: 'Prashant Verma' }, { id: 4, name: 'Prashant Verma' }, { id: 5, name: 'Prashant Verma' }, { id: 6, name: 'Prashant Verma' }]);
    const [location, setLocation] = useState({ latitude: 60.1098678, longitude: 24.7385084, });
    // state
    const [State, setState] = React.useState([]);
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    // city
    const [City, setCity] = React.useState([]);
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);


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
            requestPermission();
            getTutorPostForUser();
            loadCcity();
            saveToken();
            loadProfile();
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
        axios.request(config)
            .then((response) => {
                if (response.status) {
                    console.log('loadProfile', JSON.stringify(response?.data));
                    if (response.data?.user?.name !== null) {
                        setLoading(false);
                        setData(response.data);
                    } else {
                        // 
                    }
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    // const onDisplayNotification = async () => {
    //     // Request permissions (required for iOS)
    //     // await notifee.requestPermission()

    //     // Create a channel (required for Android)
    //     const channelId = await notifee.createChannel({
    //         id: 'default',
    //         name: 'Default_Channel',
    //     });

    //     // Display a notification
    //     await notifee.displayNotification({
    //         title: 'Notification Title',
    //         body: 'Main body content of the notification',
    //         android: {
    //             channelId,
    //             smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
    //             // pressAction is needed if you want the notification to open the app when pressed
    //             pressAction: {
    //                 id: 'default',
    //             },
    //         },
    //     });
    // }

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
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
                // console.log('GetSubscription', JSON.stringify(response.data));
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

    async function onDisplayIncomingCall(post_id) {
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
        console.log('onRequestIncomingCall', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'parent_request_for_call', requestOptions)
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

    const saveToken = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        console.log('saveToken', fcmToken);
        // setLoading(true)
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
                    // setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: 'Your Status update',
                    });
                } else {
                    // setLoading(false)
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

    const getTutorPostForUser = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get_parent_post',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        // console.log('getTutorPostForUser', config);
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    setTuitorData(response?.data?.data);
                    // console.log('getTutorPostForUser', JSON.stringify(response.data));
                } else {
                    setTuitorData([]);
                    Toast.show({
                        type: 'error',
                        text1: 'Opps!',
                        text2: response?.data?.message,
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    useEffect(() => {
        handleLocationPermission();
    }, []);

    useEffect(() => {
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

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        // permModal.current.openModal();
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const startTrip = (info) => {
        // 
        console.log(JSON.stringify(info?.name));
        // post details /
        const PostDetails = {
            postIntor: info?.name + ', Board Name' + info.board_name !== null ? info?.board_name : 'N/A',
            ContactDetails: info?.name,
            PostLink: ""
        }
        const options = Platform.select({
            default: {
                title: "Share " + info?.name + " ",
                subject: PostDetails.postIntor,
                message: PostDetails.ContactDetails,
            },
        });
        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    const getCurrentCallId = () => {
        let caller_id = null;
        if (!currentCallId) {
            caller_id = uuid.v4();
            setCurrentCallId(caller_id);
        }

        return caller_id;
    };

    const requestPermission = async () => {
        const checkPermission = await checkNotificationPermission();
        if (checkPermission !== RESULTS.GRANTED) {
            const request = await requestNotificationPermission();
            if (request !== RESULTS.GRANTED) {
                // permission not granted
            }
        }
    };

    const requestNotificationPermission = async () => {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
    };

    const checkNotificationPermission = async () => {
        const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
    };

    const generateSharableLink = async (info) => {
        try {

            const link = await dynamicLinks().buildLink({
                link: 'https://tuitionbot.com/',
                // domainUriPrefix is created in your Firebase console
                domainUriPrefix: 'https://professionbeat.page.link',
                // optional setup which updates Firebase analytics campaign
                // "banner". This also needs setting up before hand
                analytics: {
                    campaign: 'banner',
                },
            });

            let message = `\n Name: ${info?.name}\n To class: ${info?.from_class_name}\n From class: ${info?.to_class_name}\n Fees: ${info?.fees}\n  Locality: ${info?.locality}\n  State: ${info?.state_name} \n\n`;

            const result = await Share.share({
                title: 'Post By - ' + info?.name,
                message: 'Share Post by : ' + info?.name + ', \n Post Info : ' + message + ',    Please install this Tuitorbot app and stay safe, open post here : ' + link + ' , download app here from here :https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
                url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
        return link;
    }

    const DisplayIncomingCall = async () => {
        RNNotificationCall.displayNotification(
            '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad',
            null,
            30000,
            {
                channelId: 'com.abc.incomingcall',
                channelName: 'Incoming video call',
                notificationIcon: 'ic_launcher', //mipmap
                notificationTitle: 'Linh Vo',
                notificationBody: 'Incoming video call',
                answerText: 'Answer',
                declineText: 'Decline',
                notificationColor: 'colorAccent',
                notificationSound: null, //raw
                //mainComponent:'MyReactNativeApp',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
                // payload:{name:'Test',Body:'test'}
            }
        );
    }

    const getDistanceOneToOne = async (lat1, lng1, lat2, lng2) => {
        const Location1Str = lat1 + "," + lng1;
        const Location2Str = lat2 + "," + lng2;

        let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

        let params = `origins=${Location1Str}&destinations=${Location2Str}&key=${GOOGLE_API_KEY}`; // you need to get a key
        let finalApiURL = `${ApiURL}${encodeURI(params)}`;

        let fetchResult = await fetch(finalApiURL); // call API
        let Result = await fetchResult.json(); // extract json

        return Result.rows[0].elements[0].distance;
    }

    const renderHistoryView = (item) => {

        let exp = item?.item?.tutor_experience?.length > 0 ? item?.item?.tutor_experience[0]?.year + ' Years' : 'No Experience';

        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, padding: 15, margin: 5, borderRadius: 10, elevation: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setTimeSlotPopup(!TimeSlotPopul)}>
                            {item.item?.profile_image !== null ? <Image style={{ width: 45, height: 45, resizeMode: 'contain', borderRadius: 140 }} source={{ uri: globle.IMAGE_BASE_URL + item.item?.profile_image }} /> :
                                <Image style={{ width: 45, height: 45, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/profile_picture.jpeg')} />}
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text maxFontSizeMultiplier={12} style={{ justifyContent: 'center', fontSize: 15, fontWeight: 'bold', textTransform: 'capitalize', maxWidth: 160 }} numberOfLines={1}>{item.item?.name}</Text>
                                    <View>
                                        <TouchableOpacity style={{ marginRight: 5, flexDirection: 'row', marginLeft: 8 }} onPress={() => setScheduleCall(!scheduleCall)}>
                                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', alignItems: 'center' }} source={require('../../assets/green_check.png')} />
                                            <Text style={{ fontSize: 12, color: 'green', fontWeight: '500', marginLeft: 3, marginBottom: 0 }}>Verified</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={{ justifyContent: 'center', fontSize: 12, color: 'grey' }} numberOfLines={1}>{getTimesAgo(item?.item?.created_date)}</Text>
                            </View>
                            {/* <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4' }} numberOfLines={1}>B-Tech, 4+ Years Exp</Text> */}
                        </View>
                    </View>
                    {item.item?.favourite === 'Yes' ? <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => onRemoveToFavourite(item.item?.id)} >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center', tintColor: 'rgb(68,114,199)' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity> : <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => onAddToFavourite(item.item?.id)} >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={() => generateSharableLink(item?.item)} style={{ width: 30, height: 30, borderRadius: 150, marginTop: -40, marginLeft: 10 }}>
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, tintColor: '#000', alignItems: 'center' }} source={require('../../assets/share.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Qualification:</Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.tutor_qualifications?.qualifications === '' ? 'No Qualification' : item.item?.tutor_qualifications?.qualifications}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Board: </Text>
                                {item.item?.boards.map((items) => <Text style={{ fontSize: 12 }}>{items?.board_name !== null ? items?.board_name : 'N/A'}, </Text>)}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Class: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.from_class_name !== null ? item.item?.from_class_name : 'N/A'} to {item.item?.to_class_name !== null ? item.item?.to_class_name : 'N/A'}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Subject: </Text>
                                <MarqueeText
                                    style={{ fontSize: 24, marginRight: 25 }}
                                    speed={1}
                                    marqueeOnStart={true}
                                    loop={true}
                                    delay={1000} >
                                    {item.item?.subject.map((items) => <Text style={{ fontSize: 12 }}>{items?.subject_name !== null ? items?.subject_name : 'N/A'}, </Text>)}
                                </MarqueeText>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Experience: </Text>
                                <Text style={{ fontSize: 12 }}>{exp}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>City: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.state_name}, {item.item?.city_name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, marginTop: -5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}>English spoken: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.english_spoken !== null ? item.item?.english_spoken : 'No'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}></Text>
                                <Text style={{ fontSize: 12 }}></Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Locality: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.locality}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Fee: </Text>
                                <Text style={{ fontSize: 12 }}>Rs {item.item?.fees !== null ? item.item?.fees : 0}/mo</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        {/* <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} /> */}
                        <Text style={{ fontSize: 12, paddingLeft: 8 }}>{item.item?.id} km away</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => onDisplayIncomingCall(item.item?.id)} style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 12, backgroundColor: 'green', borderRadius: 5, elevation: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>Request call</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const downloadHistoryPayment = () => {
        Toast.show({
            type: 'success',
            text1: 'Payment History Download!',
            text2: 'Payment History Send to your registerd Email!',
        });
    }

    const AddWalletPayment = () => {
        Toast.show({
            type: 'success',
            text1: 'Comming Soon',
            text2: 'Wallet Configuration Pending',
        });
    }

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Pratik Sahu',
            value: 'Pratik Sahu'
        },

    ]), []);

    const onRefresh = () => {
        getTutorPostForUser();
    }

    const updatePostLocation = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('city', Number(valueCity));
        formdata.append('state', Number(value));
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
                    bottomSheet.current.close();
                    loadProfile();
                    getTutorPostForUser();
                } else {
                    setLoading(false)
                    bottomSheet.current.close();
                    console.log('formdata', JSON.stringify(result))
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            });
    }

    // DisplayIncomingCall bottomSheet.current.show()
    return (
        <View style={{ flex: 1, paddingTop: 10, backgroundColor: '#F1F6F9' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View
                contentContainerStyle={{ padding: 5, zIndex: 9999 }}
                style={{ flex: 1, paddingTop: 10, padding: 10, backgroundColor: '#F1F6F9' }}>
                <CommonHeader />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../assets/navigation_icon.png')} />
                        <Text style={{ fontWeight: 'bold', }}>{data?.user?.state_name}, </Text>
                        <Text style={{ fontWeight: 'bold', }}>{data?.user?.city_name}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => bottomSheet.current.show()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/filter.png')} />
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>City</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {dataTuitor?.length === 0 ? <View style={{ flex: 1, alignItems: 'center', marginTop: Dimensions.get('screen').width / 3 }}>
                        <Image style={{ width: 250, height: 250, resizeMode: 'cover' }} source={require('../../assets/no_record_found.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000' }}>No Request Found</Text>
                    </View> :
                        <FlatList
                            style={{ height: Dimensions.get('screen').height / 1.2 - 30, marginTop: 5 }}
                            data={dataTuitor.slice(0, 10)}
                            keyExtractor={(e) => e.id}
                            renderItem={(items) => renderHistoryView(items)}
                            onRefresh={() => onRefresh()}
                            refreshing={isFetching}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={() => <View style={{ padding: 10, marginBottom: 20 }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Tuitionbot {apps.version}</Text>
                            </View>}
                        />}
                </View>
            </View>
            <Dialog
                visible={visible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 250, borderColor: '#000', borderWidth: 1 }}>
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 15, alignSelf: 'center', width: '93%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>Complete your profile and apply for tuition before request a call</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgb(68,114,199)', borderRadius: 10, width: '28%', alignSelf: 'center', marginTop: 35 }}
                            onPress={() => setVisible(!visible)}>
                            <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={visiblePopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 250, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 15, alignSelf: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Apply for tuition before schedule a call</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgb(68,114,199)', borderRadius: 8, width: '40%', alignSelf: 'center', marginTop: 20 }}
                            onPress={() => setVisiblePopup(!visiblePopup)}>
                            <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>​​Apply Now</Text>
                        </TouchableOpacity>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={scheduleCall}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 250, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 0, alignSelf: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Select the post to request the call</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-around', marginTop: 8, borderColor: '#000', borderWidth: 1, borderRadius: 10, alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <RadioGroup
                                    radioButtons={radioButtons.map((button) => ({
                                        ...button,
                                        style: {
                                            borderColor: '#000', // Change the border color to black
                                            // You can also adjust other styles as needed here
                                        },
                                    }))}
                                    onPress={setSelectedId}
                                    selectedId={selectedId}
                                    size={8} // Adjust the size to your preference
                                    color={'red'}
                                />
                                <View style={{ marginLeft: 42, marginBottom: 10 }}>
                                    <Text>7th</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 8 }}>
                                <Text style={{}}>Science</Text>
                            </View>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={TimeSlotPopul}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 190, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 0, alignSelf: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Choose your preferred time slot for cal</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <TouchableOpacity onPress={() => setTimeSlotPopup(!TimeSlotPopul)}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/profile_picture.jpeg')} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ justifyContent: 'center', fontSize: 15 }} numberOfLines={1}>Rajeev Gupta</Text>
                                {/* <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4' }} numberOfLines={1}>B-Tech, 4+ Years Exp</Text> */}

                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/cal.png')} />
                            <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12 }}>24 Sep 2023   Sunday</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3, marginTop: 4 }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/clock.png')} />
                            <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12 }}>05:30PM to 07:00PM</Text>
                        </View>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 15, padding: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fff', backgroundColor: 'rgb(254,92,54)', width: '40%' }}

                        >
                            <Text style={{ color: '#fff', alignSelf: 'center' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={tutionEndPopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 200, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 0, alignSelf: 'center', width: '80%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Want to end tuition with Rajeev Gupta?</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', width: '99%', justifyContent: 'space-around', marginTop: 20 }}>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(254,92,54)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%' }}
                                onPress={() => setFeedbackPopup(!feedbackPopup)}
                            >
                                <Text style={{ color: '#fff', alignSelf: 'center' }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%' }}
                                onPress={() => setTutEndPopup(!tutionEndPopup)}
                            >
                                <Text style={{ color: '#fff', alignSelf: 'center' }}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={feedbackPopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 30, borderColor: '#000', borderWidth: 1 }}
            // dialogTitle={<DialogTitle title="n" />}
            // footer={
            //     <DialogFooter>
            //         {/* <DialogButton
            //             text="CANCEL"
            //             onPress={() => setVisible(!visible)}
            //         /> */}
            //         <DialogButton
            //             text="OK"
            //             onPress={() => setVisible(!visible)}
            //             style={{backgroundColor:'blue'}}
            //         />
            //     </DialogFooter>
            // }
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 15, marginBottom: 10 }}>
                            <Text style={{ fontSize: 14 }}>Reason to end tuition (select anyone)</Text>
                        </View>

                        <View>
                            <Text style={{ fontSize: 12 }}>1- Seeking new tuition</Text>
                            <Text style={{ fontSize: 12 }}>2- Have new career option</Text>
                            <Text style={{ fontSize: 12 }}>3- Low fee</Text>
                            <Text style={{ fontSize: 12 }}>4- Found better tuition</Text>
                            <Text style={{ fontSize: 12 }}>5- Others</Text>
                        </View>

                        <View>
                            <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 12 }}>Feedback and Rating:</Text>
                            <View style={{ alignSelf: 'center' }}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140, tintColor: 'yellow' }} source={require('../../assets/star.png')} />
                            </View>
                        </View>
                        <View>
                            <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 12 }}>Tutors feedback:</Text>
                            <TextInput multiline={true} style={{ height: 40, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', }} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%', alignSelf: 'center', marginTop: 15 }}
                            onPress={() => setFeedbackPopup(!feedbackPopup)}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 14 }}>Done</Text>
                        </TouchableOpacity>
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
};
// 
export default UserHomeScreen;