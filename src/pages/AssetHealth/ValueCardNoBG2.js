import React from 'react';
import {Row,Col} from 'react-bootstrap'

import './AssetEquipmentHealth.css'
class ValueCardAssetHealthNoBG2 extends React.Component {
    render() {
        var value = this.props.value
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
                    <div className="assetHealthvalue2">{value}</div>
                    <div className="unit" style={{textAlign : "center"}}>{this.props.unit}</div>
                </Col>
            </Row>
            </>
        )
    }
}

export default ValueCardAssetHealthNoBG2;
