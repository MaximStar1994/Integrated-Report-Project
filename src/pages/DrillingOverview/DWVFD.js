import React from 'react';
import {Row,Col} from 'react-bootstrap'
import Rig from '../../model/Rig.js'

import LegendInfo from './LegendInfo.js'
import CommunicationLink from './CommunicationLinkAlarms'
import DSU from './DSU'
import Gauges from './VFDGauges'
import Chopper from './Chopper.js'
import Inverter from './Inverter.js'
import CommonAux from './CommonAux.js'
import Blower from './DWBlower'
import {withLayoutManager} from '../../Helper/Layout/layout'
class DrawworksVFD extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.rigApi = new Rig()
        this.interval = undefined
        this.state={
            key : props.eventKey
        }
    }

    refreshData = () => {
        this.rigApi.GetDrillingVFDs((val,err) => {
            if (val === null || val === undefined) {
                return
            }
            if (this.state.key === "dwa") {
                this.setState({data : val.dwa})
            }
            if (this.state.key === "dwb") {
                this.setState({data : val.dwb})
            }
            if (this.state.key === "dwc") {
                this.setState({data : val.dwc})
            }
        }) 
    }
    componentDidMount() {
        this.interval = setInterval(this.refreshData, 5000);
        this.refreshData()
    }
    componentWillMount() {
        clearInterval(this.interval)
    }
    render() {
        var data = this.state.data
        if (data === undefined || data === null) {
            return (<> </>)
        }
        var dw = "A"
        if (this.state.key === "dwb") {
            dw = "B"
        }
        if (this.state.key === "dwc") {
            dw = "C"
        }
        return (
        <>
        <Row>
            <LegendInfo />
            <Col xs={12} style={{textAlign : "center"}}>
                <div style={{padding : "10px", paddingBottom : "0px", color : "white"}}>VARIABLE FREQUENCY DRIVES - Drawworks {dw}</div>
            </Col>
        </Row>
        
        <Row style={{marginTop : "5px"}}>
            <Col>
                <Gauges data={data}/>
            </Col>
        </Row>
        <CommunicationLink data={data}/>
        <Row noGutters={true} style={{marginTop : "5px"}}>
            <Col xs={6} sm={4} style={{padding : "5px"}}>
                <DSU data={data} />
            </Col>
            <Col xs={6} sm={4} style={{padding : "5px"}} >
                <Chopper data={data} />
            </Col>
            <Col xs={{span : 12}} sm={{span : 4, offset : 0}} style={{padding : this.props.renderFor !== 2 ? "5px" : "", display : "flex", flexDirection : "column"}}>
                {this.props.renderFor === 2 ? <>
                <Row noGutters={true}>
                    <Col style={{padding : "5px"}}>
                        <Inverter data={data} />
                    </Col>
                    <Col style={{padding : "5px"}}>
                        <Blower data={data} />
                    </Col>
                </Row>
                </> : 
                <>
                <Row >
                    <Col>
                        <Inverter data={data} />
                    </Col>
                </Row>
                <Row className="flex-grow-1" style={{marginTop : "10px"}}>
                    <Col>
                        <Blower data={data} />
                    </Col>
                </Row>
                </>
                }
            </Col>
        </Row>
        <Row style={{marginTop : "5px"}}>
            <Col>
                <CommonAux data={data} />
            </Col>
        </Row>
        </>
        )
    }
}

export default withLayoutManager(DrawworksVFD);
