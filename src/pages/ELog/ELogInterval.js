import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from "react-router-dom"

const timeIntervalValue = {
    1: '0001 - 0400',
    2: '0401 - 0800',
    3: '0801 - 1200',
    4: '1201 - 1600',
    5: '1601 - 2000',
    6: '2001 - 0000',
}

const ELogInterval = props => 
<div className='TimeIntervals'>
    <span className='ButtonTextTimeInterval'>
    <Button variant="contained" color="primary" 
            className='EditButtonELogTable'
            onClick={()=> {
                props.history.push({pathname: `/elogeditform/${props.id}`})
            }}>
            <FontAwesomeIcon icon={faEdit} size='lg'/> 
        </Button>
        <span className='EditButtonTextELogTable'>{timeIntervalValue[props.id]}</span>
    </span>
    <FontAwesomeIcon icon={faCircle} size={'sm'} style={props.isSaved===true?{ color: '#66ff00' }: { color: '#067FAA' }} />
</div>

export default withRouter(ELogInterval);