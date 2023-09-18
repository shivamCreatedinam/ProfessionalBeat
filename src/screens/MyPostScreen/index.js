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
    FlatList
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
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' }, { id: 2, name: 'Prashant Verma' }]);

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
    const renderHistoryView = (item) => {
        console.log("item", item)
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, padding: 15, margin: 5, borderColor: '#000', borderWidth: 0.8, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setTimeSlotPopup(!TimeSlotPopul)}>
                            <Image style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/clock.png')} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ justifyContent: 'center', fontSize: 12 }} numberOfLines={1}>2 days ago</Text>
                            {/* <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 12, color: '#b4b4b4' }} numberOfLines={1}>B-Tech, 4+ Years Exp</Text> */}
                        </View>

                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 16, color: '#000', paddingLeft: 5, paddingBottom: 5 }}>Individual tution</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Name: </Text>
                                <Text style={{ fontSize: 12 }}>Pratik Sahu</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Class: </Text>
                                <Text style={{ fontSize: 12 }}>7th </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}>Board: </Text>
                                <Text style={{ fontSize: 12 }}>CBSE</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                {/* <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} /> */}
                                <Text style={{ fontSize: 12 }}></Text>
                                <Text style={{ fontSize: 12 }}></Text>
                            </View>

                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Subject: </Text>
                                <Text style={{ fontSize: 12 }}>Science, Math</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>English</Text>
                                <Text style={{ fontSize: 12 }}></Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>City: </Text>
                                <Text style={{ fontSize: 12 }}>Kanpur</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12 }}>Locality:</Text>
                                <Text style={{ fontSize: 12 }}>Izzatnagar</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',width:"95%",justifyContent:'space-around'}}>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 6, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '33%', alignSelf: 'center', marginTop: 15 }}
                            onPress={() => setFeedbackPopup(!feedbackPopup)}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 14 }}>Edit post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 6, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '35%', alignSelf: 'center', marginTop: 15 }}
                            onPress={() => setFeedbackPopup(!feedbackPopup)}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 14 }}>Delete post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CommonHeader />

            <View>
                {historyData?.length > 0 ?
                    <FlatList
                        style={{ height: Dimensions.get('screen').height / 1.55 }}
                        data={historyData}
                        keyExtractor={(e) => e.id}
                        renderItem={(items) => renderHistoryView(items)}
                        showsVerticalScrollIndicator={false}
                    /> : <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
                        <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
                    </View>
                }


            </View>
        </View>
    );
};

export default MyPostScreen;