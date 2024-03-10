import React from 'react';
import Container from 'react-bootstrap/Container'
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import Rig from '../../model/Rig.js'
import SideBar from '../../components/SideBar/SideBar'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import Nav from 'react-bootstrap/Nav'
import AssetCard from './AssetCard'
import TDVFD from './TDVFD'
import DWVFD from './DWVFD'
import './DrillingOverview.css'
import {withLayoutManager} from '../../Helper/Layout/layout'

class DrillingOverview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            page : "overview"
        };
        this.rigApi = new Rig()
        this.interval = undefined
    }

    refreshData = () => {
        this.rigApi.GetDrillingOverView((val,err) => {
            this.setState({data : val})
        }) 
    }
    componentDidMount() {
        this.interval = setInterval(this.refreshData, 10000);
        this.refreshData()
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    renderOverView() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        } 
        var data = this.state.data
        data.topDrive.asset = "TOP DRIVE"
        data.dwa.asset = "DRAWWORKS A"
        data.dwb.asset = "DRAWWORKS B"
        data.dwc.asset = "DRAWWORKS C"
        data.mp1a.asset = "MUD PUMP 1A"
        data.mp1b.asset = "MUD PUMP 1B"
        data.mp2a.asset = "MUD PUMP 2A"
        data.mp2b.asset = "MUD PUMP 2B"
        data.mp3a.asset = "MUD PUMP 3A"
        data.mp3b.asset = "MUD PUMP 3B"
        if (this.props.renderFor === 1) {
            return (<>
            <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                <Col>
                    <AssetCard data={data.dwa}/>
                </Col>
                <Col>
                    <AssetCard data={data.dwb}/>
                </Col>
                <Col>
                    <AssetCard data={data.dwc}/>
                </Col>
            </Row>
            <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                <Col>
                    <AssetCard data={data.mp1a}/>
                </Col>
                <Col>
                    <AssetCard data={data.mp2a}/>
                </Col>
                <Col>
                    <AssetCard data={data.mp3a}/>
                </Col>
            </Row>
            <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                <Col>
                    <AssetCard data={data.mp1b}/>
                </Col>
                <Col>
                    <AssetCard data={data.mp2b}/>
                </Col>
                <Col>
                    <AssetCard data={data.mp3b}/>
                </Col>
            </Row>
            <Row style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                <Col></Col>
                <Col>
                    <AssetCard data={data.topDrive}/>
                </Col>
                <Col></Col>
            </Row>
            </>)
        } else if (this.props.renderFor === 2) {
            return(
                <>
                <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                    <Col >
                        <AssetCard data={data.topDrive}/>
                    </Col>
                    <Col>
                        <AssetCard data={data.dwa}/>
                    </Col>
                </Row>
                <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                    <Col>
                        <AssetCard data={data.dwb}/>
                    </Col>
                    <Col >
                        <AssetCard data={data.dwc}/>
                    </Col>
                </Row>
                <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                    <Col>
                        <AssetCard data={data.mp1a}/>
                    </Col>
                    <Col>
                        <AssetCard data={data.mp1b}/>
                    </Col>
                </Row>
                <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                    <Col>
                        <AssetCard data={data.mp2a}/>
                    </Col>
                    <Col>
                        <AssetCard data={data.mp2b}/>
                    </Col>
                </Row>
                <Row  style={{marginBottom : "5px", marginTop : "5px"}} noGutters={true}>
                    <Col>
                        <AssetCard data={data.mp3a}/>
                    </Col>
                    <Col>
                        <AssetCard data={data.mp3b}/>
                    </Col>
                </Row>
                </>
            )
        }
        return(
        <>
        <Row noGutters={true}>
            <Col>
                <AssetCard data={data.topDrive}/>
            </Col>
            <Col>
                <AssetCard data={data.dwa}/>
            </Col>
            <Col>
                <AssetCard data={data.mp1a}/>
            </Col>
            <Col>
                <AssetCard data={data.mp2a}/>
            </Col>
            <Col>
                <AssetCard data={data.mp3a}/>
            </Col>
        </Row>
        <Row noGutters={true}>
            <Col>
                <AssetCard data={data.dwb}/>
            </Col>
            <Col>
                <AssetCard data={data.dwc}/>
            </Col>
            <Col>
                <AssetCard data={data.mp1b}/>
            </Col>
            <Col>
                <AssetCard data={data.mp2b}/>
            </Col>
            <Col>
                <AssetCard data={data.mp3b}/>
            </Col>
        </Row>
        </>)
    }
    renderTD() {
        return (<TDVFD />)
    }
    renderDW(key) {
        return (<DWVFD key={key} eventKey={key}/>)
    }
    renderPage(){
        if (this.state.page === "overview") {
            return this.renderOverView()
        } else if (this.state.page === "td") {
            return this.renderTD()
        } else if (this.state.page === "dwa") {
            return this.renderDW("dwa")
        } else if (this.state.page === "dwb") {
            return this.renderDW("dwb")
        } else if (this.state.page === "dwc") {
            return this.renderDW("dwc")
        }
    }
    renderLG() {
        return(
            <SideBar>
                <DashboardCardWithHeader title="Drive Overview">
                    <Nav variant="tabs" defaultActiveKey="overview" onSelect=
                    {(key) => {
                        this.setState({page : key})
                    }}>
                        <Nav.Item>
                            <Nav.Link eventKey="overview">Overview</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="dwa">Drawwork A VFD</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="dwb">Drawwork B VFD</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="dwc">Drawwork C VFD</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="td">Top Drive VFD</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {this.renderPage()}
                </DashboardCardWithHeader>
            </SideBar>
        )
    }
    renderMD() {
        return (
            <>
            <DashboardCardWithHeader title="Drive Overview">
                <Nav variant="tabs" defaultActiveKey="overview" onSelect=
                {(key) => {
                    this.setState({page : key})
                }}>
                    <Nav.Item>
                        <Nav.Link eventKey="overview">Overview</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="dwa">Drawwork A VFD</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="dwb">Drawwork B VFD</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="dwc">Drawwork C VFD</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="td">Top Drive VFD</Nav.Link>
                    </Nav.Item>
                </Nav>
                {this.renderPage()}
            </DashboardCardWithHeader>
            </>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor !== 0) {
            contents = this.renderMD()
        }
        return (
            <div className="content-inner-all">
                <Container fluid={true}>
                    {contents}
                </Container>
            </div>)
    }
}

export default withLayoutManager(DrillingOverview);
