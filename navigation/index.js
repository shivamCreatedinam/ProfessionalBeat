import * as React from 'react';
import { Image, View, } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import database from '@react-native-firebase/database';
// screens
import MapScreens from '../src/screens/map_screens';
import HomeScreen from '../src/screens/home_screen';
import RegisterScreen from '../src/screens/register_screen';
import ProfileScreen from '../src/screens/ProfileScreen';
import MapComponent from '../src/screens/TrackingMaps';
import LoginScreen from '../src/screens/login_screen';
import SplashAppScreen from '../src/screens/SplashScreen';
import SplashScreen from '../src/screens/splash_screen';
import TrackingMapsScreen from '../src/screens/tracking_maps';
import UpcomingTripsScreen from '../src/screens/upcoming_trips';
import EndStartScreen from '../src/screens/endtrip_screen';
import TripStartScreen from '../src/screens/tripstart_screen';
import OTPSubmitScreen from '../src/screens/submitOtpScreen';
import UserHomeScreen from '../src/screens/UserHomeScreen';
import TripHistoryScreen from '../src/screens/TripHistory';
import RegisterDriverTwoScreen from '../src/screens/registerDrivertwo';
import UserEditProfileScreen from '../src/screens/UserEditProfile';
// driver
import DriverLoginScreen from '../src/screens/driverLogin';
import DriverProfileScreen from '../src/screens/driverProfile';
import { Text } from 'react-native-elements';
import MyTuitionScreen from '../src/screens/MyTuitionScreen';
import FavourtePostScreen from '../src/screens/FavouritePostScreen';
import NewPostScreen from '../src/screens/NewPostScreen';
import MyPostScreen from '../src/screens/MyPostScreen';
import NotificationScreen from '../src/screens/NotificationScreen';
import CallHistoryScreen from '../src/screens/CallHistoryScreen';
import CallingScreen from '../src/screens/CallingScreen';
import TutorTuitionScreen from '../src/screens/TutorTuitionScreen';
import TutorFavourtePostScreen from '../src/screens/TutiorFavouriteScreen';
import SubscriptionScreen from '../src/screens/SubscriptionScreen';
import TutorCallHistoryScreen from '../src/screens/TutorCallScreen';
import TutorNotificationScreen from '../src/screens/TutorNotificationScreen';
import TutorNewPostScreen from '../src/screens/TutorNewPostScreen';
import TutorProfileScreen from '../src/screens/TutorProfileScreen';
import EditTutorProfileScreen from '../src/screens/editProfileTutor';
import QualificationScreen from '../src/screens/QualificationScreen';
import AddChildProfileScreen from '../src/screens/AddChildProfiles';
import HelpOrSupportScreen from '../src/screens/HelpOrSupport';
import SettingScreen from '../src/screens/SettingScreen';
import DocumentUploadScreen from '../src/screens/DocumentUploadScreen';
import MyTuitorPostScreen from '../src/screens/MyParentTutiorPost';
import TransactionHistoryScreen from '../src/screens/TransactionHistory';
import CallingAudioApps from '../src/screens/AudioCallSetup';
import ConfirmTuitionScreen from '../src/screens/ConfirmTuitionScreen';
import ConfirmedTuitionScreen from '../src/screens/ConfirmedTuition';
import CallPickScreen from '../src/screens/CallPickScreen';
import TuitorMyPostScreen from '../src/screens/TutorMyPostScreen';
import TutorExperienceScreen from '../src/screens/TutorExperience';
import CashBackTransactionScreen from '../src/screens/CashBackScreen';
// Theme.
const MyTheme = {
    dark: false,
    colors: {
        primary: '#FFE473',
        secondary: '#000000',
        background: 'white',
        card: 'rgb(255, 255, 255)',
        text: '#1F1F39',
        invert_text_color: '#FAFAFA',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

// Veriable.
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom screen.
function BottomNavigation() {

    return (
        <Tab.Navigator
            shifting={true}
            labeled={true}
            screenOptions={{
                tabBarShowLabel: false,
            }}
            sceneAnimationEnabled={false}
            barStyle={{ backgroundColor: '#eff4fa' }}
            tabBarOptions={{
                activeTintColor: '#20251e',
                inactiveTintColor: '#20251e',
                showLabel: true,
                style: {
                    borderTopColor: '#66666666',
                    backgroundColor: 'eff4fa',
                    elevation: 0,
                },
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Delivery' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/home.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Home</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="TutorCallHistoryScreen"
                component={TutorCallHistoryScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/phone_call.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Calls</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="TutorNewPostScreen"
                component={TutorNewPostScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 15, borderRadius: 140 }}>
                                <Image
                                    style={{ width: focused ? 35 : 30, height: focused ? 35 : 30, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/addition.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>New</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="TutorFavourtePostScreen"
                component={TutorFavourtePostScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/star.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Favorite Post</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="SubscriptionScreen"
                component={SubscriptionScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/subscription.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Subscription</Text>
                            </View>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}

function UserBottomNavigation() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#58ceb2',
                tabBarInactiveTintColor: 'gray',
                //Tab bar styles can be added here
                // tabBarStyle: {
                //     paddingVertical: 5,
                //     borderRadius: 15,
                //     backgroundColor: 'white',
                //     position: 'absolute',
                //     height: 55,
                //     bottom: 55,
                //     left: 35,
                //     right: 35,
                //     zIndex: 9999,
                // },
                // tabBarLabelStyle: {
                //     paddingBottom: 3,
                // },
            })}
            shifting={true}
            labeled={true}
            sceneAnimationEnabled={false}
        // barStyle={{
        //     backgroundColor: '#000000',
        // }}
        //Tab bar styles can be added here
        // tabBarOptions={{
        //     style: {
        //         backgroundColor: 'yellow',
        //     }
        // }}
        // tabBarStyle={{
        //     paddingVertical: 5,
        //     borderRadius: 15,
        //     backgroundColor: 'white',
        //     position: 'absolute',
        //     height: 50,
        // }}
        >
            <Tab.Screen
                name="UserHomeScreen"
                component={UserHomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Home</Text> },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/home.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Home</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="CallHistoryScreen"
                component={CallHistoryScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return <Text style={{ fontWeight: 'bold', fontSize: 10 }}>My Tuitions</Text> },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/phone_call.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Calls</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="NewPostScreen"
                component={NewPostScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return <Text style={{ fontWeight: 'bold', fontSize: 10 }}>My Tuitions</Text> },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 15, borderRadius: 140 }}>
                                <Image
                                    style={{ width: focused ? 35 : 30, height: focused ? 35 : 30, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/addition.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>New</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="FavourtePostScreen"
                component={FavourtePostScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Favorite Post</Text> },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/star.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>Favorite Post</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={MyPostScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return <Text style={{ fontWeight: 'bold', fontSize: 10 }}>My Post</Text> },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'rgb(68,114,199)' : 'rgb(254,92,54)', resizeMode: 'contain' }}
                                    source={require('../src/assets/post.png')}
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 10 }}>My Post</Text>
                            </View>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}

// Stack screen.
function StackNavigation() {

    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();

    let addItem = item => {
        database().ref('/navigation').push({
            name: item
        });
    };

    // SplashAppScreen
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }}
            theme={MyTheme}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;
                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                routeNameRef.current = currentRouteName;
                addItem(currentRouteName);
            }} >
            <Stack.Navigator
                initialRouteName='SplashAppScreen'
                screenOptions={{ headerShown: false, }}>
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        title: 'HomeScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SplashAppScreen"
                    component={SplashAppScreen}
                    options={{
                        title: 'SplashAppScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserBottomNavigation"
                    component={UserBottomNavigation}
                    options={{
                        title: 'UserBottomNavigation',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MapScreens"
                    component={MapScreens}
                    options={{
                        title: 'MapScreens',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UpcomingTripsScreen"
                    component={UpcomingTripsScreen}
                    options={{
                        title: 'UpcomingTripsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TrackingMapsScreen"
                    component={TrackingMapsScreen}
                    options={{
                        title: 'TrackingMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        title: 'TrackingMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="OTPSubmitScreen"
                    component={OTPSubmitScreen}
                    options={{
                        title: 'OTPSubmitScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{
                        title: 'RegisterScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="HomeBottomNavigation"
                    component={BottomNavigation}
                    options={{
                        title: 'BottomNavigation',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripStartScreen"
                    component={TripStartScreen}
                    options={{
                        title: 'TripStartScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="EndStartScreen"
                    component={EndStartScreen}
                    options={{
                        title: 'EndStartScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MapComponent"
                    component={MapComponent}
                    options={{
                        title: 'MapComponent',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripHistoryScreen"
                    component={TripHistoryScreen}
                    options={{
                        title: 'TripHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RegisterDriverTwoScreen"
                    component={RegisterDriverTwoScreen}
                    options={{
                        title: 'RegisterDriverTwoScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverLoginScreen"
                    component={DriverLoginScreen}
                    options={{
                        title: 'DriverLoginScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverProfileScreen"
                    component={DriverProfileScreen}
                    options={{
                        title: 'DriverProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserEditProfileScreen"
                    component={UserEditProfileScreen}
                    options={{
                        title: 'UserEditProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserProfileScreen"
                    component={ProfileScreen}
                    options={{
                        title: 'UserProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MyPostScreen"
                    component={MyPostScreen}
                    options={{
                        title: 'MyPostScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="NewPostScreen"
                    component={NewPostScreen}
                    options={{
                        title: 'NewPostScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />

                <Stack.Screen
                    name="NotificationScreen"
                    component={NotificationScreen}
                    options={{
                        title: 'NotificationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CallHistoryScreen"
                    component={CallHistoryScreen}
                    options={{
                        title: 'CallHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CallingScreen"
                    component={CallingScreen}
                    options={{
                        title: 'CallingScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TutorCallHistoryScreen"
                    component={TutorCallHistoryScreen}
                    options={{
                        title: 'TutorCallHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TutorNotificationScreen"
                    component={TutorNotificationScreen}
                    options={{
                        title: 'TutorNotificationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TutorProfileScreen"
                    component={TutorProfileScreen}
                    options={{
                        title: 'TutorProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="EditTutorProfileScreen"
                    component={EditTutorProfileScreen}
                    options={{
                        title: 'EditTutorProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="QualificationScreen"
                    component={QualificationScreen}
                    options={{
                        title: 'QualificationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="AddChildProfileScreen"
                    component={AddChildProfileScreen}
                    options={{
                        title: 'AddChildProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="HelpOrSupportScreen"
                    component={HelpOrSupportScreen}
                    options={{
                        title: 'HelpOrSupportScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                    options={{
                        title: 'SettingScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DocumentUploadScreen"
                    component={DocumentUploadScreen}
                    options={{
                        title: 'DocumentUploadScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MyTuitorPostScreen"
                    component={MyTuitorPostScreen}
                    options={{
                        title: 'MyTuitorPostScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TransactionHistoryScreen"
                    component={TransactionHistoryScreen}
                    options={{
                        title: 'TransactionHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CallingAudioApps"
                    component={CallingAudioApps}
                    options={{
                        title: 'CallingAudioApps',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="ConfirmTuitionScreen"
                    component={ConfirmTuitionScreen}
                    options={{
                        title: 'ConfirmTuitionScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="ConfirmedTuitionScreen"
                    component={ConfirmedTuitionScreen}
                    options={{
                        title: 'ConfirmedTuitionScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CallPickScreen"
                    component={CallPickScreen}
                    options={{
                        title: 'CallPickScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TuitorMyPostScreen"
                    component={TuitorMyPostScreen}
                    options={{
                        title: 'TuitorMyPostScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TutorExperienceScreen"
                    component={TutorExperienceScreen}
                    options={{
                        title: 'TutorExperienceScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CashBackTransactionScreen"
                    component={CashBackTransactionScreen}
                    options={{
                        title: 'CashBackTransactionScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation; // CashBackTransactionScreen
