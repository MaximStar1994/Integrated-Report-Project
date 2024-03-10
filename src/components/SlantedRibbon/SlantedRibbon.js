import React from 'react';

class SlantedRibbon extends React.Component {
    render() { return (
        <div className="slantedRibbon" style={{
            backgroundColor : "#6e6e6e",
            transform: "skewX(-40deg)"
        }}>
            &nbsp;
        </div>
    )}
}

export default SlantedRibbon;