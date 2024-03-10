import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import SectionHeader from '../../../components/SectionHeader/Header.js';
import DisplayData from '../../../components/Display/Display.js';
import VerticalBar from '../../../components/React-Spring-Bar/RigMoveVerticalBar.js';
import TrendChart from '../../../components/TrendChart_RigMove/TrendChart.js';
import RigmoveApi from '../../../model/Rigmove.js';
import { parseInputToFixed2 } from '../../../Helper/GeneralFunc/parseInputToFixed2.js';
import ComposedChart from '../../../components/ComposedChart/composedChart.js';
import { transistRefreshInterval } from '../../../Helper/GeneralFunc/setIntervals.js'
import { withLayoutManager } from '../../../Helper/Layout/layout'
class Touchdown extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            projectname: localStorage.getItem("project") || "B357",
            returnData: []
        }
        this.RigmoveApi = new RigmoveApi();
    }

    componentDidMount() {

        try {

            this._isMounted = true;
            this.GetValue();
            this.timerID = setInterval(async () => this.GetValue(), transistRefreshInterval);
        } catch (e) {
            console.log(e);
        }

    }
    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.timerID);
    }
    GetValue = () => {
        this.RigmoveApi.GetValue(this.state.projectname, 'AC_RC_Ops_RigMove', (val, err) => {
            if (val === null) {
                return
            }
            else {
                if (this._isMounted == true)
                    this.setState({ returnData: val });
            }
        })
    }
    GetCharts = (v) => {
        let tagname = `${this.state.projectname}_${v}`
        //let tagname = v;
        return (
            <TrendChart tagnames={tagname} showLegend={true} />
        )
    }

    GetCurrentValue = (arr, v) => {
        if (arr === null || arr === undefined || arr.length === 0) {
            return {
                led1: 0.00,
                barValue: 0.00,
                led2: 0.00
            }
        }
        else {
            const On_Off_Screen_Leg_Position = 'On_Off_Screen_Leg_Position_' + v;
            const On_Off_Screen_Leg_to_Seabed_bar = 'On_Off_Screen_Leg_to_Seabed_bar_' + v;
            const On_Off_Screen_Leg_to_Seabed_clearance = 'On_Off_Screen_Leg_to_Seabed_clearance_' + v;
            return {
                led1: arr[On_Off_Screen_Leg_Position] ? arr[On_Off_Screen_Leg_Position] : 0.00,
                barValue: arr[On_Off_Screen_Leg_to_Seabed_bar] ? arr[On_Off_Screen_Leg_to_Seabed_bar] : 0.00,
                led2: arr[On_Off_Screen_Leg_to_Seabed_clearance] ? arr[On_Off_Screen_Leg_to_Seabed_clearance] : 0.00
            }
        }

    }
    GetComposedChartData = (xVal, yVal) => {

        const data1 = [
            { x: xVal, y: yVal }
        ]
        const data = [

            { index: 0, Y_Motion: 0, data1: data1 },
            { index: 1, Y_Motion: 2 },
            { index: 2, Y_Motion: 7 },
            { index: 14, Y_Motion: 30 },
            { index: 25, Y_Motion: 50 },

        ];
        return data;
    }
    renderLG() {
        const formData = this.state.returnData;
        const { tags } = this.state;
        const PORT = this.GetCurrentValue(formData, "PORT");
        const STBD = this.GetCurrentValue(formData, "STBD");
        const FWD = this.GetCurrentValue(formData, "FWD");
        const composedChartData = this.GetComposedChartData(formData.Curves_Touchdown_Bubble_X_Value, formData.Curves_Touchdown_Bubble_Y_Value);
        const seastateComposedChartData = this.GetComposedChartData(formData.Curves_Sea_State_Bubble_X_Value, formData.Curves_Sea_State_Bubble_Y_Value);

        return (
            <Container fluid={true}>
                <Row size="2" className="justify-content-around" >
                    <Col xs lg xl="2">
                        <DisplayData title="CD / LAT" value={parseInputToFixed2(formData.General_CD_Lat)} unit="FEET" width="80" font="big" />
                    </Col>
                    <Col xs lg xl="2">
                        <DisplayData title="TIDE" value={parseInputToFixed2(formData.General_Tide)} unit="FEET" width="80" font="big" />
                    </Col>
                    <Col md="auto"></Col>
                    <Col xs lg xl="2">
                        <DisplayData title="WATER DEPTH" value={parseInputToFixed2(formData.General_Water_Depth)} unit="FEET" width="80" font="big" />
                    </Col>
                    <Col xs lg xl="2">
                        <DisplayData title="DRAFT" value={parseInputToFixed2(formData.General_Vessel_Draft)} unit="FEET" width="80" font="big" />
                    </Col>
                </Row>
                <Row size="6" className="justify-content-around" >
                    <Col >
                        <Row><SectionHeader title="LEG TO SEABED CLEARANCE" /></Row>
                        <Row className="justify-content-md-center" >
                            <Col xs lg xl="2">
                                <>
                                    <Row style={{ height: "85%" }}><span style={{ color: "#fff" }} >LEG FLAG (ft.)</span></Row>
                                    <Row><span style={{ color: "#fff" }} >SEABED CLEARANCE (ft.)</span></Row>

                                </>
                            </Col>
                            <Col ><VerticalBar title="PORT" {...PORT} /></Col>
                            <Col  ><VerticalBar title="FWD"  {...FWD} /></Col>
                            <Col ><VerticalBar title="STBD" {...STBD} /></Col>
                            <Col xs lg xl="2">
                                <>
                                    <Row style={{ height: "85%" }}><span style={{ color: "#fff" }} >WATER LEVEL</span></Row>
                                    <Row ><span style={{ color: "#fff" }} >SEABED LEVEL</span></Row>
                                </>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs lg xl={6}>
                        <Row><SectionHeader title="VESSEL MOTIONS" /></Row>
                        <Row style={{ height: "10vh" }}>
                            <Col className="col-md-6" >
                                {this.GetCharts("Motion_Roll_Value")}
                                {/* <Row style={{ height: "100%" }}  >
                                 <Col xs md lg={1}   >
                                     <VerticalHeader title="ROLL(Deg)" />
                                 </Col>
                                 <Col xs md lg={11} >{this.GetCharts(this.state.Motion_Roll_Value)}</Col>
                                </Row> */}
                            </Col>
                            <Col className="col-md-6">{this.GetCharts("Motion_Surge_Value")}</Col>
                        </Row>
                        <Row style={{ height: "10vh" }}>
                            <Col className="col-md-6" >{this.GetCharts("Motion_Pitch_Value")}</Col>
                            <Col className="col-md-6">{this.GetCharts("Motion_Sway_Value")}</Col>
                        </Row>
                        <Row style={{ height: "10vh" }}>
                            <Col className="col-md-6" >{this.GetCharts("Motion_Yaw_Value")}</Col>
                            <Col className="col-md-6">{this.GetCharts("Motion_Heave_Value")}</Col>
                        </Row>
                        <Row style={{ height: "35vh" }}><SectionHeader title="SEA STATE" />
                            <Col className="col-md-8" >{this.GetCharts("Sea_State_Wave_Value")}</Col>
                            <Col className="col-md-4" >
                                <div style={{ color: "#fff", textAlign: "center" }} >LAST 5 MIN DATA</div>
                                <DisplayData title="SIG. WAVE HEIGHT" value={parseInputToFixed2(formData.Sea_State_Significant_Wave_Height)} unit="DEG" width="100" font="big" />
                                <DisplayData title="WAVE PERIOD" value={parseInputToFixed2(formData.Curves_Wave_Period)} unit="SEC" width="100" font="big" />
                                <DisplayData title="MAX. WAVE HEIGHT" value={parseInputToFixed2(formData.Curves_Maximum_Wave_Height)} unit="FEET" width="100" font="big" />
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row><SectionHeader title="MOTION LIMITS" /></Row>
                        <Row style={{ height: "30vh" }}>
                            <ComposedChart data={composedChartData} xaxisTitle="TOUCHDOWN BUBBLE X VALUE" yaxisTitle="TOUCHDOWN BUBBLE Y VALUE" />
                        </Row>
                        <Row><SectionHeader title="SEA STATE LIMITS" /></Row>
                        <Row style={{ height: "30vh" }}>
                            <ComposedChart data={seastateComposedChartData} xaxisTitle="SEA STATE BUBBLE X VALUE" yaxisTitle="SEA STATE BUBBLE Y VALUE" />
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
    renderMD() {
        const formData = this.state.returnData;
        const { tags } = this.state;
        const PORT = this.GetCurrentValue(formData, "PORT");
        const STBD = this.GetCurrentValue(formData, "STBD");
        const FWD = this.GetCurrentValue(formData, "FWD");
        const composedChartData = this.GetComposedChartData(formData.Curves_Touchdown_Bubble_X_Value, formData.Curves_Touchdown_Bubble_Y_Value);
        const seastateComposedChartData = this.GetComposedChartData(formData.Curves_Sea_State_Bubble_X_Value, formData.Curves_Sea_State_Bubble_Y_Value);

        return (
            <Container fluid={true}>
                <Row >
                    <Col xs md lg xl="2">
                        <DisplayData title="CD / LAT" value={parseInputToFixed2(formData.General_CD_Lat)} unit="FEET" width="80" font="big" />
                    </Col>
                    <Col xs md lg xl="2">
                        <DisplayData title="TIDE" value={parseInputToFixed2(formData.General_Tide)} unit="FEET" width="80" font="big" />
                    </Col>
                    <Col md="auto"></Col>
                    <Col xs md lg xl="2">
                        <DisplayData title="WATER DEPTH" value={parseInputToFixed2(formData.General_Water_Depth)} unit="FEET" width="80" font="big" />
                    </Col>
                    <Col xs md lg xl="2">
                        <DisplayData title="DRAFT" value={parseInputToFixed2(formData.General_Vessel_Draft)} unit="FEET" width="80" font="big" />
                    </Col>
                </Row>
                <Row >
                    <Col >
                        <Row><SectionHeader title="LEG TO SEABED CLEARANCE" /></Row>
                        <Row >
                            <Col>
                                <>
                                    <Row style={{ height: "85%" }}><span style={{ color: "#fff" }} >LEG FLAG (ft.)</span></Row>
                                    <Row><span style={{ color: "#fff" }} >SEABED CLEARANCE (ft.)</span></Row>

                                </>
                            </Col>
                            <Col ><VerticalBar title="PORT" {...PORT} /></Col>
                            <Col ><VerticalBar title="FWD"  {...FWD} /></Col>
                            <Col ><VerticalBar title="STBD" {...STBD} /></Col>
                            <Col>
                                <>
                                    <Row style={{ height: "85%" }}><span style={{ color: "#fff" }} >WATER LEVEL</span></Row>
                                    <Row ><span style={{ color: "#fff" }} >SEABED LEVEL</span></Row>
                                </>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="VESSEL MOTIONS" /></Row>
                        <Row style={{ height: "10vh" }}>
                            <Col className="col-md-6" >
                                {this.GetCharts("Motion_Roll_Value")}
                            </Col>
                            <Col className="col-md-6">{this.GetCharts("Motion_Surge_Value")}</Col>
                        </Row>
                        <Row style={{ height: "10vh" }}>
                            <Col className="col-md-6" >{this.GetCharts("Motion_Pitch_Value")}</Col>
                            <Col className="col-md-6">{this.GetCharts("Motion_Sway_Value")}</Col>
                        </Row>
                        <Row style={{ height: "10vh" }}>
                            <Col className="col-md-6" >{this.GetCharts("Motion_Yaw_Value")}</Col>
                            <Col className="col-md-6">{this.GetCharts("Motion_Heave_Value")}</Col>
                        </Row>
                        <Row style={{ height: "35vh" }}><SectionHeader title="SEA STATE" />
                            <Col className="col-md-8" >{this.GetCharts("Sea_State_Wave_Value")}</Col>
                            <Col className="col-md-4" >
                                <div style={{ color: "#fff", textAlign: "center" }} >LAST 5 MIN DATA</div>
                                <DisplayData title="SIG. WAVE HEIGHT" value={parseInputToFixed2(formData.Sea_State_Significant_Wave_Height)} unit="DEG" width="100" font="big" />
                                <DisplayData title="WAVE PERIOD" value={parseInputToFixed2(formData.Curves_Wave_Period)} unit="SEC" width="100" font="big" />
                                <DisplayData title="MAX. WAVE HEIGHT" value={parseInputToFixed2(formData.Curves_Maximum_Wave_Height)} unit="FEET" width="100" font="big" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="MOTION LIMITS" /></Row>
                        <Row style={{ height: "30vh" }}>
                            <ComposedChart data={composedChartData} xaxisTitle="TOUCHDOWN BUBBLE X VALUE" yaxisTitle="TOUCHDOWN BUBBLE Y VALUE" />
                        </Row>
                        <Row><SectionHeader title="SEA STATE LIMITS" /></Row>
                        <Row style={{ height: "30vh" }}>
                            <ComposedChart data={seastateComposedChartData} xaxisTitle="SEA STATE BUBBLE X VALUE" yaxisTitle="SEA STATE BUBBLE Y VALUE" />
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
    render() {
        var content = this.renderLG()
        if (this.props.renderFor === 1 || this.props.renderFor === 2) {
            content = this.renderMD()
        }
        return (
            <>
                {content}
            </>
        )
    }
}

export default withLayoutManager(Touchdown)