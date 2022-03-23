import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  Switch, ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Feather';
import ErrorModal from '../components/ErrorModal';
import CustomHeader from '../components/CustomHeader';

export default class BetBookMakerScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      betOutcome: null,
      odds: 0,
      error: '',
      modalErrorVisible: false,
      matchID: '',
      team1: '',
      team2: '',
      isLoading: true,
      pointsBet: '0',
      betDone: false,
    }
  }

  objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
  }

  componentDidMount() {
    this.listenerFocus = this.props.navigation.addListener('focus', () => {
      //if (typeof this.props.route.params.title !== "undefined" && typeof this.props.route.params.message !== "undefined" ) {
      console.log(this.props.route.params);
      if (this.props.route.params?.matchID) {
        if (this.props.route.params.betGoals1 === null) {
          this.props.route.params.betGoals1 = 0;
        }
        if (this.props.route.params.betGoals2 === null) {
          this.props.route.params.betGoals2 = 0;
        }
        this.setState({
          matchID: this.props.route.params.matchID,
          team1: this.props.route.params.team1,
          team2: this.props.route.params.team2,
          betOutcome: this.props.route.params.betOutcome,
          odds: this.props.route.params.odds,
          pointsBet: '0',
          betDone: false,
        }, () => this.setState({isLoading: false}))
      }

      const queryString = this.objToQueryString({
        key: this.props.keyApp,
        token: this.props.token,
      });

      let url = `${this.props.baseURL}/typer/myPoints?${queryString}`;
      console.log(url);
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.error.code === 0) {
            this.props.updatePoints(responseJson.points);
          } else {
            this.setState({
              isLoading: false,
              error: responseJson.error
            }, () => this.setModalErrorVisible(true));
          }
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error: {
              code: "BŁĄD",
              message: "WYSTĄPIŁ NIESPODZIEWANY BŁĄD"
            }
          }, () => this.setModalErrorVisible(true));
        });

    });
    this.listenerBlur = this.props.navigation.addListener('blur', () => {
      this.setState({
        isLoading: true,
      })
    });
  }

  componentWillUnmount() {
    this.listenerFocus();
    this.listenerBlur();
  }

  setModalErrorVisible = (visible) => {
    this.setState({ modalErrorVisible: visible });
  };

  setOutcome(outcome) {
    this.setState({
      betOutcome: outcome,
    })
  }

  sendBet() {
    if (this.state.betOutcome === '' || this.state.betOutcome === null) {
      this.setState({
        error: {
          code: "BŁĄD",
          message: "MUSISZ WYBRAĆ WYNIK"
        }
      }, () => this.setModalErrorVisible(true));
      return false;
    }
    this.setState({
      isLoading: true,
    });
    const queryString = this.objToQueryString({
      key: this.props.keyApp,
      token: this.props.token,
    });

    let body = {
      fixture_id: this.state.matchID,
      outcome: this.state.betOutcome,
      pointsBet: this.state.pointsBet,
    };

    let url = `${this.props.baseURL}/typer/betMatchBookMaker?${queryString}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson.error.code === 0) {
          this.setState({
            error: responseJson.info,
            isLoading: false,
            betDone: true,
          }, () => this.setModalErrorVisible(true))
        } else {
          this.setState({
            error: responseJson.error,
            isLoading: false,
          }, () => this.setModalErrorVisible(true))
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          error: {
            code: "BŁĄD",
            message: "WYSTĄPIŁ NIESPODZIEWANY BŁĄD"
          }
        }, () => this.setModalErrorVisible(true));
      });
  }

  updateValue(text,field) {
    if (field === 'pointsBet') {
      this.setState({
        pointsBet: text,
      })
    }
  }

  render() {
    return(
      <View style={{flex: 1, backgroundColor: '#b3b3b3'}}>
        <SafeAreaView style={styles.view} forceInset={{ top: 'always', bottom: 0, right: 0, left: 0 }}>
          <ImageBackground style={styles.view} source={require('../images/background.jpg')}>
            <CustomHeader type="back" navigation={this.props.navigation}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
              <ErrorModal visible={this.state.modalErrorVisible} error={this.state.error} setModalErrorVisible={this.setModalErrorVisible.bind(this)}/>
              <View style={[styles.insideView, {flex: 1}]}>
                <Text style={{color: '#777777', fontSize: 30}}>MECZ</Text>
                <View style={styles.betView}>
                  <View style={{flexDirection: 'row',width: '100%', alignItems: 'center', justifyContent: 'space-around'}}>
                    <View style={styles.teamBetView}>
                      <TouchableOpacity style={styles.teamButton} onPress={() => this.setOutcome(1)}>
                        {this.state.betOutcome === 1 &&
                          <Text style={[styles.teamText, styles.winnerText]}>{this.state.team1.name}</Text>
                        }
                        {this.state.betOutcome !== 1 &&
                          <Text style={styles.teamText}>{this.state.team1.name}</Text>
                        }
                        <Text style={styles.teamText}>{this.state.odds.pre1}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.teamBetView}>
                      <TouchableOpacity style={styles.teamButton} onPress={() => this.setOutcome("X")}>
                        {this.state.betOutcome === "X" &&
                          <Text style={[styles.teamText, styles.winnerText]}>REMIS</Text>
                        }
                        {this.state.betOutcome !== "X" &&
                          <Text style={styles.teamText}>REMIS</Text>
                        }
                        <Text style={styles.teamText}>{this.state.odds.preX}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.teamBetView}>
                      <TouchableOpacity style={styles.teamButton} onPress={() => this.setOutcome(2)}>
                        {this.state.betOutcome === 2 &&
                          <Text style={[styles.teamText, styles.winnerText]}>{this.state.team2.name}</Text>
                        }
                        {this.state.betOutcome !== 2 &&
                          <Text style={styles.teamText}>{this.state.team2.name}</Text>
                        }
                        <Text style={styles.teamText}>{this.state.odds.pre2}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.teamText}>Podaj ile punktów chcesz postawić</Text>
                    <TextInput
                      placeholder="PUNKTY"
                      placeholderTextColor="#00000033"
                      textAlign='center'
                      style={styles.textInput}
                      onChangeText = {(text) => this.updateValue(text,'pointsBet')}
                      autoCapitalize="none"
                      keyboardType={'numeric'}
                      value={this.state.pointsBet}
                    />
                  </View>
                  {!this.state.betDone &&
                    <TouchableOpacity onPress={() => this.sendBet()} style={styles.betButton}>
                      <Text>ZAPISZ TYP</Text>
                    </TouchableOpacity>
                  }
                  {this.state.betDone &&
                    <View style={styles.betButton}>
                      <Text>MECZ OBSTAWIONY</Text>
                    </View>
                  }
                </View>
              </View>
            </ScrollView>
            <View style={styles.bottomView}>
              <Text style={styles.bottomText}>
                Twoje punkty:
              </Text>
              <Text style={styles.bottomText}>
                {this.props.points}
              </Text>
            </View>
          </ImageBackground>
          {this.state.isLoading &&
            <View style={styles.loading}>
              <ActivityIndicator size='large' color='#0A3251'/>
            </View>
          }
        </SafeAreaView>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  imageBackground: {
    //width: Dimensions.get("window").width, //for full screen
    //height: Dimensions.get("window").height, //for full screen
    //width: '100%',
    height: '100%',
    //backgroundColor: 'yellow',
    alignItems: 'center',
  },
  view: {
    flex: 1,
  },
  insideView: {
    alignItems: 'center',
    width: Dimensions.get("window").width,//* 0.8,
    justifyContent: 'center',
    //height: Dimensions.get("window").height, //for full screen
  },
  remindMeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center'
  },
  remindMeText: {
    color: '#ffffff',
    fontSize: 13,

  },
  container: {
    flex: 1,
    //marginTop: 20,
  },
  scrollView: {
    //backgroundColor: 'blue',
    flex: 1,
  },
  text: {
    fontSize: 25,
    color: '#ffffff',
  },
  textInput: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: 1,
    //width: 200,
    width: Dimensions.get("window").width * 0.8,
    color: '#777777',
    fontSize: 20,
    marginTop: 5
  },
  loginButton: {
    backgroundColor: '#61a2ac',
    width: '80%',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginTop: 55,
    borderRadius: 25,
    shadowColor: '#000000',//'#00000080',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5
  },
  loginText: {
    color: '#ffffff',
    fontSize: 16,

  },
  signinButton: {
    marginTop: 30,
    backgroundColor: '#F1F9FF',
    borderColor: '#0E395A',
    borderWidth: 1,
    width: '80%',
    height: 50,
    opacity: 0.8,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 287,
  },
  signinText: {
    color: '#0A3251',
    fontSize: 16,
  },
  signinImage: {
    height: 23.38,
    width: 23.38,
  },
  bottomView: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#61a2ac',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  bottomText: {
    color: '#FFFFFF',
    fontSize: 18,

  },
  headerView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 15,
    alignItems: 'center'
  },
  matchesListView: {
    backgroundColor: '#DDDDDD',
    height: '100%',
    width: '95%',
    marginBottom: 30,
    alignItems: 'center'
  },
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
  },
  betView: {
    height: 300,
    width: '90%',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  teamBetView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  goalsText: {
    fontSize: 30,
    color: '#777777'
  },
  teamText: {
    fontSize: 26,
    color: '#777777',
    //height: 100,
    textAlign: 'center'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A3A3A3',
    opacity: 0.25
  },
  winnerText: {
    color: '#ededed',
    backgroundColor: '#62ad37',
  },
  teamButton: {

  }
});


