import {StyleSheet} from 'react-native'

export default StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 64,
		backgroundColor: '#f5f5f5',
	},
	scrollViewStyle: {
		paddingTop: 12,
	},
	//数据为空提示样式
	emptyTip: {
		alignItems: 'center',
		marginTop: 50,
	},
	emptyTipImg: {
		width: 54,
		height: 42,
	},
	emptyTipText: {
		fontSize: 16,
		fontFamily: 'PingFangSC-Semibold',
		color: '#121212',
		opacity: 0.4,
		marginTop: 15,
	},
	
})	