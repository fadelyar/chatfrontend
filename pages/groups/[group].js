import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Typography from "@material-ui/core/Typography";
import CustomHeader from "../../src/components/CustomHeader";
import { purple } from "@material-ui/core/colors";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import InputBase from "@material-ui/core/InputBase";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import { Avatar, Button } from "@material-ui/core";
import { connect } from "react-redux";
import GroupIcon from "@material-ui/icons/CardMembership";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/SendRounded";
import CustomDialog from "../../src/components/CustomDialog";
import Tooltip from "@material-ui/core/Tooltip";
import { io } from "socket.io-client";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Skeleton from '@material-ui/lab/Skeleton';

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
}));

function Group(props) {
   const router = useRouter();
   const classes = useStyle();
   const matches = useMediaQuery("(min-width:600px)");
   const [open, setOpen] = useState();
   const [messages, setMessages] = useState([]);
   const [messageValue, setMessageValue] = useState("");
   const [expanded, setExpanded] = React.useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [groupContent, setGroupContent] = useState([]);
   const [groupContentLoaded, setGroupContentLoaded] = useState(true)

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
         setMessages([]);
         socket = io(
            `https://live-chat-application-simple.herokuapp.com/?room=${props.group}`,
            {
               auth: {
                  token: props.currentUser.token,
               },
            }
         );
         socket.on("connect", () => {});
         socket.on("groupContent", (groupContent) => {
            setGroupContent(groupContent);
            setGroupContentLoaded(false)
         });
         socket.on("sendBack", (data) => {
            setMessages((prev) => {
               return [...prev, data];
            });
         });
      }
   }, [props.group]);
   return (
      <div>
         <CssBaseline />
         <CustomHeader open={open} handleOpen={openOpen} />
         <CustomDialog open={openDialog} handleClose={closeOpenDialog} />
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
                  <ChevronLeftIcon />
               </IconButton>
            </div>
            <Divider style={{ backgroundColor: "lightgrey", height: 0.05 }} />
            <div className={classes.drawerMain}>
               {
                  groupContentLoaded ?
                     <div>
                        <Skeleton animation="wave" style={{color: 'lightgrey'}}/>
                     </div> :
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
                                       style={{ height: "40px" }}
                                       expandIcon={
                                          <ExpandMoreIcon style={{ color: "white" }} />
                                       }
                                       aria-controls="panel1bh-content"
                                       id="panel1bh-header"
                                    >
                                       <IconButton style={{ color: "lightgrey" }}>
                                          <GroupIcon fontSize="large" />
                                       </IconButton>
                                       <div
                                          style={{
                                             display: "flex",
                                             flexDirection: "column",
                                             alignItems: "center",
                                          }}
                                       >
                                          <Typography
                                             variant="body1"
                                             style={{
                                                fontFamily: "Fira Code",
                                                color: "lightgrey",
                                             }}
                                          >
                                             {content.name}
                                          </Typography>
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
                                                <Avatar
                                                   variant="rounded"
                                                   style={{
                                                      width: "20px",
                                                      height: "20px",
                                                      marginRight: 10,
                                                   }}
                                                ></Avatar>
                                                <Typography
                                                   variant="overline"
                                                   style={{
                                                      color: "lightgrey",
                                                      fontFamily: "Fira Code",
                                                   }}
                                                >
                                                   {member.name}
                                                </Typography>
                                             </div>
                                          );
                                       })}
                                    </AccordionDetails>
                                 </Accordion>
                              </div>
                           );
                        })}
                     </div>
               }
               <div style={{ flexGrow: 1 }} />
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
                              props.currentUser.id === message.userId
                                 ? "flex-start"
                                 : "flex-end",
                           height: "40px",
                        }}
                     >
                        <Tooltip
                           title={new Date(
                              message.dataCreated
                           ).toLocaleTimeString()}
                           arrow
                        >
                           <Typography
                              variant="body2"
                              style={{
                                 fontFamily: "Fira Code",
                                 borderRadius: 10,
                                 backgroundColor:
                                    props.currentUser.id === message.userId
                                       ? "white"
                                       : purple["600"],
                                 color:
                                    props.currentUser.id === message.userId
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
                  style={{ borderRadius: 0, color: purple["900"] }}
                  onClick={() => {
                     socket.emit("sendMessage", messageValue);
                     setMessageValue("");
                  }}
               >
                  <SendIcon />
               </IconButton>
               <InputBase
                  className={classes.inputBase}
                  onChange={hadnleMessageValue}
                  value={messageValue}
                  onKeyPress={sendMessage}
               />
            </div>
         </div>
      </div>
   );
}

export async function getServerSideProps(context) {
   const { group } = context.params;
   // const response =
   // 	// await axios.get(`http://localhost:8000/chatapi/get30messages/${group}/`)
   // await axios
   // 	.get(`https://chat-rest-api-backend.herokuapp.com/chatapi/get30messages/${group}`)

   // const data = response.data
   return {
      props: {
         // previousMessages: data,
         group,
      },
   };
}

const mapStateToProps = function (state) {
   return {
      currentUser: state.appStore.currentUser,
      loaded: state.appStore.loaded
   };
};

export default connect(mapStateToProps, null)(Group);
