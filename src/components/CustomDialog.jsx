import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyle = makeStyles(theme => ({
   buttonLabel: {
      fontFamily: 'Fira Code',
      textTransform: 'capitalize'
   }
}))

function CustomDialog(props) {

   const router = useRouter()
   const classes = useStyle()
   const [room, setRoom] = useState('')

   const handleRoom = (event) => setRoom(event.currentTarget.value)
   const handleJoin = function () {
      router.push(`/groups/${room}`)
   }

   return (
      <React.Fragment>
         <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle>
               Join Room
            </DialogTitle>
            <DialogContent>
               <DialogContentText>
                  To join room, please first login to the system by entring you email && password!
               </DialogContentText>
               <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Room Name"
                  fullWidth
                  onChange={handleRoom}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={props.handleClose}
                  color="secondary" variant='contained'
                  classes={{
                     label: classes.buttonLabel
                  }}
               >
                  Cancel
                </Button>
               <Button onClick={() => {
                  handleJoin()
                  props.handleClose()
               }} color="primary" variant='contained'
                  classes={{
                     label: classes.buttonLabel
                  }}
               >
                  Join
               </Button>
            </DialogActions>
         </Dialog>
      </React.Fragment>
   )
}

export default CustomDialog