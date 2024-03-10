import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FolderList from './list'
import ExplorerList from './ExplorerList'
import FileTable from './fileTable'
import FileUpload from './FileUpload'
import AddModal from './AddFolderModal'
import UploadIcon from '@material-ui/icons/CloudUpload'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from '@material-ui/icons/Refresh';
import Uploadkpi from './UploadKPI'
import './layout.css'
import config from '../../../config/config';
import { withAuthManager } from '../../../Helper/Auth/auth'

class DesktopLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false,
            showKpi : false
        };

    }
    render() {
        var folderList = this.props.folderList
        var fileList = this.props.fileList

        if (folderList == []) {
            return (<></>)
        }

        const userEditAllowed = () => {
            if(!/\D/.test(this.props.currentFolderId)===true&&this.props.currentFolderId!==100001&&this.props.currentFolderId>1000)
                return true
            return false;
        }
        
        return (<Container  fluid={true} >
            <Row style={{ backgroundColor: '#e6e6e6', minHeight: '85vh' }}>
                <Col>
                    <Row>
                        <Col md={2} >
                            {this.props.selectedVessel.vessel_id==='0'&&<AddModal documanagement={this.props.user.apps.includes(config.apps.DOCUMENTMANAGEMENT)} parentfolder={this.props.currentFolderStr} parentfolderid={this.props.currentFolderId} userEditAllowed={userEditAllowed} createFolder={this.props.createFolder} />}
                        </Col>
                        <Col md={2}>
                            {this.props.selectedVessel.vessel_id==='0'&&<span className={userEditAllowed()?'GreyFont1halfrem':'UserEditableBlock GreyFont1halfrem'} style={{ height: '100%' }} 
                                onClick={()=>userEditAllowed()&&this.props.deleteFolder()}> 
                                <DeleteIcon />Folder</span>
                            }
                        </Col>
                         <Col md={6}></Col>
                        <Col md={2} style={{display: 'flex', justifyContent: 'space-around'}}>
                            <span className="GreyFont1halfrem" onClick={this.props.downloadFiles} ><DownloadIcon className="m-2" />Download</span>
                            {this.props.selectedVessel.vessel_id==='0'&&<span className="GreyFont1halfrem" style={{ height: '100%' }} onClick={this.props.deleteFiles} > <DeleteIcon /> File</span>}
                        </Col>
                        {/* <Col md={6} className="rightContent"  >
                            <Row className="align-items-center">
                              
                                <Col md={7}><input className="textbox-1" type="text" placeholder="Search" style={{width:'15vw'}} /></Col>
                                <Col><RefreshIcon style={{fill: "#dee2e6"}}/></Col>
                               
                            </Row>
                            
                        </Col> */}
                    </Row>
                    <a id='downloadBtn' download="documents.zip" style={{ display: 'none' }}></a>
                    <Row style={{ minHeight: '67vh' }} >
                        <Col md={3} style={{ border: '10px solid #e6e6e6' }}>
                                    {this.props.selectedVessel.vessel_id==='0' &&  <Row style={{ height: '12vh' }}>
                                        <FileUpload documanagement={this.props.user.apps.includes(config.apps.DOCUMENTMANAGEMENT)} onFileUpload={this.props.onFileUpload} uploadPercent={this.props.uploadPercent} showUploadPercent={this.props.showUploadPercent} />
                                    </Row>}
                                    <Row style={{ height: '61vh', overflowY: 'scroll', alignContent: 'baseline', backgroundColor: '#eeeff5' }} className="explorerlist" >
                                        {/* <FolderList data={folderList} selectFilesById={this.props.selectFilesById} currentFolderId={this.props.currentFolderId} /> */}
                                        <ExplorerList data={folderList} selectFilesById={this.props.selectFilesById} currentFolderId={this.props.currentFolderId} />
                                    </Row>

                            </Col>
                            <Col md={9} style={{ border: '10px solid #e6e6e6' }}>
                                    {this.props.selectedVessel.vessel_id==='0' &&  <Row style={{ height: '12vh' }}>
                                        {/* <FileUpload documanagement={this.props.user.apps.includes(config.apps.DOCUMENTMANAGEMENT)} onFileUpload={this.props.onFileUpload}  /> */}
                                    </Row>}
                                    <Row style={{ minHeight: '61vh', alignContent: 'baseline', backgroundColor: '#eeeff5' }} className="explorerlist" >
                                        {/* <FolderList data={folderList} selectFilesById={this.props.selectFilesById} currentFolderId={this.props.currentFolderId} /> */}
                                        {/* <ExplorerList data={folderList} selectFilesById={this.props.selectFilesById} currentFolderId={this.props.currentFolderId} /> */}
                                        <FileTable data={fileList} checkFiles={this.props.checkFiles} />
                                    </Row>

                                
                            </Col>
                    </Row>
                </Col>
            </Row>
        </Container>)
    }
}
export default withAuthManager(DesktopLayout);