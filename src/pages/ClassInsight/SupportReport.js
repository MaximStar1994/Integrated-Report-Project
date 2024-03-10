import React from 'react';
import Container from 'react-bootstrap/Container'
import { Row, Col, Button, Modal, Form } from 'react-bootstrap'
import '../../css/App.css';
import '../../css/Dashboard.css';

import SideBar from '../../components/SideBar/ClassInsightSideBar'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import DownloadIcon from '../../assets/Icon/download.png'
import FullScreenSpinner from '../../components/FullScreenSpinner/FullScreenSpinner'
import Search from '../../components/Search/Search'

import './ClassInsight.css'
import { withLayoutManager } from '../../Helper/Layout/layout'
import {withMessageManager} from '../../Helper/Message/MessageRenderer'
import Report from '../../model/Report';
import { Checkbox, FormControl, InputLabel, MenuItem, Select, Button as MaterialButton} from '@material-ui/core';
import {DatePicker} from '@material-ui/pickers';
import Asset from '../../model/Asset';

import { Formik } from "formik";
import * as Yup from "yup";

class SupportReport extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSpinner : false,
            selectedPDF : undefined,
            reports : [],
            filteredReports :  [],
            selectedReports : [],
            modalShow : false,
            file : undefined,
            assets : []
        };
        this.reportApi = new Report()
        this.assetApi = new Asset()
        this.validationSchema = Yup.object().shape({
            assetname : Yup.string().required("Please choose an equipment"),
            date : Yup.date().required("Please select a date"),
        });
    }
    downloadZip() {
        var selected = this.state.selectedReports
        if (selected.length == 0) {
            this.props.setMessages([{type : "danger", message : "No reports were selected"}])
            return
        }
        var endPoint = this.reportApi.apiEndPoint
        var parseSelected = selected.map(report => {
            var path = report.path.substr(endPoint.length + 1);
            return {path : path, name : report.name}
        })
        this.reportApi.DownloadReports(parseSelected,(url,err) => {
            var element = document.getElementById('downloadBtn')
            element.setAttribute('href', url)
            element.click()
        })
    }
    componentDidMount() {
        this.updateData()
    }
    
    updateData(){
        this.reportApi.GetReports((reports) => {
            this.setState({reports : reports, filteredReports : reports, showSpinner : false, modalShow : false})
        })
        this.assetApi.GetAssetHealthList((list,err) => {
            this.setState({ assets : list.map((val) => val.assetname)})
        })
    };

    handleSubmitForm(values,setSubmitting) {
        if (this.state.file === undefined) {
            setSubmitting(false)
            alert("Please upload a pdf file")
            return
        } else {
            var formData = new FormData();
            formData.append("file", this.state.file);
            this.reportApi.uploadPDF(formData, (value) => {
                var filePath = this.reportApi.apiEndPoint + value.response
                var report = {
                    assetname : values.assetname,
                    condition : "Satisfactory",
                    date : values.date,
                    pdfpath : filePath,
                    name : this.state.file.name,
                }
                this.reportApi.UploadReport(report, (value) => {
                    setSubmitting(false)
                    this.updateData()
                })
            })
        }
    }

    renderUploadReportModal() {
        var init = {
            assetname : "",
            date : new Date(),
        }
        return(
            <Modal 
            size={"lg"} 
            aria-labelledby="contained-modal-title-vcenter"
            centered 
            show={this.state.modalShow} 
            onHide={() => {this.setState({modalShow : false})}}>
                <Modal.Header closeButton>
                    <Modal.Title style={{textAlign : "center"}}>Upload Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={init}
                        validationSchema={this.validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            this.setState({showSpinner : true})
                            this.handleSubmitForm(values,setSubmitting)
                        }}
                    >
                    {({values,errors,touched,handleChange,setFieldValue,handleSubmit,isSubmitting,setSubmitting})=> 
                    ( 
                        <Form onSubmit={handleSubmit} className="mx-auto">
                        <Row style={{marginTop : "10px", marginBottom : "10px"}}>
                            <Col>
                            <FormControl variant="outlined" style={{minWidth : "120px"}}>
                                <InputLabel id="assetname-outlined-label">Equipment</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={values.assetname}
                                    onChange={(e) => {setFieldValue("assetname",e.target.value)}}
                                    label="Equipment"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    this.state.assets.map(asset => 
                                        <MenuItem key={asset} value={asset}>{asset}</MenuItem>
                                    )
                                }
                                </Select>
                            </FormControl>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "10px", marginBottom : "10px"}}>
                            <Col>
                                <Row>
                                    <Col>
                                        <DatePicker
                                            label="Report Date"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            value={values.date}
                                            onChange={(date) => {setFieldValue("date",date)}}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{marginTop : "10px", marginBottom : "10px"}}>
                            <Col>
                                {
                                    this.state.file !== undefined && 
                                    <Row style={{marginTop : "10px", marginBottom : "10px"}}>
                                        <Col>{this.state.file.name}</Col>
                                    </Row>
                                }
                                
                                <input
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={(e) => {
                                        if (e.target.files.length > 0) {
                                            this.setState({file : e.target.files[0]})
                                        }
                                    }}
                                />
                                <label htmlFor="raised-button-file">
                                    <MaterialButton variant="contained" component="span" color="primary">
                                        Upload File
                                    </MaterialButton>
                                </label> 
                            </Col>
                        </Row>
                        <Row style={{marginTop : "10px", marginBottom : "10px"}}>
                            <Col>
                                <MaterialButton variant="contained" type="submit" color="primary">
                                    Submit
                                </MaterialButton>
                            </Col>
                        </Row>
                        </Form>
                    )}
                    </Formik>
                </Modal.Body>
            </Modal>
        )
    }

    renderPage() {
        return (
            <Row style={{ marginTop: "30px", justifyContent:"space-evenly" }}>
                <Col xs={12} lg={7}>
                    <div style={{padding : "0 15px"}}>
                    <Row style={{textAlign : "center", marginTop : "15px", marginBottom : "15px"}}>
                        <Col>
                            <Button onClick={()=>{this.setState({modalShow : true})}}>Add New Report</Button>
                        </Col>
                        <Col>
                            <a id="downloadBtn" className="myDownload"
                                download="reports.zip"
                                style={{ display: "none" }} />
                            <Button onClick={()=>{this.downloadZip()}}>Download Selected Files</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Search searchOn={["reportName"]} list={this.state.reports} searchDidEnd={(searchedArr) => {
                                this.setState({filteredReports : searchedArr})
                            }} />
                        </Col>
                    </Row>
                    <Row style={{marginTop : "15px", textAlign : "center", paddingLeft : "15px"}}>
                        <Col className="tableCol tableHeaderCol" xs={1}><div>ID</div></Col>
                        <Col className="tableCol tableHeaderCol" xs={2}>Equipment</Col>
                        <Col className="tableCol tableHeaderCol" xs={2}>Report Name</Col>
                        <Col className="tableCol tableHeaderCol" xs={2}>Condition</Col>
                        <Col className="tableCol tableHeaderCol" xs={2}>Report Date</Col>
                        <Col className="tableCol tableHeaderCol" xs={2}>Upload Date</Col>
                        <Col className="tableCol tableHeaderCol" xs={1}></Col>
                    </Row>
                    <div style={{overflowY : "scroll", maxHeight : "50vh", marginRight : "-15px", paddingRight : "15px", paddingLeft : "15px"}}>
                    {this.state.filteredReports.map(report => 
                        <Row key={report.id} className="clickable selectable" onClick={()=>{
                            this.setState({selectedPDF : report.pdfURL})
                        }} style={{paddingTop : "5px", paddingBottom : "5px", textAlign : "center", fontSize : "0.8rem"}}>
                            <Col className="tableCol" xs={1}>{report.id}</Col>
                            <Col className="tableCol" xs={2}>{report.Equipment}</Col>
                            <Col className="tableCol" xs={2}>{report.reportName}</Col>
                            <Col className="tableCol" xs={2}>{report.condition}</Col>
                            <Col className="tableCol" xs={2}>{report.reportDate.replace("T",' ').replace("Z",'').slice(0, -4)}</Col>
                            <Col className="tableCol" xs={2}>{report.dateUploaded.replace("T",' ').replace("Z",'').slice(0, -4)}</Col>
                            <Col className="tableCol" xs={1}>
                            <Checkbox 
                            onChange={(e) => {
                                var currentSelectedReport = this.state.selectedReports
                                if (e.target.checked) {
                                    currentSelectedReport.push({path : report.pdfURL, name : report.reportName, id : report.id})
                                } else {
                                    currentSelectedReport = currentSelectedReport.filter((selected) => {return selected.id != report.id})
                                }
                                this.setState({selectedReports : currentSelectedReport})
                            }}></Checkbox></Col>
                        </Row>
                    )}
                    </div>
                    </div>
                </Col>
                <Col xs={12} lg={5}>
                    {
                        this.state.selectedPDF && 
                        <div style={{paddingRight : "15px", height : this.props.renderFor == 0 ? "100%" : "100vh"}}>
                            <object data={this.state.selectedPDF} type="application/pdf" width="100%" height="100%">
                                <p style={{padding : "15px", textAlign : "center"}}>
                                    It appears you don't have a PDF plugin for this browser.
                                    No biggie... you can <a href={this.state.selectedPDF} target="_blank">click here to
                                    download the PDF file.</a>
                                </p>
                            </object>
                        </div>
                    }
                </Col>
            </Row>
        )
    }
    renderLG() {
        return (
            <SideBar>
                <DashboardCardWithHeader title="Support Report">
                    {this.renderPage()}
                </DashboardCardWithHeader>
            </SideBar>
        )
    }

    renderSM() {
        return (
            <DashboardCardWithHeader title="Support Report">
                {this.renderPage()}
            </DashboardCardWithHeader>
        )
    }
    render() {
        var contents = this.renderLG()
        if (this.props.renderFor == 1) {
            contents = this.renderSM()
        }
        if (this.props.renderFor == 2) {
            contents = this.renderSM()
        }
        return (
            <div className="content-inner-all">
                {this.state.showSpinner && (<FullScreenSpinner />)}
                <Container fluid={true}>
                    {this.renderUploadReportModal()}
                    {contents}
                </Container>
            </div>)
    }
}

export default withMessageManager(withLayoutManager(SupportReport));
