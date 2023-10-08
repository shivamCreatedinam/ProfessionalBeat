import React from "react";
import axios from 'axios';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import { View, Text, Image, TouchableOpacity, TextInput, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from "../../../common/Colour";


const HelpOrSupportScreen = () => {

    const navigate = useNavigation();
    const [value, setValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [QueryLoadingDone, setQueryLoadingDone] = React.useState(false);
    // submit type
    const [QyeryList, setQyeryList] = React.useState([{ "query_name": 'Parents', "id": 1, "status": 1 }, { "query_name": 'Tuitor', "id": 2, "status": 1 }]);
    const [Query, setQueryValue] = React.useState('');
    const [isQueryType, setIsQueryType] = React.useState(false);

    const saveToFeedback = () => {
        if (Query === '') {
            Toast.show({
                type: 'success',
                text1: 'Something went wrong!',
                text2: 'Please select Query For!',
            });
        } else {
            if (value === '') {
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: 'Please enter feedback, Must be 20 Character!',
                });
            } else {
                saveFeedBack();
            }
        }
    }

    const saveFeedBack = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        setLoading(true)
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('help_for', Query);
        formdata.append('help_message', value);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('updateFcmToken', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'helpdesk-review', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    setLoading(false);
                    setQueryLoadingDone(true);
                    setValue('');
                    setQueryValue('');
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
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

    return (
        <View>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 15, alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>Help & Support</Text>
            </View>
            <View style={{ margin: 10, elevation: 5, padding: 10, backgroundColor: '#fafafa', borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '95%', borderRadius: 50, marginTop: 15, marginLeft: 10 }}>
                    <Dropdown
                        style={[styles.dropdown1, isQueryType && { borderColor: 'blue' }]}
                        selectedTextStyle={styles.selectedTextStyle1}
                        data={QyeryList}
                        maxHeight={300}
                        labelField="query_name"
                        valueField="query_name"
                        placeholder={!isQueryType ? 'Help For' : Query}
                        onFocus={() => setIsQueryType(true)}
                        onBlur={() => setIsQueryType(false)}
                        onChange={item => {
                            setQueryValue(item.query_name);
                            setIsQueryType(false);
                        }}
                    />
                </View>
                <TextInput
                    style={{
                        width: Dimensions.get('screen').width - 60,
                        height: 200,
                        borderBottomColor: 'rgb(68,114,199)',
                        borderBottomWidth: 1,
                        alignItems: 'flex-start',
                        textAlignVertical: 'top',
                        elevation: 5,
                        backgroundColor: '#ffffff',
                        margin: 10,
                        padding: 15,
                        borderRadius: 5
                    }}
                    placeholder="Enter your Feedback or Query"
                    value={value}
                    numberOfLines={5}
                    onChangeText={text => setValue(text)}
                    multiline={true}
                    underlineColorAndroid='transparent'
                />
                <TouchableOpacity style={{ padding: 15, backgroundColor: 'rgb(68,114,199)', borderRadius: 5, width: '95%', alignSelf: 'center', marginTop: 20 }} onPress={() => saveToFeedback()}>
                    {loading === true ? <ActivityIndicator style={{}} color={'#ffffff'} /> : <Text style={{ color: '#fff', justifyContent: 'center', alignSelf: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' }}>Send FeedBack</Text>}
                </TouchableOpacity>
            </View>
            {QueryLoadingDone === true ? <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 90, color: 'green' }}>Query submit Successfully, We will connect sortly</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#F1F6F9'
    },
    mapContainer: {
        height: "50%"
    },
    bottomContainer: {
        height: "50%"
    },
    floatTopButton: {
        position: "absolute",
        top: 50,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.lightGrey,
        zIndex: 4,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    }, dropdown1: {
        height: 45,
        flexGrow: 1,
        paddingLeft: 25,
        paddingRight: 25,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    selectedTextStyle1: {
        fontSize: 16,
    },
    dropdown: {
        height: 45,
        flexGrow: 1,
        backgroundColor: '#fff',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderRadius: 40,
        paddingLeft: 15,
        paddingRight: 15,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});

export default HelpOrSupportScreen;