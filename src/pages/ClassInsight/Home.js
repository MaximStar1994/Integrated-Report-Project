import React from 'react';
import Container from 'react-bootstrap/Container'
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';
import SideBar from '../../components/SideBar/ClassInsightSideBar'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'

import AssetHealthSummary from './AssetHealthSummary'
import AssetList from './AssetHealthList'
import {withLayoutManager} from '../../Helper/Layout/layout'
class ClassInsight extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
        };
    }

    renderLG() {
        return(
            <SideBar>
                <DashboardCardWithHeader title="CLASS Insight">
                    <Row>
                        <Col xs={5}>
                            <div style={{padding : "15px"}}>
                                <AssetHealthSummary />
                            </div>
                        </Col>
                        <Col>
                            <AssetList />
                        </Col>
                    </Row>
                </DashboardCardWithHeader>
            </SideBar>
        )
    }
    renderMD() {
        return(
        <DashboardCardWithHeader title="CLASS Insight">
            <Row>
                <Col>
                    <div >
                        <AssetHealthSummary />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AssetList />
                </Col>
            </Row>
        </DashboardCardWithHeader>
        )
    }
    renderSM() {
        return(
        <DashboardCardWithHeader title="CLASS Insight">
            <Row>
                <Col>
                    <div >
                        <AssetHealthSummary />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col style={{maxWidth : "100vw"}}>
                    <AssetList />
                </Col>
            </Row>
        </DashboardCardWithHeader>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor === 1) {
            contents = this.renderMD()
        }
        if (this.props.renderFor === 2){
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

export default withLayoutManager(ClassInsight);
