import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
let GOOGLE_MAP_KEY = 'AIzaSyDIpZFQnU2tms1EdAqK-H9K4PfNN17zLdc';

const AddressPickup = ({ placheholderText, fetchAddress }) => {

    const onPressAddress = (data, details) => {
        // console.log("details==>>>>", details)
        let resLength = details.address_components
        let zipCode = ''

        let filtersResCity = details.address_components.filter(val => {
            if (val.types.includes('locality') || val.types.includes('sublocality')) {
                return val
            }
            if (val.types.includes('postal_code')) {
                let postalCode = val.long_name
                zipCode = postalCode
            }
            return false
        })

        let dataTextCityObj = filtersResCity.length > 0
            ? filtersResCity[0] :
            details.address_components[
            resLength > 1 ? resLength - 2 : resLength - 1
            ];

        let cityText =
            dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
                ? dataTextCityObj.short_name
                : dataTextCityObj.long_name;

        // console.log("zip cod found", zipCode)
        // console.log("city namte", cityText)

        const lat = details.geometry.location.lat
        const lng = details.geometry.location.lng
        const locations = details
        // lat, lng, zipCode, cityText, 
        fetchAddress(locations)
    }

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={placheholderText}
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
                onPress={onPressAddress}
                fetchDetails={true}
                query={{
                    key: GOOGLE_MAP_KEY,
                    language: 'en'
                }}
                styles={{
                    textInputContainer: styles.containerStyle,
                    textInput: styles.textInputStyle
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    containerStyle: {
        backgroundColor: 'white',
        marginTop: 15,
        borderRadius: 5,
    },
    textInputStyle: {
        height: 45,
        color: 'black',
        fontSize: 14,
        backgroundColor: 'white',
        marginTop: 6,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

export default AddressPickup;