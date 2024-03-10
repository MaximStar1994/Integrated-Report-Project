import React from 'react';
import '../../css/App.css';
import {withLayoutManager} from '../../Helper/Layout/layout'
import { Row,Col } from 'react-bootstrap';
class PowerGauge extends React.Component {
    renderChart(perVal) {
        var y = Math.max(5,perVal) 
        if (perVal.toFixed(0) == 0 ) {
            y = 0
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 40 105"}>
                <rect 
                    fill="#ffffff" 
                    fillRule="nonzero" id="svg_0" x="10" y="5" width="18" height="100" rx="5" ry="5"/>
                <rect 
                    fill="#00b050" 
                    fillRule="nonzero" id="svg_1" x="10" y={105-Math.max(perVal,5)} width="18" height={y - 5}/>
                <rect 
                    fill="#00b050" 
                    fillRule="nonzero" id="svg_1" x="10" y={105-Math.max(perVal,5)} width="18" height={y} rx="5" ry="5"/>
                <text x="33" y="80" 
                    fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                    className="powerGaugeMarkings" 
                    textAnchor="left" 
                    alignmentBaseline="middle"
                    fill="#777777">25</text>
                <line x1="25" y1="80" x2="32" y2="80" stroke="#aaaaaa" strokeWidth="0.5"/>
                <text x="33" y="55"
                    fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                    className="powerGaugeMarkings" 
                    textAnchor="left" 
                    alignmentBaseline="middle"
                    fill="#777777">50</text>
                <line x1="25" y1="55" x2="32" y2="55" stroke="#aaaaaa" strokeWidth="0.5"/>
                <text x="33" y="30"
                    fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                    className="powerGaugeMarkings" 
                    textAnchor="left" 
                    alignmentBaseline="middle"
                    fill="#777777">75</text>
                <line x1="25" y1="30" x2="32" y2="30" stroke="#aaaaaa" strokeWidth="0.5"/>
                <text x="33" y="5"
                    fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" 
                    className="powerGaugeMarkings" 
                    textAnchor="left" 
                    alignmentBaseline="middle"
                    fill="#777777">100</text>
                <line x1="25" y1="5" x2="32" y2="5" stroke="#aaaaaa" strokeWidth="0.5"/>
            </svg>
        )
    }
    padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }
    render() {
        var data = this.props.data
        return (
            <Row>
                <Col xs={{span : 10, offset : 1}} className="MainCardBG" style={{padding : this.props.renderFor === 0 ? "15px" : "", borderRadius : "15px", paddingTop : "15px"}}>
                    <Row>
                        <Col>
                            <h3 className="powerGaugeLabel">POWER (%)</h3>
                        </Col>
                    </Row>
                    <Row noGutters={true}>
                        <Col>
                            {this.renderChart(data.powerper)}
                        </Col>
                        <Col>
                            {this.renderChart(data.kvarper)}
                        </Col>
                    </Row>
                    <Row noGutters={true} style={{textAlign : "center", color : "#2d63f7", marginTop : "10px"}} className="powerGaugeValue">
                        <Col>
                            {this.padDigits(Math.abs(data.power).toFixed(0),4)}
                        </Col>
                        <Col>
                            {this.padDigits(Math.abs(data.kvar).toFixed(0),4)}
                        </Col>
                    </Row>
                    <Row noGutters={true} className="powerGaugeUnit" style={{textAlign : "center", marginTop : "5px"}}>
                        <Col>
                            kW
                        </Col>
                        <Col>
                            kVar
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default withLayoutManager(PowerGauge);
