import React from 'react';
import Container from 'react-bootstrap/Container'
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import ValueCard from '../DrillingOperation/ValueCard2'
import './AssetCard.css'
import HorizontalGauge from '../../components/HorizontalGauge/HorizontalGauge'
class AssetCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var data = this.props.data ? this.props.data : {
            asset : "Top Drive",
            active : false,
            runningHrs : 11478,
            temperature : 0.00,
            speed : -100,
            torque : 70,
            power : 50,
        }
        data.temperature = Math.max(0, data.temperature)
        var border = ""
        if (data.active) {
            border = "5px solid green"
        }
        return (
            <Row>
                <Col>
                    <div className="cardBG assetCard" style={{padding : "8px", marginLeft : "5px", marginRight : "5px"}}>
                        <div style={{border : border, paddingLeft : "10px", paddingRight : "10px", paddingTop : "5px", paddingBottom : "5px"}}>
                            <Row>
                                <Col xs={5}>
                                    {data.asset}
                                </Col>
                                <Col xs={7}>
                                    <Row noGutters={true}>
                                        <Col xs={10} >
                                            <ValueCard value={data.runningHrs} label="" unit=""></ValueCard>
                                        </Col>
                                        <Col xs={2} style={{display : "flex", flexDirection : "column", alignItems : "center", fontSize : "0.8rem"}}>
                                            <Row>
                                                <Col>+</Col>
                                            </Row>
                                            <Row>
                                                <Col>Hrs</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    Temperature (&#8451;)
                                </Col>
                            </Row>
                            <Row noGutters={true} style={{marginRight : "5px"}}>
                                <Col xs={8}>
                                    <HorizontalGauge data={data.temperature} min={0} max={100} />
                                </Col>
                                <Col xs={4}>
                                    <ValueCard value={data.temperature} label="" unit="" ></ValueCard>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    Speed (RPM)
                                </Col>
                            </Row>
                            <Row noGutters={true} style={{marginRight : "5px"}}>
                                <Col xs={8} >
                                    <HorizontalGauge data={data.speed} min={-3000} max={3000} />
                                </Col>
                                <Col xs={4}>
                                    <ValueCard value={data.speed} label="" unit="" ></ValueCard>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    Torque (%)
                                </Col>
                            </Row>
                            <Row noGutters={true} style={{marginRight : "5px"}}>
                                <Col xs={8} >
                                    <HorizontalGauge data={data.torque} min={0} max={100} />
                                </Col>
                                <Col xs={4}>
                                    <ValueCard value={data.torque} label="" unit="" ></ValueCard>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    Power (%)
                                </Col>
                            </Row>
                            <Row noGutters={true} style={{marginRight : "5px"}}>
                                <Col xs={8} >
                                    <HorizontalGauge data={data.power} min={0} max={100} />
                                </Col>
                                <Col xs={4}>
                                    <ValueCard value={data.power} label="" unit="" ></ValueCard>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default AssetCard;
