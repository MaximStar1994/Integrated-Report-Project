module.exports = {
    workOrderConfig : [{
        id : 1,
        title : "Check Engine Every Day",
        description : "Check engine filters and log engine log every day",
        startDate : new Date(Date.UTC(2020,7,4,0,0,0)),
        lastCreationDate : null,
        intervalHr : 2,
        equipment:'PUMP',
        workordertype:'Replaced'
    },{
        id : 2,
        title : "Check Engine Every 2 Day",
        description : "Check engine filters and log engine log every 2 day",
        startDate : new Date(Date.UTC(2020,7,4,0,0,0)),
        lastCreationDate : null,
        intervalHr : 4,
        equipment:'PUMP',
        workordertype:'Replaced'
    }],
    workOrderStatus : {
        OPEN : 'open',
        INPROGRESS : 'inprogress',
        COMPLETED : 'completed',
    },
    workOrderPriority : {
        HIGH : 'HIGH',
        MEDIUM : 'MEDIUM',
        LOW : 'LOW',
    },
}