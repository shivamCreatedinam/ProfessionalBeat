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
    View,
    FlatList,
    Text,
    Image,
    Dimensions,
    PermissionsAndroid,
    ActivityIndicator,
    Platform,
    Alert
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import Confetti from 'react-confetti'
import Modal from "react-native-modal";
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import RNCallKeep from 'react-native-callkeep';
import MarqueeText from 'react-native-marquee';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BottomSheet from "react-native-gesture-bottom-sheet";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import TutorHeader from '../../components/TutorHeader';
import messaging from '@react-native-firebase/messaging';
import globle from '../../../common/env';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog, {
    SlideAnimation,
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
} from 'react-native-popup-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    createAgoraRtcEngine,
    ClientRoleType,
    IRtcEngine,
    ChannelProfileType,
} from 'react-native-agora';
const appId = '3d117a30950e4724a73c9f8b07aef599';
const channelName = 'callingtestingapp';
const token = '007eJxTYDC880X9sYM4nyG/kO8cbea2ThWt47fL1ZV0y5XTZohpv1VgME4xNDRPNDawNDVINTE3Mkk0N062TLNIMjBPTE0ztbR82xya2hDIyBAduYCJkQECQXxBhuTEnJzMvPSS1OISIJVYUMDAAAB8OCCH';
const uid = 0;


const HomeScreen = () => {

    const navigate = useNavigation();
    const bottomSheet = React.useRef();
    const [dataHome, setData] = React.useState([]);
    const [ProfileData, setProfileData] = React.useState(null);
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
    const [CompleteProfileStatus, setCompleteProfileStatus] = React.useState(false);
    // state
    const [State, setState] = React.useState([]);
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
    // city
    const [City, setCity] = React.useState([]);
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);
    // agora
    const agoraEngineRef = React.useRef<IRtcEngine>(); // Agora engine instance
    const [isJoined, setIsJoined] = React.useState(false); // Indicates if the local user has joined the channel
    const [IsSwitched, setIsSwitched] = React.useState(false); // Indicates if the local user has joined the channel
    const [isMuted, setisMuted] = React.useState(false);
    const [remoteUid, setRemoteUid] = React.useState(0); // Uid of the remote user
    const [message, setMessage] = React.useState(''); // Message to the user
    const [volume, setVolume] = React.useState(10); // volume to the user


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
            requestPermission();
            loadProfile();
            getTutorPostForUser();
            loadCcity();
            saveToken();
            callsetup();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

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
                    console.log('loadProfile', JSON.stringify(response.data?.status));
                    console.log('loadProfile', JSON.stringify(response?.data?.user));
                    if (response.data?.status === true) {
                        setLoading(false);
                        setProfileData(response?.data);
                        setCompleteProfileStatus(response?.data?.user?.tutor_is_update === 0 ? true : false);
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

    const saveToken = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
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
        fetch(globle.API_BASE_URL + 'updateFcmToken', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false);
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
                Toast.show({
                    type: 'error',
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

    const getCityData = async (state: any) => {
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
                    bottomSheet.current.close();
                    loadProfile();
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

    const CheckForAlert = (info: any) => {
        Alert.alert(
            'Call to ' + info?.child[0]?.child_name,
            'Are you sure, want to call ' + info?.child[0]?.child_name,
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'Call', onPress: () => getCallingToken(info) },
            ]
        );
    }

    const getCallingToken = async (info: any) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://tuitionbot.com/agora_live_token/KBC/sample/RtcTokenBuilderSample.php',
            headers: {
                'Authorization': 'Bearer '
            }
        };
        console.log('getCallingToken', config);
        axios.request(config)
            .then((response) => {
                console.log('getCallingToken', JSON.stringify(response.data));
                if (Number(response?.data?.status) === 1) {
                    setCallNotification(info, response?.data?.token2, response?.data?.channelName)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const setCallNotification = async (info: any, token: any, channelName: any) => {
        // console.log('setCallNotification', JSON.stringify(info))
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('call_token', token);
        formdata.append('channel_id', channelName);
        formdata.append('post_id', info?.id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        // console.log('CallTuitorNotification----->', JSON.stringify(info))
        fetch(globle.API_BASE_URL + 'tutor_request_call_for_post', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false)
                    setDirectCallNotification(token, info);
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

    const callsetup = () => {
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
            // RNCallKeep.startCall(getCurrentCallId(), '57d6g7dhh3hd8d', 'Shivam');
        } catch (err) {
            console.error('initializeCallKeep error:', err.message);
        }
    }

    const setDirectCallNotification = (token: any, info: any) => {
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
            join();
            RNCallKeep.setup(options);
            RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
            RNCallKeep.startCall(getCurrentCallId(), token, info?.child[0]?.child_name);
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
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response.data?.data);
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

    const getTimesAgo = (created_at: any) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    async function onAddToFavourite(post_id: any) {
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

    async function onRemoveToFavourite(post_id: any) {
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
                <TouchableOpacity onPress={() => CheckForAlert(item)} style={{ flex: 1, padding: 10, backgroundColor: '#22A699', elevation: 5, borderRadius: 60 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const onRefresh = () => {
        getTutorPostForUser();
    }

    const openCompleteProfile = () => {
        setCompleteProfileStatus(false);
        setCompleteProfileStatus(false);
        setCompleteProfileStatus(false);
        setCompleteProfileStatus(false);
        setCompleteProfileStatus(false);
        setCompleteProfileStatus(false);
        navigate.navigate('EditTutorProfileScreen');
    }

    // agora calling
    function showMessage(msg: string) {
        setMessage(msg);
    }

    React.useEffect(() => {
        // Initialize Agora engine when the app starts
        setupVoiceSDKEngine();
    });

    const setupVoiceSDKEngine = async () => {
        try {
            // use the helper function to get permissions
            if (Platform.OS === 'android') { await getPermission() };
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;
            agoraEngine.registerEventHandler({
                onJoinChannelSuccess: () => {
                    showMessage('Successfully joined the channel ' + channelName);
                    setIsJoined(true);
                },
                onUserJoined: (_connection, Uid) => {
                    showMessage('Remote user joined with uid ' + Uid);
                    setRemoteUid(Uid);
                },
                onUserOffline: (_connection, Uid) => {
                    showMessage('Remote user left the channel. uid: ' + Uid);
                    setRemoteUid(0);
                },
            });
            agoraEngine.initialize({
                appId: appId,
            });
        } catch (e) {
            console.log(e);
        }
    };

    const getPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
        }
    };

    React.useEffect(() => {
        const engine = createAgoraRtcEngine();
        engine.initialize({ appId: globle.AppIdAgora });
        console.warn('All Setup Done')
    }, []);

    React.useEffect(() => {
        setIsSwitched(IsSwitched);
        console.log('IsSwitched', IsSwitched);
        agoraEngineRef.current?.setDefaultAudioRouteToSpeakerphone(false); // Disable the default audio route.
        agoraEngineRef.current?.setEnableSpeakerphone(IsSwitched); // Enable or disable the speakerphone temporarily.
    }, [IsSwitched]);

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            setRemoteUid(0);
            setIsJoined(false);
            showMessage('You left the channel');
        } catch (e) {
            console.log(e);
        }
    };

    React.useEffect(() => {
        setisMuted(isMuted);
        console.log('isMuted', isMuted);
        agoraEngineRef.current?.muteRemoteAudioStream(remoteUid, isMuted);
    }, [isMuted]);

    const increaseVolume = () => {
        if (volume !== 100) {
            setVolume(volume + 5);
        }
        agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
    };

    const decreaseVolume = () => {
        if (volume !== 0) {
            setVolume(volume - 5);
        }
        agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
    };

    const join = async () => {
        if (isJoined) {
            return;
        }
        try {
            agoraEngineRef.current?.setChannelProfile(
                ChannelProfileType.ChannelProfileCommunication,
            );
            agoraEngineRef.current?.joinChannel(token, channelName, uid, {
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={{ flex: 1, marginTop: 5, backgroundColor: '#F1F6F9', padding: 10 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../assets/navigation_icon.png')} />
                    <Text style={{ fontWeight: 'bold', }}>{ProfileData?.user?.state_name}, </Text>
                    <Text style={{ fontWeight: 'bold', }}>{ProfileData?.user?.city_name}</Text>
                </View>
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
            <Modal isVisible={CompleteProfileStatus}>
                <View style={{ backgroundColor: '#fff', height: 300, padding: 10, borderRadius: 5 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14, letterSpacing: 1, marginTop: 5 }}>Welcome To TuitionBot</Text>
                        <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 12, letterSpacing: 2, marginTop: 10 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,</Text>
                        {/* <Image style={{}} source={require('../../assets/')} /> */}
                    </View>
                    <TouchableOpacity style={{ padding: 15, backgroundColor: '#000000', borderRadius: 5, elevation: 5 }} onPress={() => openCompleteProfile()}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>Complete Profile</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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