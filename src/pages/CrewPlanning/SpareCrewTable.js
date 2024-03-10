import React from 'react';
import { Table } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import config from '../../config/config';
import { DatePicker } from "@material-ui/pickers";
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
const isEmpty=data=>{
    if(data===undefined||data===null||data==='')
        return true;
    else
        return false;
}
const CrewPlanningTable = props => {
    return(
        <div className={'CrewTable'}>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>LOCATION</th>
                        <th>SHIFT</th>
                        <th>OPS</th>
                        <th>NATIONALITY</th>
                        <th>RANKS</th>
                        <th>NAMES</th>
                        <th>EMPLOYEE NO</th>
                        <th>JOINING DATE</th>
                        <th>NO. OF MONTHS ON BOARD</th>
                        <th>REMARKS</th>
                    </tr>
                </thead>
                <tbody>
                    {props.spare.map((crew, idx) => (
                            <tr key={`${idx}`}>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.length}>{idx+1}</td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.length}>
                                    <input type="text" value={crew.location===null?'':crew.location} onChange={e=>props.changeCrewData(e.target.value, "LOCATION", idx)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.length}>
                                    <input type="text" value={crew.shift===null?'':crew.shift} onChange={e=>props.changeCrewData(e.target.value, "SHIFT", idx)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.length}>
                                    <input type="text" value={crew.ops===null?'':crew.ops} onChange={e=>props.changeCrewData(e.target.value, "OPS", idx)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <select value={crew.nationality===null?'':crew.nationality} onChange={e=>props.changeCrewData(e.target.value, "NATIONALITY", idx)}>
                                        <option value=""></option>
                                        <option value="Singaporean">Singaporean</option>
                                        <option value="Indonesian">Indonesian</option>
                                    </select>
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <select value={crew.rank===null?'':crew.rank} onChange={e=>props.changeCrewData(e.target.value, "RANKS", idx)}>
                                        <option value=""></option>
                                        <option value="Master">Master</option>
                                        <option value="Chief Officer">Chief Officer</option>
                                        <option value="Chief Engineer">Chief Engineer</option>
                                        <option value="2nd Engineer">2nd Engineer</option>
                                        <option value="AB">AB</option>
                                        <option value="Cadet">Cadet</option>
                                    </select>
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <input type="text" value={crew.name===null?'':crew.name} onChange={e=>props.changeCrewData(e.target.value, "NAMES", idx)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <input type="text" value={crew.employeeNo===null?'':crew.employeeNo} onChange={e=>props.changeCrewData(e.target.value, "EMPLOYEENO", idx)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <DatePicker
                                        id={'SPARECREW_JOININGDATE'} 
                                        aria-describedby={'SPARECREW_JOININGDATE'} 
                                        value={crew.joiningDate===null?null:moment(crew.joiningDate)}
                                        onChange={e => props.changeCrewData(e, "JOININGDATE", idx)}
                                        name={'SPARECREW_JOININGDATE'}
                                        format="dd / MM / yyyy"
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end" style={{ paddingRight: '5px', color: '#067FAA' }}>
                                                <span className="material-icons">date_range</span>
                                            </InputAdornment>
                                            )
                                        }}
                                    />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    {isEmpty(crew.joiningDate)?'':moment().diff(moment(crew.joiningDate), 'months')}
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <input type="text" value={crew.remarks===null?'':crew.remarks} onChange={e=>props.changeCrewData(e.target.value, "REMARKS", idx)} />
                                </td>
                            </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={props.addSpareCrew} variant="contained" style={{ backgroundColor: config.KSTColors.MAIN, borderRadius: '8px', paddingLeft: '30px', paddingRight: '30px', marginRight: '20px', color: config.KSTColors.ICON, width: '100%' }}>
                + Add Row
            </Button>    
        </div>
    );
}

export default CrewPlanningTable;