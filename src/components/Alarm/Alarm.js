import React from 'react';
import AlarmIcon from '../../assets/Icon/AlarmIcon.png'
import Button from '@material-ui/core/Button'
import {Row,Col} from 'react-bootstrap'
import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core/styles';
import Alarm from '../../model/Alarm.js'
import RedBtn from '../../assets/Icon/RedRoundIndicator.png'
import ClearBtn from '../../assets/Icon/ClearRoundIndicator.png'

export default class AlarmList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            data:[]
        }
        this.alarmApi = new Alarm()
    }

    handleOpen = () => { 
        this.alarmApi.GetAlarmMonitoring((val,err) => {
            this.setState({data : val})
        }) 
        this.setState({modalOpen:true})
        
    };

    handleClose = () => {
        this.setState({modalOpen:false})
    };
    render() {
        const data = this.state.data;
        const alarmGroup = this.props.alarmGroup
        var x = 0; 
        var cols = (<></>);
        if (data[alarmGroup] === undefined) {
        }else{
            cols = Object.keys(data[alarmGroup]).map(function(key) {
                x++
                return (<Row  noGutters={true} key={x} style={{textAlign : "left", color : "black", fontWeight : "semibold", fontSize : "0.9rem", paddingTop:"0", paddingBottom : "0"}}>
                        <Col xs={2} style={{display : "flex", alignItems : "center"}}>
                            <img src={data[alarmGroup][key] ? RedBtn : ClearBtn} style={{width : "30px", height : "30px", marginLeft : "auto"}} />
                        </Col>
                        <Col xs={10} style={{paddingLeft : "5px", display : "flex", alignItems : "center", fontSize : "0.8rem"}}>
                            {key}
                        </Col>
                        </Row> )
                        

            });
            
        }

        const body = (
            <div style={{width: "30vw", margin:"auto",top:"30%",left:"50%",transform:"translate(-50%, -50%)",position:"absolute", backgroundColor: "#fff"}}  >
                <Row>
                    <Col>
                        <h1 style={{fontSize : "1rem", padding: "5", backgroundColor:"#c0c0c0"}}>{this.props.title}</h1>
                    </Col>
                </Row>
                {cols}
            </div>
        )
        return (
            <div>
                <Button variant="contained" onClick={this.handleOpen}>
                    <img src={AlarmIcon} /> ALARMS
              </Button>
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </div>
        );

    }

}
