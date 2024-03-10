import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import './DrillingOverview.css'

import ClearRoundIcon from '../../assets/Icon/ClearRoundIndicator.png'
import GreenRoundIcon from '../../assets/Icon/GreenRoundIndicator.png'
import RedRoundIcon from '../../assets/Icon/RedRoundIndicator.png'
import BlueLED from '../../assets/Icon/LEDBlue.png'
import GreenLED from '../../assets/Icon/LEDGreen.png'
import InactiveIcon from '../../assets/Icon/PowerInactiveIcon.png'
import ReadyIcon from '../../assets/Icon/PowerReadyIcon.png'
import RunningIcon from '../../assets/Icon/PowerRunningIcon.png'
import {withLayoutManager} from '../../Helper/Layout/layout'
class CommonAux extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data
        var 
            brakeCooling1 = InactiveIcon,
            brakeCooling2 = InactiveIcon,
            bru1 = InactiveIcon,
            bru2 = InactiveIcon,
            bru3 = InactiveIcon,
            bru4 = InactiveIcon
        if (data.brakeCooling1Ready) {
            if (data.brakeCooling1Running) {
                brakeCooling1 = RunningIcon
            } else {
                brakeCooling1 = ReadyIcon
            }
        }
        if (data.brakeCooling2Ready) {
            if (data.brakeCooling2Running) {
                brakeCooling2 = RunningIcon
            } else {
                brakeCooling2 = ReadyIcon
            }
        }
        if (data.bruFan1Ready) {
            if (data.bruFan1Running) {
                bru1 = RunningIcon
            } else {
                bru1 = ReadyIcon
            }
        }
        if (data.bruFan2Ready) {
            if (data.bruFan2Running) {
                bru2 = RunningIcon
            } else {
                bru2 = ReadyIcon
            }
        }
        if (data.bruFan3Ready) {
            if (data.bruFan3Running) {
                bru3 = RunningIcon
            } else {
                bru3 = ReadyIcon
            }
        }
        if (data.bruFan4Ready) {
            if (data.bruFan4Running) {
                bru4 = RunningIcon
            } else {
                bru4 = ReadyIcon
            }
        }
        var imageStyle = {alignSelf : "center"}
        var fontSizeStyle = {fontSize : this.props.renderFor !== 0 ? "0.8rem" : ""}
        var marginTopBtmStyle = {marginTop : "5px", marginBottom : "5px"}
        return (
            <div className="cardBG" style={{padding : "10px", height : "100%"}}>
            <Row style={fontSizeStyle}>
                <Col xs={{span : 12, offset : 0}} sm={{span : 12, offset : 0}} lg={{span : 8, offset : 2}}>
                    <Row noGutters = {true}>
                        <Col xs={4} sm={2}>
                            <Row style={marginTopBtmStyle} noGutters = {true}>
                                <Col xs={{span : 3, offset : 0}} style={imageStyle}><img src={brakeCooling1} className="img-responsive"/></Col>
                                <Col xs={8} style={{marginLeft :"5px"}}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Brake Cooling Pump 1</div></Col>
                            </Row>
                        </Col>
                        <Col xs={4} sm={2}>
                            <Row style={marginTopBtmStyle} noGutters = {true}>
                                <Col xs={{span : 3, offset : 0}} style={imageStyle}><img src={brakeCooling2} className="img-responsive"/></Col>
                                <Col xs={8} style={{marginLeft :"5px"}}><div style={{display : "flex", height : "100%", alignItems : "center"}}>Brake Cooling Pump 2</div></Col>
                            </Row>
                        </Col>
                        <Col xs={4} sm={2}>
                            <Row style={marginTopBtmStyle} noGutters = {true}>
                                <Col xs={{span : 3, offset : 0}} style={imageStyle}><img src={bru1} className="img-responsive"/></Col>
                                <Col xs={8} style={{marginLeft :"5px"}}><div style={{display : "flex", height : "100%", alignItems : "center"}}>BRU Cooling Fan 1</div></Col>
                            </Row>
                        </Col>
                        <Col xs={4} sm={2}> 
                            <Row style={marginTopBtmStyle} noGutters = {true}>
                                <Col xs={{span : 3, offset : 0}} style={imageStyle}><img src={bru2} className="img-responsive"/></Col>
                                <Col xs={8} style={{marginLeft :"5px"}}><div style={{display : "flex", height : "100%", alignItems : "center"}}>BRU Cooling Fan 2</div></Col>
                            </Row>
                        </Col>
                        <Col xs={4} sm={2}>
                            <Row style={marginTopBtmStyle} noGutters = {true}>
                                <Col xs={{span : 3, offset : 0}} style={imageStyle}><img src={bru3} className="img-responsive"/></Col>
                                <Col xs={8} style={{marginLeft :"5px"}}><div style={{display : "flex", height : "100%", alignItems : "center"}}>BRU Cooling Fan 3</div></Col>
                            </Row>
                        </Col>
                        <Col xs={4} sm={2}>
                            <Row style={marginTopBtmStyle} noGutters = {true}>
                                <Col xs={{span : 3, offset : 0}} style={imageStyle}><img src={bru4} className="img-responsive"/></Col>
                                <Col xs={8} style={{marginLeft :"5px"}}><div style={{display : "flex", height : "100%", alignItems : "center"}}>BRU Cooling Fan 4</div></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>)
    }
}

export default withLayoutManager(CommonAux);
