import React from 'react';
import { Form } from 'react-bootstrap';
import { Select, MenuItem } from '@material-ui/core';
import config from '../../config/config';

const DisinfectionFormInput = props => (
    <Form.Group>
        <Form.Label style={{ color: config.KSTColors.MAIN }}>{props.title}</Form.Label>
        {(props.type==='text'||props.type==="number")&&
            <Form.Control 
                style={{ color: config.KSTColors.MAIN, fontWeight: '10', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid #707070', marginBottom: '5px' }} 
                type={props.type}
                id={props.id} 
                aria-describedby={props.id} 
                value={props.value}
                disabled={props.disabled}
                onChange={e => props.handleChange(e)}
                name={props.id}
            />
        }
        {(props.type==='selection')&&
            <div className="VesselReportSelectionBox">
                <Select style={{ color: config.KSTColors.MAIN }} 
                    type={props.type} 
                    disableUnderline 
                    id={props.id} 
                    aria-describedby={props.id} 
                    value={props.value}
                    onChange={e => props.handleChange(e)}
                    name={props.title}
                    className="VesselReportFillableBox"
                >
                    {
                        props.options.map(option => {
                            if(option==="")
                                return <MenuItem value={option} key={option}>Select {props.title}</MenuItem>
                            else
                                return <MenuItem value={option} key={option}>{option}</MenuItem>
                        })
                    }
                </Select>
            </div>
        }
        {(props.type==='textarea')&&
            <Form.Control 
                style={{ color: config.KSTColors.MAIN, fontWeight: '10' }} 
                as={props.type}
                rows={5} 
                id={props.id} 
                aria-describedby={props.id} 
                value={props.value}
                placeholder={props.placeholder}
                onChange={e => props.handleChange(e)}
                name={props.id}
            />
        }
    </Form.Group>
);

export default DisinfectionFormInput;