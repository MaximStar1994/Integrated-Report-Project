import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FolderList from './list'
import FileTable from './fileTable'
import FileUpload from './FileUpload'
import AddModal from './AddFolderModal'
import './layout.css'

class DocumentLayout extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        // console.log("checkedList" + JSON.stringify(this.state.checkedList))
        var folderList = this.props.folderList
        var fileList = this.props.fileList
        return (<Container >
            <Row ><Col style={{ display: 'flex' }}>

            </Col><Col></Col><Col> <input className="textbox-1" type="text" placeholder="Search" /></Col></Row>

            <Row style={{ height: '75vh' }} >
                <Col md={4} className="rectbg m-3" >
                    <Row className="m-3">
                    <Col><FileUpload onFileUpload={this.props.onFileUpload} /> </Col>
                    </Row>
                    <Row style={{ height: '65vh' }} >

                        <FolderList data={folderList} selectFilesById={this.props.selectFilesById} /></Row>
                    <Row className="justify-content-md-center" style={{ backgroundColor: '#0a182a', height: '10vh' }}  >
                        <Button onClick={this.props.downloadFiles} style={{ backgroundColor: '#032A39', color: '#dee2e6', width: '100%', height: '5vh', bottom: "0" }}>
                            Download
                        </Button>
                    </Row>

                </Col>
                <Col md={7} className="rectbg m-3" >
                    <Row>

                        <AddModal parentfolder={this.props.currentFolderStr} createFolder={this.props.createFolder} />

                    </Row>
                    <Row>
                        <FileTable data={fileList} checkFiles={this.props.checkFiles} />
                    </Row>
                </Col>
            </Row>
        </Container>)
    }
}
export default DocumentLayout