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
    Dimensions,
    Image,
    FlatList,
    SafeAreaView
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import TutorHeader from '../../components/TutorHeader'; 
import styles from './styles';

const TutorCallHistoryScreen = () => {

    const navigate = useNavigation();
    const [visible, setVisible] = React.useState(true);
    const [historyData, setHistoryData] = React.useState([
        { id: 1, name: 'Prashant Verma' },
        { id: 2, name: 'Prashant Verma' },
        { id: 3, name: 'Prashant Verma' },
        { id: 4, name: 'Prashant Verma' },
        { id: 5, name: 'Prashant Verma' },
        { id: 6, name: 'Prashant Verma' },
    ]);

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

    const renderHistoryView = (items) => {
        return (
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 10, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ paddingRight: 10, alignItems: 'center', }}>
                        <Image style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 150 }} source={{ uri: 'https://xsgames.co/randomusers/assets/avatars/male/74.jpg' }} />
                    </View>
                    <Text style={{ fontWeight: 'bold', flex: 1, marginRight: 6 }} numberOfLines={1}>Rahul Saini</Text>
                    <View style={{ padding: 10, alignItems: 'center', }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/phone_call.png')} />
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold' }}>Incoming Call</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain' }} source={require('../../assets/time.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginLeft: 5 }}>5{items.index} min ago </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TutorHeader />
            {visible ?
                <View style={{ flex: 1, marginBottom: 60 }}>
                    <FlatList
                        style={{}}
                        data={historyData}
                        keyExtractor={(e) => e.id}
                        renderItem={(items) => renderHistoryView(items)}
                        showsVerticalScrollIndicator={false}
                    />
                </View> :
                <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                </View>}
        </View>
    );
};

export default TutorCallHistoryScreen;