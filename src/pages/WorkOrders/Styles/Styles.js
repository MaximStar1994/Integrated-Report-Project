import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles({
    root: {
        width: '100%',
        background: '#02404f',
        fontSize: '1.2rem',
        color: '#00ffff'
    },
    container: {
        maxHeight: '60vh',
        background: '#02404f',
        fontSize: '1.2rem',
        color: '#00ffff'
    },
    header: {
        fontSize: '1.1rem',
        color: '#0b8dbe',
        justifyContent: 'center'
    },
    footer: {
        fontSize: '1.1rem',
        color: '#dee2e6',
        display: 'inline-flex',
        textAlign: 'center'
    },
    toolbar: {
        color: '#0b8dbe',
        fontSize: '1.1rem',
        fontWeight: '400',
        alignItems: 'center',
        borderBottom: 'none'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,

    },
});

export const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    cell: {
        fontSize: '1rem',
        color: '#dee2e6',
        borderBottom: '1px solid #dee2e6'
    }
});

export const useRowPriority = makeStyles(theme => ({
    root: {
        height: 20, width: 20, borderRadius: 1000, background: props => props.color
    }
}))
