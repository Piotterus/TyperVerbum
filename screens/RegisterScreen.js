import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions, Image, ImageBackground, ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import SafeAreaView from 'react-native-safe-area-view';
import ErrorModal from '../components/ErrorModal';
import CustomHeader from '../components/CustomHeader';

export default class RegisterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
            modalErrorVisible: false,
            error: '',
            isLoading: false,
        }
    }

    updateValue(text,field) {
        if (field === 'email' ){
            this.setState( {
                email: text,
            })
        } else if (field === 'password' ){
            this.setState( {
                password: text,
            })
        } else if (field === 'password2' ){
            this.setState( {
                password2: text,
            })
        }
    }

    objToQueryString(obj) {
        const keyValuePairs = [];
        for (const key in obj) {
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
        return keyValuePairs.join('&');
    }


    registerUser() {
        this.setState({
            isLoading: true,
        });
        if (this.state.password !== this.state.password2) {
            let error = {
                message: 'Hasła nie są zgodne'
            };
            this.setState({
                error: error,
                isLoading: false,
            }, () => this.setModalErrorVisible(true))
        } else if (this.state.password.length < 8) {
            let error = {
                message: 'Hasło musi mieć co najmniej 8 znaków'
            };
            this.setState({
                error: error,
                isLoading: false,
            }, () => this.setModalErrorVisible(true))
        } else {
            const queryString = this.objToQueryString({
                key: this.props.keyApp,
            });

            let body = {
                email: this.state.email,
                password: this.state.password,
            };

            let url = `https://panel.verbum.com.pl/apiverbum/apiVerbum/typerRegister?${queryString}`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.data.error.code === 0) {
                        let title = 'Dziękujemy za rejestracje';
                        let message = responseJson.data.info.message;
                        this.props.navigation.navigate('Login', {message: message, title: title});
                    } else {
                        this.setState({
                            error: responseJson.data.error,
                            isLoading: false,
                        }, () => this.setModalErrorVisible(true))
                    }
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false,
                        error: {
                            code: "BŁĄD",
                            message: "WYSTĄPIŁ NIESPODZIEWANY BŁĄD " + error
                        }
                    }, () => this.setModalErrorVisible(true));
                });
        }
    }

    setModalErrorVisible = (visible) => {
        this.setState({ modalErrorVisible: visible });
    };

    render() {
        return(
            <View style={{flex: 1, backgroundColor: '#b3b3b3'}}>
                <SafeAreaView style={{flex: 1}} forceInset={{ top: 'always', bottom: 0, right: 0, left: 0 }}>
                    <ImageBackground style={{flex: 1}} source={require('../images/background.jpg')}>
                        <CustomHeader type="back" navigation={this.props.navigation}/>
                        <ScrollView contentContainerStyle={[styles.backgroundContent, {flexGrow: 1}]}>
                            <ErrorModal visible={this.state.modalErrorVisible} error={this.state.error} setModalErrorVisible={this.setModalErrorVisible.bind(this)}/>
                            <View style={styles.textView}>
                                <Text style={styles.headerText}>Chcesz dołączyć do Typera Verbum?</Text>
                            </View>
                            <View style={styles.registerView}>
                                <TextInput
                                    placeholder="EMAIL"
                                    placeholderTextColor="#00000055"
                                    textAlign='center'
                                    style={styles.textInput}
                                    autoCapitalize='none'
                                    onChangeText = {(text) => this.updateValue(text,'email')}
                                />
                                <TextInput
                                    placeholder="HASŁO"
                                    placeholderTextColor="#00000055"
                                    textAlign='center'
                                    style={styles.textInput}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText = {(text) => this.updateValue(text,'password')}
                                />
                                <TextInput
                                    placeholder="POTWIERDZENIE HASŁA"
                                    placeholderTextColor="#00000055"
                                    textAlign='center'
                                    style={styles.textInput}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText = {(text) => this.updateValue(text,'password2')}
                                />
                            </View>
                            <View style={styles.bottomView}>
                                <TouchableOpacity onPress={() => this.registerUser()} style={styles.nextButton}>
                                    <Text style={{color: '#FFFFFF', fontSize: 16}}>ZAREJESTRUJ SIĘ</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    backgroundContent: {
        alignItems: 'center'
    },
    headerText: {
        color: '#777777',
        fontSize: 20,
        fontWeight: 'bold',
    },
    normalText: {
        color: '#FFFFFF',
        fontSize: 17,
    },
    textView: {
        width: '90%',
        alignItems: 'center',
    },
    registerView: {
        marginTop: 32,
        alignItems: 'center'
    },
    stepText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    textInput: {
        borderBottomColor: '#777777',
        borderBottomWidth: 1,
        //width: 200,
        width: Dimensions.get("window").width * 0.8,
        height: 40,
        color: '#000000',
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 50,
        marginBottom: 40,
    },
    backButton: {
        backgroundColor: '#FFFFFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#61a2ac',
        width: 241,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
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
