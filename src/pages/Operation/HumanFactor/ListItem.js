import React ,{useState,useEffect}from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import oiltankcontainer from '../../../assets/oiltankcontainer.jpg'
import CompositionCircleProgressBar from '../../../components/CircularProgressBar/CompositionCircleProgressBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle ,faPauseCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as moment from 'moment'
import './Areas.css'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '62vh'
    },
    listSection: {
        backgroundColor: 'transparent',
    },
    ul: {
        backgroundColor: 'transparent',
        margin: '0 0 3px 0'
    },
    li: {
        backgroundColor: '#075877',
        color: '#0b8dbe',
        padding: 10,
        margin: '0 0 5px 0'
    }
}));

export default function PinnedSubheaderList(props) {
    const classes = useStyles();
    const [lastUpdated,setLastUpdate] = useState(new Date());
    const [tasklist, setTasklist] = useState([]);
    useEffect(() => {
        if(props.tasklist!==undefined){
            setTasklist(props.tasklist)
            setLastUpdate(lastUpdated,new Date())
        }
    }, [lastUpdated,setLastUpdate,props.tasklist, setTasklist])
    // console.log("tasklist" + JSON.stringify(tasklist))
    return (
        <List className={classes.root} subheader={<li />}>
            {tasklist
            .sort((a, b) => a.id < b.id ? 1 : -1)
            .map((sectionId) => (
                <li key={`section-${Math.random()}`} className={classes.listSection}>
                    <ul className={classes.ul}>
                    <ListItem  className={classes.li} key={`item-${Math.random()}`}>
                            <>
                                <Col style={{ backgroundColor: 'black' }} md={2}><img src={oiltankcontainer} /></Col>
                                <Col md={4}>
                                    <div className="Taskfont" >
                                    <div >Task Id : <span className="fs1" >{sectionId.id ? sectionId.id : 'xx'}</span></div>
                                    <div >Title : <span className="fs1" >{sectionId.equipment ? sectionId.equipment : 'xx'}</span></div>
                                    <div >Equipment : <span className="fs1" >{sectionId.equipment ? sectionId.equipment : 'xx'}</span></div>
                                    <div>Description : <span className="fs1" style={{width: '50px', wordBreak: 'break-all'}}  >{sectionId.description ? sectionId.description : 'xx'}</span></div>
                                    <div>Status : 
                                    <span className="fs1" >{sectionId.status ? sectionId.status : 'xx'}</span></div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                <div className="Taskfont" >
                                    <div>Due: <span className="fs1" >{sectionId.dateCreated ? moment(sectionId.dateCreated).format('DD/MM/YYYY') : 'xxxxx'}</span></div>
                                    <div>Assigned:<span className="fs1" >{(sectionId.assignedTo.length>0)? ( sectionId.assignedTo[0].name ? sectionId.assignedTo[0].name : '-') : '-'}</span></div>
                                    <div>Created by : <span className="fs1" >{sectionId.dateCreated ? moment(sectionId.dateCreated).format('DD/MM/YYYY'): 'xxxxx'}</span></div>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <Row style={{margin:"10%"}} className="justify-content-md-center" >
                                        <CompositionCircleProgressBar  dataArr={[
                                        { percentage: ((sectionId.progress * 100) ? (sectionId.progress > 1) ? (sectionId.progress) : (sectionId.progress==1 ? 0.99 : sectionId.progress) * 100 : 0  ), color: "#00ff00" }
                                    ]}>
                                        <div className="whiteHeading1" style={{ textAlign: 'center', padding: "10px" }}>
                                            {(sectionId.progress > 1) ? parseInt(sectionId.progress) : ((sectionId.progress * 100) ? parseInt(sectionId.progress * 100) : 0)}%
                                        </div></CompositionCircleProgressBar></Row>
                                    <Row>
                                        <Col md={4}   ><FontAwesomeIcon icon={faTimesCircle} /></Col>
                                        <Col md={4} className={(sectionId.status=="Pause") ? 'fs' : 'xx'} ><FontAwesomeIcon icon={faPauseCircle} /></Col>
                                        <Col md={4} className={(sectionId.status=="Start") ? 'fs' : 'xx'} ><FontAwesomeIcon icon={faCheckCircle} /></Col>
                                    </Row>
                                </Col>
                            </>
                            {/* <ListItemText primary={`Item ${item}`} /> */}
                        </ListItem>
                    </ul>
                </li>
            ))}
        </List>
    );
}