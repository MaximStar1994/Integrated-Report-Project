import React, { useState } from 'react';
import {Container, Row, Col, Card, FormControl, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import SignatureCanvas from 'react-signature-canvas';
import { withMeetingMinutes } from '../MeetingMinutesContext';
import config from '../../../config/config';

const GeneralForm = props => {
    const [passwords, setPasswords] = useState({
        master: '',
        chiefOfficer: '',
        chiefEngineer: '',
        secondOfficer: ''
    });
    const [errorMessages, setErrorMessages] = useState({
        master: false,
        chiefOfficer: false,
        chiefEngineer: false,
        secondOfficer: false
    })

    const unlockSignature = signPerson => {
        if(signPerson==='master'){
            if(window.MASTER===passwords.master){
                props.setSignAllowed({...props.signAllowed, master: true});
                setErrorMessages({...errorMessages, master: ''})
            }
            else{
                props.setSignAllowed({...props.signAllowed, master: false});
                setErrorMessages({...errorMessages, master: 'Invalid Password, Try Again!'})
            }
            setPasswords({...passwords, master: ''});
        }
        else if(signPerson==='chiefOfficer'){
            if(window.CHIEFOFFICER===passwords.chiefOfficer){
                props.setSignAllowed({...props.signAllowed, chiefOfficer: true});
                setErrorMessages({...errorMessages, chiefOfficer: ''})
            }
            else{
                props.setSignAllowed({...props.signAllowed, chiefOfficer: false});
                setErrorMessages({...errorMessages, chiefOfficer: 'Invalid Password, Try Again!'})
            }
            setPasswords({...passwords, chiefOfficer: ''});
        }
        else if(signPerson==='chiefEngineer'){
            if(window.CHIEFENGINEER===passwords.chiefEngineer){
                props.setSignAllowed({...props.signAllowed, chiefEngineer: true});
                setErrorMessages({...errorMessages, chiefEngineer: ''})
            }
            else{
                props.setSignAllowed({...props.signAllowed, chiefEngineer: false});
                setErrorMessages({...errorMessages, chiefEngineer: 'Invalid Password, Try Again!'})
            }
            setPasswords({...passwords, chiefEngineer: ''});
        }
        else if(signPerson==='secondOfficer'){
            if(window.SECONDOFFICER===passwords.secondOfficer){
                props.setSignAllowed({...props.signAllowed, secondOfficer: true});
                setErrorMessages({...errorMessages, secondOfficer: ''})
            }
            else{
                props.setSignAllowed({...props.signAllowed, secondOfficer: false});
                setErrorMessages({...errorMessages, secondOfficer: 'Invalid Password, Try Again!'})
            }
            setPasswords({...passwords, secondOfficer: ''});
        }
    }
    return(
        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
            <Card.Body style={{ border: '0px' }}>
                <div style={{ fontSize: '1.4rem', textAlign: 'center' }}>General</div>
                <Row style={{margin: "20px"}}>
                        <Col xs={12} md={6} style={{ marginBottom: '5px', color: '#067FAA' }}>
                            <Row style={{ marginBottom: '5px', color: '#067FAA' }}>
                                <label>Name of Vessel</label> 
                                <FormControl
                                    type="text" 
                                    id={`${props.prefix}.name`} 
                                    aria-describedby='name' 
                                    value={props.data.name}
                                    onChange={props.handleChange}
                                    name={`${props.prefix}.name`}
                                    className="InputBox"
                                />
                            </Row>
                            <Row style={{ marginBottom: '5px', color: '#067FAA' }}>
                                <label>Location</label> 
                                <FormControl
                                    type="text" 
                                    id={`${props.prefix}.location`} 
                                    aria-describedby='location'
                                    value={props.data.location}
                                    onChange={props.handleChange}
                                    name={`${props.prefix}.location`}
                                    className="InputBox"
                                />
                            </Row>
                            <Row style={{ marginBottom: '5px', color: '#067FAA' }}>
                                <label>Date & Time</label> 
                                <FormControl
                                    type="text" 
                                    id={`${props.prefix}.datetime`} 
                                    aria-describedby='datetime'
                                    value={props.data.datetime}
                                    onChange={props.handleChange}
                                    name={`${props.prefix}.datetime`}
                                    className="InputBox"
                                />
                            </Row>
                            <Row style={{ marginBottom: '5px', color: '#067FAA' }}>
                                <label>Attendees</label> 
                                <FormControl
                                    type="text" 
                                    id={`${props.prefix}.attendees`} 
                                    aria-describedby='attendees'
                                    value={props.data.attendees}
                                    onChange={props.handleChange}
                                    name={`${props.prefix}.attendees`}
                                    className="InputBox"
                                />
                            </Row>
                        </Col>
                        <Col xs={12} md={6} style={{ marginBottom: '5px', color: '#067FAA' }}>
                            <label>Remarks</label> 
                            <FormControl
                                as="textarea" 
                                rows='10'
                                id={`${props.prefix}.remarks`} 
                                aria-describedby='remarks'
                                value={props.data.remarks}
                                onChange={props.handleChange}
                                name={`${props.prefix}.remarks`}
                                className="InputBox"
                            />
                        </Col>
                </Row>
                <Row>
                    <Card style={{ border: '0px', backgroundColor: 'rgba(0,0,0,0)', color: '#067FAA', padding: '5px', width: '100%' }}>
                        <Card.Header style={{ textAlign: 'center', border: '0px', backgroundColor: 'rgba(0,0,0,0)' }}>
                            ACKNOWLEDGEMENTS
                        </Card.Header>
                        <Row>
                            <Col xs={12} xl={6}>
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                    <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
                                        MASTER SIGNATURE
                                    </Card.Header>
                                    <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                        <Row>
                                            <Col  style={{ textAlign: 'center' }}>
                                                <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                    {props.signAllowed.master?
                                                        <div style={{ position: 'absolute', backgroundColor : "white"}}>
                                                            <SignatureCanvas 
                                                            canvasProps={{width: '400', height: '100'}}
                                                            ref={(ref)=>props.setSignatureCanvasRef(ref, 'masterSignatureCanvas')}
                                                            />
                                                        </div>
                                                        :
                                                        <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                                                            <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                <FormControl
                                                                    type="password"
                                                                    id='masterPassword' 
                                                                    aria-describedby='masterPassword' 
                                                                    value={passwords.master}
                                                                    onChange={e => setPasswords({...passwords, master: e.target.value})}
                                                                    name='masterPassword'
                                                                    className={"ELogInputBox"}
                                                                    placeholder = 'PASSWORD'
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <div className={"ErrorMessage"}>
                                                                {errorMessages.master}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} onClick={()=>unlockSignature('master')}>
                                                                    <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    }
                                                    {props.signAllowed.master?
                                                        <div style={{ position: "absolute", right: '0px' }}>
                                                            <span className="material-icons"  onClick={()=> props.clearCanvas('masterSignatureCanvas')}>
                                                                settings_backup_restore
                                                            </span>
                                                            <span className="material-icons"  onClick={()=>{
                                                                props.updateSignature('masterSignatureCanvas'); 
                                                                props.setSignAllowed({...props.signAllowed, master: false})}
                                                            }>
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
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} xl={6}>
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                    <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
                                        CHIEF OFFICER SIGNATURE
                                    </Card.Header>
                                    <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                        <Row>
                                            <Col  style={{ textAlign: 'center' }}>
                                                <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                    {props.signAllowed.chiefOfficer?
                                                        <div style={{ position: 'absolute', backgroundColor : "white"}}>
                                                            <SignatureCanvas 
                                                            canvasProps={{width: '400', height: '100'}}
                                                            ref={(ref)=>props.setSignatureCanvasRef(ref, 'chiefOfficerSignatureCanvas')}
                                                            />
                                                        </div>
                                                        :
                                                        <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                                                            <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                <FormControl
                                                                    type="password"
                                                                    id='chiefOfficerPassword' 
                                                                    aria-describedby='chiefOfficerPassword' 
                                                                    value={passwords.chiefOfficer}
                                                                    onChange={e => setPasswords({...passwords, chiefOfficer: e.target.value})}
                                                                    name='chiefOfficerPassword'
                                                                    className={"ELogInputBox"}
                                                                    placeholder = 'PASSWORD'
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <div className={"ErrorMessage"}>
                                                                {errorMessages.chiefOfficer}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} onClick={()=>unlockSignature('chiefOfficer')}>
                                                                    <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    }
                                                    {props.signAllowed.chiefOfficer?
                                                        <div style={{ position: "absolute", right: '0px' }}>
                                                            <span className="material-icons"  onClick={()=> props.clearCanvas('chiefOfficerSignatureCanvas')}>
                                                                settings_backup_restore
                                                            </span>
                                                            <span className="material-icons"  onClick={()=>{
                                                                props.updateSignature('chiefOfficerSignatureCanvas'); 
                                                                props.setSignAllowed({...props.signAllowed, chiefOfficer: false})}
                                                            }>
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
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} xl={6}>
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                    <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
                                        CHIEF ENGINEER SIGNATURE
                                    </Card.Header>
                                    <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                        <Row>
                                            <Col  style={{ textAlign: 'center' }}>
                                                <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                    {props.signAllowed.chiefEngineer?
                                                        <div style={{ position: 'absolute', backgroundColor : "white"}}>
                                                            <SignatureCanvas 
                                                            canvasProps={{width: '400', height: '100'}}
                                                            ref={(ref)=>props.setSignatureCanvasRef(ref, 'chiefEngineerSignatureCanvas')}
                                                            />
                                                        </div>
                                                        :
                                                        <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                                                            <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                <FormControl
                                                                    type="password"
                                                                    id='chiefEngineerPassword' 
                                                                    aria-describedby='chiefEngineerPassword' 
                                                                    value={passwords.chiefEngineer}
                                                                    onChange={e => setPasswords({...passwords, chiefEngineer: e.target.value})}
                                                                    name='chiefEngineerPassword'
                                                                    className={"ELogInputBox"}
                                                                    placeholder = 'PASSWORD'
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <div className={"ErrorMessage"}>
                                                                {errorMessages.chiefEngineer}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} onClick={()=>unlockSignature('chiefEngineer')}>
                                                                    <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    }
                                                    {props.signAllowed.chiefEngineer?
                                                        <div style={{ position: "absolute", right: '0px' }}>
                                                            <span className="material-icons"  onClick={()=> props.clearCanvas('chiefEngineerSignatureCanvas')}>
                                                                settings_backup_restore
                                                            </span>
                                                            <span className="material-icons"  onClick={()=>{
                                                                props.updateSignature('chiefEngineerSignatureCanvas'); 
                                                                props.setSignAllowed({...props.signAllowed, chiefEngineer: false})}
                                                            }>
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
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} xl={6}>
                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', paddingBottom: '20px'}}>
                                    <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032A39', textAlign: 'center', paddingBottom: '0px'}}>
                                        2<sup>nd</sup> OFFICER SIGNATURE
                                    </Card.Header>
                                    <Card.Body style={{ border: '0px', paddingBottom: '0px' }}>
                                        <Row>
                                            <Col  style={{ textAlign: 'center' }}>
                                                <div style={{ textAlign: 'center', display: 'inline-flex', position: "relative", width: '400px', height: '100px'}}>
                                                    {props.signAllowed.secondOfficer?
                                                        <div style={{ position: 'absolute', backgroundColor : "white"}}>
                                                            <SignatureCanvas 
                                                            canvasProps={{width: '400', height: '100'}}
                                                            ref={(ref)=>props.setSignatureCanvasRef(ref, 'secondOfficerSignatureCanvas')}
                                                            />
                                                        </div>
                                                        :
                                                        <div style={{ position: 'absolute', height: '100px', width: '400px', backgroundColor: 'rgba(28, 64, 76, 100)' }}>
                                                            <div style={{ paddingTop: '7px', paddingLeft: '40px', paddingRight: '40px' }}>
                                                                <FormControl
                                                                    type="password"
                                                                    id='secondOfficerPassword' 
                                                                    aria-describedby='secondOfficerPassword' 
                                                                    value={passwords.secondOfficer}
                                                                    onChange={e => setPasswords({...passwords, secondOfficer: e.target.value})}
                                                                    name='secondOfficerPassword'
                                                                    className={"ELogInputBox"}
                                                                    placeholder = 'PASSWORD'
                                                                    autoComplete="new-password"
                                                                />
                                                            </div>
                                                            <div className={"ErrorMessage"}>
                                                                {errorMessages.secondOfficer}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                                                                <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center', fontSize: '12px' }} onClick={()=>unlockSignature('secondOfficer')}>
                                                                    <span style={{ marginLeft: '5px' }}>Unlock</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    }
                                                    {props.signAllowed.secondOfficer?
                                                        <div style={{ position: "absolute", right: '0px' }}>
                                                            <span className="material-icons"  onClick={()=> props.clearCanvas('secondOfficerSignatureCanvas')}>
                                                                settings_backup_restore
                                                            </span>
                                                            <span className="material-icons"  onClick={()=>{
                                                                props.updateSignature('secondOfficerSignatureCanvas'); 
                                                                props.setSignAllowed({...props.signAllowed, secondOfficer: false})}
                                                            }>
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
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Row>
                <Row style={{ marginRight: '20px' }}>
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)'}} >
                            {props.isSubmitting?<Spinner animation="border" variant="light" size='sm' />: ' '} 
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default withMeetingMinutes(GeneralForm);