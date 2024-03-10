import React,{useState} from 'react';
import { Card,Modal } from 'react-bootstrap';
import OperationIcon from '../../../assets/KST/Operation.png';
import ProceedIcon from '../../../assets/KST/Proceed.png';
import StandbyIcon from '../../../assets/KST/Standby.png';
import InfoIcon from "@material-ui/icons/Info";
import Config from "../../../config/config";
import VesselDashboardApi from '../../../model/VesselDashboard';
import { withAuthManager } from '../../../Helper/Auth/auth';
import {withMessageManager} from '../../../Helper/Message/MessageRenderer'
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import MaterialToolTip from '@material-ui/core/Tooltip';
import "./VesselDashboard.css";

const DailyPerformance = props => {
    const vesselDashboardApi = new VesselDashboardApi();
    const [marinemModalOpen, setMarinemModalOpen] = useState(false);
    const [marinemList, setMarinemList] = useState([]);
    const [marinemModalInfo,setMarinemModalInfo] = useState("Loading Data...");

    const performanceInfo = async () => {
        try {
            setMarinemModalOpen(true);
            let selectedVesselData = props.selectedVessel;
            var lastFiveMarinemData = await vesselDashboardApi.GetVesselDashboardLastFiveMarinemData(selectedVesselData.vessel_id);
            if (lastFiveMarinemData && lastFiveMarinemData.length === 0 ) {
                setMarinemModalInfo("NO DATA AVAILABLE TO SHOW");
            }
            setMarinemList(lastFiveMarinemData);
            console.log(marinemList);
        } catch (err) {
            props.setMessages([{ type: 'danger', message: err}]);
            setMarinemModalOpen(false);
        }
    }

    return (
        <React.Fragment>
            <div className="Heading">
                <div>Vessel Daily Performance</div>
                {/* <MaterialToolTip title="Performance Trend" placement="bottom"><InfoIcon onClick={() => performanceInfo()} style={{ cursor: 'pointer', width: '2.5rem', height: '2.5rem', color: Config.KSTColors.MAIN }} /></MaterialToolTip> */}
            </div>
            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <Card className='DailyPerformanceCard'>
                    <div style={{ color: "#8054BD", fontSize: '1.5rem', margin: '1.1rem', textAlign: 'center', marginTop: '2rem' }}>
                        Deploy
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', padding: '1rem' }}>
                        {(props.data.deploy/60).toFixed(2)}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1.4rem', textAlign: 'center' }}>
                        hours
                    </div>
                    <div style={{ height: '4rem', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <img className='DailyPerformanceDeployIcon' src={OperationIcon} style={{ height: '100%'}} alt="Operation Icon" />
                    </div>
                </Card>
                <Card className='DailyPerformanceCard'>
                    <div style={{ color: "#6985C4", fontSize: '1.5rem', margin: '1.1rem', textAlign: 'center', marginTop: '2rem' }}>
                        Move
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', padding: '1rem' }}>
                        {(props.data.move/60).toFixed(2)}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1.4rem', textAlign: 'center' }}>
                        hours
                    </div>
                    <div style={{ height: '4rem', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <img className='DailyPerformanceMoveIcon' src={ProceedIcon} style={{ height: '100%' }} alt="Proceed Icon" />
                    </div>
                </Card>
                <Card className='DailyPerformanceCard'>
                    <div style={{ color: "#A3CED6", fontSize: '1.5rem', margin: '1.4rem', textAlign: 'center', marginTop: '2rem' }}>
                        Arrive
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', padding: '1rem' }}>
                        {(props.data.arrive/60).toFixed(2)}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1.4rem', textAlign: 'center' }}>
                        hours
                    </div>
                    <div style={{ height: '4rem', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <img className='DailyPerformanceArriveIcon' src={OperationIcon} style={{ height: '100%' }} alt="Standby Icon" />
                    </div>
                </Card>
                <Card className='DailyPerformanceCard'>
                    <div style={{ color: "#7DF558", fontSize: '1.5rem', margin: '1.4rem', textAlign: 'center', marginTop: '2rem' }}>
                        Start
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', padding: '1rem' }}>
                        {(props.data.start/60).toFixed(2)}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1.4rem', textAlign: 'center' }}>
                        hours
                    </div>
                    <div style={{ height: '4rem', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <img className='DailyPerformanceStartIcon' src={ProceedIcon} style={{ height: '100%' }} alt="Standby Icon" />
                    </div>
                </Card>
                <Card className='DailyPerformanceCard'>
                    <div style={{ color: "#3A336F", fontSize: '1.5rem', margin: '1.4rem', textAlign: 'center', marginTop: '2rem' }}>
                        End
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', padding: '1rem' }}>
                        {(props.data.end/60).toFixed(2)}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1.4rem', textAlign: 'center' }}>
                        hours
                    </div>
                    <div style={{ height: '4rem', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                        <img className='DailyPerformanceEndIcon' src={StandbyIcon} style={{ height: '100%' }} alt="Standby Icon" />
                    </div>
                </Card>
            </div>
            <Modal size="lg" show={marinemModalOpen} onHide = {() => setMarinemModalOpen(false)} aria-labelledby="MarineM" centered>
                <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
                    <Modal.Title id="MarinemData">Last 5 Days Performance Trend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                      marinemList.length === 0 ?
                        <span style={{ fontSize: "1rem" }}>{marinemModalInfo}</span> : 
                        <div style={{maxWidth: "80vw",height: "60vh"}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marinemList}>
                                    <XAxis dataKey="date" />
                                    <YAxis label={{ value: "(Minutes)", angle: -90, position: 'insideLeft', fill: '#9B9595' }}/>
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="deploy" fill="#8054BD" />
                                    <Bar dataKey="move" fill="#6985C4" />
                                    <Bar dataKey="arrive" fill="#A3CED6" />
                                    <Bar dataKey="start" fill="#7DF558" />
                                    <Bar dataKey="end" fill="#3A336F" />
                                </BarChart>
                            </ResponsiveContainer>    
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

export default withAuthManager(withMessageManager(DailyPerformance));