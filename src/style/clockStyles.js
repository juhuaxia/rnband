import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;


export default StyleSheet.create({
    setClockContainer: {
        flex: 1,
        backgroundColor: '#ebebeb',
        paddingTop: 65,
    },
    /**
     * 闹钟为空样式
     */
    emptyTip: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{
            translateY: 100
        }],
    },
    emptyTipImg: {
        width: 120,
        height: 120,
    },
    emptyTipText: {
        fontSize: 16,
        color: '#959595',
        marginTop: 40,
        fontFamily: 'PingFangSC-Regular',
    },


    /**
     * 闹钟主页样式
     */
    clockListView: {
        marginBottom: 45,
    },
    ListViewSection: {
        backgroundColor: '#fff',
        marginBottom: 5,
        flex: 1,
        paddingTop: 15,
        
    },
    ViewSectionHeader: {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ebebeb',
    },
    SectionHeaderImg: {
        height: 20,
        width: 20,
        marginRight: 10,
    },
    SectionHeaderTitle: {
        fontSize: 14,
        color: '#646464',
        fontFamily: 'PingFangSC-Regular',
    },
    clockDetailContainer: {
        paddingLeft: 15,
    },
    clockDetailItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ebebeb',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 5,
    },
    DetailItemLeft: {
        paddingTop: 12,
        paddingBottom: 15,
    },
    clockTime: {
        fontSize: 32,
        color: '#313131',
        fontFamily: 'Akzidenz-Grotesk BQ',
    },
    repeatType: {
        color: '#959595',
        fontSize: 12,
        fontFamily: 'PingFangSC-Regular',
    },
    DetailItemRight: {
        height: 32,
        justifyContent: 'center',
   
    },
    /**
     * 修改删除弹出层
     */
    selectAction: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flex: 1,
        transform: [{
            translateY: 0
        }],
        justifyContent: 'flex-end',
        paddingLeft: 15,
        paddingRight: 15,
    },
    selectCommonType: {
        backgroundColor: '#fff',
        height: 50,
        borderWidth: 1,
        borderColor: '#fff',
    },
    selectViewCommon: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectTextCommon: {
        fontSize: 16,
        color: '#007aff',
    },
    selectEdit: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginBottom: 1 / PixelRatio.get(),
    },
    selectDelete: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    selectCancel: {
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
    },
    textDelete: {
        color: 'red',
    },
    /**
     * 编辑页面
     */
    editPageContainer: {
        position: 'absolute',
        top: 14,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 11,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingTop: 50,
    },
    editPageTextContainer: {
        backgroundColor: '#ebebeb',
        flex: 1,
    },
    editPageTitle: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, .9)',
        paddingLeft: 15,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: windowWidth,
        borderTopWidth: 1,
        borderColor: '#e1e1e1',
    },
    cancelEdit: {
        fontSize: 16,
        color: '#8b49f6',
        fontFamily: 'PingFangSC-Regular',
    },
    saveEdit: {
        justifyContent: 'center',
        height: 44,
        width: 110,
        backgroundColor: '#8b49f6',
    },
    saveEditText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'PingFangSC-Regular',
    },
    clockTitleStyle: {
        paddingLeft: 15,
        marginBottom: 10,
        marginTop: 30,
        fontSize: 14,
        color: '#646464',
        fontFamily: 'PingFangSC-Regular',
    },
    editTextContainer: {
        backgroundColor: '#fff',
    },
    editTextTimeContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,

    },
    editTextItem: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#e1e1e1',
        paddingRight: 15,
    },
    editTextStyle: {
        fontSize: 16,
        color: '#313131',
        fontFamily: 'PingFangSC-Regular',
    },
    editTextRepeatContainer: {
        paddingLeft: 15,
    },
    editRepeatType: {

    },
    repeatImg: {
        height: 20,
        width: 20,
    },
    /**
     * picker样式
     */
    pickerCover: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        position: 'absolute',
        zIndex: 12,
        left: 0,
        right: 0,
        height: 260,
        backgroundColor: '#fff',
        bottom: 0,
    },
    pickerTitle: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ebebeb',
    },
    pickerTitleText: {
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
        color: '#8b49f6',
    },
    pickerSection: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    pickerList: {
        flex: 1,
    },
    pickerItem: {

    },
    /**
     * 闹钟底部样式
     */
    addFooter: {
        position: 'absolute',
        bottom: 0,
        height: 44,
        right: 0,
        left: 0,
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        flexDirection: 'row',
        paddingLeft: 15,
        alignItems: 'center',
    },
    FooterLeft: {
        color: '#959595',
        flex: 2.3,
        fontSize: 14,
        fontFamily: 'PingFangSC-Regular',
    },
    FooterRight: {
        flex: 1,
        height: 45,
        width: 110,
        backgroundColor: '#8c3ffa',
        justifyContent: 'center',
    },
    FooterRightTextContainer: {
        backgroundColor: '#8c3ffa',
        height: 45,
        justifyContent: 'center',
    },
    FooterRightMax: {
        backgroundColor: '#c2c2c2',
        height: 45,
        justifyContent: 'center',
    },
    FooterRightText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
    },

    /**
     * 到达数量上限提示
     */
    maxWarnContainer: {
        position: 'absolute',
        bottom: -80,
        left: 0,
        right: 0,
        flex: 1,
        alignItems: 'center',
    },
    maxWarnContent: {
        height: 54,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
    },
    warnTextHeader: {
        marginBottom: 4,
    },
    warnText: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 16,
        fontFamily: 'PingFangSC-Regular',
    },
});