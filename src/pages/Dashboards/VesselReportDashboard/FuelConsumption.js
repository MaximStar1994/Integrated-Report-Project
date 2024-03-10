import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const FuelConsumption = props => (
    <React.Fragment>
        <div className="Heading">
            Daily Fuel Consumption Rate
        </div>
        <Row style={{ margin: '0px' }}>
            <Col xs={props.showLNG===true?6:12} style={{ display: 'flex', alignItems: 'center', padding: '0px', justifyContent: "center" }}>
                <Card className='FuelConsumptionCard'>
                    <div style={{ color: "#9B9595", fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem', display: props.showLNG===true?'block':'none'}} >
                        Diesel
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', marginTop: '1rem' }}>
                        {(props.data instanceof Array && props.data.length)>0?props.data[props.data.length-1].fuel:0}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
                        litres / hour
                    </div>
                </Card>
            </Col>
            <Col xs={props.showLNG===true?6:0} style={{ display: props.showLNG===true?'flex':'none', alignItems: 'center', padding: '0px', justifyContent: "center" }}>
                <Card className='FuelConsumptionCard'>
                    <div style={{ color: "#9B9595", fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem', display: props.showLNG===true?'block':'none' }}>
                        LNG
                    </div>
                    <div style={{ color: "#04568E", fontSize: '3rem', textAlign: 'center', marginTop: '1rem' }}>
                        {(props.data instanceof Array && props.data.length)>0?props.data[props.data.length-1].lngfuel:0}
                    </div>
                    <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
                        kg / hour
                    </div>
                </Card>
            </Col>
            <Col xs={props.showLNG===true?6:12} style={{ padding: '0px' }}>
                {(props.data instanceof Array && props.data.length)>0&&
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart
                            data={props.data}                           
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <XAxis dataKey="date" padding={{ left: 40 }} interval={0} style={{ fontSize: '20px' }} />
                            <YAxis unit=" l  " fontFamily="MonteCarlo" tickLine={false} tickSize={12}/>
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="fuel"
                                stroke="#04568E"
                                activeDot={{ r: 3, fill: '#04568E', stroke: '#04568E' }}
                                dot={{ r: 3, fill: '#04568E' }}
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                }
            </Col>
            <Col xs={props.showLNG===true?6:0} style={{ padding: '0px' }}>
                {(props.data instanceof Array && props.data.length)>0&&
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart
                            data={props.data}                           
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <XAxis dataKey="date" padding={{ left: 40 }} interval={0} style={{ fontSize: '20px' }} />
                            <YAxis unit=" l  " fontFamily="MonteCarlo" tickLine={false} tickSize={12}/>
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="lngfuel"
                                stroke="#04568E"
                                activeDot={{ r: 3, fill: '#04568E', stroke: '#04568E' }}
                                dot={{ r: 3, fill: '#04568E' }}
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                }
            </Col>
        </Row>
    </React.Fragment>
)

export default FuelConsumption;