import React from 'react'
import { Row, Col } from 'react-bootstrap';
import VerticalProgress from './VerticalProgress.js'
import DisplayData from '../../components/Display/Display.js';
import {parseInputToFixed2} from '../../Helper/GeneralFunc/parseInputToFixed2.js';

class VerticalBar extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <>
            <Row className="justify-content-center" ><DisplayData title={this.props.title} value={parseInputToFixed2(this.props.led1)} unit="" width="80" font="small" /></Row>
            <Row className="justify-content-center" ><VerticalProgress progress={this.props.barValue} /></Row>
            <Row className="justify-content-center" ><DisplayData  value={parseInputToFixed2(this.props.led2)} width="80" font="small" /></Row>
            </>
        )
    }
    
}
export default VerticalBar