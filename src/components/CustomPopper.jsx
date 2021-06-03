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
		backgroundColor: 'gray'
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
			<div className={classes.messageArea}>
				{
					props.messages.map((message, index) => {
						return (
							<div key={index}
								  style={{
									  display: "flex",
									  justifyContent:
										  props.name === message.user.name
											  ? "flex-end"
											  : "flex-start",
									  height: "40px",
								  }}>
								<div style={{
									display: 'flex',
									flexDirection: 'column'
								}}>
									<Typography variant='caption' style={{color: 'black'}}>
										{message.user.name}
									</Typography>
									<Typography
										variant="body2"
										style={{
											fontFamily: "Fira Code",
											borderRadius: 10,
											backgroundColor:
												props.name === message.user.name
													? "white"
													: purple["600"],
											color:
												props.name === message.user.name
													? "black"
													: "white",
											marginTop: 5,
											padding: 5,
										}}
									>
										{message.content}
									</Typography>
								</div>
							</div>
						)
					})
				}
			</div>
			<div className={classes.footerDiv}>
				<IconButton style={{borderRadius: 0, color: purple["900"]}}
								onClick={() => {
									props.sendPrivateMessage(props.name)
								}}>
					<SendIcon/>
				</IconButton>
				<InputBase className={classes.inputBase} value={props.value}
							  onChange={props.onChange}/>
			</div>
		</Paper>
	);
}

export default CustomPopper;
