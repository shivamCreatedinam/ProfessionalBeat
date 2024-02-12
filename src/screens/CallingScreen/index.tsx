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
import Toast from 'react-native-toast-message';
import {
    createAgoraRtcEngine,
    ClientRoleType,
    IRtcEngine,
    ChannelProfileType,
} from 'react-native-agora';
import database from '@react-native-firebase/database';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCountdown, CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import axios from 'axios';
import { Image } from 'react-native-elements';

const appId = '3d117a30950e4724a73c9f8b07aef599';
// const channelName = 'calling_testing_tester';
// const token = '007eJxTYOjS0Kg69PfIbG2+OV/SL3xaFfHz+iyNmiWW4Qv3n7SomSmnwGCcYmhonmhsYGlqkGpibmSSaG6cbJlmkWRgnpiaZmppaTNzSWpDICODscZ2BkYoBPHFGJITc3Iy89LjS1KLS2B0ahEDAwBNPifB';
const uid = 0;

const CallingScreen = () => {

    const routes = useRoute();
    const navigate = useNavigation();
    const RevertCxtUser = `calling/${routes?.params?.callerId}`;
    console.warn('CallingScreen_routes', JSON.stringify(routes.params?.Name))
    const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [IsSwitched, setIsSwitched] = useState(false); // Indicates if the local user has joined the channel
    const [isMuted, setisMuted] = useState(false);
    const [saveCallStatus, setCallStatus] = useState('');
    // dynamice token
    const [token, setCallToken] = useState(routes.params?.callTokenOne);
    const [channelName, setCallChannel] = useState(routes.params?.channelName);

    const [callerName, setCallerName] = useState(routes.params?.Name);
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user
    const [volume, setVolume] = useState(10); // volume to the user 

    function showMessage(msg: string) {
        setMessage(msg);
    }

    React.useEffect(() => {
        const dataRef = database().ref(RevertCxtUser);
        try {
            dataRef.on('value', (snapshot: any) => {
                if (snapshot.val()?.status === 0) {
                    console.warn('disconnectd_call');
                    setCallStatus('Calling....');
                } else if (snapshot.val()?.status === 1) {
                    console.warn('picked_call');
                    setCallStatus('connected');
                } else if (snapshot.val()?.status === 2) {
                    console.warn('disconnectd_call');
                    if (snapshot.val()?.callPrevious === 1) {

                    } else {
                        callDisconnected();
                    }
                } else if (snapshot.val()?.status === 3) {
                    console.warn('mute_call');
                    setCallStatus('Mute Call');
                }
            });
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }, []);

    const callDisconnected = async () => {
        const userDetails = {
            status: 2,
            callPrevious: 1,
        }
        database()
            .ref(RevertCxtUser)
            .update(userDetails)
            .then(() => {
                console.log('saveLoation', true);
                Toast.show({
                    type: 'success',
                    text1: 'Call Disconnected',
                    text2: 'Your Call is Disconnected Successfully!',
                });
                navigate.goBack();
            });
    }

    React.useEffect(() => {
        // Initialize Agora engine when the app starts 
        setupVoiceSDKEngine();
        join()
        console.warn('routes-----------------------><><>', JSON.stringify(routes?.params))
        // setCallNotification(routes.params?.callerId, routes.params?.callTokenOne, routes.params?.channelName);
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
                    agoraEngineRef.current?.muteRemoteAudioStream(Uid, false);
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
        agoraEngineRef.current?.setDefaultAudioRouteToSpeakerphone(true); // Disable the default audio route.
        agoraEngineRef.current?.setEnableSpeakerphone(true); // Enable or disable the speakerphone temporarily.
    }, [IsSwitched]);

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            callDisconnected();
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

    const setMuteEnable = () => {
        if (isMuted) {
            setisMuted(false);
            console.log('isMuted', false);
            agoraEngineRef.current?.muteRemoteAudioStream(remoteUid, false);
        } else {
            setisMuted(true);
            console.log('isMuted', true);
            agoraEngineRef.current?.muteRemoteAudioStream(remoteUid, true);
        }
        const userDetails = {
            status: isMuted === false ? 1 : 3,
        }
        database()
            .ref(RevertCxtUser)
            .update(userDetails)
            .then(() => {
                console.log('saveLoation', true);
            });
    }

    const setSpeakerEnable = () => {

    }

    return (
        <SafeAreaView style={styles.main}>
            <Image style={{ height: 120, width: 120, resizeMode: 'contain', marginTop: 90 }} source={require('../../assets/notification_logo.png')} />
            <Text style={styles.head}>{callerName}</Text>
            <Text style={[styles.head, { marginBottom: Dimensions.get('screen').width / 2, fontSize: 12, marginTop: 5 }]}>{saveCallStatus}</Text>
            <View style={{ marginBottom: 40 }}>
                <CountdownCircleTimer
                    isPlaying
                    size={100}
                    strokeWidth={6}
                    rotation={'counterclockwise'}
                    duration={500}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[300, 200, 100, 0]}
                    onComplete={() => {
                        // do your stuff here
                        callDisconnected();
                    }}
                >
                    {({ remainingTime }) => <Text style={{ color: '#fff' }}>{remainingTime}</Text>}
                </CountdownCircleTimer>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {saveCallStatus === 'connected' || saveCallStatus === 'Mute Call' ?
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={() => setMuteEnable()}>
                            <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: saveCallStatus === 'Mute Call' ? 'grey' : '#fff' }} source={require('../../assets/mute-icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => setSpeakerEnable()}>
                            <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: '#fff' }} source={require('../../assets/speaker_icon.png')} />
                        </TouchableOpacity>
                    </View> : null
                }
                <TouchableOpacity style={styles.button} onPress={leave}>
                    <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: '#fff' }} source={require('../../assets/call_drop.png')} />
                </TouchableOpacity>
            </View>
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
