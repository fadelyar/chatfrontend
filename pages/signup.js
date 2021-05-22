import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { connect } from "react-redux";
import { register } from "../src/store/appstore/actions";
import { useRouter } from "next/router";

const useStyle = makeStyles((theme) => ({
   root: {
      height: "90vh",
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
   },
   typography: {
      fontFamily: "Fira Code",
   },
   formDiv: {
      border: "1px solid lightgray",
      padding: theme.spacing(2),
      borderRadius: 10,
      width: "30%",
      height: "70%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "",
      justifyContent: "space-around",
   },
   eachDiv: {
      marginBottom: theme.spacing(3),
   },
   buttonLabel: {
      textTransform: "capitalize",
      fontFamily: "Fira Code",
   },
}));

const initailValues = {
   name: "",
   password: "",
};
const validationSchema = yup.object({
   name: yup.string().required("name is required"),
   password: yup
      .string()
      .min(5, "password too short")
      .max(20, "password too long")
      .required("password is required"),
});

function Signup(props) {
   const classes = useStyle();
   const router = useRouter();

   const onSubmit = function (values) {
      console.log("this is done by it self");
      props.register(values, (error) => {
         if (error) return;
         router.replace("/");
      });
   };

   return (
      <div className={classes.root}>
         <div className={classes.formDiv}>
            <Typography variant="h5" className={classes.typography}>
               SignUp
            </Typography>
            <div style={{ width: "100%" }}>
               <Formik
                  initialValues={initailValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
               >
                  <Form>
                     <div className={classes.eachDiv}>
                        <Field name="name">
                           {(field) => {
                              return (
                                 <TextField
                                    variant="outlined"
                                    {...field.field}
                                    error={
                                       field.meta.error && field.meta.touched
                                    }
                                    fullWidth
                                    size="small"
                                    label={
                                       field.meta.error && field.meta.touched
                                          ? field.meta.error
                                          : "Name"
                                    }
                                 />
                              );
                           }}
                        </Field>
                     </div>
                     <div className={classes.eachDiv}>
                        <Field name="password">
                           {(field) => {
                              return (
                                 <TextField
                                    variant="outlined"
                                    {...field.field}
                                    error={
                                       field.meta.error && field.meta.touched
                                    }
                                    fullWidth
                                    size="small"
                                    label={
                                       field.meta.error && field.meta.touched
                                          ? field.meta.error
                                          : "Password"
                                    }
                                 />
                              );
                           }}
                        </Field>
                     </div>
                     <div className={classes.eachDiv}>
                        <Button
                           fullWidth
                           variant="contained"
                           color="primary"
                           type="submit"
                           classes={{
                              label: classes.buttonLabel,
                           }}
                        >
                           Submit
                        </Button>
                     </div>
                     <Link href="/login">
                        <Typography
                           style={{ fontSize: "70%", marginLeft: "3px" }}
                           variant="caption"
                        >
                           Allready have an account
                           <i
                              style={{
                                 color: "blue",
                                 cursor: "pointer",
                                 marginLeft: "5px",
                                 textDecoration: "underlin",
                              }}
                           >
                              Login
                           </i>
                        </Typography>
                     </Link>
                  </Form>
               </Formik>
            </div>
         </div>
      </div>
   );
}

const mapDispatchToProps = function (dispatch) {
   return {
      register: (data, callback) => dispatch(register(data, callback)),
   };
};

export default connect(null, mapDispatchToProps)(Signup);
