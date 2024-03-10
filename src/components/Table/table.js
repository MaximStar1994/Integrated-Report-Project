import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import GreenCircle from '../../assets/Icon/GreenCircle.png'
import RedCircle from '../../assets/Icon/RedCircle.png'



export const Styletables = (props) => {

    const tableItem = props.data;
    const tableHeader = props.title;
    var tableRow = [];
    var tableHeaderRow = []
    var cells = [];

    var c =0, i=0;
    Object.keys(tableHeader).forEach((k) => {
        var cell = (<StyledTableCell key={`tbhcell${c}`}>{tableHeader[k]}</StyledTableCell>)
        cells.push(cell);
        c++;
    })
    let RowElement = (
        <TableRow key={`tbhrow${c}`}>
            {cells}
        </TableRow>
    );
    tableHeaderRow.push(RowElement)

    var c =0, i=0;
    
    tableItem.forEach((item) => {

        var cells = [];
        Object.keys(item).forEach((k) => {
            var cell = (<StyledTableCell key={`tbitemcell${c}`}>{item[k]}</StyledTableCell>)
            cells.push(cell);
            c++;
        })
        const RowElement = (
            <TableRow key={`tbitemhdrcell${i}`}>
                {cells}
            </TableRow>
        );
        tableRow.push(RowElement)
        i++
    })

    return (
        <TableContainer component={Paper} style={{ backgroundColor: "transparent", paddingBottom: "1vh" }} >
            <Table  >
                <TableHead>
                        {tableHeaderRow}
                </TableHead>
                <TableBody>
                    {tableRow}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export const Systemsource = (props) => {
    const tableItem = props.data;
    const tableHeader = props.title;
    var tableRow = [];
    var tableHeaderRow = []
    var cells = [];
    var c =0, i=0;
    Object.keys(tableHeader).forEach((k) => {
        var cell = (<StyledTableCell key={`tbsysheadercell${c}`} >{tableHeader[k]}</StyledTableCell>)
        cells.push(cell);
        c++
    })
    let RowElement = (
        <TableRow key={`tbsysheader${i}`} >
            {cells}
        </TableRow>
    );
    tableHeaderRow.push(RowElement)

    var c =0, i=0;
    
    if(tableItem.length>0){
        tableItem.forEach((item) => {

            var cells = [];
            Object.keys(item).forEach((k) => {
                var cell ;
                if(k!==''){
                    if(k.indexOf("isHealthy")>-1){
                        var img = RedCircle;
                        if(item[k]=="1")
                        {
                            img = GreenCircle;
                        }
                        cell = (<StyledTableCell key={`tbsysItemcell${c}`} ><img src={img} /></StyledTableCell>);
                    }
                    else{
                        cell = (<StyledTableCell key={`tbsysItemcell${c}`} >{item[k]}</StyledTableCell>)
                    }
                    
                    cells.push(cell);
                    c++;
                }
                
            })
            const RowElement = (
                <TableRow key={`tbsysItemRow${i}`} >
                    {cells}
                </TableRow>
            );
            tableRow.push(RowElement)
            i++;
        })
    }
    else{
        return(<></>)
    }
    

    return (
        <TableContainer component={Paper} style={{ backgroundColor: "transparent", paddingBottom: "1vh" }} >
            <Table  >
                <TableHead>
                        {tableHeaderRow}
                </TableHead>
                <TableBody>
                    {tableRow}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: "#032A39",
        color: "#0977a2",
        borderBottom: "1px solid #fff",
    },
    body: {
        fontSize: 11,
        backgroundColor: "#032A39",
        color: "#fff",
        border: 'none',
        float: "center",
        rowHeight: "1vh",
        padding: '2px'
    }
}))(TableCell);



