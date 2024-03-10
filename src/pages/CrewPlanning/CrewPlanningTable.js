import React from 'react';
import { Table } from 'react-bootstrap';
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
        <div className='CrewTable'>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th style={{ padding: '2px' }}>No.</th>
                        <th style={{ padding: '10px' }}>LOCATION</th>
                        <th style={{ padding: '20px' }}>TUGS</th>
                        <th style={{ padding: '10px' }}>CREW No.</th>
                        <th style={{ padding: '10px' }}>SHIFT</th>
                        <th style={{ width: '20rem' }}>OPS</th>
                        <th style={{ padding: '8px' }}>NATIONALITY</th>
                        <th style={{ width: '14rem' }}>RANKS</th>
                        <th style={{ width:'25rem' }}>NAMES</th>
                        <th style={{ padding: '2px' }}>EMPLOYEE NO</th>
                        <th style={{ width: '10rem' }}>JOINING DATE</th>
                        <th style={{ padding: '2px' }}>MONTHS ON BOARD</th>
                        {/* <th>REMARKS</th> */}
                    </tr>
                </thead>
                <tbody>
                    {props.crew.map((crew, idx) => (
                        crew.crew.map((c,i) => (
                            <tr key={`${idx} - ${i}`}>
                                {i===0&&<td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.crew.length}>{idx+1}</td>}
                                {i===0&&<td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.crew.length}>
                                    <input type="text" value={crew.location===null?'':crew.location} onChange={e=>props.changeCrewData(e.target.value, "LOCATION", idx)} />
                                </td>}
                                {i===0&&<td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.crew.length}>
                                    {crew.name}
                                </td>}
                                {i===0&&<td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.crew.length}>
                                    <input type="text" value={crew.optimumCrew===null?'':crew.optimumCrew} onChange={e=>props.changeCrewData(e.target.value, "OPTIMUMCREW", idx)} />
                                </td>}
                                {i===0&&<td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.crew.length}>
                                    {/* <input type="text" value={crew.shift===null?'':crew.shift} onChange={e=>props.changeCrewData(e.target.value, "SHIFT", idx)} /> */}
                                    <select value={crew.shift===null?'':crew.shift} onChange={e=>props.changeCrewData(e.target.value, "SHIFT", idx,i)}>
                                        <option value=""></option>
                                        <option value="Full">Full</option>
                                        <option value="Half">Half</option>
                                    </select>
                                </td>}
                                {i===0&&<td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }} rowSpan={crew.crew.length}>
                                    <input type="text" value={crew.ops===null?'':crew.ops} onChange={e=>props.changeCrewData(e.target.value, "OPS", idx)} />
                                </td>}
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <select value={c.nationality===null?'':c.nationality} onChange={e=>props.changeCrewData(e.target.value, "NATIONALITY", idx,i)}>
                                        <option value=""></option>
                                        <option value="Singaporean">Singaporean</option>
                                        <option value="Indonesian">Indonesian</option>
                                    </select>
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <select value={c.rank===null?'':c.rank} onChange={e=>props.changeCrewData(e.target.value, "RANKS", idx,i)}>
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
                                    <input type="text" value={c.name===null?'':c.name} onChange={e=>props.changeCrewData(e.target.value, "NAMES", idx,i)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <input type="text" value={c.employeeNo===null?'':c.employeeNo} onChange={e=>props.changeCrewData(e.target.value, "EMPLOYEENO", idx,i)} />
                                </td>
                                <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <DatePicker
                                        id={'JOININGDATE'} 
                                        aria-describedby={'JOININGDATE'} 
                                        value={c.joiningDate===null?null:moment(c.joiningDate)}
                                        onChange={e => props.changeCrewData(e, "JOININGDATE", idx,i)}
                                        name={'JOININGDATE'}
                                        format="dd/MM/yyyy"
                                        className="crewPlanningDateInput"
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
                                    {isEmpty(c.joiningDate)?'':moment().diff(moment(c.joiningDate), 'months')}
                                </td>
                                {/* <td className={'crewCell'} style={{ backgroundColor: idx%2===0?'white':'#dfdede' }}>
                                    <input type="text" value={c.remarks===null?'':c.remarks} onChange={e=>props.changeCrewData(e.target.value, "REMARKS", idx,i)} />
                                </td> */}
                            </tr>
                        ))
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default CrewPlanningTable;