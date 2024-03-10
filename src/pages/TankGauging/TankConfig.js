const prefix = localStorage.getItem("project") || "B357"
module.exports = {
    tankTypes : [
        { 
            name : 'Water Tank', 
            color : "blue",
        },{
             name : 'Fuel Tank',
             color : "brown"
        },{
            name : 'Base Oil Tank',
            color : "brownred"
        },{
            name : 'Drill Water Tank',
            color : "yellow"
        },{
            name : 'Others',
            color : "green"
        }],
    tanks : [
        {
            tagname : "TK_1C",
            tagnames : `${prefix}_TK_1C,${prefix}_TK_1C_DUMP,${prefix}_TK_1C_FILL,${prefix}_DRAFT_STBD_FWD`,
            name: "1C",
            type : 4,
            capacity : 25.5,
            position : {
                top : "1%",
                left : "47.5%",
                width : "6%"
            }
        },{
            tagname : "TK_3P",
            tagnames : `${prefix}_TK_3P,${prefix}_TK_3P_DUMP,${prefix}_TK_3P_FILL,${prefix}_DRAFT_PORT_FWD`,
            name: "3P",
            type : 4,
            capacity : 25.5,
            position : {
                top : "8.5%",
                left : "36.5%",
                width : "6%"
            }
        },{
            tagname : "TK_2S",
            tagnames : `${prefix}_TK_2S,${prefix}_TK_2S_DUMP,${prefix}_TK_2S_FILL,${prefix}_DRAFT_STBD_FWD`,
            name: "2S",
            type : 4,
            capacity : 25.5,
            position : {
                top : "8.5%",
                left : "57.5%",
                width : "6%"
            }
        },{
            tagname : "TK_5P",
            tagnames : `${prefix}_TK_5P,${prefix}_TK_5P_DUMP,${prefix}_TK_5P_FILL,${prefix}_DRAFT_PORT_FWD`,
            name: "5P",
            type : 4,
            capacity : 25.25,
            position : {
                top : "17%",
                left : "29.5%",
                width : "6%"
            }
        },{
            tagname : "TK_4A",
            tagnames : `${prefix}_TK_4A,${prefix}_DRAFT_STBD_FWD`,
            name: "4A",
            type : 4,
            capacity : 20.25,
            position : {
                top : "17%",
                left : "64.5%",
                width : "6%"
            }
        },{
            tagname : "TK_4S",
            tagnames : `${prefix}_TK_4S,${prefix}_TK_4S_DUMP,${prefix}_TK_4S_FILL,${prefix}_DRAFT_STBD_FWD`,
            name: "4S",
            type : 4,
            capacity : 25.25,
            position : {
                top : "34%",
                left : "64.5%",
                width : "6%"
            }
        },{
            tagname : "BASE_OIL_TK_2",
            tagnames : `${prefix}_BASE_OIL_TK_2,${prefix}_DRAFT_PORT_FWD`,
            name: "BO2",
            type : 2,
            capacity : 12,
            position : {
                top : "34%",
                left : "27%",
                width : "6%"
            }
        },{
            tagname : "BASE_OIL_TK_1",
            tagnames : `${prefix}_BASE_OIL_TK_1,${prefix}_DRAFT_PORT_FWD`,
            name: "BO1",
            type : 2,
            capacity : 12,
            position : {
                top : "34%",
                left : "34%",
                width : "6%"
            }
        },{
            tagname : "TK_6C",
            tagnames : `${prefix}_TK_6C,${prefix}_TK_6C_DUMP,${prefix}_TK_6C_FILL,${prefix}_DRAFT_STBD_FWD`,
            name: "6C",
            type : 4,
            capacity : 25.5,
            position : {
                top : "40%",
                left : "41%",
                width : "6%"
            }
        },{
            tagname : "TK_13C",
            tagnames : `${prefix}_TK_13C,${prefix}_TK_13C_DUMP,${prefix}_TK_13C_FILL,${prefix}_DRAFT_PORT_FWD`,
            name: "13C",
            type : 4,
            capacity : 5,
            position : {
                top : "42%",
                left : "47.5%",
                width : "6%"
            }
        },{
            tagname : "TK_7P",
            tagnames : `${prefix}_TK_7P,${prefix}_TK_7P_DUMP,${prefix}_TK_7P_FILL,${prefix}_DRAFT_PORT_FWD`,
            name: "7P",
            type : 4,
            capacity : 25.25,
            position : {
                top : "42%",
                left : "13%",
                width : "6%"
            }
        },{
            tagname : "TK_9P",
            tagnames : `${prefix}_TK_9P,${prefix}_TK_9P_DUMP,${prefix}_TK_9P_FILL,${prefix}_DRAFT_PORT_FWD`,
            name: "9P",
            type : 4,
            capacity : 5,
            position : {
                top : "42%",
                left : "21%",
                width : "6%"
            }
        },{
            tagname : "TK_10S",
            tagnames : `${prefix}_TK_10S,${prefix}_TK_10S_DUMP,${prefix}_TK_10S_FILL,${prefix}_DRAFT_STBD_FWD`,
            name: "10S",
            type : 4,
            capacity : 5,
            position : {
                top : "42%",
                left : "72.5%",
                width : "6%"
            }
        },{
            tagname : "TK_8S",
            tagnames : `${prefix}_TK_8S,${prefix}_TK_8S_DUMP,${prefix}_TK_8S_FILL,${prefix}_DRAFT_STBD_FWD`,
            name: "8S",
            type : 4,
            capacity : 25.25,
            position : {
                top : "42%",
                left : "80%",
                width : "6%"
            }
        },{
            tagname : "TK_20C",
            tagnames : `${prefix}_TK_20C,${prefix}_TK_20C_DUMP,${prefix}_TK_20C_FILL,${prefix}_DRAFT_PORT_FWD`,
            name: "20C",
            type : 4,
            capacity : 5,
            position : {
                top : "58.5%",
                left : "47.5%",
                width : "6%"
            }
        },{
            tagname : "TK_15P",
            tagnames : `${prefix}_TK_15P,${prefix}_DRAFT_PORT_AFT`,
            name: "15P",
            type : 3,
            capacity : 25,
            position : {
                top : "56%",
                left : "8%",
                width : "6%"
            }
        },{
            tagname : "TK_14S",
            tagnames : `${prefix}_TK_14S,${prefix}_DRAFT_STBD_FWD`,
            name: "14S",
            type : 3,
            capacity : 25,
            position : {
                top : "56%",
                left : "86%",
                width : "6%"
            }
        },{
            tagname : "TK_19P",
            tagnames : `${prefix}_TK_19P,${prefix}_DRAFT_PORT_AFT`,
            name: "19P",
            type : 0,
            capacity : 5,
            position : {
                top : "58.5%",
                left : "30%",
                width : "6%"
            }
        },{
            tagname : "TK_18S",
            tagnames : `${prefix}_TK_18S,${prefix}_DRAFT_STBD_AFT`,
            name: "18S",
            type : 0,
            capacity : 5,
            position : {
                top : "58.5%",
                left : "65%",
                width : "6%"
            }
        },{
            tagname : "TK_21P",
            tagnames : `${prefix}_TK_21P,${prefix}_DRAFT_PORT_AFT`,
            name: "21P",
            type : 1,
            capacity : 5,
            position : {
                top : "61%",
                left : "55%",
                width : "6%"
            }
        },{
            tagname : "TK_22S",
            tagnames : `${prefix}_TK_22S,${prefix}_DRAFT_STBD_AFT`,
            name: "22S",
            type : 1,
            capacity : 5,
            position : {
                top : "61%",
                left : "40%",
                width : "6%"
            }
        },{
            tagname : "TK_27P",
            tagnames : `${prefix}_TK_27P,${prefix}_DRAFT_PORT_AFT`,
            name: "27P",
            type : 1,
            capacity : 5,
            position : {
                top : "78%",
                left : "40%",
                width : "6%"
            }
        },{
            tagname : "TK_28S",
            tagnames : `${prefix}_TK_28S,${prefix}_DRAFT_STBD_AFT`,
            name: "28S",
            type : 1,
            capacity : 5,
            position : {
                top : "78%",
                left : "55%",
                width : "6%"
            }
        },{
            tagname : "TK_36C",
            tagnames : `${prefix}_TK_36C,${prefix}_TK_36C_DUMP,${prefix}_TK_36C_FILL,${prefix}_DRAFT_STBD_AFT`,
            name: "36C",
            type : 4,
            capacity : 25.5,
            position : {
                top : "83.5%",
                left : "47.5%",
                width : "6%"
            }
        },{
            tagname : "TK_23P",
            tagnames : `${prefix}_TK_23P,${prefix}_TK_23P_DUMP,${prefix}_TK_23P_FILL,${prefix}_DRAFT_PORT_AFT`,
            name: "23P",
            type : 4,
            capacity : 25,
            position : {
                top : "70%",
                left : "2.5%",
                width : "6%"
            }
        },{
            tagname : "TK_31P",
            tagnames : `${prefix}_TK_31P,${prefix}_TK_31P_DUMP,${prefix}_TK_31P_FILL,${prefix}_DRAFT_PORT_AFT`,
            name: "31P",
            type : 4,
            capacity : 25.25,
            position : {
                top : "83.5%",
                left : "8%",
                width : "6%"
            }
        },{
            tagname : "TK_24S",
            tagnames : `${prefix}_TK_24S,${prefix}_TK_24S_DUMP,${prefix}_TK_24S_FILL,${prefix}_DRAFT_STBD_AFT`,
            name: "24S",
            type : 4,
            capacity : 25,
            position : {
                top : "70%",
                left : "91.5%",
                width : "6%"
            }
        },{
            tagname : "TK_30S",
            tagnames : `${prefix}_TK_30S,${prefix}_TK_30S_DUMP,${prefix}_TK_30S_FILL,${prefix}_DRAFT_STBD_AFT`,
            name: "30S",
            type : 4,
            capacity : 25.25,
            position : {
                top : "83.5%",
                left : "86%",
                width : "6%"
            }
        },{
            tagname : "TK_33P",
            tagnames : `${prefix}_TK_33P,${prefix}_TK_33P_DUMP,${prefix}_TK_33P_FILL,${prefix}_DRAFT_PORT_AFT`,
            name: "33P",
            type : 4,
            capacity : 25.25,
            position : {
                top : "83.5%",
                left : "17%",
                width : "6%"
            }
        },{
            tagname : "TK_32S",
            tagnames : `${prefix}_TK_32S,${prefix}_TK_32S_DUMP,${prefix}_TK_32S_FILL,${prefix}_DRAFT_STBD_AFT`,
            name: "32S",
            type : 4,
            capacity : 25.25,
            position : {
                top : "83.5%",
                left : "77%",
                width : "6%"
            }
        },{
            tagname : "TK_35P",
            tagnames : `${prefix}_TK_35P,${prefix}_TK_35P_DUMP,${prefix}_TK_35P_FILL,${prefix}_DRAFT_PORT_AFT`,
            name: "35P",
            type : 4,
            capacity : 25.25,
            position : {
                top : "83.5%",
                left : "25%",
                width : "6%"
            }
        },{
            tagname : "TK_34S",
            tagnames : `${prefix}_TK_34S,${prefix}_TK_34S_DUMP,${prefix}_TK_34S_FILL,${prefix}_DRAFT_STBD_AFT`,
            name: "34S",
            type : 4,
            capacity : 25.25,
            position : {
                top : "83.5%",
                left : "69%",
                width : "6%"
            }
        },{
            tagname : "TK_25P",
            tagnames : `${prefix}_TK_25P,${prefix}_TK_25P_DUMP,${prefix}_TK_25P_FILL,${prefix}_DRAFT_PORT_AFT`,
            name: "25P",
            type : 4,
            capacity : 5,
            position : {
                top : "75%",
                left : "33%",
                width : "6%"
            }
        },{
            tagname : "TK_26S",
            tagnames : `${prefix}_TK_26S,${prefix}_TK_26S_DUMP,${prefix}_TK_26S_FILL,${prefix}_DRAFT_STBD_AFT`,
            name: "26S",
            type : 4,
            capacity : 5,
            position : {
                top : "75%",
                left : "62%",
                width : "6%"
            }
        }
    ]
};
