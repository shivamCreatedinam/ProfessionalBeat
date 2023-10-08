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
    Alert,
    Dimensions,
    FlatList,
    Image,
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MarqueeText from 'react-native-marquee';
import CommonHeader from '../../components/CommonHeader';
import Toast from 'react-native-toast-message';
import styles from './styles';
import moment from 'moment';

const MyTuitorPostScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                // setTimeout
                getTutorPostForUser();
            }, 100);
        }, [])
    );

    const getTutorPostForUser = async () => {
        console.log('getTutorPostForUser');
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-post',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false)
                    setData(response.data?.data);
                    console.log('getTutorPostForUser', JSON.stringify(response.data));
                } else {
                    setData([]);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const AskForDelete = (info) => {
        Alert.alert(
            'Delete Post',
            'Are you sure, you want to delete post!',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => deletePost(info) },
            ]
        );
    }

    const deletePost = async (info) => {
        console.log(JSON.stringify(info?.id));
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('post_id', info?.id);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('saveChildProfile', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'delete-parent-post', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('saveChildProfile', result)
                if (result.status) {
                    setLoading(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    getTutorPostForUser();
                } else {
                    setLoading(false);
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
            });
    }

    const editPost = (info) => {
        console.log(JSON.stringify(info))
        Toast.show({
            type: 'success',
            text1: 'Comming Soon',
            text2: 'Edit Features Comming Soon',
        });
    }

    const getTimesAgo = (created_at) => {
        const dateTimeAgo = moment(new Date(created_at)).fromNow();
        return dateTimeAgo;
    }

    const renderHistoryView = (item) => {

        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, padding: 15, margin: 5, borderRadius: 10, elevation: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setTimeSlotPopup(!TimeSlotPopul)}>
                            <Image style={{ width: 18, height: 18, resizeMode: 'contain', borderRadius: 140 }} source={require('../../assets/clock.png')} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ justifyContent: 'center', fontSize: 12 }} numberOfLines={1}>{getTimesAgo(item.item?.created_at)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Class: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.from_class_name} to {item.item?.to_class_name} </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Board: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.boards[0]?.board_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Fees: </Text>
                                <Text style={{ fontSize: 12 }}>₹{item.item?.fees}/-</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Subject: </Text>
                                <MarqueeText
                                    style={{ fontSize: 24, marginRight: 0 }}
                                    speed={1}
                                    marqueeOnStart={true}
                                    loop={true}
                                    delay={1000} >
                                    {item?.item?.subject.map((items) => <Text style={{ fontSize: 12 }}>{items?.subject_name}, </Text>)}
                                </MarqueeText>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>City: </Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.state_name}, {item.item?.city_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Locality:</Text>
                                <Text style={{ fontSize: 12 }}>{item.item?.locality}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around' }}>
                        {/* <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 6, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '33%', alignSelf: 'center', marginTop: 15 }}
                            onPress={() => editPost(item?.item)} >
                            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 14 }}>Edit post</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 6, borderRadius: 5, borderWidth: 1, borderColor: '#fff', width: '100%', alignSelf: 'center', marginTop: 15 }}
                            onPress={() => AskForDelete(item?.item)}>
                            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 14 }}>Delete Post</Text>
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
                {data?.length > 0 ?
                    <FlatList
                        style={{ height: Dimensions.get('screen').height / 1.2 }}
                        data={data}
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

export default MyTuitorPostScreen;