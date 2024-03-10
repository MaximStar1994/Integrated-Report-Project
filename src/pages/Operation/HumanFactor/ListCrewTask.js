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

const appendDiv = (name, todo, started, overdue, done) => {
    const classes = '';
    return (
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
                            <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                NAME:
                        <span className="fs1" >{name ? name : 'xx'}</span>
                            </div>
                            <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                TO DO:  <span className="fs1" >{todo ? todo : 0}</span>
                            </div>
                            <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                STARTED: <span className="fs1" >{started ? started : 0}</span>
                            </div>
                            <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                OVERDUE: <span className="fs1" >{overdue ? overdue : 0}</span>
                            </div>
                            <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                                DONE: <span className="fs1" >{done ? done : 0}</span>
                            </div>
                        </Col>
                    </Row>
                </ListItem>
            </ul>
        </li>
    )
}

const ItemDiv = (props) => {
    const classes = props.classes;
    const items = props.item;
    let started = 0;
    let todo = 0;
    let done = 0;
    let overdue = 0;
    let name = 0;
    let startCount = 0;
    let todoCount = 0;
    let doneCount = 0;
    // console.log("tasks" + JSON.stringify(items))
    startCount = items.tasks.filter(item => item.status === 'Start')
    if (startCount) { started = startCount.length }

    todoCount = items.tasks.filter(item => item.status === 'Start' || item.status === 'Open' || item.status === 'Pause')
    if (todoCount) { todo = todoCount.length }

    doneCount = items.tasks.filter(item => item.status === 'Completed')
    if (doneCount) { done = doneCount.length }
    return (
        <ListItem className={classes.li} key={`item-${Math.random()}`}>
            <Row>
                <Col>
                    <div className="justify-content-md-center">

                        <img style={{ width: '8vw', height: '8vh', margin: 'auto', display: 'flex' }} src={profile} />
                    </div>
                </Col>
                <Col>
                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                        NAME:
                                            <span className="fs1" >{items.name ? items.name : 'xx'}</span>
                    </div>
                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                        TO DO:  <span className="fs1" >{todo ? todo : 0}</span>
                    </div>
                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                        STARTED: <span className="fs1" >{started ? started : 0}</span>
                    </div>
                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                        OVERDUE: <span className="fs1" >{overdue ? overdue : 0}</span>
                    </div>
                    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
                        DONE: <span className="fs1" >{done ? done : 0}</span>
                    </div>
                </Col>
            </Row>
        </ListItem>
    )
}

export default function PinnedSubheaderList(props) {
    const classes = useStyles();
    const tasks = props.list;

    return (
        <List className={classes.root} subheader={<li />}>
            {tasks
                .sort((a, b) => a.id > b.id ? 1 : -1)
                .map((ele) =>
                    <li key={`section-${Math.random()}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <ItemDiv item={ele} classes={classes} />
                        </ul>
                    </li>
                )}
        </List>
    );
}