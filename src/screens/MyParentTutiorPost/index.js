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
    Text,
    Alert,
    Dimensions,
    FlatList,
    Image,
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import TutorHeader from '../../components/TutorHeader';
import Toast from 'react-native-toast-message';
import styles from './styles';
import moment from 'moment';

const MyTuitorPostScreen = () => {

    const navigate = useNavigation();
    const [value, setValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(false);
    const [DataTransaction, setDataTransaction] = React.useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getTransaction();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    const getTransaction = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-tutor-shortlisted-post',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('get-tutor-shortlisted-post', JSON.stringify(config));
        axios.request(config)
            .then((response) => {
                console.log('get-tutor-shortlisted-post', JSON.stringify(response?.data));
                if (response?.data?.status) {
                    setLoading(false);
                    setDataTransaction(response?.data?.data);
                } else {
                    setDataTransaction([]);
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

    const sendConfirmationRequest = async (ids) => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'send-request-for-conformation?id=' + ids,
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('sendConfirmationRequest', JSON.stringify(config));
        axios.request(config)
            .then((response) => {
                console.log('sendConfirmationRequest', JSON.stringify(response?.data));
                getTransaction();
                if (response?.data?.status) {
                    setLoading(false);
                } else {
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
        getTransaction();
    }

    const renderHistoryView = (items) => {
        return (
            <View style={{ display: items?.item?.is_confirmed !== "Confirmed" ? 'none' : 'flex', padding: 10, backgroundColor: '#fff', margin: 5, elevation: 5, borderRadius: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                    <Text style={{ marginTop: 5, flex: 1, fontWeight: 'bold' }}>Name: {items?.item?.posted_by}</Text>
                    <Text style={{ marginTop: 5, fontWeight: 'bold' }}>Status {items?.item?.is_request_sent === 0 ? 'No Status' : items?.item?.is_confirmed}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                    <Text style={{ marginTop: 5, flex: 1 }}>From Class {items?.item?.from_class_name}</Text>
                    <Text style={{ marginTop: 5 }}>To Class {items?.item?.to_class_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                    <Text style={{ marginTop: 5, flex: 1 }}>State {items?.item?.state_name}</Text>
                    <Text style={{ marginTop: 5 }}>City {items?.item?.city_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                    <Text style={{ marginTop: 5, fontWeight: 'bold', flex: 1 }}>Locality {items?.item?.locality}</Text>
                    <Text style={{ marginTop: 5 }}>{getTimesAgo(items?.item?.created_date)}</Text>
                </View>
                {items?.item?.is_confirmed === 'Confirmed' ? null :
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
                        <TouchableOpacity
                            disabled={items?.item?.is_request_sent === 0 ? false : true}
                            onPress={() => sendConfirmationRequest(items?.item?.short_id)}
                            style={{ flex: 1, padding: 10, marginRight: 5, backgroundColor: items?.item?.is_request_sent === 0 ? 'green' : 'grey', elevation: 5, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', color: '#ffffff', textTransform: 'uppercase' }}>Send Request</Text>
                        </TouchableOpacity>
                    </View>}
            </View>)
    }

    return (
        <View style={{ backgroundColor: '#F1F6F9', flex: 1 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 20, alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>My Tuition</Text>
            </View>
            <View style={{ margin: 10, borderRadius: 5 }}>
                <FlatList
                    style={{}}
                    data={DataTransaction}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                    onRefresh={() => onRefresh()}
                    refreshing={isFetching}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => <View style={{ marginBottom: 180 }} />}
                />
            </View>
        </View>
    )
};

export default MyTuitorPostScreen;