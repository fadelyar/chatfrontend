import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { blue, purple } from '@material-ui/core/colors'

export const theme = createMuiTheme({
   palette: {
      primary: {
         main: purple['800']
      },
      secondary: {
         main: blue['800']
      }
   }
})