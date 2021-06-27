import React from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import {makeStyles} from '@material-ui/core/styles'
import Image from 'next/image'

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: 2000,
		color: 'black',
		backgroundColor: 'rgba(0,0,0,0.97)'
	},
	img: {
		width: '80%',
		height: '90%',
		borderRadius: 5
	}
}));

export default function CustomBackdrop(props) {
	const classes = useStyles()
	return (
		<Backdrop className={classes.backdrop} open={props.open}
					 onClick={props.handleClose}>
			<img src={props.src} alt="" className={classes.img}/>
		</Backdrop>
	)
}
