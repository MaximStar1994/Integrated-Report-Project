import React from 'react';
import {Row,Col} from 'react-bootstrap'

import './AssetEquipmentHealth.css'
class ValueCardAssetHealth extends React.Component {
    render() {
        var value = parseFloat(this.props.value).toFixed(2)
        return (
            <>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <div className="assetHealthvalueOuterCard assetHealthValueCardlabel">
                        {this.props.label}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col >
                    <div className="assetHealthcardBG assetHealthvalueCard">
                        <div className="assetHealthvalueBox">
                            <div className="assetHealthvalue">{value}</div>
                            <div className="unit">{this.props.unit}</div>
                        </div>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
}

export default ValueCardAssetHealth;
