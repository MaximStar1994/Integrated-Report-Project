import React,{useState} from 'react';
import { Row, Modal,CloseButton } from 'react-bootstrap';
import CircularProgress from './CircularProgress';
import OperationIcon from '../../../assets/KST/Operation.png';
import ProceedIcon from '../../../assets/KST/Proceed.png';
import StandbyIcon from '../../../assets/KST/Standby.png';
import MaterialToolTip from '@material-ui/core/Tooltip';
import InfoIcon from "@material-ui/icons/Info";
import Config from "../../../config/config";
import { withAuthManager } from '../../../Helper/Auth/auth';
import {withMessageManager} from '../../../Helper/Message/MessageRenderer'
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import FleetDashboardApi from '../../../model/FleetDashboard';

const DailyPerformance = props => {
    const fleetDashboardApi = new FleetDashboardApi();
    const [marinemModalOpen, setMarinemModalOpen] = useState(false);
    const [marinemList, setMarinemList] = useState([]);
    const [marinemModalInfo,setMarinemModalInfo] = useState("Loading Data...");

    const fleetPerformanceInfo = async () => {
        try {
            setMarinemModalOpen(true); 
            var lastFiveMarinemData = await fleetDashboardApi.GetFleetDashboardLastFiveMarinemData();
            if (lastFiveMarinemData && lastFiveMarinemData.length === 0 ) {
                setMarinemModalInfo("NO DATA AVAILABLE TO SHOW");
            }
            setMarinemList(lastFiveMarinemData);
        } catch (err) {
            props.setMessages([{ type: 'danger', message: err}]);
            setMarinemModalOpen(false); 
        }
    };
    
    return (
        <React.Fragment>
            <div className="Heading">
                <div style={{ display: "flex", flexGrow: "1" }}>Fleet Daily Performance ({props.data.date})</div><MaterialToolTip title="Performance Trend" placement="bottom"><InfoIcon onClick={() => fleetPerformanceInfo()} style={{ cursor: 'pointer', width: '2.5rem', height: '2.5rem', color: Config.KSTColors.MAIN }} /></MaterialToolTip>
            </div>
            <Row style={{ display: 'flex' }}>
                <CircularProgress d={31.831} percent={props.data.deploy === 0 ? props.data.deploy : ((props.data.deploy / props.data.total) * 100).toFixed(2)} color="#8054BD" heading={"Deploy-Move"} />
                <CircularProgress d={31.831} percent={props.data.move === 0 ? props.data.move : ((props.data.move / props.data.total) * 100).toFixed(2)} color="#6985C4" heading={"Move-Arrive"} />
                <CircularProgress d={31.831} percent={props.data.arrive === 0 ? props.data.arrive : ((props.data.arrive / props.data.total) * 100).toFixed(2)} color="#A3CED6" heading={"Arrive-Start"} />
                <CircularProgress d={31.831} percent={props.data.start === 0 ? props.data.start : ((props.data.start / props.data.total) * 100).toFixed(2)} color="#7DF558" heading={"Start-End"} />
                <CircularProgress d={31.831} percent={props.data.end === 0 ? props.data.end : ((props.data.end / props.data.total) * 100).toFixed(2)} color="#3A336F" heading={"End-wait"} />
            </Row>
            <Modal size="xl" show={marinemModalOpen} onHide = {() => setMarinemModalOpen(false)} aria-labelledby="MarineM" centered>
                <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
                    <Modal.Title id="MarinemData">Last 5 Days Performance Trend</Modal.Title>
                    <CloseButton style={{fontSize: "2.5rem"}} onClick={() => setMarinemModalOpen(false)}/>
                </Modal.Header>
                <Modal.Body>
                    {
                      marinemList.length === 0 ?
                        <span style={{ fontSize: "1rem" }}>{marinemModalInfo}</span> : 
                        <div style={{maxWidth: "80vw",height: "60vh"}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={marinemList} margin={{top: 5,bottom: 5,left: 5,right: 50}}> 
                                    <XAxis dataKey="date" reversed />
                                    <YAxis label={{ value: "(Percentage)", angle: -90, position: 'insideLeft', fill: '#9B9595' }} domain={[0,100]}/>
                                    <Tooltip />
                                    <Legend />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Line type="monotone" activeDot={{r:8}} dataKey="deploy" stroke="#8054BD" strokeWidth={3} />
                                    <Line type="monotone" activeDot={{r:8}} dataKey="move" stroke="#6985C4" strokeWidth={3}/>
                                    <Line type="monotone" activeDot={{r:8}} dataKey="arrive" stroke="#A3CED6" strokeWidth={3}/>
                                    <Line type="monotone" activeDot={{r:8}} dataKey="start" stroke="#7DF558" strokeWidth={3}/>
                                    <Line type="monotone" activeDot={{r:8}} dataKey="end" stroke="#3A336F" strokeWidth={3}/>
                                </LineChart>
                            </ResponsiveContainer>    
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

export default withAuthManager(withMessageManager(DailyPerformance));