import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';

import './DrillingOperation.css'
class ValueCard extends React.Component {
    render() {
        var value = parseFloat(this.props.value).toFixed(2)
        return (
            <>
            <Row>
                <Col className="valueOuterCard label" style={{textAlign:"center", padding : "0"}}>
                    {this.props.label}
                </Col>
            </Row>
            <Row>
                <Col className="cardBG valueCard" >
                    <div className="valueBox">
                        <div className="value">{value}</div>
                        <div className="unit">{this.props.unit}</div>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
}

export default ValueCard;
