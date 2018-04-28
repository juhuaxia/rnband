import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image} from 'react-native';
import IComponent from 'PaiBandRN/src/components/icomponent';
import PageNotice from 'PaiBandRN/src/notice/page';
const { width } = Dimensions.get('window');


export default class RewardList extends IComponent{
    nameList = this.props.data.nameList||[];
    cateStyle = [{
        icon: require('PaiBandRN/res/images/wakeup.png'),
        color: '#FCB000',
    },{
        icon: require('PaiBandRN/res/images/homework.png'),
        color: '#008AED',
    },{
        icon: require('PaiBandRN/res/images/sport.png'),
        color: '#37C222',
    },{
        icon: require('PaiBandRN/res/images/sleep.png'),
        color: '#6735A5',
    },{
        icon: require('PaiBandRN/res/images/others.png'),
        color: '#F2253E',
    }]
    selectTaskType = (index) => {
        this.sendNotification(PageNotice.SELECT_TASK, index);
    }
    componentDidMount(){
        console.log(this.nameList)
    }

    componentWillUnmount() {
        
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.listContainer}>
                        {
                            this.nameList.length ? this.nameList.map((item, index) => {
                                const {icon=null, color='#F2253E'} = this.cateStyle[item.category - 1]||{};
                                return <TouchableOpacity style={[styles.taskItem, {borderColor: color}]} key={index}  onPress={this.selectTaskType.bind(this, index)}>
                                    {
                                      icon?<Image source={icon} style={styles.iconStyle}></Image>:null
                                    }
                                    <Text style={[styles.taskItemText, {color: color}]}>{item.name}</Text>
                                </TouchableOpacity>
                            }) : null
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 77,
    },
    listContainer: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskItem: {
        marginLeft: 12,
        marginRight: 12,
        paddingRight: 12,
        paddingLeft: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F2253E',
        borderRadius: 20,
        width: 272,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    taskItemText: {
        fontSize: 12,
        color: '#F2253E',
        fontFamily: 'PingFangSC-Medium',
        backgroundColor: 'rgba(255,255,255,0)',
        textAlign: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        flex: 1,
    },
    
})  