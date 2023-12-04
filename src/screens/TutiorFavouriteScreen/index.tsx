/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    SafeAreaView,
    Dimensions,
    Platform,
    PermissionsAndroid
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import MarqueeText from 'react-native-marquee';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorHeader from '../../components/TutorHeader';
import RNCallKeep from 'react-native-callkeep';
// import uuid from 'react-native-uuid';
// agora
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
import styles from './styles';

RNCallKeep.setup({
    ios: {
        appName: 'CallKeepDemo',
    },
    android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
    },
});

const getNewUuid = () => '123e4567-e89b-12d3-a456-426614174000';

const format = uuid => '123e4567-e89b-12d3-a456-426614174000';

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

const isIOS = Platform.OS === 'ios';

const TutorFavourtePostScreen = () => {

    const navigate = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [FavourteData, setFavourteData] = React.useState([]);
    // agora
    const agoraEngineRef = React.useRef<IRtcEngine>(); // Agora engine instance
    const [isJoined, setIsJoined] = React.useState(false); // Indicates if the local user has joined the channel
    const [IsSwitched, setIsSwitched] = React.useState(false); // Indicates if the local user has joined the channel
    const [isMuted, setisMuted] = React.useState(false);
    const [remoteUid, setRemoteUid] = React.useState(0); // Uid of the remote user
    const [message, setMessage] = React.useState(''); // Message to the user
    const [volume, setVolume] = React.useState(10); // volume to the user


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

    useFocusEffect(
        React.useCallback(() => {
            getNotificationUser();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getNotificationUser = async () => {
        setLoading(true)
        setFavourteData([]);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'my_favourite_list',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        // console.log('getTutorPostForUser', config);
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    setFavourteData(response?.data?.data);
                    // console.log('getTutorPostForUser', JSON.stringify(response.data));
                } else {
                    setFavourteData([]);
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

    async function onDisplayIncomingCall(post_id: any) {
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
                    join();
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
                    getNotificationUser();
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

    const renderHistoryView = (items: any) => {
        return (
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 20, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold', flex: 1, marginRight: 6 }} numberOfLines={2}>{items?.item?.child?.length > 1 ? 'Gruop tuition at parent’s home' : 'Individual tuition at parent’s home'}</Text>
                    {items.item?.favourite === 'Yes' ? <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => onRemoveToFavourite(items.item?.id)} >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center', tintColor: 'rgb(68,114,199)' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity> : <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => onRemoveToFavourite(items.item?.id)} >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity>}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} />
                            <Text numberOfLines={1} style={{ fontWeight: 'bold' }}>{items?.item?.child[0]?.child_name} {items?.item?.child?.length > 1 ? `+${Number(items?.item?.child?.length) - 1}` : null}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} />
                            {items.item?.child.map((items) => <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{items?.class_name !== null ? items?.class_name : 'N/A'}, </Text>)}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/books.png')} />
                            {items.item?.child.map((items) => <Text style={{ fontWeight: 'bold' }}>{items?.board_name !== null ? items?.board_name : 'N/A'}, </Text>)}
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/search_books.png')} />
                            <MarqueeText
                                style={{ fontSize: 24, marginRight: 0 }}
                                speed={1}
                                marqueeOnStart={true}
                                loop={true}
                                delay={1000} >
                                {items.item?.child[0]?.subjects?.map((items) => <Text style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: 13 }}>{items?.subject_name !== null ? items?.subject_name : 'N/A'}, </Text>)}
                            </MarqueeText>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/placeholder.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{items?.item?.locality}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} />
                        <Text style={{ fontWeight: 'bold' }}>{items?.item?.kms} km away</Text>
                    </View>
                    <TouchableOpacity onPress={() => onDisplayIncomingCall(items.item?.id)} style={{ flex: 1, padding: 10, backgroundColor: 'rgb(68,114,199)', elevation: 5, borderRadius: 60 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            <View style={{ flex: 1 }}>
                {FavourteData?.length > 0 ?
                    <FlatList
                        style={{}}
                        data={FavourteData}
                        keyExtractor={(e) => e.id}
                        renderItem={(items) => renderHistoryView(items)}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => <View style={{ marginBottom: 180 }} />}
                    /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                        <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                    </View>}
            </View>
        </SafeAreaView>
    );

};

export default TutorFavourtePostScreen;