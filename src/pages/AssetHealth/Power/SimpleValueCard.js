import React from 'react';
import {Row,Col} from 'react-bootstrap'

class SimpleValueCard extends React.Component {
    render() {
        var dp = this.props.dp ? this.props.dp : 0
        var value = parseFloat(this.props.value).toFixed(dp)
        if (this.props.toExponentialForm) {
            value = this.props.value.toExponential(dp)
        }
        return (
            <>
            <Row style={{flexGrow : 1}}>
                <Col style={{textAlign:"center", alignSelf : "center"}}>
                    <div className="blueHeading4">
                        {this.props.label}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="">
                        <div className="assetHealthvalueBox" 
                            style={{borderRadius : "15px", width: "fit-content", margin: "auto", backgroundColor : "unset", padding : "0 10px", textAlign : "center"}}>
                            <div className="lightBlueValue" style={{width : "unset", padding : "10px 0"}}>{value}</div>
                            <div className="unit blueHeading4" style={{alignSelf : "flex-end", width :"unset", paddingLeft : "5px"}}>{this.props.unit}</div>
                        </div>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
}

export default SimpleValueCard;
