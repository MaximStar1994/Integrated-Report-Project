import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../css/App.css';
import '../../css/Dashboard.css';
import Tag from '../../model/Tag.js'
import SideBar from '../../components/SideBar/SideBar'
import DashboardCard from '../../components/DashboardCard/DashboardCard'
import TrendChart from '../../components/TrendChart/TrendChart'
import {withLayoutManager} from '../../Helper/Layout/layout'
class AssetManagement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            organization : "-",
            project : "-",
        };
        this.tagController = new Tag()
    }

    renderRPDChart(leg, title = "") {
        let prefix = localStorage.getItem("project") || "B357"
        let tagnames = `${prefix}_${leg}_RACK_PHASE_DIFF_A,${prefix}_${leg}_RACK_PHASE_DIFF_B,${prefix}_${leg}_RACK_PHASE_DIFF_C,${prefix}_${leg}_LEG_LENGTH`
        return (
            <TrendChart tagnames={tagnames} title={title}/>
        )
    }
    renderLOADChart(leg, title = "") {
        let prefix = localStorage.getItem("project") || "B357"
        let tagnames = `${prefix}_${leg}_CHORD_LOAD_A,${prefix}_${leg}_CHORD_LOAD_B,${prefix}_${leg}_CHORD_LOAD_C,${prefix}_${leg}_LEG_LENGTH`
        return (
            <TrendChart tagnames={tagnames} title={title}/>
        )
    }

    renderLEGLENChart(title="") {
        let prefix = localStorage.getItem("project") || "B357"
        let tagnames = `${prefix}_FWD_LEG_LENGTH,${prefix}_STBD_LEG_LENGTH,${prefix}_PORT_LEG_LENGTH`
        return (
            <TrendChart tagnames={tagnames} title={title}/>
        )
    }
    renderPLCChart(title="") {
        let prefix = localStorage.getItem("project") || "B357"
        let tagnames = `${prefix}_PLC_LIFE_COUNTER`
        return (
            <TrendChart tagnames={tagnames} title={title}/>
        )
    }
    renderINCLINATIONChart(title="") {
        let prefix = localStorage.getItem("project") || "B357"
        let tagnames = `${prefix}_INCLINATION_STBD_PORT,${prefix}_INCLINATION_FWD_AFT`
        return (
            <TrendChart tagnames={tagnames} title={title}/>
        )
    }

    renderLG() {
        return(
            <SideBar>
                <DashboardCard >
                    <Row>
                        <Col className="whiteHeading1" style={{textAlign : "center"}}>
                            JACKING SYSTEM - DATA VISUALIZATION
                        </Col>
                    </Row>
                    <Row style={{height : "30vh", marginTop : "20px"}}>
                        <Col xs={4}>
                            {this.renderRPDChart('FWD','FWD RPD CHART')}
                        </Col>
                        <Col xs={4}>
                            {this.renderLOADChart('FWD','FWD CHORD LOAD CHART')}
                        </Col>
                        <Col xs={4}>
                            {this.renderINCLINATIONChart('INCLINATION CHART')}
                        </Col>
                    </Row>
                    <Row style={{textAlign : "center"}}>
                        <Col xs={4} style={{textAlign : "center"}}>
                            FWD RPD CHART
                        </Col>
                        <Col xs={4}>
                            FWD CHORD LOAD CHART
                        </Col>
                        <Col xs={4}>
                            INCLINATION CHART
                        </Col>
                    </Row>
                    <Row style={{height : "30vh", marginTop : "20px"}}>
                        <Col xs={4}>
                            {this.renderRPDChart('STBD','STBD RPD CHART')}
                        </Col>
                        <Col xs={4}>
                            {this.renderLOADChart('STBD','STBD CHORD LOAD CHART')}
                        </Col>
                        <Col xs={4}>
                            {this.renderLEGLENChart('LEG LENGTH CHART')}
                        </Col>
                    </Row>
                    <Row style={{textAlign : "center"}}>
                        <Col xs={4} style={{textAlign : "center"}}>
                            STBD RPD CHART
                        </Col>
                        <Col xs={4}>
                            STBD CHORD LOAD CHART
                        </Col>
                        <Col xs={4}>
                            LEG LENGTH CHART
                        </Col>
                    </Row>
                    <Row style={{height : "30vh", marginTop : "20px"}}>
                        <Col xs={4}>
                            {this.renderRPDChart('PORT','PORT RPD CHART')}
                        </Col>
                        <Col xs={4}>
                            {this.renderLOADChart('PORT','PORT CHORD LOAD CHART')}
                        </Col>
                        <Col xs={4}>
                            {this.renderPLCChart('PLC LIFE COUNTER')}
                        </Col>
                    </Row>
                    <Row style={{textAlign : "center"}}>
                        <Col xs={4} style={{textAlign : "center"}}>
                            PORT RPD CHART
                        </Col>
                        <Col xs={4}>
                            PORT CHORD LOAD CHART
                        </Col>
                        <Col xs={4}>
                            PLC LIFE COUNTER
                        </Col>
                    </Row>
                </DashboardCard>
            </SideBar>
        )
    }
    renderMD() {
        return (
            <DashboardCard>
                <Row>
                    <Col className="whiteHeading1" style={{textAlign : "center"}}>
                        JACKING SYSTEM - DATA VISUALIZATION
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 6, offset : 3}}>
                        {this.renderPLCChart('PLC LIFE COUNTER')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 6, offset : 3}}>
                        PLC LIFE COUNTER
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={6}>
                        {this.renderINCLINATIONChart('INCLINATION CHART')}
                    </Col>
                    <Col xs={6}>
                        {this.renderLEGLENChart('LEG LENGTH CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={6} style={{textAlign : "center"}}>
                        INCLINATION CHART
                    </Col>
                    <Col xs={6}>
                        LEG LENGTH CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={6}>
                        {this.renderLOADChart('FWD','FWD CHORD LOAD CHART')}
                    </Col>
                    <Col xs={6}>
                        {this.renderRPDChart('FWD','FWD RPD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={6} style={{textAlign : "center"}}>
                        FWD CHORD LOAD CHART
                    </Col>
                    <Col xs={6}>
                        FWD RPD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={6}>
                        {this.renderLOADChart('PORT','PORT CHORD LOAD CHART')}
                    </Col>
                    <Col xs={6}>
                        {this.renderRPDChart('PORT','PORT RPD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={6} style={{textAlign : "center"}}>
                        PORT CHORD LOAD CHART
                    </Col>
                    <Col xs={6}>
                        PORT RPD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={6}>
                        {this.renderLOADChart('STBD','STBD CHORD LOAD CHART')}
                    </Col>
                    <Col xs={6}>
                        {this.renderRPDChart('STBD','STBD RPD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={6} style={{textAlign : "center"}}>
                        STBD CHORD LOAD CHART
                    </Col>
                    <Col xs={6}>
                        STBD RPD CHART
                    </Col>
                </Row>
            </DashboardCard>
        )
    }
    renderSM() {
        return (
            <DashboardCard>
                <Row>
                    <Col className="whiteHeading2" style={{textAlign : "center"}}>
                        JACKING SYSTEM - DATA VISUALIZATION
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderPLCChart('PLC LIFE COUNTER')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        PLC LIFE COUNTER
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderINCLINATIONChart('INCLINATION CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        INCLINATION CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderLEGLENChart('LEG LENGTH CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        LEG LENGTH CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderLOADChart('FWD','FWD CHORD LOAD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        FWD CHORD LOAD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderRPDChart('FWD','FWD RPD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        FWD RPD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderLOADChart('PORT','PORT CHORD LOAD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        PORT CHORD LOAD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderRPDChart('PORT','PORT RPD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        PORT RPD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderLOADChart('STBD','STBD CHORD LOAD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        STBD CHORD LOAD CHART
                    </Col>
                </Row>
                <Row style={{height : "20vh", marginTop : "10px"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        {this.renderRPDChart('STBD','STBD RPD CHART')}
                    </Col>
                </Row>
                <Row style={{textAlign : "center"}}>
                    <Col xs={{span : 10, offset : 1}}>
                        STBD RPD CHART
                    </Col>
                </Row>
            </DashboardCard>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor === 1) {
            contents = this.renderMD()
        }
        if (this.props.renderFor === 2) {
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

export default withLayoutManager(AssetManagement);
