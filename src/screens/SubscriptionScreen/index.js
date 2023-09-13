/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TutorHeader from '../../components/TutorHeader';
import styles from './styles';
import { Image } from 'react-native-elements';

const SubscriptionScreen = () => {

    const navigate = useNavigation();

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);



    return (
        <View style={styles.container}>
            <TutorHeader />
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <View style={{ padding: 20, borderRadius: 10, backgroundColor: 'rgb(68,114,199)', flexGrow: 1, marginBottom: 40, elevation: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: '#fff', paddingHorizontal: 60, paddingVertical: 10, marginBottom: 20, borderRadius: 6, elevation: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Monthly – Rs 249/mo</Text>
                    </TouchableOpacity>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>10 calls per month</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>Unlimited tuition alerts</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>Unlimited profile views</Text>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 20, borderRadius: 10, backgroundColor: 'rgb(68,114,199)', flexGrow: 1, marginBottom: 40, elevation: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: '#fff', paddingHorizontal: 60, paddingVertical: 10, marginBottom: 20, borderRadius: 6, elevation: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Yearly – Rs 2900/yr</Text>
                    </TouchableOpacity>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>12 calls per month</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>Unlimited tuition alerts</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/green_check.png')} />
                            <Text style={{ color: '#fff' }}>Unlimited profile views</Text>
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <Text>Refer to any one person and get first <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>2 calls</Text> for free</Text>
                    <Text>Refer ID: <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>TM09B91</Text>  <Text style={{ fontWeight: 'bold', color: 'rgb(68,114,199)' }}>Refer now</Text></Text>
                </View>
            </View>
        </View>
    );
};

export default SubscriptionScreen;