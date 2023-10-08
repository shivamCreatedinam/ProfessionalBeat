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
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import Toast from 'react-native-toast-message';
import PushController from './PushController'; 
import NotificationCenter from './NotificationCenter';
import StackNavigation from './navigation';
import enableGPS from './gps.js';

const App = () => {

  React.useEffect(() => {
    enableGPS();
  }, []);

  return (
    <View style={{ height: Dimensions.get('screen').height - 20, width: Dimensions.get('screen').width, marginTop: 20, backgroundColor: '#F1F6F9' }}>
      <StatusBar backgroundColor='black' barStyle='light-content' translucent />
      <StackNavigation />
      <NotificationCenter />
      <PushController />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  imageMarker: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }
});

export default App;
