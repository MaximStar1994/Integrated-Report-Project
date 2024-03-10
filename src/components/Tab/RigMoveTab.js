import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import RigMoveTransitPage from '../../pages/Operation/RigMove/Transit'
import TouchdownPage from '../../pages/Operation/RigMove/Touchdown';
import LegPenetrationPage from '../../pages/Operation/RigMove/LegPenetration';

function TabPanel(props) {
  const { children, value, index, tabList, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
     id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
}


export default function ScrollableTabsButtonAuto() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div >
        <Tabs
          value={value}
          onChange={handleChange}
         
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Transit" {...a11yProps(0)} />
          <Tab label="Touch Down" {...a11yProps(1)} />
          <Tab label="Leg Penetration" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
            <RigMoveTransitPage/>
        </TabPanel>
        <TabPanel value={value} index={1}>
           <TouchdownPage/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <LegPenetrationPage/>
        </TabPanel>
    </div>
  );
}
