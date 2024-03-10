import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';

// item
class AssetHealthListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    
    render() {
        console.log(this.props.list)
        return (
            <>
            <Row>
                <Col>
                    <div style={{display : "flex"}}>
                        <div>
                            Assets Health Summary
                        </div>
                        <div style={{marginLeft : "auto", color : "#e44944"}} >
                            Model Training In Progress
                        </div>
                    </div>
                </Col>
            </Row>
            </>)
    }
}

export default AssetHealthListItem;
