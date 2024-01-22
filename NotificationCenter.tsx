// @ts-nocheck
import { Animated, Easing, Text, TouchableOpacity, View, Image } from 'react-native';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import React, { FC } from 'react'; 
import notifee, {
    AndroidImportance,
    AndroidBadgeIconType,
    AndroidVisibility,
    AndroidColor,
    AndroidCategory,
} from '@notifee/react-native';
import uuid from 'react-native-uuid';

import { convertSpeed } from 'geolib';

const NotificationCenter: FC<Props> = () => {

    // const [
    //     message,
    //     setMessage,
    // ] = React.useState<null | FirebaseMessagingTypes.RemoteMessage>(null);

    // const transition = React.useRef<Animated.Value>(new Animated.Value(300)).current;

    // const exitAnim = React.useRef(
    //     Animated.timing(transition, {
    //         duration: 55000,
    //         easing: Easing.in(Easing.exp),
    //         toValue: 300,
    //         useNativeDriver: true,
    //     }),
    // ).current; // 1234@4321

    // React.useEffect(() => {
    //     const unsubscribe = messaging().onMessage((remoteMessage) => {
    //         console.log('Message handled in the foreground!', remoteMessage);
    //         if (remoteMessage.notification) {
    //             onDisplayIncomingCall(remoteMessage);
    //         }
    //     });

    //     const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
    //         console.log('Message handled in the background!', remoteMessage);
    //         onDisplayIncomingCall();
    //     });

    //     return () => {
    //         unsubscribe();
    //         // unsubscribeBackground();
    //     };
    // }, [transition, exitAnim]);

    // if (!message || !message.notification) {
    //     return null;
    // }

    // const log = (text) => {
    //     console.info(text);
    //     setLog(logText + "\n" + text);
    // };

    // const addCall = (callUUID, number) => {
    //     setHeldCalls({ ...heldCalls, [callUUID]: false });
    //     setCalls({ ...calls, [callUUID]: number });
    // };

    // const removeCall = (callUUID) => {
    //     const { [callUUID]: _, ...updated } = calls;
    //     const { [callUUID]: __, ...updatedHeldCalls } = heldCalls;

    //     setCalls(updated);
    //     setHeldCalls(updatedHeldCalls);
    // };

    // const setCallHeld = (callUUID, held) => {
    //     setHeldCalls({ ...heldCalls, [callUUID]: held });
    // };

    // const setCallMuted = (callUUID, muted) => {
    //     setMutedCalls({ ...mutedCalls, [callUUID]: muted });
    // };

    // const displayIncomingCall = (number) => {
    //     const callUUID = getNewUuid();
    //     addCall(callUUID, number);

    //     log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

    //     RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
    // };

    // const displayIncomingCallNow = () => {
    //     displayIncomingCall(getRandomNumber());
    // };

    // const displayIncomingCallDelayed = () => {
    //     // BackgroundTimer.setTimeout(() => {
    //     displayIncomingCall(getRandomNumber());
    //     // }, 3000);
    // };

    // const answerCall = ({ callUUID }) => {
    //     const number = calls[callUUID];
    //     log(`[answerCall] ${format(callUUID)}, number: ${number}`);

    //     RNCallKeep.startCall(callUUID, number, number);

    //     BackgroundTimer.setTimeout(() => {
    //         log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
    //         RNCallKeep.setCurrentCallActive(callUUID);
    //     }, 1000);
    // };

    // const didPerformDTMFAction = ({ callUUID, digits }) => {
    //     const number = calls[callUUID];
    //     log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
    // };

    // const didReceiveStartCallAction = ({ handle }) => {
    //     if (!handle) {
    //         // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
    //         return;
    //     }
    //     const callUUID = getNewUuid();
    //     addCall(callUUID, handle);

    //     log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

    //     RNCallKeep.startCall(callUUID, handle, handle);

    //     // BackgroundTimer.setTimeout(() => {
    //     //   log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
    //     //   RNCallKeep.setCurrentCallActive(callUUID);
    //     // }, 1000);
    // };

    // const didPerformSetMutedCallAction = ({ muted, callUUID }) => {
    //     const number = calls[callUUID];
    //     log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

    //     setCallMuted(callUUID, muted);
    // };

    // const didToggleHoldCallAction = ({ hold, callUUID }) => {
    //     const number = calls[callUUID];
    //     log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

    //     setCallHeld(callUUID, hold);
    // };

    // const endCall = ({ callUUID }) => {
    //     const handle = calls[callUUID];
    //     log(`[endCall] ${format(callUUID)}, number: ${handle}`);

    //     removeCall(callUUID);
    // };

    // const hangup = (callUUID) => {
    //     RNCallKeep.endCall(callUUID);
    //     removeCall(callUUID);
    // };

    // const setOnHold = (callUUID, held) => {
    //     const handle = calls[callUUID];
    //     RNCallKeep.setOnHold(callUUID, held);
    //     log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

    //     setCallHeld(callUUID, held);
    // };

    // const setOnMute = (callUUID, muted) => {
    //     const handle = calls[callUUID];
    //     RNCallKeep.setMutedCall(callUUID, muted);
    //     log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

    //     setCallMuted(callUUID, muted);
    // };

    // const updateDisplay = (callUUID) => {
    //     const number = calls[callUUID];
    //     // Workaround because Android doesn't display well displayName, se we have to switch ...
    //     if (isIOS) {
    //         RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    //     } else {
    //         RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    //     }

    //     log(`[updateDisplay: ${number}] ${format(callUUID)}`);
    // };

    // React.useEffect(() => {
    //     RNCallKeep.addEventListener('answerCall', answerCall);
    //     RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
    //     RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
    //     RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
    //     RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
    //     RNCallKeep.addEventListener('endCall', endCall);

    //     return () => {
    //         RNCallKeep.removeEventListener('answerCall', answerCall);
    //         RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
    //         RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
    //         RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
    //         RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
    //         RNCallKeep.removeEventListener('endCall', endCall);
    //     }
    // }, []);


    // async function onDisplayIncomingCall(info) {
    //     try {
    //         let caller_id = null;
    //         caller_id = uuid.v4();
    //         console.log('calling....', JSON.stringify(info?.data?.user_type));
    //         console.log('calling....', JSON.stringify(info?.data?.reqsted_user_type));
    //         if (info?.data?.user_type === 'Parent') {
    //             RNCallKeep.displayIncomingCall(caller_id, 'c8c7c7c7c7cchh3', localizedCallerName = 'Monika Verma', handleType = '847387d7d6gd', hasVideo = false, options = null);
    //         } else {
    //             console.log('Not Tuitor');
    //             NotificationMeByTuitor();
    //         }
    //     } catch (err) {
    //         // console.error('initializeCallKeep error:', err.message);
    //     }
    // }

    // const NotificationMeByTuitor = async () => {
    //     // Create a channel (required for Android)
    //     const initialNotification = await notifee.getInitialNotification();
    //     if (initialNotification) {
    //         const channelId = await notifee.createChannel({
    //             id: 'default123',
    //             name: 'Default_Channel',
    //         });
    //         // Display a notification
    //         await notifee.displayNotification({
    //             title: 'Notification Title',
    //             body: 'Main body content of the notification',
    //             android: {
    //                 channelId,
    //                 smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
    //                 // pressAction is needed if you want the notification to open the app when pressed
    //                 pressAction: {
    //                     id: 'default',
    //                 },
    //             },
    //         });
    //     }
    // }

    // const BookingAccept = async (info) => {
    //     setMessage(null);
    //     console.log('BookingAccept', JSON.stringify(info));
    // }

    // /// from kha se -->> to kha tk 


    // const BookingReject = async (info) => {
    //     setMessage(null);
    //     console.log('BookingReject', JSON.stringify(info));
    // }

    // return (
    //     <View style={{ padding: 20, position: 'absolute', bottom: 50, left: 0, right: 0, zIndex: 9999, backgroundColor: '#FEFCFF', alignItems: 'center', borderRadius: 10, margin: 5, elevation: 5 }}>
    //         <Animated.View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
    //             {/* <Image style={{ height: 50, width: 50, resizeMode: 'contain', alignSelf: 'center' }} source={require('./src/assets/auto_icon.png')} /> */}
    //             <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>
    //                 {message.notification.title}
    //             </Text>
    //             <Text style={{ padding: 10, textAlign: 'center' }}>
    //                 {message.notification.body}
    //             </Text>
    //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                 <TouchableOpacity onPress={() => BookingReject(message)}
    //                     style={{ flex: 1, marginRight: 2 }}>
    //                     <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'orange', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
    //                         Cancel Booking
    //                     </Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity onPress={() => BookingAccept(message)}
    //                     style={{ flex: 1 }}>
    //                     <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'green', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
    //                         Accept Booking
    //                     </Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </Animated.View>
    //     </View>
    // );
}

export default NotificationCenter;