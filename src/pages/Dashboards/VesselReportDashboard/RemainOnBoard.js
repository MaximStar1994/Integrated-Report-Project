import React from 'react';
import { Card } from 'react-bootstrap';
import FuelOilIcon from '../../../assets/KST/FuelOil.png';
import FreshWaterIcon from '../../../assets/KST/FreshWater.png';
import LubOilIcon from '../../../assets/KST/LubOils.png'

const RemainOnBoard = props =>(
<React.Fragment>
    <div style={{ display: "flex" }}>
        <div style={{ display: 'flex', flexGrow: "1" }} className="Heading">
            Remain On Board
        </div>
        <div style={{ color: '#9B9595' }}>Last Recorded On: {props.data.lastRecordedDate}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: "space-around" }}>
        <div style={{ display: 'flex', flexFlow: 'column', justifyContent: "space-around", width: '50%' }}>
            <Card className='RemainOnBoardCard'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <div style={{ height: '5rem', width: '5rem', textAlign: 'center', paddingRight: '1rem' }}>
                        <img src={FuelOilIcon} style={{ height: '100%' }} alt="FuelOil Icon" />
                    </div>
                    <div>
                        <div style={{ color: "#9B9595", fontSize: '1.5rem', textAlign: 'center' }}>
                            Fuel Oil
                        </div>
                        <div style={{ color: "#04568E", fontSize: '2.2rem', textAlign: 'center', marginTop: '1rem', padding: '1rem' }}>
                            {props.data.fuelOil}
                        </div>
                        <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center', marginTop: '1.5rem' }}>
                            litres
                        </div>
                    </div>
                    <div style={{ display: props.showLNG===true?'block':'none' }}>
                        <div style={{ color: "#9B9595", fontSize: '1.5rem', textAlign: 'center' }}>
                            LNG
                        </div>
                        <div style={{ color: "#04568E", fontSize: '2.2rem', textAlign: 'center', marginTop: '1rem', padding: '1rem' }}>
                            {props.data.lng}
                        </div>
                        <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center', marginTop: '1.5rem' }}>
                            kg
                        </div>
                    </div>
                </div>
            </Card>
            <Card className='RemainOnBoardCard'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <div style={{ height: '5rem', width: '5rem', textAlign: 'center', paddingRight: '1rem' }}>
                        <img src={FreshWaterIcon} style={{ height: '100%' }} alt="FreshWater Icon" />
                    </div>
                    <div>
                        <div style={{ color: "#9B9595", fontSize: '1.5rem', textAlign: 'center' }}>
                            Fresh Water
                        </div>
                        <div style={{ color: "#04568E", fontSize: '2.2rem', textAlign: 'center', marginTop: '1rem', padding: '1rem' }}>
                            {props.data.freshWater}
                        </div>
                        <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center', marginTop: '1.5rem' }}>
                            litres
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        <div style={{ width: '50%', marginLeft: '10%' }}>
            <div style={{ color: "#9B9595", fontSize: '1rem', textAlign: 'center', marginBottom: '0.2rem' }}>
                <img src={LubOilIcon} style={{ height: '1rem', width: '2rem' }} alt="LubOil Icon" /> Lub Oils (litres)
            </div>
            {props.data.lubOils.map(element=>(
                <div className="LubOilCard" key={element.name}>
                    <span className="LubOilName">{element.name}</span>
                    <span className="LubOilValue">{element.value}</span>
                </div>
            ))}
        </div>
    </div>
</React.Fragment>
);

export default RemainOnBoard;