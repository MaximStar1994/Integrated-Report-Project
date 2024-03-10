import React from 'react';

class SlantedHeader extends React.Component {
    render() {
        return (
            <div className="horizontalline">
                <div className="parallelogram">
                    <div className="parallelogramTitle">{this.props.title}</div>
                </div>
                <div className="parallelogram1"></div>
                <div className="parallelogram2"></div>
                <div className="parallelogram3"></div>
            </div>
        )
    }
}

export default SlantedHeader;