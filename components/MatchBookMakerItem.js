import React from 'react'
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView} from "react-native";

export default class MatchBookMakerItem extends React.Component {

  render() {
    return(
      <View style={styles.matchView1}>
        <Text>{this.props.status}</Text>
        <View style={styles.matchView}>
          {this.props.outcomeFullTime === 1 &&
            <Text style={{flex: 1, color: '#00DD44', fontWeight: 'bold'}}>{this.props.team1.name}</Text>
          }
          {this.props.outcomeFullTime !== 1 &&
            <Text style={{flex: 1}}>{this.props.team1.name}</Text>
          }
          <View style={styles.middleView}>
            <Text>{this.props.datetime}</Text>
            <View style={styles.scoreView}>
              <Text>{this.props.goals1}</Text>
              <Text>:</Text>
              <Text>{this.props.goals2}</Text>
            </View>
            {this.props.betOutcome !== null &&
              <Text>
                Twój TYP - {this.props.betOutcome}
                {this.props.betOutcome === 1 &&
                  <Text>{" ("}{this.props.team1.name}{")"}</Text>
                }
                {this.props.betOutcome === 2 &&
                  <Text>{" ("}{this.props.team2.name}{")"}</Text>
                }
                {this.props.betOutcome === "X" &&
                  <Text>(REMIS)</Text>
                }
              </Text>
            }
            {this.props.betOutcome !== null &&
              <Text>
                Stawka - {this.props.pointsBet}
              </Text>
            }
            {this.props.betOutcome !== null &&
              <Text>
                Wygrana - {this.props.pointsWon}
              </Text>
            }
            {this.props.betOutcome === null &&
              <Text>
                Twój TYP - BRAK
              </Text>
            }
          </View>
          {this.props.outcomeFullTime === 2 &&
            <Text style={{flex: 1, textAlign: 'right', color: '#00DD44', fontWeight: 'bold'}}>{this.props.team2.name}</Text>
          }
          {this.props.outcomeFullTime !== 2 &&
            <Text style={{flex: 1, textAlign: 'right'}}>{this.props.team2.name}</Text>
          }
        </View>
        {this.props.betEnded === 1 &&
          <View style={[styles.betButton, styles.betEndedButton]}>
            <Text>TYPOWANIE ZAKOŃCZONE</Text>
          </View>
        }
        {this.props.betOutcome !== null &&
          <View style={[styles.betButton, styles.betEndedButton]}>
            <Text>JUŻ WYTYPOWAŁEŚ TEN MECZ</Text>
          </View>
        }
        {this.props.betEnded === 0 && this.props.betOutcome === null &&
          <TouchableOpacity onPress={() => this.props.navigation.navigate("BetBookMaker", {
            matchID: this.props.id,
            team1: this.props.team1,
            team2: this.props.team2,
            betOutcome: this.props.betOutcome,
            odds: this.props.odds,
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
