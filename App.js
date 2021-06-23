import React, {Fragment} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';

import createDrawerNavigator from '@react-navigation/drawer/src/navigators/createDrawerNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MatchListScreen from './screens/MatchListScreen';
import BetScreen from './screens/BetScreen';
import RankingScreen from './screens/RankingScreen';
import SplashScreen from './screens/SplashScreen';
import CustomDrawer from './components/CustomDrawer';
import QuestionListScreen from './screens/QuestionListScreen';
import AnswerScreen from './screens/AnswerScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default class App extends  React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isSettingUp: true,
      token: '',
      points: 0,
      rememberMe: false,
      week: 0,
    };
  }

  componentDidMount() {
    setTimeout(this.setup.bind(this), 500);
  }

  componentWillUnmount() {}

  objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]),
      );
    }
    return keyValuePairs.join('&');
  }

  setup = async () => {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    const token = await AsyncStorage.getItem('token');
    if (isLoggedIn !== '1') {
      this.setState({
        isSettingUp: false,
      });
    } else {
      this.setState({
        isSettingUp: false,
        isLoggedIn: true,
        token: token,
      });
    }
  };

  login(token) {
    this.setState({
      token: token,
      isLoggedIn: true,
    });
  }

  async logout() {
    await AsyncStorage.setItem('isLoggedIn', '0');
    await AsyncStorage.setItem('token', '');
    this.setState({
      isLoggedIn: false,
    });
  }

  rememberMe(value) {
    this.setState({
      rememberMe: value,
    });
  }

  updatePoints(value) {
    this.setState({
      points: value,
    });
  }

  render() {
    /*return (
        <SafeAreaProvider>
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Login"
                              screenOptions={{
                                headerShown: false,
                                headerTransparent: true,
                              }}
                              openByDefault={false}
            >
              <>
                <Drawer.Screen name="Login">
                  {props => <LoginScreen
                      {...props}
                      login={this.login.bind(this)}
                  />}
                </Drawer.Screen>
              </>
            </Drawer.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
    );*/
    if (this.state.isSettingUp) {
      return (
          <SafeAreaProvider>
            <SplashScreen/>
          </SafeAreaProvider>
      )
    }
    return (
        <SafeAreaProvider>
          <NavigationContainer>
            {this.state.isLoggedIn ? (
                <Drawer.Navigator initialRouteName="Home"
                                  screenOptions={{
                                    headerShown: false,
                                    headerTransparent: true,
                                  }}
                                  drawerContent={(props) => <CustomDrawer
                                      logout={this.logout.bind(this)} {...props}
                                      firstName={this.state.firstName} lastName={this.state.lastName}/>}
                                  openByDefault={false}
                >
                  <>
                    <Drawer.Screen name="Home">
                      {props => <HomeScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                          points={this.state.points}
                          updatePoints={this.updatePoints.bind(this)}
                      />}
                    </Drawer.Screen>
                    <Drawer.Screen name="MatchList">
                      {props => <MatchListScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                          points={this.state.points}
                      />}
                    </Drawer.Screen>
                    <Drawer.Screen name="Ranking">
                      {props => <RankingScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                          points={this.state.points}
                      />}
                    </Drawer.Screen>
                    <Drawer.Screen name="Bet">
                      {props => <BetScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                          points={this.state.points}
                      />}
                    </Drawer.Screen>
                    <Drawer.Screen name="QuestionList">
                      {props => <QuestionListScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                          points={this.state.points}
                      />}
                    </Drawer.Screen>
                    <Drawer.Screen name="Answer">
                      {props => <AnswerScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                          points={this.state.points}
                      />}
                    </Drawer.Screen>
                  </>
                </Drawer.Navigator>
            ) : (
                <Stack.Navigator initialRouteName="Login"
                                 screenOptions={{
                                   headerShown: false,
                                   headerTransparent: true,
                                 }}
                >
                  <>
                    <Stack.Screen name="Login"
                                  options={{
                                    title: 'Login',
                                    headerStyle: {
                                      backgroundColor: 'transparent',
                                    },
                                    gestureEnabled: false,
                                  }}
                    >
                      {props => <LoginScreen
                          {...props}
                          login={this.login.bind(this)}
                          keyApp={this.state.key}
                          rememberMe={this.rememberMe.bind(this)}
                      />}
                    </Stack.Screen>
                    <Stack.Screen name="Register">
                      {props => <RegisterScreen
                          {...props}
                          token={this.state.token}
                          keyApp={this.state.key}
                      />}
                    </Stack.Screen>
                  </>
                </Stack.Navigator>
            )}
          </NavigationContainer>
        </SafeAreaProvider>
    )
  }
}
