import React, {useState, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, LabelList } from 'recharts';
import moment from 'moment';
import FleetDowntimeIcon from '../../../assets/KST/FleetDowntime.png'
import InfoIcon from '../../../assets/KST/Info.png'
import DowntimeDetails from './DowntimeDetails';

const COLORS = ['#8246FF', '#F63EEB', '#0FAA07', '#FD912C', '#AE38CD', '#17AEF1', '#27E1DD'];
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const isEmpty = (element) =>{
    if(element===undefined || element===null || element==='')
        return true;
    else
        return false;
}
const getDifferenceDays = (start, end) => {
    let days = moment(end).diff(moment(start), 'days');
    let daysInSeconds = days*24*60*60;
    let secondsLeft = moment(end).diff(moment(start), 'seconds');
    days = parseFloat((days + (secondsLeft-daysInSeconds)/(24*60*60)).toFixed(2));
    return days;
}
const FleetDowntime = props => {
    const [openDetails, setOpenDetails] = useState(false);
    const [totalHours, setTotalHours] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    useEffect(()=>{
        let totalHours = 0;
        let totalDays = 0;
        props.data.breakdownData.forEach(event => {
            if(isEmpty(event.backToOperationDatetime)===false && isEmpty(event.breakdownDatetime)===false){
                totalDays = totalDays + getDifferenceDays(event.breakdownDatetime, event.backToOperationDatetime); //moment(event.backToOperationDatetime).diff(moment(event.breakdownDatetime), 'days');
                totalHours = totalHours + moment(event.backToOperationDatetime).diff(moment(event.breakdownDatetime), 'hours');
            }
        });
        setTotalHours(totalHours);
        setTotalDays(totalDays);
    }, [])
    const renderColorfulLegendText = (value: string, entry: any) => {
        const { color } = entry;
      
        return <span style={{ color: color, fontSize: '0.6rem' }}>{value}</span>;
    };
    return(
        <React.Fragment>
            <div className="Heading">
                <div style={{ display: 'flex', flexGrow: '1' }}>Fleet Downtime ({monthList[props.data.breakdownDataMonth-1]}, {props.data.breakdownDataYear})</div><img src={InfoIcon} alt="FleetDowntime Icon" style={{ cursor: 'pointer', width: '1.5rem', height: '1.5rem' }}  onClick={()=>setOpenDetails(true)} />
            </div>
            <Row>
                <Col xs={12} lg={8}>
                    <div style={{ position: 'relative' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={props.data.downtime} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} 
                                label={(value)=>`${value.value}%`}
                                >
                                    {props.data.downtime.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]}/>)}
                                </Pie>
                                <Tooltip fill="#9B9595" formatter={(value, name)=>[`${value}%`, name]} />
                                <Legend  style={{ marginTop: '0.5rem' }} formatter={renderColorfulLegendText} />
                            </PieChart>
                        </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '27%', left: '41%' }}>
                                <img src={FleetDowntimeIcon} alt="FleetDowntime Icon" style={{ width: '100px', height: '100px' }}/>
                            </div>
                    </div>
                    <div className="totalDaysDown">
                            <div>TOTAL DAYS DOWN: {totalDays.toFixed(2)}</div>
                    </div>
                </Col>
                <Col xs={12} lg={4}>
                    <div style={{ textAlign: 'center', color: '#9B9595', paddingBottom: '10px' }}>Top 3 contributors</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={props.data.lastMonthTopContributers} barCategoryGap='10'>
                            <XAxis dataKey="name" fill="#9B9595" fontSize="0.7rem" interval={0} angle={-90} tick={false} >
                            </XAxis>
                            <YAxis fill="#9B9595" fontSize="0.7rem" label={{ value: "Downtime (Days)", angle: -90, position: 'insideLeft', fill: '#9B9595' }} />
                            <Tooltip fill="#9B9595" />
                            <Bar dataKey="value" fill="#04568E">
                                <LabelList dataKey="name" position="inside" angle={-90} style={{ fill: '#9B9595', fontSize: '0.8rem' }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <DowntimeDetails open={openDetails} maxWidth={false} fullWidth={true} events={props.data.breakdownData} handleClose={()=>setOpenDetails(false)} totalDays={totalDays} totalHours={totalHours} month={props.data.breakdownDataMonth} year={props.data.breakdownDataYear}/>
        </React.Fragment>
    )
}

export default FleetDowntime;