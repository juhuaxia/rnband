import { StyleSheet, PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'
const {width, height, scale} = Dimensions.get('window');
const rate = width/320;
export default StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 77,
		backgroundColor: '#f5f5f5',
	},
	
})	