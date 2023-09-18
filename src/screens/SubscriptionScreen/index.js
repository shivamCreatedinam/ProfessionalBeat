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
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import TutorHeader from '../../components/TutorHeader';
import styles from './styles';
import { Image } from 'react-native-elements';

const SubscriptionScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState({});
    const [loading, setLoading] = React.useState(false);


    useFocusEffect(
        React.useCallback(() => {
            getSubscription();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

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
        console.log('GetSubscription', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response.data?.data);
                console.log('GetSubscription', JSON.stringify(response.data));
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

        return (<View style={{ padding: 20, borderRadius: 10, backgroundColor: 'rgb(68,114,199)', flexGrow: 1, marginBottom: 40, elevation: 5 }}>
            <TouchableOpacity onPress={() => purchasePackage(items?.item?.id)} style={{ backgroundColor: '#fff', paddingHorizontal: 60, paddingVertical: 10, marginBottom: 20, borderRadius: 6, elevation: 5 }}>
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

    return (
        <View style={styles.container}>
            <TutorHeader />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                <FlatList
                    data={data}
                    keyExtractor={(id) => id}
                    renderItem={(items) => renderItem(items)}
                />
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <Text>Refer to any one person and get first <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>2 calls</Text> for free</Text>
                    <Text>Refer ID: <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>TM09B91</Text>  <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>Refer now</Text></Text>
                </View>
            </View>
        </View>
    );
};

export default SubscriptionScreen;