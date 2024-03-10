import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {withLayoutManager} from '../../Helper/Layout/layout'

import AssetHealthCard from "./AssetHealthCard"
import RigDurationCard from "./RigDurationCard"
import EnvironmentCard from "./EnvironmentStatusCard"
import '../../css/App.css';
import '../../css/Dashboard.css';

import Tag from '../../model/Tag.js'
import HealthProjectionCard from './HealthProjectionCard';
import WorkOrderCompletionCard from './WorkOrderCompletionCard';
import ActiveAlarmCard from './ActiveAlarmCard';
import FuelConsumptionCard from './FuelConsumptionCard';
import RigElevationCard from './RigElevationStatusCard';
import ClassSurveyCard from './ClassSurveyCard';

class MainDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            organization : "-",
            project : "-",
            renderFor : props.renderFor,
        };
        this.tagController = new Tag()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.renderFor !== state.renderFor) {
            state.renderFor = props.renderFor
            return state
        } else {
            return null
        }
    }

    renderLG() {
        return(
           <>
           <Row>
               <Col xs={4}>
                   <AssetHealthCard />
               </Col>
               <Col xs={4} style={{display : "flex", flexDirection : "column"}}>
                   <RigDurationCard />
               </Col>
               <Col xs={4} style={{display : "flex", flexDirection : "column"}}>
                   <EnvironmentCard />
               </Col>
           </Row>
           <Row style={{marginTop : "15px"}}>
               <Col xs={4}>
                   <Row noGutters={true} style={{height : "100%"}}>
                       <Col xs={6} style={{paddingRight:"5px"}}>
                           <HealthProjectionCard />
                       </Col>
                       <Col xs={6} style={{paddingLeft:"5px"}}>
                           <WorkOrderCompletionCard />
                       </Col>
                   </Row>
               </Col>
               <Col xs={4} style={{display : "flex", flexDirection : "column"}}>
                    <Row noGutters={true} style={{height : "100%"}}>
                       <Col xs={6} style={{paddingRight:"5px"}}>
                           <ActiveAlarmCard />
                       </Col>
                       <Col xs={6} style={{paddingLeft:"5px"}}>
                           <FuelConsumptionCard />
                       </Col>
                   </Row>
               </Col>
               <Col xs={4} style={{display : "flex", flexDirection : "column"}}>
                    <Row noGutters={true} style={{height : "100%"}}>
                       <Col xs={6} style={{paddingRight:"5px"}}>
                           <RigElevationCard />
                       </Col>
                       <Col xs={6} style={{paddingLeft:"5px"}}>
                           <ClassSurveyCard />
                       </Col>
                   </Row>
               </Col>
           </Row>
           </>
        )
    }
    renderMD() {
        return (
            <>
            <Row style={{height : "35vh"}}>
                <Col xs={8} style={{display : "flex", flexDirection : "column"}}>
                   <RigDurationCard />
                </Col>
                <Col xs={4}>
                    <Row style={{height : "45%"}}>
                        <Col>
                            <FuelConsumptionCard />
                        </Col>
                    </Row> 
                    <Row style={{height : "50%", marginTop : "5%"}}>
                        <Col>
                            <ActiveAlarmCard />
                        </Col>
                    </Row> 
                </Col>
            </Row>
            <Row style={{ marginTop : "10px"}}>
                <Col xs={6}>
                    <Row>
                        <Col>
                            <AssetHealthCard />
                        </Col>
                    </Row>
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col>
                            <EnvironmentCard />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={3}>
                    <HealthProjectionCard />
                </Col>
                <Col xs={3}>
                    <WorkOrderCompletionCard />
                </Col>
                <Col xs={3}>
                    <RigElevationCard />
                </Col>
                <Col xs={3}>
                    <ClassSurveyCard />
                </Col>
            </Row>
            </>
        )
    }
    renderSM(){
        return (
            <>
            <Row>
                <Col xs={12} style={{display : "flex", flexDirection : "column"}}>
                   <RigDurationCard />
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={6}>
                    <Row style={{height : "100%"}}>
                        <Col>
                            <FuelConsumptionCard />
                        </Col>
                    </Row> 
                    
                </Col>
                <Col xs={6}>
                    <Row style={{height : "100%"}}>
                        <Col>
                            <ActiveAlarmCard />
                        </Col>
                    </Row> 
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={12} style={{display : "flex", flexDirection : "column"}}>
                   <AssetHealthCard />
                </Col>
            </Row>
            <Row style={{height : "25vh", marginTop : "10px"}}>
                <Col xs={6}>
                    <Row style={{height : "100%"}}>
                        <Col>
                            <HealthProjectionCard />
                        </Col>
                    </Row> 
                    
                </Col>
                <Col xs={6}>
                    <Row style={{height : "100%"}}>
                        <Col>
                            <WorkOrderCompletionCard />
                        </Col>
                    </Row> 
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={12} style={{display : "flex", flexDirection : "column"}}>
                   <EnvironmentCard />
                </Col>
            </Row>
            <Row style={{height : "25vh", marginTop : "10px"}}>
                <Col xs={6}>
                    <Row style={{height : "100%"}}>
                        <Col>
                            <RigElevationCard />
                        </Col>
                    </Row> 
                    
                </Col>
                <Col xs={6}>
                    <Row style={{height : "100%"}}>
                        <Col>
                            <ClassSurveyCard />
                        </Col>
                    </Row> 
                </Col>
            </Row>
            </>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.state.renderFor === 1) {
            contents = this.renderMD()
        }
        if (this.state.renderFor === 2) {
            contents = this.renderSM()
        }
        return (
            <div className="content-inner-all">
            <Container fluid={true}>
                {contents}
            </Container>
            </div>)
    }
}

export default withLayoutManager(MainDashboard);
