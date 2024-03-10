
import React, {Component} from 'react';
import './VesselDashboard.css';
import VesselDashboardApi from '../../../model/VesselDashboard';
import { Container, Row, Col } from 'react-bootstrap';

import {withMessageManager} from '../../../Helper/Message/MessageRenderer'
import { withRouter } from "react-router-dom"
import DailyPerformance from './DailyPerformance';
import FuelConsumption from './FuelConsumption';
import RemainOnBoard from './RemainOnBoard';
import RunningHoursRecord from './RunningHoursRecord';
import { withAuthManager } from '../../../Helper/Auth/auth';
import moment from 'moment';
// import FullScreenSpinner from '../../../components/FullScreenSpinner/FullScreenSpinner';
import DashboardSpinner from '../DashboardSpinner';

const showLNG = vesselId => {
    if(vesselId===10 || vesselId==='10' || vesselId===11 || vesselId==='11')
        return true;
    return false;
}
class VesselDashboard extends Component {
    constructor(){
        super();
        this.vesselDashboardApi = new VesselDashboardApi();
        this.state={
            loaded: false,
            isSubmit: false,
            dailyPerformance: {
                operation: null,
                proceed: null,
                standby: null
            },
            fuelConsumptionData: [],
            remainOnBoard: {
                fuelOil: null,
                freshWater: null,
                lubOils: []
            },
            runningHours: {
                engines: [],
                generators: []
            },
            lastRecordedDate: '',
            selectedVessel: {}
        }
    }
    async getData(id){
        let today = moment();
        if(moment().isBefore(
            moment().set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            today.subtract(1, 'day');
        }
        let data = await this.vesselDashboardApi.GetVesselDashboardData(id, today.format('DD-MM-YYYY'));
        this.setState({ dailyPerformance: data.dailyPerformance, remainOnBoard: data.remainOnBoard, runningHours: data.runningHours, fuelConsumptionData: data.fuelConsumptionData, lastRecordedDate: data.lastRecordedDate, loaded: true })
    }
    componentDidMount(){
        let selectedVesselData = this.props.selectedVessel;
        if(isNaN(selectedVesselData.vessel_id)===false && selectedVesselData.vessel_id!=='0'){
            this.getData(parseInt(selectedVesselData.vessel_id));
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.selectedVessel.vessel_id!==this.props.selectedVessel.vessel_id && this.props.selectedVessel.vessel_id!=='0'){
            this.setState({ loaded: false });
            this.getData(parseInt(this.props.selectedVessel.vessel_id));
        }
        if(this.props.selectedVessel.vessel_id==='0' && prevProps.selectedVessel.vessel_id!==this.props.selectedVessel.vessel_id){
            this.setState({ loaded: true });
        }
    }
    render(){
        return(
            <Container fluid className='VesselDashboard'>
                {this.state.loaded===true?
                    <React.Fragment>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#9B9595' }}>Last Recorded On: {this.state.lastRecordedDate}</div>
                        <Row>
                            <Col xs={12} lg={6} className="VesselDashboardCard">
                                <DailyPerformance data={this.state.dailyPerformance} />
                            </Col>
                            <Col xs={12} lg={6} className="VesselDashboardCard">
                                <FuelConsumption data={this.state.fuelConsumptionData} showLNG={showLNG(this.props.selectedVessel.vessel_id)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} lg={6} className="VesselDashboardCard">
                                <RemainOnBoard data={this.state.remainOnBoard} showLNG={showLNG(this.props.selectedVessel.vessel_id)} />
                            </Col>
                            <Col xs={12} lg={6} className="VesselDashboardCard">
                                <RunningHoursRecord data={this.state.runningHours} showLNG={showLNG(this.props.selectedVessel.vessel_id)} />
                            </Col>
                        </Row>
                    </React.Fragment>
                :
                    <DashboardSpinner />
                }
            </Container>
        );
    }

}

export default withAuthManager(withRouter(withMessageManager(VesselDashboard)));