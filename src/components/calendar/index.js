import React from 'react';
import {
    StyleSheet, Image, View,Dimensions,Text,TouchableOpacity,Animated,Easing
} from 'react-native';
import PSComponent from 'PaiBandRN/src/components/pscomponent';

import Calendarl from 'react-native-calendar';
import styles from './styles'


//const customDayHeadings = ['S', '一', '二', '三', '四', '五', '六'];
//const customMonthNames = ['1月', '2月', '3月', '4月', '5月',
  //'6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class Calendar extends PSComponent {
    constructor(props){
        super(props);

        // this.animatedValue = new Animated.Value(0)
        this.state = {
            // weeks:['日','一','二','三','四','五','六'],
            currentDayVal:null,
            selectedDate:null,
            fadeAnim: new Animated.Value(0),
            eventDates: props.eventDates
        }
    }

    componentDidMount() {
        this.animate();
    }

    componentWillReceiveProps(nextprops) {
        this.setState({
            eventDates: nextprops.eventDates || this.state.eventDates
        });
    }

    animate () {
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 500,
            // delay: 1000,
            easing: Easing.ease
        }).start()
    };
    formateDate(date){
        return date.split('T')[0];
    }
    dateSelect(date){
        const formateDate = this.formateDate(date);
        if(this.state.eventDates) {
            for(let i = 0; i < this.state.eventDates.length; i++) {
                if(formateDate == this.state.eventDates[i]) {
                    this.props.onDateSelect(new Date(date));
                }
            }
        } else {
            this.props.onDateSelect(new Date(date));
        }
    }

    onTouchPrev(e) {
        this.props.onDateChange(new Date(e._d));
    }

    onTouchNext(e) {
        this.props.onDateChange(new Date(e._d));
    }

    onSwipePrev(e) {
        this.props.onDateChange(new Date(e._d));
    }

    onSwipeNext(e) {
        this.props.onDateChange(new Date(e._d));
    }

    seeAnalysis(){
        this.props.onAnalysis && typeof this.props.onAnalysis === 'function' && this.props.onAnalysis();
    }

    render(){
        let analysisBtn = null;
        if(!this.props.hideAnalysis) {
            analysisBtn = (
                <View style={styles.calendar_foot}>
                    <View style={styles.calendar_foot_inner}>
                        <TouchableOpacity onPress = {()=>this.seeAnalysis()} style={styles.calendar_foot_inner_touchbar}>
                            <Image style={styles.calendar_summaryicon} resizeMode="cover" source={require('PaiBandRN/res/images/icon_20_89.png')}></Image>
                            <Text style={styles.calendar_summarytext}>View statistical analysis</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.calendar}>
                <Animated.View style={[styles.calendar_box,
                        {
                            transform: [
                                {
                                translateY: this.state.fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-288, 352]
                                })
                                }
                            ]
                        }
                    ]}>
                    <View style={{height: 20, backgroundColor: '#FFF'}}/>
                    <Calendarl
                        customStyle={!!this.state.eventDates ? customStyle : showStyle}
                        ref="calendar"
                        scrollEnabled
                        showControls={true}
                        dayHeadings={customDayHeadings}
                        monthNames={customMonthNames}
                        titleFormat={'MMMM YYYY'}
                        prevButtonText={'Prev'}
                        nextButtonText={'Next'}
                        weekStart={0}
                        showEventIndicators={!!this.state.eventDates}
                        eventDates={this.state.eventDates || []}
                        selectedDate={this.props.selectedDate}
                        onTouchPrev={(e) => this.onTouchPrev(e)}
                        onTouchNext={(e) => this.onTouchNext(e)}
                        onSwipePrev={(e) => this.onSwipePrev(e)}
                        onSwipeNext={(e) => this.onSwipeNext(e)}
                        onDateSelect={(date) => this.dateSelect(date)}/>
                        {analysisBtn}
                </Animated.View>
            </View>
        )
    }
}

/**customStyle */
const customStyle = {
    calendarContainer: {
      backgroundColor: '#FFF',
      height: 340
    },
    controlButton: {
        marginLeft: 10,
        marginRight: 10
    },
    dayButton:{
        borderTopColor:'transparent'
    },
    day: {
        color: '#121212',
        opacity: 0.4
    },
    dayHeading:{
        color:'#000',
    },
    weekendHeading:{
        color:'#000',
    },
    weekendDayButton: {
        backgroundColor: '#FFF'
    },
    weekendDayText: {
        color: '#121212',
        opacity: 0.4
    },
    calendarHeading:{
        borderTopWidth:0,
        borderBottomWidth:0,
        backgroundColor:'#f9f9f9',
        height:32,
        alignItems: 'center',
    },
    selectedDayCircle:{
        backgroundColor:'#f3ecfe',
        borderRadius:4
    },
    selectedDayText: {
        color: '#8b49f6',
        fontWeight: 'bold'
    },
    currentDayCircle:{
        backgroundColor:'transparent',
        borderBottomColor:'#8b49f6',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderRadius:0
    },
    currentDayText:{
        color: '#8b49f6',
        borderBottomColor:'#8b49f6',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderRadius:0
    },
    controlButtonText:{
        color:'#8b49f6',
        fontSize: 16,
        fontWeight: 'bold'
    },
    eventIndicator: {
        backgroundColor: 'transparent',
        width: 0,
        height: 0
    },
    hasEventText: {
        color: '#121212',
        opacity: 1
    }
}

const showStyle = {
    calendarContainer: {
      backgroundColor: '#FFF',
      height: 340
    },
    controlButton: {
        marginLeft: 10,
        marginRight: 10
    },
    dayButton:{
        borderTopColor:'transparent'
    },
    day: {
        color: '#121212',
        opacity: 1
    },
    dayHeading:{
        color:'#000',
    },
    weekendHeading:{
        color:'#000',
    },
    weekendDayButton: {
        backgroundColor: '#FFF'
    },
    weekendDayText: {
        color: '#121212',
        opacity: 1
    },
    calendarHeading:{
        borderTopWidth:0,
        borderBottomWidth:0,
        backgroundColor:'#f9f9f9',
        height:32,
        alignItems: 'center',
    },
    selectedDayCircle:{
        backgroundColor:'#f3ecfe',
        borderRadius:4
    },
    selectedDayText: {
        color: '#8b49f6',
        fontWeight: 'bold'
    },
    currentDayCircle:{
        backgroundColor:'transparent',
        borderBottomColor:'#8b49f6',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderRadius:0
    },
    currentDayText:{
        color: '#8b49f6',
        borderBottomColor:'#8b49f6',
        borderBottomWidth:1,
        borderStyle:'solid',
        borderRadius:0
    },
    controlButtonText:{
        color:'#8b49f6',
        fontSize: 16,
        fontWeight: 'bold'
    },
    eventIndicator: {
        backgroundColor: 'transparent',
        width: 0,
        height: 0
    },
    hasEventText: {
        color: '#121212',
        opacity: 1
    }
}
