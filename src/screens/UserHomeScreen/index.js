/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import axios from 'axios';
import globle from '../../../common/env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
// import { PermissionModal, PermissionItem } from "react-native-permissions-modal";
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RadioGroup from 'react-native-radio-buttons-group';
const UserHomeScreen = () => {

    const permModal = useRef();
    const navigate = useNavigation();
    const [data, setData] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
<<<<<<< HEAD
=======
    const [loading, setLoading] = React.useState(false);
>>>>>>> 8c00bfc58f190ece3840e0d474829c45c86224c3
    const [visiblePopup, setVisiblePopup] = React.useState(false);
    const [scheduleCall, setScheduleCall] = React.useState(false);
    const [TimeSlotPopul, setTimeSlotPopup] = React.useState(false);
    const [tutionEndPopup, setTutEndPopup] = React.useState(false);
    const [feedbackPopup, setFeedbackPopup] = React.useState(false);
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

    useFocusEffect(
        React.useCallback(() => {
            getTutorPostForUser();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getTutorPostForUser = async () => {
        console.log('getTutorPostForUser');
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-post',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('getTutorPostForUser', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response.data?.data);
                console.log('getTutorPostForUser', JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

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

    const renderHistoryView = (item) => {
        console.log("item", item)
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, padding: 15, margin: 5, borderColor: '#000', borderWidth: 0.8, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setTimeSlotPopup(!TimeSlotPopul)}>
                            <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/profile_picture.jpeg')} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ justifyContent: 'center', fontSize: 15 }} numberOfLines={1}>Rajeev Gupta</Text>
                            {/* <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4' }} numberOfLines={1}>B-Tech, 4+ Years Exp</Text> */}
                            <TouchableOpacity style={{ marginRight: 5, flexDirection: 'row', marginLeft: 8 }} onPress={() => setScheduleCall(!scheduleCall)}>
                                <Image style={{ width: 15, height: 15, resizeMode: 'contain', alignItems: 'center' }} source={require('../../assets/green_check.png')} />
                                <Text style={{ fontSize: 12, color: 'green', fontWeight: '500', marginLeft: 8, marginBottom: -10 }}>Verified</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => setVisiblePopup(!visiblePopup)}
                    >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center' }} source={require('../../assets/star.png')} />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => startTrip()} style={{ width: 30, height: 30, borderRadius: 150, marginTop: -40, marginLeft: 10 }}>
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, tintColor: '#000', alignItems: 'center' }} source={require('../../assets/share.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Qualification: </Text>
                                <Text style={{ fontSize: 12 }}>B.Sc., M.Sc</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Board: </Text>
                                <Text style={{ fontSize: 12 }}>CBSE, UP</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Class: </Text>
                                <Text style={{ fontSize: 12 }}>5th to 10th </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Subject: </Text>
                                <Text style={{ fontSize: 12 }}>Science, Math</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Experience: </Text>
                                <Text style={{ fontSize: 12 }}>5+ years</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>City: </Text>
                                <Text style={{ fontSize: 12 }}>Agra</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, marginTop: -5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}>English spoken: </Text>
                                <Text style={{ fontSize: 12 }}>Yes</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}> </Text>
                                <Text style={{ fontSize: 12 }}></Text>
                            </View>

                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Locality: </Text>
                                <Text style={{ fontSize: 12 }}>Izzatnagar</Text>

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Fee: </Text>
                                <Text style={{ fontSize: 12 }}>Rs 2500/mo</Text>

                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        {/* <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} /> */}
                        <Text style={{ fontSize: 12, paddingLeft: 8 }}>2.5 km away</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setVisible(!visible)} style={{ flex: 1, padding: 5, backgroundColor: 'rgb(254,92,54)', borderRadius: 8, elevation: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>Schedule call </Text>
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

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Pratik Sahu',
            value: 'Pratik Sahu'
        },

    ]), []);

    const [selectedId, setSelectedId] = useState();

    return (
        <View style={{ flex: 1 }}>
            <View
                contentContainerStyle={{ padding: 5, zIndex: 9999 }}
                style={{ flex: 1, marginTop: 20, padding: 20, backgroundColor: '#F1F6F9' }}>
                <CommonHeader />
                {/* <TouchableOpacity onPress={() => startTrip()} style={{ width: '100%', height: 50 }}>
                    <Text style={{ height: 50, borderRadius: 50, borderWidth: 1, borderColor: '#F1F6F9', paddingLeft: 20, backgroundColor: 'rgb(68,114,199)', elevation: 3, paddingTop: 15, fontWeight: 'bold', color: '#fff' }}>Search</Text>
                    <View style={{ position: 'absolute', right: 10, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 5, tintColor: '#fff' }} source={require('../../assets/search_icon.png')} />
                    </View>
                </TouchableOpacity> */}
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
                    <Text style={{ flex: 1, fontSize: 14 }}>City</Text>
                    {/* <TouchableOpacity style={{}} onPress={() => navigate.navigate('TripHistoryScreen')}>
                        <Text style={{ fontWeight: 'bold', fontSize: 11, color: 'rgb(68,114,199)' }}>View All</Text>
                    </TouchableOpacity> */}
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
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 250, borderColor: '#000', borderWidth: 1 }}
            // dialogTitle={<DialogTitle title="n" />}
            // footer={
            //     <DialogFooter>
            //         {/* <DialogButton
            //             text="CANCEL"
            //             onPress={() => setVisible(!visible)}
            //         /> */}
            //         <DialogButton
            //             text="OK"
            //             onPress={() => setVisible(!visible)}
            //             style={{backgroundColor:'blue'}}
            //         />
            //     </DialogFooter>
            // }
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 15, alignSelf: 'center', width: '93%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>Complete your profile and apply for tuition before schedule a call</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgb(68,114,199)', borderRadius: 10, width: '28%', alignSelf: 'center', marginTop: 35 }}
                            onPress={() => setVisible(!visible)}>
                            <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>Ok</Text>
                        </TouchableOpacity>
                        {/* <View>
                                <Text>1- Seeking new tuition</Text>
                                <Text>2- Have new career option</Text>
                                <Text>3- Low fee</Text>
                                <Text>4- Found better tuition</Text>
                                <Text>5- Others</Text>
                            </View> */}

                        {/* <View>
                            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Feedback and Remarks:</Text>
                            <TextInput multiline={true} style={{ height: 120, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', padding: 5, paddingLeft: 10 }} placeholder='Feedback and Remarks here' />
                        </View> */}
                    </View>
                </DialogContent>
            </Dialog>

            <Dialog
                visible={visiblePopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 250, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 15, alignSelf: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Apply for tuition before schedule a call</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 8, backgroundColor: 'rgb(68,114,199)', borderRadius: 8, width: '40%', alignSelf: 'center', marginTop: 20 }}
                            onPress={() => setVisiblePopup(!visiblePopup)}>
                            <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12 }}>​​Apply Now</Text>
                        </TouchableOpacity>
                    </View>
                </DialogContent>
            </Dialog>

            <Dialog
                visible={scheduleCall}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 250, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 0, alignSelf: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Select the post to schedule the call</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-around', marginTop: 8, borderColor: '#000', borderWidth: 1, borderRadius: 10, alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <RadioGroup
                                    radioButtons={radioButtons.map((button) => ({
                                        ...button,
                                        style: {
                                            borderColor: '#000', // Change the border color to black
                                            // You can also adjust other styles as needed here
                                        },
                                    }))}
                                    onPress={setSelectedId}
                                    selectedId={selectedId}
                                    size={8} // Adjust the size to your preference
                                    color={'red'}
                                />
                                <View style={{ marginLeft: 42, marginBottom: 10 }}>
                                    <Text>7th</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 8 }}>
                                <Text style={{}}>Science</Text>
                            </View>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={TimeSlotPopul}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 190, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 0, alignSelf: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Choose your preferred time slot for cal</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <TouchableOpacity onPress={() => setTimeSlotPopup(!TimeSlotPopul)}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/profile_picture.jpeg')} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ justifyContent: 'center', fontSize: 15 }} numberOfLines={1}>Rajeev Gupta</Text>
                                {/* <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4' }} numberOfLines={1}>B-Tech, 4+ Years Exp</Text> */}
<<<<<<< HEAD

                            </View>

=======
                            </View>
>>>>>>> 8c00bfc58f190ece3840e0d474829c45c86224c3
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/cal.png')} />
                            <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12 }}>24 Sep 2023   Sunday</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3, marginTop: 4 }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/clock.png')} />
                            <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12 }}>05:30PM to 07:00PM</Text>
                        </View>
                        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 15, padding: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fff', backgroundColor: 'rgb(254,92,54)', width: '40%' }}
<<<<<<< HEAD
                            
=======
                            onPress={() => setTutEndPopup(!tutionEndPopup)}
>>>>>>> 8c00bfc58f190ece3840e0d474829c45c86224c3
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </DialogContent>
            </Dialog>

            <Dialog
                visible={tutionEndPopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 200, borderColor: '#000', borderWidth: 1 }}
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 0, alignSelf: 'center', width: '80%' }}>
                            <Text style={{ fontSize: 16, textAlign: 'center', paddingTop: 20 }}>Want to end tuition with Rajeev Gupta?</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', width: '99%', justifyContent: 'space-around', marginTop: 20 }}>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(254,92,54)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%' }}
                                onPress={() => setFeedbackPopup(!feedbackPopup)}
                            >
                                <Text style={{ color: '#fff', alignSelf: 'center' }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%' }}
                                onPress={() => setTutEndPopup(!tutionEndPopup)}
                            >
                                <Text style={{ color: '#fff', alignSelf: 'center' }}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={feedbackPopup}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 80, height: Dimensions.get('screen').width - 30, borderColor: '#000', borderWidth: 1 }}
            // dialogTitle={<DialogTitle title="n" />}
            // footer={
            //     <DialogFooter>
            //         {/* <DialogButton
            //             text="CANCEL"
            //             onPress={() => setVisible(!visible)}
            //         /> */}
            //         <DialogButton
            //             text="OK"
            //             onPress={() => setVisible(!visible)}
            //             style={{backgroundColor:'blue'}}
            //         />
            //     </DialogFooter>
            // }
            >
                <DialogContent>
                    <View>
                        <View style={{ marginTop: 15, marginBottom: 10 }}>
                            <Text style={{ fontSize: 14 }}>Reason to end tuition (select anyone)</Text>
                        </View>

                        <View>
                            <Text style={{ fontSize: 12 }}>1- Seeking new tuition</Text>
                            <Text style={{ fontSize: 12 }}>2- Have new career option</Text>
                            <Text style={{ fontSize: 12 }}>3- Low fee</Text>
                            <Text style={{ fontSize: 12 }}>4- Found better tuition</Text>
                            <Text style={{ fontSize: 12 }}>5- Others</Text>
                        </View>

                        <View>
                            <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 12 }}>Feedback and Rating:</Text>
                            <View style={{ alignSelf: 'center' }}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140, tintColor: 'yellow' }} source={require('../../assets/star.png')} />
                            </View>
                        </View>
                        <View>
                            <Text style={{ marginTop: 20, marginBottom: 10, fontSize: 12 }}>Tutors feedback:</Text>
                            <TextInput multiline={true} style={{ height: 40, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', }} />
                        </View>
<<<<<<< HEAD
                        <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%',alignSelf:'center',marginTop:15 }}
                            onPress={() => setFeedbackPopup(!feedbackPopup)}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center',fontSize:14 }}>Done</Text>
=======
                        <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 4, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '28%', alignSelf: 'center', marginTop: 15 }}
                            onPress={() => setFeedbackPopup(!feedbackPopup)}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 14 }}>Done</Text>
>>>>>>> 8c00bfc58f190ece3840e0d474829c45c86224c3
                        </TouchableOpacity>
                    </View>
                </DialogContent>
            </Dialog>
        </View>
    );
};
// 
export default UserHomeScreen;