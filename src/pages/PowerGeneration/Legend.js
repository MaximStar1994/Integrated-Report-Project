import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import '../../css/App.css';
import infoIcon from '../../assets/Icon/info-white.png'
import GeneratorStatus from './GeneratorStatus'
import BreakerClosed from '../../assets/Power/Breaker_Close.png'
import BreakerOpened from '../../assets/Power/Breaker_Opened.png'
import BreakerTripped from '../../assets/Power/Breaker_Tripped.png'

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

class Legend extends React.Component {
    constructor(props,context) {
        super(props, context);
        this.state={}
        this.refDiv = React.createRef()
    }

    render() {
        return (
            <HtmlTooltip
                placement="right-start"
                title={
            <React.Fragment>
                <Row>
                    <Col>
                        Motor Status
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <GeneratorStatus name="G" status="ready" />
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center", padding : "3px"}}>
                        Ready
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <GeneratorStatus name="G" status="on" />
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center", padding : "3px"}}>
                        On
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <GeneratorStatus name="G" status="off" />
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center", padding : "3px"}}>
                        Off
                    </Col>
                </Row>
                <Row style={{marginTop : "10px"}}>
                    <Col>
                        Circuit Breaker Status
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <img className="legendIcon" src={BreakerOpened} alt="brake on"/>
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        Breaker Opened
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <img className="legendIcon" src={BreakerClosed} alt="brake off"/>
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        Breaker Closed
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <img className="legendIcon" src={BreakerTripped} alt="brake trip"/>
                    </Col>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        Breaker Tripped
                    </Col>
                </Row>
            </React.Fragment>
            }
        >
            <img src={infoIcon} alt="Information"/>
        </HtmlTooltip>)
    }
}

export default Legend;
