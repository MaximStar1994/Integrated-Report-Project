import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../css/App.css';
import '../../css/Dashboard.css';
import Rig from '../../model/Rig.js'
import SideBar from '../../components/SideBar/SideBar'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import TrendModalChart from '../../components/TrendChart/TrendChartModal'
import TankConfig from './TankConfig'
import Tank from './Tank.js'
import MainBG from '../../assets/Background/Keppel_TG_Tank_BG.png'
import SmallBG from '../../assets/Background/Keppel_TG_Tank_MiniBG.png'
import LegBG from '../../assets/Background/TankGauging.png'
import infoIcon from '../../assets/Icon/info-white.png'
import AlarmList from '../../components/Alarm/Alarm'
import { parseInputToFixed2 } from '../../Helper/GeneralFunc/parseInputToFixed2'

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import valveDefaultFill from '../../assets/TankGauging/TG_Gray_Valve.png'
import valveGreenFill from '../../assets/TankGauging/TG_Green_Valve.png'
import valveRedFill from '../../assets/TankGauging/TG_Red_Valve.png'
import valveDumpDefaultFill from '../../assets/TankGauging/TG_Gray_Valve_Dump.png'
import valveDumpGreenFill from '../../assets/TankGauging/TG_Green_Valve_Dump.png'
import valveDumpRedFill from '../../assets/TankGauging/TG_Red_Valve_Dump.png'
import blueTank from '../../assets/TankGauging/Keppel_TG_Tank_Blue.png'
import brownTank from '../../assets/TankGauging/Keppel_TG_Tank_Brown.png'
import brownRedTank from '../../assets/TankGauging/Keppel_TG_Tank_Brown_Red.png'
import greenTank from '../../assets/TankGauging/Keppel_TG_Tank_Green.png'
import yellowTank from '../../assets/TankGauging/Keppel_TG_Tank_Yellow.png'
import {withLayoutManager} from '../../Helper/Layout/layout'
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);
class TankGauging extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            organization: "-",
            project: "-",
            renderFor: 0, // 0 for desktop, 1 for ipad, 2 for mobile 
        };
        this.rigApi = new Rig()
    }

    GetTankGaugingVal(){
        this.rigApi.GetTankGauging((val, err) => {
            this.setState({ tankData: val })
        })
    }
    componentDidMount() {
        this.GetTankGaugingVal()
        this.timerID = setInterval(async () => this.GetTankGaugingVal(), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    switchModal(tagnames, title) {
        this.setState({ modalTags: tagnames, modalShow: true, modalTitle: title })
    }
    handleModalClose() {
        this.setState({ modalShow: false })
    }
    renderModal() {
        var tagnames = this.state.modalTags
        var title = this.state.modalTitle
        var modalShow = this.state.modalShow ? this.state.modalShow : false
        if (modalShow) {
            return (
                <TrendModalChart
                    title={title}
                    tagnames={tagnames}
                    show={modalShow}
                    handleModalClose={() => { this.handleModalClose() }}
                />
            )
        } else {
            return (<></>)
        }
    }
    renderTanks() {
        var data = this.state.tankData
       
        if (data === undefined || data === null) {
            return (<></>)
        }
        var tanksElm = []
        TankConfig.tanks.forEach((tank) => {
            var soundingValue = data.sounding.sounding[tank.tagname]
            var volValue = data.sounding.volume[tank.tagname]
            var fillEnum = data.filldump[tank.tagname + '_FILL']
            var dumpEnum = data.filldump[tank.tagname + '_DUMP']
            var capacity = tank.capacity
            tanksElm.push(
                <div
                    className="clickable"
                    key={tank.tagname}
                    style={{ position: 'absolute', top: tank.position.top, left: tank.position.left, width: tank.position.width }}
                    onClick={() => { this.switchModal(tank.tagnames, tank.name) }}>
                    <Tank
                        maxSounding={capacity}
                        currVolume={volValue}
                        soundingValue={soundingValue}
                        dumpEnum={dumpEnum}
                        fillEnum={fillEnum}
                        tankType={tank.type}
                        name={tank.name}
                    />
                </div>
            )

        })
        return tanksElm
    }
    renderLG() {
        var data = this.state.tankData
        if (data === undefined) {
            return (<></>)
        }
        return (
            <SideBar>
                <DashboardCard  >
                    <Row>
                        <Col className="whiteHeading1" style={{ textAlign: "center" }}>
                            TANK GAUGING
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: "20px" }}>
                            <Row>
                                <Col xs={1} style={{ textAlign: "center" }}>
                                    <HtmlTooltip
                                        placement="right-start"
                                        title={
                                            <React.Fragment>
                                                <Row style={{ padding: "10px 0", fontWeight: "900" }} >
                                                    <Col>
                                                        Valve (Fill) Status
                                            </Col>
                                                </Row>
                                                <Row noGutters={true}>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={valveGreenFill} alt="motor on" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Open
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={valveDefaultFill} alt="motor off" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Close
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={valveRedFill} alt="motor fault" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Fault
                                            </Col>
                                                </Row>
                                                <Row style={{ padding: "10px 0", fontWeight: "900" }}>
                                                    <Col>
                                                        Valve (Dump) Status
                                            </Col>
                                                </Row>
                                                <Row noGutters={true}>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={valveDumpGreenFill} alt="motor on" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Open
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={valveDumpDefaultFill} alt="motor off" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Close
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={valveDumpRedFill} alt="motor fault" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Fault
                                            </Col>
                                                </Row>
                                                <Row style={{ padding: "10px 0", fontWeight: "900" }}>
                                                    <Col>
                                                        Tank Type
                                            </Col>
                                                </Row>
                                                <Row noGutters={true} >
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={blueTank} alt="motor on" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Water Tank
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={brownTank} alt="motor off" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Fuel Tank
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={greenTank} alt="motor off" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Others
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={brownRedTank} alt="motor off" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Base Oil Tank
                                            </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        <img className="legendIcon" src={yellowTank} alt="motor fault" />
                                                    </Col>
                                                    <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                                        Drill Water Tank
                                            </Col>
                                                </Row>
                                            </React.Fragment>
                                        }
                                    >
                                        <img src={infoIcon} alt="Information" />
                                    </HtmlTooltip>
                                </Col>
                                <Col xs={{ span: 10 }}>
                                    <img src={MainBG} style={{ filter: "invert(25%)" }}></img>
                                    <div style={{ position: 'absolute', top: "0%", left: "5%", width: "20%", bottom: "80%", backgroundColor: "white" }}>
                                        <Row style={{ paddingTop: "10px" }} noGutters={true}>
                                            <Col style={{ textAlign: "center", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                                <Row style={{ marginLeft: 0 }}>
                                                    <Col>
                                                        <Row>
                                                            <Col>
                                                                DRAFT PF
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col style={{ color: "#2d63f7" }}>
                                                                {parseInputToFixed2(data.filldump.DRAFT_PORT_FWD)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginLeft: 0, alignSelf: "flex-end" }}>
                                                    <Col>
                                                        <Row>
                                                            <Col style={{ textAlign: "center" }}>
                                                                DRAFT PA
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col style={{ color: "#2d63f7" }}>
                                                                {parseInputToFixed2(data.filldump.DRAFT_PORT_AFT)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col><img src={SmallBG} style={{ filter: "invert(25%)" }}></img></Col>
                                            <Col style={{ textAlign: "center", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                                <Row >
                                                    <Col>
                                                        <Row>
                                                            <Col>
                                                                DRAFT SF
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col style={{ color: "#2d63f7" }}>
                                                                {parseInputToFixed2(data.filldump.DRAFT_STBD_FWD)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row style={{ alignSelf: "flex-end" }}>
                                                    <Col>
                                                        <Row>
                                                            <Col style={{ textAlign: "center" }}>
                                                                DRAFT SA
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col style={{ color: "#2d63f7" }}>
                                                                {parseInputToFixed2(data.filldump.DRAFT_STBD_AFT)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div style={{ position: 'absolute', top: "13.5%", left: "41%", width: "18%" }}>
                                        <img src={LegBG} ></img>
                                    </div>
                                    <div style={{ position: 'absolute', top: "58%", left: "11%", width: "18%" }}>
                                        <img src={LegBG} ></img>
                                    </div>
                                    <div style={{ position: 'absolute', top: "58%", left: "71%", width: "18%" }}>
                                        <img src={LegBG} ></img>
                                    </div>
                                    {this.renderTanks()}
                                    <div style={{ position: 'absolute', top: "5%", left: "85%", width: "18%" }} >
                                        <AlarmList title="Tank Gauging" alarmGroup="tanks" /></div>
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                </DashboardCard>
            </SideBar>
        )
    }

    renderSM() {
        var data = this.state.tankData
        if (data === undefined) {
            return (<></>)
        }
        return (
            <DashboardCard >
                <Row>
                    <Col className="whiteHeading1" style={{ textAlign: "center" }}>
                        TANK GAUGING
                    </Col>
                </Row>
                <Row>
                    <Col  style={{ textAlign: "right", paddingBottom:'2%' }}>
                    <HtmlTooltip
                            placement="right-start"
                            title={
                                <React.Fragment>
                                    <Row style={{ padding: "10px 0", fontWeight: "900" }} >
                                        <Col>
                                            Valve (Fill) Status
                                            </Col>
                                    </Row>
                                    <Row noGutters={true}>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={valveGreenFill} alt="motor on" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Open
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={valveDefaultFill} alt="motor off" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Close
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={valveRedFill} alt="motor fault" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Fault
                                            </Col>
                                    </Row>
                                    <Row style={{ padding: "10px 0", fontWeight: "900" }}>
                                        <Col>
                                            Valve (Dump) Status
                                            </Col>
                                    </Row>
                                    <Row noGutters={true}>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={valveDumpGreenFill} alt="motor on" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Open
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={valveDumpDefaultFill} alt="motor off" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Close
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={valveDumpRedFill} alt="motor fault" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Fault
                                            </Col>
                                    </Row>
                                    <Row style={{ padding: "10px 0", fontWeight: "900" }}>
                                        <Col>
                                            Tank Type
                                            </Col>
                                    </Row>
                                    <Row noGutters={true} >
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={blueTank} alt="motor on" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Water Tank
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={brownTank} alt="motor off" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Fuel Tank
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={greenTank} alt="motor off" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Others
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={brownRedTank} alt="motor off" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Base Oil Tank
                                            </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            <img className="legendIcon" src={yellowTank} alt="motor fault" />
                                        </Col>
                                        <Col xs={2} style={{ display: "flex", alignItems: "center" }}>
                                            Drill Water Tank
                                            </Col>
                                    </Row>
                                </React.Fragment>
                            }
                        >
                            <img src={infoIcon} alt="Information"  />
                        </HtmlTooltip>
                    </Col>
                </Row>
                <Row >
                <Col xs md={8} xs md={{  offset: 2 }} >
                    <div style={{ position: 'relative', width:'50vw',height:'10vh',margin: '0 auto', backgroundColor: "white",display: "table" }}>
                        <Row  noGutters={true}>
                            <Col style={{ textAlign: "left",position: 'absolute',textIndent:'2%',padding: '0 auto'}}>
                                <Row style={{ margin: "auto",height: '5vh'}} >
                                    <Col>
                                        <Row>
                                            <Col>
                                                DRAFT PF
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ color: "#2d63f7" }}>
                                                {parseInputToFixed2(data.filldump.DRAFT_PORT_FWD)}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ margin: "auto",height: '5vh'}}>
                                    <Col>
                                        <Row>
                                            <Col>
                                                DRAFT PA
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ color: "#2d63f7" }}>
                                                {parseInputToFixed2(data.filldump.DRAFT_PORT_AFT)}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col style={{ textAlign: "center" ,position: 'absolute' }} ><img src={SmallBG} style={{ filter: "invert(25%)",width:'20vw',height:'10vh' }}></img></Col>
                            <Col style={{ textAlign: "right" ,position: 'absolute' ,direction:'rtl',textIndent:'2%'}}>
                                <Row style={{ margin: "auto",height: '5vh'}} >
                                    <Col>
                                        <Row>
                                            <Col>
                                                DRAFT SF
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ color: "#2d63f7" }}>
                                                {parseInputToFixed2(data.filldump.DRAFT_STBD_FWD)}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ margin: "auto",height: '5vh'}}>
                                    <Col>
                                        <Row>
                                            <Col>
                                                DRAFT SA
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ color: "#2d63f7" }}>
                                                {parseInputToFixed2(data.filldump.DRAFT_STBD_AFT)}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    </Col>
                    <Col xs={2} style={{ textAlign: "right" }}>
                    <AlarmList title="Tank Gauging" alarmGroup="tanks" />
                    </Col> 
                </Row>
                 <Row>
                    <Col style={{ padding: "20px" }}>
                        <Row>
                            <Col xs={{ span: 12 }}>
                                <img src={MainBG} style={{ filter: "invert(25%)" }}></img>

                                <div style={{ position: 'absolute', top: "13.5%", left: "41%", width: "18%" }}>
                                    <img src={LegBG} ></img>
                                </div>
                                <div style={{ position: 'absolute', top: "58%", left: "11%", width: "18%" }}>
                                    <img src={LegBG} ></img>
                                </div>
                                <div style={{ position: 'absolute', top: "58%", left: "71%", width: "18%" }}>
                                    <img src={LegBG} ></img>
                                </div>
                                {this.renderTanks()}
                            </Col>

                        </Row>
                    </Col>
               </Row>
            </DashboardCard>
        )
    }
    render() {

        var contents = this.renderLG()
        if (this.props.renderFor === 1 || this.props.renderFor === 2) {
            contents = this.renderSM()
        } 
        return (
            <div className="content-inner-all">
                <Container fluid={true}>
                    {contents}
                    {this.renderModal()}
                </Container>
            </div>)
    }
}

export default withLayoutManager(TankGauging);
