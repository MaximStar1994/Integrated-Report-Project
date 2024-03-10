import React from 'react';
import { Card, Row, Col, Button, FormControl } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';

import { withEngineLog } from './ELogContext';

const properties = {
    captain: {
        title: 'CAPTAIN',
        canvas: 'captainSignatureCanvas',
        password: 'captain.password',
        name: 'captain.name'
    },
    chiefEngineer: {
        title: 'CHIEF ENGINEER',
        canvas: 'chiefEngineerSignatureCanvas',
        password: 'chiefEngineer.password',
        name: 'chiefEngineer.name'
    }
}

const ELogAcknowledgement = props => 
    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
        <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
            {properties[props.ack]['title']}
        </Card.Header>
        <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
            <Row>
                <Col  style={{ textAlign: 'center' }}>
                    <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                        {props.signAllowed[props.ack]?
                        (
                        <div style={{ position: 'absolute', backgroundColor : "white" }}>
                            <SignatureCanvas 
                            canvasProps={{width: '400', height: '100'}}
                            ref={(ref) => props.setSignatureCanvasRef(ref, properties[props.ack]['canvas'])}
                            />
                        </div>):
                        <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                            <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                <FormControl
                                    type="password"
                                    id={properties[props.ack]['password']} 
                                    aria-describedby={properties[props.ack]['password']} 
                                    value={props.values.password}
                                    onChange={props.handleChange}
                                    name={properties[props.ack]['password']}
                                    className={"ELogInputBox"}
                                    placeholder = 'PASSWORD'
                                />
                            </div>
                            <div className={"ErrorMessage"}>
                                {props.values.passwordError}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} 
                                onClick={props.unlock}>
                                    <span style={{ marginLeft: '5px' }}>Unlock</span>
                                </Button>
                            </div>
                        </div>
                        }
                        {props.signAllowed[props.ack]?
                            <div style={{ position: "absolute", right: '0px' }}>
                                <span className="material-icons"  onClick={()=>{props.clearCanvas(properties[props.ack]['canvas'])}}>
                                    settings_backup_restore
                                </span>
                                <span className="material-icons"  onClick={()=>{
                                    props.updateSignature(properties[props.ack]['canvas'])
                                    let temp = props.signAllowed;
                                    temp[props.ack] = false;
                                    props.setSignAllowed({...temp}); 
                                }}>
                                    lock_open
                                </span>
                            </div>:
                            <div style={{ position: "absolute", right: '0px' }}>
                                <span className="material-icons">
                                    lock
                                </span>
                            </div>
                        }
                    </div>
                </Col>
            </Row>
            <Row style={{ margin: '10px', justifyContent: 'center', verticalAlign: 'center' }}>
                <div style={{ width: '400px' }}>
                    <Row>
                        <Col xs={1}>
                        </Col>
                        <Col xs={3}>
                            Name
                        </Col>
                        <Col xs={6}>
                            <FormControl
                                type="text"
                                id={properties[props.ack]['name']} 
                                aria-describedby={properties[props.ack]['name']} 
                                value={props.values.name||""}
                                onChange={props.handleChange}
                                name={properties[props.ack]['name']}
                                className={((props.touched[props.ack] && props.touched[props.ack]['name']) && (props.errors[props.ack] && props.errors[props.ack]['name'])) !==undefined? "ELogInputBoxError" : "ELogInputBox"}
                            />
                            <div className={"ErrorMessage"}>
                            {((props.touched[props.ack] && props.touched[props.ack]['name']) && (props.errors[props.ack] && props.errors[props.ack]['name'])) !== undefined? props.touched[props.ack]['name'] && props.errors[props.ack]['name']:<br/>}  
                            </div>
                        </Col>
                    </Row>
                </div>
            </Row>
        </Card.Body>
    </Card>

export default withEngineLog(ELogAcknowledgement);