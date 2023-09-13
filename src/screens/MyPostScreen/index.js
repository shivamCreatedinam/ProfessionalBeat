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
    Alert,
    Dimensions
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CommonHeader from '../../components/CommonHeader';
import RouteMap from '../../components/RouteMap';
import UberTypes from '../../components/UberTypes';
import styles from './styles';
import { useRoute } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from '../../../common/Colour';
import { Image } from 'react-native-elements';

const MyPostScreen = () => {

    const navigate = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                // setTimeout
                // loadSessionStorage();
            }, 300);
        }, [])
    );


    const loadSessionStorage = async () => {
        Alert.alert('Focused');
    }


    return (
        <View style={styles.container}>
            <CommonHeader />
            <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
            </View>
        </View>
    );
};

export default MyPostScreen;