import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';

import Asset from '../../model/Asset'
import CompositionCircleProgressBar from '../../components/CircularProgressBar/CompositionCircleProgressBar'
import AreaChart from '../../components/AreaChart/AreaChart'

class AssetManagement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            circleHeight : "auto"
        };
        this.assetApi = new Asset()
        this.circleRef = React.createRef()
    }

    componentDidMount() {

        this.assetApi.GetAssetSummary((val,err) => {
            if (val !== null) {
                this.setState({ 
                    SatisfactoryNo : val.SatisfactoryNo,
                    MarginalNo : val.MarginalNo, 
                    UnsatisfactoryNo : val.UnsatisfactoryNo,
                    height : "auto"})
            }
        })
        this.assetApi.GetAssetHealthTrend((val,err) => {
            this.setState({ healthTrend : val})
        })
    }
    renderHealthTrendChart() {
        if (this.state.healthTrend === undefined || this.state.healthTrend === null) {
            return (<></>)
        }
        var chartDatas = []
        var colors = {
            Satisfactory : "#00ff00",
            Marginal : "#ffeb00",
            Unsatisfactory : "#ff0057"
        }
        this.state.healthTrend.forEach((dataset,i) => {
            var chartDataset = {
                Satisfactory : dataset.SatisfactoryPer,
                Marginal : dataset.MarginalPer,
                Unsatisfactory : dataset.UnsatisfactoryPer,
                xval : new Date(dataset.mon).toLocaleString('default', { month: 'short' }) + new Date(dataset.mon).getFullYear().toString().slice(-2)
            }
            chartDatas.push(chartDataset)
        })
        return (
            <AreaChart 
            data = {chartDatas}
            yLabel = "Health (%)"
            xLabel = "Month"
            dataMax = {100} dataMin={0}
            colors = {colors}>
            </AreaChart>
        )
    }
    renderHealthSummaryTable(title, count) {
        var btnclr = "#00ff00"
        if (title === "Marginal") {
            btnclr = "#ffeb00"
        } else if (title === "Unsatisfactory") {
            btnclr = "#ff0057"
        }
        var height = this.state.height
        return(
            <>
            <Row style={{marginTop : "10px"}}>
                <Col style={{textAlign : "center", fontSize : "0.8rem"}}>
                    {title}
                </Col>
            </Row>
            <Row style={{marginTop : "10px"}}>
                <Col xs={{span : 6, offset : 3}} style={{textAlign : "center"}}>
                    <div ref={(ref)=>{
                        if (this.state.height === "auto") {
                            this.setState({height : ref.offsetWidth + 'px'})
                        }}} 
                        style={{width : "100%", height : height, borderRadius : "50%", backgroundColor : btnclr}} >
                        &nbsp;
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop : "10px", marginBottom : "10px"}}>
                <Col style={{textAlign : "center"}}>
                    {count}
                </Col>
            </Row>
            </>
        )
    }
    render() {
        var satisfactory = this.state.SatisfactoryNo
        var marginal = this.state.MarginalNo
        var unsatisfactory = this.state.UnsatisfactoryNo
        if (satisfactory === undefined || marginal === undefined || unsatisfactory === undefined ) {
            return (<></>)
        }
        var total = satisfactory + marginal + unsatisfactory
        var satisfactoryPer = Math.floor(satisfactory / total * 10000) / 100
        var marginalPer =  Math.floor(marginal / total * 10000) / 100
        var unsatisfactoryPer =  Math.floor(unsatisfactory / total * 10000) / 100
        var healthyPer = (100 - unsatisfactoryPer).toFixed(2)
        return (
            <>
            <Row>
                <Col>
                    <div style={{display : "flex"}}>
                        <div>
                            Assets Health Summary
                        </div>
                        <div style={{marginLeft : "auto", color : "#e44944"}} >
                            Model Training In Progress
                        </div>
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop : "60px"}}>
                <Col xs={{span : 8, offset : 2}}>
                    <Row noGutters={true}>
                        <Col className="healthSummaryTable" xs={4}>
                            {this.renderHealthSummaryTable("Satisfactory", this.state.SatisfactoryNo || 0)}
                        </Col>
                        <Col className="healthSummaryTable" xs={4}>
                            {this.renderHealthSummaryTable("Marginal", this.state.MarginalNo || 0)}
                        </Col>
                        <Col className="healthSummaryTable" xs={4}>
                            {this.renderHealthSummaryTable("Unsatisfactory", this.state.UnsatisfactoryNo || 0)}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{marginTop : "15px"}}>
                <Col xs={{span : 6, offset : 3}}>
                    <Row>
                        <Col xs={12} style={{textAlign : 'center', fontSize : "1.0rem", padding : "10px"}}>
                            {total} Assets Monitored
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span : 8, offset : 2}} >
                            <CompositionCircleProgressBar 
                            dataArr={[
                                {percentage : satisfactoryPer, color : "#00ff00"},
                                {percentage : marginalPer, color : "#ffeb00"},
                                {percentage : unsatisfactoryPer, color : "#ff0057"}
                            ]}>
                                <div style={{textAlign: 'center', padding : "10px", fontSize : "1.5rem", color : "white"}}>
                                    {healthyPer}%
                                </div>
                                <div style={{fontSize : "1rem", fontWeight : "600", textAlign : "center"}}>
                                    Healthy Condition
                                </div>
                            </CompositionCircleProgressBar>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{marginTop : "30px", height : "30vh"}}>
                <Col>
                   {this.renderHealthTrendChart()}
                </Col>
            </Row>
            </>)
    }
}

export default AssetManagement;
