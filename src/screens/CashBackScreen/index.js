import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, FlatList, TextInput, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import prompt from 'react-native-prompt-android';
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import axios from 'axios';

const CashBackTransactionScreen = () => {

    const navigate = useNavigation();
    const [inputText, setInputText] = React.useState('');
    const [value, setValue] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [DataProfile, setDataProfile] = React.useState(null);
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
                setDataProfile(response?.data)
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
            url: globle.API_BASE_URL + 'cashback-transaction-list',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    setDataTransaction(response?.data?.data);
                    console.log('getTransaction', JSON.stringify(response?.data?.data));
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

    const updateUserDemoProfile = async (pass) => {
        if (pass !== null && pass.trim().length > 0) {
            setLoading(true)
            const valueX = await AsyncStorage.getItem('@autoUserGroup');
            let data = JSON.parse(valueX)?.token;
            var formdata = new FormData();
            formdata.append('upi_id', pass);
            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
                headers: {
                    'Authorization': 'Bearer ' + data
                }
            };
            console.log('uploadProfileeewwww', JSON.stringify(requestOptions))
            fetch(globle.API_BASE_URL + 'request-for-transfer-cashback', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('updateUserDemoProfile--->', JSON.stringify(result));
                    if (result.status) {
                        setLoading(false);
                        loadProfile();
                        Toast.show({
                            type: 'success',
                            text1: 'Submit UPI ID: ' + pass + ' Successfully',
                            text2: 'Payment Processing ... \n We will update you.',
                        });
                    } else {
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    console.log('error--->', error);
                    setLoading(false)
                });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Opps!',
                text2: 'Enter UPI ID',
            });
        }
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
        loadProfile();
    }

    const renderHistoryView = (items) => {
        return (
            <View style={{ padding: 15, backgroundColor: '#fff', margin: 5, elevation: 5, borderRadius: 15 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Cashback Amount : ₹ {items?.item?.amount}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Description : {items?.item?.description}</Text>
                </View>
            </View>
        )
    }

    const showAlertWithTextInput = () => {
        prompt(
            'Please Enter your UPI ID',
            `Enter your UPI ID to claim your ₹ ${DataProfile?.user?.wallet_amount} in Reward Points`,
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: password => updateUserDemoProfile(password)
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
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>Cashback & History</Text>
            </View>
            <View style={{ padding: 5, backgroundColor: '#fff', elevation: 5, borderRadius: 5, margin: 10, }}>
                <Image style={{ height: 200, width: '100%', borderRadius: 5 }} source={require('../../assets/card_design.jpeg')} />
                <View style={{ position: 'absolute', left: 35, bottom: 30 }}>
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4, marginBottom: 4 }}>{DataProfile?.user?.fcm_token.slice(DataProfile?.user?.fcm_token?.length - 15, -1)}</Text>
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4, marginBottom: 4 }}>{DataProfile?.user?.name}</Text>
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4 }}>₹ {DataProfile?.user?.wallet_amount}/-</Text>
                </View>
            </View>
            <TouchableOpacity disabled={DataProfile?.user?.transfer_status === 1 ? true : false} onPress={() => showAlertWithTextInput()} style={{ backgroundColor: DataProfile?.user?.transfer_status === 1 ? 'gray' : 'rgb(68,114,199)', paddingVertical: 15, paddingHorizontal: 5, borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                <Text style={{ textAlign: 'center', color: '#fff', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 4, fontSize: 15 }}>Request Transfer</Text>
            </TouchableOpacity>
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

export default CashBackTransactionScreen;