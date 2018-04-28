import {StyleSheet, PixelRatio} from 'react-native'
import Dimensions from 'Dimensions'
let windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    heartSetContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 65,
    },
    /*
    顶部导航条样式
     */
    clockListContainer: {
      
    },
    listItemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        paddingLeft: 16,
        paddingRight: 12,
        marginTop: 12,
    },
    listItemRight: {
       height: 56,
       justifyContent: 'center',
       flex: 1,
       marginRight: 30,
    },
    listItemText: {
        fontSize: 20,
        color: '#121212',
        // fontFamily: 'AkzidenzGroteskBQ-LigCnd',
    },
    SwitchContainer: {
        
    },
    listItemSwitch: {
        height: 31,
        width: 50,
    },
    /*
    底部定测试介绍
     */
    descriptionView: {
        marginTop: 12,
        marginLeft: 20,
        marginRight: 20,
    },
    detailStyle: {

    },
    detailText: {
        fontSize: 12,
        color: '#121212',
        opacity: 0.6,
        lineHeight: 20,
    },
});