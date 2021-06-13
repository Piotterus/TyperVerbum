import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Modal from 'react-native-modal';

export default class CustomHeader extends React.Component {

    render() {
        return (
            <Image style={styles.headerImage} resizeMode="cover" source={require('../images/header.png')} />
        );
    }
}

const styles = StyleSheet.create({
    headerImage: {
        width: '100%',
        marginBottom: 20,
    },
});

