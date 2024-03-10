import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer,Scatter,Legend,ComposedChart,Line
} from 'recharts';
import './composedChart.css';


class ComposedCharts extends PureComponent {

  render() {
    const data = this.props.data
    var dataMin = "auto"
    var dataMax = "auto"
      
      if (data === undefined || data === null || data.length === 0 ){
          return (
            <div style= {{height : "100%", width : "100%", display: "flex", textAlign : "center", alignItems : "center", backgroundColor : "#0c4458", borderRadius : "15px"}}>
                <div style={{margin : "auto"}}>No Data Present</div>
            </div>
        )
      }else {
      var domain_xaxis = [
         data[0]['index'] ? data[0]['index'] : 0,
         data[data.length-1]['index'] ?  Math.round(data[data.length-1]['index']) : 50
      ]

      var domain_yaxis = [
         this.props.dataMinYaxis ? this.props.dataMinYaxis : 0,
         this.props.dataMaxYaxis ? this.props.dataMaxYaxis : 50
      ]

      var yaxisTitle = this.props.yaxisTitle ? this.props.yaxisTitle : 'TRANSIT BUBBLE Y VALUE';
      var xaxisTitle = this.props.xaxisTitle ? this.props.xaxisTitle : 'TRANSIT BUBBLE X VALUE';
    
    return (
      <>
    <ResponsiveContainer >
     <ComposedChart data={data}>
        <CartesianGrid stroke="#f5f5f5" fill='pink' />
        <Tooltip  labelFormatter={(name) => xaxisTitle + ': ' + name}  />
        <XAxis name={xaxisTitle} LineType="linear"  label={{value:xaxisTitle, fill:'#fff'}} domain={domain_xaxis} xAxisId="bottom" dataKey="data1[0]['x']" type="number" orientation="bottom"  />
        <XAxis type="number" LineType="linear" domain={domain_xaxis}  xAxisId="top" dataKey="index" orientation="top" hide={true}  />
        <YAxis  yAxisId="ykey"  domain={domain_yaxis} type="number" label={{ value:yaxisTitle, angle: -90, position: 'insideLeft', fill:'#fff' }}  />
        <Area type="monotone"  xAxisId="top" yAxisId="ykey" dataKey="Y_Motion"  fill="#54D550" stroke="#54D550" fillOpacity="0.3"   />
        <Scatter name={yaxisTitle}  yAxisId="ykey"  xAxisId="bottom" dataKey="data1[0]['y']" fill="#EA3919"  />
      </ComposedChart>
      
      </ResponsiveContainer>
    </>
    );
   }
  }
}
ComposedCharts.propTypes={
  dataMinYaxis: propTypes.number,
  dataMaxYaxis: propTypes.number,
  yaxisTitle: propTypes.string,
  xaxisTitle: propTypes.string
}
export default ComposedCharts
