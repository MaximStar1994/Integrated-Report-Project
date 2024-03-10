import React, {Component} from 'react';
import './HealthCheck.css';
import HealthCheckApi123 from '../../model/HealthCheck';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner';
import moment from 'moment';
import config from '../../config/config';
import { withAuthManager } from '../../Helper/Auth/auth';

const IsEmpty = val => {
    return val == undefined || val == null || val.toString() == '' || (val instanceof Array && val.length===0) || val ==={}
}
class HealthCheck extends Component {
    constructor(){
        super();
        this.healthCheck = new HealthCheckApi123();
        this.state={
            health: {},
            loaded: false,
            showModal: false,
            modalTitle: '',
            modalData: []
        }
    }
    async getData(){
        this.setState({ loaded: false })
        try{
            let temp = await this.healthCheck.GetHealthCheck();
            this.setState({ health: {...temp}, loaded: true });
        }
        catch(e){
            console.log(e);
            this.props.setMessages([{type : "danger", message : "Unable to load Unlock App! No internet!"}]);
            this.props.history.push('/assetmanagement');
        }

    }
    onVesselChange(vesselId){
        this.setState({ activeVesselId: vesselId });
    }
    componentDidMount(){
        this.getData();
    }
    render(){
        return(
            this.state.loaded===true?
            <Container fluid className='HealthCheck'>
                <Row>
                    <Col style={{ padding: '0px' }}>
                        <div className='HealthCheckHeaderBase'>
                            <div  className="HealthCheckHeaderBackground">
                                <div className="HealthCheckHeading">
                                Health Check
                                </div>
                            </div>
                        </div> 
                    </Col>
                </Row>
                <Row className="HealthCheckMain">
                    <Col>
                        <Row style={{ marginTop: '10px', padding: "5px" }}>
                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                                Module / App
                            </Col>
                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                                Last Update
                            </Col>
                            <Col style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                Status
                            </Col>
                        </Row>
                        {Object.entries(this.state.health).map(([key, val])=>{
                                return(
                                    <Row key={key} className="cursorPointer" style={{ marginTop: '10px', border: "3px solid #9b9595", borderRadius: "30px", padding: "5px" }}  onClick={()=>{
                                        val.formCounts.sort((a, b) => moment(b.reportDate, 'DD-MM-YYYY').diff(moment(a.reportDate, 'DD-MM-YYYY')));
                                        this.setState({ showModal: true, modalData: val.formCounts, modalTitle: val.name });
                                    }}>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            {val.name}
                                        </Col>
                                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                                            {IsEmpty(val.lastUpdate)?'':moment(val.lastUpdate).format('DD-MM-YYYY hh:mm:ss A')}
                                        </Col>
                                        <Col style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                            <div style={{ height: '40px', width: '40px', borderRadius: '50%', backgroundColor: val.reportsGenerated===true?config.KSTColors.GREENDOT:config.KSTColors.REDDOT }} />
                                        </Col>
                                    </Row>
                                )
                        })}
                    </Col>
                </Row>
                <Row className="HealthCheckMain">
                    *No last updated date is available for Vessel Downtime Record Form and Crew Planning as it is not recorded during the usage of these apps.<br /><br />
                    *No testing is done for Crew Planning as no pdf is generated.
                </Row>
                <Modal size="lg" show={this.state.showModal} onHide={()=>this.setState({ showModal: false, modalData: [], modalTitle: '' })}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row style={{ marginTop: '10px', padding: "5px" }}>
                            <Col style={{ display: 'flex' }}>
                                Date
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                Submissions
                            </Col>
                            {(this.state.modalTitle==='Daily Log'||this.state.modalTitle==='Vessel Report Form')&&<Col style={{ display: 'block', alignItems: 'center' }}>
                                Missing Submissions
                            </Col>}
                        </Row>
                        {Object.entries(this.state.modalData).map(([key, val])=>{
                            return(
                                <Accordion key={key}>
                                    <AccordionSummary>
                                        <Row style={{ width: '100%', color: config.KSTColors.MAIN }}>
                                            <Col style={{ display: 'flex' }}>
                                                {val.reportDate}
                                            </Col>
                                            <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                                {val.submissions}
                                            </Col>
                                            {val.vessels!==undefined&&val.vessels!==null&&<Col style={{ display: 'block', alignItems: 'center', color: 'red' }}>
                                                {this.props.user.vesselList.map(e=>val.vessels.findIndex(ve=>ve.vesselId===e.vessel_id)===-1&&e.vessel_id!=='0'?<div>{e.name}</div>:'')}
                                            </Col>}
                                        </Row>
                                    </AccordionSummary>
                                    <AccordionDetails style={{ display: 'block' }}>
                                        {val.vessels!==undefined&&val.vessels!==null&&val.vessels.map((e, i)=>(
                                            <Row key={i}  style={{ width: '100%' }}>
                                                <Col>
                                                    {e.name}
                                                </Col>
                                                <Col>
                                                    {e.submissions}
                                                </Col>
                                            </Row>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="danger" onClick={()=>this.setState({ showModal: false, modalData: [], modalTitle: '' })}>
                        X Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            :
            <FullScreenSpinner text={"Loading..."}/>
        );
    }

}

export default withRouter(withAuthManager(withMessageManager(HealthCheck)));