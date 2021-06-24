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
                          size={50} color="#dd0812"/>
                }
                {this.props.type === "burger" &&
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}
                                      style={styles.backIcon}>
                        <View style={{borderTopWidth: 4, borderTopColor: '#dd0812', width: 35, marginBottom: 9, marginTop: 10, marginLeft: 10}}/>
                        <View style={{borderTopWidth: 4, borderTopColor: '#dd0812', width: 45, marginBottom: 9, marginLeft: 10}}/>
                        <View style={{borderTopWidth: 4, borderTopColor: '#dd0812', width: 35, marginBottom: 9, marginLeft: 10}}/>
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
        top: 25,
        left: 25,
    }
});

