import React from 'react';
import { Row, Col, Form,FormControl, Card } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

import ELogCard from './ELogCard';

const ELogTab = props => {
    return(
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
            <Card.Body style={{ border: '0px' }}>
                <div style={{ fontSize: '1.4rem', textAlign: 'center' }}>{props.meta.title}</div>
                <Row style={{margin: "20px"}}>
                    <Col xs={12}>
                        <Row style={{ marginTop: '20px' }}>
                            <ELogCard inputsInRow={4} data={props.data} meta={props.meta} handleChange={props.handleChange} />
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    );
}
export default withMessageManager(withLayoutManager(ELogTab));