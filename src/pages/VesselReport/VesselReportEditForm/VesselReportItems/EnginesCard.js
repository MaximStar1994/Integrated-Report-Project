import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import config from '../../../../config/config';
 
const EnginesCard = props => (
    <Card style={{ padding: '10px', borderRadius: '10px', marginBottom: '10px', ...props.extraStyle }}>
        {Object.entries(props.structure).map(([element, elementDetail], idx) => (
            <Form.Group  as={Row} key={idx} style={{ marginBottom: '2px', marginRight: '0px' }}>
                <Form.Label column xs={7} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem', paddingRight: '0px'}}>{`${props.item[props.identifier]}.${elementDetail.title}`}</Form.Label>
                {((elementDetail.type==='text' || elementDetail.type==='number'))&&
                    <React.Fragment>
                        <Col xs={4} style={{ paddingLeft: '5px', paddingRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column' }}>
                            <Form.Control
                                type={elementDetail.type} 
                                id={`${props.type}[${props.index}].${element}`} 
                                aria-describedby={`${props.type}[${props.index}].${element}`} 
                                value={element==='totalRunningHour'?(props.item['carryForwardRunningHour']||0)+(props.item['runningHour']||0):element==='totalLNGRunningHour'?(props.item['LNGcarryForwardRunningHour']||0)+(props.item['LNGrunningHour']||0):props.item[element]===null?'':props.item[element]}
                                onChange={props.handleChange}
                                name={`${props.type}[${props.index}].${element}`}
                                className={(props?.touched?.[`${props.type}`]?.[props.index]?.[element] && props?.errors?.[`${props.type}`]?.[props.index]?.[element]) !== undefined?"VesselReportFillableErrorBox":elementDetail.editable===false?"VesselReportNonFillableBox":(props.item[element]===null||props.item[element]===''||elementDetail.min===undefined || elementDetail.max===undefined || (props.item[element]>=elementDetail.min && props.item[element]<=elementDetail.max))?"VesselReportFillableBox":"VesselReportFillableBoxOutOfRange"}
                                style={{ padding: '5px' }}
                                disabled={elementDetail.editable===false}
                            />
                            {(props?.touched?.[`${props.type}`]?.[props.index]?.[`${element}`] && props?.errors?.[`${props.type}`]?.[props.index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors[`${props.type}`][props.index][`${element}`]}</span>}
                        </Col>
                        <Col xs={1} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem', display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'center', paddingLeft: '0px', paddingRight: '0px' }}>
                                {elementDetail.suffix}
                        </Col>
                    </React.Fragment>
                }
                {elementDetail.type==='selection'&&
                    <React.Fragment>
                        <Col xs={4} style={{ paddingLeft: '5px', paddingRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column' }}>
                            <div style={{ width: '100%' }} className="VesselReportSelectionBox">
                                <Select
                                    type={elementDetail.type} 
                                    id={`${props.type}[${props.index}].${element}`} 
                                    aria-describedby={`${props.type}[${props.index}].${element}`} 
                                    value={props.item[element]===null?'':props.item[element]}
                                    onChange={props.handleChange}
                                    name={`${props.type}[${props.index}].${element}`}
                                    className={(props?.touched?.[`${props.type}`]?.[props.index]?.[element] && props?.errors?.[`${props.type}`]?.[props.index]?.[element]) !== undefined?"VesselReportFillableErrorBox":"VesselReportFillableBox"}   
                                    style={{ padding: '5px' }}
                                    disableUnderline
                                >
                                    {Object.entries(elementDetail.options).map(([option, optionText]) => <MenuItem value={option} key={option}> {optionText.text}</MenuItem>)}
                                </Select>
                            </div>
                            {(props?.touched?.[`${props.type}`]?.[props.index]?.[`${element}`] && props?.errors?.[`${props.type}`]?.[props.index]?.[`${element}`]) !== undefined&& <span className="VesselReportError">{props.errors[`${props.type}`][props.index][`${element}`]}</span>}
                        </Col>
                        <Col xs={1} style={{ color: config.KSTColors.MAIN, fontSize: '0.8rem', display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'center', paddingLeft: '0px', paddingRight: '0px' }}>
                                {elementDetail.suffix}
                        </Col>
                    </React.Fragment>
                }
            </Form.Group>
        ))
        }
    </Card>
);

export default EnginesCard;