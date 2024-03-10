import React, { Component } from 'react';
import camera from '../../assets/Icon/camera.png'
import CameraAltIcon from '@material-ui/icons/CameraAlt';
export default class MultipleImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];

    constructor(props) {
        super(props)
        this.state = {
            file: [null],
            defaultfiles: [{ url: camera }, { url: camera }, { url: camera }, { url: camera }],
            allowUpload: this.props.allowUpload
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }

    uploadMultipleFiles(e) {
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
        }
        this.setState({ file: this.fileArray })
    }

    uploadFiles(e) {
        e.preventDefault()
        console.log(this.state.file)
    }

    render() {
        const len = this.fileArray.length > 0 
        let fileDiv = (<></>);
        let uploadButton = (<></>);
        let attachfiles = (<></>);
        if (this.state.allowUpload == true) {
            uploadButton = (<><button type="button"  style={{textAlign: 'left',color:'#dee2e6'}} className="btn btn-block" onClick={this.uploadFiles}><CameraAltIcon/>&nbsp;Upload</button></>)
            attachfiles = (<div className="form-group">
                <input type="file" className="form-control" onChange={this.uploadMultipleFiles} multiple />
            </div>)
        }

        if (len) {
            fileDiv = (<div className="form-group multi-preview">
                {(this.fileArray).map((url,index) => (
                    <img key={index} style={{ width: "6vw" }} src={url} alt="..." />
                ))}
            </div>);
        } else {
            fileDiv = (<div className="form-group multi-preview">
                {(this.state.defaultfiles).map((img,index) => (
                    <img key={index} style={{ width: "6vw" }} src={img.url} alt="..." />
                ))}
            </div>);
        }

        return (
            <>
                {attachfiles}
                {uploadButton}
                {fileDiv}
            </>
        )
    }
}