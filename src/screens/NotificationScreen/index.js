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
import { useNavigation } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import styles from './styles';

const NotificationScreen = () => {

    const navigate = useNavigation();
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' },{ id:2, name: 'Prashant Verma' }]);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const renderHistoryView = (item) => {
        console.log("item", item)
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, margin: 5, borderColor: '#000', borderWidth: 0.8, borderRadius: 20 }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3, width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: '500', paddingLeft: 15 }}>New Tution</Text>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginRight: 15 }}>
                                <Image style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 140, marginLeft: 8, marginTop: 5 }} source={require('../../assets/clock.png')} />
                                <Text style={{ paddingLeft: 10, paddingTop: 4, fontSize: 12 }}>19 Sep 2023</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginLeft: 10, marginTop: 5 }}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/profile_picture.jpeg')} />
                            </View>

                            <View style={{ marginLeft: 10, justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ justifyContent: 'center', fontSize: 15 }} numberOfLines={1}>Rajeev Gupta</Text>
                                <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4', justifyContent: 'center' }} numberOfLines={1}>B.Sc, M.Sc</Text>

                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                <Image style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: 'gray' }} source={require('../../assets/pin.png')} />
                                <Text style={{ fontSize: 12, color: '#000', justifyContent: 'center', paddingLeft: 10 }} numberOfLines={1}>Prem nagar, Agra</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding:5, borderRadius: 5, width: '30%', marginLeft: 30, marginTop: 10, alignSelf:'flex-end',marginRight:10,marginBottom:15 }}>
                        <Text style={{ textAlign: 'center', color: '#fff' }}>View Post</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CommonHeader />
            <View>
                {historyData?.length > 0 ? <FlatList
                    style={{ height: Dimensions.get('screen').height / 1.55 }}
                    data={historyData}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                    showsVerticalScrollIndicator={false}
                /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                </View>}

            </View>

        </View>
    );
};

export default NotificationScreen;