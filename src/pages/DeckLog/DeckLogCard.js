import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import DeckLogInput from './DeckLogInput';

const DeckLogCard = props => (
    <Card style={props.noBorder?{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}:{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
        {props.header?<Card.Header style={{ fontSize: '1.2em', padding: '10px', border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>{props.header}</Card.Header>:null}
        <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
            <Row>
                {props.data.map( (row, idx) => (
                    <Col key={idx} xs={props.inputsInRow} style={(props.inputsInRow===4 && idx>2)||(props.inputsInRow===6 && idx>1)?{ marginTop: '10px', paddingRight: '5px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}:{paddingRight: '10px', paddingLeft: '10px', display: 'flex', flexDirection: 'column'}}>
                        <DeckLogInput data={row} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                    </Col>
                ))}
            </Row>
        </Card.Body>
    </Card>
);

export default DeckLogCard;