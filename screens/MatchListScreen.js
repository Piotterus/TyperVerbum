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
    ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Feather';
import RankingItem from '../components/RankingItem';
import MatchItem from '../components/MatchItem';
import CustomHeader from '../components/CustomHeader';

export default class MatchListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            matchList: '',
            competitionList: '',
            competitionIndex: 0,
            error: '',
            modalErrorVisible: false,
            isLoading: true,
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

            const queryString = this.objToQueryString({
                //key: this.props.keyApp,
                token: this.props.token,
            });

            let url = `${this.props.baseURL}/typer/matchesList?${queryString}`;
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
                        this.setState({
                            competitionList: responseJson.competitionList,
                            matchList: responseJson.matchList,
                        }, () => this.setState({isLoading: false}))
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

    addDay() {
        if (this.state.competitionIndex < this.state.competitionList.length - 1) {
            this.setState({
                competitionIndex: this.state.competitionIndex + 1
            })
        } else {
            this.setState({
                competitionIndex: 0
            })
        }
    }

    subtractDay() {
        if (this.state.competitionIndex > 0) {
            this.setState({
                competitionIndex: this.state.competitionIndex - 1
            })
        } else {
            this.setState({
                competitionIndex: this.state.competitionList.length - 1
            })
        }
    }

    createMatchList() {
        let number = 0;
        let matchList = [];
        for (let i in this.state.matchList) {
            if (this.state.matchList[i].competition.id === this.state.competitionList[this.state.competitionIndex].id) {
                number++;
                matchList.push(<MatchItem
                    key={i}
                    number={number}
                    navigation={this.props.navigation}
                    id={this.state.matchList[i].fixture_id}
                    team1={this.state.matchList[i].home}
                    team2={this.state.matchList[i].away}
                    goals1={this.state.matchList[i].home.goals}
                    goals2={this.state.matchList[i].away.goals}
                    betGoals1={this.state.matchList[i].home.betGoals}
                    betGoals2={this.state.matchList[i].away.betGoals}
                    betWinner={this.state.matchList[i].winner}
                    status={this.state.matchList[i].status}
                    date={this.state.matchList[i].date}
                    time={this.state.matchList[i].time}
                    betEnded={this.state.matchList[i].betEnded}
                    winner={this.state.matchList[i].outcomeWinner}
                    winnerRequired={this.state.matchList[i].winnerRequired}
                />)
            }
        }
        return matchList;
    }

    render() {
        console.log(this.state.competitionList[this.state.competitionIndex]?.id)
        return(
            <View style={{flex: 1, backgroundColor: '#b3b3b3'}}>
                <SafeAreaView style={styles.view} forceInset={{ top: 'always', bottom: 0, right: 0, left: 0 }}>
                    <ImageBackground style={styles.view} source={require('../images/background.jpg')}>
                        <CustomHeader type="back" navigation={this.props.navigation}/>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
                            <View style={styles.headerView}>
                                <Icon onPress={() => this.subtractDay()} name="arrow-left" size={30} color="#777777"/>
                                <Text style={{color: '#777777'}}>
                                    {this.state.competitionList[this.state.competitionIndex]?.name}
                                </Text>
                                <Icon onPress={() => this.addDay()} name="arrow-right" size={30} color="#777777"/>
                            </View>
                            <View style={[styles.insideView, {flex: 1}]}>
                                <View style={styles.matchesListView}>
                                    {this.createMatchList()}
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
    headerImage: {
        width: '100%',
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
        height: '100%',
        width: '90%',
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
    }
});


