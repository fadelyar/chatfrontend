import React from "react";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import CustomAvatar from "./CustomAvatar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/CloseRounded";
import SendIcon from "@material-ui/icons/SendRounded";
import {purple} from "@material-ui/core/colors";
import {InputBase} from "@material-ui/core";
import PhotoImage from '@material-ui/icons/PhotoCamera'
import Typography from "@material-ui/core/Typography";
import Image from "next/image";

const useStyle = makeStyles((theme) => ({
	root: {
		display: "flex",
		width: "300px",
		flexDirection: "column",
		height: "450px",
		minWidth: "250px",
		marginLeft: theme.spacing(0.5),
		marginRight: "5px",
	},
	messageArea: {
		flexGrow: 1,
		overflow: "auto",
	},
	headerDiv: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0.5),
		borderBottom: "1px solid lightgrey",
	},
	footerDiv: {
		display: "flex",
		alignItems: "center",
		borderTop: "1px solid lightgrey",
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
		fontSize: "95%",
	},
	flexGrow: {
		flexGrow: 1,
	},
	img: {
		borderRadius: 10,
		cursor: 'pointer'
	}
}));

function CustomPopper(props) {
	const classes = useStyle();
	return (
		<Paper className={classes.root}>
			<div className={classes.headerDiv}>
				<CustomAvatar src="../../man.png"/>
				<Typography variant="h6">{props.name}</Typography>
				<div className={classes.flexGrow}/>
				<IconButton
					onClick={() => {
						props.handleClose(props.name);
					}}
				>
					<CloseIcon/>
				</IconButton>
			</div>
			<div className={classes.messageArea}>
				{props.messages.map((message, index) => {
					return (
						<div
							key={index}
							style={{
								display: "flex",
								padding: "5px",
								// border: '1px solid green',
								maxWidth: "299px",
								justifyContent:
									props.name === message.user.name
										? "flex-end"
										: "flex-start",
								height: "auto",
								width: "100%",
							}}
						>
							<div
								style={{
									display: "flex",
									// border: '1px solid orange',
									flexDirection: "column",
									width: "85%",
									alignItems:
										props.name === message.user.name
											? "flex-end"
											: "flex-start",
								}}
							>
								{/*<Typography variant='caption' style={{color: 'black'}}>*/}
								{/*	{message.user.name}*/}
								{/*</Typography>*/}
								{
									message.type === 'text' ?
										<Typography
											variant="body2"
											style={{
												fontFamily: "Fira Code",
												borderRadius: 10,
												backgroundColor:
													props.name === message.user.name
														? "gray"
														: purple["600"],
												color: "white",
												marginTop: 5,
												padding: 2,
											}}
										>
											{message.content}
										</Typography> :
										<Image src={message.content}
												 alt='image'
												 className={classes.img}
												 width={150}
												 height={100}
												 onClick={(event) => {
												 	props.openBackDropImage(event)
												 }}
										/>
								}
							</div>
						</div>
					);
				})}
			</div>
			<div className={classes.footerDiv}>
				<IconButton
					style={{borderRadius: 0, color: purple["900"]}}
					onClick={() => {
						props.sendPrivateMessage(props.name);
					}}
				>
					<SendIcon/>
				</IconButton>
				<InputBase
					className={classes.inputBase}
					value={props.value}
					onChange={props.onChange}
					name={props.name}
					onKeyPress={(event) => {
						if (event.charCode == 13) {
							props.sendPrivateMessage(props.name);
						}
					}}
				/>
				<div>
					<input onChange={(event) => {
						props.uploadImage(event, 'privateMessage')
					}}
							 name={props.name}
							 type='file'
							 style={{
								 position: 'absolute', width: 20, cursor: 'pointer',
								 opacity: 0, zIndex: 5
							 }}/>
					<IconButton size='small'>
						<PhotoImage/>
					</IconButton>
				</div>
			</div>
		</Paper>
	);
}

export default CustomPopper;
