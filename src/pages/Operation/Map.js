import React from 'react';
import Map from '../../components/Map/map.js';
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader';
class OperationMap extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            project: localStorage.getItem("project") || "B357",
            tagnames: ""
        }
    }
  
    render(){
        const tagnames = this.state.project + '_GPS_Latitude_decimal,' + this.state.project +'_GPS_Longitude_decimal'
        return(
            <DashboardCardWithHeader title="GPS Tracking">
                <Map tagnames={tagnames} />
            </DashboardCardWithHeader>
        )
    }

}
export default OperationMap;