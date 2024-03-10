import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import CompositionCircleProgressBar from '../../components/CircularProgressBar/CompositionCircleProgressBar'
import AssetApi from '../../model/Asset'
class AssetHealthCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            totalMonitored : 0,
            satisfactory : 0,
            marginal : 0,
            unsatisfactory : 0
        };
        this.assetApi = new AssetApi()
    }

    componentDidMount() {
        this.assetApi.GetAssetSummary((val,err) => {
            if (val === null) {return}
            this.setState({
                totalMonitored : val.total,
                satisfactory : val.SatisfactoryNo,
                marginal : val.MarginalNo,
                unsatisfactory : val.UnsatisfactoryNo
            })
        })
    }
 
    render() {
        var total = this.state.totalMonitored
        var satisfactoryPer = this.state.satisfactory / total * 100
        var marginalPer = this.state.marginal / total * 100
        var unsatisfactoryPer = this.state.unsatisfactory / total * 100
        var healthyPer = (100 - unsatisfactoryPer).toFixed(2)
        return (
            <DashboardCardWithHeader title="Assets Health">
                <Row>
                    <Col xs={12} className="cardSubTitle" style={{textAlign : 'center'}}>
                        {total} Assets Monitored
                    </Col>
                </Row>
                <Row>
                    <Col xs={{span : 6, offset : 3}} >
                        <CompositionCircleProgressBar 
                        dataArr={[
                            {percentage : satisfactoryPer, color : "#00ff00"},
                            {percentage : marginalPer, color : "#ffeb00"},
                            {percentage : unsatisfactoryPer, color : "#c20611"}
                        ]}>
                            <div className = "whiteHeading1" style={{textAlign: 'center', padding : "10px"}}>
                                {healthyPer}%
                            </div>
                            <div  className = "blueHeading2">
                                Healthy Condition
                            </div>
                        </CompositionCircleProgressBar>
                    </Col>
                </Row>
                <Row>
                    <Col style={{textAlign : "center"}}>
                        <div style={{
                            margin : "auto",
                            backgroundColor : "#ffeb00",
                            width : "20px",
                            height : "20px",
                            borderRadius : "5px"
                        }}></div>
                        <div style={{padding : '10px'}}>Marginal</div>
                    </Col>
                    <Col style={{textAlign : "center"}}>
                        <div style={{
                            margin : "auto",
                            backgroundColor : "#00ff00",
                            width : "20px",
                            height : "20px",
                            borderRadius : "5px"
                        }}></div>
                        <div style={{padding : '10px'}}>Satisfactory</div>
                    </Col>
                </Row>
            </DashboardCardWithHeader>
        )
    }
  }

export default AssetHealthCard;
