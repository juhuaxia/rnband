import React from 'react';
import {StyleSheet, View, Dimensions, PanResponder, findNodeHandle, Platform} from 'react-native';
import { UIManager} from 'NativeModules';
import Svg,{Circle, G, Line, Path, Rect} from 'react-native-svg';
import {Text as SvgText} from 'react-native-svg';
import IComponent from 'PaiBandRN/src/components/icomponent';
import {is, fromJS} from 'immutable';
const windowWidth = Dimensions.get('window').width;

export default class HeartChart extends IComponent {
	static propTypes =  {
		allHeartLog: React.PropTypes.any,
        timingHeartLog: React.PropTypes.array.isRequired,
        handHeartLog: React.PropTypes.array.isRequired,
        xscale: React.PropTypes.number.isRequired,
        excu: React.PropTypes.number.isRequired,
        leftexcu: React.PropTypes.number.isRequired,
        selectData: React.PropTypes.func.isRequired,
	}
    linePosition = [0, 50, 100, 150, 200]; //表格横线的位置
    svgTips = [50, 100, 150, 200]; //心率提示
    timeScale = Array.from({ length: 25 });
    heartLog = [...this.props.timingHeartLog, ...this.props.handHeartLog];
    state = {
        
    }
    
    constructor(props){
        super(props);
    }
    _moveSelectHeartData(event){
    	const length = this.heartLog.length;
    	const svgX = event.pageX - 20;
    	for (let i = 0; i < length; i++) {
    		if (Math.abs(svgX - this.heartLog[i].xlocation) <= 5) {
    			this.props.selectData(this.heartLog[i]);
    			break;
    		}
    	}

    	// let length = this.heartLog.length;
    	// let svgX;
    	// let svgY;
    	// if(Platform.OS === 'ios'){
    	// 	svgX = event.locationX;
    	// 	svgY = event.locationY;
    	// }else {
    	// 	if(!this.svgPageY){
    	// 		return
    	// 	}
    	// 	svgX = event.pageX - 20;
    	// 	svgY = event.pageY - this.svgPageY;
    	// }
    	
    	// for (let i = 0; i < length; i++) {
    	// 	if ((Math.abs(svgX - this.heartLog[i].xlocation) <= 5) && (svgY >= 202 - this.heartLog[i].rate && svgY <= 200-3)) {
    	// 		this.props.selectData(this.heartLog[i]);
    	// 		break;
    	// 	}
    	// }
    }
    _getSvgLocation(){
    	const handle = findNodeHandle(this.svgView);
        UIManager.measure(handle, async (x, y, width, height, pageX, pageY) => {
           	this.svgPageY = pageY;
        });
    }

    componentWillMount() {
       this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderGrant: (evt, gestureState) => {
            	// if(Platform.OS === 'android'){
            	// 	this._getSvgLocation();
            	// }

            	this._moveSelectHeartData(evt.nativeEvent);
            },
            onPanResponderMove: (evt, gestureState) => {
            	this._moveSelectHeartData(evt.nativeEvent);
            },
            onPanResponderRelease: (evt, gestureState) => {
		        this._moveSelectHeartData(evt.nativeEvent);
		    },
        });
    }
    componentDidMount() {
       
        
    }
    componentWillReceiveProps(nextProps) {
        this.heartLog = [...nextProps.timingHeartLog, ...nextProps.handHeartLog];
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }


    componentWillUnmount() {
        
    }
    render() {
        return (
        	<View>
	            <Svg
	                height="200"
	                width={windowWidth - 40}
	                {...this._panResponder.panHandlers}
	                ref={(svgView) => { this.svgView = svgView; }}
	            >
	                <Rect
	                    x="0"
	                    y="90"
	                    width={windowWidth - 40}
	                    height="60"
	                    fill="rgba(78,176,198, 0.1)"
	                />
	                {
	                    //数据为空显示提示
	                    this.props.allHeartLog&&!this.props.timingHeartLog.length&&!this.props.handHeartLog.length?<SvgText
	                        fontSize="16"
	                        fill="#c2c2c2"
	                        strokeWidth="1"
	                        x={(windowWidth - 40)/2 - 30}
	                        y="100"
	                        style={{fontFamily: 'PingFangSC-Regular'}}
	                        >{this.i18n('data_status_empty')}</SvgText> : null
	                }
	                {
	                    //横线
	                    this.linePosition.map((item, index) => {
	                        let lineWidth = 0.5;
	                        let dash = 3;
	                        if (index == this.linePosition.length - 1) {
	                            lineWidth = 2;
	                            dash = 0;
	                        }
	                        if (index == 0) {
	                            lineWidth = 1;
	                        }
	                        return <Line
	                            x1="0"
	                            y1={item}
	                            x2={windowWidth - 40}
	                            y2={item}
	                            stroke="#ebebeb"
	                            strokeWidth={lineWidth}
	                            strokeDasharray={[dash]}
	                            key={index}
	                        />
	                    })
	                }
	                {
	                    //左侧心率刻度提示
	                    this.svgTips.map((item, index) => {
	                        return <SvgText
	                        fontSize="10"
	                        fill="#c2c2c2"
	                        strokeWidth="1"
	                        x={0}
	                        y={200 - (50*index + 50)}
	                        key={index}
	                        style={{fontFamily: 'PingFangSC-Regular'}}
	                        >{item}</SvgText>
	                    })
	                }
	                {
	                    //定时测
	                    this.props.timingHeartLog.map((item, index) => {
	                        return <Line
	                            x1={item.xlocation}
	                            y1={202 - item.rate}
	                            x2={item.xlocation}
	                            y2={200-3}
	                            stroke="#F2253E"
	                            strokeWidth="4"
	                            strokeLinecap="round"
	                            key={index}
	                        />
	                    })
	                }
	                {
	                    //手动测
	                    this.props.handHeartLog.map((item, index) => {
	                        return <Line
	                            x1={item.xlocation}
	                            y1={202 - item.rate}
	                            x2={item.xlocation}
	                            y2={200-3}
	                            stroke = "#FCB000"
	                            strokeWidth="4"
	                            strokeLinecap="round"
	                            key={index}
	                        />
	                    })
	                }
	                {
	                    //时间刻度
	                    this.timeScale.map((item, index) => {
	                        let width = 0.5;
	                        if(index%6 == 0){
	                            width = 2;
	                        }
	                        return <Line
	                            x1={this.props.xscale*index + this.props.excu/2 - this.props.leftexcu}
	                            y1={195}
	                            x2={this.props.xscale*index + this.props.excu/2 - this.props.leftexcu}
	                            y2={200}
	                            stroke = "#ddd"
	                            strokeWidth={width}
	                            strokeLinecap="round"
	                            key={index}
	                        />
	                    })
	                }
	            </Svg>
        	</View>
        );
    }
}

const styles = StyleSheet.create({
   
})