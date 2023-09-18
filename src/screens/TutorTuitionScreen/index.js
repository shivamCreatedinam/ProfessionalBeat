/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Image,
    Dimensions,
    View,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { useNavigation, useRoute } from '@react-navigation/native';

import TutorHeader from '../../components/TutorHeader';
import styles from './styles';

const TutorTuitionScreen = () => {

    const navigate = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [visibleFinal, setVisibleFinal] = React.useState(false);
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' }, { id: 2, name: 'Prashant Verma' }, { id: 3, name: 'Prashant Verma' }, { id: 4, name: 'Prashant Verma' }, { id: 5, name: 'Prashant Verma' }, { id: 6, name: 'Prashant Verma' }]);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);


    const renderHistoryView = () => {
        return (
            <View style={{ backgroundColor: '#fff', elevation: 5, marginBottom: 10, borderRadius: 10, padding: 20, margin: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold', flex: 1, marginRight: 6 }} numberOfLines={2}>Hone Tuition For My Doughter</Text>
                    <TouchableOpacity onPress={() => startTrip()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'rgb(68,114,199)', alignSelf: 'center', elevation: 5, alignItems: 'center', }}>
                        <Image style={{ width: 12, height: 12, resizeMode: 'contain', marginTop: 8, tintColor: '#fff', alignItems: 'center' }} source={require('../../assets/share.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/profile_icon.png')} />
                            <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto-Italic' }}>Rahul Shukla</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/presentation.png')} />
                            <Text style={{ fontWeight: 'bold' }}>7th</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/books.png')} />
                            <Text style={{ fontWeight: 'bold' }}>CBSC</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/medium.png')} />
                            <Text style={{ fontWeight: 'bold' }}>English</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/search_books.png')} />
                            <Text style={{ fontWeight: 'bold' }} numberOfLines={2}>Science, Math, English</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image style={{ width: 10, height: 10, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/placeholder.png')} />
                            <Text style={{ fontWeight: 'bold' }}>Izzatnagar</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../assets/distance.png')} />
                        <Text style={{ fontWeight: 'bold' }}>2.5 km away</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => setVisible(!visible)} style={{ flex: 1, padding: 5, backgroundColor: 'rgb(254,92,54)', borderRadius: 20, elevation: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}>End Tuition</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <TutorHeader />
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{}}
                    data={historyData}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <Dialog
                visible={visible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'top',
                })}
                dialogTitle={<DialogTitle title="End Tuition" />}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="CANCEL"
                            onPress={() => {
                                setVisible(false)
                            }}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => {
                                setVisible(false)
                                setVisibleFinal(true)
                            }}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent>
                    <View style={{ width: Dimensions.get('screen').width / 1.5 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', padding: 20 }}>Want to end tuition with Rahul Shukla?</Text>
                    </View>
                </DialogContent>
            </Dialog>
            <Dialog
                visible={visibleFinal}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 60 }}
                dialogTitle={<DialogTitle title="Want to end tuition" />}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="CANCEL"
                            onPress={() => setVisibleFinal(false)}
                        />
                        <DialogButton
                            text="OK"
                            onPress={() => setVisibleFinal(false)}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent>
                    <View>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Reasons:</Text>
                            <View>
                                <Text>1- Seeking new tuition</Text>
                                <Text>2- Have new career option</Text>
                                <Text>3- Low fee</Text>
                                <Text>4- Found better tuition</Text>
                                <Text>5- Others</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Feedback and Remarks:</Text>
                            <TextInput multiline={true} style={{ height: 120, borderRadius: 10, borderWidth: 1, textAlignVertical: 'top', padding: 5, paddingLeft: 10 }} placeholder='Feedback and Remarks here' />
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        </SafeAreaView>
    );
};

export default TutorTuitionScreen;