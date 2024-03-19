import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, FlatList, TextInput, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import prompt from 'react-native-prompt-android';
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import axios from 'axios';

const TransactionHistoryScreen = () => {

    const navigate = useNavigation();
    const [inputText, setInputText] = React.useState('');
    const [value, setValue] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(false);
    const [DataTransaction, setDataTransaction] = React.useState([]);

    useFocusEffect(
        React.useCallback(async () => {
            const valueX = await AsyncStorage.getItem('@autoUserGroup');
            let data = JSON.parse(valueX);
            setValue(data);
            loadProfile();
            getTransaction();
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
                console.log('Profile', JSON.stringify(response?.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

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

    const showAlertWithTextInput = () => {
        prompt(
            'Please Enter your UPI ID',
            'Enter your UPI ID to claim your ₹ 1000.00 in Reward Points',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: password => {
                        Toast.show({
                            type: 'success',
                            text1: 'Submit UPI ID: ' + password + ' Successfully',
                            text2: 'Payment Processing ... \n We will update you.',
                        });
                    }
                },
            ],
            {
                type: 'plain-text',
                cancelable: false,
                defaultValue: '',
                placeholder: 'Enter Your UPI ID...',
            }
        );
    };

    // api/get-order-transation

    return (
        <View style={{ backgroundColor: '#F1F6F9', flex: 1 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 20, alignItems: 'center', flexDirection: 'row', elevation: 5, backgroundColor: '#ffffff' }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>Transaction History</Text>
            </View>
            {/* <View style={{ padding: 5, backgroundColor: '#fff', elevation: 5, borderRadius: 5, margin: 10, }}>
                <Image style={{ height: 200, width: '100%', borderRadius: 5 }} source={require('../../assets/card_design.jpeg')} />
                <View style={{ position: 'absolute', left: 35, bottom: 30 }}>
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4, marginBottom: 4 }}>{value?.token.slice(value?.token.length - 15, -1)}</Text>
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4, marginBottom: 4 }}>Ankur Mishra</Text>
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4 }}>₹ 1000.00/-</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => showAlertWithTextInput()} style={{ backgroundColor: 'rgb(68,114,199)', paddingVertical: 10, paddingHorizontal: 5, borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                <Text style={{ textAlign: 'center', color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4 }}>Request Transfer</Text>
            </TouchableOpacity> */}
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