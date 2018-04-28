import { StyleSheet } from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    /**
     * 专家推荐
     */
    recommendBack: {
        flex: 1,
    },
    recommendContainer: {
    },
    headerStyleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ebebeb',
    },
    headerStyle: {
        fontSize: 14,
        color: '#646464',
        marginTop: 20,
        margin: 10,
    },
    exportDetail: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    exportImgContainer: {
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        borderBottomColor: '#ebebeb',
    },
    exportImg: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 20,
    },
    exportName: {
        fontSize: 16,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
    },
    emptyTip: {
        fontSize: 14,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
        paddingLeft: 15,
        height: 30,
        lineHeight: 30,
    },
    exportType: {
        fontSize: 12,
        color: '#959595',
        fontFamily: 'PingFangSC-Regular',
    },
    exportOutline: {
        marginLeft: 15,
        marginRight: 15,
    },
    foodrecommend: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
    },
    /**
     * 圆角有问题
     */
    foodrecommendBack: {
        flex: 1,
        height: 200,
        borderWidth: 1,
        borderColor: '#ebebeb',
        borderRadius: 4,
        borderBottomWidth: 0,
    },
    tomorrowFoodView: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    tomorrowFood: {
        height: 18,
        lineHeight: 18,
        fontSize: 12,
        color: '#fff',
        fontFamily: 'PingFangSC-Regular',
    },
    foodInfo: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#ebebeb',
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        paddingBottom: 15,
        marginBottom: 15,
    },
    foodInfoTitle: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    DashLine: {
        borderColor: '#ebebeb',
        borderWidth: 1,
        borderStyle: 'dashed',
        transform: [{
            scaleY: .5
        }],
        marginTop: 10,
    },
    foodName: {
        fontSize: 16,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
        marginTop: 10,
        marginBottom: 3,
    },
    foodCommonStyle: {
        fontSize: 12,
        color: '#959595',
        fontFamily: 'PingFangSC-Regular',
    },
    foodCommonTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 2,
    }
});
