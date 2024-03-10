import React from 'react';

const CircularProgress = props => {
    return (
        <React.Fragment>
            <div className="single-chart">
                <svg viewBox="0 0 36 36" className="circular-chart">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity:1 }} />
                    <stop offset="100%" style={{stopColor:'#BFBFBF', stopOpacity:1}} />
                    </linearGradient>
                </defs>
                <path className="circle-bg" d={`M18 2.0845 a ${props.d/2} ${props.d/2} 0 0 1 0 ${props.d} a ${props.d/2} ${props.d/2} 0 0 1 0 -${props.d}`}
                fill="url(#grad1)"
                />
                <path className="circle"
                    style={{ stroke: props.color }}
                    strokeDasharray={`${props.percent}, 100`}
                    d={`M18 2.0845 a ${props.d/2} ${props.d/2} 0 0 1 0 ${props.d} a ${props.d/2} ${props.d/2} 0 0 1 0 -${props.d}`}
                />
                <text  x="18" y="20.35" className="innercicletext">{props.heading}</text>
                </svg>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ border: '2px solid #5A79BE', display: 'inline-flex', padding: '10px', backgroundColor: '#D9D8E3', marginTop: '10px' }}>
                        {props.percent}%
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CircularProgress;
  
