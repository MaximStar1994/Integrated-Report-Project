import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import MainEngineIcon from '../../../assets/KST/MainEngine.png';
import GeneratorsIcon from '../../../assets/KST/Generators.png';
import { parseInputToFixed2 } from '../../../Helper/GeneralFunc/parseInputToFixed2';


const RemainOnBoard = props =>(
<React.Fragment>
    <div className="Heading">
        Running Hours Record (h)
    </div>
    <div style={{ display: 'flex', border: '4px solid #9B9595', borderRadius: '20px', padding: '1rem', position: 'relative', justifyContent: 'space-around' }}>
        <div style={{ position: 'absolute', top: '-10px', display: 'flex', width: '100%', justifyContent: 'center' }}>
            <span style={{ backgroundColor: '#E6E6E6', paddingLeft: '5px', paddingRight: '5px' }}>
                <img src={MainEngineIcon} alt="Engine Icon" style={{ width: '2rem', height: '1rem' }} /> 
                <span style={{ paddingLeft: '10px', color: '#9B9595' }}>Main Engines</span>
            </span>
        </div>
        {props.data.engines.map(element=>(
            <Card className='RunningHourCard' key={element.name}>
                <Row>
                    <Col>
                        <div>
                            <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center' }}>
                                Engine {element.name}
                            </div>
                            <div className="RunningHourDisplayCard">
                                <span className="RunningHourDisplayName">Daily{props.showLNG===true?' Diesel':''}</span>
                                <span className="RunningHourDisplayValue">{parseInputToFixed2(element.daily)}</span>
                            </div>
                            <div className="RunningHourDisplayCard" style={{ display: props.showLNG===true?'flex':'none' }}>
                                <span className="RunningHourDisplayName">Daily LNG</span>
                                <span className="RunningHourDisplayValue">{parseInputToFixed2(element.daily)}</span>
                            </div>
                            <div className="RunningHourDisplayCard">
                                <span className="RunningHourDisplayName">Total</span>
                                <span className="RunningHourDisplayValue">{parseInputToFixed2(element.total)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        ))}
    </div>
    <div style={{ display: 'flex', border: '4px solid #9B9595', borderRadius: '20px', padding: '1rem', position: 'relative', justifyContent: 'space-around', marginTop: '1rem' }}>
        <div style={{ position: 'absolute', top: '-10px', display: 'flex', width: '100%', justifyContent: 'center' }}>
            <span style={{ backgroundColor: '#E6E6E6', paddingLeft: '5px', paddingRight: '5px' }}>
                <img src={GeneratorsIcon} alt="Engine Icon" style={{ width: '2rem', height: '1rem' }} /> 
                <span style={{ paddingLeft: '10px', color: '#9B9595' }}>Generators</span>
            </span>
        </div>
        {props.data.generators.map((element, idx)=>(
            <Card key={idx} className='RunningHourCard'>
                <Row>
                    <Col>
                        <div>
                            <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center' }}>
                                {element.name}
                            </div>
                            <div className="RunningHourDisplayCard">
                                <span className="RunningHourDisplayName">Daily</span>
                                <span className="RunningHourDisplayValue">{parseInputToFixed2(element.daily)}</span>
                            </div>
                            <div className="RunningHourDisplayCard">
                                <span className="RunningHourDisplayName">Total</span>
                                <span className="RunningHourDisplayValue">{parseInputToFixed2(element.total)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        ))}
    </div>
</React.Fragment>
);

export default RemainOnBoard;