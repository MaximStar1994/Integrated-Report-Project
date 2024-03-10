import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import './BiaxiaLineChart.css';
import {getColorCode} from '../../Helper/GeneralFunc/parseInputToFixed2'
import RigmoveApi from '../../model/Rigmove.js';
class BiaxialLineChart extends React.Component {
    constructor(props) {
        super(props)
        var startDate = new Date()
        var endDate = new Date()
        startDate.setDate(startDate.getDate()-3)
     
        this.state = { 
            project: localStorage.getItem("project") || "B357",
            tickFont: [{ fill: '#000000'}],
            startDate :startDate ,
            endDate :endDate
        };
        this.RigmoveApi = new RigmoveApi();
         this._isMounted = false;
    }

    // formatXAxis = (tickItem) => { return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(tickItem) }

    render() {
        const  NotAxisTickButLabel = props=> ( <g transform={  "translate( " + props.x + "," + props.y + " )" }><text x={0} y={0} dy={16}   fontSize="1vh"  textAnchor={props.textAnchor || "end"}  fill={props.color || "#8884d8" } transform={"rotate(" + props.angle + ")"  }  >{props.payload.value}</text></g>   )
        const  AxisLabel = props =>(<text x={0} y={0} dy={16} fontSize="1vh"  textAnchor="end" angle={180} />)
        const {project} = this.state;
        const data = this.props.data
        const tagsWyaxisIds = this.props.tagsWyaxisIds;
        if (data.length > 0) {
            var lines =[];
            var uniqueYAxids = [];
            var YAxises = [];
            var XAxiss = [];
            var c=0,xx= 0;
            var dataMin = "dataMin", dataMax="dataMax";
            var title = this.props.title ? this.props.title : "test,t"
            if(title.indexOf(',')>-1){
            var titleArr = title.split(',');
            
            var titleLength = titleArr.length;
            var titleCount = 0;
            }
            // loop yaxisids arr
            Object.keys(tagsWyaxisIds).map(function(key,i) {
                var yAxisId = tagsWyaxisIds[key];
                var unit = '';
                // remove unit split by comma
                if(yAxisId.indexOf('_')>-1){
                    var yAxisIdArr = yAxisId.split('_');
                    yAxisId = yAxisIdArr[0]
                    unit = yAxisIdArr[1];
                }

                if (uniqueYAxids.indexOf(yAxisId) === -1) {
                    var orientationYaxis = 'left'
                    var YAxisColor = "#8884d8";
                    if(c>0){orientationYaxis ='right';YAxisColor = "#82ca9d"}

                    
                    uniqueYAxids.push(yAxisId)
                    


                    var color = getColorCode(i);
                    var tit = titleArr[titleCount];
                    var YAxisEle = (<YAxis key={`yAxis_${i}`} yAxisId={yAxisId} stroke={YAxisColor} label={<AxisLabel></AxisLabel>}  tick={<NotAxisTickButLabel angle={0} color={YAxisColor}/>} orientation={orientationYaxis} />)
                    YAxises.push(YAxisEle)
                    c++;  
                   // console.log("titleCount" + titleCount + "titleLength" + titleLength + titleArr[titleCount])
                    if(titleCount < titleLength){titleCount++; }
                }

                var line = (<Line key={key} unit={unit} yAxisId={yAxisId} type="monotone" dataKey={key} stroke={getColorCode(i)}  activeDot={{ r: 0.3 }}/>)
                lines.push(line)

            });
            

            // loop return result 
            data.forEach((item)=> {
                Object.keys(item).forEach((k)=>{
                    if(xx==0){
                        // get first column as xaxis
                        var axxis = (<XAxis key={`xAxis_${xx}`} dataKey={k} tick={<NotAxisTickButLabel angle={0} color={"#6c757d"} />}  />)
                        XAxiss.push(axxis)
                    }

                    if(k.indexOf(project+'_')>-1){
                        var newKey = k.replace(project+'_', '');
                        item[newKey] = item[k];
                        delete item[k]
                    }
                    xx++;
                    
                }) 
            })
        }
        
        return (
        <div id="container" >
        <ResponsiveContainer >
            <LineChart data={data} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="1 1" />
                <Tooltip />
                <Legend />
                {YAxises}
                {lines}
                {XAxiss}
            </LineChart>
         </ResponsiveContainer>
         </div>
        )
    }

}
export default BiaxialLineChart