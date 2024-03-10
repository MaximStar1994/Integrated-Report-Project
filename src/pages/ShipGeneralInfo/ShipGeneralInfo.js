import React from 'react'
import { Container, Row, Col, Card, Table, Form, FormControl, Spinner, Tab, Nav } from 'react-bootstrap'
import { Button, TextField } from '@material-ui/core';

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import { withAuthManager } from '../../Helper/Auth/auth'

import { withRouter } from "react-router-dom"
import { Formik, FieldArray, getIn} from "formik";
import * as Yup from "yup";

import { mainInfo1, mainInfo1Header, mainDieselEngine, mainDieselEngineHeader, generator, generatorHeader, azimuthThruster, azimuthThrusterHeader, eMotor, eMotorHeader } from './ShipGeneralInfoData'
import './ShipGeneralInfo.css'

import FuelLng from '../../model/FuelLng';
import config from '../../config/config';

const masterAndOfficersHeader = [ 'grade', 'name', 'datePortJoined', 'datePortDisembarked' ];

const masterAndOfficersTemplate = { 'grade': '', 'name': '', 'datePortJoined': '', 'datePortDisembarked': '' };
const officersAndCrewTemplate = { 'deckOfficer': 0, 'engineOfficer': 0, 'deckCrew': 0, 'engineCrew': 0, 'cateringCrew': 0 };

class ShipGeneralInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loaded: false,
            masterAndOfficers: [],
            officersAndCrew: officersAndCrewTemplate
        };
        this.validationSchema = Yup.object().shape({
            masterAndOfficers : Yup.array().of(
                Yup.object().shape({
                    grade: Yup.string().required("Please Enter Grade"),
                    name: Yup.string().required("Please Enter Name"),
                    datePortJoined: Yup.string().required("Please Enter Date/ Port Joined"),
                    datePortDisembarked: Yup.string(),
                    officerId : Yup.number()
                })
            ),
            officersAndCrew : Yup.object().shape({
                deckOfficer : Yup.number(),
                engineOfficer : Yup.number(),
                deckCrew : Yup.number(),
                engineCrew : Yup.number(),
                cateringCrew : Yup.number(),
            })
        });
        this.labelProps={style : {color : "white"}}
        this.fuelngApi = new FuelLng();
    }
    componentDidMount() {
        var queries = 2
        this.fuelngApi.ListCrewInfo((crewInfo, err) => {
            if(!err){
                var officersAndCrew = {
                    deckOfficer : crewInfo.officer.deck,
                    engineOfficer : crewInfo.officer.engine,
                    deckCrew : crewInfo.crew.deck,
                    engineCrew : crewInfo.crew.engine,
                    cateringCrew : crewInfo.crew.catering,
                }
                queries -= 1
                if (queries == 0) {
                    this.setState({ loaded: true, officersAndCrew : officersAndCrew});
                } else {
                    this.setState({ officersAndCrew : officersAndCrew});
                }
            }
            else{
                this.props.setMessages([{type : "danger", message : "No Internet! Please try later."}]);
                this.props.history.push(`/operation`)
            }
        })
        this.fuelngApi.ListOfficers((officers, err) => {
            if(!err){
                queries -= 1
                if (queries == 0) {
                    this.setState({ loaded: true, masterAndOfficers: officers});
                } else {
                    this.setState({ masterAndOfficers: officers });
                }
            }
            else{
                this.props.setMessages([{type : "danger", message : "No Internet! Please try later."}]);
                this.props.history.push(`/operation`)
            }
        })
    }
    renderForm() {
        let init = { ...this.state };
        delete init.loaded;
        let initialValue = {
            masterAndOfficers : this.state.masterAndOfficers,
            officersAndCrew : this.state.officersAndCrew,
        }
        if (!this.state.loaded) {
            return (<FullScreenSpinner/>)
        }
        return (
            <Formik
            initialValues={initialValue}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                var queries = 2
                this.fuelngApi.PostOfficers(values.masterAndOfficers, () => {
                    queries -= 1
                    if (queries == 0) {
                        setSubmitting(false)
                    }
                })
                var crewInfo = {
                    officer : {
                        deck : values.officersAndCrew.deckOfficer,
                        engine : values.officersAndCrew.engineOfficer
                    },
                    crew : {
                        deck :  values.officersAndCrew.deckCrew,
                        engine :  values.officersAndCrew.engineCrew,
                        catering :  values.officersAndCrew.cateringCrew
                    }
                }
                this.fuelngApi.UpdateCrewInfo(crewInfo, () => {
                    queries -= 1
                    if (queries == 0) {
                        setSubmitting(false)
                    }
                })
            }}
            >
                {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=>{
                    return( 
                        <Form onSubmit={handleSubmit} className="mx-auto">
                            <Row style={{ padding: '20px' }}>
                                <Col>
                                    <Row style={{ color: '#067FAA', fontSize: '1.2em', paddingBottom: '15px' }}>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            
                                            <div style={{ marginRight: 'auto', visibility: 'hidden' }}></div>
                                            <div style={{ fontSize: '1.4rem' }}>
                                                Ship General Information
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} disabled={isSubmitting|| !this.props.user.apps.includes(config.apps.OPERATION)}> 
                                                {isSubmitting?<Spinner animation="border" variant="light" size='sm' />: ' '} Save
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '4px solid #04384c'}}>
                                    <Card.Body style={{ border: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                                    <Tab.Container defaultActiveKey="ShipParticulars" transition={false} id="shipGeneralInfoTabs" className='ShipGeneralInfoEditTabs'>
                                        <Row>
                                            <Col xs={2}>
                                                <Nav variant="pills" className="flex-column" style={{ marginTop: '20px', paddingRight: '5px' }}>
                                                    <Nav.Item className={'ShipGeneralInfoNavLink'}><Nav.Link eventKey="ShipParticulars">Ship's Particulars</Nav.Link></Nav.Item>
                                                    <Nav.Item className={'ShipGeneralInfoNavLink'}><Nav.Link eventKey="ListOfMasterAndOfficers">List Of Master And Officers</Nav.Link></Nav.Item>
                                                    <Nav.Item className={'ShipGeneralInfoNavLink'}><Nav.Link eventKey="NumberOfOfficersAndCrewExcludingMaster">Number Of Officers And Crew Excluding Master</Nav.Link></Nav.Item>
                                                </Nav>
                                            </Col>
                                            <Col xs={10}>
                                                <Tab.Content>
                                                    <Tab.Pane eventKey="ShipParticulars" title="Ship's Particulars">
                                                        <div style={{ borderLeft: '5px solid #04384c' }}>
                                                            <div style={{ fontSize: '1.4rem', padding: '10px', textAlign: 'center' }}>Ship's Particulars</div>
                                                            <Row>
                                                                <Col xs={6}>
                                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', padding: '10px' }}>
                                                                        <div style={{ fontSize: '1rem', padding: '10px', border: '2px solid #067FAA' }}>
                                                                            {Object.keys(mainInfo1).map( (key, idx) => (
                                                                                <React.Fragment key={idx}>
                                                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                                                                                        <Card.Body style={idx===Object.keys(mainInfo1).length-1?{ padding: '0px 0px 0px 0px', verticalAlign: 'center' }: { padding: '0px 0px 7px 0px', verticalAlign: 'center' }} >
                                                                                            <Row>
                                                                                                <Col xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                    {mainInfo1Header[key]}
                                                                                                </Col>
                                                                                                <Col>
                                                                                                    <div style={{ display:"flex", alignItems:'center' }}>
                                                                                                        <span style={{ width: '100%', backgroundColor: '#04384C', padding: '5px', minHeight: '1.4rem', color: '#067FAA', fontSize: '1.2rem', lineHeight: '1.2' }}>
                                                                                                            {mainInfo1[key]}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                </React.Fragment>
                                                                            ))}
                                                                        </div>
                                                                    </Card>
                                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', padding: '10px'}}>
                                                                        <div style={{ border: '2px solid #067FAA', marginTop: '10px' }}>
                                                                            <div style={{ fontSize: '1.4rem', padding: '10px' }}>Azimuth Thruster</div>
                                                                            <div style={{ fontSize: '1rem', padding: '10px' }}>
                                                                                {Object.keys(azimuthThruster).map( (key, idx) => (
                                                                                    <React.Fragment key={idx}>
                                                                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                                                                                            <Card.Body style={idx===Object.keys(azimuthThruster).length-1?{ padding: '0px 0px 0px 0px', verticalAlign: 'center' }: { padding: '0px 0px 7px 0px', verticalAlign: 'center' }} >
                                                                                                <Row>
                                                                                                    <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        {azimuthThrusterHeader[key]}
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <div style={{ display:"flex", alignItems:'center' }}>
                                                                                                            <span style={{ width: '100%', backgroundColor: '#04384C', padding: '5px', minHeight: '1.4rem', color: '#067FAA', fontSize: '1.2rem', lineHeight: '1.2' }}>
                                                                                                                {azimuthThruster[key]}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </Card.Body>
                                                                                        </Card>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>    
                                                                <Col xs={6}>
                                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', padding: '10px'}}>
                                                                        <div style={{ border: '2px solid #067FAA' }}>
                                                                            <div style={{ fontSize: '1.4rem', padding: '10px' }}>Main Diesel Engine</div>
                                                                            <div style={{ fontSize: '1rem', padding: '10px' }}>
                                                                                {Object.keys(mainDieselEngine).map( (key, idx) => (
                                                                                    <React.Fragment key={idx}>
                                                                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                                                                                            <Card.Body style={idx===Object.keys(mainDieselEngine).length-1?{ padding: '0px 0px 0px 0px', verticalAlign: 'center' }: { padding: '0px 0px 7px 0px', verticalAlign: 'center' }} >
                                                                                                <Row>
                                                                                                    <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        {mainDieselEngineHeader[key]}
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <div style={{ display:"flex", alignItems:'center' }}>
                                                                                                            <span style={{ width: '100%', backgroundColor: '#04384C', padding: '5px', minHeight: '1.4rem', color: '#067FAA', fontSize: '1.2rem', lineHeight: '1.2' }}>
                                                                                                                {mainDieselEngine[key]}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </Card.Body>
                                                                                        </Card>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '2px solid #067FAA', marginTop: '10px' }}>
                                                                            <div style={{ fontSize: '1.4rem', padding: '10px' }}>Generator</div>
                                                                            <div style={{ fontSize: '1rem', padding: '10px' }}>
                                                                                {Object.keys(generator).map( (key, idx) => (
                                                                                    <React.Fragment key={idx}>
                                                                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                                                                                            <Card.Body style={idx===Object.keys(generator).length-1?{ padding: '0px 0px 0px 0px', verticalAlign: 'center' }: { padding: '0px 0px 7px 0px', verticalAlign: 'center' }} >
                                                                                                <Row>
                                                                                                    <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        {generatorHeader[key]}
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <div style={{ display:"flex", alignItems:'center' }}>
                                                                                                            <span style={{ width: '100%', backgroundColor: '#04384C', padding: '5px', minHeight: '1.4rem', color: '#067FAA', fontSize: '1.2rem', lineHeight: '1.2' }}>
                                                                                                                {generator[key]}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </Card.Body>
                                                                                        </Card>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        <div style={{ border: '2px solid #067FAA', marginTop: '10px' }}>
                                                                            <div style={{ fontSize: '1.4rem', padding: '10px' }}>E-Motor (Azimuth Thruster)</div>
                                                                            <div style={{ fontSize: '1rem', padding: '10px' }}>
                                                                                {Object.keys(eMotor).map( (key, idx) => (
                                                                                    <React.Fragment key={idx}>
                                                                                        <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px'}}>
                                                                                            <Card.Body style={idx===Object.keys(eMotor).length-1?{ padding: '0px 0px 0px 0px', verticalAlign: 'center' }: { padding: '0px 0px 7px 0px', verticalAlign: 'center' }} >
                                                                                                <Row>
                                                                                                    <Col xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        {eMotorHeader[key]}
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <div style={{ display:"flex", alignItems:'center' }}>
                                                                                                            <span style={{ width: '100%', backgroundColor: '#04384C', padding: '5px', minHeight: '1.4rem', color: '#067FAA', fontSize: '1.2rem', lineHeight: '1.2' }}>
                                                                                                                {eMotor[key]}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </Card.Body>
                                                                                        </Card>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </Col>    
                                                            </Row>
                                                        </div>
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="ListOfMasterAndOfficers" title="List Of Master And Officers">
                                                        <FieldArray
                                                            name="masterAndOfficers"
                                                            render={arrayHelpers => (
                                                            <Row>
                                                                <Col xs={12}>
                                                                    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', padding: '10px', borderLeft: '5px solid #04384c' }}>
                                                                        <div style={{ fontSize: '1.4rem', padding: '10px', textAlign: 'center' }}>List Of Master And Officers</div>
                                                                        <Table responsive className='DeckLogTable'>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th key={1} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                                                    <th key={2} colSpan={1} style={{ borderBottom: '0px' }}></th>
                                                                                    <th key={3} colSpan={2}>Date / Port</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th key={0} style={{ borderTop: '0px' }}>Grade</th>
                                                                                    <th key={1} style={{ borderTop: '0px' }}>Name</th>
                                                                                    <th key={2}>Joined</th>
                                                                                    <th key={3}>Disembarked</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {values.masterAndOfficers.map((row, idx)=>(
                                                                                    <tr key={idx}>
                                                                                        {masterAndOfficersHeader.map((col, index) => (
                                                                                            <td key={`${idx}-${col}`}>
                                                                                                {<TextField
                                                                                                    type='text'
                                                                                                    variant = 'outlined'
                                                                                                    className={"ShipGeneralLogInput"}
                                                                                                    defaultValue={row[col]}
                                                                                                    onBlur={handleChange}
                                                                                                    error={(getIn(touched,`masterAndOfficers[${idx}].${col}`) && getIn(errors,`masterAndOfficers[${idx}].${col}`)) != undefined}
                                                                                                    helperText={(getIn(touched,`masterAndOfficers[${idx}].${col}`) && getIn(errors,`masterAndOfficers[${idx}].${col}`))}
                                                                                                    name={`masterAndOfficers[${idx}].${col}`}
                                                                                                    disabled={!this.props.user.apps.includes(config.apps.OPERATION)}
                                                                                                />}
                                                                                            </td>
                                                                                        ))}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                        <Row>
                                                                            <Col>
                                                                                <Button variant="contained" color="primary" onClick={()=> {
                                                                                    arrayHelpers.push(masterAndOfficersTemplate)
                                                                                }} 
                                                                                disabled={!this.props.user.apps.includes(config.apps.OPERATION)}
                                                                                style={{ backgroundColor: 'rgba(5, 100, 255, 100)', width: '100%' }}>+ Add Row</Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                            )}>
                                                        </FieldArray>
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="NumberOfOfficersAndCrewExcludingMaster" title="Number Of Officers And Crew Excluding Master">
                                                        <Row>
                                                            <Col xs={12}>
                                                                <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032A39', borderRadius: '0px', border: '0px', padding: '10px', borderLeft: '5px solid #04384c' }}>
                                                                    <div style={{ fontSize: '1.4rem', padding: '10px', textAlign: 'center' }}>Number Of Officers And Crew Excluding Master</div>
                                                                    <Table responsive className='DeckLogTable'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th key={1} colSpan={2}>Officers</th>
                                                                                <th key={2} colSpan={3}>Crew</th>
                                                                            </tr>
                                                                            <tr>
                                                                                <th key={0}>Deck</th>
                                                                                <th key={1}>Engine</th>
                                                                                <th key={2}>Deck</th>
                                                                                <th key={3}>Engine</th>
                                                                                <th key={4}>Catering</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                {Object.keys(values.officersAndCrew).map((col, index) => (
                                                                                    <td key={`${col}`}>
                                                                                        {<TextField
                                                                                            type='number'
                                                                                            variant='outlined'
                                                                                            value={values.officersAndCrew[`${col}`]}
                                                                                            onChange={handleChange}
                                                                                            name={`officersAndCrew.${col}`}
                                                                                            className={"ShipGeneralLogInput"}
                                                                                            error={getIn(touched,`officersAndCrew.${col}`) && getIn(errors,`officersAndCrew.${col}`)}
                                                                                            helperText={getIn(touched,`officersAndCrew.${col}`) && getIn(errors,`officersAndCrew.${col}`)}
                                                                                            disabled={!this.props.user.apps.includes(config.apps.OPERATION)}
                                                                                        />}
                                                                                    </td>
                                                                                ))}
                                                                            </tr>
                                                                        </tbody>
                                                                    </Table>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Col>
                                        </Row>
                                    </Tab.Container>
                                    </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    )
                }}
            </Formik>
        )
    }
    render() {
        return(
            <div style={{ fontSize: '14px' }}>
                {!this.state.loaded && <FullScreenSpinner />}
                {this.state.loaded && this.renderForm()}

            </div>
        );
    }
}

export default withRouter(withAuthManager(withMessageManager(withLayoutManager(ShipGeneralInfo))));