import React from 'react';
import {Text, View, Image, ListView, TouchableOpacity, Animated, Easing, } from 'react-native';
import styles from 'PaiBandRN/src/style/growthLineStyles';
import IComponent from 'PaiBandRN/src/components/icomponent';
import GrowthChart from 'PaiBandRN/src/components/growth/growthChart';
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

export default class GrowthLine extends IComponent {
    // const data = [{
    //     growthHeight: "70.0 cm",
    //     growthTime: "2017/04/25",
    //     growthWeight:"10.0 kg",
    // },{
    //     growthHeight: "100.0 cm",
    //     growthTime: "2017/04/24",
    //     growthWeight:"13.0 kg",
    // },{
    //     growthHeight: "100.0 cm",
    //     growthTime: "2017/04/19",
    //     growthWeight:"20.0 kg",
    // }]
    recentRecord = this.props.data||[];//按日期从大小到的数据
    reverseRecord = this.props.data&&[...this.props.data].reverse()||[]; //按日期从小到大数据
    prevent = false; //防止重复触发
    dateEnd = false;//是否达到底部

    state = {
        showRecords: [], //当前显示的历史记录
        showLoading: false,//是否显示加载动画
        loadingAnim: new Animated.Value(0), 
    }

    constructor(props) {
        super(props);
    }
    
    _getMoreDate = () => {
        if (this.prevent) {
            return
        }
        this.prevent = true;
        //页面加载完所有数据后，再次达到底部，直接返回
        if (this.dateEnd) {
            return
        }

        const showRecordsLength = this.state.showRecords.length;
        const recentRecordLength = this.recentRecord.length
        let showArr = [];
        let endstatus = false;
        //当前显示数据长度加上步长 10 ，大于所有数据长度，则显示数据赋值为所有数据，显示无更多提示
        if(showRecordsLength + 10 >= recentRecordLength){
            showArr = [...this.recentRecord];
            endstatus = true;
        //当前显示数据长度加上步长 10 ，小于所有数据长度，则显示数据赋值为所有数据，显示无更多提示
        }else{
            showArr = this.recentRecord.slice(0, showRecordsLength + 10);
        }
        this.setState({
            showLoading: true,
        })
        this._loadingImg();
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.prevent = false;
            this.dateEnd = endstatus;
            this.setState({
                showRecords: showArr,
                showLoading: false,
            })
        }, 2000)
    }

    _loadingImg = () => {
        this.state.loadingAnim.setValue(0);  
        Animated.timing(         
            this.state.loadingAnim,  
            {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
            },         
        ).start(this._loadingImg);          
    }

    componentWillMount() {
        /*
        取数据的前10位
         */
        if (this.recentRecord.length > 10) {
            this.setState({
                showRecords: this.recentRecord.slice(0, 10),
            })
        }else{
            this.setState({
                showRecords: this.recentRecord,
            })
            this.dateEnd = true;
        }
    }

    componentDidMount(){

    }
    componentWillUnmount(){
        if(this.timer){
            clearTimeout(this.timer);
        }
    }
    render() {
        
        
        return (
            <View style={styles.growthContainer}>
                {
                    this.state.showRecords.length ? <ListView
                    dataSource={ds.cloneWithRows(this.state.showRecords)}
                    onEndReached = {this._getMoreDate}
                    style={styles.recordListView}
                    removeClippedSubviews={false}
                    onEndReachedThreshold={1}
                    renderRow={(rowData, sectionID, rowID) => {
                        return <View style={styles.listContainer}>
                                {

                                    rowID == 0 ? <GrowthChart recordData={this.reverseRecord}/>:null
                                }
                                <View style={[styles.recentlyList, rowID == this.state.showRecords.length - 1? styles.lastList : null, rowID == 0 ? styles.firstList: null]}>
                                    <Text style={styles.timeText}>{rowData.growthTime}</Text>
                                    <View style={styles.heightWeight}>
                                        <Text style={styles.heightWeightStyle}>{rowData.growthHeight}</Text>
                                        <Text style={styles.heightWeightStyle}>{rowData.growthWeight}</Text>
                                    </View>
                                </View>
                                {
                                    this.dateEnd && (rowID == this.state.showRecords.length - 1) ?  <View style={styles.hasNoMore}>
                                                <Text style={styles.showAllListText}>{this.i18n('common_tip_nomore')}</Text>
                                            </View> : null
                                }
                                {
                                    this.state.showLoading && (rowID == this.state.showRecords.length - 1) ? 
                                    <View style={styles.loading}>
                                        <Animated.Image  source={require('PaiBandRN/res/images/ani_loading_bubble.png')} style={[styles.loadingImg, { transform: [{rotate: this.state.loadingAnim.interpolate({
                                                   inputRange: [0, 1],
                                                   outputRange: ['0deg', '360deg']  
                                            })}]}]}/>
                                        <Text style={styles.loadingText}>{this.i18n('common_tip_loading')}</Text>
                                    </View> : null
                                }
                        </View>
                    } 
                }
                /> : <GrowthChart recordData={this.reverseRecord}/>
                }
                
            </View>
        )
    }
}
