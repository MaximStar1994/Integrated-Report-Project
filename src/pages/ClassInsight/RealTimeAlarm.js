import React from 'react';
import Container from 'react-bootstrap/Container'
import { Row, Col } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';
import SideBar from '../../components/SideBar/ClassInsightSideBar'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import DownloadIcon from '../../assets/Icon/download.png'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import Alarm from '../../model/Alarm'
import './ClassInsight.css'
import { withLayoutManager } from '../../Helper/Layout/layout'
class RealTimeAlarm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            renderFor: 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            alarms: [],
            showSpinner: false,
            outerCircleWidth: "auto"
        };
        this.alarmApi = new Alarm();
        this.textInput = React.createRef();
        this.outerCircle = React.createRef();

    }


    downloadCSV() {
        this.setState({ showSpinner: true })
        this.alarmApi.GetAlarmsCSV((url) => {
            var element = document.getElementById('downloadBtn')
            element.setAttribute('href', url)
            element.click()
            this.setState({ showSpinner: false })
        })
    }
    componentDidMount() {
        this.updateData()
        this.timerID = setInterval(async () => this.updateData(), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    updateData(){
        this.alarmApi.GetAlarmCategoriesCount((alarms) => {
            this.setState({ alarms: alarms })
        })
    }
    setTextInputRef = element => {
        if (element !== null) {
        var width = element.offsetHeight / 2 + 'px'
        var borderTrans = element.offsetHeight / 2 + 'px'
        var elements = document.getElementsByClassName("alarmTriangleRight");

        for (var i = 0; i < elements.length; i++) {
            elements[i].style.borderTop = borderTrans + " solid transparent";
            elements[i].style.borderBottom = borderTrans + " solid transparent";
            elements[i].style.borderLeft = width + " solid black";
        }
        this.textInput = element;
        }
    };

    setOuterCircleRef = element => {
        if (element !== null) {
            var width = element.offsetHeight + 'px'
            var elements = document.getElementsByClassName("outercircle");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.width = (width);
            }
            this.outerCircle = element;
        }

    };
    renderPage() {
        var wd = "20%"
        if (this.props.renderFor === 1 || this.props.renderFor === 2) {
            wd = "40%"
        }
        return (
            <Row style={{ marginTop: "30px", marginBottom: "50vh", justifyContent:"space-evenly" }}>
                <Col xs={{ span: 10, offset: 1 }} >
                    <Row>
                        {this.state.alarms.map((alarm, i) => (
                            <div key={i} style={{ width: wd, padding: "15px", paddingRight: "15px" }}>
                                <div style={{ backgroundColor: "#04445d", position: "relative" }}>
                                    <div style={{ display: "flex", paddingLeft: "35%", paddingTop: "15px", paddingBottom: "15px" }}>
                                        {alarm.GroupName}
                                    </div>
                                    <div
                                        ref={this.setTextInputRef}
                                        style={{ position: "absolute", top: '10%', bottom: '10%', left: '0', backgroundColor: "black", width: "20%", display: "flex" }}>
                                        <div style={{ alignSelf: "center", width: "100%" }}>
                                            <div style={{ textAlign: "right", width: "100%" }} >{alarm.num}</div>
                                        </div>
                                    </div>
                                    <div
                                        className="alarmTriangleRight"
                                        style={{ position: "absolute", top: '10%', bottom: '10%', left: '20%', width: "0", }}>
                                    </div>
                                    <div
                                        ref={this.setOuterCircleRef}
                                        className="outercircle"
                                        style={{ position: "absolute", top: 0, bottom: 0, left: "-10%", borderRadius: "50%", border: "5px solid black", backgroundColor: "#04445d", }}>
                                        <div
                                            style={{
                                                borderRadius: "50%", border: "1px solid #cccccc ",
                                                boxShadow: "0px -1px 0px 2px black",
                                                marginLeft: "20%", width: "60%", height: "60%", marginTop: "20%",
                                                backgroundColor: alarm.num > 0 ? "#ff9f0f" : "#04445d"
                                            }}
                                        >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Row>
                    <Row>
                        <Col xs md xl={{ span: 3, offset: 9 }}>
                            <a id="downloadBtn" className="myDownload"
                                download="alarms.xlsx"
                                style={{ display: "none" }} />
                            <div className="clickable emphasisClickable myDownloadBtn" onClick={this.downloadCSV.bind(this)}
                                style={{ border: "1px solid white", borderRadius: "10px", textAlign: 'center' }} >
                                <div style={{ display: "flex", padding: "15px", margin: "auto", width: "fit-content" }}>
                                    <img src={DownloadIcon} />
                                    <div style={{ display: "flex", alignSelf: "center" }}>Download</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
    renderLG() {
        return (
            <SideBar>
                <DashboardCardWithHeader title="Current Active Alarms">
                    {this.renderPage()}
                </DashboardCardWithHeader>
            </SideBar>
        )
    }

    renderSM() {
        return (
                <DashboardCardWithHeader title="Current Active Alarms">
                    {this.renderPage()}
                </DashboardCardWithHeader>
        )
    }


    render() {
        var contents = this.renderLG()
        if (this.props.renderFor == 1 || this.props.renderFor == 2) {
            contents = this.renderSM()
        }
        return (
            <div className="content-inner-all">
                {this.state.showSpinner && (<FullScreenSpinner />)}
                <Container fluid={true}>
                    {contents}
                </Container>
            </div>)
    }
}

export default withLayoutManager(RealTimeAlarm);
