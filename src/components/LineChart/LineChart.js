import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';
import './LineChart.css'

// data = [{xval: string, value : int}]
// dataMax, dataMin
class MyLineChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title : props.title
        }
    }
    
    render() {

        const  NotAxisTickButLabel = props=> ( <g transform={  "translate( " + props.x + "," + props.y + " )" }><text x={0} y={0} dy={16}   fontSize="0.8rem"  textAnchor={props.textAnchor || "end"}  fill={props.color || "#8884d8" } transform={"rotate(" + props.angle + ")"  }  >{props.payload.value}</text></g> )
        
        var lines = []
       // let colors = ["#92c0d1","#83b3c4","#5198b3","#045370","#022f3f"]
       
       
        let colors = ["#d72631","#a2d5c6","#077b8a","#5c3c92","#cf1578", "#e8d21d", "#039fbe","#b20238",
                       "#e75874", "#be1558", "#fbcbc9", "#322514","#1e3d59", "#f5f0e1", "#ff6e40", "#ffc13b"]
        var data = this.props.data
        if (data.length > 0) {
            let sampleData = data[0]
            let dataPresent = Object.keys(sampleData)
            var i = 0
            dataPresent.forEach((key) => {
                if (key === "xval") {
                    return
                }
               // var color = colors[i%colors.length]
                var color = colors[i]
                lines.push(<Line key={key} type="monotone" dataKey={key} stroke={color} dot={true}/>)
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
        var yAxis = (<YAxis type="number" domain={[dataMin => (this.props.dataMin), dataMax => (this.props.dataMax)]}  
        tick={<NotAxisTickButLabel angle={0} color={"#6c757d"} />} />)
        if (dataMin === "auto" || dataMax === "auto") {
            yAxis = (<YAxis type="number" tick={<NotAxisTickButLabel angle={0} color={"#6c757d"} />} />)
        }
        
      return (
            <ResponsiveContainer height="100%" width="100%">
                <LineChart
                    data={this.props.data}
                    margin={{
                        top: 5, right: 10, left: 0, bottom: 5,
                    }}
                    onClick={()=> {
                        this.props.onClick(this.props.data, this.state.title)
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374e57"/>
                    <XAxis dataKey="xval" tick={<NotAxisTickButLabel angle={0} color={"#6c757d"} />} >
                    </XAxis>
                    {yAxis}
                    <Tooltip formatter={this.props.dataLabelFormatter} labelFormatter={this.props.labelFormatter}/>
                    <Legend style={{ fontSize: '4rem' }} />
                    {lines}
                </LineChart>
            </ResponsiveContainer>
      );
    }
}
export default MyLineChart