import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import fuelLNG_tankImage from '../../assets/FuelLngDashboard/fuelLNG_tankImage.png'
import SemiCircleGauge from './TMSemiGauge.js'
import ValueCard from '../../components/ValueCard/Home.js'
import TankMonitoringApi from '../../model/TankMonitoring.js'
import './Home.css'
class TMLayout extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tags: []
        }
        this.TankMonitoringApi = new TankMonitoringApi()
    }

    updateTags(){
        this.TankMonitoringApi.ListTankMonitoringTags((val) => {
            if (val === null) {
                return
            }
            this.setState({ tags: val })
        })
    }

    componentDidMount() {
        this.updateTags();
        this.timerID = setInterval(async () => this.updateTags(), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    fillTankValue = (Vapor, Level, Liquid) => {
        return (
            <div style={{ width: '100%', padding: '2%' }} >

                <Row>
                    <Col></Col>
                    <Col>
                        <ValueCard value={Vapor} unit="m³" />
                        <span className="cardLabelGrey" >Vapor Volume</span>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <ValueCard value={Level} unit="m" />
                        <span className="cardLabelGrey" >Level (corrected)</span>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <ValueCard value={Liquid} unit="m³" />
                        <span className="cardLabelGrey" >Liquid Volume</span>
                    </Col>
                    <Col></Col>
                </Row>



            </div>
        )
    }

    render() {

        var tags = this.state.tags;

        var gaugeData1 = [{ value: tags.CT1VaporPressure, color: '#0b8dbe', unit: 'bar' }]
        var gaugeData2 = [{ value: tags.Cargo1HoldSpacePress, color: '#0b8dbe', unit: 'bar' }]
        var gaugeData3 = [{ value: tags.Cargo2HoldSpacePress, color: '#0b8dbe', unit: 'bar' }]
        var gaugeData4 = [{ value: tags.CT2VaporPressure, color: '#0b8dbe', unit: 'bar' }]

        return (
            <>
                <Row className="justify-content-center" ><span className='xheader'>Cargo Tank Monitoring</span></Row>
                <Row style={{ justifyContent: 'center' }} >
                    <Col><span className='subheader' >Cargo Tank 1</span></Col>
                    <Col><span className='subheader' >Cargo Tank 2</span></Col>
                </Row>
                <Row >
                    <Col md lg xl={1} ></Col>
                    <Col md lg xl={2} >
                        <div className="gaugeStyle" ><SemiCircleGauge data={gaugeData1} maxVal={4} minVal={0}></SemiCircleGauge>
                            <span className="gaugeLabel" >Vapor Pressure</span></div>
                    </Col>
                    <Col md lg xl={2}>
                        <div className="gaugeStyle" ><SemiCircleGauge data={gaugeData2} maxVal={4} minVal={0}></SemiCircleGauge>
                            <span className="gaugeLabel" >Hold Space Pressure</span></div>
                    </Col>
                    <Col md lg xl={2} ></Col>
                    <Col md lg xl={2}>
                        <div className="gaugeStyle" ><SemiCircleGauge data={gaugeData3} maxVal={4} minVal={0}></SemiCircleGauge>
                            <span className="gaugeLabel" >Hold Space Pressure</span></div>
                    </Col>
                    <Col md lg xl={2}>
                        <div className="gaugeStyle" ><SemiCircleGauge data={gaugeData4} maxVal={4} minVal={0}></SemiCircleGauge>
                            <span className="gaugeLabel" >Vapor Pressure</span></div>
                    </Col>
                    <Col md lg xl={1} ></Col>
                </Row>
                <Row>
                    <Col className="pads"  >
                        <div style={{ position: 'relative' }} >
                            <Image style={{ position: 'absolute', width: '100%' }} src={fuelLNG_tankImage} />
                            {this.fillTankValue(tags.CT1VaporVolume, tags.CT1CorrectedLevel, tags.CT1LiquidVolume)}
                        </div>


                    </Col>
                    <Col className="pads" ><div style={{ position: 'relative' }} >
                        <Image style={{ position: 'absolute', width: '100%' }} src={fuelLNG_tankImage} />
                        {this.fillTankValue(tags.CT2VaporVolume, tags.CT2CorrectedLevel, tags.CT2LiquidVolume)}
                    </div></Col>
                </Row>
                <Row style={{ justifyContent: 'center' }}>
                    <Col md={5} >
                        <Row>
                            <Col md={4}  >
                                <div style={{ position: 'relative' }} ><ValueCard value={tags.CT1AverageLiquidTemp} unit="°C" />
                                    <span className="cardLabel" >Liquid Average Temperature</span></div></Col>
                            <Col md={4}><ValueCard value={tags.CT1AverageVaporTemp} unit="°C" />
                                <span className="cardLabel" >Vapor Average Temperature</span></Col>
                            <Col md={4}><ValueCard value={tags.Cargo1HoldSpaceTemp} unit="°C" />
                                <span className="cardLabel" >Hold Space Temperature</span></Col>

                        </Row>
                    </Col>
                    <Col md={1}></Col>
                    <Col md={5} >
                        <Row>
                            <Col md={4}><ValueCard value={tags.Cargo2HoldSpaceTemp} unit="°C" />
                                <span className="cardLabel" >Hold Space Temperature</span></Col>
                            <Col md={4}><ValueCard value={tags.CT2AverageVaporTemp} unit="°C" />
                                <span className="cardLabel" >Vapor Average Temperature</span></Col>
                            <Col md={4}><ValueCard value={tags.CT2AverageLiquidTemp} unit="°C" />
                                <span className="cardLabel" >Liquid Average Temperature</span></Col>
                        </Row>
                    </Col>

                </Row>
            </>
        )
    }
}
export default TMLayout