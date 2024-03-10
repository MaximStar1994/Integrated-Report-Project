import React from 'react';
import Container from 'react-bootstrap/Container'
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import Alarm from '../../model/Alarm.js'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'

import RedBtn from '../../assets/Icon/RedRoundIndicator.png'
import ClearBtn from '../../assets/Icon/ClearRoundIndicator.png'
import InactiveBtn from '../../assets/Icon/PowerInactiveIcon.png'
import ReadyBtn from '../../assets/Icon/PowerReadyIcon.png'
import RunningBtn from '../../assets/Icon/PowerRunningIcon.png'
class AlarmMonitoring extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            showSpinner : true
        };
        this.alarmApi = new Alarm()
        this.interval = undefined
    }

    updateSize = () => {
        var width = window.innerWidth
        if (window.orientation === 90) {
            if (navigator.userAgent.match(/Android/) === null) {
                // android's innerheight has issues
                width = window.innerHeight
            }
        }
        if (width >= 1200) {
            this.setState({ renderFor : 0})
        } else if (width >= 768) {
            this.setState({ renderFor : 1})
        } else {
            this.setState({ renderFor : 2})
        }
    }
    refreshData = () => {
        this.alarmApi.GetAlarmMonitoring((val,err) => {
            this.setState({data : val, showSpinner : false})
        }) 
    }
    componentDidMount() {
        this.interval = setInterval(this.refreshData, 5000);
        this.refreshData()
        this.updateSize()
        window.addEventListener('resize', this.updateSize);
        window.addEventListener("orientationchange", this.updateSize);
    }
    componentWillUnmount() {
        clearInterval(this.interval)
        window.removeEventListener('resize', this.updateSize);
        window.removeEventListener('orientationchange', this.updateSize);
    }
    renderSpinner() {
        if (this.state.showSpinner) {
            return(<FullScreenSpinner />)
        } else {
            return (<></>)
        }
    }
    renderAlarmGroup(groupName, alarms) {
        return(
            <div style={{padding : "5px 10px", borderRadius : "15px", backgroundColor : "#dcdcdc"}}>
                <Row>
                    <Col>
                        <h1 style={{fontSize : "1rem", margiBottom : "0"}}>{groupName}</h1>
                    </Col>
                </Row>
                <Row>
                    {
                        groupName === "Air Handling Units" && this.renderAHUAlarms(alarms)
                    }{
                        groupName === "Bilge Alarms" && this.renderBilgeAlarms(alarms)
                    }{
                        groupName === "Compressed Air" && this.renderCompressedAirAlarms(alarms)
                    }{
                        groupName === "Fuel System" && this.rendeFuelSystemAlarms(alarms)
                    }{
                        groupName === "Miscellaneous" && this.renderMiscAlarms(alarms)
                    }{
                        groupName === "Power" && this.renderPowerAlarms(alarms)
                    }{
                        groupName === "System Alarms" && this.renderSystemAlarms(alarms)
                    }{
                        groupName === "Tank Alarms" && this.renderTankAlarms(alarms)
                    }
                </Row>
            </div>
        )
    }
    renderAlarm(key,alarms) {
        if (alarms[key] === undefined) {
            console.log(key,alarms)
        }
        return (
            <Col xs={6}>
                <Row 
                noGutters = {true}
                style={{textAlign : "left", color : "black", fontWeight : "semibold", fontSize : "0.9rem", paddingTop:"0", paddingBottom : "0"}}>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <img src={alarms[key] ? RedBtn : ClearBtn} style={{width : "30px", height : "30px", marginLeft : "auto"}} />
                    </Col>
                    <Col xs={10} style={{paddingLeft : "5px", display : "flex", alignItems : "center", fontSize : "0.8rem"}}>
                        {key}
                    </Col>
                </Row>
            </Col>
        )
    }
    renderFullAlarm(key,alarms) {
        if (alarms[key] === undefined) {
            console.log(key,alarms)
        }
        return (
            <Col xs={12}>
                <Row 
                noGutters = {true}
                style={{textAlign : "left", color : "black", fontWeight : "semibold", fontSize : "0.9rem", paddingTop:"0", paddingBottom : "0"}}>
                    <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                        <img src={alarms[key] ? RedBtn : ClearBtn} style={{width : "30px", height : "30px", marginLeft : "auto"}} />
                    </Col>
                    <Col xs={10} style={{paddingLeft : "5px", display : "flex", alignItems : "center", fontSize : "0.8rem"}}>
                        {key}
                    </Col>
                </Row>
            </Col>
        )
    }
    renderAHUAlarms(alarms) {
        return (
            <>
                {this.renderAlarm('Control Panel No 1 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 9 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 2 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 10 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 3 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 11 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 4 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 12 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 5 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 13 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 6 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 14 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 7 Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 15A/B Trip Alarm',alarms)}
                {this.renderAlarm('Control Panel No 8 Trip Alarm',alarms)}
                {this.renderAlarm('RTU 01A & 01B Trip Alarm',alarms)}
            </>
        )
    }
    renderBilgeAlarms(alarms) {
        return (
            <>
                {this.renderAlarm('Bilge High Level Alarm Aux. Mach. Room (PORT/AFT)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Heavy Tool Room',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Aux. Mach. Room (PORT/FWD)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Main Storage Room',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Aux. Mach. Room (STBD/AFT)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Mud Pump Room (PORT)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Aux. Mach. Room (STBD/FWD)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Mud Pump Room (STBD)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Engine Room (PORT)',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Sack Storage Room',alarms)}
                {this.renderAlarm('Bilge High Level Alarm Engine Room (STBD)',alarms)}
            </>
        )
    }
    renderCompressedAirAlarms(alarms) {
        return (
            <>
                {this.renderAlarm('Air Compressor Common Alarm',alarms)}
                {this.renderAlarm('Air Receiver No.1 For Eng/Gen Pressure Low Alarm',alarms)}
                {this.renderAlarm('Bulk Air Compressor Common Alarm',alarms)}
                {this.renderAlarm('Air Receiver No.2 For Eng/Gen Pressure Low Alarm',alarms)}
            </>
        )
    }
    rendeFuelSystemAlarms(alarms) {
        return (
            <>
                {this.renderAlarm('After Cooler Low Level Alarm',alarms)}
                {this.renderAlarm('Jacket Water Low Level Alarm',alarms)}
                {this.renderAlarm('Emer. Engine Common Alarm',alarms)}
                {this.renderAlarm('Main Engine No.1 Common Alarm',alarms)}
                {this.renderAlarm('Emer. Fuel Oil Tank Level Low Alarm',alarms)}
                {this.renderAlarm('Main Engine No.2 Common Alarm',alarms)}
                {this.renderAlarm('Emer. Gen Battery Charger No.1 Failure',alarms)}
                {this.renderAlarm('Main Engine No.3 Common Alarm',alarms)}
                {this.renderAlarm('Emer. Gen Battery Charger No.2 Failure',alarms)}
                {this.renderAlarm('Main Engine No.4 Common Alarm',alarms)}
                {this.renderAlarm('Fuel Oil Centrifuge Common Alarm',alarms)}
                {this.renderAlarm('Main Engine No.5 Common Alarm',alarms)}
                {this.renderAlarm('Fuel Oil Day Tank No.1 High Level Alarm',alarms)}
                {this.renderAlarm('Main Gen. No.1 Battery Charger Failure',alarms)}
                {this.renderAlarm('Fuel Oil Day Tank No.1 Low Level Alarm',alarms)}
                {this.renderAlarm('Main Gen. No.2 Battery Charger Failure',alarms)}
                {this.renderAlarm('Fuel Oil Day Tank No.2 High Level Alarm',alarms)}
                {this.renderAlarm('Main Gen. No.3 Battery Charger Failure',alarms)}
                {this.renderAlarm('Fuel Oil Day Tank No.2 Low Level Alarm',alarms)}
                {this.renderAlarm('Main Gen. No.4 Battery Charger Failure',alarms)}
                {this.renderAlarm('Harmonic Filter Common Alarm',alarms)}
                {this.renderAlarm('Main Gen. No.5 Battery Charger Failure',alarms)}
                {this.renderAlarm('HPU Common Fault Alarm',alarms)}
            </>
        )
    }
    renderMiscAlarms(alarms) {
        var hotwaterPump = alarms['Hot Water Circulation Pump']
        var imgSrc = InactiveBtn
        if (hotwaterPump === "ready") {
            imgSrc = ReadyBtn
        } else if (hotwaterPump === "running") {
            imgSrc = RunningBtn
        }
        return (
            <>
                {this.renderAlarm('Anti-Fouling Common Alarm',alarms)}
                {this.renderAlarm('Mud Process Equipment Common Alarm',alarms)}
                {this.renderAlarm('Freezer / Chiller Room High Temperature Alarm',alarms)}
                {this.renderAlarm('Oily Water Separator High Oil Alarm',alarms)}
                {this.renderAlarm('Watermaker No.1 Alarm',alarms)}
                {this.renderAlarm('Watermaker No.2 Alarm',alarms)}
                {this.renderAlarm('Mud Pit Room Loss of Differential Pressure Alarm',alarms)}
                <Col xs={6}>
                    <Row 
                    noGutters = {true}
                    style={{textAlign : "left", color : "black", fontWeight : "semibold", fontSize : "0.9rem", paddingTop:"0", paddingBottom : "0"}}>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img src={imgSrc} style={{width : "30px", height : "30px", marginLeft : "auto"}} />
                        </Col>
                        <Col xs={10} style={{paddingLeft : "5px", display : "flex", alignItems : "center", fontSize : "0.8rem"}}>
                            Hot Water Circulation Pump
                        </Col>
                    </Row>
                </Col>
            </>
        )
    }
    renderPowerAlarms(alarms) {
        return (
            <>
                {this.renderFullAlarm('600VAC Mains Switchboard Fault',alarms)}
                {this.renderFullAlarm('Transformer No.1 High Temp Alarm',alarms)}
                {this.renderFullAlarm('Transformer No.2 High Temp Alarm',alarms)}
                {this.renderFullAlarm('UPS 12KVA Remote Common Alarm',alarms)}
                {this.renderFullAlarm('UPS 18KVA Remote Common Alarm',alarms)}
            </>
        )
    }
    renderSystemAlarms(alarms) {
        return (
            <>
                {this.renderFullAlarm('BOP Common Alarm',alarms)}
                {this.renderFullAlarm('Drill Water Main Pressure Low Alarm',alarms)}
                {this.renderFullAlarm('Driller\'s Cabin A/C Failure',alarms)}
                {this.renderFullAlarm('Potable Water Low Pressure Alarm',alarms)}
                {this.renderFullAlarm('Sanitary Water Pressure Set Low Pressure Alarm',alarms)}
                {this.renderFullAlarm('Sewage Treatment Plant High Level Alarm',alarms)}
                {this.renderFullAlarm('Hull Skimmer Tank A High Level Alarm',alarms)}
            </>
        )
    }
    renderTankAlarms(alarms) {
        return (
            <>
                {this.renderFullAlarm('Dirty Oil Tank High Level Alarm',alarms)}
                {this.renderFullAlarm('Emer. Fuel Oil Tank Low Low Level Alarm',alarms)}
            </>
        )
    }
    renderPage(){
        if (!this.state.data) {
            return(<></>)
        }
        return(
            <Row>
                <Col xs={5}>
                    <Row>
                        <Col>
                            {this.renderAlarmGroup("Air Handling Units",this.state.data.ahu)}
                        </Col>
                    </Row>
                    <Row style={{paddingTop : "5px"}}>
                        <Col>
                            {this.renderAlarmGroup("Bilge Alarms",this.state.data.bilge)}
                        </Col>
                    </Row>
                    <Row style={{paddingTop : "5px"}}>
                        <Col>
                            {this.renderAlarmGroup("Compressed Air",this.state.data.compressedAir)}
                        </Col>
                    </Row>
                </Col>
                <Col xs={4}>
                    <Row>
                        <Col>
                            {this.renderAlarmGroup("Fuel System",this.state.data.fuelSystem)}
                        </Col>
                    </Row>
                    <Row style={{paddingTop : "15px"}}>
                        <Col>
                            {this.renderAlarmGroup("Miscellaneous",this.state.data.msc)}
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            {this.renderAlarmGroup("Power",this.state.data.power)}
                        </Col>
                    </Row>
                    <Row style={{paddingTop : "20px"}}>
                        <Col>
                            {this.renderAlarmGroup("System Alarms",this.state.data.system)}
                        </Col>
                    </Row>
                    <Row style={{paddingTop : "20px"}}>
                        <Col>
                            {this.renderAlarmGroup("Tank Alarms",this.state.data.tanks)}
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
    renderLG() {
        return(
            <DashboardCardWithHeader >
                <Row>
                    <Col style={{textAlign : "center"}}>
                        <h1>ALARM MONITORING SYSTEM</h1>
                    </Col>
                </Row>
                {this.renderPage()}
            </DashboardCardWithHeader>
        )
    }
    renderMD() {
        return (
            <>
            </>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.state.renderFor === 1) {
            contents = this.renderMD()
        }
        return (
            <div className="content-inner-all">
                {this.renderSpinner()}
                <Container fluid={true}>
                    {contents}
                </Container>
            </div>)
    }
}

export default AlarmMonitoring;
