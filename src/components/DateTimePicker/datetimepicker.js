import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
const styles = theme => ({
  header: {
    color: '#fff'
  },
  panel: {
    background: "#fff",
  },
  title: {
    color: "#fff"
  }
});





function MaterialUIPickers(props) {
  const classes = props.classes;
  // The first commit of Material-UI
  var startDate = new Date()
  var endDate = new Date()
  startDate.setDate(startDate.getDate() - 5)
  const [selectedDate, setSelectedDate] = React.useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = React.useState(endDate);
  const handleDateChange = (date) => { setSelectedDate(date); };
  const handleEndDateChange = (date) => { setSelectedEndDate(date); }; //props.updateDateRange(selectedDate,date);


  const Btn = ({ handleClick = () =>  props.updateDateRange(selectedDate,selectedEndDate) }) => (
    <Button variant="contained" style={{ width: '100px', height: '30px', justifyContent: 'center',position: 'absolute',right: '48%',top: '3%' }} onClick={handleClick}   >Update</Button>
  );
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}  >
      <Grid container justify="center"    >
        <KeyboardDatePicker

          format="MM/dd/yyyy"
          margin="normal"
          id="startDate"
          label="Start Date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }
          }
          InputProps={{ className: classes.panel }}
          InputLabelProps={{ className: classes.title }}
          style={{ paddingRight: "2%" }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="endDate"
          label="End Date"
          format="MM/dd/yyyy"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          minDate={selectedDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          InputProps={{ className: classes.panel }}
          InputLabelProps={{ className: classes.title }}
        />
        <Btn/>

      </Grid>
    </MuiPickersUtilsProvider>
  );
}
MaterialUIPickers.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MaterialUIPickers)