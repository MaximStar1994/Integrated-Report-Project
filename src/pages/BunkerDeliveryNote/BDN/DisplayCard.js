import React from 'react';
import { Card, FormControl, Row, Col } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import './BDN.css';

const DisplayCard = props => (
    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
        {props.header?
            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', fontSize: '1.2em' }}>
                {props.header}
            </Card.Header>
        :null}
        <Card.Body style={{ border: '0px' }}>
            {props.displayAutofill?(
                <div style={{ padding: '5px', backgroundColor: '#04384C', borderRadius: '5px', display: 'inline-block', marginRight: '10px', alignItems: 'center' }}>
                    <div className={props.data.autoFill.online ? 'BDNAutofillActiveDot' : 'BDNAutofillInActiveDot'} />
                    <Button 
                    onClick={()=>{props.autoFill()}}
                    disabled={!(props.data.autoFill.enabled && props.data.autoFill.online)} variant="contained" color="primary" style={{ backgroundColor: props.displayAutofill, paddingLeft: '10px', paddingRight: '10px', fontSize: '0.7em' }}> 
                        Auto Fill
                    </Button>                                                    
                </div>
            ):null}
            {Object.keys(props.data).map( (key, idx) => (
                <React.Fragment key={idx}>
                    {key!=='autoFill'?
                        <Card key={idx} style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                        <Card.Body style={idx===Object.keys(props.data).length-1?{ padding: '0px 0px 0px 0px', verticalAlign: 'center' }: { padding: '0px 0px 7px 0px', verticalAlign: 'center' }} >
                            <Row>
                                <Col style={{ display: 'flex', alignItems: 'center' }}>
                                    {props.data[key].label} {props.data[key].star?<sup style={{ color: props.data[key].star, fontSize: '1.4rem' }}>*</sup>:null}
                                </Col>
                                {props.data[key].formula?
                                    (<Col style={{ display: 'flex', alignItems: 'center' }}>
                                        {props.data[key].formula}
                                    </Col>):null
                                }
                                <Col>
                                    <div style={{ display:"flex", alignItems:'center' }}>
                                        {props.data[key].autoFill||props.data[key].manual?
                                        (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ paddingRight: '10px' }}>
                                            <FormControl
                                                type="number"
                                                id={props.data[key].field} 
                                                aria-describedby={props.data[key].field} 
                                                value={props.data[key].value}
                                                onChange={props.handleChange}
                                                name={props.data[key].field}
                                                className={(props.data[key].touched && props.data[key].error) !==undefined? "InputBoxError" : (props.data[key].autoFill?"BDNInputBoxAutoFill":"InputBox")}
                                            />
                                            </div>
                                            <div className={"ErrorMessage"}>
                                                {(props.data[key].touched && props.data[key].error) !== undefined? props.data[key].touched && props.data[key].error:<br></br>}
                                            </div>
                                            
                                        </div>):
                                        <span style={{ width: '100%', backgroundColor: '#04384C', padding: '5px', minHeight: '1.4rem' }}>
                                            {props.data[key].value}
                                        </span>
                                        }
                                    </div>
                                </Col>
                                <Col xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                                    {props.data[key].suffix}
                                </Col>
                                
                            </Row>
                        </Card.Body>
                        </Card>
                    :null}
                </React.Fragment>
            ))}
        </Card.Body>
    </Card>
);

export default DisplayCard;