/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React, { useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Alert,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CommonHeader from '../../components/CommonHeader';
import styles from './styles';
import RadioGroup from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


const NewPostScreen = () => {
    const [City, setCity] = React.useState([]);
    const [State, setState] = React.useState([]);

    // city

    const navigate = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                getStateData();
                getCityData();
                // setTimeout
                // loadSessionStorage();
            }, 300);
        }, [])
    );

    const getCityData = async (state) => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'cities/' + state,
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setCity(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }


    const getStateData = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'states',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false);
                setState(response.data?.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }
    const loadSessionStorage = async () => {
        Alert.alert('Focused');
    }


    const RadioGroupCustom = ({ options, selectedValue, onSelect }) => {
        return (
            <View>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onSelect(option.value)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            margin: 2,
                            padding: 7,
                            backgroundColor: option.value === selectedValue ? 'red' : "#fff"
                        }}
                    >
                        <Icon
                            name={'circle-o'}
                            size={15} // Adjust the size as needed
                            color={'black'} // Change the color
                        />
                        <Text style={{ marginLeft: 8 }}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };


    const radioButtons = [
        {
            label: 'Individual tuition',
            value: 'Individual tuition',
        },
        {
            label: 'Group tuition',
            value: 'Group tuition',
        },
    ];

    const [selectedValue, setSelectedValue] = useState(null);

    // state
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
    ];

    const city = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
    ];
    const [valueCity, setValueCity] = React.useState(null);
    const [isFocusCity, setIsFocusCity] = React.useState(false);

    console.log("value", value)

    return (
        <View style={styles.container}>
            <CommonHeader />
            <View style={{ backgroundColor: '#fff', borderRadius: 20, marginBottom: 10, elevation: 5, borderColor: '#000', borderWidth: 1 }} >
                <View style={{ marginTop: 15, marginLeft: 15, marginBottom: 10 }}>
                    <Text>Post new tuition</Text>
                </View>
                <View style={{ marginLeft: 18 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700' }}>Apply for:</Text>
                </View>
                <View style={{ alignSelf: 'flex-start', marginTop: 8, marginLeft: 15 }}>
                    <View>
                        <RadioGroupCustom
                            options={radioButtons}
                            selectedValue={selectedValue}
                            onSelect={(value) => setSelectedValue(value)}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 15, flex: 1 / 2 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>State :</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', elevation: 5, backgroundColor: '#DFDFDF', borderRadius: 10, marginLeft: 25, height: '100%', borderColor: '#fff' }}>
                            <Dropdown
                                style={[style.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={style.placeholderStyle}
                                selectedTextStyle={style.selectedTextStyle}
                                inputSearchStyle={style.inputSearchStyle}
                                iconStyle={style.iconStyle}
                                data={data}
                                search={false}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder={isFocus ? 'Select item' : value}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    console.log("item", item?.label)
                                    setValue(item.label);
                                    setIsFocus(false);
                                }}
                                containerStyle={{ width: 100 }}
                                showsVerticalScrollIndicator
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15, flex: 1 / 2 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>City :</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', elevation: 5, backgroundColor: '#DFDFDF', borderRadius: 10, marginLeft: 15, height: '100%', borderColor: '#fff' }}>
                            <Dropdown
                                style={[style.dropdown, isFocusCity && { borderColor: 'blue' }]}
                                placeholderStyle={style.placeholderStyle}
                                selectedTextStyle={style.selectedTextStyle}
                                inputSearchStyle={style.inputSearchStyle}
                                iconStyle={style.iconStyle}
                                data={city}
                                search={false}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder={isFocusCity ? 'Select item' : valueCity}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocusCity(true)}
                                onBlur={() => setIsFocusCity(false)}
                                onChange={item => {
                                    console.log("item", item?.label)
                                    setValueCity(item.label);
                                    setIsFocusCity(false);
                                }}
                                containerStyle={{ width: 100 }}
                                showsVerticalScrollIndicator
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <View style={{ marginLeft: 15, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Locality :</Text>
                    </View>

                    <View style={{ alignSelf: 'flex-start', backgroundColor: '#DFDFDF', width: '50%', borderRadius: 10, marginTop: 15, height: '48%', marginLeft: 8 }}>
                        <TextInput style={{ marginLeft: 0 }} placeholder='' />
                    </View>
                </View>
                <View style={{ marginLeft: 25, justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Student details:</Text>
                </View>
                <View style={{ backgroundColor: '#DFDFDF', borderRadius: 15, borderWidth: 1, borderColor: '#fff', padding: 10, width: '80%', marginLeft: 25, paddingTop: 10, paddingBottom: 10, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontSize: 14 }}>Name:</Text>
                        </View>
                        <View style={{ marginTop: -15 }}>
                            <TextInput style={{ fontSize: 12, marginLeft: 5 }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontSize: 14 }}>Class:</Text>
                        </View>
                        <View style={{ marginTop: -15 }}>
                            <TextInput style={{ fontSize: 12, marginLeft: 5 }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontSize: 14 }}>Subjects:</Text>
                        </View>
                        <View style={{ marginTop: -15 }}>
                            <TextInput style={{ fontSize: 12, marginLeft: 5 }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontSize: 14 }}>Board:</Text>
                        </View>
                        <View style={{ marginTop: -15 }}>
                            <TextInput style={{ fontSize: 12, marginLeft: 5 }} />
                        </View>
                    </View>
                </View>
                {/* <View style={{ flexDirection: 'row' }}>
                    <View style={{ backgroundColor: '#DFDFDF', borderRadius: 15, borderWidth: 1, borderColor: '#fff', padding: 10, width: '80%', marginLeft: 25, paddingTop: 10, paddingBottom: 10, marginTop: 10 }}>
                        <Text style={{ fontSize: 14 }}>Name:</Text>
                        <Text style={{ fontSize: 14 }}>Class:</Text>
                        <Text style={{ fontSize: 14 }}>Subjects:</Text>
                        <Text style={{ fontSize: 14 }}>Board:</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: 'center', marginLeft: 10 }}>
                        <Image source={require('../../assets/circledcross.png')} style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'gray', alignItems: 'center' }} />
                    </TouchableOpacity>
                </View> */}
                <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 5, borderRadius: 5, width: '30%', marginLeft: 30, marginTop: 10 }}>
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Add more</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'rgb(68,114,199)', padding: 8, borderRadius: 5, width: '30%', marginLeft: 30, marginTop: 10, alignSelf: 'center', marginBottom: 10 }}>
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Post</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const style = StyleSheet.create({
    dropdown: {
        height: 30,
        borderColor: 'gray',
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: 100
    },
    dropdown1: {
        height: 30,
        width: '20%',
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 10,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
});

export default NewPostScreen;

{/* <View style={{ padding: 20, alignItems: 'center', marginTop: Dimensions.get('screen').width / 2 - 50 }}>
    <Image style={{ width: 250, height: 250, resizeMode: 'contain' }} source={require('../../assets/no_record_found.png')} />
</View> */}