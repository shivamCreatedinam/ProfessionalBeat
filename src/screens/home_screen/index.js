/**
 * Sample React Native App
 * https://github.com/facebook/react-native 
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    View,
    FlatList,
    Text,
    Image,
    Dimensions,
    ImageBackground,
} from 'react-native';
import axios from 'axios';
<<<<<<< HEAD
import { useNavigation } from '@react-navigation/native';
=======
import { useNavigation, useFocusEffect } from '@react-navigation/native';
>>>>>>> 8c00bfc58f190ece3840e0d474829c45c86224c3
import TutorHeader from '../../components/TutorHeader';
import globle from '../../../common/env';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';


<<<<<<< HEAD


=======
>>>>>>> 8c00bfc58f190ece3840e0d474829c45c86224c3
const propertyData = [{
    id: '1',
    image: 'https://www.sacredyatra.com/wp-content/uploads/2016/03/Yamunotri-Location.jpg',
    price: 'Individual tuition at parent’s home',
    address: '123 Main St',
    squareMeters: '150',
    beds: '3 Days ago',
    baths: '54 min',
    parking: '122 Km'
}];

const HomeScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [alert, setAlert] = React.useState(false);
    let [driverData, setDriverData] = React.useState(false);
    const [dutyStatus, setDutyStatus] = React.useState('Off');
    const [driver_activated, setDriverActivated] = React.useState(false);
    const [errorMsg, setErrorMessage] = React.useState('');
    const [userData, setTutorData] = React.useState(null);
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [location, setLocation] = React.useState({ latitude: 60.1098678, longitude: 24.7385084, });
    const [Pickupstate, setPickupState] = React.useState({ pickupCords: {} });
    const [searchText, setSearchText] = React.useState('');
    const handleSearch = (text) => {
        setSearchText(text);
    }


    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        // dutyOnOff();
        // getProfileActiveStatus();
        return () => {
            // console.log('addEventListener'); 
        };
    }, []);

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

    const sendNotification = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer AAAAPtYIrjk:APA91bH08K8usDvoiH-R45u8w-2TPvGQE7up5wR1O63QstD2QdrpSFeukpg9MtUcTTQ19y05M8D7PUK6H2CV4TiuQyL-7MjhfmDhb1ChfcsjqgENIhzYP2VZeahGe6t_R4m1kgzIIP_K");

        var raw = JSON.stringify({
            "to": "dBEJqVryRwS5YKmeFOJsPn:APA91bFhI4X2EeDWZ1LmcnLu47-uUMfokr30WUUSg5ux7q5PSsI5w149e1XDKrVsyPoojCTnax0_DCE9nzLzh2MXVUsKa0mqn7aeyh-QU70pfu64P_amTcMIZmSsDgeYtjNqQ6x6uneq",
            "notification": {
                "title": "Hello Test",
                "body": "Some body",
                "sound": "noti_sound1.wav",
                "android_channel_id": "new_email_arrived_channel"
            },
            "content_available": true,
            "priority": "high"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    const getProfileActiveStatus = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        console.log('ProfileActiveStatus', data);
        let url_driverProfile = globle.API_BASE_URL + 'getProfile';
        setLoading(true);
        var authOptions = {
            method: 'get',
            maxBodyLength: Infinity,
            url: url_driverProfile,
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false); // driver_activated
                    console.log('ProfileActiveStatus', response.data?.user?.profile_image);
                    setTutorData(response.data?.user);
                    // setDriverActivated(response.data?.driver_activated);
                    // setErrorMessage(response.data?.message);
                } else {
                    setLoading(false);
                    console.log('ProfileActiveStatusX', response.data);
                    // setDriverActivated(response.data?.driver_activated);
                    // setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });

    }


    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
            <View style={styles.cardFooter}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/history.png')} />
                <Text style={styles.beds}>{item.beds}</Text>
                <TouchableOpacity>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', padding: 10, marginRight: 15 }} source={require('../../assets/star.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/share.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
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
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/routes.png')} />
                <Text style={{ flex: 1, marginLeft: 10 }}>2.5 km away</Text>
                <TouchableOpacity onPress={() => setAlert(true)} style={{ flex: 1, padding: 10, backgroundColor: '#22A699', elevation: 5, borderRadius: 60 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Call</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const dutyOnOff = async (status) => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'duty-on-off';
        setLoading(true);
        var authOptions = {
            method: 'POST',
            url: url_driverProfile,
            data: JSON.stringify({ "status": status === true ? 'On' : 'Off', 'driver_id': data?.id }),
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.message === 'Duty On Successfully.') {
                    setLoading(false);
                    setDutyStatus('On')
                    setVisible(status);
                    statusOnOFF(response.data.message)
                } else {
                    setDutyStatus('Off')
                    statusOnOFF(response.data.message)
                    setDriverActivated(response.data?.driver_activated);
                    setErrorMessage(response.data?.message);
                    setVisible(!status);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const filteredData = propertyData.filter((item) => {
        return item.address.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <View style={{ flex: 1, marginTop: 25, backgroundColor: '#000000' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 0, backgroundColor: '#000000', height: Dimensions.get('screen').height }}>
                <View
                    style={{ flex: 1, padding: 10, backgroundColor: '#F1F6F9' }}
                    contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                    <TutorHeader />
                    {/* <View style={[styles.searchInputContainer, { marginTop: 0 }]}>
                        <View>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Request..."
                                onChangeText={handleSearch}
                                placeholderTextColor={'#000'}
                                value={searchText}
                            />
                            <TouchableOpacity style={{ position: 'absolute', right: 25, top: 12 }}>
                                <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('../../assets/search_icon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    {propertyData.length > 0 ?
                        <FlatList
                            contentContainerStyle={styles.propertyListContainer}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', marginTop: Dimensions.get('screen').width / 3 }}>
                            <Image style={{ width: 300, height: 300, resizeMode: 'cover' }} source={require('../../assets/no_record.png')} />
                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000' }}>No Request Found</Text>
                        </View>}
                </View>
                <Dialog
                    visible={alert}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    dialogStyle={{ width: Dimensions.get('screen').width - 60 }}
                    dialogTitle={<DialogTitle title="Calling" />}
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="CANCEL"
                                onPress={() => setAlert(false)}
                            />
                            <DialogButton
                                text="OK"
                                onPress={() => setAlert(false)}
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent>
                        <View>
                            <View>
                                <Text style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 20, fontSize: 18 }}>Do you want to call Pratik Shahu?</Text>
                                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12 }}>Calling time: <Text style={{ fontWeight: 'bold', }}>9AM to 9pm only</Text></Text>
                            </View>
                        </View>
                    </DialogContent>
                </Dialog>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'black'
    },
    searchInputContainer: {
        paddingHorizontal: 10,
        borderBottomColor: 'grey',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        marginBottom: 10,
        fontSize: 11,
        paddingLeft: 20,
        elevation: 5
    },
    propertyListContainer: {
        paddingHorizontal: 20,
        height: Dimensions.get('screen').height
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    image: {
        height: 150,
        marginBottom: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    cardBody: {
        marginBottom: 10,
        padding: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5
    },
    address: {
        fontSize: 16,
        marginBottom: 5
    },
    squareMeters: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666'
    },
    cardFooter: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    beds: {
        fontSize: 14,
        color: '#000000',
        flex: 1,
        marginLeft: 10
    },
    baths: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    },
    parking: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    }
});

export default HomeScreen;