/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Dimensions,
    View,
    TouchableOpacity,
    Image,
    Text,
    FlatList 
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TutorHeader from '../../components/TutorHeader';
import styles from './styles';

const TutorNotificationScreen = () => {

    const navigate = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(false);
    const [NotificationData, setNotificationData] = React.useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getNotificationUser();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    const setCallNotification = async (item) => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('parent_id', item?.reqsted_user_id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        fetch(globle.API_BASE_URL + 'tutor-call-back', requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('setCallNotification---------->', JSON.stringify(result) + JSON.stringify(requestOptions));
                if (result.status) {
                    setLoading(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                } else {
                    setLoading(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error--->', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false);
            });
    }

    const renderHistoryView = ({ item }) => {

        console.log(JSON.stringify(item))

        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, margin: 5, borderRadius: 10, elevation: 5 }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginRight: 15 }}>
                            <Image style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/clock.png')} />
                            <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12 }}>{getTimesAgo(item?.created_date)}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3, width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: 5, flex: 1 }}>
                            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '500', paddingLeft: 15, }}>{item?.trans_desc}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setCallNotification(item)} style={{ borderRadius: 5, marginLeft: 30, marginTop: 10, alignSelf: 'flex-end', marginRight: 20, marginBottom: 15 }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5, tintColor: 'rgb(68,114,199)' }} source={require('../../assets/call_icon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    // api/get_notification

    const getNotificationUser = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get_globally_all_notification',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        // console.log('getTutorPostForUser', config);
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    setIsFetching(false);
                    setNotificationData(response?.data?.data);
                } else {
                    setNotificationData([]);
                    Toast.show({
                        type: 'error',
                        text1: 'Opps!',
                        text2: response?.data?.message,
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const onRefresh = () => {
        getNotificationUser();
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            <View>
                {NotificationData?.length > 0 ? <FlatList
                    style={{ height: Dimensions.get('screen').height / 1.2 }}
                    data={NotificationData}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                    onRefresh={() => onRefresh()}
                    refreshing={isFetching}
                    showsVerticalScrollIndicator={false}
                /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                    <Text>No data found</Text>
                </View>}
            </View>
        </View>
    );
};

export default TutorNotificationScreen;