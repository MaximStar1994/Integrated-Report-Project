import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { descendingComparator, getComparator, stableSort } from './TableSort'
import {useStyles,useRowStyles,useRowPriority} from '../Styles/Styles'
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import WorkOrderModal from './WorkOrderModal'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SyncIcon from '@material-ui/icons/Sync';
import moment from 'moment';
import '../workorder.css'


function createData(name, priority, workorder, equipment, workordertype, status, scheduleddate, parts) {
    return {
        name,
        priority,
        workorder,
        equipment,
        workordertype,
        status,
        scheduleddate,
        history: [
            { PartNumber: parts.PartNumber, JobType: parts.JobType, Reason: parts.Reason },
        ],
    };
}

function GetPriority(props) {
    let color = 'orange'
    if (props.prioprity == 'HIGH') { color = 'red' }
    else if (props.prioprity == 'MEDIUM') { color = '#C46ED7' }
    else if (props.prioprity == 'LOW') { color = 'orange' }

    let cellStyle = useRowPriority({ color: color });
    return (
        <div className={cellStyle.root} ></div>
    )
}


const headCells = [
    { id: 'priority', numeric: false, disablePadding: true, label: 'Priority' },
    { id: 'workOrderNo', numeric: true, disablePadding: false, label: 'Work Order #' },
    { id: 'equipment', numeric: true, disablePadding: false, label: 'Equipment' },
    { id: 'workOrderType', numeric: true, disablePadding: false, label: 'Work Order Type' },
    { id: 'scheduleddate', numeric: true, disablePadding: false, label: 'Scheduled Date' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort,handleOpen } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow style={{ backgroundColor: '#0a182a' }} >
                <TableCell colSpan={3} align="left" className={classes.toolbar}><SyncIcon />Syncing &nbsp;</TableCell>
                <TableCell colSpan={2} align="right" className={classes.toolbar} onClick={(e) => handleOpen(e, {}, 'add')} >
                    <PlaylistAddIcon />&nbsp;Add Work Order</TableCell>
                <TableCell colSpan={1} align="right" className={classes.toolbar}>
                    <input className="textbox-1" type="text" placeholder="Search" />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell padding="checkbox">

                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        className={classes.header}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    handleOpen: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};



function Row(props) {
    const { row } = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root} key={row.name} tabIndex={-1} onClick={(e) => props.handleOpen(e, row, "detail")}   >
                <TableCell className={classes.cell} padding="checkbox">

                </TableCell>
                <TableCell className={classes.cell} align="center"><GetPriority prioprity={row.priority} /></TableCell>
                <TableCell className={classes.cell} align="center">{row.workorder}</TableCell>
                <TableCell className={classes.cell} align="center">{row.equipment}</TableCell>
                <TableCell className={classes.cell} align="center">{row.workordertype}</TableCell>
                <TableCell className={classes.cell} align="center">{moment(row.scheduleddate).format('DD-MM-YYYY')}</TableCell>
            </TableRow>

        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        priority: PropTypes.string,
        workorder: PropTypes.string,
        equipment: PropTypes.string,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                PartNumber: PropTypes.number,
                JobType: PropTypes.string,
                Reason: PropTypes.string,
            }),
        ),
        name: PropTypes.string,
        workordertype: PropTypes.string,
        status: PropTypes.string,
        // scheduleddate: PropTypes.instanceOf(Date),
    }),
};



export default function CollapsibleTable(props) {



    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState({});
    const [content, setContent] = React.useState('');
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('workOrderConfigId');
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const afterOpenModal = () => {
        props.ListWorkOrderLogsForEdge()
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpen = (e, row, content) => {
        setData(row);
        setOpen(true);
        setContent(content);
    };

    const handleClose = () => {
        setOpen(false);
        afterOpenModal()
    };

    const rows = props.data

    return (

        <Paper className={classes.root}>
            <TableContainer className={classes.container}  >
                <Table aria-label="collapsible table"  >
                    <EnhancedTableHead
                        classes={classes}
                        handleOpen={handleOpen}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />

                    <TableBody  >
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                                <Row key={idx} row={row} handleOpen={handleOpen} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination className={classes.footer}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <WorkOrderModal  content={content}   data={data} openModal={open}  handleClose={handleClose} />
        </Paper>

    );
}
