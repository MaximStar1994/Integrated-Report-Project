import React from 'react';
import { Row, Col, Card } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'

import DeckLogCard from './DeckLogCard';
import DeckLogInput from './DeckLogInput';

const DeckLogTotalUpToDate = props => {
    return(
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
            <Card.Body style={{ border: '0px' }}>
                <Row style={{margin: "20px"}}>
                    <Col xl={6} xs={12}>
                        <Row style={{ marginTop: '20px' }}>
                            <DeckLogCard inputsInRow={4} data={props.data.hoursUnderway} handleChange={props.handleChange} header='Hours Underway' setFieldValue={props.setFieldValue}/>
                        </Row>
                        <Row style={{ marginTop: '20px' }}>
                            <DeckLogCard inputsInRow={6} data={props.data.distanceRun} handleChange={props.handleChange} header='Distance Run' setFieldValue={props.setFieldValue}/>
                        </Row>
                    </Col>
                    <Col xl={6} xs={12}>
                        <Row style={{ marginTop: '20px' }} className='CentralGridPaddingOnXL'>
                            <DeckLogCard inputsInRow={4} data={props.data.rightBox} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    );
}
export default withMessageManager(withLayoutManager(DeckLogTotalUpToDate));