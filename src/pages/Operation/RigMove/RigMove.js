import React from 'react';
import DashboardCardWithHeader from '../../../components/DashboardCard/DashboardCardWithHeader';
import ScrollableTabsButtonAuto from '../../../components/Tab/RigMoveTab'

class RigMove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabList: [
                { key: 'transit', title: 'Transit' },
                { key: 'touchdown', title: 'Touch Down' },
                { key: 'legpenetration', title: 'Leg Penetration' }
            ]
        }
    }

    render() {
        return (
            <DashboardCardWithHeader title="Rig Move Assist Monitoring">
                <ScrollableTabsButtonAuto tabList={this.state.tabList} />
            </DashboardCardWithHeader>
        )
    }

}



export default RigMove;