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
    FlatList,
    Image
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import TutorHeader from '../../components/TutorHeader';
import styles from './styles';


const SubscriptionScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState({});
    const [PackageData, setPackageData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [AvailableCalls, setAvailableCalls] = React.useState(null);

    useFocusEffect(
        React.useCallback(() => {
            getPaidSubscription();
            getSubscription();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    const getSubscription = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get_packages',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response.data?.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const getPaidSubscription = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-active-package',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setPackageData(response?.data?.data[0]);
                setAvailableCalls(response.data?.free_call);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const purchasePackage = async (id) => {
        console.log('purchasePackage', id);
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'tutor-purchase-package',
            data: {
                'package_id': id
            },
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'tutor-purchase-package',
            data: JSON.stringify({ "package_id": id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + data
            },
            json: true
        };
        console.log('purchasePackage', config);
        axios.request(authOptions)
            .then((response) => {
                setLoading(false)
                // setData(response.data?.data);
                Toast.show({
                    type: 'success',
                    text1: 'Buying Package Successfully',
                    text2: response.data?.message,
                });
                console.log('purchasePackage', JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const renderItem = (items) => {
        return (<View key={Number(items.index)} style={{ padding: 20, borderRadius: 10, backgroundColor: 'rgb(68,114,199)', flexGrow: 1, marginBottom: 40, elevation: 5 }}>
            <TouchableOpacity onPress={() => GenerateOrder(items?.item)} style={{ backgroundColor: '#fff', paddingHorizontal: 60, paddingVertical: 10, marginBottom: 20, borderRadius: 6, elevation: 5 }}>
                <Text style={{ fontWeight: 'bold', color: '#000' }}>{items?.item?.title} – Rs {items?.item?.amount} /mo</Text>
            </TouchableOpacity>
            <View style={{ marginBottom: 10 }}>
                {items?.item?.details.map((data) => {
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>{data?.pack_desc}</Text>
                        </View>
                    )
                })}
            </View>
        </View>)
    }

    const GenerateOrder = async (fullInfo) => {
        console.log('GenerateOrder', JSON.stringify(fullInfo));
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('package_id', fullInfo?.id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        fetch(globle.API_BASE_URL + 'tutor-purchase-package', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('getGeneratedOrder', JSON.stringify(result))
                if (result.status) {
                    paymentEnable(result?.razorpayOrderId, fullInfo, result?.order_number);
                } else {
                    setLoading(false)
                    Toast.show({
                        type: 'error',
                        text1: result?.message,
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error--->', error);
                Toast.show({
                    type: 'error',
                    text1: error,
                    text2: error,
                });
                setLoading(false)
            });
    }

    const paymentEnable = async (razorpayOrderId, info, order_number) => {
        // WN2My6OSHRTb82joB1QKyfis
        // key_secrate: PV2Cdatux4NC2NQsxvaLcj5G
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_ab2tkx2iprYBt8', // Your api key
            amount: (Number(info?.amount) * 100),
            order_id: razorpayOrderId,
            name: 'foo',
            prefill: {
                email: 'info@tutiorbot.com',
                contact: '9999888877',
                name: 'TutiorBot'
            },
            theme: { color: '#F37254' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            setLoading(false)
            console.log(`Success:`, JSON.stringify(data));
            PaymentSuccessFully(data, order_number)
        }).catch((error) => {
            // handle failure
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: 'Someting went wrong: ' + error.code,
                text2: error.description,
            });
            console.log(`Error: ${error.code} | ${error.description}`);
        });
    }

    const PaymentSuccessFully = async (fullInfo, order_number) => {
        console.log('PaymentSuccessFully', JSON.stringify(fullInfo?.razorpay_payment_id));
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('rzp_signature', fullInfo?.razorpay_signature);
        formdata.append('rzp_paymentid', fullInfo?.razorpay_payment_id);
        formdata.append('rzp_orderid', fullInfo?.razorpay_order_id);
        formdata.append('order_number', order_number);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        fetch(globle.API_BASE_URL + 'make-payment-success', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    console.log('PaymentSuccessFully', JSON.stringify(result?.message));
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    getPaidSubscription();
                    setLoading(false)
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

    const shareReffrelCode = async () => {

    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <TutorHeader />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 10, }}>
                <View style={{ padding: 10, backgroundColor: 'rgb(68,114,199)', marginBottom: 25, borderRadius: 15, width: '90%', elevation: 5, height: 170 }}>
                    <View style={{ padding: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: '#ffffff', flex: 1 }}>Current Package: {PackageData?.package_type}</Text>
                            <Text style={{ color: '#fff' }}>Order Id {PackageData?.order_number}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                            <Text style={{ flex: 1, color: '#fff', }}>{PackageData?.payment_status}</Text>
                            <View style={{ borderRadius: 150, borderWidth: 1, borderColor: '#fff', padding: 5, width: 35, height: 35, alignItems: 'center', elevation: 5, backgroundColor: 'rgb(68,114,199)' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }} adjustsFontSizeToFit={true}>{AvailableCalls}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0, paddingTop: 20 }}>
                            <Text style={{ flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 16 }}>₹ {PackageData?.amount} /-</Text>
                            <Text style={{ color: '#fff', }}>{getTimesAgo(PackageData?.created_date)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0, paddingTop: 10 }}>
                            <Text style={{ marginBottom: 10, color: '#ffffff' }} numberOfLines={1}>Transaction Id {PackageData?.transaction_signature}</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={data}
                    style={{ marginTop: 0 }}
                    keyExtractor={(id) => id}
                    renderItem={(items) => renderItem(items)}
                />
                <TouchableOpacity onPress={() => shareReffrelCode()} style={{ alignItems: 'center', padding: 20 }}>
                    <Text>Refer to any one person and get first <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>2 calls</Text> for free</Text>
                    <Text>Refer ID: <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>TM09B91</Text>  <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>Refer now</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SubscriptionScreen;