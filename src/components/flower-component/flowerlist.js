
import React from 'react';
import IComponent from 'PaiBandRN/src/components/icomponent';
import COMNotice from 'PaiBandRN/src/notice/component';
import {
    StyleSheet, Text, View, ListView, RefreshControl, Image, TouchableOpacity, Picker, Animated, Dimensions,Easing
} from 'react-native';

import flowersService from 'PaiBandRN/src/services/flowers';
let count = 0;
class FlowerList extends IComponent{

    constructor(props){
        super(props);
        this.spinValue = new Animated.Value(0),
        this._list = null;
        this.state = {
            Refresh:false,
            dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            orderStatuts: {}
        }

        this._contentHeight = 0;
        this._scrollViewHeight = 0;
        this._total = 0;
        this._pageSize = 0;
        this._currentPage = 0;
    }

    componentDidMount(){
        this.addSubscriber(COMNotice.FLOWERSCHANGE, this.changeFlowersNum);

        if(this._list) {
            this._list.scrollTo({y: 0});
        }
        count = count+10;//每次加载十条数据
        flowersService.getFlowersList(1,count).then(data => {
            console.log('flowerService getFlowersList data', data);
            this._total = data.totals;
            this._pageSize = Math.ceil(this._total / 10);
            this.setState({
                orderStatuts:data,
                Refresh:false,
            }, () => {
                this._currentPage ++;
                this._scrollToBottom(false);
            });
        }).catch(e => {
            console.log('flowerService getFlowersList error', e);
        });
    }
    componentWillUnmount(){
        this.removeSubscriber(COMNotice.FLOWERSCHANGE, this.changeFlowersNum)
    }

    _scrollToBottom(animated = true) {
        const scrollHeight = this._contentHeight - this._scrollViewHeight;
        if(scrollHeight > 0) {
            const scrollResponder = this._list.getScrollResponder();
            scrollResponder.scrollResponderScrollTo({x: 0, y: scrollHeight, animated});
        }
    }

    changeFlowersNum(cur_num){
       this.componentDidMount();
    }

    //进行小花历史记录数据渲染
    onRefresh(e){
        this.setState({
            Refresh: true,
        })
        if(count < this.state.orderStatuts.totals){
            this.loading();
            this.componentDidMount();
        }else{
            this.setState({
                Refresh:false,
            });
        }
    }

    //loading方法
    loading() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
                {
                  toValue: 1,
                  duration: 4000,
                  easing: Easing.linear
                }
            ).start(() => this.loading())
    }

    //历史小花数据展示
    renderCenterContent(data,aid,rowId){
        // this.rowId = parseInt(rowId);
        //奖励还是兑换显示加减号
        let rewardexchange = null;
        //奖励还是兑换显示球
        let cricle = null;
        if(data.type == 1){
            rewardexchange = <Text  style={styles.colorAdd}><Text>+</Text><Text>{data.num}</Text></Text>;
            cricle = <View style= {[styles.listCricleAdd,styles.listCricle]}></View>;
        }else if(data.type == 2){
            rewardexchange = <Text  style={styles.colorLess}><Text>-</Text><Text>{data.num}</Text></Text>;
            cricle = <View style= {[styles.listCricleLess,styles.listCricle]}></View>;
        }

        //到达底部时候显示加载中
        let aa = null;
        if(this.state.Refresh == true && (this.state.orderStatuts.data.length-1) == rowId){
            aa = <View style={styles.listWrap}>
                    <View style={{flex:1}}>
                       <View style={styles.listLeft}></View>
                       <View style={styles.loadingWarp}>
                       {/*<View style={styles.listLine}></View>*/}
                            <Animated.Image
                                style={[styles.loadingIcon,{transform: [{rotate:this.spinValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"]})}]}]}
                                source = {require('PaiBandRN/res/images/ani_loading_bubble.png')}>
                            </Animated.Image>
                        <View style={styles.listLineC}></View>
                       </View>
                    </View>
                    <View style={styles.loadingText}>
                        <Text style={[styles.listRightTextTitle,{color:"#959595"}]}>加载中</Text>
                    </View>
                </View>
        }else if((this.state.orderStatuts.data.length-1) == rowId){
            aa = <View style={[styles.listWrap,{height:40}]}>
                <View style={{flex:0,width:50}}>
                    <View style={styles.listLeft}></View>
                    <View style={styles.listCenter}>
                        <View style= {[styles.listCricleLess,styles.listCricle,{backgroundColor:"#f5f5f5"}]}></View>
                   </View>
                </View>
                <View style={styles.loadingText}>
                    <Text style={[styles.listRightTextTitle,{color:"#959595"}]}>没有更多啦</Text>
                </View>
            </View>
        }

        return (
            <View style={{flex:1,overflow:'hidden'}}>
                <View style={styles.listWrap}>
                    <View style={{flex:0,flexDirection: 'row',width:50}}>
                       <View style={styles.listLeft}>
                           {rewardexchange}
                       </View>
                       <View  style={styles.listCenter}>
                            {cricle}
                       </View>
                    </View>
                    <View style={styles.listRight}>
                        <Text style={styles.listRightTextTitle}>{data.remark}</Text>
                        <Text style={styles.listRightTextTime}>{data.create_time}</Text>
                    </View>
                </View>
                {/*{aa}*/}
            </View>
        );
    }

    //小花列表年份显示
    renderHeader(){
        const isData = this.state.orderStatuts.data && this.state.orderStatuts.data.length;
        return (
           <View style={[styles.listWrap,{height:40,}]}>
                <View style={{flex:0,flexDirection: 'row',width:50}}>
                   <View style={styles.listLeft}>
                   </View>
                   <View style={styles.listCenter}>
                        <View style= {[styles.listCricleLess,styles.listCricle,{backgroundColor:"#f5f5f5"}]}></View>
                   </View>
                </View>
                <View style={styles.listRightTextWrap}>
                    <Text style={[styles.listRightTextTitle,{color:"#959595"}]}>
                    { isData ? new Date().getFullYear() : '还没有小花呢' }
                    </Text>
                </View>
            </View>
        )
    }

    renderRefreshText(){
        // console.log(this._currentPage,this._total);
        var re;
        // if(this.state.Refresh == true && this.state.orderStatuts.data && (this.state.orderStatuts.data.length-1) == this.rowId){
        if(this.state.Refresh == true && this._currentPage != this._pageSize){
            re = 
                <View style={styles.refresh_box}>
                    <View style={styles.loading_box}>
                        <Animated.Image
                            style={[styles.loadingIcon,{transform: [{rotate:this.spinValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "360deg"]})}]}]}
                            source = {require('PaiBandRN/res/images/ani_loading_bubble.png')}>
                        </Animated.Image>
                        <View style={styles.listLineC}></View>
                    </View>
                    <View style={styles.refresh_text}>
                        <Text style={[styles.listRightTextTitle,{color:"#959595"}]}>加载中</Text>
                    </View>
                </View>
        }else if(this._currentPage >= this._pageSize){
            re = 
                <View style={styles.refresh_box}>
                    <View style={styles.loading_box}>
                    </View>
                    <View style={styles.refresh_text}>
                        <Text style={[styles.listRightTextTitle,{color:"#959595"}]}>没有更多啦</Text>
                    </View>
                </View>
        }

        return re;
    }

    render(){
	    return (
	        <View style={{flex:1, backgroundColor: '#FFF'}}>
                <ListView
                ref={com => {this._list = com;}}
                removeClippedSubviews={false}
                decelerationRate={'normal'}
                initialListSize={1}
                dataSource={this.state.dataSource.cloneWithRows(
                this.state.orderStatuts.data === undefined ? [] : this.state.orderStatuts.data)}
                renderRow={this.renderCenterContent.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                style={{flex:1}}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                onContentSizeChange={(w, h) => this._contentHeight = h}
                onLayout={ev => this._scrollViewHeight = ev.nativeEvent.layout.height}
                onEndReached = {this.onRefresh.bind(this)}/>
                {this.renderRefreshText()}
            </View>
	    )
    }
}

const styles = StyleSheet.create({

    //...
    refresh_box:{
        height:30,
        flexDirection:'row',
    },
    loading_box:{
        width:50,
        paddingLeft:42
    },
    refresh_text:{
        flex:1,
        paddingLeft:30
    },

    listWrap:{
        flexDirection:'row',
        flex:1,
    },
    listLeft:{
        flex:0,
        width: 50,
        paddingTop:10,
        alignItems:"flex-start",
        justifyContent:"center",
        flexDirection:'row',
    },
    colorAdd:{
        color:"#ed5564",
        fontSize:15,
    },
    colorLess:{
        color:"#48cfae",
        fontSize:15,
    },
    listCenter:{
        // flex:0,
        // width: 12,
        // alignItems:"flex-end",
        // justifyContent:"flex-start",
        // paddingTop: 30
    },
    listLine:{
        width:2,
        height:32,
        backgroundColor:"#f5f5f5",
        marginRight:4,
    },
    listLineC:{
        width:2,
        height:32,
        backgroundColor:"#FFF",
        marginRight:4,
    },
    listCricle:{
        height:10,
        width:10,
        borderRadius:50,
        position:'absolute',
        right:-6,
        top:15,
        zIndex:50
    },
    listCricleAdd:{
        backgroundColor:"#ed5564",
    },
    listCricleLess:{
        backgroundColor:"#48cfae",
    },
    listRight:{
        // flex:4.45,
        // marginLeft: -7,
        flex:1,
        borderLeftWidth: 2,
        borderLeftColor: '#f5f5f5',
        paddingLeft:20,
        paddingRight: 10,
        paddingTop:12,
        // marginBottom: 10,
        paddingBottom: 10,
        alignItems:"flex-start",
        zIndex: -1
    },
    listRightTextWrap:{
        paddingTop:10,
        // flex:4.45,
        borderLeftWidth: 2,
        borderLeftColor: '#f5f5f5',
        flex:1,
        paddingLeft:20,
    },
    listRightTextTitle:{
        color:'#313131',
        fontSize:16,
    },
    listRightTextTime:{
        color:'#959595',
        fontSize:14,
        paddingTop:5,
        paddingBottom:5,
    },
    loadingIcon:{
        marginRight:-5,
    },
    loadingWarp:{
        flex:1,
        alignItems:"flex-end",
        justifyContent:"flex-end"
    },
    loadingText:{
        paddingTop:24 ,
        flex:4.45,
        paddingLeft:20
    },
})

export default FlowerList;
