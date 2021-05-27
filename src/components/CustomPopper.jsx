import React from 'react';
import Paper from "@material-ui/core/Paper"
import {makeStyles} from "@material-ui/core/styles";
import CustomAvatar from './CustomAvatar'
import Popper from '@material-ui/core/Popper'
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/CloseRounded'

const useStyle = makeStyles(theme => ({
	root: {
		display: 'flex',
		position: 'absolute',
		bottom: '30px',
		width: '300px',
		flexDirection: 'column',
		height: '450px'
	},
	flexGrow: {
		flexGrow: 1
	},
	headerDiv: {
		display: 'flex',
		alignItems: 'center'
	}
}))

function CustomPopper(props) {
	const classes = useStyle()
	return (
		<Popper open={props.open} anchorEl={props.anchorEl}>
			<Paper className={classes.root}>
				<div className={classes.headerDiv}>
					<CustomAvatar src='/man.svg'/>
					<div className={classes.flexGrow}/>
					<IconButton size='small' onClick={props.handleClose}>
						<CloseIcon/>
					</IconButton>
				</div>
				<div className={classes.flexGrow}>

				</div>
				<div>

				</div>
			</Paper>
		</Popper>
	);
}

export default CustomPopper;