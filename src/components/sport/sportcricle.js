import React from 'react';
import {
    StyleSheet, Text, View ,Image,Dimensions
} from 'react-native';
import PercentageCircle from 'react-native-percentage-circle';
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';

//圆进度
class SportCricle extends IComponent{
    propTypes: {
        color: React.PropTypes.string,
        bgcolor: React.PropTypes.string,
        innerColor: React.PropTypes.string,
        radius: React.PropTypes.number,
        percent: React.PropTypes.number,
        borderWidth: React.Proptypes.number,
        textStyle: React.Proptypes.array,
        disabled: React.PropTypes.bool,
   }


    constructor(props) {
        super(props);

        let percent = this.props.percent;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';
        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
            leftTransformerDegree = '0deg';
        }
        if(parseInt(leftTransformerDegree) > 180) {
          leftTransformerDegree = '180deg';
        }
        if(parseInt(rightTransformerDegree) > 180) {
          rightTransformerDegree = '180deg';
        }

        this.state = {
            percent: this.props.percent,
            borderWidth: this.props.borderWidth < 2 || !this.props.borderWidth ? 2 : this.props.borderWidth,
            leftTransformerDegree: leftTransformerDegree,
            rightTransformerDegree: rightTransformerDegree,
            textStyle: this.props.textStyle ? this.props.textStyle : null
        };
    }

    componentWillReceiveProps(nextProps) {
        let percent = nextProps.percent || 0;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';
        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
            leftTransformerDegree = '0deg';
        }
        if(parseInt(leftTransformerDegree) > 180) {
          leftTransformerDegree = '180deg';
        }
        if(parseInt(rightTransformerDegree) > 180) {
          rightTransformerDegree = '180deg';
        }
        this.setState({
            percent: this.props.percent,
            borderWidth: this.props.borderWidth < 2 || !this.props.borderWidth ? 2 : this.props.borderWidth,
            leftTransformerDegree: leftTransformerDegree,
            rightTransformerDegree: rightTransformerDegree
        });
    }

    render() {
        if (this.props.disabled) {
            return (
                <View style={[styles.circle,{
                    width:this.props.radius*2,
                    height: this.props.radius*2,
                    borderRadius:this.props.radius
                }]}>
                    <Text style={styles.text}>{this.props.disabledText}</Text>
                </View>
            );
        }
        return (
            <View style={[styles.circle,{
                width:this.props.radius*2,
                height: this.props.radius*2,
                borderRadius:this.props.radius,
                backgroundColor: this.props.bgcolor,
                transform:[{"rotate":this.props.rotate}],
            }]}>
                <View style={[styles.leftWrap,{
                    width: this.props.radius,
                    height: this.props.radius * 2,
                    left:0,
                }]}>
                    <View style={[styles.loader,{
                        left: this.props.radius,
                        width:this.props.radius,
                        height: this.props.radius*2,
                        borderTopLeftRadius:0,
                        borderBottomLeftRadius:0,
                        backgroundColor:this.props.color,
                        transform:[{translateX:-this.props.radius/2},{rotate:this.state.rightTransformerDegree},{translateX:this.props.radius/2}],
                    }]}></View>
                </View>
                <View style={[styles.leftWrap,{
                    left:this.props.radius,
                    width: this.props.radius,
                    height: this.props.radius * 2,
                }]}>
                    <View style={[styles.loader,{
                        left:-this.props.radius,
                        width:this.props.radius,
                        height: this.props.radius*2,
                        borderTopRightRadius:0,
                        borderBottomRightRadius:0,
                        backgroundColor: this.props.percent < 50 ? this.props.bgcolor : this.props.color,
                        transform:[{translateX:this.props.radius/2},{rotate:this.state.leftTransformerDegree},{translateX:-this.props.radius/2}],  
                    }]}></View>
                </View>
                <View style={[styles.innerCircle,{
                    width:(this.props.radius - this.state.borderWidth)*2,
                    height:(this.props.radius - this.state.borderWidth)*2,
                    borderRadius:this.props.radius - this.state.borderWidth,
                    backgroundColor: this.props.innerColor,
                }]}>
                </View>
            </View>
         );
    }
}

PercentageCircle.defaultProps = {
    bgcolor: '#e3e3e3',
    innerColor: '#fff'
};

const styles = StyleSheet.create({
    circle: {
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e3e3e3',
    },
    leftWrap: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        zIndex: 100,
    },
    rightWrap: {
        position: 'absolute',
    },
    loader: {
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 1000,
    },

    innerCircle: {
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 101,
    },
    text: {
        fontSize: 11,
        color: '#888',
    },
});

export default SportCricle;
