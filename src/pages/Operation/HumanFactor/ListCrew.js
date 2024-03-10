import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import profile from '../../../assets/Icon/profile.png'
import './Areas.css'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '50vh'
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
    const crewlist = props.list;
   
    return (
        <List className={classes.root} subheader={<li />}>
            {crewlist
                .sort((a, b) => a.id > b.id ? 1 : -1)
                .map((ele) => (
                    <li key={`section-${Math.random()}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <ListItem className={classes.li} key={`item-${Math.random()}`}>
                               <Row>
                                   <Col>
                                   <div className="justify-content-md-center">

                                        <img style={{ width: '8vw', height: '8vh', margin: 'auto', display: 'flex' }} src={profile} />
                                </div>
                                   </Col>
                                   <Col>
                                   <div className="justify-content-md-center">
                                  
                                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                        NAME: <span className="fs1" >{ele.name ? ele.name : 'xx'}</span>
                                    </div>
                                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                        TITLE: <span className="fs1" >{ele.title ? ele.title : 'xx'}</span>
                                    </div>
                                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                        BPM:  <span className="fs1" > {ele.heartRate ? ele.heartRate : 'xx'}</span >
                                    </div>
                                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                        Battery:  <span className="fs1" > {ele.batteryLife ? ele.batteryLife : 'xx'}</span >
                                    </div>
                                </div>
                                   </Col>
                               </Row>
                            </ListItem>
                        </ul>
                    </li>
                ))}
        </List>
    );
}