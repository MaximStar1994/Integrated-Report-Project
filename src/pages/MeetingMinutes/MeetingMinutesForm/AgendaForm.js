import React from 'react';
import {Container, Row, Col, Card, FormControl } from 'react-bootstrap';
import { MMTitleAndLabels } from '../MeetingMinuteDataSet';

const AgendaForm = props => {
    return(
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
            <Card.Body style={{ border: '0px' }}>
                <div style={{ fontSize: '1.4rem', textAlign: 'center' }}>{MMTitleAndLabels[`${props.prefix}`]['title']}</div>
                <Row style={{margin: "20px"}}>
                    {Object.keys(MMTitleAndLabels[`${props.prefix}`]['labels']).map(label => (
                        <Col key={label} xs={12} md={6} style={{ marginBottom: '5px', color: '#067FAA' }}>
                            <label> {MMTitleAndLabels[`${props.prefix}`]['labels'][label]}</label> 
                            {
                            typeof(props.data)==='string'?
                            <FormControl
                                as="textarea" 
                                rows='3'
                                id={`${label}`} 
                                aria-describedby={label} 
                                value={props.data}
                                onChange={props.handleChange}
                                name={`${label}`}
                                className="InputBox"
                            />
                            :
                            <FormControl
                                as="textarea" 
                                rows='3'
                                id={`${props.prefix}.${label}`} 
                                aria-describedby={label} 
                                value={props.data[label]}
                                onChange={props.handleChange}
                                name={`${props.prefix}.${label}`}
                                className="InputBox"
                            />
                            }
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
}

export default AgendaForm;