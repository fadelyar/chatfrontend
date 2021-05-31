import React from "react";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import CustomAvatar from "./CustomAvatar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/CloseRounded";
import SendIcon from "@material-ui/icons/SendRounded";
import {purple} from "@material-ui/core/colors";
import {InputBase} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyle = makeStyles((theme) => ({
	root: {
		display: "flex",
		width: "300px",
		flexDirection: "column",
		height: "450px",
		minWidth: '250px',
		marginLeft: theme.spacing(0.5)
	},
	messageArea: {
		flexGrow: 1,
	},
	headerDiv: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0.5),
		borderBottom: '1px solid lightgrey'
	},
	footerDiv: {
		display: "flex",
		alignItems: "center",
		borderTop: '1px solid lightgrey'
	},
	inputBase: {
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
		flexGrow: 1,
		paddingLeft: theme.spacing(2),
		fontFamily: "Fira Code",
		height: "100%",
		color: "black",
		width: "100%",
	},
	flexGrow: {
		flexGrow: 1
	}
}));

function CustomPopper(props) {
	const classes = useStyle();
	return (
		<Paper className={classes.root}>
			<div className={classes.headerDiv}>
				<CustomAvatar src="../../man.png"/>
				<Typography variant='h6'>
					{props.name}
				</Typography>
				<div className={classes.flexGrow}/>
				<IconButton onClick={
					() => {
						props.handleClose(props.name)
					}
				}>
					<CloseIcon/>
				</IconButton>
			</div>
			<div className={classes.messageArea}/>
			<div className={classes.footerDiv}>
				<IconButton style={{borderRadius: 0, color: purple["900"]}}
								onClick={props.sendPrivateMessage}>
					<SendIcon/>
				</IconButton>
				<InputBase className={classes.inputBase} onChange={props.handlePrivateMessage}/>
			</div>
		</Paper>
	);
}

export default CustomPopper;
