import React from 'react'
import { Row, Col, Tab, Nav } from 'react-bootstrap'
import { Button } from '@material-ui/core';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'

import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'

import { withRouter } from "react-router-dom"
import { Formik } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import './ELog.css'

import {ELogTitleAndLabels, ELogDatastructure} from './ELogDataset';
import ELogTab from './ELogTab';

import { withEngineLog } from './ELogContext'; 

const timeIntervalValue = {
    1: '0001 - 0400',
    2: '0401 - 0800',
    3: '0801 - 1200',
    4: '1201 - 1600',
    5: '1601 - 2000',
    6: '2001 - 0000',
}

class ELogEditForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            todayDate: '',
            showSaveSpinner: false,
            autoFillSpinner: false,
            autoFillOnline: false,
        };
        this.validationSchema = Yup.object().shape({
        });
        this.labelProps={style : {color : "white"}}
    }
    componentDidMount() {
        let tempData = null
        tempData = {
            todayDate: moment().format()
        };
        if(!this.props.engineLogLoaded)
            this.props.getEngineLog();
        this.setState({ ...tempData });
            this.setState({ autoFillOnline: true });
    }
    componentWillUnmount(){
        this.props.resetEngineLog();
    }

    renderForm() {
        return (
            <Formik
            initialValues={this.props.engineLog.logs.filter(elog=>`${elog.timeInterval}`===`${this.props.match.params.id}`)[0]}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                this.setState({ showSaveSpinner: true });
                values.isSaved = true;
                this.props.saveEngineLog(values, (result, err) => {
                    this.setState({ showSaveSpinner: false });
                    if(!err){
                        this.props.setMessages([{type : "success", message : "Saved!"}]);
                        this.props.history.push('/elogtable');
                    }
                    else{
                        this.props.setMessages([{type : "danger", message : "Unable to save!"}]);
                    }
                });
            }}
            >
                {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=>{ 
                    return( 
                        <Form onSubmit={handleSubmit} className="mx-auto">
                            <Row style={{ padding: '20px', margin: '10px' }}>
                                <Col>
                                    <Row style={{ color: '#067FAA', fontSize: '1.2em', paddingBottom: '15px' }}>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ marginRight: 'auto', visibility: 'hidden' }}></div>
                                            <div style={{ fontSize: '1.4rem' }}>
                                                {timeIntervalValue[this.props.match.params.id]}, {moment(this.state.todayDate).format('DD MMM YYYY').toUpperCase()}
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                {/* <div style={{ padding: '5px', backgroundColor: '#032a39', borderRadius: '5px', display: 'inline-block', marginRight: '10px', alignItems: 'center' }}>
                                                    <div className={this.state.autoFillOnline? 'ELogAutofillActiveDot' : 'ELogAutofillInActiveDot'} />
                                                    <Button variant="contained" color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '10px', paddingRight: '10px' }} 
                                                    onClick={autoFill} 
                                                    disabled={this.state.autoFillSpinner}> 
                                                        {this.state.autoFillSpinner?<Spinner animation="border" variant="light" size='sm' />: ' '} Auto Fill
                                                    </Button>                                                    
                                                </div> */}
                                                <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} disabled={this.state.showSaveSpinner}> 
                                                {this.state.showSaveSpinner?<Spinner animation="border" variant="light" size='sm' />: ' '} Save
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{ backgroundColor: '#04384C', padding: '20px' }}>
                                        <Col>
                                            <Row>
                                                <Col xs={12}>
                                                    <Tab.Container defaultActiveKey={ELogTitleAndLabels[Object.keys(ELogTitleAndLabels)[0]]['title']} transition={false} id="elogTabs" className='ELogEditTabs'>
                                                        <Row>
                                                            <Col xs={2}>
                                                                <Nav variant="pills" className="flex-column" style={{ marginTop: '20px', paddingRight: '5px' }}>
                                                                    {
                                                                        Object.keys(ELogTitleAndLabels).map(row => 
                                                                            <Nav.Item key={row} className={'ELogNavLink'}>
                                                                                <Nav.Link eventKey={ELogTitleAndLabels[row]['title']}>
                                                                                    {ELogTitleAndLabels[row]['title']}
                                                                                </Nav.Link>
                                                                            </Nav.Item>
                                                                        )
                                                                    }
                                                                </Nav>
                                                            </Col>
                                                            <Col xs={10}>
                                                                <Tab.Content>
                                                                    {
                                                                        Object.keys(ELogTitleAndLabels).map(row => 
                                                                            <Tab.Pane key={row} eventKey={ELogTitleAndLabels[row]['title']} title={ELogTitleAndLabels[row]['title']}>
                                                                                <ELogTab data={values[row]} meta={ELogTitleAndLabels[row]} handleChange={handleChange}/>
                                                                            </Tab.Pane>
                                                                        )
                                                                    }
                                                                </Tab.Content>
                                                            </Col>
                                                        </Row>
                                                    </Tab.Container>
                                                </Col>    
                                            </Row>
                                            <Row>
                                                <Col style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                    
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
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
                {!this.props.engineLogLoaded && <FullScreenSpinner />}
                {this.props.engineLogLoaded && this.renderForm()}

            </div>
        );
    }
}

export default withRouter(withMessageManager(withLayoutManager(withEngineLog(ELogEditForm))));