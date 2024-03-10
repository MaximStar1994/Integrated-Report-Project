import React, { useState, useEffect,useRef } from "react";
import './VesselReportExcelGenerator.css';
import { Col, Container, Modal, Button, Row } from 'react-bootstrap';
import Tooltip from '@material-ui/core/Tooltip';
import VesselReportApi from "../../../model/VesselReport";
import ReactExport from 'react-data-export';
import { columns,VESSELREPORTCATEGORIES } from "./VesselReportExcelStaticFile";
import config from "../../../config/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport,faUpload } from '@fortawesome/free-solid-svg-icons';
import UploadExcel from "./UploadExcel";
import VesselExportIMG from "../../../assets/KST/vessel_excel_export.png";
import { withMessageManager } from '../../../Helper/Message/MessageRenderer';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const VesselReportExcelGenerator = (props) => {
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [excelData, setExcelData] = useState([]);
    const [morningShiftLogExcelData, setMorningShiftLogExcelData] = useState([]);
    const [eveningShiftLogExcelData, setEveningShiftLogExcelData] = useState([]);
    const [versions, setVersions] = useState({ dailyLog: 0, shift: 0 });
    const vesselReportApi = new VesselReportApi();
    const loggedInVesselName = JSON.parse(localStorage.getItem('selectedVessel'))?.name;
    const dailyLogRef = useRef(null);
    const morningShiftRef = useRef(null);
    const eveningShiftRef = useRef(null);
    var generatedData = [
        {
            columns: columns,
            data: excelData
        }
    ];

    var morningShiftLogGeneratedData = [
        {
            columns: columns,
            data: morningShiftLogExcelData
        }
    ];

    var eveningShiftLogGeneratedData = [
        {
            columns: columns,
            data: eveningShiftLogExcelData
        }
    ];

    useEffect(() => {
        fetchVesselReportFormStructure();
    }, []);

    const fetchVesselReportFormStructure = async () => {
        try {
            const vesselReportFormStructure = await vesselReportApi.getVesselReportFormStructure();
            const morningShiftLogFormStructure = await vesselReportApi.getVesselReportShiftLogFormStructure(VESSELREPORTCATEGORIES.MORNINGSHIFTIDENTIFIER);
            const eveningShiftLogFormStructure = await vesselReportApi.getVesselReportShiftLogFormStructure(VESSELREPORTCATEGORIES.EVENINGSHIFTIDENTIFIER);
            setExcelData(vesselReportFormStructure);
            setMorningShiftLogExcelData(morningShiftLogFormStructure);
            setEveningShiftLogExcelData(eveningShiftLogFormStructure);
            let dailyLogVersion = vesselReportFormStructure.filter(e=>e[0].value==='Version')
            if(dailyLogVersion.length>0){
                dailyLogVersion = dailyLogVersion[0][1].value
            }
            let shiftVersion = vesselReportFormStructure.filter(e=>e[0].value==='Version')
            if(shiftVersion.length>0){
                shiftVersion = shiftVersion[0][1].value
            }
            setVersions({ dailyLog: dailyLogVersion, shift: shiftVersion })
        } catch (error) {
            console.log(error);
            props.setMessages([{type : "danger", message : 'Something went wrong. Please try again!'}]);
        }
    };

    const formTemplateDownload = () => {
        dailyLogRef.current.click();
        morningShiftRef.current.click();
        eveningShiftRef.current.click();
        setExportModalOpen(false);
    }

    return (
        <Container fluid className="VesselReportExcelBackground">
            <Col lg={7}>
                <Row style={{ justifyContent: 'center', height: '2rem',paddingTop: "40px",height: "10%" }}>
                    <div style={{fontSize: "2rem",color: config.KSTColors.MAIN,fontWeight: "900",}}>
                        OFFLINE VESSEL REPORT
                    </div>
                </Row>
                {/* Export Vessel report excel UI */}
                <Row xs={12} md={3} style={{backgroundColor: config.KSTColors.CARD_BG,height: "150px",borderRadius: "15px",marginTop: "40px"}}>
                    <Col xs={3} lg={3} style={{ padding: "0px" }}>
                        <Button className="VesselReportExcelEditButton" style={{ backgroundColor: config.KSTColors.MAIN,borderColor: config.KSTColors.MAIN,width: "100%"}} onClick={() => setExportModalOpen(true)}>
                            {/* <FontAwesomeIcon icon={faFileExport} style={{color: config.KSTColors.ICON,fontSize: "60px"}} /> */}
                            <img src={VesselExportIMG} alt="Excel Export" style={{height: "120px"}}/>
                        </Button>
                    </Col>
                    <Col xs={6} lg={6}>
                        <div style={{display: "flex",width: "100%",height: "100%",flexDirection: "column",justifyContent: "center"}}>
                            <div style={{marginTop: "5px",width: "100%",height: "50%",color: config.KSTColors.MAIN,fontSize: "32px",
                                display: "flex",justifyContent: "center",alignItems: "center"}}>
                                Download Template
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* Import Vessel report excel UI */}
                <UploadExcel template={generatedData} versions={versions}/>
            </Col>
            <Modal size="lg" show={exportModalOpen} onHide = {() => setExportModalOpen(false)} aria-labelledby="VRTemplateDownload" centered>
                <Modal.Header style={{ backgroundColor: '#e6e6e6' }}>
                    <Modal.Title id="VRTemplateDownload">Export Vessel Report Templates - <span style={{color: "#04588e",fontSize: "15px"}}>Morning,Evening and Daily Log</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span style={{fontSize: "12px"}}>Are you sure to generate {loggedInVesselName} vessel report?</span>
                </Modal.Body>
                <Modal.Footer style={{ color: '#04588e' }}>
                    <Button onClick={() => setExportModalOpen(false)} style={{ backgroundColor: 'white', color: '#04588e', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Cancel</Button>
                    <Tooltip title="Daily log,Morning shift & Evening shift templates download" placement="bottom"><Button onClick={() => formTemplateDownload()} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px' }}>Download Templates</Button></Tooltip>
                    <ExcelFile filename={`${loggedInVesselName}_DailyLogTemplate`} element={<Tooltip title="Export Daily Log Template" placement="bottom"><Button ref={dailyLogRef} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px',display: "none" }}>Daily Log</Button></Tooltip>}>
                        <ExcelSheet dataSet={generatedData} name="Daily Log" />
                    </ExcelFile>
                    <ExcelFile filename={`${loggedInVesselName}_MorningShiftTemplate`} element={<Tooltip title="Export Morning Shift Template" placement="bottom"><Button ref={morningShiftRef} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px',display: "none" }}>Morning Shift</Button></Tooltip>}>
                        <ExcelSheet dataSet={morningShiftLogGeneratedData} name="Morning Shift Log" />
                    </ExcelFile>
                    <ExcelFile filename={`${loggedInVesselName}_EveningShiftTemplate`} element={<Tooltip title="Export Evening Shift Template" placement="bottom"><Button ref={eveningShiftRef} style={{ backgroundColor: '#04588e', color: 'white', paddingTop: '2px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '20px',display: "none" }}>Evening Shift</Button></Tooltip>}>
                        <ExcelSheet dataSet={eveningShiftLogGeneratedData} name="Evening Shift Log" />
                    </ExcelFile>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default withMessageManager(VesselReportExcelGenerator);