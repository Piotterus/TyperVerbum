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
    Switch,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Feather';
import ErrorModal from '../components/ErrorModal';
import CustomHeader from '../components/CustomHeader';

export default class BetScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            goals1: 0,
            goals2: 0,
            error: '',
            modalErrorVisible: false,
            matchID: '',
            team1: '',
            team2: '',
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
                    goals1: parseInt(this.props.route.params.betGoals1),
                    goals2: parseInt(this.props.route.params.betGoals2),
                })
            }
        });
        this.listenerBlur = this.props.navigation.addListener('blur', () => {

        });
    }

    componentWillUnmount() {
        this.listenerFocus();
        this.listenerBlur();
    }

    setModalErrorVisible = (visible) => {
        this.setState({ modalErrorVisible: visible });
    };

    addGoal(number) {
        if (number === 1) {
            this.setState({
                goals1: this.state.goals1 + 1
            })
        } else if (number === 2) {
            this.setState({
                goals2: this.state.goals2 + 1
            })
        }
    }

    subtractGoal(number) {
        if (number === 1) {
            if (this.state.goals1 > 0) {
                this.setState({
                    goals1: this.state.goals1 - 1
                })
            }
        } else if (number === 2) {
            if (this.state.goals2 > 0) {
                this.setState({
                    goals2: this.state.goals2 - 1
                })
            }
        }
    }

    sendBet() {
        const queryString = this.objToQueryString({
            key: this.props.keyApp,
            session: this.props.token,
        });
        let winner = 0;
        if (this.state.goals1 > this.state.goals2) {
            winner = this.state.team1.id;
        } else if (this.state.goals1 < this.state.goals2) {
            winner = this.state.team2.id;
        }
        let body = {
            match_id: this.state.matchID,
            goals1: this.state.goals1,
            goals2: this.state.goals2,
            winner: winner
        };

        let url = `https://panel.verbum.com.pl/apiverbum/apiVerbum/typerBetMatch?${queryString}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(async responseJson => {
                if (responseJson.data.error.code === 0) {
                    this.setState({
                        error: responseJson.data.info,
                    }, () => this.setModalErrorVisible(true))
                } else {
                    this.setState({
                        error: responseJson.data.error,
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

    render() {
        return(
            <View style={{flex: 1, backgroundColor: '#b3b3b3'}}>
                <SafeAreaView style={styles.view} forceInset={{ top: 'always', bottom: 0, right: 0, left: 0 }}>
                    <ImageBackground style={styles.view} source={require('../images/background.jpg')}>
                        <CustomHeader/>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
                            <ErrorModal visible={this.state.modalErrorVisible} error={this.state.error} setModalErrorVisible={this.setModalErrorVisible.bind(this)}/>
                            <View style={[styles.insideView, {flex: 1}]}>
                                <Text style={{color: '#777777', fontSize: 30}}>MECZ</Text>
                                <View style={styles.betView}>
                                    <View style={{flexDirection: 'row',width: '100%', alignItems: 'center', justifyContent: 'space-around'}}>
                                        <View style={styles.teamBetView}>
                                            <Text style={styles.teamText}>{this.state.team1.name}</Text>
                                            <Icon onPress={() => this.addGoal(1)} name="plus-circle" size={30} color="#3a7917"/>
                                            <Text style={styles.goalsText}>{this.state.goals1}</Text>
                                            <Icon onPress={() => this.subtractGoal(1)} name="minus-circle" size={30} color="#cd390d"/>
                                        </View>
                                        <View style={styles.teamBetView}>
                                            <Text style={styles.teamText}>{this.state.team2.name}</Text>
                                            <Icon onPress={() => this.addGoal(2)} name="plus-circle" size={30} color="#3a7917"/>
                                            <Text style={styles.goalsText}>{this.state.goals2}</Text>
                                            <Icon onPress={() => this.subtractGoal(2)} name="minus-circle" size={30} color="#cd390d"/>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => this.sendBet()} style={styles.betButton}>
                                        <Text>ZAPISZ TYP</Text>
                                    </TouchableOpacity>
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
        height: 40,
        color: '#ffffff',
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
    },
    goalsText: {
        fontSize: 30,
        color: '#777777'
    },
    teamText: {
        fontSize: 26,
        color: '#777777',
        height: 100,
        textAlign: 'center'
    }
});


