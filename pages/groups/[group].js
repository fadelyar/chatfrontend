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
import {Button} from "@material-ui/core";
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
import Badge from "@material-ui/core/Badge";
import MailIcon from '@material-ui/icons/Mail'
import CustomPopper from "../../src/components/CustomPopper";

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
		border: "1px solid black",
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
}));

function Group(props) {
	const router = useRouter();
	const classes = useStyle();
	const [open, setOpen] = useState(true);
	const [messages, setMessages] = useState([]);
	const [messageValue, setMessageValue] = useState("");
	const [expanded, setExpanded] = React.useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [groupContent, setGroupContent] = useState([]);
	const [groupContentLoaded, setGroupContentLoaded] = useState(true);
	const [privateMessages, setPrivateMessages] = useState([])
	const [openedUsers, setOpenedUsers] = useState([])
	const [privateMessageValue, setPrivateMessageValue] = useState('')

	const handlePrivateMessageValue = function (event) {
		setPrivateMessageValue(event.currentTarget.value)
	}

	const deleteOpenedUser = function (name) {
		setOpenedUsers(prevState => {
			return prevState.filter(user => user.name !== name)
		})
	}

	const addOpenedUser = function (name) {
		// event.stopPropagation()
		const is = openedUsers.some((user) => user.name === name)
		if (is || openedUsers.length > 3) return
		setOpenedUsers(prevState => {
			return [...prevState,
				{
					element: <CustomPopper handlePrivateMessage={handlePrivateMessageValue}
												  handleClose={deleteOpenedUser}
												  sendPrivateMessage={sendPrivateMessage}
												  value={privateMessageValue}
												  messages={privateMessages}
												  name={name}/>, name: name
				}
			]
		})
	}

	const sendPrivateMessage = function (id) {
		socket.emit('privateMessage', {message: privateMessageValue, id: id})
	}

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const messagesDivRef = useRef(null);


	const closeOpen = () => setOpen(false);
	const openOpen = () => setOpen(true);
	const hadnleMessageValue = function (event) {
		setMessageValue(event.currentTarget.value);
	};
	const sendMessage = function (event) {
		// console.log(event.target.value);
		if (event.target.value.length === 0) return;
		if (event.charCode == 13) {
			socket.emit("sendMessage", messageValue);
			setMessageValue("");
		}
	};

	const handleJoin = function () {
		setOpenDialog(true);
	};
	const closeOpenDialog = function () {
		setOpenDialog(false);
	};

	useEffect(() => {
		if (!props.currentUser) {
			router.push("/login");
		} else {
			setMessages(props.previousMessages);
			socket = io(
				`https://live-chat-application-simple.herokuapp.com/?room=${props.group}`,
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
					return [...prev, data];
				});
			});
			socket.on('sendPrivateMessageBack', (data) => {
				setPrivateMessages(prevState => {
					return [...prevState, data]
				})
			})
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
															}}
														>
															{/*<Avatar*/}
															{/*   variant="rounded"*/}
															{/*   style={{*/}
															{/*      width: "20px",*/}
															{/*      height: "20px",*/}
															{/*      marginRight: 10,*/}
															{/*   }}*/}
															{/*></Avatar>*/}
															<CustomAvatar src={"/man.png"}/>
															<Typography
																variant="body1"
																style={{
																	textTransform: "capitalize",
																	color: "lightgrey",
																	fontFamily: "monospaces",
																	fontWeight: "bold",
																	marginRight: '5px'
																}}
															>
																{member.name}
															</Typography>
															<Badge badgeContent={10} max={5} color='secondary'
															>
																<MailIcon onClick={
																	() => {
																		addOpenedUser(member.name)
																	}
																}/>
															</Badge>
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
					{messages.map((message, index) => {
						return (
							<div
								ref={messagesDivRef}
								key={index}
								style={{
									display: "flex",
									justifyContent:
										props.currentUser.name === message.user.name
											? "flex-end"
											: "flex-start",
									height: "40px",
								}}
							>
								<Tooltip
									title={new Date(
										message.dateCreated
									).toLocaleTimeString()}
									arrow
								>
									<Typography
										variant="body2"
										style={{
											fontFamily: "Fira Code",
											borderRadius: 10,
											backgroundColor:
												props.currentUser.name === message.user.name
													? "white"
													: purple["600"],
											color:
												props.currentUser.name === message.user.name
													? "black"
													: "white",
											alignItems: "center",
											marginTop: 5,
											padding: 5,
										}}
									>
										{message.content}
									</Typography>
								</Tooltip>
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
							socket.emit("sendMessage", messageValue);
							setMessageValue("");
						}}
					>
						<SendIcon/>
					</IconButton>
					<InputBase
						className={classes.inputBase}
						onChange={hadnleMessageValue}
						value={messageValue}
						onKeyPress={sendMessage}
					/>
				</div>
			</div>
			<div style={{
				position: 'fixed', display: 'flex',
				width: '100%',
				bottom: '43px', justifyContent: 'flex-end'
			}}>
				{
					openedUsers.map((user) => {
						return user.element
					})
				}
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const {group} = context.params;
	const response =
		// 	// await axios.get(`http://localhost:8000/chatapi/get30messages/${group}/`)
		await axios.get(
			`https://live-chat-application-simple.herokuapp.com/chat/getlast30messages/${group}`
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
