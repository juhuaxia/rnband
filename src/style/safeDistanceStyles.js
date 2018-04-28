import { StyleSheet } from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    safeDistanceContainer: {
        flex: 1,
        paddingTop: 65,
        backgroundColor: '#ebebeb',
    },
    headerContainer: {
        backgroundColor: '#48cfae',
    },
    backImg: {
        width: windowWidth,
        height: 244,
    },
    circleDistance: {
        height: 180,
        width: 180,
        position: 'absolute',
        top: 32,
        left: (windowWidth - 180) / 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanImg: {
        height: 180,
        width: 180,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeTextConainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outDistanceText: {
        transform: [{
            rotate: '-180deg'
        }],
    },
    safeStatusText: {
        position: 'absolute',
    },
    safeStatusTips: {
        fontSize: 32,
        color: '#fff',
        marginTop: 18,
        fontFamily: 'PingFangSC-Light',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    outOfDistanceTips: {
        fontSize: 12,
        color: '#fff',
        lineHeight: 18,
        fontFamily: 'PingFangSC-Light',
        backgroundColor: 'rgba(0,0,0,0)',
        textAlign: 'center',
        width: 160,
    },
    closeListen: {
        marginTop: 0,

    },
    setRemind: {
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    currenState: {
        borderBottomWidth: 1,
        borderColor: '#ebebeb',
    },
    setStatus: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        marginLeft: 15,
        paddingRight: 15,
    },
    setStatusText: {
        fontSize: 16,
        color: '#313131',
    },
    useTips: {
        backgroundColor: '#fff',
    },
    useTipsTitleView: {
        borderBottomWidth: 1,
        borderColor: '#ebebeb',
        paddingTop: 20,
        paddingBottom: 10,
        marginLeft: 15,
    },
    useTipsTitleText: {
        fontSize: 14,
        color: '#646464',
        fontFamily: 'PingFangSC-Regular',
    },
    useTipsText: {
        fontSize: 16,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
    },
    useTipsView: {
        margin: 15,
    },
    useTipsText: {
        fontSize: 16,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
    },
    setNotice:{
        flex:1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    }
});