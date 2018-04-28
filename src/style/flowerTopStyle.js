import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
const {width, height} = Dimensions.get('window');
const scale = width/414;


export default StyleSheet.create({
	/*
	头部样式
	 */
	descContainer: {
		height: 266.5,
		alignItems: 'center',
		marginBottom: 12,
	},
	descHeader: {
		alignItems: 'center',
		marginTop: 25,
	},
	descHeaderImg: {
		height: 36,
		width: 36,
	},
	descNum: {
		justifyContent: 'center',
		alignItems: 'flex-end',
		flexDirection: 'row',
		marginTop: 10,
	},	
	descTextNum: {
		fontSize: 48,
		color: '#121212',
	},
	descTextType: {
		fontSize: 16,
		marginBottom: 8,
		color: '#121212',
	},
	descWhatContainer: {
		backgroundColor: '#F6F6F6',
		minWidth: 76,
		height: 32,
		marginTop: 10,
		borderRadius: 16,
		paddingLeft: 16,
		paddingRight: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	aboutFlowerImg: {
		height: 12,
		width: 12,
		borderRadius: 6,
		marginRight: 4,
	},
	aboutFlowerText: {
		fontSize: 12,
		color: '#121212',
	},
	descFooter: {
		flexDirection: 'row',
		marginTop: 32,
	},
	descFooterOpacity: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	descFooterLeft: {
		marginRight: 14,
	},
	descFooterText: {
		minWidth: 124,
		borderWidth: 1,
		borderColor: '#F2253E',
		borderRadius: 6,
		textAlign: 'center',
		fontSize: 12,
		color: '#F2253E',
		paddingTop: 13,
		paddingBottom: 13,
	},
	enStyle: {
		width: 160*scale,
		
	},
	/*
	弹框样式
	 */
	awardBackView: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		flex: 1,
		alignItems: 'center',
	},
	awardContainer: {
		width: 280,
		height: 392,
		marginTop: 88,
	},
	closeModel: {
		position: 'absolute',
		top: 12,
		right: 12,
	},
	awardImgView: {
		marginTop: 36,
		alignItems: 'center',
	},
	awardImg: {
		height: 100,
		width: 100,
	},
	awardInputContainer: {
		backgroundColor: '#F9F9F9',
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 22,
		marginBottom: 12,
		marginRight: 24,
		marginLeft: 24,
		borderRadius: 8,
		paddingLeft: 12,
		paddingRight: 12,
	},
	awardNumInput: {
		fontSize: 15,
		height: 21,
		lineHeight: 21,
		width: 130,
		height: 50,
	},
	awardText: {
		fontSize: 15,
	},
	awardTextArea: {
		height: 80,
		marginRight: 24,
		marginLeft: 24,
		borderRadius: 8,
		backgroundColor: '#F9F9F9',

	},
	awardTextAreaInput: {
		height: 80,
		fontSize: 15,
		padding: 12,
	},
	saveEdit: {
		margin: 24,
		backgroundColor: '#F2253E',
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	saveEditText: {
		fontSize: 16,
		color: '#fff',
		fontFamily: 'PingFangSC-Medium',
	},
})	