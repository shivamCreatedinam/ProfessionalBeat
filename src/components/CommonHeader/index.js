/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import styles from './styles';
import axios from 'axios';

const CommonHeader = () => {

    const navigate = useNavigation();
    const [userData, setTutorData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        // dutyOnOff();
        console.log('TutorHeader1');
        getProfileActiveStatus();
        return () => {
            // console.log('addEventListener'); 
        };
    }, []);

    const getProfileActiveStatus = async () => {
        console.log('TutorHeader2');
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
                    setLoading(false); // driver_activated.
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

    const openUserProfile = () => {
        navigate.navigate('UserProfileScreen');
    }

    const openUserCallProfile = () => {
        // CallHistoryScreen / CallingScreen
        navigate.navigate('CallHistoryScreen');
    }

    const openBellNotificationProfile = () => {
        navigate.navigate('NotificationScreen');
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 15 }}>
                <TouchableOpacity onPress={() => navigate.navigate('UserBottomNavigation')} style={{ flex: 1 }} >
                    <Image style={{ height: 35, width: '100%', resizeMode: 'contain' }} source={require('../../assets/flat_icon_app_removebg.png')} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => openBellNotificationProfile()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'rgb(68,114,199)', alignItems: 'center', elevation: 5, marginRight: 10 }}>
                    <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginTop: 8, tintColor: '#fff' }} source={require('../../assets/bell_notification.png')} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => openUserCallProfile()} style={{ width: 40, height: 40, borderRadius: 150, backgroundColor: 'rgb(68,114,199)', alignItems: 'center', elevation: 5, }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 10, tintColor: '#fff' }} source={require('../../assets/phone_call.png')} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => openUserProfile()} style={{ width: 40, height: 40, borderRadius: 150, backgroundColor: 'white', alignItems: 'center', elevation: 5, }}>
                    <Image style={{ width: 35, height: 35, resizeMode: 'contain', borderRadius: 150, marginTop: 2 }}
                        source={require('../../assets/notification_logo.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CommonHeader;