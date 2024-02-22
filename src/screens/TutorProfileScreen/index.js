/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import RNRestart from 'react-native-restart';
import Spinner from 'react-native-loading-spinner-overlay';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { showMessage } from "react-native-flash-message";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import apps from '../../../package.json';
import Share from 'react-native-share';
const API_KEYS = 'AIzaSyDIpZFQnU2tms1EdAqK-H9K4PfNN17zLdc';

const TutorProfileScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [reffrelCode, setReffrelCode] = React.useState('');


    function trackMaps(data) {
        navigate.navigate('TrackingMapsScreen', data);
    }

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'getProfile',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setReffrelCode(response?.data?.user?.user_id);
                setData(response.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const logoutX = () => {
        Alert.alert(
            'Logged Out',
            'Are you sure, want to Logged Out?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => loggoutUser() },
            ]
        );
    }

    const showSuccessToast = (msg) => {
        Toast.show({
            type: 'success',
            text1: 'Comming Soon',
            text2: msg,
        });
        // navigate.replace('UserEditProfileScreen', { screenType: 'OldUser' });
    }

    const loggoutUser = async () => {
        let keys = [];
        try {
            keys = await AsyncStorage.getAllKeys();
            console.log(`Keys: ${keys}`) // Just to see what's going on
            await AsyncStorage.multiRemove(keys);
            showMessage({
                message: "Loggout Successfull!",
                description: "Congratulations, Loggout successfully!",
                type: "success",
            });
            RNRestart.restart();
            navigate.reset();
        } catch (e) {
            console.log(e)
        }
        console.log('Done')
    }

    const openPrivacyPolicy = async () => {
        // InAppBrowser.mayLaunchUrl(url, ["Other urls that user might open ordered by priority"]);
        try {
            const oldStyle = StatusBar.pushStackEntry({ barStyle: 'dark-content', animated: false });
            await InAppBrowser.open(globle.PRIVACY_POLICY)
            StatusBar.popStackEntry(oldStyle);
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    const ShareApp = () => {
        const options = Platform.select({
            default: {
                title: 'Tuitionbot *Help to Find Tuition',
                message: `Tuitionbot helps parents/students to find the best tutors or teachers for home tuition and online classes. Please Use My Reffrel Code ${reffrelCode} And you Earn Reward and Points, AppLink :https://play.google.com/store/apps/details?id=com.createdinam.professionbeat`,
                url: 'https://play.google.com/store/apps/details?id=com.createdinam.professionbeat'
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

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => trackMaps(item)} style={{ padding: 5, borderWidth: item.trip_activate === true ? 1 : 0, borderColor: item.trip_activate === true ? 'green' : 'red', marginBottom: 5, margin: 5, borderRadius: 5 }}>
                <Text>{JSON.stringify(item.driver_location)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{item.pick_point}</Text>
                    <Text>{item.drop_point}</Text>
                </View>
                <View>
                    <Text>{item.driver_Name}</Text>
                    <Text>{item.drop_point}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 5, zIndex: 9999, paddingBottom: 80 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigate.navigate('HomeBottomNavigation')} style={{ position: 'absolute', left: 10, top: 50, zIndex: 999, backgroundColor: '#0066cc', borderRadius: 140 }}>
                    <Image style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: '#fff' }} source={require('../../assets/previous.png')} />
                </TouchableOpacity>
                <Image
                    style={[styles.coverPhoto, { resizeMode: 'cover' }]}
                    source={require('../../assets/back_school.png')}
                />
            </View>
            <View
                style={[styles.profileContainer, { borderTopLeftRadius: 20, maxBodyLength: 10, borderTopRightRadius: 20, }]}>
                <Image
                    style={[styles.profilePhoto, { backgroundColor: '#fff', borderRadius: 150, borderColor: '#0066cc', borderWidth: 1, resizeMode: 'contain' }]}
                    source={{ uri: globle.IMAGE_BASE_URL + data?.user?.profile_image }}
                />
                <Text style={styles.nameText}>{data?.user?.name === null ? 'N/A' : data?.user?.name}</Text>
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.bioText}>{data?.user?.email === null ? 'N/A' : data?.user?.email}</Text>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigate.navigate('EditTutorProfileScreen', { screenType: 'editProfile' })}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 5 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/driver_profile.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10, flex: 1 }}>Edit Profile</Text>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: Number(data?.user?.tutor_is_update) > 1 ? null : 'red' }} source={require('../../assets/verified.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('QualificationScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/books.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10, flex: 1 }}>Qualification</Text>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: Number(data?.user?.tutor_is_update) > 2 ? null : 'red' }} source={require('../../assets/verified.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('TutorExperienceScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/exp_logo.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10, flex: 1 }}>Experience</Text>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: Number(data?.user?.tutor_is_update) === 4 ? null : 'red' }} source={require('../../assets/verified.png')} />
                </TouchableOpacity> 
                <TouchableOpacity
                    onPress={() => navigate.navigate('CashBackTransactionScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/money-back.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10, flex: 1 }}>Cashback & History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('TransactionHistoryScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/tuition_icon.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10, flex: 1 }}>Transaction History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('TuitorMyPostScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/document_icon.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>My Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('MyTuitorPostScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/document_icon.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>My Tuitions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('ConfirmTuitionScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/verified.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Confirm Tuitions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => ShareApp()}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/share.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('HelpOrSupportScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/help.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Help & Support</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => ShareApp()}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000000' }} source={require('../../assets/referral_bonus.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Refer & Earn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate.navigate('SettingScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/setting.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Setting</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openPrivacyPolicy()}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/driver_profile.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Terms & Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: '100%', borderRadius: 5, marginTop: 15, elevation: 5 }]} onPress={() => logoutX()}>
                    <Text style={[styles.buttonText, { textTransform: 'uppercase' }]}>Log Out</Text>
                </TouchableOpacity>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>App Version {apps.version}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        alignItems: 'center',
    },
    coverPhoto: {
        width: '100%',
        height: 250,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: -50,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    bioContainer: {
        padding: 5,
    },
    bioText: {
        fontSize: 16,
        textAlign: 'center'
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    statContainer: {
        alignItems: 'center',
        flex: 1,
    },
    statCount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 16,
        color: '#999',
    },
    button: {
        with: '100%',
        backgroundColor: '#000000',
        borderRadius: 5,
        padding: 15,
        marginHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
};

export default TutorProfileScreen;