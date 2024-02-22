/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import App from './App_old';
import { name as appName } from './app.json';
import { enableLatestRenderer } from 'react-native-maps';
import { firebase } from '@react-native-firebase/database';
import RNOtpVerify from 'react-native-otp-verify';
const Urls = require('./urls.json');

enableLatestRenderer();

let config = {
    apiKey: 'AIzaSyAyvE_mLR_PEBCmlOs4Se-g1NLahX1htLE',
    appId: '1:1070779167327:android:9df1f76b30ad9f048261ea',
    databaseURL: Urls.firebaseUrl,
    projectId: Urls.appID,
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        return <AppFake />; {/* Notice this component, it is not the App Component but a different one*/ }
    }
    return <App />;
}

RNOtpVerify.getHash().then(console.log).catch(console.log);

LogBox.ignoreAllLogs(true);

AppRegistry.registerHeadlessTask('RNPushNotificationActionHandlerTask', () => notificationActionHandler,);

AppRegistry.registerComponent(appName, () => HeadlessCheck);

const AppFake = () => {
    return null;
}

export default AppFake;