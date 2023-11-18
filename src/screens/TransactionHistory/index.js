import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import axios from 'axios';

const TransactionHistoryScreen = () => {

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

    const getTransaction = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-order-transation',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    setDataTransaction(response?.data?.data);
                    console.log('getNotificationUser', JSON.stringify(response?.data?.data));
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

    const saveFeedBack = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure, you want to Delete Account. All Data & Details Delete Permanently?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => console.log('cancel') },
            ]
        );
    }

    const onRefresh = () => {
        getTransaction();
    }

    const renderHistoryView = (items) => {
        return (
            <View style={{ padding: 10, backgroundColor: '#fff', margin: 5, elevation: 5, borderRadius: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Order ID </Text><Text style={{ flex: 1 }}>{items?.item?.order_number}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Amount </Text><Text >₹{items?.item?.amount}/-</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Calls </Text><Text style={{ flex: 1 }}>{items?.item?.free_call}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Status </Text>
                    <Text>{items?.item?.payment_status}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>ID </Text>
                    <Text style={{ flex: 1 }}>{items?.item?.transaction_id}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Package </Text>
                    <Text>{items?.item?.package_type}</Text>
                </View>
                <Text numberOfLines={1} style={{ marginTop: 5 }}>{items?.item?.transaction_signature}</Text>
            </View>
        )
    }

    // api/get-order-transation

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
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>Transaction History</Text>
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
                />
            </View>
        </View>
    )
}

export default TransactionHistoryScreen;