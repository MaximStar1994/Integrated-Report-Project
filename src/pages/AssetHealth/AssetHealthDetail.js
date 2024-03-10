import React from 'react';

import SideBar from '../../components/SideBar/SideBar.js';
import DashboardCard from '../../components/DashboardCard/DashboardCardWithHeader'
import StatusLight from '../../components/StatusLight/StatusLight.js';
import AssetEquipmentHealth from './AssetEquipmentHealth'
import AssetStaticDetails from '../../components/AssetStaticDetailsCard/AssetStaticDetailsCard.js';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import '../../css/AssetHealthDetail.css'
import HelpIcon from '../../assets/HelpIcon.png'
import Asset from '../../model/Asset.js'
import {withLayoutManager} from '../../Helper/Layout/layout'

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#022A3A',
      fontSize: "1.0rem",
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

class AssetHealthDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            display : "",
            health : "default",
            equipment : [],
            loaded : false,
            assetName : props.assetName
        };
        this.assetController = new Asset()
    }

    GetStaticData(assetName) {
        this.assetController.GetStaticValue(assetName, (value, error) => {
            var prevState = this.state
            if (error === null) {
                prevState.display = value[0].AssetName
                prevState.equipment = value[0].e
            }
            this.setState(prevState)
        })
    }

    GetCurrentHealth(assetName) {
        this.assetController.GetAssetCurrHealth(assetName, (value,err) => {
            if (err === null) {
                this.setState({health : value.Description.toLowerCase()})
            }
        })
    }
    componentDidMount() {
        this.GetCurrentHealth(this.state.assetName)
        this.GetStaticData(this.state.assetName)
    }
    componentDidUpdate(prevProps) {
        if (this.props.assetName !== prevProps.assetName) {
            this.setState({assetName : this.props.assetName})
            this.GetCurrentHealth(this.props.assetName)
            this.GetStaticData(this.props.assetName)
        }
    }

    renderMD() {
        return(
            <>
            <Row>
                <Col className="blueHeading1" style={{textAlign : "center"}}>
                    Asset Health
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign : "right", margin: "10px"}}>
                    {this.renderHTMLToolTip()}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div style={{backgroundColor : "#04384c", margin : "10px"}}>
                        <Row>
                            <Col xs={6}>
                                <Row style={{alignItems : "center"}}>
                                    <Col xs={2} style={{padding : "10px 20px", paddingBottom : "0", textAlign : "right"}}>
                                        <StatusLight status={this.state.health} width="10px"></StatusLight>
                                    </Col>
                                    <Col xs={10} className="mainAssetTitle">
                                        {this.state.display}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div style={{padding : "5px"}}>
                                            <AssetStaticDetails colRenderingFor="left" asset={this.state.assetName} equipment={this.state.equipment} display={this.state.display}></AssetStaticDetails>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <div style={{padding : "10px"}}>
                                    <AssetStaticDetails colRenderingFor="right" asset={this.state.assetName} equipment={this.state.equipment} display={this.state.display}></AssetStaticDetails>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{margin : "10px"}}>
                        <AssetEquipmentHealth assetname={this.state.assetName}/>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
    renderSM() {
        return(
            <>
            <Row>
                <Col className="blueHeading1" style={{textAlign : "center"}}>
                    Asset Health
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign : "right"}}>
                    {this.renderHTMLToolTip()}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div style={{backgroundColor : "#04384c", margin : "10px"}}>
                        <Row>
                            <Col xs={12}>
                                <Row style={{alignItems : "center"}}>
                                    <Col xs={2} style={{padding : "10px 20px", paddingBottom : "0", textAlign : "right"}}>
                                        <StatusLight status={this.state.health} width="10px"></StatusLight>
                                    </Col>
                                    <Col xs={10} className="mainAssetTitle">
                                        {this.state.display}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div style={{padding : "5px 10px"}}>
                                            <AssetStaticDetails colRenderingFor="left" asset={this.state.assetName} equipment={this.state.equipment} display={this.state.display}></AssetStaticDetails>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <div style={{padding : "10px"}}>
                                    <AssetStaticDetails colRenderingFor="right" asset={this.state.assetName} equipment={this.state.equipment} display={this.state.display}></AssetStaticDetails>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{margin : "10px"}}>
                        <AssetEquipmentHealth assetname={this.state.assetName}/>
                    </div>
                </Col>
            </Row>
            </>
        )
    }
    renderHTMLToolTip() {
        return (
        <HtmlTooltip
            placement = "left-start"
            title={
            <React.Fragment>
                <Row>
                    <Col className="lightBlueValue">
                        Display aggregated health condition of asset
                    </Col>
                </Row>
                <Row style={{marginTop : "30px", marginBottom : "15px", marginLeft: "0px"}}>
                    <Col className="blueHeading2">
                        Historical Component Health
                    </Col>
                </Row>
                <Row style={{marginBottom : "30px"}}>
                    <Col className="blueSubHeading4">
                        Display health condition of asset component based on vibration values and trend
                    </Col>
                </Row>
                <Row style={{marginBottom : "15px", marginLeft: "0px"}}>
                    <Col className="blueHeading2">
                        Health Projection
                    </Col>
                </Row>
                <Row style={{marginBottom : "30px"}}>
                    <Col className="blueSubHeading4">
                        Displays predicted vibration values depicted by the red line according to the machine's running hours.
                    </Col>
                </Row>
                <Row style={{marginBottom : "15px", marginLeft: "0px"}}>
                    <Col className="blueHeading2">
                        Trend
                    </Col>
                </Row>
                <Row style={{marginBottom : "30px"}}>
                    <Col className="blueSubHeading4">
                        Display overall vibration plot to show trend.
                    </Col>
                </Row>
            </React.Fragment>
            }
        >
            <img src={HelpIcon} alt="Help"/>
        </HtmlTooltip>
        )
    }
    renderLG() {
        return (
            <SideBar>
                <div style={{padding : "30px 10px"}}>
                <DashboardCard title="Asset Health">
                    <Row>
                        <Col xl={3} sm={4}>
                            <div style={{backgroundColor : "#04384c", margin : "10px"}}>
                                <Row style={{alignItems: "center"}}>
                                    <Col xs={2} style={{padding : "5% 20px", textAlign : "right"}}>
                                        <StatusLight status={this.state.health} width="16px"></StatusLight>
                                    </Col>
                                    <Col xs={10} className="mainAssetTitle">
                                        {this.state.display}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AssetStaticDetails asset={this.state.assetName} equipment={this.state.equipment} display={this.state.display}></AssetStaticDetails>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xs={9}>
                            <Row style={{position : "absolute", zIndex : 1, width : "8.3333333%", right: "15px"}}>
                                <Col xs={12} style={{padding : "10px 30px"}}>
                                    {this.renderHTMLToolTip()}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <AssetEquipmentHealth assetname={this.state.assetName}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </DashboardCard>
                </div>
            </SideBar>
        )
    }
    render() {
        var content = this.renderLG()
        if (this.props.renderFor == 1) {
            content = this.renderMD()
        }
        if (this.props.renderFor == 2) {
            content = this.renderSM()
        }
        return (
            <div className="content-inner-all">
                <Container fluid={true}>
                    {content}
                </Container>
            </div>
        );
    }
}

export default withLayoutManager(AssetHealthDetail)
