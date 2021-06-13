import React from 'react'
import {Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Modal from 'react-native-modal';

export default class ErrorModal extends React.Component {

    render() {
        let errorTitle = this.props.error.code;
        let errorMessage = this.props.error.message;

        return (
            <Modal isVisible={this.props.visible}>
                <TouchableWithoutFeedback onPress={() => this.props.setModalErrorVisible(false)}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{backgroundColor: '#FFFFFF', height: 140, width: '70%', padding: 5, justifyContent: 'space-around', alignItems: 'center', borderRadius: 10}}>
                            <Text style={{color: '#0E395A', fontSize: 16, marginLeft: 10, fontWeight: 'bold'}}>{errorTitle}</Text>
                            <Text style={{color: '#0E395A', fontSize: 14, marginLeft: 10}}>{errorMessage}</Text>
                            <View style={{width: '100%', alignItems: 'center', alignSelf: 'center'}}>
                                <View
                                    style={{
                                        height: 1,
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 1,
                                        width: '90%',
                                        backgroundColor: 'blue'
                                    }}
                                />
                                <TouchableOpacity style={{alignSelf: 'stretch'}} onPress={() => this.props.setModalErrorVisible(false)}>
                                    <Text style={{color: '#2592E6', alignSelf: 'center', paddingTop: 10}}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}
