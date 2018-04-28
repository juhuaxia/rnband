import React from 'react';
import SportCricle from 'PaiBandRN/src/components/sleep/sleepcircle';
//import SleepChart from 'PaiBandRN/src/components/sleep/sleepchart';
import SleepChart from 'PaiBandRN/src/components/charts/sleep1';
import Calendar from 'PaiBandRN/src/components/calendar/index';
import DescriptionBox from 'PaiBandRN/src/components/descriptionBox';
import { StyleSheet, Text,Animated,Easing, View ,Image,Dimensions,Modal,TouchableOpacity,ListView,ScrollView} from 'react-native';
import StylesCommon from 'PaiBandRN/src/style/common';
import PageNotice from 'PaiBandRN/src/notice/page';
import IComponent from 'PaiBandRN/src/components/icomponent';
import sleepService from 'PaiBandRN/src/services/sleep';

const winWidth = Dimensions.get('window').width;

export default class Sleep extends IComponent {
    constructor(props){
        super(props);

        const d = new Date();
        this.state={
            daySleepDate:"",
            weekSleepDate:"",
            monthSleepDate:"",
            yearSleepDate:"",
            calendarPop:false,
            modalVisible: false,//控制遮罩层是否显示
            transparent: true,
            animationType: "fade",
            selectedDate: [d.getFullYear(), ('0' + (d.getMonth()+1)).substr(-2), ('0' + d.getDate()).substr(-2)].join('-'),//日历
            eventDates: [],
            circleData: {
                deep: 0,
                recommend: 0,
                sleep: 0,
                wakecount: 0,
                quality: '',
                start: '21:00',
                end: '21:00'
            },
            chartData: []
        }
    }

    componentDidMount(){
        let selecttime = this.state.selectedDate.toString().split('-');
        this._getToday();
        this._getMonthDataDate(selecttime[0], selecttime[1]);
        //sleepService.getWeek().then(data => {
            //console.log('sleepService getWeek data', data);
            //this.setState({
                //weekSleepDate:data,
            //});
        //}).catch(e => {
            //console.log('sleepService getWeek error', e);
        //});
        //sleepService.getMonth().then(data => {
            //console.log('sleepService getMonth data', data);
            //this.setState({
                //monthSleepDate:data,
            //});
        //}).catch(e => {
            //console.log('sleepService getMonth error', e);
        //});
        //sleepService.getYear().then(data => {
            //console.log('sleepService getYear data', data);
            //this.setState({
                //yearSleepDate:data,
            //});
        //}).catch(e => {
            //console.log('sleepService getYear error', e);
        //});
    }

    sleepChart(){
        this.sendNotification(PageNotice.PAGE_SLEEPCHARTPAGE);
        this._setModalVisible(false);
    }

    _clear() {
        this.setState({
            circleData: {
                deep: 0,
                recommend: 0,
                sleep: 0,
                wakecount: 0,
                quality: '',
                start: '21:00',
                end: '21:00'
            },
            chartData: []
        });
    }

    _getToday() {
        this._clear();
        let selecttime = this.state.selectedDate.toString().split('-');
        let datainfo = selecttime[0]+"-"+("0"+selecttime[1]).substr(-2)+"-"+("0"+selecttime[2]).substr(-2);
        console.log("datainfo",datainfo);
        sleepService.getToday(datainfo).then(data => {
            console.log('sleepService getToday data', data);

            if(data) {
                const datas = [];
                for(let i = 0; i < data.data.length; i++) {
                    const item = data.data[i];
                    datas.push({
                        range: [item['start'], item['end']],
                        data: [1, 0, 2][item['status']]
                    });
                }
                data.today || (data.today = {});
                this.setState({
                    circleData: {
                        eventDates: this.state.eventDates.concat([datainfo]),
                        recommend: data.today.target_sleep_time || this.state.circleData.recommend,
                        sleep: data.today.sleep_minutes || this.state.circleData.sleep,
                        deep: data.today.deep_sleep_time || this.state.circleData.deep,
                        wakecount: data.today.awake_count || this.state.circleData.wakecount,
                        quality: data.today.sleep_quality || this.state.circleData.quality,
                        start: data.today.sleep_start_time || this.state.circleData.start,
                        end: data.today.sleep_end_time || this.state.circleData.end
                    },
                    chartData: datas
                });
            }
        }).catch(e => {
            console.log('sleepService getToday error', e);
        });
    }

    _getMonthDataDate(year, month) {
        sleepService.getMonth(year, month).then(data => {
            console.log('sleep getMonth', data);
            if(data) {
                const dates = [];
                for(let i = 0; i < data.data.length; i++) {
                    if(data.data[i]['sleep_minutes'] > 0) {
                        dates.push(data.data[i]['date']);
                    }
                }
                this.setState({
                    eventDates: dates.concat(this.state.eventDates)
                });
            }
        });
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
            calendarPop:visible,
        });
    }

    calendarInfo(){
        this.setState({
            modalVisible: true,
            calendarPop:true,
        });
    }

    onDateSelect(date){
        date = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
        this.setState({
            selectedDate: date ,
            calendarPop:false,
            modalVisible: false,
        },()=>{
            this._getToday();
        })
    }

    _dateChangeHandler(date) {
        this._getMonthDataDate(date.getFullYear(), date.getMonth() + 1);
    }

    onAnalysisHref(){
        this.sendNotification(PageNotice.PAGE_SELECT_SUBPAGE, {
            title: this.i18n('sleep_title_statistics'),
            name: 'sleepChart',
            data:{
                month:this.state.selectedDate.split('-')[1],
                date:this.state.selectedDate
            }
        });
        this._setModalVisible(false);
    }

    render() {
        let calendarContent = null;
        if(this.state.calendarPop == true){
            calendarContent = <Calendar onAnalysis = {this.onAnalysisHref.bind(this)} eventDates={this.state.eventDates} onDateChange={date=>this._dateChangeHandler(date)} selectedDate={this.state.selectedDate} onDateSelect={this.onDateSelect.bind(this)}></Calendar>
        }
        let showSelectDate = this.state.selectedDate.split('-');
        showSelectDate.push(showSelectDate.shift());
        if(this.i18nLang == 'en') {
            const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            showSelectDate[0] = customMonthNames[Number(showSelectDate[0]) - 1];
            showSelectDate = `${showSelectDate[0]} ${Number(showSelectDate[1])}, ${showSelectDate[2]}`;
        } else {
            showSelectDate = showSelectDate.join('-');
        }
        return (
            <ScrollView style={styles.container}>
                {/*头部*/}
                <View style={StylesCommon.common_gap}/>
                <View style={[StylesCommon.common_card, styles.sleepTopWrap]}>
                    <TouchableOpacity onPress = {this.calendarInfo.bind(this)} style={styles.sleepTopDateWrap}>
                        <Image  source={require('PaiBandRN/res/images/calendar_purple_icon_n.png')}/>
                        <Text style={styles.sleepTopDateText}>{showSelectDate}</Text>
                    </TouchableOpacity>
                    <View style={styles.cricleWrap}>
                        <SportCricle radius={90} start={this.state.circleData.start} end={this.state.circleData.end} percent={this.state.daySleepDate && this.state.daySleepDate.today.target_complete}/>
                        <View style={styles.cricleTextWrap}>
                            <View style={styles.setWrap}>
                                <Text style={[styles.setText, {fontSize: 10}]}>
                                    {
                                        parseInt(this.state.circleData.recommend/60) + ' '
                                    }
                                    {this.i18n('sleep_data_hours') + ' '}
                                    {this.i18n('sleep_data_recommend')}
                                </Text>
                            </View>
                            <View style={[styles.targetStep, {height:60,flexDirection:'row',justifyContent:'center'}]}>
                                <Text style={styles.targetStepText}>
                                    {parseInt(this.state.circleData.sleep/60)}
                                    <Text style={styles.targetStepTextInfo}>{this.i18n('sleep_unit_hours')}</Text>
                                </Text>
                                {
                                    (this.state.circleData.sleep%60>0)?(<Text style={styles.targetStepText}>{this.state.circleData.sleep%60}<Text style={styles.targetStepTextInfo}>{this.i18n('sleep_unit_minute')}</Text></Text>) : null
                                }
                            </View>
                            <View style={styles.targetStep}>
                                <Text style={[styles.setText, {fontSize: 10}]}>{(this.state.circleData.sleep-this.state.circleData.deep) + ' ' + this.i18n('sleep_unit_minutes') + ' ' + this.i18n('sleep_chart_smallturn') + '/' + this.i18n('sleep_chart_smalllight')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={StylesCommon.common_gap}/>
                <View style={[StylesCommon.common_card, styles.chart]}>
                    {/*里程消耗*/}
                    <View style={styles.detailsStepWrap}>
                        <View style={{flex: 1, marginLeft: 20, flexDirection: "row"}}>
                            <Text style={styles.detailsStepText}>{this.i18n('sleep_chart_remrate')}</Text>
                            <Text style={[styles.detailsStepText, {marginLeft: 5}]}>{parseInt(100* this.state.circleData.deep/this.state.circleData.sleep) || 0}</Text>
                            <Text style={styles.detailsStepText}>%</Text>
                        </View>
                        <View style={{flex: 1, marginRight: 20, flexDirection: "row", justifyContent: "flex-end"}}>
                            <Text style={styles.detailsStepText}>{this.i18n('sleep_chart_turn')}</Text>
                            <Text style={[styles.detailsStepText, {marginLeft: 5}]}>{this.state.circleData.wakecount || 0}</Text>
                            <Text style={styles.detailsStepText}>{this.i18n('sleep_unit_times')}</Text>
                        </View>
                    </View>
                    {/*<SleepChart
                        sleepDayPoint={this.state.daySleepDate && this.state.daySleepDate.data}
                        sleepWeekPoint={this.state.weekSleepDate && this.state.weekSleepDate.data}
                        sleepMonthPoint={this.state.monthSleepDate && this.state.monthSleepDate.data}
                        sleepYearPoint={this.state.yearSleepDate && this.state.yearSleepDate.data}
                        sleepTypes = {"Day"}
                        >
                    </SleepChart>*/}
                    <SleepChart
                        width={winWidth-24}
                        data={this.state.chartData}
                        legend={[
                            {color: '#F3E9FF', title: this.i18n('sleep_chart_light')},
                            {color: '#6735A5', title: this.i18n('sleep_chart_deep')},
                            {color: '#FCB000', title: this.i18n('sleep_chart_turn')}
                        ]}
                        indicator={{title: this.i18n('sleep_chart_indicator'), data: 0}}
                        >
                    </SleepChart>
                </View>
                <View style={StylesCommon.common_gap}/>
                {/*设置弹窗*/}
                <Modal
                    animationType = {this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this._setModalVisible.bind(this, false)}}>
                    <View style={styles.mark}>
                        <TouchableOpacity style={styles.mark} onPress={this._setModalVisible.bind(this, false)}></TouchableOpacity>
                    </View>
                    {calendarContent}
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#ebebeb",
    },
    sleepTopWrap:{
        flex: 1,
        marginTop:64,
        alignItems:"center",
        justifyContent:"center",
        paddingBottom: 20
    },
    sleepTopBg:{
        flex:1,
        height:300,
    },
    sleepTopDateWrap:{
        height:50,
        marginRight:30,
        marginLeft:30,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
    },
    sleepTopDateText:{
        fontSize:16,
        color:"#000",
        marginLeft:10,
    },
    cricleWrap:{
        flex: 1,
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
    },
    cricleTextWrap:{
        position:"absolute",
        left:0,
        top:0,
        zIndex:4,
        width:180,
    },
    setWrap:{
        flexDirection:"row",
        marginTop:40,
        alignItems:"center",
        justifyContent:"center",
    },
    setText:{
        color:"rgba(0,0,0,0.38)",
        fontSize:12,
    },
    targetStep:{
        alignItems:"center",
    },
    targetStepText:{
        fontSize:36,
        color:"rgba(0,0,0,0.88)",
    },
    targetStepTextInfo:{
        fontSize:12,
    },
    detailsStepWrap:{
        flexDirection:"row",
        marginBottom:18,
        marginTop:18,
    },
    detailsStep:{
        flex:1,
        alignItems:"center",
        paddingTop:15,
        paddingBottom:15,
    },
    detailsStepText:{
        fontSize: 12,
        color:"#121212",
        opacity: 0.8
    },
    detailsStepTextUp:{
        fontSize:32,
        color:"#8d63cf"
    },
    detailsStepTextDown:{
        fontSize:12,
        color:"#959595"
    },
    cricleKeDu:{
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        zIndex:4,
        flex:1,
        flexDirection:"row",
    },
    cricleImage:{
    },
    mark:{
        backgroundColor:"#000",
        opacity:0.5,
        flex:1,
        marginTop:64,
    },
});


const customStyle = {
    calendarContainer: {
      backgroundColor: '#fff',
    },
    dayButton:{
        borderTopColor:'transparent'
    },
    dayHeading:{
        color:'#959595',
    },
    weekendHeading:{
        color:'#959595',
    },
    calendarHeading:{
        borderTopWidth:0,
        borderBottomWidth:0,
        backgroundColor:'#f5f5f5',
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
        color:'#8b49f6'
    }
}

