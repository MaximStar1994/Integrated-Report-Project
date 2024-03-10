import React from 'react';
import DashboardCardWithHeader from '../../components/DashboardCard/DashboardCardWithHeader';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import {DashboardCenterCol,DashboardSingleCol} from '../../components/Containers/Container';
import CategoryList from '../../components/CategoryList/Category';
import Apps from '../../components/App/App.js';
import { Row, Col } from 'react-bootstrap';
import RigCareLogo from '../../assets/Apps/AC_RC_AppIcon-RMAS.png';
import eBunkering_icon from '../../assets/Apps/eBunkering_icon.png';
import eLog_icon from '../../assets/Apps/eLog_icon.png';
import '../../css/Operation.css';
import {withLayoutManager} from '../../Helper/Layout/layout'
class Operation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categoryList: [
        { id: 1, title: 'Show All', isCheckedOn: true },
        { id: 2, title: 'Advisory', isCheckedOn: false },
        { id: 3, title: 'Monitoring', isCheckedOn: false },
        { id: 4, title: 'Insight', isCheckedOn: false },
        { id: 5, title: 'Safety', isCheckedOn: false },
        { id: 5, title: 'Operation', isCheckedOn: false }
      ],
      appList: [
        { title: 'Rig Move Assist System', category: 'Advisory', imgUrl: RigCareLogo, desc: 'This app focusses on three critical areas: Transit, Touch Down, and Leg Penetration.',redirectUrl:'/operation/rigmove' },
        { title: 'Operation Insight', category: 'Insight', imgUrl: RigCareLogo, desc: 'operator view',redirectUrl:'/operation/operationInsight' },
        { title: 'GPS Tracking', category: 'Monitoring', imgUrl: RigCareLogo, desc: 'gps tracking map' ,redirectUrl:'/operation/operationMap'},
        { title: 'Alarm Monitoring', category: 'Monitoring', imgUrl: RigCareLogo, desc: 'alarm monitoring' ,redirectUrl:'/operation/alarmmonitoring'},
        { title: 'Human Factor Performance Tracking ', category: 'Safety', imgUrl: RigCareLogo, desc: 'alarm monitoring' ,redirectUrl:'/operation/HumanFactor/humanfactor'}
      ],
      filterList:[
        { title: 'Rig Move Assist System', category: 'Advisory', imgUrl: RigCareLogo, desc: 'This app focusses on three critical areas: Transit, Touch Down, and Leg Penetration.',redirectUrl:'/operation/rigmove' },
        { title: 'Operation Insight', category: 'Insight', imgUrl: RigCareLogo, desc: 'operator view',redirectUrl:'/operation/operationInsight' },
        { title: 'GPS Tracking', category: 'Monitoring', imgUrl: RigCareLogo, desc: 'gps tracking map' ,redirectUrl:'/operation/operationMap'},
        { title: 'Alarm Monitoring', category: 'Monitoring', imgUrl: RigCareLogo, desc: 'alarm monitoring' ,redirectUrl:'/operation/alarmmonitoring'},
        { title: 'Human Factor Performance Tracking ', category: 'Safety', imgUrl: RigCareLogo, desc: 'human factor' ,redirectUrl:'/operation/HumanFactor/humanfactor'}
      ]
    };
  }

  categoryOnchanged = (updater) => {
    const appList = this.state.appList, categoryList = updater;
    const appListFilter = appList.filter((el) => {
      return categoryList.some((f) => {
        return f.title === el.category && f.isCheckedOn == true;
      });
    });
    this.setState({ filterList:appListFilter });

  }

  GetColumnOne = () => {
    return <CategoryList categoryList={this.state.categoryList} categoryOnchanged={this.categoryOnchanged.bind(this)} />

  }
  GetApps = () => {
    return (
      this.state.filterList.map((post, i) =>
        <Col className="block" sm md={3} lg xl={2} key={i} >
          <Apps className="block_cell" {...post}></Apps></Col>
      )
    )
  }
  GetColumnTwo = () => {
    return (
      <Row  >{this.GetApps()}</Row>
    )
  }

  renderLG(){
    let ColumnOne = this.GetColumnOne();
    let ColumnTwo = this.GetColumnTwo();
    return (
      <DashboardCardWithHeader title="Operation Optimization (Apps)">
      <DashboardCenterCol ColumnOne={ColumnOne} ColumnTwo={ColumnTwo} />
      </DashboardCardWithHeader>
    )
  }
  renderMD(){
    let ColumnOne = this.GetColumnOne();
    let ColumnTwo = this.GetColumnTwo();
    return (
      <DashboardCard title="Operation Optimization (Apps)">
      <DashboardSingleCol ColumnOne={ColumnOne} ColumnTwo={ColumnTwo} />
      </DashboardCard>
    )
  }
  render() {
    
    var contents = this.renderLG()
    if (this.props.renderFor === 1 || this.props.renderFor === 2) {
        contents = this.renderMD()
    }
    return (
      <>
        {contents}
      </>

    )
  }
}

export default withLayoutManager(Operation);