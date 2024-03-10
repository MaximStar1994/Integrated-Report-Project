import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../css/App.css';
import '../../css/Dashboard.css';
import Tag from '../../model/Tag.js'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import BarChart from '../../components/BarChart/BarChart'
import './AssetMaintenance.css';
import WorkOrderImg from '../../assets/assetMaintainacePF-curve.jpg'
import AssetMaintenanceSideBar from '../../components/SideBar/AssetMaintenanceSideBar'
import {withLayoutManager} from '../../Helper/Layout/layout'
class AssetManagement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            organization : "-",
            project : "-",
            renderFor : props.renderFor, // 0 for desktop, 1 for ipad, 2 for mobile 
        };
        this.cicle1 = React.createRef()
        this.tagController = new Tag()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.renderFor !== state.renderFor) {
            state.renderFor = props.renderFor
            return state
        } else {
            return null
        }
    }

    renderLG() {
        var height = this.circle1 ? this.circle1.offsetWidth+"px" : "auto"
        var curDate = new Date()
        var data = []
        for(var i =0; i<12; i++) {
            curDate.setMonth(curDate.getMonth() + 1)
            const month = curDate.toLocaleString('default', { month: 'short' });
            data.push({name : month, value : 0})
        }
        return(
            <AssetMaintenanceSideBar>
           <DashboardCardWithHeader title="Asset Maintenance">
               <Row>
                   <Col>
                        <div className="blueHeading2" style={{padding : "15px"}} >Total Work Order : 0</div>
                   </Col>
               </Row>
               <Row>
                   <Col xs={4}>
                       <Row style={{height : "100%"}}>
                           <Col xs={{span : 11, offset : 1}} sm={{span : 6, offset : 3}} lg={{span : 4, offset : 4}} style={{display : "flex", height : "100%"}}>
                            <div ref={(ref) => {this.circle1 = ref}} 
                               style={{
                                   paddingTop : "100%",
                                   borderRadius : "50%",
                                   width : "100%",
                                   margin : "auto",
                                   display : "flex",
                                   alignItems :"center",
                                   backgroundColor : "#0b1829"
                               }}>
                                   <div style={{marginLeft : "auto", marginRight : "auto", marginTop : "-100%"}}>
                                       <div className="whiteHeading1" style={{textAlign : "center"}}>0</div>
                                       <div className="blueHeading3" style={{textAlign : "center"}}>Work Order Completed</div>
                                   </div>
                               </div>
                           </Col>
                       </Row>
                   </Col>
                   <Col xs={8}>
                       <img src={WorkOrderImg} />
                       <div style={{
                           position : "absolute",
                           top : "50%",
                           left : "20%"
                       }}>
                           <div className="whiteHeading1">0</div>
                       </div>
                       <div style={{
                           position : "absolute",
                           top : "50%",
                           left : "45%"
                       }}>
                           <div className="whiteHeading1">0</div>
                       </div>
                       <div style={{
                           position : "absolute",
                           top : "50%",
                           left : "70%"
                       }}>
                           <div className="whiteHeading1">0</div>
                       </div>
                   </Col>
               </Row>
               <Row>
                   <Col xs={4}>
                       <Row style={{height : "100%"}}>
                           <Col xs={{span : 11, offset : 1}} sm={{span : 6, offset : 3}} lg={{span : 4, offset : 4}} style={{display : "flex", height : "100%"}}>
                               <div ref={(ref) => {this.circle1 = ref}} 
                                style={{
                                    paddingTop : "100%",
                                    borderRadius : "50%",
                                    width : "100%",
                                    margin : "auto",
                                    display : "flex",
                                    alignItems :"center",
                                    backgroundColor : "#0b1829"
                                }}>
                                    <div style={{marginLeft : "auto", marginRight : "auto", marginTop : "-100%"}}>
                                       <div className="whiteHeading1" style={{textAlign : "center"}}>0</div>
                                       <div className="blueHeading3" style={{textAlign : "center"}}>Work Order In Progress</div>
                                   </div>
                               </div>
                           </Col>
                       </Row>
                   </Col>
                   <Col xs={8}>
                        <Row style={{marginTop : "15px", marginBottom : "15px"}}>
                            <Col>
                                <div className="blueHeading3">Open Work Order Trend</div>
                            </Col>
                        </Row>
                        <Row style={{height : "200px"}}>
                            <Col>
                                <BarChart data={data}></BarChart>
                            </Col>
                        </Row>
                   </Col>
               </Row>
           </DashboardCardWithHeader>
           </AssetMaintenanceSideBar>
        )
    }
    renderSM() {
        var height = this.circle1 ? this.circle1.offsetWidth+"px" : "auto"
        var curDate = new Date()
        var data = []
        for(var i =0; i<12; i++) {
            curDate.setMonth(curDate.getMonth() + 1)
            const month = curDate.toLocaleString('default', { month: 'short' });
            data.push({name : month, value : 0})
        }
        return (
            <DashboardCardWithHeader title="Asset Maintenance" >
               <Row>
                   <Col>
                        <div className="blueHeading2" style={{padding : "15px"}} >Total Work Order : 0</div>
                   </Col>
               </Row>
               <Row>
                   <Col xs={12}>
                       <img src={WorkOrderImg} />
                       <div style={{
                           position : "absolute",
                           top : "50%",
                           left : "22.5%"
                       }}>
                           <div className="whiteHeading2">0</div>
                       </div>
                       <div style={{
                           position : "absolute",
                           top : "50%",
                           left : "45%"
                       }}>
                           <div className="whiteHeading2">0</div>
                       </div>
                       <div style={{
                           position : "absolute",
                           top : "50%",
                           left : "68%"
                       }}>
                           <div className="whiteHeading2">0</div>
                       </div>
                   </Col>
                </Row>
                <Row style={{marginTop : "10px"}}>
                   <Col xs={12}>
                       <Row style={{height : "100%"}}>
                           <Col xs={{span : 4, offset : 1}} style={{display : "flex", height : "100%"}}>
                               <div ref={(ref) => {this.circle1 = ref}} 
                               style={{
                                    paddingTop : "100%",
                                    borderRadius : "50%",
                                    width : "100%",
                                    margin : "auto",
                                    display : "flex",
                                    alignItems :"center",
                                    backgroundColor : "#0b1829"
                                }}>
                                    <div style={{marginLeft : "auto", marginRight : "auto", marginTop : "-100%"}}>
                                       <div className="whiteHeading2" style={{textAlign : "center"}}>0</div>
                                       <div className="blueHeading3" style={{textAlign : "center"}}>Work Order Completed</div>
                                   </div>
                               </div>
                           </Col>
                           <Col xs={{span : 4, offset : 2}} style={{display : "flex", height : "100%"}}>
                               <div ref={(ref) => {this.circle1 = ref}} 
                                style={{
                                    paddingTop : "100%",
                                    borderRadius : "50%",
                                    width : "100%",
                                    margin : "auto",
                                    display : "flex",
                                    alignItems :"center",
                                    backgroundColor : "#0b1829"
                                }}>
                                    <div style={{marginLeft : "auto", marginRight : "auto", marginTop : "-100%"}}>
                                       <div className="whiteHeading2" style={{textAlign : "center"}}>0</div>
                                       <div className="blueHeading3" style={{textAlign : "center"}}>Work Order In Progress</div>
                                   </div>
                               </div>
                           </Col>
                       </Row>
                   </Col>
               </Row>
               <Row>
                   <Col xs={12}>
                        <Row style={{marginTop : "15px", marginBottom : "15px"}}>
                            <Col>
                                <div className="blueHeading3" style={{padding : "15px"}}>Open Work Order Trend</div>
                            </Col>
                        </Row>
                        <Row style={{height : "200px"}}>
                            <Col xs={12}>
                                <BarChart data={data}></BarChart>
                            </Col>
                        </Row>
                   </Col>
               </Row>
           </DashboardCardWithHeader>
        )
    }
    render() {
        if (this.state.renderFor === undefined) {
            return(<></>)
        }
        var contents = this.renderLG()
        if (this.state.renderFor === 2) {
            contents = this.renderSM()
        }
        if (this.state.renderFor === 1) {
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
