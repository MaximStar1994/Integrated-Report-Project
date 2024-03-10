import React from 'react'
import { Container, Row, Col, Card, FormControl, Button, Form, Spinner } from 'react-bootstrap';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from '@material-ui/core';

import { withRouter } from "react-router-dom"
import { Formik } from "formik";
import * as Yup from "yup";
import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withAuthManager } from '../../Helper/Auth/auth'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEdit, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import ELogInterval from './ELogInterval';
import ELogAcknowledgement from './ELogAcknowledgement';
import './ELog.css'
import config from '../../config/config';

import { withEngineLog } from './ELogContext';

class ELogTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isSubmit: false,
            todayDate: '',
            captain: {
                password: '',
                passwordError: '',
                name: ''
            },
            chiefEngineer: {
                password: '',
                passwordError: '',
                name: ''
            }

        //     pastLogs: [],
        };
        this.validationSchema = Yup.object().shape({
            captain: Yup.object().shape({
                name: Yup.string().required('Please input Captain\'s Name')
            }),
            chiefEngineer: Yup.object().shape({
                name: Yup.string().required('Please input Chief Engineer\'s Name')
            })
        });
    }
    componentDidMount() {
        this.props.getEngineLog();
        this.setState({ todayDate: moment().format('DD / MM / YYYY') });

    }
    componentWillUnmount(){
        this.props.resetEngineLogTable();
    }

    renderForm() {
        let init = { ...this.state };
        return (
            <Formik
            initialValues={init}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                this.setState({ isSubmit: true });
                this.props.submitEngineLog(values.captain.name, values.chiefEngineer.name, (result, err) => {
                    console.log(result, err);
                    if(!err){
                        this.setState({ isSubmit: false });
                        this.props.setMessages([{type : "success", message : "Submitted!"}]);
                        this.props.resetEngineLogTable();
                        this.props.getEngineLog();
                    }
                    else {
                        this.setState({ isSubmit: false });
                        this.props.setMessages([{type : "danger", message : err}]);
                    }
                })
            }}
            >
                {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=>{
                const unlockCaptainSignature = () =>{
                    if(values.captain.password===window.CAPTAIN){
                        this.props.setSignAllowed({...this.props.signAllowed, captain: true}); 
                        values.captain.passwordError = "";
                        values.captain.password = "";
                    }
                    else {
                        this.props.setSignAllowed({...this.props.signAllowed, captain: false}); 
                        values.captain.passwordError = "Invalid Password, Try Again!";
                        values.captain.password = "";
                    }
                } 
                const unlockChiefEngineerSignature = () =>{
                    if(values.chiefEngineer.password===window.CHIEFENGINEER){
                        this.props.setSignAllowed({...this.props.signAllowed, chiefEngineer: true}); 
                        values.chiefEngineer.passwordError = "";
                        values.chiefEngineer.password = "";
                    }
                    else {
                        this.props.setSignAllowed({...this.props.signAllowed, chiefEngineer: false}); 
                        values.chiefEngineer.passwordError = "Invalid Password, Try Again!";
                        values.chiefEngineer.password = "";
                    }
                } 
                return ( 
                    <Form onSubmit={handleSubmit} className="mx-auto">
                        <Container>
                            <Row style={{ backgroundColor: '#032A39', padding: '20px' }}>
                                <Col>
                                    <Row style={{ backgroundColor: '#04384C', padding: '20px' }}>
                                        <Col>
                                            <Row style={{ color: '#067FAA', justifyContent: 'center', fontSize: '1.2em', paddingBottom: '15px' }}>
                                                <Col xs={9}>
                                                    <Row style={{ color: '#067FAA', justifyContent: 'center', fontSize: '1.2em', paddingBottom: '15px' }}>
                                                        E-LOG
                                                    </Row>
                                                    <Card style={{ border: '2px solid #067FAA', borderRadius: '15px', backgroundColor: 'rgba(0,0,0,0)' }}>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                                                                    <span>
                                                                        <div className='TimeIntervals'>
                                                                            <span className='ButtonTextTimeInterval'>
                                                                            <Button variant="contained" color="primary" 
                                                                                    className='EditButtonELogTable'
                                                                                    onClick={()=> {
                                                                                        this.props.history.push({pathname: `/remarks`})
                                                                                    }}>
                                                                                    <FontAwesomeIcon icon={faEdit} size='lg'/> 
                                                                                </Button>
                                                                                <span className='EditButtonTextELogTable'>Remarks</span>
                                                                            </span>
                                                                            <FontAwesomeIcon icon={faCircle} size={'sm'} style={this.props.engineLog.remarks && this.props.engineLog.remarks.length>0?{ color: '#66ff00' }: { color: '#067FAA' }} />
                                                                        </div>
                                                                    </span>
                                                                    <span style={{ marginRight: 'auto', visibility: 'hidden' }}></span>
                                                                    <span style={{ fontSize: '1.6em' }}>{this.state.todayDate}</span>
                                                                    <span style={{ marginLeft: 'auto' }}>
                                                                        <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', color: 'white', display: 'flex', alignItems: 'center' }} 
                                                                        disabled={this.state.isSubmit || !this.props.canSubmit}
                                                                        > 
                                                                            {this.state.isSubmit?<Spinner animation="border" variant="light" size='sm' />: ' '}    
                                                                            <span className="material-icons">send</span> 
                                                                            <span style={{ marginLeft: '5px' }}>Submit</span>
                                                                        </Button>
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{ marginTop: '10px' }}>
                                                                <div className='ELogLineHeading'> <span>Interval Log Timing</span> </div>
                                                            </Row>
                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <ELogInterval id={1} isSaved={this.props.engineLog.logs.filter(elog=>elog.timeInterval===1)[0]['isSaved']}/>
                                                                    <ELogInterval id={2} isSaved={this.props.engineLog.logs.filter(elog=>elog.timeInterval===2)[0]['isSaved']}/>
                                                                    <ELogInterval id={3} isSaved={this.props.engineLog.logs.filter(elog=>elog.timeInterval===3)[0]['isSaved']}/>
                                                                </Col>
                                                            </Row>

                                                            <Row style={{ marginTop: '20px' }}>
                                                                <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <ELogInterval id={4} isSaved={this.props.engineLog.logs.filter(elog=>elog.timeInterval===4)[0]['isSaved']}/>
                                                                    <ELogInterval id={5} isSaved={this.props.engineLog.logs.filter(elog=>elog.timeInterval===5)[0]['isSaved']}/>
                                                                    <ELogInterval id={6} isSaved={this.props.engineLog.logs.filter(elog=>elog.timeInterval===6)[0]['isSaved']}/>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={3}>
                                                    <Paper style={{ width: '100%', backgroundColor: '#067FAA' }} >
                                                        <TableContainer >
                                                            <Table stickyHeader aria-label="sticky table" size={'small'}>
                                                                <TableHead style={{ backgroundColor: '#067FAA'}}>
                                                                    <TableRow>
                                                                        <TableCell style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA'  }} align="center"><span> Date </span></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    
                                                                {this.props.pastEngineLog.slice(0, 5).map((row, idx) => (
                                                                    <TableRow hover  style={{ width: '100%', borderRadius: '15px' }}  tabIndex={-1} style={{ marginBottom: '55px' }} key={idx}>
                                                                        <TableCell className='ReportsTable'  align="center"  onClick={()=> window.open(`${window.RIGCAREBACKENDURL}/${row.filepath}`, '_blank')}>
                                                                        <span style={{ color: 'rgb(4,102,255)', paddingRight: '10px' }}><FontAwesomeIcon icon={faFilePdf} /></span> <span style={{ color: '#fff' }}>{moment(row.generated_date).format('DD / MM / YYYY')}</span>        
                                                                        {/* TZ was removed */}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}  
                                                                </TableBody>
                                                                <TableFooter style={{ backgroundColor: '#067FAA'}}>
                                                                    <TableRow>
                                                                        <TableCell className='cursorPointer' style={{ backgroundColor: '#067FAA', color: '#fff', borderBottom: '3px solid #067FAA'  }} align="center" onClick={()=>{this.props.history.push(config.OPERATIONREPORTS)}}><span> {'MORE >>'} </span></TableCell>
                                                                    </TableRow>
                                                                </TableFooter>
                                                            </Table>
                                                        </TableContainer>
                                                    </Paper>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Row>
                                                        <Col>
                                                            <Card style={{ border: '0px', backgroundColor: '#04384C', color: '#067FAA', padding: '5px' }}>
                                                                <Card.Header style={{ textAlign: 'center', border: '0px', backgroundColor: 'rgba(0,0,0,0)' }}>
                                                                    ACKNOWLEDGEMENTS
                                                                </Card.Header>
                                                                <Row>
                                                                    <Col xs={12} xl={6}>
                                                                        <ELogAcknowledgement ack='chiefEngineer' values={values.chiefEngineer} touched={touched} errors={errors} handleChange={handleChange} unlock={unlockChiefEngineerSignature}/>
                                                                    </Col>
                                                                    <Col xs={12} xl={6}>
                                                                        <ELogAcknowledgement ack='captain' values={values.captain} touched={touched} errors={errors} handleChange={handleChange} unlock={unlockCaptainSignature}/>
                                                                    </Col>
                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                    </Row>    
                                                </Col>    
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                )
            }
        }
                </Formik>
                )

    }
    render() {
        if (this.props.user.loading) {
            return (<FullScreenSpinner />)
        }
        return(
            <div>
                {!this.props.engineLogTableLoaded && <FullScreenSpinner />}
                {this.props.engineLogTableLoaded && this.renderForm()}

            </div>
        );
    }
}

export default withRouter(withAuthManager(withMessageManager(withLayoutManager(withEngineLog(ELogTable)))));