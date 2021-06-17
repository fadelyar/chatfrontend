import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomHeader from "../src/components/CustomHeader";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { purple } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyle = makeStyles((theme) => ({
   root: {
      height: "90vh",
      // border: '1px solid black',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
   },
   joinDiv: {
      border: "0.5px solid lightgrey",
      borderRadius: 10,
      display: "flex",
      width: "30%",
      height: "30%",
      flexDirection: "column",
      justifyContent: "space-between",
      minWidth: "200px",
      [theme.breakpoints.down("sm")]: {
         width: "60%",
      },
      [theme.breakpoints.down("xs")]: {
         width: "90%",
      },
   },
   joinDivHeader: {
      display: "flex",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      // flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: purple["800"],
      color: "white",
      fontFamily: "Fira Code",
      height: "70px",
      marginBottom: theme.spacing(1),
   },
}));

function Index(props) {
   const router = useRouter();
   const classes = useStyle();
   const [value, setValue] = useState("default");

   const handleValue = (event) => setValue(event.target.value);
   const handleClick = () => router.push(`/groups/${value}`);
   const handleKeyPress = function (event) {
      if (event.charCode == 13) {
         handleClick();
      }
   };

   if (!props.currentUser) router.push("/login");

   useEffect(() => {
      if (!props.currentUser) {
         router.replace("/login");
      }
   }, []);

   return (
      <div className={classes.root}>
         <CssBaseline />
         <CustomHeader />
         <div className={classes.joinDiv}>
            <div className={classes.joinDivHeader}>
               <Typography variant="h5">Joining Chat Room</Typography>
            </div>
            {/* <div style={{ flexGrow: 1 }} /> */}
            <div style={{ padding: 2 }}>
               <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={handleValue}
                  autoFocus
                  value={value}
                  label="Group Name"
                  inputProps={{
                     style: { fontFamily: "Fira Code" },
                  }}
                  onKeyPress={handleKeyPress}
               />
               <Button
                  variant="contained"
                  fullWidth
                  style={{
                     backgroundColor: purple["700"],
                     marginTop: 10,
                     color: "white",
                  }}
                  onClick={handleClick}
               >
                  Join
               </Button>
            </div>
         </div>
      </div>
   );
}

const mapStateToProps = function (state) {
   return {
      currentUser: state.appStore.currentUser,
   };
};

export default connect(mapStateToProps, null)(Index);
