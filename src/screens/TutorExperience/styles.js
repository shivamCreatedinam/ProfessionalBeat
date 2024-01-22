import { StyleSheet } from "react-native";
import Colors from "../../../common/Colour";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container: { padding: 16 },
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
    },
    dropdown: {
        height: 50,
        backgroundColor: '#fff',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderRadius: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
    dropdown1: {
        height: 50,
        width: 350,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    selectedTextStyle1: {
        fontSize: 16,
    }, searchInputContainer: {

    }
});

export default styles;
