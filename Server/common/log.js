const logger = require("../config/logger");

exports.info = (message) => {
  logger.log({ message: message, level: "info" });
};

exports.err = (message) => {
  logger.log({ message: message, level: "error" });
};

exports.warning = (message) => {
  logger.log({ message: message, level: "warn" });
};

exports.debug = (message) => {
  logger.log({ message: message, level: "debug" });
};
