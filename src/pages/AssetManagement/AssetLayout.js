import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader'
import AssetApi from '../../model/Asset'
import MainDeck1 from '../../assets/rigDeck.jpg'
import MainDeck2 from '../../assets/rigMachineRoom.jpg'
import AssetStatusBar from './AssetStatusBar'
class AssetHealthCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
        };
        this.assetApi = new AssetApi()
    }
 
    render() {
        if (this.props.renderFor && this.props.renderFor == 2) {
            return(
            <DashboardCardWithHeader title="Asset Management Dashboard">
                <Row noGutters={true}>
                    <Col xs={12} lg={6}>
                        <img src={MainDeck1} alt="Main Deck"/>
                        <div style={{position : "absolute", top : "24%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F03" queryName="gearboxF03"/>
                        </div>
                        <div style={{position : "absolute", top : "27%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F04" queryName="gearboxF04"/>
                        </div>
                        <div style={{position : "absolute", top : "39.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F07" queryName="gearboxF07"/>
                        </div>
                        <div style={{position : "absolute", top : "42.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F08" queryName="gearboxF08"/>
                        </div>
                        <div style={{position : "absolute", top : "54.25%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P03" queryName="gearboxP03"/>
                        </div>
                        <div style={{position : "absolute", top : "57.25%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P04" queryName="gearboxP04"/>
                        </div>
                        <div style={{position : "absolute", top : "77.75%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P07" queryName="gearboxP07"/>
                        </div>
                        <div style={{position : "absolute", top : "80.75%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P08" queryName="gearboxP08"/>
                        </div>
                        <div style={{position : "absolute", top : "88.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P11" queryName="gearboxP11"/>
                        </div>
                        <div style={{position : "absolute", top : "91.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P12" queryName="gearboxP12"/>
                        </div>
                        
                        <div style={{position : "absolute", top : "88.5%", left : "26%", width : "20%"}}>
                            <AssetStatusBar assetName="Drawworks A" />
                        </div>
                        <div style={{position : "absolute", top : "91.5%", left : "26%", width : "20%"}}>
                            <AssetStatusBar assetName="Drawworks B" />
                        </div>
                        <div style={{position : "absolute", top : "94.5%", left : "26%", width : "20%"}}>
                            <AssetStatusBar assetName="Drawworks C" />
                        </div>

                        <div style={{position : "absolute", top : "91%", left : "50%", width : "15%"}}>
                            <AssetStatusBar assetName="Top Drive" />
                        </div>

                        <div style={{position : "absolute", top : "89%", left : "68.75%", width : "20%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S07" queryName="gearboxS07"/>
                        </div>
                        <div style={{position : "absolute", top : "91.5%", left : "68.75%", width : "20%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S08" queryName="gearboxS08"/>
                        </div>

                        <div style={{position : "absolute", top : "77.75%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="Degasser Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "80.25%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="Degasser Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "82.75%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="Desander Pump" />
                        </div>
                        <div style={{position : "absolute", top : "85.25%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="Desilter Pump" />
                        </div>

                        <div style={{position : "absolute", top : "54.25%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S11" queryName="gearboxS11" />
                        </div>
                        <div style={{position : "absolute", top : "57.25%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S12" queryName="gearboxS12" />
                        </div>

                        <div style={{position : "absolute", top : "39.5%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S03" queryName="gearboxS03" />
                        </div>
                        <div style={{position : "absolute", top : "42.5%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S04" queryName="gearboxS04" />
                        </div>

                        <div style={{position : "absolute", top : "24.25%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F11" queryName="gearboxF11" />
                        </div>
                        <div style={{position : "absolute", top : "27.25%", left : "81%", width : "20%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F12" queryName="gearboxF12" />
                        </div>
                    </Col>
                    <Col xs={12} lg={6}>
                        <img src={MainDeck2} alt="Machinery Deck"/>
                        <div style={{position : "absolute", top : "15%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Mud Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "18%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Mud Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "21%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Mud Pump 3" />
                        </div>
                        <div style={{position : "absolute", top : "29.5%", left : "1.4%", width : "20%"}}>
                            <AssetStatusBar assetName="Drill Water Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "33%", left : "1.4%", width : "20%"}}>
                            <AssetStatusBar assetName="Drill Water Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "45%", left : "1.4%", width : "20%"}}>
                            <AssetStatusBar assetName="Bilge Pump 1" queryName="Bilge Electric Pump 1"/>
                        </div>
                        <div style={{position : "absolute", top : "56.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Main Generator 1" queryName="mainengine1"/>
                        </div>
                        <div style={{position : "absolute", top : "59.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Main Generator 2" queryName="mainengine2"/>
                        </div>
                        <div style={{position : "absolute", top : "62.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Main Generator 3" queryName="mainengine3"/>
                        </div>
                        <div style={{position : "absolute", top : "65.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Main Generator 4" queryName="mainengine4"/>
                        </div>
                        <div style={{position : "absolute", top : "68.5%", left : "2%", width : "20%"}}>
                            <AssetStatusBar assetName="Main Generator 5" queryName="mainengine5"/>
                        </div>
                        <div style={{position : "absolute", top : "79.25%", left : "1.4%", width : "20%"}}>
                            <AssetStatusBar assetName="Main Fire Pump" queryName="emergencymainfirepump"/>
                        </div>
                        <div style={{position : "absolute", top : "82.25%", left : "1.4%", width : "20%"}}>
                            <AssetStatusBar assetName="Fire Jockey Pump" />
                        </div>

                        <div style={{position : "absolute", top : "9%", left : "78%", width : "25%"}}>
                            <AssetStatusBar assetName="Mud Charging Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "12%", left : "78%", width : "25%"}}>
                            <AssetStatusBar assetName="Mud Charging Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "15%", left : "78%", width : "25%"}}>
                            <AssetStatusBar assetName="Mud Charging Pump 3" />
                        </div>
                        <div style={{position : "absolute", top : "18%", left : "78%", width : "25%"}}>
                            <AssetStatusBar assetName="Mud Mixing Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "21%", left : "78%", width : "25%"}}>
                            <AssetStatusBar assetName="Mud Mixing Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "24%", left : "78%", width : "25%"}}>
                            <AssetStatusBar assetName="Mud Mixing Pump 3" />
                        </div>
                        <div style={{position : "absolute", top : "29.5%", left : "78%", width : "20%"}}>
                            <AssetStatusBar assetName="Brine Pump" />
                        </div>
                        <div style={{position : "absolute", top : "37.5%", left : "78.25%", width : "20%"}}>
                            <AssetStatusBar assetName="Bilge Pump 2" queryName="bilgeelectricpump2"/>
                        </div>
                        <div style={{position : "absolute", top : "45%", left : "78.25%", width : "20%"}}>
                            <AssetStatusBar assetName="Air Compressor 1" />
                        </div>
                        <div style={{position : "absolute", top : "47.5%", left : "78.25%", width : "20%"}}>
                            <AssetStatusBar assetName="Air Compressor 2" />
                        </div>
                        <div style={{position : "absolute", top : "50%", left : "78.25%", width : "20%"}}>
                            <AssetStatusBar assetName="Air Compressor 3" />
                        </div>
                        <div style={{position : "absolute", top : "56.75%", left : "81.5%", width : "22.5%"}}>
                            <AssetStatusBar assetName="Fire Seawater Pump" />
                        </div>
                    </Col>
                </Row>
            </DashboardCardWithHeader>
            )
        }
        return (
            <DashboardCardWithHeader title="Asset Management Dashboard">
                <Row noGutters={true}>
                    <Col xs={12} lg={6}>
                        <img src={MainDeck1} alt="Main Deck"/>
                        <div style={{position : "absolute", top : "24%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F03" queryName="gearboxF03"/>
                        </div>
                        <div style={{position : "absolute", top : "26.5%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F04" queryName="gearboxF04"/>
                        </div>
                        <div style={{position : "absolute", top : "39.5%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F07" queryName="gearboxF07"/>
                        </div>
                        <div style={{position : "absolute", top : "42%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F08" queryName="gearboxF08"/>
                        </div>
                        <div style={{position : "absolute", top : "54.25%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P03" queryName="gearboxP03"/>
                        </div>
                        <div style={{position : "absolute", top : "56.75%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P04" queryName="gearboxP04"/>
                        </div>
                        <div style={{position : "absolute", top : "77.75%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P07" queryName="gearboxP07"/>
                        </div>
                        <div style={{position : "absolute", top : "80.25%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P08" queryName="gearboxP08"/>
                        </div>
                        <div style={{position : "absolute", top : "88.5%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P11" queryName="gearboxP11"/>
                        </div>
                        <div style={{position : "absolute", top : "91%", left : "4%", width : "15.5%"}}>
                            <AssetStatusBar assetName="PORT Gearbox P12" queryName="gearboxP12"/>
                        </div>
                        
                        <div style={{position : "absolute", top : "88.5%", left : "26%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Drawworks A" />
                        </div>
                        <div style={{position : "absolute", top : "91%", left : "26%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Drawworks B" />
                        </div>
                        <div style={{position : "absolute", top : "93.5%", left : "26%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Drawworks C" />
                        </div>

                        <div style={{position : "absolute", top : "90.75%", left : "53%", width : "13.5%"}}>
                            <AssetStatusBar assetName="Top Drive" />
                        </div>

                        <div style={{position : "absolute", top : "88.25%", left : "68.75%", width : "15.5%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S07" queryName="gearboxS07"/>
                        </div>
                        <div style={{position : "absolute", top : "90.75%", left : "68.75%", width : "15.5%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S08" queryName="gearboxS08"/>
                        </div>

                        <div style={{position : "absolute", top : "77.75%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Degasser Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "80.25%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Degasser Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "82.75%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Desander Pump" />
                        </div>
                        <div style={{position : "absolute", top : "85.25%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="Desilter Pump" />
                        </div>

                        <div style={{position : "absolute", top : "54.25%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S11" queryName="gearboxS11" />
                        </div>
                        <div style={{position : "absolute", top : "56.75%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S12" queryName="gearboxS12" />
                        </div>

                        <div style={{position : "absolute", top : "39.5%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S03" queryName="gearboxS03" />
                        </div>
                        <div style={{position : "absolute", top : "42%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="STBD Gearbox S04" queryName="gearboxS04" />
                        </div>

                        <div style={{position : "absolute", top : "24.25%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F11" queryName="gearboxF11" />
                        </div>
                        <div style={{position : "absolute", top : "26.75%", left : "81%", width : "15.5%"}}>
                            <AssetStatusBar assetName="FWD Gearbox F12" queryName="gearboxF12" />
                        </div>
                    </Col>
                    <Col xs={12} lg={6}>
                        <img src={MainDeck2} alt="Machinery Deck"/>
                        <div style={{position : "absolute", top : "15%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Mud Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "17.5%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Mud Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "20%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Mud Pump 3" />
                        </div>
                        <div style={{position : "absolute", top : "30%", left : "1.4%", width : "16.5%"}}>
                            <AssetStatusBar assetName="Drill Water Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "32.5%", left : "1.4%", width : "16.5%"}}>
                            <AssetStatusBar assetName="Drill Water Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "45%", left : "1.4%", width : "16.5%"}}>
                            <AssetStatusBar assetName="Bilge Pump 1" queryName="Bilge Electric Pump 1"/>
                        </div>
                        <div style={{position : "absolute", top : "57%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Main Generator 1" queryName="mainengine1"/>
                        </div>
                        <div style={{position : "absolute", top : "59.5%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Main Generator 2" queryName="mainengine2"/>
                        </div>
                        <div style={{position : "absolute", top : "62%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Main Generator 3" queryName="mainengine3"/>
                        </div>
                        <div style={{position : "absolute", top : "64.5%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Main Generator 4" queryName="mainengine4"/>
                        </div>
                        <div style={{position : "absolute", top : "67%", left : "2%", width : "16%"}}>
                            <AssetStatusBar assetName="Main Generator 5" queryName="mainengine5"/>
                        </div>
                        <div style={{position : "absolute", top : "79.5%", left : "1.4%", width : "16.5%"}}>
                            <AssetStatusBar assetName="Main Fire Pump" queryName="emergencymainfirepump"/>
                        </div>
                        <div style={{position : "absolute", top : "82%", left : "1.4%", width : "16.5%"}}>
                            <AssetStatusBar assetName="Fire Jockey Pump" />
                        </div>

                        <div style={{position : "absolute", top : "9.5%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Mud Charging Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "12%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Mud Charging Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "14.5%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Mud Charging Pump 3" />
                        </div>
                        <div style={{position : "absolute", top : "17%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Mud Mixing Pump 1" />
                        </div>
                        <div style={{position : "absolute", top : "19.5%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Mud Mixing Pump 2" />
                        </div>
                        <div style={{position : "absolute", top : "22%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Mud Mixing Pump 3" />
                        </div>
                        <div style={{position : "absolute", top : "30%", left : "78%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Brine Pump" />
                        </div>
                        <div style={{position : "absolute", top : "38%", left : "78.25%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Bilge Pump 2" queryName="bilgeelectricpump2"/>
                        </div>
                        <div style={{position : "absolute", top : "45%", left : "78.25%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Air Compressor 1" />
                        </div>
                        <div style={{position : "absolute", top : "47.5%", left : "78.25%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Air Compressor 2" />
                        </div>
                        <div style={{position : "absolute", top : "50%", left : "78.25%", width : "18.5%"}}>
                            <AssetStatusBar assetName="Air Compressor 3" />
                        </div>
                        <div style={{position : "absolute", top : "57.25%", left : "81.5%", width : "16.5%"}}>
                            <AssetStatusBar assetName="Fire Seawater Pump" />
                        </div>
                    </Col>
                </Row>
            </DashboardCardWithHeader>
        )
    }
  }

export default AssetHealthCard;
