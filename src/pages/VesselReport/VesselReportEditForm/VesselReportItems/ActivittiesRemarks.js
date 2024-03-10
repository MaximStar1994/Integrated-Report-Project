import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col, Form } from 'react-bootstrap';
import config from '../../../../config/config';
import { ActivitiesStructure } from '../VesselReportFormStructure';

const ActivitiesRemarks = props => (
    <React.Fragment>
        <VesselReportHeader dailyLog={props.dailyLog} heading={props.dailyLog===true?"Deck Dept. Activities / Remarks":"Engine Dept. Activities / Remarks"} saveForm={props.saveForm} saved={props.saved} isSubmit={props.isSubmit} webUrl={props.webUrl} />        <Container fluid>
            <Row>
                {Object.entries(ActivitiesStructure).map(([element, elementDetail], idx) => (
                    <Col xs={12} key={idx}>
                        <Form.Group>
                            <Form.Label style={{ color: config.KSTColors.MAIN }}>{props.dailyLog===true?"Deck Dept. ":"Engine Dept. "}{elementDetail.title}</Form.Label>
                            <Form.Control 
                                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                                as={elementDetail.type}
                                rows={15} 
                                id={element} 
                                aria-describedby={element} 
                                value={props.data===null?'':props.data}
                                onChange={props.handleChange}
                                name={element}
                            />
                        </Form.Group>
                    </Col>
                ))
                }
            </Row>
        </Container>
    </React.Fragment>
        
);

export default ActivitiesRemarks;