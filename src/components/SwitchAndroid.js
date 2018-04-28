'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, PixelRatio, Animated, Text, TouchableWithoutFeedback, Easing} from 'react-native';

export default class Switch extends Component {
    static propTypes = {
        value: React.PropTypes.bool,
        onValueChange: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || false,
            position: new Animated.Value(0),
        }

        this.changeValue = () => {
            this.state.value = !this.state.value;
            this.setState({
                value: this.state.value,
            })
            this.circleMove(this.state.value);
            this.props.onValueChange(this.state.value)
        }

        this.circleMove = value => {
            let toValue = value ? 20 : 0;
            Animated.timing(         
                this.state.position,  
                {
                    toValue: toValue,
                    duration: 400,  
                    easing: Easing.bezier(0.05,0.97,0.7,1),
                },         
            ).start();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            const newValue = nextProps.value;
            this.setState({
                value: newValue,
            })
            this.circleMove(newValue);
        }
    }
    componentWillMount(){
        this.circleMove(this.state.value);
    }
    componentWillUpdate(nextState, nextProps){
        if (this.state === nextState && this.props === nextProps) {
            return false
        }
    }
    render() {
        return (
            <View style={[styles.switchContainer, this.state.value ? styles.selectedStyle: null]}>
                {/*<View style={[styles.touchContainer,]}></View>*/}
                <TouchableWithoutFeedback onPress={this.changeValue}>
                    <Animated.View style={[styles.circle,  this.state.value ? styles.selectCircle: null, {
                        transform: [{translateX: this.state.position}]
                    }]}></Animated.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    switchContainer: {
        backgroundColor: '#fff',
        height: 30,
        width: 50,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#e5e5e5',
    },
    touchContainer: {
        height: 30,
        width: 50,
        borderRadius: 15,
        borderWidth: 0,
        borderColor: '#e5e5e5',
        position: 'absolute',

    },
    selectedStyle: {
        backgroundColor: '#4cd964',
        borderColor: '#4cd964',
    },
    circle: {
        height: 29,
        width: 29,
        backgroundColor: '#fff',
        borderColor: '#e5e5e5',
        borderWidth: 1,
        position: 'absolute',
        left: -1,
        top: -1,
        borderRadius: 15,
        shadowColor: 'red',
        shadowOffset: {width: 15, height: 15},
        shadowRadius: 10,
    },
    selectCircle: {
        borderColor: '#4cd964',
    }
});
