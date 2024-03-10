import React from 'react';
import VesselReportHeader from './VesselReportHeader';
import { Container, Row, Col } from 'react-bootstrap';
import ConsumableROBCard from './ConsumableROBCard';

const ConsumableROB = props => (
        <React.Fragment>
            <VesselReportHeader dailyLog={true}  heading={`Consumable ROB (${props.vesselName})`} saveForm={props.saveForm} saved={props.saved}  isSubmit={props.isSubmit} webUrl={props.webUrl}/>
            <Container fluid style={{ height: '70vh', overflowY: 'scroll' }}>
                <Row>
                    {props.data.map((rob, idx) => 
                        <Col xs={12} sm={6} lg={4} xl={3} key={idx}>
                            {<ConsumableROBCard data={rob} index={idx} handleChange={props.handleChange} touched={props.touched} errors={props.errors}/>}
                        </Col>
                    )}
                </Row>
            </Container>
        </React.Fragment>
    );

export default ConsumableROB;