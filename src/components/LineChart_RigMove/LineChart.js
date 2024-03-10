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
            title : props.title,
            xOrientation: (props.xOrientation) ? props.xOrientation : 'bottom',
            yOrientation: (props.yOrientation) ? props.yOrientation : 'left'
        }
    }
    //formatXAxis = (tickItem) => { return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(tickItem) }

    render() {

        const  NotAxisTickButLabel = props=> ( <g transform={  "translate( " + props.x + "," + props.y + " )" }><text x={0} y={0} dy={16}   fontSize="1vh"  textAnchor={props.textAnchor || "end"}  fill={props.color || "#8884d8" } transform={"rotate(" + props.angle + ")"  }  >{props.payload.value}</text></g>   )
        
        var lines = []
        let colors = ["#92c0d1","#5198b3","#045b7b","#034057"]
        var data = this.props.data
        if (data.length > 0) {
            let sampleData = data[0]
            let dataPresent = Object.keys(sampleData)
            var i = 0
            dataPresent.forEach((key) => {
                if (key === "xval") {
                    return
                }
                var color = colors[i%colors.length]
                lines.push(<Line key={key} type="monotone" dataKey={key} stroke={color} dot={true}/>)
                i ++
            })
        }
        else{
            return <></>
        } 
        var dataMin = "auto"
        var dataMax = "auto"
        if (this.props.dataMin !== undefined) {
            dataMin = this.props.dataMin
        }
        if (this.props.dataMax !== undefined) {
            dataMax = this.props.dataMax
        }
        var yAxis = (<YAxis type="number" domain={[dataMin => (this.props.dataMin), dataMax => (this.props.dataMax)]} tick={<NotAxisTickButLabel angle={0} color={"#6c757d"} />} />)
        if (dataMin === "auto" || dataMax === "auto") {
            yAxis = (<YAxis type="number" />)
        }
        
        var showLegend = this.props.showLegend

   
      return (
            <ResponsiveContainer height="100%" width="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5, right: 10, left: 0, bottom: 5,
                    }}
                    onClick={()=> {
                        this.props.onClick(this.props.data, this.state.title)
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374e57"/>
                    <XAxis dataKey="xval" orientation={this.state.xOrientation}  tick={<NotAxisTickButLabel angle={0} color={"#6c757d"} />} >
                    </XAxis>
                    {yAxis}
                    <Tooltip />
                    {showLegend ? <Legend style={{fontSize : "xx-small"}} /> : <></>}
                    {lines}
                </LineChart>
            </ResponsiveContainer>
      );
    }
}
export default MyLineChart