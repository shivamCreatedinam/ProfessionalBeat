/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  createAgoraRtcEngine,
  ClientRoleType,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import Globle from './common/env';

const appId = '3d117a30950e4724a73c9f8b07aef599';
const channelName = 'KBC1';
const token = '0063d117a30950e4724a73c9f8b07aef599IAASZYYa9rTp1u+8H8Fxaq5fOU/8zphU1JYxuwTakLMBdnJFxZQh39v0IgDhDgEAnCjTZQQAAQAs5dFlAwAs5dFlAgAs5dFlBAAs5dFl';
const uid = 0;

const App = () => {

  const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [IsSwitched, setIsSwitched] = useState(false); // Indicates if the local user has joined the channel
  const [isMuted, setisMuted] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user
  const [volume, setVolume] = useState(10); // volume to the user

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
      <Text style={styles.head}>Agora Voice Calling Quickstart</Text>
      <View style={styles.btnContainer}>
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
      </View>
      <ScrollView
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
    fontSize: 12,
  },
  main: { flex: 1, alignItems: 'center' },
  scroll: { flex: 1, backgroundColor: '#ddeeff', width: '100%' },
  scrollContainer: { alignItems: 'center' },
  videoView: { width: '90%', height: 200 },
  btnContainer: { flexDirection: 'row', justifyContent: 'center' },
  head: { fontSize: 20 },
});

export default App;