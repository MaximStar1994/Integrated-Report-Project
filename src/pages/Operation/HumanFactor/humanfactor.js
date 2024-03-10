import React from 'react';
import DashboardCard from '../../../components/DashboardCard/DashboardCard';
import ScrollableTabsButtonAuto from '../../../components/Tab/HumanFactorTab'
import HumanFactorApi from '../../../model/HumanFactor.js';
import socketIOClient from "socket.io-client";
class HumanFactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabList: [
                { key: 'GeoFencing', title: 'GEOFENCING' },
                { key: 'Task', title: 'TASK' }
            ],
            SOS: 0,
            location: 'roomA',
            timestamp: '',
        }
        this.HumanFactorApi = new HumanFactorApi();
    }

    updatesos(data) {
     
        if (data.payload == '1') {
            this.setState({ SOS: 1, location: data.location, timestamp: data.timestamp })
        } else {
            this.setState({ SOS: 0 })
        }
    }

    componentDidMount() {
        const socket = socketIOClient(this.HumanFactorApi.socketEndPoint, { path: `/${window.RIGCAREBACKENDSUBDIR}/socket.io` });
        socket.on("alert", data => this.updatesos(data));
    }

    render(){
        const sos = this.state.SOS;
        var Alert = (<></>)
        if (sos == 1) {
            Alert = (<div id="alertMessage" style={{backgroundColor:'red', color:'#fff',height:'5vh'}}>
                <span className="closebtn" onClick={() => this.updatesos({ "payload": '0' })} >&times;</span>
                <strong>Danger!</strong> Emergency SOS. Call from {this.state.location}.
                <br />
                Received on: {this.state.timestamp}
            </div>)
        }

        return (
            <DashboardCard>
                 {Alert}
                <ScrollableTabsButtonAuto tabList={this.state.tabList} />
            </DashboardCard>
        )
    }
}
export default HumanFactor