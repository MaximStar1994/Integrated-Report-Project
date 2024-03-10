import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withMessageManager } from '../../Helper/Message/MessageRenderer';
import { withLayoutManager } from '../../Helper/Layout/layout'
import { withAuthManager } from '../../Helper/Auth/auth';
import DocumentLayout from './Document/layout'
import DesktopLayout from './Document/desktopLayout'
import Footer from './Footer'
import Model from '../../model/Model'
import documentApi from '../../model/Document'
import Report from '../../model/Report'
import './workorder.css'
import { Event } from '@material-ui/icons'
import FullScreenSpinner from "../../components/FullScreenSpinner/FullScreenSpinner"

const initialState = {
    fileList: [],
    checkedList: [],
    currentFolderId: '',
    currentFolderStr: 'KST FLEET',
    showUploadPercent: false,
    uploadPercent: 0
};
class WorkOrderDocument extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            folderList: [],
            loading : false,
            ...initialState
        }
        this.documentApi = new documentApi()
        this.api = new Model();
        this.reportApi = new Report()
    }

    ListFolder = () => {
        let vesselId
        if(this.props.user.isAuthenticated===true && this.props.user.vessels.length>0 
            &&  this.props.user.accountType==='vessel'
           )
        {
            vesselId = this.props.user.vessels[0].vesselId
        }
        this.documentApi.ListAllFolders(vesselId,logs => {
            this.setState({ folderList: logs, loading : false })

        })
    }
    componentDidMount() {
        this.setState({loading : true})
        this.ListFolder()
    }

    selectFilesById = (folderId, foldername) => {
        var folderSelected = foldername.split('-')

        if (folderSelected instanceof Array && folderSelected.length > 0){
            this.setState({ currentFolderId: folderId, currentFolderStr: foldername })
            this.documentApi.GetFilesInFolderByIdAndName(folderId,foldername, logs => {
               
                this.setState({ fileList: logs })
            })
        } else {
            this.setState(initialState)
        }

    }

    createFolder = async (foldername) => {
        var parentFolderId = null
        if (this.state.currentFolderId !== "") {
            parentFolderId = this.state.currentFolderId
        }
        var folder = {
            name: foldername,
            parentFolderId: parentFolderId,
            id: ''
        }
        // this.setState({ loading: true });
        this.documentApi.PostFolder(folder, response => {
            if(response.success === false) {
                this.props.setMessages([
                    { type: "danger", message: response.error }
                  ]);
                  this.setState({ loading: false });
            } else {
                this.setState({ loading: false });
                this.props.setMessages([
                    { type: "success", message: "Folder created successfully" }
                  ]);
                this.ListFolder();
            }
        })
    }
    
    onFileUpload = (event) => {
        console.log('onFileUpload--',this.state.currentFolderId)
        var folderSelected = this.state.currentFolderId.split('-')

        if (this.state.currentFolderId === '' || event.target.files <= 0 || this.state.currentFolderId < '1001') {
            alert("Please select folder in KST Fleet to upload file.")
            return
        }
        else {
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("folderId", this.state.currentFolderId);
            this.setState({ showUploadPercent: true })
            this.documentApi.PostFile(formData, this.state.currentFolderId, (percent)=>{this.setState({ uploadPercent: percent })}, logs => {
                // console.log("upload call back logs" + JSON.stringify(logs))
                this.selectFilesById(this.state.currentFolderId, this.state.currentFolderStr)
                this.setState({ showUploadPercent: false })
            })
        }
    };


    checkFiles = (checked) => {
        this.setState({ checkedList: checked });
    }

    deleteFiles = (folderId, foldername) =>{
        var selectedFiles = this.state.checkedList;

        var folderSelected = this.state.currentFolderId.split('-')
        if (selectedFiles.length > 0) {
            var parseSelected = selectedFiles.map(report => {

                let actualPath;
                if (folderSelected.length> 1)
                {
                    actualPath = report.slice(0, report.lastIndexOf("/"));
                }
                else
                {
                    actualPath = report
                }


                return actualPath
            })
            this.documentApi.DeleteFiles(parseSelected, logs => {
                this.selectFilesById(this.state.currentFolderId, this.state.currentFolderStr)
           })
        }
   
      
    }

    deleteFolder = () =>{
        var folderSelected = this.state.currentFolderId.split('-')
        var folderId =this.state.currentFolderId
        if (folderSelected.length === 1) {
            this.documentApi.DeleteFolder(folderId, logs => {
                console.log('Delete folder call back logs' + JSON.stringify(logs))
                this.ListFolder()
                
           })
           
        }
    }



    downloadFiles = () => {
        var selectedFiles = this.state.checkedList;
        if (selectedFiles.length > 0) {
            var parseSelected = selectedFiles.map(report => {
                var filename
                var path
                const actualPath = report.slice(0, report.lastIndexOf("/"));
                if(report.substring(report.lastIndexOf('/') + 1) === report)
                {
                    filename = report.substring(report.lastIndexOf('\\') + 1)
                    path = report
                }
                else
                {
                    filename = report.substring(report.lastIndexOf('/') + 1)
                    path = actualPath.replace(/\\/g, "/")
                }
             
                return { path: path, name: filename }
            })
            this.reportApi.DownloadReports(parseSelected, (url, err) => {
                var element = document.getElementById('downloadBtn')
                element.setAttribute('href', url)
                element.click()
            })
        }

    }

 
    renderLG() {
        return (<DesktopLayout {...this.state} downloadFiles={this.downloadFiles} createFolder={this.createFolder} checkFiles={this.checkFiles} selectFilesById={this.selectFilesById} deleteFolder={this.deleteFolder} deleteFiles={this.deleteFiles}  onFileUpload={this.onFileUpload} uploadPercent={this.state.uploadPercent} showUploadPercent={this.state.showUploadPercent} />)
    }

    renderSM() {

        return (<>
            <div className="hr"><hr /></div>
            <DocumentLayout {...this.state} downloadFiles={this.downloadFiles} checkFiles={this.checkFiles} selectFilesById={this.selectFilesById} createFolder={this.createFolder}  deleteFiles={this.deleteFiles}  />
            {/* <Footer /> */}
        </>)
    }

    render() {
        if (this.props.renderFor === undefined) {
            return (<></>)
        }
        // var fileList = this.state.fileList;
        // var folderList = this.state.folderList;
        if (this.state.loading) {
            return <FullScreenSpinner/>
        }
        var contents = this.renderLG()
        // if (this.props.renderFor === 2 || this.props.renderFor === 1) {
        //     contents = this.renderSM()
        // }
        return (

            <React.Fragment>
           
                {/* <Container fluid className="KSTBackground"> */}
                    <Container fluid style={{ backgroundColor: '#f2f2f2' }}>
                    {contents}

                    </Container>
                {/* </Container> */}

            </React.Fragment>
            // <div className="content-inner-all">
            //    // {contents}
            // </div>
        )
    }
}
export default withMessageManager(withLayoutManager(withAuthManager(WorkOrderDocument)))