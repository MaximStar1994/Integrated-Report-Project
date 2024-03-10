import React from 'react'
import { Row, Col, Card, FormControl } from 'react-bootstrap'
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

import { withEngineLog } from './ELogContext'; 

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
            initialValues={{remarks: this.props.engineLog.remarks}}
            validationSchema={this.validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                this.setState({ showSaveSpinner: true });
                this.props.saveRemarks(values.remarks, (result, err) => {
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
                                                {moment(this.state.todayDate).format('DD MMM YYYY').toUpperCase()}
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Button variant="contained" type={'submit'} color="primary" style={{ backgroundColor: 'rgba(5, 100, 255, 100)', paddingLeft: '30px', paddingRight: '30px' }} disabled={this.state.showSaveSpinner}> 
                                                {this.state.showSaveSpinner?<Spinner animation="border" variant="light" size='sm' />: ' '} Save
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{ backgroundColor: '#04384C', padding: '10px' }}>
                                        <Col>
                                            <Row>
                                                <Col xs={12}>
                                                    <Row>
                                                        <Card style={{ width: '100%', margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
                                                            <Card.Body style={{ border: '0px', paddingTop: '5px' }}>
                                                                <Row>
                                                                    <Col>
                                                                        <label style={{ fontSize: '1.4rem' }}> {'Remarks'}</label>   
                                                                        <FormControl
                                                                            as="textarea" 
                                                                            rows='5'
                                                                            id={'remarks'} 
                                                                            aria-describedby={'remarks'} 
                                                                            value={values.remarks===null?'':values.remarks}
                                                                            onChange={handleChange}
                                                                            name={'remarks'}
                                                                            className="InputBox"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Card.Body>
                                                        </Card>
                                                    </Row>
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