/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../components/CommonHeader';
import styles from './styles';

const FavourtePostScreen = () => {

    const navigate = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [FavourteData, setFavourteData] = React.useState([]);
    const [historyData, setHistoryData] = React.useState([
        { id: 1, name: 'Prashant Verma' },
        { id: 2, name: 'Prashant Verma' },
        { id: 3, name: 'Prashant Verma' },
        { id: 4, name: 'Prashant Verma' },
        { id: 5, name: 'Prashant Verma' },
        { id: 6, name: 'Prashant Verma' },
    ]);

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

    const getNotificationUser = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'my_favourite_list',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        // console.log('getTutorPostForUser', config);
        axios.request(config)
            .then((response) => {
                // console.log('getTutorPostForUser', JSON.stringify(response.data));
                if (response?.data?.status) {
                    setLoading(false);
                    setFavourteData(response?.data?.data);
                } else {
                    setFavourteData([]);
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

    async function onDisplayIncomingCall(post_id) {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('post_id', post_id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('updateFcmToken', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'parent_request_for_call', requestOptions)
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
                console.log('error--->', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }


    async function onRemoveToFavourite(post_id) {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('post_id', post_id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('updateFcmToken', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'remove_to_favourite', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('onRemoveToFavourite', JSON.stringify(result))
                if (result.status) {
                    getNotificationUser();
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
                console.log('error--->', error);
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
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 20, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                    <Text style={{ flex: 1, marginLeft: 5, fontSize: 15, fontWeight: 'bold' }}>{getTimesAgo(items?.item?.created_date)}</Text>
                    {items.item?.favourite === 'Yes' ? <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => onRemoveToFavourite(items.item?.id)} >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center', tintColor: 'rgb(68,114,199)' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity> : <TouchableOpacity style={{ width: 30, height: 30, marginRight: 5, marginTop: -40 }}
                        onPress={() => onRemoveToFavourite(items.item?.id)} >
                        <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 8, alignItems: 'center', tintColor: 'rgb(68,114,199)' }} source={require('../../assets/star.png')} />
                    </TouchableOpacity>}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} />
                            <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{items?.item?.from_class_name} To {items?.item?.to_class_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} />
                            {items.item?.boards?.map((items) => <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{items?.board_name !== null ? items?.board_name : 'N/A'}</Text>)}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/books.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{items.item?.fees}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/english_speak.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{items?.item?.city_name}, {items?.item?.state_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/search_books.png')} />
                            {items.item?.subjects?.map((items) => <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{items?.subject_name !== null ? items?.subject_name : 'N/A'}, </Text>)}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/placeholder.png')} />
                            <Text style={{ fontWeight: 'bold' }}>{items?.item?.locality}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} />
                        <Text style={{ fontWeight: 'bold' }}>{items?.item?.id} km away</Text>
                    </View>
                    <TouchableOpacity onPress={() => onDisplayIncomingCall(items.item?.id)} style={{ flex: 1, padding: 10, backgroundColor: 'rgb(68,114,199)', elevation: 5, borderRadius: 60 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Request Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader />
            <View style={{ flex: 1 }}>
                {FavourteData?.length > 0 ?
                    <FlatList
                        style={{}}
                        data={FavourteData}
                        keyExtractor={(e) => e.id}
                        renderItem={(items) => renderHistoryView(items)}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => <View style={{ marginBottom: 80 }} />}
                    /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                        <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                    </View>}
            </View>
        </SafeAreaView>
    );
};

export default FavourtePostScreen;