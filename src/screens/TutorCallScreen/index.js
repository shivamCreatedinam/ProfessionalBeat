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
    TouchableOpacity,
    Text,
    TextInput,
    Alert,
    Dimensions,
    Image,
    FlatList,
    SafeAreaView
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';
import TutorHeader from '../../components/TutorHeader';
import styles from './styles';

const TutorCallHistoryScreen = () => {

    const navigate = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [isFetching, setIsFetching] = React.useState(false);
    const [historyData, setHistoryData] = React.useState([]);

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    useFocusEffect(
        React.useCallback(() => {
            getNotificationUser();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const onRefresh = () => {
        getNotificationUser();
    }

    // api/get_notification

    const getNotificationUser = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get_notification',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        }; 
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    setHistoryData(response?.data?.data); 
                } else {
                    setHistoryData([]);
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


    const setCallNotification = async (info) => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        AsyncStorage.setItem('@tokenKey', fcmToken);
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('parent_id', info?.reqsted_user_id);
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
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                } else {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }



    const renderHistoryView = (items) => {
        return (
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 10, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ paddingRight: 10, alignItems: 'center', }}>
                        <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 150 }} source={{ uri: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg' }} />
                    </View>
                    <Text style={{ fontWeight: 'bold', flex: 1, marginRight: 6 }} numberOfLines={1}>{items?.item?.user_details?.name}</Text>
                    <View style={{ padding: 10, alignItems: 'center', }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/phone_call.png')} />
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold' }}>{items?.item?.trans_desc_me}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain' }} source={require('../../assets/time.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginLeft: 5 }}>{getTimesAgo(items?.item?.created_date)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setCallNotification(items?.item)} style={{ flex: 1, padding: 10, backgroundColor: 'rgb(68,114,199)', elevation: 5, borderRadius: 50 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            {visible ?
                <View style={{ flex: 1, }}>
                    <FlatList
                        style={{}}
                        data={historyData}
                        keyExtractor={(e) => e.id}
                        renderItem={(items) => renderHistoryView(items)}
                        onRefresh={() => onRefresh()}
                        refreshing={isFetching}
                        showsVerticalScrollIndicator={false}
                    />
                </View> :
                <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                </View>}
        </View>
    );
};

export default TutorCallHistoryScreen;