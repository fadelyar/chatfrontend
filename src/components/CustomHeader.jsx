import React, {useEffect} from 'react'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import {theme} from '../theme'
import {connect} from 'react-redux'
import {useRouter} from 'next/router';
import {logOut} from '../store/appstore/actions'

const drawerWidth = 240

const useStyle = makeStyles(theme => ({
	root: {
		display: 'flex',
		color: 'white',
		maxHeight: '50px',
		minHeight: '50px'
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	flexGrow: {
		flexGrow: 1
	},
	hide: {
		display: 'none'
	},
	rightDiv: {
		display: 'flex',
		alignItems: 'center',
	},
	button: {
		marginRight: theme.spacing(1)
	},
	buttonLabel: {
		textTransform: 'capitalize',
		fontFamily: 'Fira Code'
	},
	badge: {
		color: 'white',
		fontFamily: 'Fira Code',
		fontWeight: 'bold'
	}
}))


function CustomHeader(props) {

	const classes = useStyle()
	const router = useRouter()

	return (
		<ThemeProvider theme={theme}>
			<AppBar position='fixed'
					  className={clsx(!props.open ? classes.appBar : classes.appBarShift)}
					  color='primary'
			>
				<ToolBar className={classes.root}>
					<IconButton color='inherit' className={clsx(props.open && classes.hide)}
									onClick={props.handleOpen}
					>
						<MenuIcon/>
					</IconButton>
					<div className={classes.flexGrow}/>
					<div className={classes.rightDiv}>
						{
							props.currentUser ?
								<Button variant='contained' size='small' className={classes.button}
										  onClick={() => {
											  props.logOut(null)
											  router.push('/login')
										  }}
										  classes={{
											  label: classes.buttonLabel
										  }}>
									Logout
								</Button> :
								<React.Fragment>
									<Button variant='contained' size='small' className={classes.button}
											  onClick={() => {
												  router.push('/login')
											  }}
											  classes={{
												  label: classes.buttonLabel
											  }}
									>
										Login
									</Button>
									<Button variant='contained' size='small' className={classes.button}
											  onClick={() => {
												  router.push('/signup')
											  }}
											  classes={{
												  label: classes.buttonLabel
											  }}
									>
										Sign Up
									</Button>
								</React.Fragment>

						}
						{props.currentUser &&

						<Avatar>
							{props.currentUser ? props.currentUser.name.charAt(0) : null}
						</Avatar>
						}
					</div>
				</ToolBar>
			</AppBar>
		</ThemeProvider>
	)
}

const mapStateToProps = function (state) {
	return {
		currentUser: state.appStore.currentUser,
	}
}
const mapDispatchToProps = function (dispatch) {
	return {
		logOut: (currentUser) => dispatch(logOut(currentUser))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader)