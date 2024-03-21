import React, { useRef, useState } from 'react';
import { Text, StyleSheet, View, SafeAreaView, ScrollView, PermissionsAndroid, Platform, Dimensions, TouchableOpacity, } from 'react-native';
import Toast from 'react-native-toast-message';
import { createAgoraRtcEngine, ClientRoleType, IRtcEngine, ChannelProfileType } from 'react-native-agora';
import database from '@react-native-firebase/database';
import { useCountdown, CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useNavigation, useRoute } from "@react-navigation/native";
import Globle from '../../../common/env';
import { Image } from 'react-native-elements';

const uid = 0;

const CallPickScreen = () => {

    const routes = useRoute();
    const navigate = useNavigation();
    let haveData = JSON.parse(routes?.params);
    const RevertCxtUser = `calling/${haveData?.data?.id}`;
    console.warn('CallingScreen_routes->', haveData);
    const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [IsSwitched, setIsSwitched] = useState(false); // Indicates if the local user has joined the channel
    const [isMuted, setisMuted] = useState(false);
    // dynamice token
    const [token, setCallToken] = useState(haveData?.data?.call_token);
    const [channelName, setCallChannel] = useState(haveData?.data?.channel_id);
    // Uid of the remote user
    const [callerName, setCallerName] = useState(haveData?.notification?.title);
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user
    const [volume, setVolume] = useState(10); // volume to the user
    const [counter, setCounter] = useState(0); // volume to the user
    const [saveCallStatus, setCallStatus] = useState('');

    // timer
    const {
        path,
        pathLength,
        stroke,
        strokeDashoffset,
        remainingTime,
        elapsedTime,
        size,
        strokeWidth,
    } = useCountdown({ isPlaying: true, duration: 7, colors: '#abc' });

    function showMessage(msg: string) {
        setMessage(msg);
    }

    React.useEffect(() => {
        const dataRef = database().ref(RevertCxtUser);
        try {
            dataRef.on('value', (snapshot: any) => {
                if (snapshot.val()?.status === 0) {
                    console.warn('Calling_call_parents')
                    setCallStatus('Calling....');
                } else if (snapshot.val()?.status === 1) {
                    console.warn('picked_call_parents')
                    setCallStatus('connected');
                } else if (snapshot.val()?.call_disconnect_tuitor === 1) {
                    console.warn('disconnectd_call_parents')
                    leave();
                } else if (snapshot.val()?.status === 3) {
                    console.warn('mute_call_parents');
                    setCallStatus('Mute Call');
                }
            });
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }, []);


    // main function call connect
    const callconnected = async () => {
        const userDetails = {
            status: 1,
        }
        database()
            .ref(RevertCxtUser)
            .update(userDetails)
            .then(() => {
                console.log('saveLoation', true);
            });
        join();
    }

    // main function call disconnect
    const callDisconnected = async () => {
        const userDetails = {
            status: 2,
            call_disconnect_tuitor: 0,
            call_disconnect_parents: 1
        }
        database()
            .ref(RevertCxtUser)
            .update(userDetails)
            .then(() => {
                console.log('saveLoation_parents', true);
                Toast.show({
                    type: 'success',
                    text1: 'Call Disconnected',
                    text2: 'Your Call is Disconnected Successfully!',
                });
            });
        leave();
        removeKeyDelete();
        navigate.goBack();
    }

    const removeKeyDelete = async () => {
        database().ref(RevertCxtUser).remove();
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
                onUserJoined: (_connection: any, Uid: any) => {
                    showMessage('Remote user joined with uid ' + Uid);
                    setRemoteUid(Uid);
                },
                onUserOffline: (_connection: any, Uid: any) => {
                    showMessage('Remote user left the channel. uid: ' + Uid);
                    setRemoteUid(0);
                },
            });
            agoraEngine.initialize({
                appId: Globle.AppIdAgora,
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
        engine.initialize({ appId: Globle.AppIdAgora });
        console.warn('All Setup Done');
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
            callDisconnected();
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

    if (counter === 0) {
        setCounter(1)
        callconnected();
    }

    return (
        <SafeAreaView style={styles.main}>
            <Image style={{ height: 120, width: 120, resizeMode: 'contain', marginTop: 90 }} source={require('../../assets/notification_logo.png')} />
            <Text adjustsFontSizeToFit={true} style={styles.head}>{callerName}</Text>
            <Text style={[styles.head, { marginBottom: Dimensions.get('screen').width / 2, fontSize: 12, marginTop: 5 }]}>{saveCallStatus}</Text>
            <ScrollView
                style={[styles.scroll, { display: 'none' }]}
                contentContainerStyle={styles.scrollContainer} >
                {isJoined ? (
                    <Text style={{ color: '#fff' }}>Local user uid: {uid}</Text>
                ) : (
                    <Text style={{ color: '#fff' }}>Join a channel</Text>
                )}
                {isJoined && remoteUid !== 0 ? (
                    <Text style={{ color: '#fff' }}>Remote user uid: {remoteUid}</Text>
                ) : (
                    <Text style={{ color: '#fff' }}>Waiting for a remote user to join</Text>
                )}
                <Text style={{ color: '#fff' }}>{message}</Text>
            </ScrollView>
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
            {isJoined === true ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={() => setisMuted(!isMuted)}>
                    <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: saveCallStatus === 'Mute Call' ? 'grey' : '#fff' }} source={require('../../assets/mute-icon.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => setIsSwitched(!IsSwitched)}>
                    <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: '#fff' }} source={require('../../assets/speaker_icon.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={leave}>
                    <Image style={{ width: 40, height: 40, alignSelf: 'center', alignContent: 'center', marginLeft: 8, marginTop: 8, tintColor: '#fff' }} source={require('../../assets/call_drop.png')} />
                </TouchableOpacity>
            </View> : <TouchableOpacity style={[{ backgroundColor: 'rgb(68,114,199)', width: Dimensions.get('screen').width, height: Dimensions.get('screen').width }]} onPress={join}>
                <View>
                    <Text style={{ textAlign: 'center', marginTop: Dimensions.get('screen').width / 4, fontWeight: 'bold', textTransform: 'capitalize', color: '#ffffff', fontSize: 22 }}>Click To Join Call</Text>
                </View>
            </TouchableOpacity>}
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
    head: { fontSize: 16, color: '#fff', marginTop: 20 },
});

export default CallPickScreen;
