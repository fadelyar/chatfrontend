import CssBaseline from "@material-ui/core/CssBaseline";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import Typography from "@material-ui/core/Typography";
import CustomHeader from "../../src/components/CustomHeader";
import {purple} from "@material-ui/core/colors";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import InputBase from "@material-ui/core/InputBase";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import GroupIcon from "@material-ui/icons/CardMembership";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/SendRounded";
import CustomDialog from "../../src/components/CustomDialog";
import Tooltip from "@material-ui/core/Tooltip";
import {io} from "socket.io-client";
import Skeleton from "@material-ui/lab/Skeleton";
import CustomAvatar from "../../src/components/CustomAvatar";
import axios from "axios";
import Link from "next/link";
import MailIcon from "@material-ui/icons/Mail";
import CustomPopper from "../../src/components/CustomPopper";
import PhotoImage from '@material-ui/icons/PhotoCamera'
import CustomBackdrop from '../../src/components/CustomBackdrop'
import Image from 'next/image'
import useMediaQuery from "@material-ui/core/useMediaQuery";

let socket = null;

const useStyle = makeStyles((theme) => ({
	drawer: {
		width: 240,
		flexShrink: 0,
	},
	drawerPaper: {
		width: 240,
		backgroundColor: purple["800"],
		overflowX: "hidden",
	},
	drawerHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		height: "49px",
		padding: 5,
		color: "green",
	},
	drawerMain: {
		display: "flex",
		flexDirection: "column",
		padding: theme.spacing(0.5),
		height: "100%",
	},
	main: {
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		display: "flex",
		flexDirection: "column",
		height: "100vh",
	},
	mainShift: {
		width: `calc(100% - ${240}px)`,
		marginLeft: 240,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		display: "flex",
		flexDirection: "column",
		height: "100vh",
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
	avatar: {
		width: "50px",
		height: "50px",
		marginRight: theme.spacing(1),
		color: "white",
	},
	groupDiv: {
		display: "flex",
		marginBottom: theme.spacing(1),
		"&:hover": {
			cursor: "pointer",
		},
	},
	skeleton: {
		width: "100%",
		backgroundColor: "lightgrey",
	},
	link: {
		"&:hover": {
			scale: 1.1,
			color: "white",
		},
	},
	image: {
		borderRadius: 10,
		cursor: 'pointer'
	}
}));

function Group(props) {

	const messagesDivRef = useRef(null);
	const matches = useMediaQuery('(min-width:600px)')
	const router = useRouter();
	const classes = useStyle();
	const [open, setOpen] = useState(true);
	const [messages, setMessages] = useState([]);
	const [messageValue, setMessageValue] = useState("");
	const [expanded, setExpanded] = React.useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [groupContent, setGroupContent] = useState([]);
	const [groupContentLoaded, setGroupContentLoaded] = useState(true);
	const [privateContent, setPrivateContent] = useState([]);
	const [privateMessageValue, setPrivateMessageValue] = useState({});
	const [backDropImage, setBackDropImage] = useState(false)
	const [selectedImage, setSelectedImage] = useState(null)
	// const [image, setImage] = useState()

	const handleCloseBackDropImage = function () {
		setBackDropImage(false)
	}

	const openBackDropImage = function (event) {
		setBackDropImage(true)
		setSelectedImage(event.currentTarget.src)
	}

	const uploadImage = function (event, eventName) {
		if (event.currentTarget.files[0] && event.currentTarget.files[0].type.startsWith('image')
			&& event.currentTarget.files[0].size < 1048576) {
			const reader = new FileReader()
			const file = event.currentTarget.files[0]
			const name = event.currentTarget.name
			reader.onload = function (evt) {
				if (eventName === 'privateMessage') {
					sendPrivateMessage(name, 'image', evt.target.result)
				} else {
					socket.emit(eventName, {data: evt.target.result, type: 'image'})
				}
			}

			reader.readAsDataURL(file)
		}
	}

	const openActiveUser = function (userName) {
		if (userName === props.currentUser.name || privateContent.length > 3) return

		setPrivateMessageValue((prev) => {
			return {...prev, [userName]: ""};
		})
		setPrivateContent((prevState) => {
			if (prevState.find((user) => user.userName === userName))
				return prevState;
			return [...prevState, {userName: userName, messages: []}];
		})
	}

	const closeActiveUser = function (userName) {
		const filtered = privateContent.filter((content) => {
			return content.userName !== userName;
		});
		setPrivateContent(filtered);
	};

	const sendPrivateMessage = function (id, type = 'text', result = null) {
		socket.emit("privateMessage", {
			data: {
				message: type === 'text' ? privateMessageValue[id] : result,
				sender: props.currentUser.name,
				receiver: id,
			},
			type: type
		});
		setPrivateMessageValue(prevState => {
			return {...prevState, [id]: ''}
		})
	};

	const handlePrivateMessage = function (event) {
		setPrivateMessageValue((prev) => {
			return {...prev, [event.target.name]: event.target.value};
		});
	};

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const closeOpen = () => setOpen(false);
	const openOpen = () => setOpen(true);
	const handleMessageValue = function (event) {
		setMessageValue(event.currentTarget.value);
	};
	const sendMessage = function (event) {
		if (event.target.value.trim().length === 0) return;
		if (event.charCode == 13) {
			socket.emit("sendMessage", {data: messageValue, type: 'text'});
			setMessageValue("");
		}
	};

	const handleJoin = function () {
		setOpenDialog(true);
	};
	const closeOpenDialog = function () {
		setOpenDialog(false);
	};

	if (!props.currentUser) router.push("/login");


	useEffect(() => {
		setOpen(matches)
	}, [matches])

	useEffect(() => {
		if (!props.currentUser) {
			router.push("/login");
		} else {
			setMessages(props.previousMessages);
			socket = io(
				// `https://live-chat-application-simple.herokuapp.com/?room=${props.group}`,
				`http://localhost:5000/?room=${props.group}`,
				{
					auth: {
						token: props.currentUser.token,
					},
				}
			);
			socket.on("connect", () => {
			});
			socket.on("groupContent", (groupContent) => {
				setGroupContent(groupContent);
				setGroupContentLoaded(false);
			});
			socket.on("sendBack", (data) => {
				setMessages((prev) => {
					return [...prev, {data: data.data, type: data.type}];
				});
				messagesDivRef.current.scrollIntoView({behavior: 'smooth'})
			});
			socket.on("sendBackPrivateMessage", (data) => {
				setPrivateContent((prev) => {
					const newArray = prev.find(
						(content) => content.userName === data.receiver
					);
					if (!newArray) {
						openActiveUser(data.receiver);
					}
					const updatedArray = prev.map((user) => {
						if (user.userName === newArray.userName) {
							user.messages = user.messages.concat(data.message);
							return user;
						}
						return user;
					});
					return updatedArray;
				});
			});
		}
	}, [props.group]);
	if (!props.currentUser) {
		router.push("/login");
	}

	return (
		<div>
			<CssBaseline/>
			<CustomHeader open={open} handleOpen={openOpen}/>
			<CustomDialog open={openDialog} handleClose={closeOpenDialog}/>
			<CustomBackdrop open={backDropImage} src={selectedImage}
								 handleClose={handleCloseBackDropImage}
			/>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<Typography
						variant="h6"
						style={{
							color: "white",
							paddingLeft: 13,
							fontFamily: "Fira Code",
						}}
					>
						Chat Groups
					</Typography>
					<IconButton
						onClick={closeOpen}
						style={{
							color: "white",
						}}
					>
						<ChevronLeftIcon/>
					</IconButton>
				</div>
				<Divider style={{backgroundColor: "lightgrey", height: 0.05}}/>
				<div className={classes.drawerMain}>
					{groupContentLoaded ? (
						<div>
							<Skeleton className={classes.skeleton}/>
							<Skeleton className={classes.skeleton}/>
						</div>
					) : (
						<div>
							{groupContent.map((content, index) => {
								return (
									<div key={index} className={classes.groupDiv}>
										<Accordion
											expanded={expanded === content.name}
											onChange={handleChange(content.name)}
											style={{
												backgroundColor: purple["900"],
												width: "100%",
												paddingTop: 5,
											}}
										>
											<AccordionSummary
												style={{height: "40px"}}
												expandIcon={
													<ExpandMoreIcon
														style={{color: "white"}}
													/>
												}
												aria-controls="panel1bh-content"
												id="panel1bh-header"
											>
												<IconButton style={{color: "lightgrey"}}>
													<GroupIcon fontSize="large"/>
												</IconButton>
												<div
													style={{
														display: "flex",
														flexDirection: "column",
														alignItems: "center",
													}}
												>
													<Link href={`/groups/${content.name}`}>
														<Typography
															variant="body1"
															className={classes.link}
															style={{
																fontFamily: "Fira Code",
																color: "lightgrey",
															}}
														>
															{content.name}
														</Typography>
													</Link>
													<Typography
														variant="caption"
														style={{
															fontFamily: "Fira Code",
															fontWeight: "bold",
															color: "lightgrey",
														}}
													>
														{new Date(
															content.dateCreated
														).toLocaleTimeString()}
													</Typography>
												</div>
											</AccordionSummary>
											<AccordionDetails
												style={{
													display: "flex",
													flexDirection: "column",
												}}
											>
												{content.users.map((member, index) => {
													return (
														<div
															key={index}
															style={{
																paddingLeft: "30px",
																marginBottom: 3,
																display: "flex",
																alignItems: "center",
																color: "lightgrey",
															}}
														>
															<CustomAvatar src={"/man.png"}/>
															<div
																style={{
																	display: "flex",
																	width: "100%",
																	alignItems: "center",
																	color: "lightgrey",
																}}
															>
																<Typography
																	variant="body1"
																	style={{
																		textTransform:
																			"capitalize",
																		fontFamily: "monospaces",
																		fontWeight: "bold",
																		marginRight: "5px",
																		flex: 1,
																	}}
																>
																	{member.name}
																</Typography>

																<IconButton
																	color="inherit"
																	onClick={() => {
																		openActiveUser(
																			member.name
																		);
																	}}
																>
																	<MailIcon/>
																</IconButton>
															</div>
														</div>
													);
												})}
											</AccordionDetails>
										</Accordion>
									</div>
								);
							})}
						</div>
					)}
					<div style={{flexGrow: 1}}/>
					<Button variant="contained" onClick={handleJoin}>
						Join
					</Button>
				</div>
			</Drawer>
			<div className={clsx(!open ? classes.main : classes.mainShift)}>
				<div

					style={{
						flexGrow: 1,
						backgroundColor: "lightgray",
						padding: 5,
						marginTop: "50px",
						overflow: "auto",
					}}
				>
					{props.currentUser &&
					messages.map((message, index) => {
						return (
							<div
								ref={messagesDivRef}
								key={index}
								style={{
									display: "flex",
									justifyContent:
										props.currentUser.name === message.data.user.name
											? "flex-end"
											: "flex-start",
									marginBottom: 5
								}}
							>
								{
									message.data.type === 'text' ?
										<Tooltip
											title={new Date(
												message.data.dateCreated
											).toLocaleTimeString()}
											arrow
										>
											<Typography
												variant="body2"
												style={{
													fontFamily: "Fira Code",
													borderRadius: 10,
													backgroundColor:
														props.currentUser.name ===
														message.data.user.name
															? "white"
															: purple["600"],
													color:
														props.currentUser.name ===
														message.data.user.name
															? "black"
															: "white",
													alignItems: "center",
													marginTop: 5,
													padding: 5,
												}}
											>
												{message.data.content}
											</Typography>
										</Tooltip> :
										<Image src={message.data.content} onClick={openBackDropImage}
												 alt='image'
												 className={classes.image}
												 width={300}
												 height={250}
										/>
								}
							</div>
						);
					})}
				</div>
				<div
					style={{
						display: "flex",
						backgroundColor: "white",
						height: "42px",
					}}
				>
					<IconButton
						style={{borderRadius: 0, color: purple["900"]}}
						onClick={() => {
							if (messageValue.trim().length === 0) return
							socket.emit("sendMessage", {data: messageValue, type: 'text'});
							setMessageValue("");
						}}
					>
						<SendIcon/>
					</IconButton>
					<InputBase
						className={classes.inputBase}
						onChange={handleMessageValue}
						value={messageValue}
						onKeyPress={sendMessage}
					/>
					<div style={{
						display: 'flex', marginRight: 10,
						justifyContent: 'center', alignItems: 'center'
					}}>
						<input onChange={(event) => {
							uploadImage(event, 'sendMessage')
						}} type='file'
								 itemType='image'
								 style={{
									 position: 'absolute', width: 20, cursor: 'pointer',
									 opacity: 0, zIndex: 5
								 }}/>
						<IconButton size='small' style={{color: 'rebecapurple'}}>
							<PhotoImage/>
						</IconButton>
					</div>
				</div>
			</div>
			<div
				style={{
					position: "fixed",
					width: "100%",
					display: "flex",
					bottom: "45px",
					justifyContent: "flex-end",
				}}
			>
				{privateContent.map((group, index) => {
					return (
						<CustomPopper
							key={index}
							name={group.userName}
							handleClose={closeActiveUser}
							messages={group.messages}
							value={privateMessageValue[group.userName]}
							onChange={handlePrivateMessage}
							sendPrivateMessage={sendPrivateMessage}
							uploadImage={uploadImage}
							openBackDropImage={openBackDropImage}
						/>
					);
				})}
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const {group} = context.params;
	const response = await axios.get(
		// `https://live-chat-application-simple.herokuapp.com/chat/getlast30messages/${group}`
		`http://localhost:5000/chat/getlast30messages/${group}`
	);

	const data = response.data;
	return {
		props: {
			previousMessages: data,
			group,
		},
	};
}

const mapStateToProps = function (state) {
	return {
		currentUser: state.appStore.currentUser,
		loaded: state.appStore.loaded,
	};
};

export default connect(mapStateToProps, null)(Group);
