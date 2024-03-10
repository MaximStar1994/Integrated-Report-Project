import React, { Component } from "react";
import "./AuthorizedBackDated.css";
import AuthorizedBackDatedApi from "../../model/AuthorizedBackDatedApi";
import { withMessageManager } from "../../Helper/Message/MessageRenderer";
import { withRouter } from "react-router-dom";
import FullScreenSpinner from "../../components/FullScreenSpinner/FullScreenSpinner";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import config from "../../config/config";
import { Select, MenuItem, Checkbox, Icon } from "@material-ui/core";
import Spinner from "react-bootstrap/Spinner";
import { Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { DatePicker } from "@material-ui/pickers";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class AuthorizedBackDated extends Component {
  constructor() {
    super();
    this.authorizedBackDatedApi = new AuthorizedBackDatedApi();
    this.state = {
      loaded: false,
      vesselList: [],
      activeVesselId: "",
      reportDate: null,
      formList: [
        { name: "MORNINGSHIFT", checked: false },
        { name: "EVENINGSHIFT", checked: false },
        { name: "DAILYLOG", checked: false },
      ],
      authorizedBackDatedList: [],
       //Authorized control app data table header
       authorizedBackdatedTableHeaderColumn: [
        {
          dataField: "vesselname",
          text: "Vessel",
          sort: true,
          headerAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
            color: "#04588e",
          },
        },
        {
          dataField: "reportdate",
          text: "ReportDate",
          sort: true,
          headerAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
            color: "#04588e"
          }
        },
        {
          dataField: "form",
          text: "Form",
          sort: true,
          headerAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
            color: "#04588e"
          }
        },
        {
          dataField: "createddate",
          text: "CreatedDate",
          sort: true,
          formatter: (cell, row, rowIndex) => (
            <span>{moment(row.createddate).format("DD-MM-YYYY")}</span>
          ),
          headerAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
            color: "#04588e"
          }
        },
        {
          dataField: "createdby",
          text: "CreatedBy",
          headerAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
            color: "#04588e"
          }
        },
        {
          dataField: "delete",
          text: "Delete",
          formatter: (cell, row, rowIndex) => (
            <DeleteForeverIcon
              onClick={() =>
                this.deleteAuthorizedBackDatedForm(row.id)
              }
              style={{
                color: config.KSTColors.REDDOT,
                cursor: "pointer",
              }}
            />
          ),
          headerAlign: "center",
          headerStyle: {
            backgroundColor: "yellow",
            color: "#04588e"
          }
        }
      ],
    };
  }

  refreshState() {
    this.setState({
      activeVesselId: "",
      reportDate: null,
      formList: [
        { name: "MORNINGSHIFT", checked: false },
        { name: "EVENINGSHIFT", checked: false },
        { name: "DAILYLOG", checked: false },
      ],
    });
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    this.setState({ loaded: false });
    var authorizedBackDatedListRes =
      await this.authorizedBackDatedApi.fetchAuthorizedBackDatedData();
    let vesselListFromLocalStorage = JSON.parse(
      localStorage.getItem("user")
    ).vesselList;
    vesselListFromLocalStorage.shift();
    this.setState({
      vesselList: [...vesselListFromLocalStorage],
      loaded: true,
      authorizedBackDatedList: [...authorizedBackDatedListRes],
    });
  }

  handleCheckboxChange = (event, index) => {
    this.state.formList[index].checked = event.target.checked;
    this.setState({
      formList: [...this.state.formList],
    });
  };

  saveAuthorizedBackDatedForm = async () => {
    try {
      var saveArray = [];
      var dbFormValuesArray = [];
      this.setState({ loaded: false });
      //validate vessel dropdown
      if (this.state.activeVesselId == "") {
        this.props.setMessages([
          { type: "danger", message: "Please select vessel" },
        ]);
        this.setState({ loaded: true });
        return;
      }

      //validate report date
      if (this.state.reportDate === null) {
        throw new Error("Please select the report date");
      }

      //validate form checkboxes start
      var checkedFormList = this.state.formList.filter(
        (form) => form.checked === true
      );

      if (checkedFormList.length == 0) {
        this.props.setMessages([
          { type: "danger", message: "Form value cannot be empty!" },
        ]);
        this.setState({ loaded: true });
        return;
      }
      //validate form checkboxes end

      //forming array based on checkbox checked count
      checkedFormList.forEach((form) => {
        saveArray.push({
          vesselId: this.state.activeVesselId,
          form: form.name,
          reportDate: this.state.reportDate
        });
      });

      //check with db whether same data already available in db or not based on vesselId and formName
      dbFormValuesArray =
        await this.authorizedBackDatedApi.checkAuthorizedBackDatedData(
          saveArray
        );

      if (dbFormValuesArray.length > 0) {
        this.props.setMessages([
          {
            type: "danger",
            message: "One of the backdated data already exists",
          },
        ]);
        this.setState({ loaded: true });
        return;
      }

      //save api call
      var authorizedBackDatedListAfterSave =
        await this.authorizedBackDatedApi.saveAuthorizedBackDatedData(
          saveArray
        );

      this.setState({
        loaded: true,
        authorizedBackDatedList: [...authorizedBackDatedListAfterSave],
      });
      //make form values to default
      this.refreshState();
      this.props.setMessages([
        { type: "success", message: "Data saved successfully!" },
      ]);
    } catch (error) {
      this.setState({ loaded: true });
      this.props.setMessages([
        { type: "danger", message: error.message },
      ]);
    }
  };

  deleteAuthorizedBackDatedForm = async (id) => {
    try {
      this.setState({ loaded: false });
      var authorizedBackDatedListAfterDelete =
        await this.authorizedBackDatedApi.deleteAuthorizedBackDatedData(id);
      this.setState({
        loaded: true,
        authorizedBackDatedList: [...authorizedBackDatedListAfterDelete],
      });
      this.props.setMessages([
        { type: "success", message: "Data deleted successfully!" },
      ]);
    } catch (error) {
      this.setState({ loaded: true });
      this.props.setMessages([
        { type: "danger", message: "Unable to Delete backdated form!" },
      ]);
    }
  };

  onVesselChange(vesselId) {
    this.setState({ activeVesselId: vesselId });
  }

  render() {
    return this.state.loaded === true ? (
      <Container fluid className="RootComponent">
        <Row style={{ padding: "20px" }}>
          <div className="AuthorizedControlAppHeaderBackground">
            <div className="AuthorizedControlAppHeaderText">
              Backdated Control App
            </div>
          </div>
        </Row>
        <Row className="AuthorizedControlAppForm">
          <Col>
            <Row>
              <Col>
                <Form.Label
                  style={{
                    color: config.KSTColors.MAIN,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Name of Vessel
                </Form.Label>
              </Col>
              <Col>
                <div
                  style={{ width: "100%" }}
                  className="AuthorizedControlAppSelectionBox"
                >
                  <Select
                    style={{ color: config.KSTColors.MAIN }}
                    type="selection"
                    disableUnderline
                    id={"Name of Vessel"}
                    aria-describedby={"Name of Vessel"}
                    value={
                      this.state.activeVesselId === null
                        ? ""
                        : this.state.activeVesselId
                    }
                    onChange={(e) => this.onVesselChange(e.target.value)}
                    className="AuthorizedControlAppSelectionFillableBox"
                  >
                    <MenuItem value={""} key={""}>
                      {" "}
                      ALL
                    </MenuItem>
                    {this.state.vesselList.map((element) => (
                      <MenuItem
                        value={element.vessel_id}
                        key={element.vessel_id}
                      >
                        {" "}
                        {element.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col>
                <Form.Label
                  style={{
                    color: config.KSTColors.MAIN,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Report date
                </Form.Label>
              </Col>
              <Col className="AuthorizedControlAppTimePicker">
                <DatePicker id="crewTimePickerId" disableFuture={true} aria-describedby="crew"
                  value={this.state.reportDate === null ? null : moment(this.state.reportDate, "DD-MM-YYYY")}
                  onChange={(e) => {
                    this.state.reportDate = moment(e).format("DD-MM-YYYY");
                    this.setState({
                      reportDate: this.state.reportDate
                    })
                  }} 
                  format="dd / MM / yyyy"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" style={{ paddingBottom: "8px", color: "#067FAA", }} >
                        <span className="material-icons">date_range</span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
            </Row>

            {this.state.reportDate === null ? <Container /> : <Row style={{ marginTop: "10px" }}>
              <Col>
                <Form.Label
                  style={{
                    color: config.KSTColors.MAIN,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Form
                </Form.Label>
              </Col>
              <Col>
                {this.state.formList.map((data, index) => (
                  <Row>
                    <Col xs={12} lg={12} xl={12}>
                      <Checkbox
                        name={data.name}
                        value={data.checked}
                        checked={data.checked}
                        onClick={event => this.handleCheckboxChange(event, index)}
                      />
                      <span style={{ paddingTop: "15px" }}>{data.name}</span>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>}
          </Col>
          <Col>
            <Row style={{ height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Button
                  style={{
                    backgroundColor: config.KSTColors.MAIN,
                    borderRadius: "8px",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    marginRight: "20px",
                    color: config.KSTColors.ICON,
                    height: "50px",
                  }}
                  disabled={this.state.unlocking === true}
                  onClick={() => this.saveAuthorizedBackDatedForm()}
                >
                  <SendIcon style={{ color: config.KSTColors.ICON }} />
                  <span
                    style={{
                      color: config.KSTColors.WHITE,
                      paddingLeft: "10px",
                    }}
                  >
                    Submit
                  </span>
                </Button>
              </div>
            </Row>
          </Col>
        </Row>
        <div className="AuthorizedControlAppTable">
          <BootstrapTable 
            bootstrap4
            keyField="id"
            data={this.state.authorizedBackDatedList}
            columns={this.state.authorizedBackdatedTableHeaderColumn}
            rowStyle={{
              backgroundColor: "#fff",
              textAlign: "center"
            }}
          />
        </div>
      </Container>
    ) : (
      <FullScreenSpinner text={"Loading..."} />
    );
  }
}

export default withRouter(withMessageManager(AuthorizedBackDated));
