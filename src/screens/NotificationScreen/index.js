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
    TextInput,
    Pressable,
    FlatList,
    Text
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../components/CommonHeader';
import styles from './styles';

const NotificationScreen = () => {

    const navigate = useNavigation();
    const [loading, setLoading] = React.useState(false);
    const [NotificationData, setNotificationData] = React.useState([]);

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

    const renderHistoryView = ({ item }) => {
        console.log("item", item)
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, margin: 5, borderRadius: 10, elevation: 5 }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginRight: 15 }}>
                            <Image style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/clock.png')} />
                            <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12, flex: 1 }}>{getTimesAgo(item?.created_date)}</Text>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/bell_icon.png')} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3, width: '100%', justifyContent: 'space-between', marginBottom: 15 }}>
                        <View style={{ marginTop: 8, width: '100%' }}>
                            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '500', paddingLeft: 15, }}>{item?.types}</Text>
                            <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '500', paddingLeft: 15, }}>{item?.trans_desc}</Text>
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginLeft: 10, marginTop: 5 }}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140 }} source={{ uri: globle.IMAGE_BASE_URL + item?.user_details?.profile_image }} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 5, borderRadius: 5, width: '30%', marginLeft: 30, marginTop: 10, alignSelf: 'flex-end', marginRight: 10, marginBottom: 15 }}>
                        <Text style={{ textAlign: 'center', color: '#fff' }}>View Post</Text>
                    </TouchableOpacity> */}
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
                    setNotificationData(response?.data?.data);
                    // console.log('getTutorPostForUser', JSON.stringify(response.data));
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


    return (
        <View style={styles.container}>
            <CommonHeader />
            <View>
                {NotificationData?.length > 0 ? <FlatList
                    style={{ height: Dimensions.get('screen').height / 1.2 }}
                    data={NotificationData}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                    showsVerticalScrollIndicator={false}
                /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                    <Text>No data found</Text>
                </View>}

            </View>

        </View>
    );
};

export default NotificationScreen;