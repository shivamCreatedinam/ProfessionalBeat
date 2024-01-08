import React, { useRef, useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    PermissionsAndroid,
    Platform,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
    createAgoraRtcEngine,
    ClientRoleType,
    IRtcEngine,
    ChannelProfileType,
} from 'react-native-agora';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'react-native-elements';

const appId = '3d117a30950e4724a73c9f8b07aef599';
const channelName = 'callingtestingapp';
const token = '007eJxTYDC880X9sYM4nyG/kO8cbea2ThWt47fL1ZV0y5XTZohpv1VgME4xNDRPNDawNDVINTE3Mkk0N062TLNIMjBPTE0ztbR82xya2hDIyBAduYCJkQECQXxBhuTEnJzMvPSS1OISIJVYUMDAAAB8OCCH';
const uid = 0;

const CallingScreen = () => {

    const routes = useRoute();
    const navigate = useNavigation();
    console.warn('CallingScreen_routes', JSON.stringify(routes.params?.user_info?.child[0]?.child_name))
    const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [IsSwitched, setIsSwitched] = useState(false); // Indicates if the local user has joined the channel
    const [isMuted, setisMuted] = useState(false);
    const [callerName, setCallerName] = useState(routes.params?.user_info?.child[0]?.child_name);
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user
    const [volume, setVolume] = useState(10); // volume to the user

    function showMessage(msg: string) {
        setMessage(msg);
    }

    React.useEffect(() => {
        // Initialize Agora engine when the app starts 
        setupVoiceSDKEngine();
        console.warn('routes', JSON.stringify(routes.params?.response_data?.channelName))
        console.warn('routes', JSON.stringify(routes.params?.response_data?.token1))
        setCallNotification(routes.params?.user_info?.id, routes.params?.response_data?.token1, routes.params?.response_data?.channelName);
    });

    const setCallNotification = async (info: any, token: any, channelName: any) => {
        // console.log('setCallNotification', JSON.stringify(info))
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('call_token', token);
        formdata.append('channel_id', channelName);
        formdata.append('post_id', info);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('CallTuitorNotification-----<>', JSON.stringify(requestOptions))
        fetch('https://tuitionbot.com/Profession-beat/public/api/tutor_request_call_for_post', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('CallTuitorNotification----->', JSON.stringify(result))
                if (result.status) {

                } else {
                }
            })
            .catch((error) => {
                console.log('error--->', error);
            });
    }

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
        engine.initialize({ appId: '2496c3f2c06d46f2a3b500bab9c45952' });
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
            navigate.goBack();
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
        <SafeAreaView style={styles.main}>
            <Image style={{ height: 120, width: 120, resizeMode: 'contain', marginTop: 90 }} source={require('../../assets/notification_logo.png')} />
            <Text style={styles.head}>{callerName}</Text>
            <Text style={[styles.head, { marginBottom: Dimensions.get('screen').width / 2, fontSize: 12, marginTop: 5 }]}>calling...</Text>
            {/* <View style={styles.btnContainer}>
                <Text onPress={join} style={styles.button}>
                    Join
                </Text>
                <Text onPress={leave} style={styles.button}>
                    Leave
                </Text>
                <Text onPress={decreaseVolume} style={styles.button}>
                    Plus Volum
                </Text>
            </View>
            <View style={styles.btnContainer}>
                <Text onPress={increaseVolume} style={styles.button}>
                    Minus Volum
                </Text>
                <Text onPress={() => setisMuted(!isMuted)} style={styles.button}>
                    {isMuted === true ? 'Mute' : 'Unmute'}
                </Text>
                <Text onPress={() => setIsSwitched(!IsSwitched)} style={styles.button}>
                    {IsSwitched ? 'Speaker Phone' : 'Mic Phone'}
                </Text>
            </View> */}
            <TouchableOpacity style={styles.button} onPress={leave}>
                <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: '#fff' }} source={require('../../assets/call_drop.png')} />
            </TouchableOpacity>
            {/* <View
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}>
                {isJoined ? (
                    <Text>Local user uid: {uid}</Text>
                ) : (
                    <Text>Join a channel</Text>
                )}
                {isJoined && remoteUid !== 0 ? (
                    <Text>Remote user uid: {remoteUid}</Text>
                ) : (
                    <Text>Waiting for a remote user to join</Text>
                )}
                <Text>{message}</Text>
            </View> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: 'red',
        margin: 5,
        fontSize: 12,
        height: 55,
        width: 55,
        borderRadius: 120,
        alignSelf: 'center'
    },
    main: { flex: 1, alignItems: 'center', backgroundColor: '#000', },
    scroll: { backgroundColor: '#000', width: '100%' },
    scrollContainer: { alignItems: 'center' },
    videoView: { width: '90%', height: 200 },
    btnContainer: { flexDirection: 'row', justifyContent: 'center' },
    head: { fontSize: 20, color: '#fff' },
});

export default CallingScreen;
