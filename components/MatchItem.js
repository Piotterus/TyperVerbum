import React from 'react'
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView} from "react-native";

export default class MatchItem extends React.Component {

    render() {
        return(
            <View style={styles.matchView1}>
                <Text>{this.props.stage}</Text>
                <View style={styles.matchView}>
                    {this.props.winner === this.props.team1.id &&
                        <Text style={{flex: 1, color: '#00DD44', fontWeight: 'bold'}}>{this.props.team1.name}</Text>
                    }
                    {this.props.winner !== this.props.team1.id &&
                        <Text style={{flex: 1}}>{this.props.team1.name}</Text>
                    }
                    <View style={styles.middleView}>
                        <Text>{this.props.time}</Text>
                        <View style={styles.scoreView}>
                            <Text>{this.props.goals1}</Text>
                            <Text>:</Text>
                            <Text>{this.props.goals2}</Text>
                        </View>
                        {this.props.betGoals1 !== null && this.props.betGoals2 !== null &&
                        <Text>
                            Twój TYP - {this.props.betGoals1}:{this.props.betGoals2}
                            {this.props.betWinner === this.props.team1.id &&
                            <Text>{" ("}{this.props.team1.name}{")"}</Text>
                            }
                            {this.props.betWinner === this.props.team2.id &&
                            <Text>{" ("}{this.props.team2.name}{")"}</Text>
                            }
                        </Text>
                        }
                        {(this.props.betGoals1 === null || this.props.betGoals2 === null) &&
                        <Text>
                            Twój TYP - BRAK
                        </Text>
                        }
                    </View>
                    {this.props.winner === this.props.team2.id &&
                        <Text style={{flex: 1, textAlign: 'right', color: '#00DD44', fontWeight: 'bold'}}>{this.props.team2.name}</Text>
                    }
                    {this.props.winner !== this.props.team2.id &&
                        <Text style={{flex: 1, textAlign: 'right'}}>{this.props.team2.name}</Text>
                    }
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
