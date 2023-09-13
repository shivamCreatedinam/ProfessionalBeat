/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import {
    Image,
    Dimensions,
    View,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
// import { PermissionModal, PermissionItem } from "react-native-permissions-modal";
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

const UserHomeScreen = () => {

    const permModal = useRef();
    const navigate = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' }, { id: 2, name: 'Prashant Verma' }, { id: 3, name: 'Prashant Verma' }, { id: 4, name: 'Prashant Verma' }, { id: 5, name: 'Prashant Verma' }, { id: 6, name: 'Prashant Verma' }]);
    const [location, setLocation] = useState({ latitude: 60.1098678, longitude: 24.7385084, });

    const handleLocationPermission = async () => {
        let permissionCheck = '';
        if (Platform.OS === 'ios') {
            permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                );
                permissionRequest === RESULTS.GRANTED ? console.warn('Location permission granted.') : console.warn('Location perrmission denied.');
            }
        }

        if (Platform.OS === 'android') {
            permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                );
                permissionRequest === RESULTS.GRANTED
                    ? console.warn('Location permission granted.')
                    : console.warn('Location perrmission denied.');
            }
        }
    };

    const requestLocationPermission = async () => {
        try {
            const granted = await request(
                Platform.select({ android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, }),
                {
                    title: 'Parihara',
                    message: 'Parihara provide you with the best cab booking experience, we need your location. Granting location permission allows us to show you nearby drivers, estimate accurate arrival times, and ensure smooth navigation during your ride. Your safety is our top priority, and knowing your location helps us connect you with the nearest drivers',
                    // buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log('granted', granted);
            if (granted === 'granted') {
                console.log('You can use Geolocation');
                return true;
            } else {
                console.log('You cannot use Geolocation');
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    useEffect(() => {
        handleLocationPermission();
    }, []);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }, []);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        // permModal.current.openModal();
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const startTrip = () => {
        const options = Platform.select({
            default: {
                title: 'Hey',
                subject: 'Hey please',
                message: `Hey please share me`,
            },
        });
        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    const renderHistoryView = () => {
        return (
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 15, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/profile_picture.jpeg')} />
                        <View style={{ marginLeft: 6 }}>
                            <Text style={{ fontWeight: 'bold', flex: 1, marginBottom: -5 }} numberOfLines={1}>Richa Singh</Text>
                            <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4' }} numberOfLines={1}>B-Tech, 4+ Years Exp</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => startTrip()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'rgb(68,114,199)', alignSelf: 'center', elevation: 5, alignItems: 'center', marginRight: 5 }}>
                        <Image style={{ width: 12, height: 12, resizeMode: 'contain', marginTop: 8, tintColor: '#fff', alignItems: 'center' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => startTrip()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'rgb(68,114,199)', alignSelf: 'center', elevation: 5, alignItems: 'center', }}>
                        <Image style={{ width: 12, height: 12, resizeMode: 'contain', marginTop: 8, tintColor: '#fff', alignItems: 'center' }} source={require('../../assets/share.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} />
                            <Text style={{ fontWeight: 'bold' }}>CBSE, UP</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} />
                            <Text style={{ fontWeight: 'bold' }}>NC to 8th </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/books.png')} />
                            <Text style={{ fontWeight: 'bold' }}>CBSC</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/medium.png')} />
                            <Text style={{ fontWeight: 'bold' }}>5+ years</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/search_books.png')} />
                            <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>Science, Math, English</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/placeholder.png')} />
                            <Text style={{ fontWeight: 'bold' }}>Nagpur, Motinagar</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} />
                        <Text style={{ fontWeight: 'bold' }}>2.5 km away</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setVisible(!visible)} style={{ flex: 1, padding: 5, backgroundColor: 'rgb(88,136,54)', borderRadius: 20, elevation: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>Request Demo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const downloadHistoryPayment = () => {
        Toast.show({
            type: 'success',
            text1: 'Payment History Download!',
            text2: 'Payment History Send to your registerd Email!',
        });
    }

    const AddWalletPayment = () => {
        Toast.show({
            type: 'success',
            text1: 'Comming Soon',
            text2: 'Wallet Configuration Pending',
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <View
                contentContainerStyle={{ padding: 5, zIndex: 9999 }}
                style={{ flex: 1, marginTop: 20, padding: 20, backgroundColor: '#F1F6F9' }}>
                <CommonHeader />
                <TouchableOpacity onPress={() => startTrip()} style={{ width: '100%', height: 50 }}>
                    <Text style={{ height: 50, borderRadius: 50, borderWidth: 1, borderColor: '#F1F6F9', paddingLeft: 20, backgroundColor: 'rgb(68,114,199)', elevation: 3, paddingTop: 15, fontWeight: 'bold', color: '#fff' }}>Search</Text>
                    <View style={{ position: 'absolute', right: 10, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 5, tintColor: '#fff' }} source={require('../../assets/search_icon.png')} />
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                    <Text style={{ flex: 1, fontSize: 11, color: 'rgb(68,114,199)', fontWeight: 'bold' }}>Change Location</Text>
                    <TouchableOpacity style={{}} onPress={() => navigate.navigate('TripHistoryScreen')}>
                        <Text style={{ fontWeight: 'bold', fontSize: 11, color: 'rgb(68,114,199)' }}>View All</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <FlatList
                        style={{ height: Dimensions.get('screen').height / 1.55 }}
                        data={historyData}
                        keyExtractor={(e) => e.id}
                        renderItem={(items) => renderHistoryView(items)}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            <Dialog
                visible={visible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 60 }}
                dialogTitle={<DialogTitle title="Want to end tuition" />}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="CANCEL"
                            onPress={() => setVisible(!visible)}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => setVisible(!visible)}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent>
                    <View>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Reasons:</Text>
                            <View>
                                <Text>1- Seeking new tuition</Text>
                                <Text>2- Have new career option</Text>
                                <Text>3- Low fee</Text>
                                <Text>4- Found better tuition</Text>
                                <Text>5- Others</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Feedback and Remarks:</Text>
                            <TextInput multiline={true} style={{ height: 120, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', padding: 5, paddingLeft: 10 }} placeholder='Feedback and Remarks here' />
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        </View>
    );
};
// 
export default UserHomeScreen;