import React from 'react'
import "./Home.css";
import profile from '../../assets/Icon/profile.png'
export const Cnt1 = ({status,name,title,heartRate,picture,batteryLife}) => { return (<div>
    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
    <img style={{width:'8vw',height:'8vh',margin:'auto',display: 'flex'}} src={profile} />
    </div>
    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
        NAME: <span className="fs1" >{name ? name : 'xx'}</span>
    </div>
    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
        TITLE: <span className="fs1" >{title ? title : 'xx'}</span>
    </div>
    <div className="ScrollingApp-intro-sm " style={{ margin: "auto"}}>
        BPM:  <span className="fs1" > {heartRate ? heartRate : 'xx'}</span >
    </div>
    <div className="ScrollingApp-intro-sm " style={{ margin: "auto"}}>
        Battery:  <span className="fs1" > {batteryLife ? batteryLife : 'xx'}</span >
    </div>
</div>)}


export const Cnt2 = ({todo,started,overdue,done,picture,name,tasks}) => { 
    // console.log(tasks)
    const startCount = tasks.filter(item => item.status === 'Start' )
    if(startCount){started =startCount.length }

    const todoCount = tasks.filter(item => item.status === 'Start' || item.status === 'Open' || item.status === 'Pause')
    if(todoCount){todo =todoCount.length }

    const doneCount = tasks.filter(item => item.status === 'Completed')
    if(doneCount){done =doneCount.length }

    return (<div>
    <div className="ScrollingApp-intro-sm " style={{ margin: "auto" }}>
    <img style={{width:'8vw',height:'8vh',margin:'auto',display: 'flex'}} src={profile} />
    </div>
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
</div>)}