import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',

        backgroundColor: theme.palette.background.paper,
    },
}));

export default class CheckboxList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: []
        }
    }
    //   const classes = useStyles();
    //   const [checked, setChecked] = React.useState([0]);

    handleToggle = (value) => () => {
        const currentIndex = this.state.checked.indexOf(value);
        let newChecked = [...this.state.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        this.setState({ checked: newChecked })
    };

    render() {
        if (this.props.data.length <= 0) {
            return <></>
        }
        else {
            return (
                <List >
                    {this.props.data.map((value) => { console.log("value" + JSON.stringify(value))
                       var t = Math.floor(1000 + Math.random() * 9000); 
                       const labelId = `checkbox-list-label-${t}`;

                        return (
                            <ListItem key={labelId} role={undefined} dense button onClick={this.handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={this.state.checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="comments">
                                        <CommentIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            );
        }

    }

}
