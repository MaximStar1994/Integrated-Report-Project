import React, { PureComponent } from 'react';
import {
    AreaChart, Area , XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';
import './Areachart.css'

// data = [{xval: string, value : int}]
// dataMax, dataMin
// yLabel, xLabel
// colors : { key : String }
class MyAreaChart extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    
    render() {
        var areas = []
        let colors = this.props.colors || {}
        var data = this.props.data
        if (data.length > 0) {
            let sampleData = data[0]
            let dataPresent = Object.keys(sampleData)
            var i = 0
            dataPresent.forEach((key,i) => {
                if (key === "xval") {
                    return
                }
                var color = colors[key] || "gray"
                areas.push(<Area key={key} type="monotone" dataKey={key} stroke={color} fillOpacity={0.5} fill={color}/>)
                i ++
            })
        }
        var dataMin = "auto"
        var dataMax = "auto"
        if (this.props.dataMin !== undefined) {
            dataMin = this.props.dataMin
        }
        if (this.props.dataMax !== undefined) {
            dataMax = this.props.dataMax
        }
        var yAxis = (
            <YAxis type="number"  
            stroke="white"
            domain={[dataMin => (this.props.dataMin), dataMax => (this.props.dataMax)]}>
                <Label value={this.props.yLabel} angle={-90} position="insideLeft" fontWeight="normal" fill="white" offset={15}></Label>
            </YAxis>)
        if (dataMin === "auto" || dataMax === "auto") {
            yAxis = (
            <YAxis type="number"  stroke="white">
                <Label value={this.props.yLabel} angle={-90} position="outsideStart" fontWeight="normal" fill="white" offset={15}></Label>
            </YAxis>)
        }
      return (
            <ResponsiveContainer height="100%" width="100%">
                <AreaChart
                    data={this.props.data}
                    margin={{
                        top: 5, right: 10, left: 0, bottom: 5,
                    }}
                    >
                    {areas}
                    <XAxis dataKey="xval" stroke="white">
                        <Label fill="white" value={this.props.xLabel} offset={0} position="insideBottom"  fontWeight="normal"/>
                    </XAxis>
                    {yAxis}
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend style={{fontSize : "xx-small"}} verticalAlign="top" align="right"/>
                </AreaChart>
            </ResponsiveContainer>
      );
    }
}
export default MyAreaChart