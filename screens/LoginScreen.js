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
import ErrorModal from '../components/ErrorModal';
import CustomHeader from '../components/CustomHeader';

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            modalErrorVisible: false,
        }
    }

    objToQueryString(obj) {
        const keyValuePairs = [];
        for (const key in obj) {
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
        return keyValuePairs.join('&');
    }

    login(email,password) {

        if (email === "") {
            email = "Test"//"PL45"//"PL42"//"PL22"
        }
        if (password === "") {
            password = "aaaaaaaa"//"7FD73G7G"//"3DG61B7L"//"9LB92F3D"
        }

        const queryString = this.objToQueryString({
            key: this.props.keyApp,
        });
        let body = {
            email: email,
            password: password,
        };

        let url = `https://panel.verbum.com.pl/apiverbum/apiVerbum/typerLogin?${queryString}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(async responseJson => {
                console.log(responseJson);
                if (responseJson.data.error.code === 0) {
                    await AsyncStorage.setItem('isLoggedIn', '1');
                    await AsyncStorage.setItem('token', responseJson.data.token);
                    this.props.login(responseJson.data.token)
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

    componentDidMount() {
        this.listenerFocus = this.props.navigation.addListener('focus', () => {
            //if (typeof this.props.route.params.title !== "undefined" && typeof this.props.route.params.message !== "undefined" ) {
            if (this.props.route.params?.title && this.props.route.params?.message) {
                this.setState({
                    error: {
                        code: this.props.route.params.title,
                        message: this.props.route.params.message,
                    }
                }, () => this.setModalErrorVisible(true))
            }
        });
        this.listenerBlur = this.props.navigation.addListener('blur', () => {

        });
    }

    componentWillUnmount() {
        this.listenerFocus();
        this.listenerBlur();
    }

    updateValue(text,field) {
        if (field === 'email') {
            this.setState({
                email: text,
            })
        } else if (field === 'password' ){
            this.setState( {
                password: text,
            })
        }
    }

    setModalErrorVisible = (visible) => {
        this.setState({ modalErrorVisible: visible });
    };

    render() {
        return(
            <View style={{flex: 1, backgroundColor: '#b3b3b3'}}>
                <SafeAreaView style={styles.view} forceInset={{ top: 'always', bottom: 0, right: 0, left: 0 }}>
                    <ImageBackground style={styles.view} source={require('../images/background.jpg')}>
                        <CustomHeader/>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
                            <ErrorModal visible={this.state.modalErrorVisible} error={this.state.error} setModalErrorVisible={this.setModalErrorVisible.bind(this)}/>
                            <View style={[styles.insideView, {flex: 1}]}>
                                <TextInput
                                    placeholder="LOGIN"
                                    placeholderTextColor="#00000033"
                                    textAlign='center'
                                    style={styles.textInput}
                                    onChangeText = {(text) => this.updateValue(text,'email')}
                                    autoCapitalize="none"
                                />
                                <TextInput
                                    placeholder="HASŁO"
                                    placeholderTextColor="#00000033"
                                    textAlign='center'
                                    style={styles.textInput}
                                    secureTextEntry={true}
                                    onChangeText = {(text) => this.updateValue(text,'password')}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => this.login(this.state.email, this.state.password)} style={styles.loginButton}>
                                    <Text style={styles.loginText}>ZALOGUJ SIĘ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")} style={styles.signinButton}>
                                    <Text style={styles.signinText}>ZAREJESTRUJ SIĘ</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
        borderBottomColor: '#777777',
        borderBottomWidth: 1,
        //width: 200,
        width: Dimensions.get("window").width * 0.8,
        height: 40,
        color: '#000000',
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
    }
});


