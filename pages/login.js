import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import * as yup from "yup";
import {Field, Form, Formik} from "formik";
import Link from "next/link";
import {login} from "../src/store/appstore/actions";
import {connect} from "react-redux";
import {useRouter} from "next/router";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import CustomHeader from "../src/components/CustomHeader";
import Loader from "../src/components/Loader";

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
		[theme.breakpoints.down("sm")]: {
			width: "95%",
		},
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
		.min(2, "password too short")
		.max(20, "password too long")
		.required("password is required"),
});

function Login(props) {
	const classes = useStyle();
	const router = useRouter();

	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const onSubmit = function (values) {
		props.login(values, (error) => {
			if (error) return handleClick();
			router.replace("/");
		});
	};

	if (props.loaded) {
		return <Loader/>
	}

	return (
		<div className={classes.root}>
			<CustomHeader/>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error">
					{props.error}
				</Alert>
			</Snackbar>
			<div className={classes.formDiv}>
				<Typography variant="h5" className={classes.typography}>
					Login
				</Typography>
				<div style={{width: "100%"}}>
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
												type='password'
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
							<Link href="/signup">
								<Typography
									style={{fontSize: "70%", marginLeft: "3px"}}
									variant="caption"
								>
									Don't have an account
									<i
										style={{
											color: "blue",
											cursor: "pointer",
											marginLeft: "5px",
											textDecoration: "underlin",
										}}
									>
										Signup
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

const mapStateToProps = function (state) {
	return {
		loaded: state.appStore.loaded,
		error: state.appStore.error
	};
};

const mapDispatchToProps = function (dispatch) {
	return {
		login: (data, callback) => dispatch(login(data, callback)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
