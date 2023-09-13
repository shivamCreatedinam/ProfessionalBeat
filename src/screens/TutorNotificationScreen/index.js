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
    Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TutorHeader from '../../components/TutorHeader';
import CommonHeader from '../../components/CommonHeader';
import styles from './styles';

const TutorNotificationScreen = () => {

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
            <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
            </View>
        </View>
    );
};

export default TutorNotificationScreen;