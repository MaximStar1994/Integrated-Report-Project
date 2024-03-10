import React from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import './map.css';
import { markerIcon, trackingIcon } from './mapMarker';
import MaterialUIPickers from '../DateTimePicker/datetimepicker';
import Tag from '../../model/Tag.js'
import { mapSelectionDayRange } from '../../Helper/GeneralFunc/setIntervals.js'
class Map extends React.Component {

  constructor(props) {
    super(props);
    var startDate = new Date()
    var endDate = new Date()
    startDate.setDate(startDate.getDate() - 5)
    this.state = {
      organization: "-",
      project: localStorage.getItem("project") || "B357",
      startDate: startDate,
      endDate: endDate,
      mapData: [],
      center: [1.3521, 103.8198],
      interval:3
    }
    this.mapController = new Tag();
  }

  componentDidMount() {
   
   this.updateMap()

  }

  updateMap(){
    var tagnames = this.props.tagnames;
    const {startDate,endDate,interval} = this.state;
    
    this.mapController.GetTagTrend(this.props.tagnames, startDate, endDate, ((val) => {
      if (val === null) {
        return
      }
      
      val.forEach((dat) => {
        for (var key in dat) {
          
          if (key.indexOf('Latitude') > -1) {
            dat['lat'] = dat[key];
            delete dat[key]
          }

          if (key.indexOf('Longitude') > -1) {
            dat['lng'] = dat[key];
            delete dat[key]
          }
        }
      })
     
      this.setState({ mapData: val, center:val[0] })
    }))
  }

  updateDateRange = (start, end) => {
    let newStart =start.toISOString()
    let newEnd =end.toISOString()
    this.setState({ startDate: newStart, endDate: newEnd });
    console.log(newStart + newEnd) 
    this.updateMap()
  }

  render() {
    let { mapData,center } = this.state;
     
    mapData = mapData.sort((a, b) => b.timestamp - a.timestamp);
    let markerItems = null;
    if (mapData.length > 0) {

      markerItems = mapData.map((item, i) => {
        let markerImg = trackingIcon;
        if (i == 0) { markerImg = markerIcon; }
        let marker = [item.lat, item.lng];
        return <Marker key={i} position={marker} icon={markerImg} >
          <Tooltip><span>Timestamp:{new Date(item.timestamp).toDateString()}<br />Lat: {item.lat}<br />lng: {item.lng}</span></Tooltip>
        </Marker>
      })
    }
    return (
      <>
        <div style={{ width: "50vw", justifyItems: "left" }} >
          <MaterialUIPickers updateDateRange={this.updateDateRange} />
        </div>

        <LeafletMap
          center={center}
          zoom={4}
          maxZoom={10}
          attributionControl={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
        >
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {markerItems}
        </LeafletMap>
      </>

    );
  }
}

export default Map