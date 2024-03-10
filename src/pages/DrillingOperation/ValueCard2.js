import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';

import './DrillingOperation.css'
class ValueCard2 extends React.Component {
    
    render() {
        var value = parseFloat(this.props.value).toFixed(2)
        value = this.props.unfilteredVal ? this.props.unfilteredVal : value
        return (
            <>
            <Row style={this.props.style}>
                <Col className="cardBG" >
                    <div className="valueBox">
                        <div className="label" style={{margin : "auto"}}>{this.props.label}</div>
                        <div className="value">{value}</div>
                        <div className="unit">{this.props.unit}</div>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
}

export default ValueCard2;
