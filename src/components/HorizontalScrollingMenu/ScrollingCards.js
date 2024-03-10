import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from "prop-types";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./Home.css";
import { Cnt1,Cnt2 } from './ScrollingCardContent'
import profile from '../../assets/Icon/profile.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight, faArrowCircleLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
// import ScrollingCardModal from './ScrollingCardModal'

const MenuItem = ({ text, selected, cnt, key }) => {
  return <div className={`menu-item ${selected ? "active" : ""}`} key={key} >
    
    <div>
      {cnt}
    </div>
  </div>;
};

export const Menu = (list, selected, count) => 
  list.map(el => {
    const { id, content } = el; 
    count--
    const cnt = [];
    if (content == 1) {
      cnt.push(<Cnt1 key={count}  {...el}   />)
    }else if(content==2){
      cnt.push(<Cnt2 key={count} {...el}  />)
    }
    
    return <MenuItem text={id} key={count} cnt={cnt} selected={selected} />;
  });

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};
Arrow.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

// export const ArrowLeft = Arrow({ img:faArrowRight, text: "<<", className: "arrow-prev" });
export const ArrowLeft = (<FontAwesomeIcon size="2x" icon={faArrowCircleLeft} />);
export const ArrowRight = (<FontAwesomeIcon size="2x" icon={faArrowCircleRight} />);;

class ScrollingApp extends Component {
  state = {
    alignCenter: true,
    clickWhenDrag: false,
    dragging: true,
    hideArrows: true,
    hideSingleArrow: true,
    scrollToSelected: false,
    selected: "item1",
    translate: 0,
    transition: 0.3,
    wheel: true
  };

  constructor(props) {
    super(props);
    this.menu = null; 
    // if(this.props.list)
    this.state = {
      list : this.props.list,
      menuItems : Menu(this.props.list.slice(0, this.props.list.length), this.state.selected, this.props.list.length)
    }
    
    // this.menuItems = Menu(this.state.list.slice(0, this.state.list.length), this.state.selected, this.state.list.length)
  }
  componentWillReceiveProps(newProps) {
    // console.log("newProps" + JSON.stringify(newProps.list)) 
    this.setState({list: newProps.list, menuItems:Menu(newProps.list.slice(0, newProps.list.length), this.state.selected, newProps.list.length)});
  }

  onFirstItemVisible = () => {
    // console.log("first item is visible");
  };

  onLastItemVisible = () => {
    // console.log("last item is visible");

  };

  onUpdate = ({ translate }) => {
    this.setState({ translate });
  };

  onSelect = key => {
    this.setState({ selected: key });
  };

  componentDidUpdate(prevProps, prevState) {
    const { alignCenter } = prevState;
    const { alignCenter: alignCenterNew } = this.state;
    if (alignCenter !== alignCenterNew) {
      this.menu.setInitial();
    }
  }


  setSelected = ev => {
    const { value } = ev.target;
    this.setState({ selected: String(value) });
  };

  render() {
    const {
      alignCenter,
      clickWhenDrag,
      hideArrows,
      dragging,
      hideSingleArrow,
      scrollToSelected,
      selected,
      translate,
      transition,
      wheel
    } = this.state;

    const menu = this.state.menuItems;

    return (
      <div className="ScrollingApp">
        <Row style={{ marginBottom: '10px' }} >
          <Col md={1} style={{ textAlign: "left", color:'white' }} className="ScrollingApp-intro">
            CREWS
        </Col>
          <Col md={5} className="ScrollingApp-intro-sm ">
            Search&nbsp;&nbsp;&nbsp; <input type="text" name="name" style={{ backgroundColor: 'transparent', border: '1px #0977a2 solid', top: '5' }} />
          </Col>
          <Col md={5} style={{ textAlign: "right" }} >
            <FontAwesomeIcon size="1x" icon={faPlus} />&nbsp;&nbsp;ADD</Col>
        </Row>
        <ScrollMenu 

          alignCenter={alignCenter}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          clickWhenDrag={clickWhenDrag}
          data={menu}
          dragging={dragging}
          hideArrows={hideArrows}
          hideSingleArrow={hideSingleArrow}
          onFirstItemVisible={this.onFirstItemVisible}
          onLastItemVisible={this.onLastItemVisible}
          onSelect={this.onSelect}
          onUpdate={this.onUpdate}
          ref={el => (this.menu = el)}
          scrollToSelected={scrollToSelected}
          selected={selected}
          transition={+transition}
          translate={translate}
          wheel={wheel}
        />
      </div>
    );
  }
}

export default ScrollingApp;


