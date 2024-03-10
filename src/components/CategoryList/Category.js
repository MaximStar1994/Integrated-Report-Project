import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import './Category.css';

class CategoryList extends React.Component{
    constructor(props){
        super(props);
        this.state = {allChecked:true, categoryList:this.props.categoryList};
    }

    checkboxOnchanged = (e) => {
       let checkboxId = e.target.id; // checkbox name /title
       let ischecked = e.target.checked;
      
       this.setState(prevState =>{
        let {categoryList, allChecked} = prevState;
        if(checkboxId.includes("Show All")){
            allChecked = ischecked;
            categoryList = categoryList.map(item => ({ ...item, isCheckedOn: ischecked }));
        }else{
            categoryList = categoryList.map(item =>
            item.title === checkboxId ? { ...item, isCheckedOn: ischecked } : item );
            allChecked = categoryList.every(item => item.isCheckedOn); // check all items are checked
            categoryList[0].isCheckedOn = allChecked; // check or uncheck show all
            
        }
        
        return {categoryList, allChecked}
      }, ()=>{this.props.categoryOnchanged(this.state.categoryList);});
    }

    
    render()
    {
        return(
            <div>
            <div className="bg-dark-f-blue" >Categories</div>
            <ul className="fs">
                {this.state.categoryList.map((post,i) =>
                <li key={i} >
                    <Checkbox  id={post.title} checked={post.isCheckedOn} onChange={this.checkboxOnchanged}    />{post.title}
                </li>
                )}
            </ul>
             </div>
           
        )
    }


}
export default CategoryList;