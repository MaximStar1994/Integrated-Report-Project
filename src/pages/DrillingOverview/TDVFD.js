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
import TDLuboilBlower from './TDLuboilBlower'
import {withLayoutManager} from '../../Helper/Layout/layout'
class TopdriveVFD extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.rigApi = new Rig()
        this.interval = undefined
        this.state={}
    }

    refreshData = () => {
        this.rigApi.GetDrillingVFDs((val,err) => {
            if (val === null || val === undefined) {
                return
            }
            this.setState({data : val.topDrive})
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
        return (
        <>
        <Row>
            <LegendInfo />
            <Col xs={12} style={{textAlign : "center"}}>
                <div style={{padding : "10px", paddingBottom : "0px", color : "white"}}>VARIABLE FREQUENCY DRIVES - TOP DRIVE</div>
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
                        <TDLuboilBlower data={data} />
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
                        <TDLuboilBlower data={data} />
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

export default withLayoutManager(TopdriveVFD);
