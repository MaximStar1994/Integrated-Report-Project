import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Power from '../../model/Power'
import Legend from './Legend'
import GeneratorStatus from './GeneratorStatus'
import PowerGauge from './PowerGauge'
import Breaker from './Breaker'
import SideBar from '../../components/SideBar/SideBar'
import './powerGauge.css';
import '../../css/App.css';
import {withLayoutManager} from '../../Helper/Layout/layout'
class PowerGeneration extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            data : undefined,
            tagname : ""
        };
        this.powerApi = new Power()
    }

    refreshData = () => {
        this.powerApi.GetPowerGeneration((val,err) => {
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
    
    renderLG() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data
        return(
            <SideBar>
                <Row>
                    <Col xs={1} > <Legend /> </Col>
                    <Col xs={{span : 11, offset : 0}} className="whiteHeading2" style={{textAlign : "center"}}>
                        POWER MANAGEMENT SYSTEM - POWER GENERATION
                    </Col>
                </Row>
                <Row style={{marginTop : "10px"}}>
                    <Col xs={{span : 12}}>
                        <div className="cardBG">
                            <Row>
                                <Col style={{margin : "10px"}}><PowerGauge data={data.engine1} /></Col>
                                <Col style={{margin : "10px"}}><PowerGauge data={data.engine2} /></Col>
                                <Col style={{margin : "10px"}}><PowerGauge data={data.engine3} /></Col>
                                <Col style={{margin : "10px"}}><PowerGauge data={data.engine4} /></Col>
                                <Col style={{margin : "10px"}}><PowerGauge data={data.engine5} /></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row style={{marginTop : "0"}}>
                    <Col xs={{span : 12}}>
                        <div style={{backgroundColor : "white"}}>
                            <Row>
                                <Col ><Breaker data={data.engine1} name="G1"/></Col>
                                <Col><Breaker data={data.engine2} name="G2"/></Col>
                                <Col><Breaker data={data.engine3} name="G3"/></Col>
                                <Col><Breaker data={data.engine4} name="G4"/></Col>
                                <Col><Breaker data={data.engine5} name="G5"/></Col>
                                <div style={{position : "absolute", left : "20px", bottom : "10%", fontWeight : "bold"}} >
                                    BUS 600V
                                </div>
                            </Row>
                            <Row noGuters={true} >
                                <Col>
                                    <div style={{height : "5px", width : "100%", backgroundColor : "#66cc33", marginBottom:"5px"}}>
                                        &nbsp;
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                
            </SideBar>
        )
    }
    renderMD() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data
        return (
            <>
            <Row>
                <Col xs={1} > <Legend /> </Col>
                <Col xs={{span : 11, offset : 0}} className="whiteHeading2" style={{textAlign : "center"}}>
                    POWER MANAGEMENT SYSTEM - POWER GENERATION
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={{span : 12}}>
                    <div className="cardBG">
                        <Row>
                            <Col style={{margin : "10px"}}><PowerGauge data={data.engine1} /></Col>
                            <Col style={{margin : "10px"}}><PowerGauge data={data.engine2} /></Col>
                            <Col style={{margin : "10px"}}><PowerGauge data={data.engine3} /></Col>
                            <Col style={{margin : "10px"}}><PowerGauge data={data.engine4} /></Col>
                            <Col style={{margin : "10px"}}><PowerGauge data={data.engine5} /></Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop : "0"}}>
                <Col xs={{span : 12}}>
                    <div style={{backgroundColor : "white"}}>
                        <Row>
                            <Col><Breaker data={data.engine1} name="G1"/></Col>
                            <Col><Breaker data={data.engine2} name="G2"/></Col>
                            <Col><Breaker data={data.engine3} name="G3"/></Col>
                            <Col><Breaker data={data.engine4} name="G4"/></Col>
                            <Col><Breaker data={data.engine5} name="G5"/></Col>
                            <div style={{position : "absolute", left : "20px", bottom : "10%", fontWeight : "bold"}} >
                                BUS 600V
                            </div>
                        </Row>
                        <Row noGuters={true} >
                            <Col>
                                <div style={{height : "5px", width : "100%", backgroundColor : "#66cc33", marginBottom:"5px"}}>
                                    &nbsp;
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
    renderSM() {
        if (this.state.data === undefined || this.state.data === null) {
            return (<></>)
        }
        var data = this.state.data
        return (
            <>
            <Row>
                <Col xs={2} > <Legend /> </Col>
                <Col xs={{span : 10, offset : 0}} className="whiteHeading2" style={{textAlign : "center"}}>
                    POWER MANAGEMENT SYSTEM - POWER GENERATION
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={{span : 12}}>
                    <div className="cardBG" style={{padding : "10px"}}>
                        <Row>
                            <Col xs={{span: 4, offset: 0}} ><PowerGauge data={data.engine1} /></Col>
                            <Col xs={{span: 4, offset: 0}} ><PowerGauge data={data.engine2} /></Col>
                            <Col xs={{span: 4, offset: 0}} ><PowerGauge data={data.engine3} /></Col>
                        </Row>
                        <Row style={{marginTop : "5px", marginBottom : "5px"}}>
                            <Col xs={{span: 4, offset: 2}} ><PowerGauge data={data.engine4} /></Col>
                            <Col xs={{span: 4, offset: 0}} ><PowerGauge data={data.engine5} /></Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop : "0"}}>
                <Col xs={{span : 12}}>
                    <div style={{backgroundColor : "white"}}>
                        <Row style={{position : "relative"}}>
                            <Col><Breaker data={data.engine1} name="G1"/></Col>
                            <Col><Breaker data={data.engine2} name="G2"/></Col>
                            <Col><Breaker data={data.engine3} name="G3"/></Col>
                            <div style={{position : "absolute", left : "20px", bottom : "10%", fontWeight : "bold"}} >
                                BUS 600V
                            </div>
                        </Row>
                        <Row noGutters={true} >
                            <Col>
                                <div style={{height : "5px", width : "100%", backgroundColor : "#66cc33", marginBottom:"5px"}}>
                                    &nbsp;
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col></Col>
                            <Col><Breaker data={data.engine4} name="G4"/></Col>
                            <Col><Breaker data={data.engine5} name="G5"/></Col>
                            <div style={{position : "absolute", left : "20px", bottom : "10%", fontWeight : "bold"}} >
                                BUS 600V
                            </div>
                        </Row>
                        <Row noGutters={true} >
                            <Col>
                                <div style={{height : "5px", width : "100%", backgroundColor : "#66cc33", marginBottom:"5px"}}>
                                    &nbsp;
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            </>
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

export default withLayoutManager(PowerGeneration);
