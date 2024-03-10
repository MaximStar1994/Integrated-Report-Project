import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import { DateTimePicker } from "@material-ui/pickers";
import Button from '@material-ui/core/Button';
import '../../css/App.css';
import '../../css/Dashboard.css';
import Tag from '../../model/Tag.js'
import MyLineChart from '../LineChart/LineChart';
// tagnames : csv string
// title : String
// handleModalClose : function
// show : Bool
class TrendModalChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        var startDate = new Date()
        var endDate = new Date()
        startDate.setDate(startDate.getDate()-1)
        this.state = { 
            organization : "-",
            project : localStorage.getItem("project") || "B357",
            renderFor : 0, // 0 for desktop, 1 for ipad, 2 for mobile 
            modalStartDate : startDate,
            modalEndDate : endDate,
        };
        this.tagController = new Tag()
    }

    componentDidMount() {
        var startDate = new Date()
        var endDate = new Date()
        startDate.setDate(startDate.getDate()-1)
        var tagnamesArr = this.props.tagnames.split(",")
        var project = this.state.project
        this.tagController.GetTagTrend( this.props.tagnames, startDate, endDate,((val) =>{
            var chartData = []
            val.forEach((dat) => {
                var newDat = { xval : dat.timestamp}
                tagnamesArr.forEach((name) => {
                    var newkey = name
                    if(name.indexOf(project) > -1){
                        newkey = name.replace(project+"_", "");
                    }
                    newDat[newkey] = dat[name]
                    delete newDat[name]
                })
                chartData.push(newDat)
            })
            this.setState({modalData : chartData})
        }))
    }
    reloadModalData() {
        // get difference in s tartdate
        const startDate = this.state.modalStartDate
        const endDate = this.state.modalEndDate
        const tagnames = this.props.tagnames
        const timeDiff = endDate.getTime() - startDate.getTime()
        var dayDiff = timeDiff / (1000 * 60 * 60 * 24)
        var hourDiff = timeDiff / (1000 * 60 * 60 )
        var minDiff = timeDiff / (1000 * 60 )
        var interval = 3
        if (dayDiff < 7) {
            if (hourDiff > 2.5) {
                interval = 4
            } else if (minDiff > 2.5) {
                interval = 5
            }
        } else {
            interval = 2
        }
        var tagnamesArr = tagnames.split(",")
        var project = this.state.project
        this.tagController.GetTagTrend(
            tagnames,startDate, endDate, 
            ((val) =>{
                var chartData = []
                val.forEach((dat) => {
                    var newDat = { xval : dat.timestamp}
                    tagnamesArr.forEach((name) => {
                        var newkey = name
                        if(name.indexOf(project) > -1){
                            newkey = name.replace(project+"_", "");
                        }
                        newDat[newkey] = dat[name]
                        delete newDat[name]
                    })
                    chartData.push(newDat)
                })
                this.setState({modalData : chartData})
        }),interval)
    }
    handleDateChange(date, forComponent) {
        if (forComponent === 0) {
            this.setState({modalStartDate : date})
        } else if (forComponent === 1) {
            this.setState({modalEndDate : date})
        } 
    }
    renderModal() {
        if (this.state.modalData === undefined || this.state.modalData === false){
            return (<></>)
        }
        var title = this.props.title
        var data = this.state.modalData
        var dataMin = undefined
        var dataMax = undefined
        data.forEach((dat) => {
            let dataPresent = Object.keys(dat)
            dataPresent.forEach((key) => {
                if (key === "xval") {
                    return
                }
                let yval1 = parseFloat(parseFloat(dat[key]).toFixed(2))
                if (dataMin === undefined || dataMin > yval1) {
                    dataMin = yval1
                } 
                if (dataMax === undefined || dataMax < yval1 ) {
                    dataMax = yval1
                } 
            })
        })
        var startDate = this.state.modalStartDate
        var endDate = this.state.modalEndDate
        return (
            <Modal 
            size={"lg"} 
            aria-labelledby="contained-modal-title-vcenter"
            centered 
            show={this.props.show} 
            onHide={() => {this.props.handleModalClose()}}>
                <Modal.Header closeButton>
                    <Modal.Title style={{textAlign : "center"}}>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row style={{marginBottom : "15px", height : "50vh"}}>
                        <Col>
                            <MyLineChart data={data} title = {title} onClick={(data,title) => {}} dataMax={dataMax} dataMin={dataMin}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <DateTimePicker
                                        label="Start Date"
                                        inputVariant="outlined"
                                        value={startDate}
                                        maxDate={endDate}
                                        onChange={(date) => {this.handleDateChange(date,0)}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <DateTimePicker
                                        label="End Date"
                                        inputVariant="outlined"
                                        value={endDate}
                                        maxDate={new Date()}
                                        minDate={startDate}
                                        onChange={(date) => {this.handleDateChange(date,1)}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Button variant="contained" color="primary" onClick={()=>{this.reloadModalData()}}>
                                Reload Data
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
    
    render() {
        return(
            <>
                {this.renderModal()}
            </>
        )
    }
}
export default TrendModalChart;
