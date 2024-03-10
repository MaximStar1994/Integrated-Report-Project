import React from 'react';
import {Card, Form, FormControl} from 'react-bootstrap';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './BDN.css';

const delivery_receiverCard = props => (
    <Card style={{ margin: '0px', color: '#067FAA', backgroundColor: '#032a39', borderRadius: '0px', border: '0px'}}>
        {props.header?
            <Card.Header style={{ border: '0px', color: '#067FAA', backgroundColor: '#032a39'}}>
                {props.header}
            </Card.Header>
        :null}
        <Card.Body style={{ border: '0px' }}>
            {props.data?props.data.map((row,idk) => (
                <React.Fragment key={idk}>
                    <label> {row.label}</label>   
                    {!row.selection?
                    <FormControl
                        disabled={row.disabled}
                        type="text" 
                        id={row.field} 
                        aria-describedby={row.field} 
                        defaultValue={row.value}
                        onBlur={props.handleChange}
                        name={row.field}
                        className={(row.touched && row.error) !==undefined? "InputBoxError" : "InputBox"}
                    /> 
                    :
                    (<Select style={{ width: '100%', paddingLeft: '5px' }} 
                        labelId={row.field} 
                        id={row.field} 
                        name ={row.field} 
                        value={row.value} 
                        onChange={props.handleChange} 
                        className={(row.touched && row.error) !==undefined? "InputBoxError" : "InputBox"} 
                        displayEmpty>
                        <MenuItem value={''}> <em> Select Combustion Temperature </em> </MenuItem>
                        <MenuItem value={'0'}>0 &#8451;</MenuItem>
                        <MenuItem value={'15'}>15 &#8451;</MenuItem>
                        <MenuItem value={'15.5'}>60 &#8457;</MenuItem>
                        <MenuItem value={'20'}>20 &#8451;</MenuItem>
                        <MenuItem value={'25'}>25 &#8451;</MenuItem>
                    </Select>)}
                        <div className={"ErrorMessage"}>
                        {(row.touched && row.error) !== undefined? row.touched && row.error:<br/>}  
                        </div>
                        <br />
                </React.Fragment>
            )): null}
        </Card.Body>
    </Card>
);

export default delivery_receiverCard;