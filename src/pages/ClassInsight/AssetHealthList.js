import React from 'react';
import {Row,Col} from 'react-bootstrap'
import '../../css/App.css';

import Asset from '../../model/Asset'
import Tag from '../../model/Tag'
import GreenCircle from '../../assets/Icon/GreenCircle.png'
import RedCircle from '../../assets/Icon/RedCircle.png'
import YellowCircle from '../../assets/Icon/YellowCircle.png'
import GreyCircle from '../../assets/Icon/GreyCircle.png'

import NoChange from '../../assets/Icon/greyChevronDown.png'
import Improve from '../../assets/Icon/blueChevronUp.png'
import Detiorate from '../../assets/Icon/blueChevronDown.png'

import StatusBox from '../../components/StatusLight/StatusBox'
import Spinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import MyLineChart from '../../components/LineChart/LineChart';
import {withLayoutManager} from '../../Helper/Layout/layout'

import Modal from 'react-bootstrap/Modal'
import { DatePicker } from "@material-ui/pickers";
import Button from '@material-ui/core/Button';
import moment from 'moment';
// list
class AssetHealthList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.assetApi = new Asset()
        this.tagApi = new Tag()
        this.state = {
            healthList : [],
            isLoading : false,
            tagsData : undefined,
            modalShow : false,
            startDate : new Date(),
            endDate : new Date(),
            chartDatas : {},
            chartMins : {},
            chartMaxs : {},
            assetSelected : undefined
        }
    }

    componentDidMount() {
        this.assetApi.GetAssetHealthList((list,err) => {
            this.setState({ healthList : list})
        })
    }

    renderChangeIcon(change) {
        var statusSrc
        switch (change) {
            case 2: statusSrc = Detiorate
            break
            case 1 : statusSrc = NoChange
            break
            case 0 : statusSrc = Improve
            break
        }
        return(
            <div style={{paddingLeft : "25%", width : "50%"}} ><img src={statusSrc} /></div>
        )
    }

    parseChartData(tag,rawData) {
        var dataMin = undefined
        var dataMax = undefined
        var chartData = []
        rawData.forEach((dat) => {
            var momentObj = moment(dat.xval)
            var newDat = { xval : momentObj.format("yyyy-MM-DD")}
            let dataPresent = Object.keys(dat)
            dataPresent.forEach((key) => {
                if (key === "xval") {
                    return
                }
                let numyval = parseFloat(dat[key])
                if (dataMin === undefined || dataMin > numyval) {
                    dataMin = parseFloat(numyval.toFixed(3))
                } 
                if (dataMax === undefined || dataMax < numyval ) {
                    dataMax = parseFloat(numyval.toFixed(3))
                } 
            })
            var legendName = tag
            if (legendName.startsWith("B357_") || legendName.startsWith("B356_")) {
                legendName = legendName.slice(5)
            }
            newDat[legendName] = parseFloat(dat[tag]).toFixed(3)
            chartData.push(newDat)
        })
        return [chartData,dataMin,dataMax]
    }

    showTagTrend(assetname) {
        var asset = assetname.replace(/\s/g,'').toLowerCase()
        if (asset.includes('drawworks') || asset.includes('topdrive')) {
            return
        }
        this.setState({isLoading : true, assetSelected : asset})
        var startDate = new Date()
        var endDate = new Date()
        endDate.setDate(endDate.getDate()-1);
        this.getTagTrendData(asset,startDate,endDate)
    }
    getTagTrendData(asset,startDate,endDate) {
        this.assetApi.GetAssetTags(asset, (tags)=>{
            tags.forEach((tag,i) => {
                this.tagApi.GetTagTrend(tag,startDate,endDate,(trend)=>{
                    if (trend == null) {
                        trend = []
                    }
                    var data = [];
                    trend.forEach((dat) => {
                        var newDat = { xval : new Date(dat.timestamp.replace(' ','T') + "z")}
                        newDat[tag] = dat[tag]
                        data.push(newDat)
                    })                    
                    var dataArr = this.parseChartData(tag,data)
                    var currData = this.state.chartDatas
                    var currMins = this.state.chartMins
                    var currMaxs = this.state.chartMaxs
                    currData[tag] = dataArr[0]
                    currMins[tag] = dataArr[1]
                    currMaxs[tag] = dataArr[2]
                    if (i == tags.length - 1) {
                        this.setState({chartDatas : currData, chartMins : currMins, chartMaxs : currMaxs, isLoading : false, modalShow : true})
                    } else {
                        this.setState({chartDatas : currData, chartMins : currMins, chartMaxs : currMaxs})
                    }
                },2)
            })
        })
    }
    reloadModalData() {
        var startDate = this.state.startDate
        var endDate = this.state.endDate
        var asset = this.state.assetSelected
        this.setState({
            isLoading : true,
            chartDatas : {},
            chartMins : {},
            chartMaxs : {}})
        this.getTagTrendData(asset,startDate,endDate)
    }
    showSpinner(show) {
        return(show && <Spinner />)
    }
    handleDateChange(date) {
        var endDate = new Date(date.getFullYear(), date.getMonth()+1, 0);
        this.setState({startDate : date, endDate : endDate})
    }
    
    renderModal() {
        if (this.state.modalShow === undefined || this.state.modalShow === false){
            return (<></>)
        }
        var startDate = this.state.startDate
        return (
            <Modal 
            className="AssetHealthListModal"
            size={"lg"} 
            aria-labelledby="contained-modal-title-vcenter"
            centered 
            show={this.state.modalShow} 
            onHide={() => {this.setState({modalShow : false})}}>
                <Modal.Header closeButton style={{backgroundColor : "rgb(2, 42, 57)", border : "none"}}>
                    {/* <Modal.Title style={{textAlign : "center"}}>{title}</Modal.Title> */}
                </Modal.Header>
                <Modal.Body style={{backgroundColor : "rgb(2, 42, 57)"}}>
                    <Row>
                        <Col xs={3}>
                            <Row>
                                <Col>
                                    <DatePicker
                                        label="Date to view"
                                        inputVariant="outlined"
                                        format="MM/yyyy"
                                        value={startDate}
                                        maxDate={new Date()}
                                        value={startDate}
                                        InputLabelProps={{
                                            style: {color : "white"},
                                        }}
                                        inputProps={{
                                            style: {color : "white"},
                                        }}
                                        onChange={(date) => {this.handleDateChange(date)}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{alignSelf : "center", textAlign : "right"}}>
                            <Button variant="contained" onClick={()=>{this.reloadModalData()}}>
                                Reload Data
                            </Button>
                        </Col>
                    </Row>
                    {Object.keys(this.state.chartDatas).map(tag => (
                        <>
                        {
                            this.state.chartDatas[tag].length > 0 && 
                            <Row key={tag} style={{marginBottom : "15px", height : "30vh"}}>
                                <Col>
                                    <MyLineChart 
                                    data={this.state.chartDatas[tag]} 
                                    onClick={(data,title) => {}} 
                                    dataMax={this.state.chartMaxs[tag]} 
                                    dataMin={this.state.chartMins[tag]}
                                    labelFormatter={(label) => {
                                        return label
                                    }}
                                    />
                                </Col>
                            </Row>
                        }
                        </>
                    ))}
                </Modal.Body>
            </Modal>
        )
    }
    render() {
        var list = this.state.healthList
        if (list.length === 0) {
            return (<></>)
        }
        if (this.props.renderFor === 2) {
            return (
                <div style={{backgroundColor : "#252525", whiteSpace: "nowrap", overflowX : "auto"}}>
                {this.showSpinner(this.state.isLoading)}
                {this.renderModal()}
                <div style={{display : "inline-block", float: "none"}}>
                    <Row style={{flexWrap : "nowrap"}}>
                        <Col xs={2} style={{marginLeft : "15px", paddingLeft : "0", borderTop : "1px solid #d2d5db",borderBottom : "1px solid #d2d5db", borderLeft : "1px solid #d2d5db", fontSize : "0.8rem", alignSelf : "center"}}>
                            Asset
                        </Col>
                        <Col xs={1} style={{borderTop : "1px solid #d2d5db",borderBottom : "1px solid #d2d5db", fontSize : "0.8rem", alignSelf : "center"}}>
                            Type
                        </Col>
                        <Col xs={7} style={{borderTop : "1px solid #d2d5db",borderBottom : "1px solid #d2d5db", padding : 0, maxWidth : "unset"}}>
                            <div noGutters={true} style={{display : "inline-flex"}}>
                                {list[0].trend.map((trend,i) => {
                                    return(
                                        <Col key={i} style={{fontSize : "0.8rem", textAlign : "center", width : "65px"}}>{trend.month}</Col>
                                    )
                                })}
                            </div>
                        </Col>
                        <Col xs={1} style={{borderTop : "1px solid #d2d5db",borderBottom : "1px solid #d2d5db",borderRight : "1px solid #d2d5db", marginRight : "15px", paddingRight : "0", alignSelf : "center"}}> 
                            Status
                        </Col>
                    </Row>
                {list.map((obj,i) => {
                    return(
                        <Row key={i} className="clickable" onClick={() => {
                            this.showTagTrend(obj.assetname)
                        }} style={{paddingTop : "0px", paddingBottom : "0px", fontSize : "0.7rem", flexWrap : "nowrap"}}>
                            <Col xs={2} >
                                {obj.assetname}
                            </Col>
                            <Col xs={1} >
                                CM/RTM
                            </Col>
                            <Col xs={7} style={{maxWidth : "unset"}} >
                                <div noGutters={true} style={{display : "inline-flex"}}>
                                    {obj.trend.map((trend,i) => {
                                        var statusSrc = GreyCircle
                                        switch (trend.status) {
                                            case "Unsatisfactory" :
                                                statusSrc = RedCircle
                                                break
                                            case "Satisfactory" : 
                                                statusSrc = GreenCircle
                                                break
                                            case "Marginal" :
                                                statusSrc = YellowCircle
                                                break
                                            default : 
                                                statusSrc = GreyCircle
                                                break
                                        }
                                        return(
                                            <Col xs={1} key={i} style={{width : "65px"}}>
                                                <div style={{margin : "auto", padding : "5px"}} >
                                                    <StatusBox status={trend.status.toLowerCase()} height="10px" />
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </div>
                            </Col>
                            <Col xs={1} >
                                {this.renderChangeIcon(obj.change)}
                            </Col>
                        </Row>
                    )
                })}
                </div>
                </div>)
        }
        return (
            <div style={{backgroundColor : "#252525"}}>
            {this.showSpinner(this.state.isLoading)}
            {this.renderModal()}
            <Row noGutters={true} style={{border : "1px solid #d2d5db"}}>
                <Col xs={3} style={{fontSize : "0.8rem", alignSelf : "center"}}>
                    Asset
                </Col>
                <Col xs={1} style={{fontSize : "0.8rem", alignSelf : "center"}}>
                    Type
                </Col>
                <Col xs={7} style={{padding : 0}}>
                    <Row noGutters={true}>
                        {list[0].trend.map((trend,i) => {
                            return(
                                <Col key={i} style={{fontSize : "0.8rem", textAlign : "center"}}>{trend.month}</Col>
                            )
                        })}
                    </Row>
                </Col>
                <Col xs={1} style={{alignSelf : "center"}}> 
                    Status
                </Col>
            </Row>
            {list.map((obj,i) => {
                return(
                <Row noGutters={true} key={i} className={(obj.assetname.includes("Drawworks") || obj.assetname.includes("Topdrive")) ? "": "clickable"} onClick={() => {
                    this.showTagTrend(obj.assetname)
                }} style={{paddingTop : "0px", paddingBottom : "0px", fontSize : "0.7rem"}}>
                    <Col xs={3}>
                        {obj.assetname}
                    </Col>
                    <Col xs={1}>
                        CM/RTM
                    </Col>
                    <Col xs={7}>
                        <Row noGutters={true}>
                            {obj.trend.map((trend,i) => {
                                var statusSrc = GreyCircle
                                switch (trend.status) {
                                    case "Unsatisfactory" :
                                        statusSrc = RedCircle
                                        break
                                    case "Satisfactory" : 
                                        statusSrc = GreenCircle
                                        break
                                    case "Marginal" :
                                        statusSrc = YellowCircle
                                        break
                                    default : 
                                        statusSrc = GreyCircle
                                        break
                                }
                                return(
                                    <Col key={i}>
                                        <div style={{margin : "auto", padding : "5px"}} >
                                            <StatusBox status={trend.status.toLowerCase()} height="10px" />
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Col>
                    <Col xs={1}>
                        {this.renderChangeIcon(obj.change)}
                    </Col>
                </Row>
                )
            })}
            </div>)
    }
}

export default withLayoutManager(AssetHealthList);
