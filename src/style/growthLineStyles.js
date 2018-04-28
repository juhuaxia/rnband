import {StyleSheet, PixelRatio} from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    growthContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 64,
        paddingRight: 12,
        paddingLeft: 12,
    },
    /**
     * ListView样式
     */
    recordListView: {
        flex: 1,
    },
    listContainer: {
     
    },
    recentlyList: {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#fff',
    },
    firstList: {
        marginTop: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    lastList: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    timeText: {
        color: '#000',
        opacity: 0.68,
        fontSize: 12,
        backgroundColor: 'rgba(255,255,255,0)',
    },
    heightWeight: {
        marginRight: 20,
        marginLeft: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heightWeightStyle: {
        color: '#000',
        fontSize: 12,
        minWidth: 60,
        textAlign: 'right',
        marginLeft: 30,
    },
    hasNoMore: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
    },
    showAllListText: {
        color: '#959595',
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
        marginRight: 10,
        paddingBottom: 20,
    },
    loading: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20,
    },
    loadingImg: {
        height: 20,
        width: 20,
        marginRight: 10,
    },
    loadingText: {
        color: '#959595',
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
    }
});