import React from 'react'
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView} from "react-native";

export default class QuestionItem extends React.Component {

    render() {
        return(
            <View style={styles.matchView1}>
                <View style={styles.matchView}>
                    <View style={styles.middleView}>
                        <Text>{this.props.time}</Text>
                        <Text>{this.props.question}</Text>
                        {this.props.betGoals1 !== null && this.props.betGoals2 !== null &&
                        <Text>Twój TYP - {this.props.answer}</Text>
                        }
                        {(this.props.betGoals1 === null || this.props.betGoals2 === null) &&
                        <Text>Twój TYP - BRAK</Text>
                        }
                    </View>
                </View>
                {this.props.betEnded === 1 &&
                <TouchableOpacity style={[styles.betButton, styles.betEndedButton]}>
                    <Text>TYPOWANIE ZAKOŃCZONE</Text>
                </TouchableOpacity>
                }
                {this.props.betEnded === 0 &&
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Bet", {
                    matchID: this.props.id,
                    team1: this.props.team1,
                    team2: this.props.team2,
                    betGoals1: this.props.betGoals1,
                    betGoals2: this.props.betGoals2,
                })} style={styles.betButton}>
                    <Text>TYPUJ</Text>
                </TouchableOpacity>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    matchView1: {
        borderRadius: 10,
        borderColor: '#3a7917',
        borderWidth: 1,
        width: '95%',
        marginTop: 10,
        alignItems: 'center',
        padding: 5,
    },
    matchView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    middleView: {
        alignItems: 'center',
        flex: 2
    },
    scoreView: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    betButton: {
        marginTop: 10,
        alignSelf: 'center',
        backgroundColor: '#61a2ac',
        borderColor: '#0E395A',
        borderWidth: 1,
        width: '80%',
        height: 50,
        opacity: 0.8,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    betEndedButton: {
        backgroundColor: '#F1F9FF',
        borderColor: '#0E395A',
    }
});
