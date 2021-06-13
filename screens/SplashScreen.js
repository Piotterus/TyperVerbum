import React from 'react'

import {Image, StyleSheet, Dimensions, View, Text, ImageBackground} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

export default class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (
            <View style={{flex: 1, backgroundColor: '#b3b3b3'}}>
                <SafeAreaView style={{flex: 1, justifyContent: 'center'}} forceInset={{ top: 'always', bottom: 0, right: 0, left: 0 }}>
                    <ImageBackground style={{flex: 1, justifyContent: 'center'}} source={require('../images/background.jpg')}>
                        <Image resizeMode="contain" source={require('../images/header.png')} style={styles.imageBackground}/>
                        <Image resizeMode="contain" source={require('../images/header.png')} style={styles.imageBackground}/>
                        <Image resizeMode="contain" source={require('../images/header.png')} style={styles.imageBackground}/>
                    </ImageBackground>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageBackground: {
        width: Dimensions.get("window").width, //for full screen
    },
});
