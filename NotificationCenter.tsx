// @ts-nocheck
import { Animated, Easing, Text, TouchableOpacity, View, Image } from 'react-native';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import React, { FC } from 'react';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';

const NotificationCenter: FC<Props> = () => {

    const [
        message,
        setMessage,
    ] = React.useState<null | FirebaseMessagingTypes.RemoteMessage>(null);

    const transition = React.useRef<Animated.Value>(new Animated.Value(300)).current;

    const exitAnim = React.useRef(
        Animated.timing(transition, {
            duration: 55000,
            easing: Easing.in(Easing.exp),
            toValue: 300,
            useNativeDriver: true,
        }),
    ).current; // 1234@4321

    React.useEffect(() => {
        const unsubscribe = messaging().onMessage((remoteMessage) => {
            console.log('Message handled in the foreground!', remoteMessage);
            if (remoteMessage.notification) {
                onDisplayIncomingCall();
            }
        });

        const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
            onDisplayIncomingCall();
        });

        return () => {
            unsubscribe();
            unsubscribeBackground();
        };
    }, [transition, exitAnim]);

    if (!message || !message.notification) {
        return null;
    }


    async function onDisplayIncomingCall() {
        try {
            let caller_id = null;
            caller_id = uuid.v4();
            RNCallKeep.displayIncomingCall(caller_id, 'c8c7c7c7c7cchh3', localizedCallerName = 'Lisa Pinto', handleType = '847387d7d6gd', hasVideo = false, options = null);
        } catch (err) {
            console.error('initializeCallKeep error:', err.message);
        }
    }

    const BookingAccept = async (info) => {
        setMessage(null);
        console.log('BookingAccept', JSON.stringify(info));
    }

    /// from kha se -->> to kha tk 


    const BookingReject = async (info) => {
        setMessage(null);
        console.log('BookingReject', JSON.stringify(info));
    }

    return (
        <View style={{ padding: 20, position: 'absolute', bottom: 50, left: 0, right: 0, zIndex: 9999, backgroundColor: '#FEFCFF', alignItems: 'center', borderRadius: 10, margin: 5, elevation: 5 }}>
            <Animated.View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                {/* <Image style={{ height: 50, width: 50, resizeMode: 'contain', alignSelf: 'center' }} source={require('./src/assets/auto_icon.png')} /> */}
                <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>
                    {message.notification.title}
                </Text>
                <Text style={{ padding: 10, textAlign: 'center' }}>
                    {message.notification.body}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => BookingReject(message)}
                        style={{ flex: 1, marginRight: 2 }}>
                        <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'orange', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Cancel Booking
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => BookingAccept(message)}
                        style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'green', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Accept Booking
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

export default NotificationCenter;