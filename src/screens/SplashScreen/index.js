/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    Platform,
    View,
    Text,
    BackHandler,
    Dimensions,
    Animated,
    Easing,
    ImageBackground,
    Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import backgroundImage from '../../assets/background_maps.png';
import styless from '../../../common/styles';
import notifee, { EventType } from '@notifee/react-native';
import BackgroundTimer from 'react-native-background-timer';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import {
    INPUT_RANGE_START,
    INPUT_RANGE_END,
    OUTPUT_RANGE_START,
    OUTPUT_RANGE_END,
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';
import globle from '../../../common/env';
import { Image } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const SplashAppScreen = () => {

    const initialValue = 0;
    const navigation = useNavigation();
    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);
    // calling setup
    const [logText, setLog] = React.useState('');
    const [UserDetails, setCallingUserDetails] = React.useState(null);
    const [heldCalls, setHeldCalls] = React.useState({}); // callKeep uuid: held
    const [mutedCalls, setMutedCalls] = React.useState({}); // callKeep uuid: muted
    const [calls, setCalls] = React.useState({}); // callKeep uuid: number

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                // setTimeout
                loadSessionStorage();
            }, 3000);
        }, [])
    );

    const loadSessionStorage = async () => {
        // autoUserType
        try {
            const valueX = await AsyncStorage.getItem('@autoUserType');
            const valueXX = await AsyncStorage.getItem('@autoDriverGroup');
            const value = await AsyncStorage.getItem('@autoUserGroup');
            console.log('loadSessionStorage->', valueX)
            if (valueX === 'Tutor') {
                console.log('addEventListener1', valueX);
                navigation.replace('HomeBottomNavigation');
                // navigation.replace('QualificationScreen');
            } else if (valueX === 'Parent') {
                console.log('addEventListener2', JSON.parse(value));
                navigation.replace('UserBottomNavigation');
            } else {
                console.log('loadSessionStorage', JSON.stringify(value));
                navigation.replace('LoginScreen');
            }
        } catch (e) {
            console.log('addEventListener3', JSON.stringify(e));
            // error reading value
        }
    }

    React.useEffect(() => {
        const backAction = () => {
            // Handle the back button press here
            // You can perform any necessary actions or navigate to a different screen
            Alert.alert(
                'Close Application',
                'Are you sure, Close Go Ride?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => { } },
                ]
            );
            // Return true to prevent the default back button behavior
            return true;
        };

        // Add the event listener for the hardware back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Clean up the event listener when the component is unmounted
        return () => backHandler.remove();
    }, []);

    React.useEffect(() => {
        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };
        translate();
    }, [translateValue]);

    const translateAnimation = translateValue.interpolate({
        inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
        outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    });

    // calling functions

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction } = detail;
        DeletePreviousChannel(notification);
        // Check if the user pressed the "Mark as read" action
        if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
            // Update external API
            DeletePreviousChannel(notification);
            // Remove the notification
            await notifee.cancelNotification(notification.id);
        }
    });

    const log = (text) => {
        console.info(text);
        setLog(logText + "\n" + text);
    };

    const addCall = (callUUID, number) => {
        setHeldCalls({ ...heldCalls, [callUUID]: false });
        setCalls({ ...calls, [callUUID]: number });
    };

    const removeCall = (callUUID) => {
        const { [callUUID]: _, ...updated } = calls;
        const { [callUUID]: __, ...updatedHeldCalls } = heldCalls;

        setCalls(updated);
        setHeldCalls(updatedHeldCalls);
    };

    const setCallHeld = (callUUID, held) => {
        setHeldCalls({ ...heldCalls, [callUUID]: held });
    };

    const setCallMuted = (callUUID, muted) => {
        setMutedCalls({ ...mutedCalls, [callUUID]: muted });
    };

    const displayIncomingCall = (number) => {
        const callUUID = getNewUuid();
        addCall(callUUID, number);

        log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

        RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
    };

    const displayIncomingCallNow = () => {
        displayIncomingCall(getRandomNumber());
    };

    const displayIncomingCallDelayed = () => {
        BackgroundTimer.setTimeout(() => {
            displayIncomingCall(getRandomNumber());
        }, 3000);
    };

    const answerCall = ({ callUUID }) => {
        const number = calls[callUUID];
        log(`[answerCall] ${format(callUUID)}, number: ${number}`);

        RNCallKeep.startCall(callUUID, number, number);
        callPickedAndHitApis(UserDetails);
        BackgroundTimer.setTimeout(() => {
            log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
            RNCallKeep.setCurrentCallActive(callUUID);
        }, 1000);
    };

    const didPerformDTMFAction = ({ callUUID, digits }) => {
        const number = calls[callUUID];
        log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
    };

    const didReceiveStartCallAction = ({ handle }) => {
        if (!handle) {
            // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
            return;
        }
        const callUUID = getNewUuid();
        addCall(callUUID, handle);

        log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

        RNCallKeep.startCall(callUUID, handle, handle);

        BackgroundTimer.setTimeout(() => {
            log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
            RNCallKeep.setCurrentCallActive(callUUID);
        }, 1000);
    };

    const didPerformSetMutedCallAction = ({ muted, callUUID }) => {
        const number = calls[callUUID];
        log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

        setCallMuted(callUUID, muted);
    };

    const didToggleHoldCallAction = ({ hold, callUUID }) => {
        const number = calls[callUUID];
        log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

        setCallHeld(callUUID, hold);
    };

    const endCall = ({ callUUID }) => {
        const handle = calls[callUUID];
        log(`[endCall] ${format(callUUID)}, number: ${handle}`);

        removeCall(callUUID);
    };

    const hangup = (callUUID) => {
        RNCallKeep.endCall(callUUID);
        removeCall(callUUID);
    };

    const setOnHold = (callUUID, held) => {
        const handle = calls[callUUID];
        RNCallKeep.setOnHold(callUUID, held);
        log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

        setCallHeld(callUUID, held);
    };

    const setOnMute = (callUUID, muted) => {
        const handle = calls[callUUID];
        RNCallKeep.setMutedCall(callUUID, muted);
        log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

        setCallMuted(callUUID, muted);
    };

    const updateDisplay = (callUUID) => {
        const number = calls[callUUID];
        // Workaround because Android doesn't display well displayName, se we have to switch ...
        if (isIOS) {
            RNCallKeep.updateDisplay(callUUID, 'New Name', number);
        } else {
            RNCallKeep.updateDisplay(callUUID, number, 'New Name');
        }
        log(`[updateDisplay: ${number}] ${format(callUUID)}`);
    };

    React.useEffect(() => {
        RNCallKeep.addEventListener('answerCall', answerCall);
        RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
        RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
        RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
        RNCallKeep.addEventListener('endCall', endCall);

        return () => {
            RNCallKeep.removeEventListener('answerCall', answerCall);
            RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
            RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
            RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
            RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
            RNCallKeep.removeEventListener('endCall', endCall);
        }
    }, []);

    const callPickedAndHitApis = async (info) => {
        try {
            const value = await AsyncStorage.getItem('theme');
            console.log('value', value);
        } catch (error) {
            console.log('error', error);
        };
    }

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        // Handle the background message here
        console.log('Received a background message', remoteMessage);
        onDisplayIncomingCall(remoteMessage);
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                onDisplayIncomingCall(remoteMessage);
            }
        })
        .catch(error => console.log('failed', error));

    messaging().onMessage(async remoteMessage => {
        console.log('foreground--->>', remoteMessage);
        onDisplayIncomingCall(remoteMessage);
        // saveToCallInfo(remoteMessage?.data?.user_type, remoteMessage?.data?.tutor_ids, remoteMessage?.data?.id, remoteMessage);
    });

    const saveToCallInfo = async (user_type, user_id, post_id, info) => {
        try {
            const valueX = await AsyncStorage.getItem('@autoUserGroup');
            let data = JSON.parse(valueX)?.token;
            var formdata = new FormData();
            formdata.append('user_type', user_type);
            formdata.append('tutor_id', user_id);
            formdata.append('post_id', post_id);
            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
                headers: {
                    'Authorization': 'Bearer ' + data
                }
            };
            console.log('saveToCallInfo', JSON.stringify(requestOptions))
            fetch(globle.API_BASE_URL + 'tutor-after-call-shortlisted-post', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('saveToCallInfo', JSON.stringify(result));
                    onDisplayIncomingCall(info);
                    if (result.status) {
                        Toast.show({
                            type: 'success',
                            text1: 'Congratulations!',
                            text2: result?.message,
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Something went wrong!',
                            text2: result?.message,
                        });
                    }
                })
                .catch((error) => {
                    console.log('error--->', error);
                    onDisplayIncomingCall(info);
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
                        text2: error,
                    });
                });
            // await AsyncStorage.setItem("@CallInfo", JSON.stringify(remoteMessage));
            // onDisplayIncomingCall(remoteMessage);
        } catch (error) {
            console.log('error', error);
        };
    };

    // normal notification
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        onDisplayIncomingCall(remoteMessage);
    });

    async function onDisplayIncomingCall(info) {
        try {
            let caller_id = null;
            caller_id = uuid.v4();
            console.log('calling....', JSON.stringify(info?.data?.user_type));
            if (info?.data?.user_type === 'Parent') {
                RNCallKeep.displayIncomingCall(caller_id, 'c8c7c7c7c7cchh3', localizedCallerName = 'Monika Verma', handleType = '847387d7d6gd', hasVideo = false, options = null);
            } else {
                console.log('Not Tuitor');
                DeletePreviousChannel(info);
            }
        } catch (err) {
            console.error('initializeCallKeep error:', err.message);
        }
    }

    const DeletePreviousChannel = async (info) => {
        console.log('DeletePreviousChannel')
        // delete channels
        try {
            const data = await notifee.getChannels();
            data.map((items) => {
                console.log('DeletePreviousChannel', items?.id);
                notifee.deleteChannel(items?.id);
            })
            console.log('DeletePreviousChannel', 'successfullyy ' + data.length);
            NotificationMeByTuitor(info);
        } catch (error) {
            console.log('DeletePreviousChannel', error);
        }
    }

    const NotificationMeByTuitor = async (info) => {
        // Create a channel (required for Android)
        console.log('1')
        const initialNotification = await notifee.getInitialNotification();
        console.log('2')
        console.log('3')
        const channelId = await notifee.createChannel({
            id: 'default1234',
            name: 'DefaultCallingChannel',
            playSound: true, // (optional) default: true
            soundName: 'noti_sound1', // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            vibrationPattern: [300, 500],
        });
        // Display a notification 
        await notifee.displayNotification({
            title: 'Recieve Call Request from ' + info?.data?.locality,
            body: 'You recieve call request from ' + info?.data?.locality + '',
            android: {
                channelId,
                smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
        console.log('5')
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ActivityIndicator style={{ position: 'absolute', alignItems: 'center', bottom: 160, alignSelf: 'center' }} color={'#FAD323'} size={'large'} />
            <View style={{ marginTop: Dimensions.get('screen').height / 6, alignItems: 'center' }}>
                <Image style={{ height: 250, width: 250, resizeMode: 'cover' }} source={require('../../assets/notification_logo.png')} />
            </View>
        </View>
    );
};


export default SplashAppScreen;