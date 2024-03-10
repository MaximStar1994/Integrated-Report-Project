import React from 'react';

import StatusLight from '../../components/StatusLight/StatusLight.js';
import StatusBox from '../../components/StatusLight/StatusBox';
import ValueCard from './ValueCard'
import ValueCardNoBG from './ValueCardNoBG'
import ValueCardNoBG2 from './ValueCardNoBG2'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BiAxialChart from '../../components/LineChart/BiAxialChart'
import Asset from '../../model/Asset';
import './AssetEquipmentHealth.css'

import {withLayoutManager} from '../../Helper/Layout/layout'
class AssetEquipmentHealthDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            equipmentTab : 0,
            equipmentDataSet : [],
            equipmentTrendDataSet : [],
            tagAnalyticsDataSet : [],
            tagChartDataSet : [],
            tagModelChartDataSet : []
        }
        this.assetController = new Asset()
        this.order = ["motor","pump","engine","alternator","motor 1","motor 2","crank shaft","pinion shaft","motor bearing","shaft 1st bearing","3rd stage bearing","shaft 6th bearing"]
        this.colors = ["#F70702","#9747F6","#F09D13","#0683C1"]
        this.interval = undefined
    }

    GetEquipmentHealth() {
        var asset = this.props.assetname
        if (asset === undefined || asset === null) {
            return
        }
        this.assetController.GetAssetEquipmentHealth(asset, (value,err) => {
            if (err === null) {
                var equipmentDataSet = []
                for (var equipment in value) {
                    var data = value[equipment]
                    data.equipment = equipment
                    equipmentDataSet.push(data)
                }
                equipmentDataSet.sort((a,b) => {
                    return this.order.indexOf(a.equipment.toLowerCase()) - this.order.indexOf(b.equipment.toLowerCase())
                })
                this.setState({equipmentDataSet : equipmentDataSet})
            }
        })
    }

    GetEquipmentHealthTrend() {
        var asset = this.props.assetname
        if (asset === undefined || asset === null) {
            return
        }
        this.assetController.GetAssetEquipmentHealthTrend(asset, (value,err) => {
            if (err === null) {
                var equipmentTrendDataSetArr = []
                var equipmentTrendDataSet = {}
                //console.log("value "+ JSON.stringify(value))
                value.slice(Math.max(0,value.length - 6)).forEach(equipmentDataSlice => {
                    for (var equipment in equipmentDataSlice.health) {
                        if (!(equipment in equipmentTrendDataSet)) {
                            equipmentTrendDataSet[equipment] = []
                        }
                        equipmentTrendDataSet[equipment].push({
                            status : equipmentDataSlice.health[equipment],
                            date : equipmentDataSlice.date
                        })
                    }
                })
                for (var equipment in equipmentTrendDataSet) {
                    equipmentTrendDataSetArr.push({
                        equipment: equipment,
                        data : equipmentTrendDataSet[equipment]})
                }
                equipmentTrendDataSetArr.sort((a,b) => {
                    return this.order.indexOf(a.equipment.toLowerCase()) - this.order.indexOf(b.equipment.toLowerCase())
                })
                this.setState({equipmentTrendDataSet : equipmentTrendDataSetArr})
            }
        })
    }

    GetAssetTagAnalytics() {
        var asset = this.props.assetname
        if (asset === undefined || asset === null) {
            return
        }
        this.assetController.GetAssetTagAnalytics(asset, (value,err) => {
            if (err === null) {
                var tagAnalyticsDataSet = []
                for (var equipment in value) {
                    var data = {
                        dataset : value[equipment]
                    }
                    data.equipment = equipment
                    tagAnalyticsDataSet.push(data)
                }
                tagAnalyticsDataSet.sort((a,b) => {
                    return this.order.indexOf(a.equipment.toLowerCase()) - this.order.indexOf(b.equipment.toLowerCase())
                })
                this.setState({tagAnalyticsDataSet : tagAnalyticsDataSet})
            }
        })
    }

    GetAssetTagChart() {
        var asset = this.props.assetname
        if (asset === undefined || asset === null) {
            return
        }
        this.assetController.GetAssetTagChart(asset, (value,err) => {
            if (err === null) {
                var tagChartDataSet = []
                for (var equipment in value) {
                    var data = {
                        dataset : value[equipment]
                    }
                    data.equipment = equipment
                    tagChartDataSet.push(data)
                }
                tagChartDataSet.sort((a,b) => {
                    return this.order.indexOf(a.equipment.toLowerCase()) - this.order.indexOf(b.equipment.toLowerCase())
                })
                this.setState({tagChartDataSet : tagChartDataSet})
            }
        })
    }
    GetAssetTagModelChart() {
        var asset = this.props.assetname
        if (asset === undefined || asset === null) {
            return
        }
        this.assetController.GetAssetTagModelChart(asset, (value,err) => {
            if (err === null) {
                var tagChartDataSet = []
                for (var equipment in value) {
                    var data = {
                        dataset : value[equipment]
                    }
                    data.equipment = equipment
                    tagChartDataSet.push(data)
                }
                tagChartDataSet.sort((a,b) => {
                    return this.order.indexOf(a.equipment.toLowerCase()) - this.order.indexOf(b.equipment.toLowerCase())
                })
                this.setState({tagModelChartDataSet : tagChartDataSet})
            }
        })
    }

    componentDidMount() {
        this.GetEquipmentHealth()
        this.GetEquipmentHealthTrend()
        this.GetAssetTagAnalytics()
        this.GetAssetTagChart()
        this.interval = setInterval(this.GetAssetTagAnalytics.bind(this), 1000 * 60 * 60);
        this.GetAssetTagModelChart()
    }
    componentWillUnmount() {
        if (this.interval !== undefined) {
            clearInterval(this.interval)
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.assetname !== prevProps.assetname) {
            this.setState({
                equipmentTab : 0,
                equipmentDataSet : [],
                equipmentTrendDataSet : [],
                tagAnalyticsDataSet : [],
                tagChartDataSet : [],
                tagModelChartDataSet : []
            })
            this.GetEquipmentHealth()
            this.GetEquipmentHealthTrend()
            this.GetAssetTagAnalytics()
            this.GetAssetTagChart()
            this.GetAssetTagModelChart()
        }
    }
    
    renderTabBar() {
        if (this.props.assetname.includes('mudpump')) {
            return(
                <Tabs value={this.state.equipmentTab} onChange={(event, newValue)=>{this.setState({equipmentTab : newValue})}}>
                    <Tab label="MOTOR 1 & 2" id="mudpumpmotor" />
                    <Tab label="PINION & CRANK SHAFT" id="mudpumpshaft" />
                </Tabs>
            )
        }
    }
    
    renderEquipmentChart(chartData,tag, modelData) {
        var parsedData = []
        chartData.forEach((chart,i) => {
            if (chart.x == -1) {
                parsedData.push({
                    xval : null,
                    "predicted" : modelData.data[i].y,
                    "mm/s" : parseFloat(chart.y.toFixed(3)),
                    Variance : parseFloat(chart.variance.toFixed(2))
                })
            }
            parsedData.push({
                xval : `${chart.x}`,
                "predicted" : modelData.data[i].y,
                "mm/s" : parseFloat(chart.y.toFixed(3)),
                Variance : parseFloat(chart.variance.toFixed(2))
            })
        })
        var yAxisIds = {
            "predicted" : "vibration",
            "mm/s" : "vibration",
            "Variance" : "variance",
        }
        var colors = JSON.parse(JSON.stringify(this.colors))
        var tagType = tag.split("_")[tag.split("_").length - 1]
        if (tagType == "TV") {
            colors.splice(1,1)
        } else {
            colors.splice(2,1)
        }
        return(
            <BiAxialChart 
            bg="#091A2C"
            data={parsedData} 
            onClick={(data,title) => {}} 
            yAxisIds={yAxisIds}
            colors={colors} 
            y1Formatter = {(value) => {return value}}
            y2Formatter = {(value) => {
                return `${value} %`
            }}
            y1Width = {30}
            y2Width = {40}
            dataLabelFormatter={(value,name) => {
                if (name == "Variance") {
                    return [`${value} %`, name]
                } else if (name == "mm/s") {
                    return [`${value} mm/s`, `Vibration (${tagType})`]
                }
                return value
            }}/>
        )
    }

    renderEquipmentDataCharts(chartData, tagAnalyticsData,tagModelChartData) {
        var rtnElm = []
        chartData.forEach((dataset,i) => {
            rtnElm.push(
                <Row key={dataset.tag} style={{flexGrow : 1}}>
                    <Col xs={12} sm={8}>
                    <div key={dataset.tag} style={{ display : "flex", height: this.props.renderFor == 2 ? "15vh" : "100%"}}>
                        {dataset.locationDisplay && <>
                            <div className="verticalLabelLeft">{dataset.locationDisplay.replace(" Vibration","")}</div>
                            <div className="verticalLabelLeft" style={{fontSize : "0.8rem"}}>mm/s</div>
                        </>}
                        {this.renderEquipmentChart(dataset.data,dataset.tag,tagModelChartData[i])}
                        <div className="verticalLabelRight">Variance</div>
                    </div>
                    </Col>
                    <Col xs={{span : 8, offset : 2}} sm={{span : 4, offset : 0}} style={{display : "flex", flexDirection : "column"}}>
                        <Row>
                            <Col style={{textAlign : "center"}}>ANALYTICS</Col>
                        </Row>
                        <Row style={{flexGrow : 1, alignItems : "center"}}>
                            <Col>
                                <ValueCardNoBG 
                                label="Next 30 Days" 
                                label2 = ''
                                value={(tagAnalyticsData[i].predictedValue30 !== null && tagAnalyticsData[i].predictedValue30 !== -1) ? tagAnalyticsData[i].predictedValue30.toFixed(2) : '-'} 
                                unit="mm/s"></ValueCardNoBG>
                            </Col>
                            <Col>
                                <ValueCardNoBG2 
                                label="Model" 
                                label2 = 'Accuracy'
                                value={(tagAnalyticsData[i].modelAccuracy && tagAnalyticsData[i].modelAccuracy !== -1) ? tagAnalyticsData[i].modelAccuracy.toFixed(0)+"%": '-'} 
                                unit=""></ValueCardNoBG2>
                            </Col>
                            <Col>
                                <ValueCardNoBG2 
                                label="Current" 
                                label2 = 'Variance'
                                value={tagAnalyticsData[i].deviation ? tagAnalyticsData[i].deviation.toFixed(0)+"%" : '-'} 
                                unit=""></ValueCardNoBG2>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )
        })
        return rtnElm
    }

    renderEquipmentDataSets(datasets, trendData, tagAnalyticsData, tagChartData,tagModelChartData) {
        if (datasets.length != trendData.length) {
            return (<></>)
        }
        if (datasets.length != tagAnalyticsData.length) {
            return (<></>)
        }
        if (datasets.length != tagChartData.length) {
            return (<></>)
        }
        if (datasets.length != tagModelChartData.length) {
            return (<></>)
        }
        var rows = []
        datasets.forEach((dataset,i) => {
            rows.push(
                <Row key={i} style={{marginTop : "10px", marginBottom : "10px"}}>
                    <Col xs={4}>
                        <div className="darkBlue">
                            <Row>
                                <Col>
                                    <Row style={{alignItems: "left"}}>
                                        <Col xs={{span : 3, offset : 1}} style={{padding : "10px 15px", textAlign : "right"}}>
                                            <StatusLight status={dataset.velocity.toLowerCase()} width="12px"></StatusLight>
                                        </Col>
                                        <Col xs={8} className="equipmentName" style={{paddingLeft: "5px", display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                            {dataset.equipment}
                                        </Col>
                                    </Row>
                                </Col>
                                {dataset.acceleration && <Col style={{display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                    <Row style={{alignItems: "right"}}>
                                        <Col xs={{span : 3, offset : 1}} style={{padding : "10px 15px", paddingRight : "0px", textAlign : "right"}}>
                                            <StatusLight status={dataset.acceleration.toLowerCase()}></StatusLight>
                                        </Col>
                                        <Col xs={8} className="equipmentNameMedium" style={{paddingLeft: "5px", display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                            {this.props.assetname.includes('mudpump') ? "ACCL" : "BEARING"}
                                        </Col>
                                    </Row>
                                </Col>}
                            </Row>
                            <Row>
                                <Col>
                                <div style={{padding : "10px"}}>
                                    <Row noGutters={true}>
                                    {
                                        trendData[i].data.map((data,j) =>
                                            <Col key={j}>
                                                <Row>
                                                    <Col className="blueSubHeading2" style={{textAlign : "center"}}>{data.date}</Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                    <div style={{padding : "0px 5px", margin : "auto"}}>
                                                        <StatusBox status={data.status.toLowerCase()} height="22px"/>
                                                    </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )
                                    }
                                    </Row>
                                </div>
                                </Col>
                            </Row>
                            {
                                tagAnalyticsData[i].dataset.map((data,j) =>
                                    <div key={j} style={{padding : "10px"}}>
                                        <Row noGutters={true}>
                                            {data.vibration && <Col>
                                                <ValueCard 
                                                label={data.display || "Vibration"} 
                                                value={data.vibration.toFixed(2)} 
                                                unit="mm/s"></ValueCard>
                                            </Col>}
                                            {data.predictedValue && <Col>
                                                <ValueCardNoBG 
                                                label={data.display || "Vibration"} 
                                                label2 = 'Predicted'
                                                value={data.predictedValue != -1 ? data.predictedValue.toFixed(2) : "-"} 
                                                unit="mm/s"></ValueCardNoBG>
                                            </Col>}
                                        </Row>
                                    </div>
                                )
                            }
                        </div>
                    </Col>
                    <Col xs={8} style={{paddingLeft : "0px"}}>
                        <div className="darkBlue" style={{marginRight : "10px", padding : "10px", height: "100%", display : "flex", flexDirection : "column"}}>
                        <Row>
                            <Col xs={7}>
                                <Row style={{marginBottom : "10px"}}>
                                    <Col style={{display : "flex"}}>
                                        <div className="legendTitle">Legend : </div>
                                        <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[0]}}>&nbsp;</div>Model</div>
                                        <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[1]}}>&nbsp;</div>Vibration(PV)</div>
                                        <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[2]}}>&nbsp;</div>Vibration(TV)</div>
                                        <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[3]}}>&nbsp;</div>Variance</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            this.renderEquipmentDataCharts(tagChartData[i].dataset,tagAnalyticsData[i].dataset,tagModelChartData[i].dataset)
                        }
                        </div>
                    </Col>
                </Row>
            )
        })
        return rows
    }
    renderMD(datasets, trendData, tagAnalyticsData, tagChartData,tagModelChartData) {
        if (datasets.length != trendData.length) {
            return (<></>)
        }
        if (datasets.length != tagAnalyticsData.length) {
            return (<></>)
        }
        if (datasets.length != tagChartData.length) {
            return (<></>)
        }
        if (datasets.length != tagModelChartData.length) {
            return (<></>)
        }
        return (
        <>
        <Row>
        {datasets.map((dataset,i) => (
            <Col xs={6} key={i} style={{marginTop : "5px", marginBottom : "5px"}}>
                <div className="darkBlue cardContent">
                    <Row>
                        <Col>
                            <Row style={{alignItems: "left"}}>
                                <Col xs={{span : 2, offset : 1}} style={{padding : "10px 15px", textAlign : "right"}}>
                                    <StatusLight status={dataset.velocity.toLowerCase()} width="8px"></StatusLight>
                                </Col>
                                <Col xs={9} className="equipmentName" style={{paddingLeft: "5px", display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                    {dataset.equipment}
                                </Col>
                            </Row>
                        </Col>
                        {dataset.acceleration && <Col style={{display : "flex", justifyContent : "center", flexDirection : "column"}}>
                            <Row style={{alignItems: "right"}}>
                                <Col xs={{span : 2, offset : 1}} style={{padding : "10px 15px", paddingRight : "0px", textAlign : "right"}}>
                                    <StatusLight status={dataset.acceleration.toLowerCase()}></StatusLight>
                                </Col>
                                <Col xs={9} className="equipmentNameSmall" style={{paddingLeft: "5px", display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                    {this.props.assetname.includes('mudpump') ? "ACCL" : "BEARING"}
                                </Col>
                            </Row>
                        </Col>}
                    </Row>
                    <Row>
                        <Col xs={{span : 10, offset : 1}}>
                        <div style={{padding : "10px"}}>
                            <Row noGutters={true}>
                            {
                                trendData[i].data.map((data,j) =>
                                    <Col key={j}>
                                        <Row>
                                            <Col className="blueSubHeading2" style={{textAlign : "center"}}>{data.date}</Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            <div style={{padding : "0px 5px", margin : "auto"}}>
                                                <StatusBox status={data.status.toLowerCase()} height="20px"/>
                                            </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                )
                            }
                            </Row>
                        </div>
                        </Col>
                    </Row>
                    {
                        tagAnalyticsData[i].dataset.map((data,j) =>
                            <div key={j} style={{padding : "10px"}}>
                                <Row noGutters={true} style={{justifyContent : "center"}}>
                                    {data.vibration && <Col xs={6}>
                                        <ValueCard 
                                        label={data.display || "Vibration"} 
                                        value={data.vibration.toFixed(2)} 
                                        unit="mm/s"></ValueCard>
                                    </Col>}
                                    {data.predictedValue && <Col xs={6}>
                                        <ValueCardNoBG 
                                        label={data.display || "Vibration"} 
                                        label2 = 'Predicted'
                                        value={data.predictedValue != -1 ? data.predictedValue.toFixed(2) : "-"} 
                                        unit="mm/s"></ValueCardNoBG>
                                    </Col>}
                                </Row>
                            </div>
                        )
                    }
                </div>
            </Col>
            ))
        }
        </Row>
        {datasets.map((dataset,i) => (
        <Row key={i} style={{marginTop : "10px", height : this.props.assetname.includes("gearbox") ? "15vh" : "30vh"}}>
            <Col>
                <div className="darkBlue cardContent" style={{padding : "10px", height: "100%", display : "flex", flexDirection : "column"}}>
                <Row>
                    <Col xs={7}>
                        <Row style={{marginBottom : "10px"}}>
                            <Col style={{display : "flex"}}>
                                <div style={{paddingRight: "10px", whiteSpace : "nowrap"}} className="blueHeading2">{dataset.equipment}</div>
                                <div className="legendTitle">Legend : </div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[0]}}>&nbsp;</div>Model</div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[1]}}>&nbsp;</div>Vibration(PV)</div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[2]}}>&nbsp;</div>Vibration(TV)</div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[3]}}>&nbsp;</div>Variance</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    this.renderEquipmentDataCharts(tagChartData[i].dataset,tagAnalyticsData[i].dataset,tagModelChartData[i].dataset)
                }
                </div>
            </Col>
        </Row>
        ))}
        </>
        )
    }
    renderSM(datasets, trendData, tagAnalyticsData, tagChartData,tagModelChartData) {
        if (datasets.length != trendData.length) {
            return (<></>)
        }
        if (datasets.length != tagAnalyticsData.length) {
            return (<></>)
        }
        if (datasets.length != tagChartData.length) {
            return (<></>)
        }
        if (datasets.length != tagModelChartData.length) {
            return (<></>)
        }
        return (
        <>
        <Row>
        {datasets.map((dataset,i) => (
            <Col xs={12} key={i} style={{marginTop : "5px", marginBottom : "5px"}}>
                <div className="darkBlue cardContent">
                    <Row>
                        <Col>
                            <Row style={{alignItems: "left"}}>
                                <Col xs={{span : 2, offset : 1}} style={{padding : "10px 15px", textAlign : "right"}}>
                                    <StatusLight status={dataset.velocity.toLowerCase()} width="8px"></StatusLight>
                                </Col>
                                <Col xs={9} className="equipmentName" style={{paddingLeft: "5px", display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                    {dataset.equipment}
                                </Col>
                            </Row>
                        </Col>
                        {dataset.acceleration && <Col style={{display : "flex", justifyContent : "center", flexDirection : "column"}}>
                            <Row style={{alignItems: "right"}}>
                                <Col xs={{span : 2, offset : 1}} style={{padding : "10px 15px", paddingRight : "0px", textAlign : "right"}}>
                                    <StatusLight status={dataset.acceleration.toLowerCase()}></StatusLight>
                                </Col>
                                <Col xs={9} className="equipmentNameSmall" style={{paddingLeft: "5px", display : "flex", justifyContent : "center", flexDirection : "column"}}>
                                    {this.props.assetname.includes('mudpump') ? "ACCL" : "BEARING"}
                                </Col>
                            </Row>
                        </Col>}
                    </Row>
                    <Row>
                        <Col xs={{span : 10, offset : 1}}>
                        <div style={{padding : "10px"}}>
                            <Row noGutters={true}>
                            {
                                trendData[i].data.map((data,j) =>
                                    <Col key={j}>
                                        <Row>
                                            <Col className="blueSubHeading2" style={{textAlign : "center"}}>{data.date}</Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            <div style={{padding : "0px 5px", margin : "auto"}}>
                                                <StatusBox status={data.status.toLowerCase()} height="20px"/>
                                            </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                )
                            }
                            </Row>
                        </div>
                        </Col>
                    </Row>
                    {
                        tagAnalyticsData[i].dataset.map((data,j) =>
                            <div key={j} style={{padding : "10px"}}>
                                <Row noGutters={true} style={{justifyContent : "center"}}>
                                    {data.vibration && <Col xs={6}>
                                        <ValueCard 
                                        label={data.display || "Vibration"} 
                                        value={data.vibration.toFixed(2)} 
                                        unit="mm/s"></ValueCard>
                                    </Col>}
                                    {data.predictedValue && <Col xs={6}>
                                        <ValueCardNoBG 
                                        label={data.display || "Vibration"} 
                                        label2 = 'Predicted'
                                        value={data.predictedValue != -1 ? data.predictedValue.toFixed(2) : "-"} 
                                        unit="mm/s"></ValueCardNoBG>
                                    </Col>}
                                </Row>
                            </div>
                        )
                    }
                </div>
            </Col>
            ))
        }
        </Row>
        {datasets.map((dataset,i) => (
        <Row key={i} style={{marginTop : "10px"}}>
            <Col>
                <div className="darkBlue cardContent" style={{padding : "10px", height: "100%", display : "flex", flexDirection : "column"}}>
                <Row>
                    <Col xs={12}>
                        <Row style={{marginBottom : "10px"}}>
                            <Col xs={12} >
                                <div style={{paddingRight: "10px", whiteSpace : "nowrap"}} className="blueHeading2">{dataset.equipment}</div>
                            </Col>
                            <Col style={{display : "flex"}}>
                                <div className="legendTitle">Legend : </div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[0]}}>&nbsp;</div>Model</div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[1]}}>&nbsp;</div>Vibration(PV)</div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[2]}}>&nbsp;</div>Vibration(TV)</div>
                                <div className="legendColorLabel"><div className="legendColor" style={{backgroundColor : this.colors[3]}}>&nbsp;</div>Variance</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    this.renderEquipmentDataCharts(tagChartData[i].dataset,tagAnalyticsData[i].dataset,tagModelChartData[i].dataset)
                }
                </div>
            </Col>
        </Row>
        ))}
        </>
        )
    }
    render() {
        var index = this.state.equipmentTab * 2
        var parsedEquipmentData = []
        var parsedEquipmentTrendData = []
        var parsedTagData = []
        var parsedTagChartData = []
        var parsedTagModelChartData = []
        var rowCount = this.props.assetname.includes('gearbox') ? 4 : 2
        if (this.props.renderFor !== 0) {
            rowCount = this.state.equipmentDataSet.length
        }
        if (this.state.equipmentDataSet.length > index + 1) {
            parsedEquipmentData = this.state.equipmentDataSet.slice(index,index+rowCount)
        }
        if (this.state.equipmentTrendDataSet.length > index + 1) {
            parsedEquipmentTrendData = this.state.equipmentTrendDataSet.slice(index,index+rowCount)
        }
        if (this.state.tagAnalyticsDataSet.length > index + 1) {
            parsedTagData = this.state.tagAnalyticsDataSet.slice(index,index+rowCount)
        }
        if (this.state.tagChartDataSet.length > index + 1) {
            parsedTagChartData = this.state.tagChartDataSet.slice(index,index+rowCount)
        }
        if (this.state.tagModelChartDataSet.length > index + 1) {
            parsedTagModelChartData = this.state.tagModelChartDataSet.slice(index,index+rowCount)
        }
        if (this.props.renderFor == 1) {
            return this.renderMD(parsedEquipmentData,parsedEquipmentTrendData,parsedTagData,parsedTagChartData,parsedTagModelChartData)
        }
        if (this.props.renderFor == 2) {
            return this.renderSM(parsedEquipmentData,parsedEquipmentTrendData,parsedTagData,parsedTagChartData,parsedTagModelChartData)
        }
        return (
            <>
            {this.renderTabBar()}
            {this.renderEquipmentDataSets(parsedEquipmentData,parsedEquipmentTrendData,parsedTagData,parsedTagChartData,parsedTagModelChartData)}
            </>

        );
    }
}

export default withLayoutManager(AssetEquipmentHealthDetail)
