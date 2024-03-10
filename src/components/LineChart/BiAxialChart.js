import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';
import './LineChart.css'

// data = [{xval: string, value : int, value2 : int}]
// dataMax = {value : int, value2 : int}, dataMin = {value : int, value2 : int}
// title = string
// colors = [string]
// dataLabelFormatter = (value,name) => {}
// y1Formatter = (value) => {}
// y2Formatter = (value) => {}
// y1Width : Int
// y2Width : Int
// yAxisIds = {
//     value : String
// }
// bg : String

class BiAxialChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title : props.title
        }
    }
    
    render() {
        var lines = []
        var yAxises = []
        let colors = this.props.colors
        var data = this.props.data
        var tooltip = (<Tooltip formatter={this.props.dataLabelFormatter}/>)
        if (data.length > 0) {
            let sampleData = data[0]
            let dataPresent = Object.keys(sampleData)
            var i = 0
            dataPresent.forEach((key) => {
                if (key === "xval") {
                    return
                }
                var yAxisIds = this.props.yAxisIds
                var color = colors[i%colors.length]
                if (sampleData["xval"] != null) {
                    lines.push(<Line yAxisId={yAxisIds[key]} key={key} type="monotone" dataKey={key} stroke={color} dot={false}/>)
                } else {
                    tooltip = (<></>)
                    // lines.push(<Line yAxisId={yAxisIds[key]} key={key} type="monotone" dataKey={key} stroke={this.props.bg} dot={false} activeDot={false}/>)
                }
                var dataMin = "auto"
                var dataMax = "auto"
                var yFormatter = this.props.y1Formatter
                var yWidth = this.props.y1Width
                if (this.props.dataMin !== undefined && this.props.dataMin[key] !== undefined) {
                    dataMin = this.props.dataMin[key]
                }
                if (this.props.dataMax !== undefined && this.props.dataMax[key] !== undefined) {
                    dataMax = this.props.dataMax[key]
                }
                var orientation = "left"
                if (i != 0) {
                    if (i > 1) {
                        yFormatter = this.props.y2Formatter
                        orientation = "right"
                        yWidth = this.props.y2Width
                    }
                    var yAxis = (<YAxis tickFormatter={yFormatter} width={yWidth} tick={{ fill: '#0977A2', fontSize : "0.5rem"}} key={key} yAxisId={yAxisIds[key]} type="number" domain={[dataMin => (dataMin), dataMax => (dataMax)]} orientation={orientation}/>)
                    if (dataMin === "auto" || dataMax === "auto") {
                        yAxis = (<YAxis tickFormatter={yFormatter} width={yWidth} tick={{ fill: '#0977A2', fontSize : "0.5rem"}} key={key} yAxisId={yAxisIds[key]} type="number" orientation={orientation}/>)
                    }
                    yAxises.push(yAxis)
                }
                i ++
            })
        } 
       
      return (
            <ResponsiveContainer height="100%" width="100%">
                <LineChart
                    data={this.props.data}
                    margin={{
                        top: 5, right: 0, left: 0, bottom: 5,
                    }}
                    onClick={()=> {
                        this.props.onClick(this.props.data, this.state.title)
                    }}
                    >
                    <CartesianGrid stroke={this.props.bg} horizontal={false} vertical={false} fill={this.props.bg}/>
                    <XAxis height={15} tick={{ fill: '#0977A2', fontSize : "0.5rem" }} dataKey="xval" >
                    </XAxis>
                    {yAxises}
                    {tooltip}
                    {lines}
                </LineChart>
            </ResponsiveContainer>
      );
    }
}
export default BiAxialChart