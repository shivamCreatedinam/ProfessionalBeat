import React from "react";
import { View, Text, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native'

const DocumentUploadScreen = () => {

    const navigate = useNavigation();
    const [value, setValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isTraffic, setTraffic] = React.useState(false);
    const [isNotification, setNotification] = React.useState(false);

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
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold' }}>Upload Documents</Text>
            </View>
            <View style={{ margin: 15, borderRadius: 5 }}>
                
            </View>
        </View>
    )
}

export default DocumentUploadScreen;