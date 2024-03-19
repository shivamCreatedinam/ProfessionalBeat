import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import CommonHeader from '../../components/CommonHeader';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useFocusEffect, useNavigation } from "@react-navigation/native";

const ConfirmedTuitionScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
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

    const getTransaction = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-post-for-conformation',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                console.log('get-post-for-conformation', JSON.stringify(response?.data?.data));
                if (response?.data?.status) {
                    setLoading(false);
                    setDataTransaction(response?.data?.data);
                    console.log('get-post-for-conformation', JSON.stringify(response?.data?.data));
                } else {
                    setDataTransaction([]);
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
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

    const sendConformation = async (confirm_id, status) => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('confirm_id', confirm_id);
        formdata.append('status', status);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('onRequestIncomingCall', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'change-status-for-confirmation', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    getTransaction();
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
                setLoading(false)
            });
    }

    const renderHistoryView = (items) => {

        return (
            <View style={{ padding: 10, backgroundColor: '#fff', margin: 5, elevation: 5, borderRadius: 15 }}>
                <Text style={{ marginTop: 5 }}>{items?.item?.locality} -- {items?.item?.posted_by}</Text>
                <Text style={{ marginTop: 5 }}>{items?.item?.created_date}</Text>
                <Text style={{ marginTop: 5 }}>{items?.item?.state_name}</Text>
                <Text style={{ marginTop: 5 }}>{items?.item?.city_name}</Text>
                <Text style={{ marginTop: 5 }}>{items?.item?.user_id}</Text>
                <View>
                    {items?.item?.child?.map((items) =>
                        <Text>{items?.child_name}</Text>
                    )}
                </View>
                <Text style={{ marginTop: 5 }}>{items?.item?.pincode}</Text>
                <Text style={{ marginTop: 5 }}>{items?.item?.is_confirmed}</Text>
                {items?.item?.is_confirmed === 'Confirmed' ? null :
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <TouchableOpacity onPress={() => sendConformation(items?.item?.confirm_id, 'Cancel')} style={{ flex: 1, padding: 10, marginRight: 5, backgroundColor: '#FFA500', elevation: 5, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', color: '#ffffff', textTransform: 'uppercase' }}>Cancel Tuition</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendConformation(items?.item?.confirm_id, 'Confirm')} style={{ flex: 1, padding: 10, marginRight: 5, backgroundColor: 'green', elevation: 5, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', color: '#ffffff', textTransform: 'uppercase' }}>Confirm Tuition</Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        )
    }


    return (
        <View style={{ flex: 1, paddingTop: 30, backgroundColor: '#000000' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 5, backgroundColor: '#F1F6F9', height: Dimensions.get('screen').height }}>
                <CommonHeader />
                <View style={{ margin: 10, borderRadius: 5 }}>
                    {DataTransaction.length > 0 ?
                        <FlatList
                            style={{}}
                            data={DataTransaction}
                            keyExtractor={(e) => e.id}
                            renderItem={(items) => renderHistoryView(items)}
                            onRefresh={() => onRefresh()}
                            refreshing={isFetching}
                            ListFooterComponent={() => <View style={{ marginBottom: 180 }} />}
                            showsVerticalScrollIndicator={false}
                        /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                            <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                        </View>}
                </View>
            </View>
        </View>
    )
}

export default ConfirmedTuitionScreen;