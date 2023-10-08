import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native'

const SettingScreen = () => {

    const navigate = useNavigation();
    const [value, setValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isTraffic, setTraffic] = React.useState(true);
    const [isNotification, setNotification] = React.useState(true);

    const saveFeedBack = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure, you want to Delete Account. All Data & Details Delete Permanently?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => console.log('cancel') },
            ]
        );
    }

    return (
        <View style={{ backgroundColor: '#F1F6F9', flex: 1 }}>
            <View style={{ padding: 15, alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>App Settings</Text>
            </View>
            <View style={{ margin: 15, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left', color: '#000000', flex: 1 }}>App Notification {isTraffic === true ? 'Enable' : 'Disable'}</Text>
                    <ToggleSwitch
                        isOn={isTraffic}
                        onColor={'#0066cc'}
                        offColor={'#cc5500'}
                        size={'small'}
                        onToggle={isOn => setTraffic(!isTraffic)}
                    />
                </View>
                <View style={{ marginTop: 5, marginBottom: 5, backgroundColor: '#F1F6F9' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left', color: '#000000', flex: 1 }}>App Notification {isTraffic === true ? 'Enable' : 'Disable'}</Text>
                    <ToggleSwitch
                        isOn={isNotification}
                        onColor={'#0066cc'}
                        offColor={'#cc5500'}
                        size={'small'}
                        onToggle={isOn => setNotification(!isNotification)}
                    />
                </View>
                <View style={{ marginTop: 5, marginBottom: 5, backgroundColor: '#F1F6F9' }} />
                <TouchableOpacity onPress={() => saveFeedBack()} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left', color: 'red', flex: 1 }}>Delete Account</Text>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../assets/power_off.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SettingScreen;