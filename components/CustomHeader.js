import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';

export default class CustomHeader extends React.Component {

    render() {
        return (
            <View>
                <Image style={styles.headerImage} resizeMode="cover" source={require('../images/header.png')} />
                {this.props.type === "back" &&
                <Icon style={styles.backIcon} onPress={() => this.props.navigation.goBack()} name="arrow-left"
                      size={40} color="#61a2ac"/>
                }
                {this.props.type === "burger" &&
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}
                                      style={styles.backIcon}>
                        <View style={{borderTopWidth: 2, borderTopColor: '#61a2ac', width: 25, marginBottom: 9}}/>
                        <View style={{borderTopWidth: 2, borderTopColor: '#61a2ac', width: 35, marginBottom: 9}}/>
                        <View style={{borderTopWidth: 2, borderTopColor: '#61a2ac', width: 25, marginBottom: 9}}/>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerImage: {
        width: '100%',
        marginBottom: 20,
    },
    backIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
    }
});

