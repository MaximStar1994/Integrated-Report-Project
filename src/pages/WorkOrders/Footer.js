import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import NotificationIcon from '@material-ui/icons/Notifications';
import SettingIcon from '@material-ui/icons/SettingsApplications';
import LocationOnIcon from '@material-ui/icons/FileCopySharp';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    margin: 'auto',
    backgroundColor: 'rgb(4, 91, 123)'
  },
  actionItem: {
    "&$selected": {
      color: "#dee2e6"
    }
  },
  selected: { color: "#dee2e6" }
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState('notification');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      className={classes.root}
    >
      {/* <BottomNavigationAction classes={{ root: classes.actionItem, selected: classes.selected }} component={Link} to="/assetmaintenance/workOrderNotification" value="notification" label="Work Order Notifications" icon={<NotificationIcon />} />
      <BottomNavigationAction classes={{ root: classes.actionItem, selected: classes.selected }} component={Link} to="/assetmaintenance/workOrderSummary" value="record" label="Work Order Records" icon={<SettingIcon />} />
      <BottomNavigationAction classes={{ root: classes.actionItem, selected: classes.selected }} component={Link} to="/assetmaintenance/workOrderDocument" value="document" label="Document Management" icon={<LocationOnIcon />} /> */}
    </BottomNavigation>
  );
}
