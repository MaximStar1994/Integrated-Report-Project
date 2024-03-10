import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DisplayData from '../../../components/Display/Display.js';
import { parseInputToFixed2 } from '../../../Helper/GeneralFunc/parseInputToFixed2.js';
import SectionHeader from '../../../components/SectionHeader/Header.js';
import TrendChart from '../../../components/TrendChart_RigMove/TrendChart.js';
import RigmoveApi from '../../../model/Rigmove.js';
import { withLayoutManager } from '../../../Helper/Layout/layout'
class LegPenetration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectname: localStorage.getItem("project") || "B357",
            Motion_Roll_Value: "Motion_Roll_Value",
            Motion_Pitch_Value: "Motion_Pitch_Value",
            Motion_Heave_Value: "Motion_Heave_Value",
            returnData: []
        }
        this.RigmoveApi = new RigmoveApi();
    }
    componentDidMount() {
        this.RigmoveApi.GetValue(this.state.projectname, 'AC_RC_Ops_RigMove', (val, err) => {
            if (val === null) {
                return
            }
            else {
                this.setState({ returnData: val });
            }
        })
    }

    GetCharts = (v) => {
        let tagname = `${this.state.projectname}_${v}`
        return (
            <TrendChart tagnames={tagname} xOrientation="top" />
        )
    }
    renderLG() {
        const formData = this.state.returnData;
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
                        <DisplayData title="AIR GAP" value={parseInputToFixed2(formData.General_Vessel_Draft)} unit="FEET" width="80" font="big" />
                    </Col>
                </Row>
                <Row className="justify-content-around" >
                    <Col className="col-md-3">
                        <Row><SectionHeader title="PORT LEG" /></Row>
                        <Row className="justify-content-center"><DisplayData title="LEG LOAD" value={parseInputToFixed2(formData.Penetration_Screen_PORT_Leg_Load)} unit="KIPS" width="60" font="big" /></Row>
                        <Row style={{ height: "50vh" }} >
                            {this.GetCharts()}
                        </Row>
                        <Row className="justify-content-around" >
                            <DisplayData title="LEG PENETRATION" value={parseInputToFixed2(formData.Penetration_Screen_PORT_Leg_Penetration)} unit="FEET" width="30" font="big" />
                            <DisplayData title="SPUDCAN" value={parseInputToFixed2(formData.Penetration_Screen_PORT_Spudcan_Reaction)} unit="KIPS" width="30" font="big" />
                        </Row>
                    </Col>
                    <Col className="col-md-3">
                        <Row><SectionHeader title="FWD LEG" /></Row>
                        <Row className="justify-content-center" >
                            <DisplayData title="LEG LOAD" value={parseInputToFixed2(formData.Penetration_Screen_FWD_Leg_Load)} unit="KIPS" width="60" font="big" />

                        </Row>
                        <Row style={{ height: "50vh" }} >
                            {this.GetCharts()}
                        </Row>
                        <Row className="justify-content-around">
                            <DisplayData title="LEG PENETRATION" value={parseInputToFixed2(formData.Penetration_Screen_FWD_Leg_Penetration)} unit="FEET" width="30" font="big" />
                            <DisplayData title="SPUDCAN" value={parseInputToFixed2(formData.Penetration_Screen_FWD_Spudcan_Reaction)} unit="KIPS" width="30" font="big" />
                        </Row>
                    </Col>
                    <Col className="col-md-3">
                        <Row><SectionHeader title="STBD LEG" /></Row>
                        <Row className="justify-content-center"><DisplayData title="LEG LOAD" value={parseInputToFixed2(formData.Penetration_Screen_STBD_Leg_Load)} unit="KIPS" width="60" font="big" /></Row>
                        <Row style={{ height: "50vh" }} >
                            {this.GetCharts()}
                        </Row>
                        <Row className="justify-content-around" >
                            <DisplayData title="LEG PENETRATION" value={parseInputToFixed2(formData.Penetration_Screen_STBD_Leg_Penetration)} unit="FEET" width="30" font="big" />
                            <DisplayData title="SPUDCAN" value={parseInputToFixed2(formData.Penetration_Screen_STBD_Spudcan_Reaction)} unit="KIPS" width="30" font="big" />
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }

    renderMD() {
        const formData = this.state.returnData;
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
                        <DisplayData title="AIR GAP" value={parseInputToFixed2(formData.General_Vessel_Draft)} unit="FEET" width="80" font="big" />
                    </Col>
                </Row>
                <Row className="justify-content-around" >
                    <Col>
                        <Row><SectionHeader title="PORT LEG" /></Row>
                        <Row className="justify-content-center"><DisplayData title="LEG LOAD" value={parseInputToFixed2(formData.Penetration_Screen_PORT_Leg_Load)} unit="KIPS" width="60" font="big" /></Row>
                        <Row style={{ height: "50vh" }} >
                            {this.GetCharts()}
                        </Row>
                        <Row className="justify-content-around" >
                            <DisplayData title="LEG PENETRATION" value={parseInputToFixed2(formData.Penetration_Screen_PORT_Leg_Penetration)} unit="FEET" width="30" font="big" />
                            <DisplayData title="SPUDCAN" value={parseInputToFixed2(formData.Penetration_Screen_PORT_Spudcan_Reaction)} unit="KIPS" width="30" font="big" />
                        </Row>
                    </Col>


                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="FWD LEG" /></Row>
                        <Row className="justify-content-center" >
                            <DisplayData title="LEG LOAD" value={parseInputToFixed2(formData.Penetration_Screen_FWD_Leg_Load)} unit="KIPS" width="60" font="big" />

                        </Row>
                        <Row style={{ height: "50vh" }} >
                            {this.GetCharts()}
                        </Row>
                        <Row className="justify-content-around">
                            <DisplayData title="LEG PENETRATION" value={parseInputToFixed2(formData.Penetration_Screen_FWD_Leg_Penetration)} unit="FEET" width="30" font="big" />
                            <DisplayData title="SPUDCAN" value={parseInputToFixed2(formData.Penetration_Screen_FWD_Spudcan_Reaction)} unit="KIPS" width="30" font="big" />
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row><SectionHeader title="STBD LEG" /></Row>
                        <Row className="justify-content-center"><DisplayData title="LEG LOAD" value={parseInputToFixed2(formData.Penetration_Screen_STBD_Leg_Load)} unit="KIPS" width="60" font="big" /></Row>
                        <Row style={{ height: "50vh" }} >
                            {this.GetCharts()}
                        </Row>
                        <Row className="justify-content-around" >
                            <DisplayData title="LEG PENETRATION" value={parseInputToFixed2(formData.Penetration_Screen_STBD_Leg_Penetration)} unit="FEET" width="30" font="big" />
                            <DisplayData title="SPUDCAN" value={parseInputToFixed2(formData.Penetration_Screen_STBD_Spudcan_Reaction)} unit="KIPS" width="30" font="big" />
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

export default withLayoutManager(LegPenetration);