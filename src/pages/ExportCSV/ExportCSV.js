import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import ExportCSVApi from '../../model/ExportCSVData';
import moment from 'moment';
import { CSVLink } from "react-csv";
import config from '../../config/config';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DatePicker } from "@material-ui/pickers";
import InputAdornment from '@material-ui/core/InputAdornment';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';

const ExportCSV = props => {
    const exportCSVAPI = new ExportCSVApi();
    const [breakdownData, setBreakdownData] = useState([]);
    const [vesselData, setVesselData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [startDateFORH, setStartDateFORH] = useState(null);
    const [startDateMissingLogs, setStartDateMissingLogs] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endDateFORH, setEndDateFORH] = useState(null);
    const [endDateMissingLogs, setEndDateMissingLogs] = useState(null);
    const [vessels, setVessels] = useState([]);
    const [selectedVesselIdForVesselReport, setSelectedVesselIdForVesselReport] = useState(1);
    const [selectedVesselIdForFORH, setSelectedVesselIdForFORH] = useState(0);
    const [gettingVesselReportData, setGettingVesselReportData] = useState(false);
    const [gettingFORHData, setGettingFORHData] = useState(false);
    const [gettingMissingLogs, setGettingMissingLogs] = useState(false);
    const [downloadAvailableForVesselReport, setDownloadAvailableForVesselReport] = useState(false);
    const [downloadAvailableForDailyLog, setDownloadAvailableForDailyLog] = useState(false);
    const [downloadAvailableForFORH, setDownloadAvailableForFORH] = useState(false);
    const [downloadAvailableForMissingLogs, setDownloadAvailableForMissingLogs] = useState(false);
    const [vesselReportData, setVesselReportData] = useState([]);
    const [dailyLogData, setDailyLogData] = useState([]);
    const [FORHData, setFORHData] = useState([]);
    const [MissingLogsData, setMissingLogsData] = useState([]);
    const [vesselReportHeaders, setVesselReportHeaders] = useState([]);
    const [dailyLogHeaders, setDailyLogHeaders] = useState([]);
    const [FORHHeaders, setFORHHeaders] = useState([]);
    const [MissingLogsHeaders, setMissingLogsHeaders] = useState([]);
    const getData = async () => {
        let today = moment();
        if(moment().isBefore(
            moment().set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            today.subtract(1, 'day');
        }
        let temp = await exportCSVAPI.GetExportCSVData({ today: today.format('DD-MM-YYYY') });
        setBreakdownData(temp.breakdownData);
        setVesselData(temp.vesselData);
        setVessels([{vessel_id: 0, name: 'KST Fleet'}, ...temp.vessels]);
    }
    useEffect(()=>{
        getData();
    }, [])
    const isEmpty = (element) =>{
        if(element===undefined || element===null || element==='')
            return true;
        else
            return false;
    }
    const getVesselReportData = async () => {
        if(isEmpty(startDate)===true || isEmpty(endDate)===true) 
            props.setMessages([{type : "danger", message : 'Start Date / End Date cannot be empty!'}]);
        else if(moment(startDate, 'DD-MM-YYYY').isAfter(moment(endDate, 'DD-MM-YYYY')))
            props.setMessages([{type : "danger", message : 'Start Date cannot be greater than End Date!'}]);
        else{
            setGettingVesselReportData(true);
            let temp = await exportCSVAPI.GetExportCSVDataForVesselReport({ startDate: startDate, endDate: endDate, vesselId: selectedVesselIdForVesselReport });
            setVesselReportData(temp.vesselReport.data);
            setVesselReportHeaders(temp.vesselReport.headers);
            setDailyLogData(temp.dailyLog.data);
            setDailyLogHeaders(temp.dailyLog.headers);
            
            setGettingVesselReportData(false);
            setDownloadAvailableForVesselReport(true);
            setDownloadAvailableForDailyLog(true);
        }
    }
    const getFORHData = async () => {
        if(isEmpty(startDateFORH)===true || isEmpty(endDateFORH)===true) 
            props.setMessages([{type : "danger", message : 'Start Date / End Date cannot be empty!'}]);
        else if(moment(startDateFORH, 'DD-MM-YYYY').isAfter(moment(endDateFORH, 'DD-MM-YYYY')))
            props.setMessages([{type : "danger", message : 'Start Date cannot be greater than End Date!'}]);
        else{
            setGettingFORHData(true);
            let temp = await exportCSVAPI.GetExportCSVDataForFORH({ startDate: startDateFORH, endDate: endDateFORH, vesselId: selectedVesselIdForFORH });
            setFORHData(temp.data);
            setFORHHeaders(temp.headers);
            
            setGettingFORHData(false);
            setDownloadAvailableForFORH(true);
        }
    }
    const getMissingLogs = async () => {
        setDownloadAvailableForMissingLogs(false);
        if(isEmpty(startDateMissingLogs)===true || isEmpty(endDateMissingLogs)===true) 
            props.setMessages([{type : "danger", message : 'Start Date / End Date cannot be empty!'}]);
        else if(moment(startDateMissingLogs, 'DD-MM-YYYY').isAfter(moment(endDateMissingLogs, 'DD-MM-YYYY')))
            props.setMessages([{type : "danger", message : 'Start Date cannot be greater than End Date!'}]);
        else if(moment.duration(moment(endDateMissingLogs, 'DD-MM-YYYY').diff(moment(startDateMissingLogs, 'DD-MM-YYYY'))).asDays()+1>config.MAXMISSINGLOG)
            props.setMessages([{type : "danger", message : 'Range cannot exceed '+ config.MAXMISSINGLOG +' days!'}]);
        else{
            setGettingMissingLogs(true);
            let temp = await exportCSVAPI.GetExportCSVDataForMissingLogs({ startDate: startDateMissingLogs, endDate: endDateMissingLogs });
            setMissingLogsData(temp.data);
            setMissingLogsHeaders(temp.headers);
            setGettingMissingLogs(false);
            setDownloadAvailableForMissingLogs(true);
        }
    }

    const disableMissingLogEndDatePeriod = (date) => {
        if (startDateMissingLogs !== null) {
            var calendarDate = moment(date).format("MM-DD-YYYY");
            var tempStartDateFormat = moment(startDateMissingLogs,"DD-MM-YYYY").format("MM-DD-YYYY");
            var maxDate = moment(tempStartDateFormat).add(30, "days");
            var tempMaxDateFormat = moment(maxDate).format("MM-DD-YYYY");
            if (moment(calendarDate).isBefore(moment(tempStartDateFormat))) {
                return calendarDate;
            }
            if (moment(calendarDate).isAfter(moment(tempMaxDateFormat))) {
                return calendarDate;
            }
        }
    }
    return(
        <Container fluid className="appContainer">
            <Row>
                <Col xs={12} md={6} xl={4}>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs={12} style={{ marginBottom: '10px' }}>
                            <CSVLink 
                                data={breakdownData} 
                                filename={`Breakdown Data - ${moment().format('DD-MM-YYYY')}.csv`}
                                className="btn btn-primary"
                                style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                            >
                                <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Export Vessel Breakdown Data</span>
                            </CSVLink>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs={12}>
                            <CSVLink 
                                data={vesselData} 
                                filename={`Vessel Data - ${moment().format('DD-MM-YYYY')}.csv`}
                                className="btn btn-primary"
                                style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                            >
                                <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Export Daily Fleet Fuel/Running Hour Data</span>
                            </CSVLink>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs={12}>
                            <div style={{ border: `5px solid ${config.KSTColors.MAIN}`, padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', height: '100%' }}>
                                    <div>
                                        START DATE
                                        <DatePicker
                                            id={'STARTDATE'} 
                                            disableFuture={true}
                                            aria-describedby={'STARTDATE'} 
                                            value={startDate===null?null:moment(startDate, 'DD-MM-YYYY')}
                                            onChange={e => setStartDate(moment(e).format('DD-MM-YYYY'))}
                                            name={'STARTDATE'}
                                            format="dd/MM/yyyy"
                                            className="crewPlanningDateInput"
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                    <span className="material-icons">date_range</span>
                                                </InputAdornment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div>
                                        END DATE
                                        <DatePicker
                                            id={'ENDDATE'} 
                                            disableFuture={true}
                                            aria-describedby={'ENDDATE'} 
                                            value={endDate===null?null:moment(endDate, 'DD-MM-YYYY')}
                                            onChange={e => setEndDate(moment(e).format('DD-MM-YYYY'))}
                                            name={'ENDDATE'}
                                            format="dd/MM/yyyy"
                                            className="crewPlanningDateInput"
                                            InputProps={{
                                                endAdornment: ( 
                                                <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                    <span className="material-icons">date_range</span>
                                                </InputAdornment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div>
                                        VESSEL
                                        <Select style={{ color: config.KSTColors.MAIN, width: '10rem' }} 
                                            disableUnderline 
                                            id='vessel'
                                            aria-describedby='vessel'
                                            value={selectedVesselIdForVesselReport===null?'':selectedVesselIdForVesselReport}
                                            onChange={e=> setSelectedVesselIdForVesselReport(e.target.value)}
                                            name='vessel'
                                            className="VesselReportFillableBox"   
                                        >
                                            {vessels.filter(option=> option.vessel_id.toString()!=='0').map(option => <MenuItem value={option.vessel_id} key={option.vessel_id}> {option.name}</MenuItem>)}
                                        </Select>
                                    </div>
                                </div>
                                <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                    <Button onClick={getVesselReportData} 
                                    className="btn btn-primary"
                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                    disabled={gettingVesselReportData===true}
                                    >
                                        {gettingVesselReportData===true?'Fetching Information...':'Get Data (Deck / Engine Log)'}
                                    </Button>
                                </div>

                                {(downloadAvailableForVesselReport===true||downloadAvailableForDailyLog===true)&&
                                    <>
                                        <CSVLink 
                                            headers={vesselReportHeaders}
                                            data={vesselReportData} 
                                            filename={`Vessel Report Form Data - ${moment().format('DD-MM-YYYY')}.csv`}
                                            className="btn btn-primary"
                                            style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                            onClick={()=>{
                                                setDownloadAvailableForVesselReport(false);
                                            }}
                                        >
                                            <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Export Vessel Report Form Data</span>
                                        </CSVLink>
                                        <CSVLink 
                                            headers={dailyLogHeaders}
                                            data={dailyLogData} 
                                            filename={`Daily Log Form Data - ${moment().format('DD-MM-YYYY')}.csv`}
                                            className="btn btn-primary"
                                            style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                            onClick={()=>{
                                                setDownloadAvailableForDailyLog(false);
                                            }}
                                            
                                        >
                                            <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Export Daily Log Form Data</span>
                                        </CSVLink>
                                    </>
                                }
                            </div>
                        </Col>
                        <Col xs={12}>
                            
                        </Col>
                        <Col xs={12}>
                            
                        </Col>
                    </Row>
                    {/* Fuel Oil and Running Hour Data */}
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs={12}>
                            <div style={{ border: `5px solid ${config.KSTColors.MAIN}`, padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', height: '100%' }}>
                                    <div>
                                        START DATE
                                        <DatePicker
                                            id={'STARTDATEFORH'} 
                                            disableFuture={true}
                                            aria-describedby={'STARTDATEFORH'} 
                                            value={startDateFORH===null?null:moment(startDateFORH, 'DD-MM-YYYY')}
                                            onChange={e => setStartDateFORH(moment(e).format('DD-MM-YYYY'))}
                                            name={'STARTDATEFORH'}
                                            format="dd/MM/yyyy"
                                            className="crewPlanningDateInput"
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                    <span className="material-icons">date_range</span>
                                                </InputAdornment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div>
                                        END DATE
                                        <DatePicker
                                            id={'ENDDATEFORH'} 
                                            disableFuture={true}
                                            aria-describedby={'ENDDATEFORH'} 
                                            value={endDateFORH===null?null:moment(endDateFORH, 'DD-MM-YYYY')}
                                            onChange={e => setEndDateFORH(moment(e).format('DD-MM-YYYY'))}
                                            name={'ENDDATEFORH'}
                                            format="dd/MM/yyyy"
                                            className="crewPlanningDateInput"
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                    <span className="material-icons">date_range</span>
                                                </InputAdornment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div>
                                        VESSEL
                                        <Select style={{ color: config.KSTColors.MAIN, width: '10rem' }} 
                                            disableUnderline 
                                            id='vessel'
                                            aria-describedby='vessel'
                                            value={selectedVesselIdForFORH===null?'':selectedVesselIdForFORH}
                                            onChange={e=> setSelectedVesselIdForFORH(e.target.value)}
                                            name='vessel'
                                            className="VesselReportFillableBox"
                                        >
                                            {vessels.map(option => <MenuItem value={option.vessel_id} key={option.vessel_id}> {option.name}</MenuItem>)}
                                        </Select>
                                    </div>
                                </div>
                                <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                    <Button onClick={getFORHData} 
                                    className="btn btn-primary"
                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                    disabled={gettingFORHData===true}
                                    >
                                        {gettingFORHData===true?'Fetching Information...':'Get Data (Tugs\' MGO & LNG midnight ROB Report)'}
                                    </Button>
                                </div>

                                {downloadAvailableForFORH===true&&
                                <CSVLink 
                                    headers={FORHHeaders}
                                    data={FORHData} 
                                    filename={
                                        selectedVesselIdForFORH===0?
                                        `Bunkering for fuel - ${moment().format('DD-MM-YYYY')}.csv`
                                        :
                                        `Bunkering for fuel - ${vessels.filter(element=>element.vessel_id===selectedVesselIdForFORH.toString())[0]['name']} - ${moment().format('DD-MM-YYYY')}.csv`}
                                    className="btn btn-primary"
                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                    onClick={()=>{
                                        setDownloadAvailableForFORH(false);
                                    }}
                                >
                                    <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Extract Tugs' MGO & LNG midnight ROB Report</span>
                                </CSVLink>
                                }
                            </div>
                        </Col>
                        <Col xs={12}>
                            
                        </Col>
                        <Col xs={12}>
                            
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={6} xl={4}>
                    {/* Missing Logs Data */}
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs={12}>
                            <div style={{ border: `5px solid ${config.KSTColors.MAIN}`, padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', height: '100%' }}>
                                    <div>
                                        START DATE
                                        <DatePicker
                                            id={'STARTDATEMISSINGLOGS'} 
                                            disableFuture={true}
                                            aria-describedby={'STARTDATEMISSINGLOGS'} 
                                            value={startDateMissingLogs===null?null:moment(startDateMissingLogs, 'DD-MM-YYYY')}
                                            onChange={e => setStartDateMissingLogs(moment(e).format('DD-MM-YYYY'))}
                                            name={'STARTDATEMISSINGLOGS'}
                                            format="dd/MM/yyyy"
                                            className="crewPlanningDateInput"
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                    <span className="material-icons">date_range</span>
                                                </InputAdornment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div>
                                        END DATE
                                        <DatePicker
                                            id={'ENDDATEMISSINGLOGS'} 
                                            disableFuture={true}
                                            aria-describedby={'ENDDATEMISSINGLOGS'} 
                                            value={endDateMissingLogs===null?null:moment(endDateMissingLogs, 'DD-MM-YYYY')}
                                            onChange={e => setEndDateMissingLogs(moment(e).format('DD-MM-YYYY'))}
                                            name={'ENDDATEMISSINGLOGS'}
                                            format="dd/MM/yyyy"
                                            className="crewPlanningDateInput"
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                    <span className="material-icons">date_range</span>
                                                </InputAdornment>
                                                )
                                            }}
                                            disabled={startDateMissingLogs === null ? true : false}
                                            shouldDisableDate={ disableMissingLogEndDatePeriod }
                                        />
                                    </div>
                                </div>
                                <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                    <Button onClick={getMissingLogs} 
                                    className="btn btn-primary"
                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                    disabled={gettingMissingLogs===true}
                                    >
                                        {gettingMissingLogs===true?'Fetching Information...':'Get Form Submission List'}
                                    </Button>
                                </div>

                                {downloadAvailableForMissingLogs===true&&
                                <CSVLink 
                                    headers={MissingLogsHeaders}
                                    data={MissingLogsData} 
                                    filename={`Missing Logs (${startDateMissingLogs} to ${endDateMissingLogs}).csv`}
                                    className="btn btn-primary"
                                    style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', width: '100%', paddingTop: '30px', paddingBottom: '30px', marginRight: '20px', color: config.KSTColors.ICON }}
                                    onClick={()=>{
                                        setDownloadAvailableForMissingLogs(false);
                                    }}
                                >
                                    <GetAppIcon style={{ color: config.KSTColors.ICON }}/>
                                    <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>Download Form Submission List</span>
                                </CSVLink>
                                }
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            
                        </Col>
                        <Col xs={12} md={4}>
                            
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
} 

export default withMessageManager(ExportCSV);