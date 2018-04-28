import React from 'react';
import {Text, View, Image, ListView} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import styles from 'PaiBandRN/src/style/clearedStyle';
import StylesCommon from 'PaiBandRN/src/style/common';
import ClearedService from 'PaiBandRN/src/services/cleared';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Cleared extends IComponent{
    type = this.props.data && this.props.data.from == 'rewards'? 1:2;
    page = 1;  //当前页
    pagesize = 10;  //每页显示10条
    totalPage = 1; //总共页面数
    preventRequest = false; //防止重复请求

    state = {
        finishTask: [],
        touchEnd: false,
    }

    /*
    初始化数据
     */
    _initData(){
        if (this.page > this.totalPage) {
            this.setState({touchEnd: true})
            return
        }
        if (this.preventRequest) return;
        this.preventRequest = true;
        ClearedService.getClearedList(this.type, this.page, this.pagesize).then(res => {
            if (this.page == 1) {
                this.totalPage = res.last_page;
            } 
            this.preventRequest = false;
            let finishTask = this.state.finishTask;
            if (res.data instanceof Array) {
                finishTask = [...finishTask, ...res.data];
            }
            this.setState({finishTask});
        }).catch(err => {
            console.log('获取兑换事件列表失败',err);
        })
    }
    /*
    加载更多
     */
    _loadMore = () => {
        this.page ++;
        this._initData();
    }
    componentDidMount(){
       this._initData();
    }

    render() {
        return (
            <View style={styles.container}>
                {
                   this.state.finishTask.length ? <ListView
                        dataSource={ds.cloneWithRows(this.state.finishTask)}
                        onEndReachedThreshold={2}
                        removeClippedSubviews={false}
                        onEndReached={this._loadMore}
                        renderRow={(rowData, sectionID, rowID) => {
                                return <View>
                                        <View style={[styles.taskItemContainer, {minHeight:91}, StylesCommon.common_card]}>
                                    {/*头部*/}
                                        <View style={styles.taskCommonStyle}>
                                            <View style={styles.taskHeaderStyle}>
                                                <Text style={styles.taskName}>{rowData.name}</Text>
                                            </View>
                                            <View style={styles.taskHeaderStyle}>
                                                <Text style={styles.awardFlower}>{rowData.flower}</Text>
                                                <Image style={styles.taskFlowerImg} source={require('PaiBandRN/res/images/flowerreward_icon.png')}></Image>
                                            </View>
                                        </View>
                                    {/*时间状态*/}
                                        <View style={[styles.taskCommonStyle, styles.finishTaskItem]}>
                                            <Text style={styles.finishTaskItemLeft}>{rowData.cleared_date}</Text>
                                            <Text style={[styles.finishTaskItemRight, {color: rowData.status==1?'#000':'#F2253E'}]}>
                                                {rowData.status==1?this.i18n('flower_status_completed'):this.i18n('flower_status_incomplete')}
                                            </Text>
                                        </View>
                                    </View>
                                {
                                    //没有更多了
                                    this.state.touchEnd && rowID == (this.state.finishTask.length -1)? <View style={[styles.showMore, StylesCommon.common_card]}>
                                        <Text style={styles.showMoreText}>{this.i18n('common_tip_nomore')}</Text>
                                    </View> : null
                                }
                            </View>
                            } 
                        }
                    /> : null
                }
                
            </View>
        );
    }
}
