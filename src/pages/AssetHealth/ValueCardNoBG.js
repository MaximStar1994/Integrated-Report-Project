import React from 'react';
import {Row,Col} from 'react-bootstrap'

import './AssetEquipmentHealth.css'
class ValueCardAssetHealthNoBG extends React.Component {
    render() {
        var value = parseFloat(this.props.value).toFixed(2)
        if (value == "NaN") {
            value = "-"
        }
        return (
            <>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <div className="assetHealthValueCardlabel">
                        {this.props.label}
                        {this.props.label2 != undefined && <br />}
                        {this.props.label2}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col >
                    <div className="assetHealthvalue">{value}</div>
                    <div className="unit" style={{textAlign : "center"}}>{this.props.unit}</div>
                </Col>
            </Row>
            </>
        )
    }
}

export default ValueCardAssetHealthNoBG;
