import {makeStyles} from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '500px',
		height: '400px',
		border: '1px solid black',
		alignItems: 'flex-end'
	},
	eachDiv: {
		width: '300px',
		height: '300px',
		margin: theme.spacing(1)
	}
}))

function Admin(props) {
	const classes = useStyle()
	return (
		<div className={classes.root}>
			<div className={classes.eachDiv} style={{backgroundColor: 'red'}}>

			</div>
			<div className={classes.eachDiv} style={{backgroundColor: 'red'}}>

			</div>
			<h2 style={{width: 'auto', maxWidth: '100px'}}>
				salam asdsad asdasd asd asd as das das da sd as
			</h2>
		</div>
	);
}

export default Admin;