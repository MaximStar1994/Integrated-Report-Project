import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'
import infoIcon from '../../assets/Icon/info-white.png'
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import ClearRoundIcon from '../../assets/Icon/ClearRoundIndicator.png'
import GreenRoundIcon from '../../assets/Icon/GreenRoundIndicator.png'
import RedRoundIcon from '../../assets/Icon/RedRoundIndicator.png'
import BlueLED from '../../assets/Icon/LEDBlue.png'
import GreenLED from '../../assets/Icon/LEDGreen.png'
import InactiveIcon from '../../assets/Icon/PowerInactiveIcon.png'
import ReadyIcon from '../../assets/Icon/PowerReadyIcon.png'
import RunningIcon from '../../assets/Icon/PowerRunningIcon.png'
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
class LegendInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
        <Col xs={2} style={{position : "absolute", zIndex : 1}}>
            <HtmlTooltip
                placement="right-start"
                title={
                <React.Fragment>
                    <Row style={{padding : "10px 0", fontWeight : "900"}} >
                        <Col>
                        Legend
                        </Col>
                    </Row>
                    <Row style={{padding : "10px 0"}} noGutters={true}>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={BlueLED} alt="motor on"/>
                        </Col>
                        <Col xs={4} style={{display : "flex", alignItems : "center"}}>
                            Off
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={GreenLED} alt="motor off"/>
                        </Col>
                        <Col xs={4} style={{display : "flex", alignItems : "center"}}>
                            On/Running
                        </Col>
                    </Row>
                    <Row style={{padding : "10px 0"}}  noGutters={true}>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={ClearRoundIcon} alt="motor on"/>
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            Off / Normal
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={GreenRoundIcon} alt="motor off"/>
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            On
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={RedRoundIcon} alt="motor fault"/>
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            Alarm
                        </Col>
                    </Row>
                    <Row style={{padding : "10px 0"}} noGutters={true} >
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={InactiveIcon} alt="motor on"/>
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            Inactive
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={RunningIcon} alt="motor off"/>
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            Running
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img className="legendIcon" src={ReadyIcon} alt="motor fault"/>
                        </Col>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            Ready
                        </Col>
                    </Row>
                </React.Fragment>
            }>
                <img src={infoIcon} alt="Information" style={{padding : "10px"}} />
            </HtmlTooltip>
        </Col>)
    }
}

export default LegendInfo;
