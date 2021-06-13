import React from 'react'
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView} from "react-native";

export default class RankingItem extends React.Component {

    render() {
        return(
            <View style={styles.rankingItem}>
                <Text>{this.props.email}</Text>
                <Text>{this.props.points} PKT</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    rankingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
        borderBottomColor: '#777777',
        borderBottomWidth: 1,
    }
});
