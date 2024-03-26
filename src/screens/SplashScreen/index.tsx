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
    BackHandler,
    Dimensions,
    Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import notifee, { AndroidImportance, AndroidBadgeIconType, AndroidVisibility, AndroidColor, AndroidCategory } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import uuid from 'react-native-uuid';
import globle from '../../../common/env';
import { Image } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';


const SplashAppScreen = () => {

    const navigation = useNavigation();
    const [message, setMessage] = React.useState('');

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
                'Are you sure, Close app?',
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

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        // Handle the background message here
        if (remoteMessage?.data?.call_token !== undefined) {
            DisplayIncomingCall(remoteMessage);
        } else {
            onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
        }
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage?.data?.call_token !== undefined) {
                DisplayIncomingCall(remoteMessage);
            } else {
                onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
            }
        })
        .catch(error => console.log('failed', error));

    messaging().onMessage(async remoteMessage => {
        if (remoteMessage?.data?.call_token !== undefined) {
            onDisplayIncomingCall(remoteMessage);
        } else {
            onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
        }
    });

    // normal notification
    messaging().onNotificationOpenedApp(async remoteMessage => {
        // onDisplayIncomingCall(remoteMessage);
        if (remoteMessage?.data?.call_token !== undefined) {
            DisplayIncomingCall(remoteMessage);
        } else {
            onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
        }
    });

    const saveToCallInfo = async (user_type: any, user_id: any, post_id: any, payload: any) => {
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
                    navigation.navigate('CallPickScreen', payload);
                })
                .catch((error) => {
                    console.log('error--->', error);
                });
        } catch (error) {
            console.log('error', error);
        };
    };

    async function onDisplayIncomingCall(info: any) {
        try {
            let caller_id = null;
            caller_id = uuid.v4();
            console.log('calling....cc', JSON.stringify(info?.data));
            if (info?.data?.user_type === 'Parent') {
                DisplayIncomingCall(info);
            } else {
                console.log('Not Tuitor');
                DeletePreviousChannel(info);
            }
        } catch (err) {
            console.error('initializeCallKeep error:', err);
        }
    }

    RNNotificationCall.addEventListener('answer', (data: any) => {
        RNNotificationCall.backToApp();
        const { callUUID, payload } = data;
        console.log('press answer______>', callUUID, payload);
        saveToCallInfo(payload?.data?.user_type, payload?.data?.tutor_ids, payload?.data?.id, payload);
    });

    RNNotificationCall.addEventListener('endCall', (data: any) => {
        const { callUUID, endAction, payload } = data;
        console.log('press endCall', callUUID, payload, endAction);
    });

    const DisplayIncomingCall = async (info: any) => {
        console.log('initializeCallKeep DisplayIncomingCall:1');
        RNNotificationCall.displayNotification(
            '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad',
            null,
            30000,
            {
                channelId: 'com.createdinam.professionbeat',
                channelName: info?.data?.locality,
                notificationIcon: 'ic_launcher', //mipmap
                notificationTitle: info?.notification?.title,
                notificationBody: info?.notification?.body,
                answerText: 'Answer',
                declineText: 'Decline',
                notificationColor: 'colorAccent',
                // notificationSound: null, //raw
                //mainComponent:'MyReactNativeApp',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
                payload: info
            }
        );
        console.error('initializeCallKeep DisplayIncomingCall:2');
    }

    async function onDisplayNotificationx(chids: any, title: any, body: any) {
        const info = {
            chids: chids,
            title: title,
            body: body,
        }
        console.log('onDisplayNotification-><><><><>', info);
        // Request permissions (required for iOS)
        if (Platform.OS === 'ios') {
            await notifee.requestPermission()
        }

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: chids,
            name: 'parihara_' + chids,
            sound: 'default',
            importance: AndroidImportance.HIGH,
            badge: true,
            vibration: true,
            vibrationPattern: [300, 700],
            lights: true,
            lightColor: AndroidColor.RED,
        });

        // Display a notification
        await notifee.displayNotification({
            title: title,
            body: body,
            android: {
                channelId,
                smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
                color: '#9c27b0',
                category: AndroidCategory.MESSAGE,
                badgeIconType: AndroidBadgeIconType.SMALL,
                importance: AndroidImportance.HIGH,
                visibility: AndroidVisibility.PUBLIC,
                vibrationPattern: [300, 700],
                ongoing: false,
                lights: [AndroidColor.RED, 300, 600],
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    const DeletePreviousChannel = async (info: any) => {
        console.log('onBackgroundEvent')
        // delete channels
        try {
            notifee.onBackgroundEvent(async ({ type, detail }) => {
                const { notification, pressAction } = detail;
                const channelId = await notifee.createChannel({
                    id: 'default1234',
                    name: 'DefaultCallingChannel',
                    playSound: true, // (optional) default: true
                    soundName: 'noti_sound1', // (optional) See `soundName` parameter of `localNotification` function
                    importance: 4, // (optional) default: 4. Int value of the Android notification importance
                    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                    vibrationPattern: [300, 500],
                });
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
            });
        } catch (error) {
            console.log('DeletePreviousChannel', error);
        }
    }

    function showMessage(msg: string) {
        setMessage(msg);
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