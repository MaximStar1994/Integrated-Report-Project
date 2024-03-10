import React from 'react';
import {Card, Row, Col, FormControl} from 'react-bootstrap';
import { Button } from '@material-ui/core';
import './BDN.css';

const QtyDeliveredInputCard = props => (
    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: 'rgb(0,0,0,0)', borderRadius: '0px', border: '0px'}}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '5px', backgroundColor: '#04384C', borderRadius: '5px', display: 'inline-block', marginRight: '10px', alignItems: 'center' }}>
                <div className={props.data.autoFill.online ? 'BDNAutofillActiveDot' : 'BDNAutofillInActiveDot'} />
                <Button 
                onClick={()=>{props.autoFill()}}
                disabled={!(props.data.autoFill.enabled && props.data.autoFill.online)} variant="contained" color="primary" style={{ backgroundColor: props.displayAutofill, paddingLeft: '10px', paddingRight: '10px', fontSize: '0.7em' }}> 
                    Auto Fill
                </Button>                                                    
            </div>

        </div>
        {props.header?
            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: 'rgb(0,0,0,0)', textAlign: 'center', fontSize: '1.2em'}}>
                {props.header}
            </Card.Header>
        :null}
        <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
            <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: 'rgb(0,0,0,0)', borderRadius: '0px', border: '0px'}}>
                <Card.Body style={{ padding: '0px 0px 15px 0px', verticalAlign: 'center' }}>
                    <Row>
                        <Col style={{ width: '90%', textAlign: 'center' }}>
                            <div style={{ textAlign: 'center', fontSize: '1.4em', fontWeight: 'bold', paddingBottom: '10px' }}>
                                {props.data.volume.label}
                            </div>
                            {/* <div style={props.data.volume.value?{ minWidth: '100px', backgroundColor: '#04425A', padding: '5px', fontSize: '1.4em', fontWeight: 'bold', paddingBottom: '10px', border: '4px solid #0565ff'}:{ minWidth: '100px', backgroundColor: '#04425A', padding: '10px', fontSize: '1.4em', fontWeight: 'bold', paddingBottom: '10px', border: '4px solid #0565ff' }}> */}
                                <FormControl
                                    type="number"
                                    id={props.data.volume.field} 
                                    aria-describedby={props.data.volume.field} 
                                    value={props.data.volume.value}
                                    onChange={props.handleChange}
                                    name={props.data.volume.field}
                                    className={(props.data.volume.touched && props.data.volume.error) !==undefined? "InputBoxErrorVolume" : "InputBoxVolume"}
                                />
                                <div className={"ErrorMessage"}>
                                    {(props.data.volume.touched && props.data.volume.error) !== undefined? props.data.volume.touched && props.data.volume.error:null}
                                </div>
                            {/* </div> */}
                            <div style={{ textAlign: 'center' }}>
                                {props.data.volume.suffix}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Card.Body>
    </Card>
);

export default QtyDeliveredInputCard;