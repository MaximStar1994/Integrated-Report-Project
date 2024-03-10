import React from 'react';
import { Input, InputBase } from '@material-ui/core'
import cancelIcon from '../../assets/Icon/cancelIcon.png'
// searchDidEnd, list, searchOn
class Search extends React.Component {
    searchArr(searchTerm) {
        if (searchTerm === "" ) {
            this.props.searchDidEnd(this.props.list);
        }
        if (searchTerm.length < (this.props.minLength ? this.props.minLength : 0) ) {
            return;
        }
        var keys = this.props.searchOn
        var array = this.props.list
        var newArr = []
        if (!keys instanceof Array || !array instanceof Array) {
            return
        }
        for ( var i = 0; i< keys.length; i++) {
            var key = keys[i];
            var filtered = array.filter((val) => {
                return (val[key].toLowerCase().includes(searchTerm.toLowerCase()))
            })
            filtered.forEach(element => {
                if (!newArr.includes(element)) {
                    newArr.push(element)
                }
            });
        }
        if (this.props.searchDidEnd && {}.toString.call(this.props.searchDidEnd) === '[object Function]') {
            this.props.searchDidEnd(newArr);
        }
    }
    render() {
        return(
            <div 
            style={{fontWeight : "bold", fontSize : "1rem", 
            backgroundColor : "#f5f5f5", borderRadius : "15px" , paddingLeft : "10px", display : "flex", ...this.props.style}} >
                <InputBase
                    id="searchinput"
                    placeholder={this.props.placeholder ? this.props.placeholder : "search"} 
                    onChange = {(e) => {
                        this.searchArr(e.target.value)
                    }}
                    style={{flexGrow : 1, color: '#04588e'}}
                    inputProps={{ 'aria-label': 'naked' }}
                />
                <img src={cancelIcon} className="clickable" style={{width : "20px", height : "20px", alignSelf : "center"}} onClick={() => {
                    this.searchArr("")
                    document.getElementById("searchinput").value = ""
                }}/>
            </div>
        );
    }
}

export default Search;