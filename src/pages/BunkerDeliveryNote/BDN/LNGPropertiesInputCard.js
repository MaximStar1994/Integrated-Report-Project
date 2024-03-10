import React from 'react';
import {Card, FormControl, Row, Col} from 'react-bootstrap';
import './BDN.css';

const LNGPropertiesInputCard = props => (
    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
        {props.header?
            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39'}}>
                {props.header}
            </Card.Header>
        :null}
        <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
            {props.data?props.data.map((row,idk) => (
                <React.Fragment key={idk}>
                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                        <Card.Body style={{ padding: '0px 0px 15px 0px', verticalAlign: 'center' }}>
                            <Row>
                                <Col xs={5} style={{ display: 'flex', alignItems: 'center' }}>
                                    {row.label}
                                </Col>
                                <Col xs={5}>
                                    <Row>
                                        <FormControl
                                            type="number"
                                            id={row.field} 
                                            aria-describedby={row.field} 
                                            value={row.value}
                                            onChange={props.handleChange}
                                            name={row.field}
                                            className={(row.touched && row.error) !==undefined? "InputBoxError" : "InputBox"}
                                        /> 
                                    </Row>
                                    <Row>
                                            {(row.touched && row.error) !== undefined? row.touched && row.error:null}
                                        {/* <div className={"ErrorMessage"}>
                                        </div> */}
                                    </Row>
                                </Col>
                                <Col xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                                    {row.suffix} 
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>   
                </React.Fragment>
            )): null}
        </Card.Body>
    </Card>
);

export default LNGPropertiesInputCard;