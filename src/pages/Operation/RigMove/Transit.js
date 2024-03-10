import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SectionHeader from '../../../components/SectionHeader/Header.js';
import DisplayData from '../../../components/Display/Display.js';
import TrendChart from '../../../components/TrendChart_RigMove/TrendChart.js';
import ComposedChart from '../../../components/ComposedChart/composedChart.js';
import RigmoveApi from '../../../model/Rigmove.js';
import { parseInputToFixed2 } from '../../../Helper/GeneralFunc/parseInputToFixed2.js';
import { transistRefreshInterval } from '../../../Helper/GeneralFunc/setIntervals.js'
import { withLayoutManager } from '../../../Helper/Layout/layout'
class Transist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectname: localStorage.getItem("project") || "B357",
            returnData: [],
            composedChartData: []
        }
        this.RigmoveApi = new RigmoveApi();
        this._isMounted = false;
    }
    componentDidMount() {

        try {

            this._isMounted = true;
            this.GetCurrentValue();
            this.timerID = setInterval(async () => this.GetCurrentValue(), transistRefreshInterval);
        } catch (e) {
            console.log(e);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.timerID);
    }



    GetCurrentValue = () => {

        this.RigmoveApi.GetValue(this.state.projectname, 'AC_RC_Ops_RigMove', (val, err) => {
            if (val === null) {
                return
            }
            else {
                if (this._isMounted == true)
                    this.setState({ returnData: val }, () => {
                        this.GetComposedChartData()
                    });
            }
        })
    }

    GetComposedChartData = () => {
        const formData = this.state.returnData;
        const data1 = [
            { x: formData.Curves_Transit_Bubble_X_Value, y: formData.Curves_Transit_Bubble_Y_Value }
        ]
        const data = [

            { index: 0, Y_Motion: 0, data1: data1 },
            { index: 1, Y_Motion: 2 },
            { index: 2, Y_Motion: 7 },
            { index: 14, Y_Motion: 30 },
            { index: 25, Y_Motion: 50 },

        ];
        this.setState({ composedChartData: data });

    }

    GetCharts = (v) => {
        let tagname = `${this.state.projectname}_${v}`
        return (
            <TrendChart tagnames={tagname} showLegend={false} />
        )
    }

    renderLG() {
        const formData = this.state.returnData;
        const chartData = this.state.composedChartData
        return (
            <Container fluid={true}>
                <Row className="justify-content-around" >
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
                <Row className="justify-content-around" >
                    <Col className="col-md-4" >
                        <Row><SectionHeader title="ROLL (DEGREE)" /></Row>
                        <Row style={{ height: "20vh" }} >
                            {this.GetCharts("Motion_Roll_Value")}</Row>
                        <Row><SectionHeader title="PITCH (DEGREE)" /></Row>
                        <Row style={{ height: "20vh" }}>
                            {this.GetCharts("Motion_Pitch_Value")}</Row>
                        <Row><SectionHeader title="HEAVE (FEET)" /></Row>
                        <Row style={{ height: "20vh" }}>
                            {this.GetCharts("Motion_Heave_Value")}</Row>
                    </Col>
                    <Col className="col-md-2">
                        <>
                            <Row><SectionHeader title="PROCESS DATA(5 MINS.)" /></Row>
                            <Row className="justify-content-around"><DisplayData title="AVERAGE" value={parseInputToFixed2(formData.Motion_Roll_Average)} unit="DEG" width="100" font="small" /></Row>
                            <Row className="justify-content-between"><DisplayData title="MIN (DEG)" value={parseInputToFixed2(formData.Motion_Roll_Minimum)} unit="DEG" width="45" font="small" />
                                <DisplayData title="MAX(DEG)" value={parseInputToFixed2(formData.Motion_Roll_Maximum)} unit="DEG" width="45" font="small" /></Row>
                            <Row className="justify-content-around"><DisplayData title="PERIOD" value={parseInputToFixed2(formData.Motion_Roll_Period)} unit="DEG" width="100" font="small" /></Row>
                        </>
                        <>
                            <Row><SectionHeader title="PROCESS DATA(5 MINS.)" /></Row>
                            <Row className="justify-content-around"><DisplayData title="AVERAGE" value={parseInputToFixed2(formData.Motion_Pitch_Average)} unit="DEG" width="100" font="small" /></Row>
                            <Row className="justify-content-between"><DisplayData title="MIN (DEG)" value={parseInputToFixed2(formData.Motion_Pitch_Minimum)} unit="DEG" width="45" font="small" />
                                <DisplayData title="MAX (DEG)" value={parseInputToFixed2(formData.Motion_Pitch_Maximum)} unit="DEG" width="45" font="small" /></Row>
                            <Row className="justify-content-around"><DisplayData title="PERIOD" value={parseInputToFixed2(formData.Motion_Pitch_Period)} unit="DEG" width="100" font="small" /></Row>
                        </>
                        <>
                            <Row><SectionHeader title="PROCESS DATA(5 MINS.)" /></Row>
                            <Row className="justify-content-around"><DisplayData title="AVERAGE" value={parseInputToFixed2(formData.Motion_Heave_Average)} unit="FEET" width="100" font="small" /></Row>
                            <Row className="justify-content-between"><DisplayData title="MIN (FEET)" value={parseInputToFixed2(formData.Motion_Heave_Minimum)} unit="FEET" width="45" font="small" />
                                <DisplayData title="MAX (FEET)" value={parseInputToFixed2(formData.Motion_Heave_Maximum)} unit="FEET" width="45" font="small" /></Row>
                            <Row className="justify-content-around"><DisplayData title="PERIOD" value={parseInputToFixed2(formData.Motion_Heave_Period)} unit="FEET" width="100" font="small" /></Row>
                        </>
                    </Col>
                    <Col className="col-md-5">
                        <Row><SectionHeader title="TRANSIT CRITICAL MOTION CURVE" /></Row>
                        <Row><DisplayData title="MIN (DEG)" value={parseInputToFixed2(formData.Curves_Transit_Curve_Selection)} unit="DEG" width="30" font="small" /></Row>
                        <Row style={{ height: "60vh" }} >
                            <ComposedChart data={chartData} />
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
    renderMD() {
        const formData = this.state.returnData;
        const chartData = this.state.composedChartData
        return (
            <Container fluid={true}>
                <Row className="justify-content-around" >
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
                <Row className="justify-content-around" >
                    <Col>
                        <Row><SectionHeader title="ROLL (DEGREE)" /></Row>
                        <Row style={{ height: "20vh" }} >
                            {this.GetCharts("Motion_Roll_Value")}</Row>
                        <>
                            <Row><SectionHeader title="PROCESS DATA(5 MINS.)" /></Row>
                            <Row className="justify-content-around"><DisplayData title="AVERAGE" value={parseInputToFixed2(formData.Motion_Roll_Average)} unit="DEG" width="100" font="small" /></Row>
                            <Row className="justify-content-between"><DisplayData title="MIN (DEG)" value={parseInputToFixed2(formData.Motion_Roll_Minimum)} unit="DEG" width="45" font="small" />
                                <DisplayData title="MAX(DEG)" value={parseInputToFixed2(formData.Motion_Roll_Maximum)} unit="DEG" width="45" font="small" /></Row>
                            <Row className="justify-content-around"><DisplayData title="PERIOD" value={parseInputToFixed2(formData.Motion_Roll_Period)} unit="DEG" width="100" font="small" /></Row>
                        </>


                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="PITCH (DEGREE)" /></Row>
                        <Row style={{ height: "20vh" }}>
                            {this.GetCharts("Motion_Pitch_Value")}</Row>
                        <>
                            <Row><SectionHeader title="PROCESS DATA(5 MINS.)" /></Row>
                            <Row className="justify-content-around"><DisplayData title="AVERAGE" value={parseInputToFixed2(formData.Motion_Pitch_Average)} unit="DEG" width="100" font="small" /></Row>
                            <Row className="justify-content-between"><DisplayData title="MIN (DEG)" value={parseInputToFixed2(formData.Motion_Pitch_Minimum)} unit="DEG" width="45" font="small" />
                                <DisplayData title="MAX (DEG)" value={parseInputToFixed2(formData.Motion_Pitch_Maximum)} unit="DEG" width="45" font="small" /></Row>
                            <Row className="justify-content-around"><DisplayData title="PERIOD" value={parseInputToFixed2(formData.Motion_Pitch_Period)} unit="DEG" width="100" font="small" /></Row>
                        </>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="HEAVE (FEET)" /></Row>
                        <Row style={{ height: "20vh" }}>
                            {this.GetCharts("Motion_Heave_Value")}</Row>
                        <>
                            <Row><SectionHeader title="PROCESS DATA(5 MINS.)" /></Row>
                            <Row className="justify-content-around"><DisplayData title="AVERAGE" value={parseInputToFixed2(formData.Motion_Heave_Average)} unit="FEET" width="100" font="small" /></Row>
                            <Row className="justify-content-between"><DisplayData title="MIN (FEET)" value={parseInputToFixed2(formData.Motion_Heave_Minimum)} unit="FEET" width="45" font="small" />
                                <DisplayData title="MAX (FEET)" value={parseInputToFixed2(formData.Motion_Heave_Maximum)} unit="FEET" width="45" font="small" /></Row>
                            <Row className="justify-content-around"><DisplayData title="PERIOD" value={parseInputToFixed2(formData.Motion_Heave_Period)} unit="FEET" width="100" font="small" /></Row>
                        </>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="TRANSIT CRITICAL MOTION CURVE" /></Row>
                        <Row><DisplayData title="MIN (DEG)" value={parseInputToFixed2(formData.Curves_Transit_Curve_Selection)} unit="DEG" width="30" font="small" /></Row>
                        <Row style={{ height: "60vh" }} >
                            <ComposedChart data={chartData} />
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
export default withLayoutManager(Transist); 