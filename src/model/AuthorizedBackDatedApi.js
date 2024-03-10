import Model from "./Model";

class AuthorizedBackDatedApi extends Model {
  fetchAuthorizedBackDatedData() {
    return new Promise((res, rej) => {
      super.get(
        "/vesselreport/authorized-backdated/list",
        {},
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }

  deleteAuthorizedBackDatedData(id) {
    return new Promise((res, rej) => {
      super.delete(
        "/vesselreport/authorized-backdated/delete",
        { id: id },
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }

  statusCompleteAuthorizedBackDatedData(vesselId, form, reportDate) {
    return new Promise((res, rej) => {
      super.get(
        "/vesselreport/authorized-backdated/complete",
        { vesselId: vesselId, form: form, reportDate: reportDate },
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }

  saveAuthorizedBackDatedData(saveArray) {
    return new Promise((res, rej) => {
      super.postReq(
        "/vesselreport/authorized-backdated/save",
        { saveArray },
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }

  checkAuthorizedBackDatedData(saveArray) {
    return new Promise((res, rej) => {
      super.postReq(
        "/vesselreport/authorized-backdated/check",
        { saveArray },
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }

  isAuthorizedBackDatedDataAvailable(id) {
    return new Promise((res, rej) => {
      super.get(
        "/vesselreport/authorized-backdated/isAvailable",
        { id: id },
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }

  fetchShiftBackDatedDataByReportDate(vesselId,reportDate) {
    return new Promise((res, rej) => {
      super.get(
        "/vesselreport/authorized-backdated/shift-details-by-report-date",
        { vesselId: vesselId,reportDate:reportDate },
        (value, error) => {
          if (!error) {
            if (value.success === true) {
              res(value.value);
            } else {
              rej("Unable to retrieve information!");
            }
          } else {
            rej("No internet!");
          }
        }
      );
    });
  }



}

export default AuthorizedBackDatedApi;
