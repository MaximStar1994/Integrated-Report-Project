import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
  } from 'recharts';
import React from 'react';

// data = [{name: string, value : int}]
class MyBarChart extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data : props.data
        }
    }
    componentWillReceiveProps(nextProps) {
      this.setState({ data: nextProps.data });  
    }
    render() {
      return (
            <ResponsiveContainer  height="100%" width="100%">
                <BarChart
                    data={this.state.data}
                    margin={{
                    top: 5, right: 10, left: 0, bottom: 5,
                    }}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke="#374e57"
                    />
                    <XAxis dataKey="name" 
                            angle={-45} textAnchor="end" 
                            tick = {{fontSize: 8, fontFamily: "'Roboto', sans-serif", color : "#0b8dbe"}} 
                            interval={0}/>
                    <YAxis width={30} axisLine={false} tick={{fontSize: 8, fontFamily: "'Roboto', sans-serif", color : "#0b8dbe"}}/>
                    <Tooltip />
                    <Bar dataKey="value" fill="#04445d" />
                </BarChart>
            </ResponsiveContainer>
      );
    }
}

export default MyBarChart