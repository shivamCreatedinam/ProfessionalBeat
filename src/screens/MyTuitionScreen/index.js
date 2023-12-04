/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Image,
    Dimensions,
    View,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader';
import styles from './styles';

const MyTuitionScreen = () => {

    const navigate = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' }, { id: 2, name: 'Prashant Verma' }, { id: 3, name: 'Prashant Verma' }, { id: 4, name: 'Prashant Verma' }, { id: 5, name: 'Prashant Verma' }, { id: 6, name: 'Prashant Verma' }]);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);


    const renderHistoryView = () => {
        return (
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 20, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold', flex: 1, marginRight: 6 }} numberOfLines={2}>Hone Tuition For My Doughter</Text>
                    <TouchableOpacity onPress={() => startTrip()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'rgb(68,114,199)', alignSelf: 'center', elevation: 5, alignItems: 'center', }}>
                        <Image style={{ width: 12, height: 12, resizeMode: 'contain', marginTop: 8, tintColor: '#fff', alignItems: 'center' }} source={require('../../assets/share.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} />
                            <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto-Italic' }}>Rahul Shukla</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} />
                            <Text style={{ fontWeight: 'bold' }}>7th</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/books.png')} />
                            <Text style={{ fontWeight: 'bold' }}>CBSC</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/medium.png')} />
                            <Text style={{ fontWeight: 'bold' }}>English</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/search_books.png')} />
                            <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>Science, Math, English</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/placeholder.png')} />
                            <Text style={{ fontWeight: 'bold' }}>Izzatnagar</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} />
                        <Text style={{ fontWeight: 'bold' }}>2.5 km away</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setVisible(!visible)} style={{ flex: 1, padding: 5, backgroundColor: 'rgb(254,92,54)', borderRadius: 20, elevation: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>End Tuition</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <CommonHeader />
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{}}
                    data={historyData}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => <View style={{ marginBottom: 180 }} />}
                />
            </View>
        </SafeAreaView>
    );
};

export default MyTuitionScreen;