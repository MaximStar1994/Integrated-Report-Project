import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import config from '../../../config/config';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withMessageManager } from '../../../Helper/Message/MessageRenderer';

const useStyles = { 
    // backgroundColor: '#007bff', color: '#dee2e6', width: '15vw', height: '3vh', bottom: "0"
    backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON, width: '100%', height: '60px'
}
class UploadButtons extends React.Component {

    constructor(props) {
        super(props);
    }

    uploadFileHandler = (event) => {
        var acceptedFormat = ['xls', 'xlsx', 'doc', 'docx', 'pdf', 'mp4', 'mpeg', 'jpg', 'jpeg', 'png', 'ppt', 'pptx',
                               'XLS', 'XLSX', 'DOC', 'DOCX', 'PDF', 'MP4', 'MPEG', 'JPG', 'JPEG', 'PNG', 'PPT', 'PPTX']; 
        
		var uploadedfileExtn = event.target.files[0].name.split('.').pop()
        if (acceptedFormat.includes(uploadedfileExtn)) {
            console.log(('Valid file type'));
            this.props.onFileUpload(event)
            event.target.value = null;
        } else {
            console.log(('Invalid file type'));
            this.props.setMessages([{type : "danger", message : 'The selected file extension is not allowed. Allowed file types are xls, xlsx, doc, docx, pdf, mp4, mpeg, jpg, jpeg, png, ppt, pptx!'}]);
        }
	};
    
    render() {
        return (
            <div style={{ display: 'flex', width: '100%' }}>
                    <input
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        name="file"
                        // onChange={this.props.onFileUpload}
                        onChange={this.uploadFileHandler}
                        disabled={this.props.showUploadPercent===true}
                    />
                {/* <label htmlFor="raised-button-file" style={{ cursor: this.props.documanagement?'pointer':'not-allowed' }}> 
                <Button variant="contained" component="span" style={useStyles} disabled={!this.props.documanagement}>*/}
                <div style={{ display: 'flex', flexGrow: '1', paddingRight: '10px' }}>
                    <label htmlFor="raised-button-file" style={{ width: '100%' }} >
                        <Button variant="contained" component="span" style={useStyles} disabled={this.props.showUploadPercent===true}>
                            <CloudUploadIcon style={{ color: config.KSTColors.ICON }} />
                            <span style={{ color: config.KSTColors.WHITE, paddingLeft: '10px' }}>{this.props.showUploadPercent===true?'Uploading...':'Upload File'}</span>
                        </Button>
                    </label> 
                </div>
                <div style={{ position: 'relative', 
                display: this.props.showUploadPercent===true?'flex': 'none',
                // display: 'flex'
                 }}>
                    <CircularProgress variant="determinate" 
                    value={this.props.uploadPercent}
                    style={{ color: '#04588e', height: '60px', width: '60px' }} 
                    />
                    <div
                        style={{
                            height: '60px',
                            width: '60px',
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#04588e'
                        }}
                    >
                        {this.props.uploadPercent}%
                    </div>
                </div>
            </div>
        )
    }

}

export default withMessageManager(UploadButtons)


