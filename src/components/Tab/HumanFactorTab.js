import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
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


export default function ScrollableTabsButtonAuto(props) {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    var tabs = []
    var tabPanels = []
    var index = 0

    // var DynamicComponent: imports
    if (props.tabList.length > 0) {
        props.tabList.forEach(element => {
            var OtherComponent = React.lazy(() => import('../../pages/Operation/HumanFactor/' + element.key));
            tabs.push(<Tab label={element.title} key={element.key} {...a11yProps(index)} />)
            tabPanels.push(<TabPanel value={value} key={element.key} index={index}><Suspense fallback={<div>Loading...</div>}>
                <OtherComponent />
            </Suspense></TabPanel>)
            index++;
        });
    }


    return (
        <div >
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabs}
            </Tabs>
            {tabPanels}
        </div>
    );
}
