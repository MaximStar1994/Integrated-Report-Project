const winston = require("winston");
const fs = require("fs");
const path = require("path");

const transports = [];
var loggerFileName = "";
if (process.env.NODE_ENV !== "production") {
  var currentdate =
    new Date().getFullYear() +
    `${new Date().getMonth() + 1}` +
    new Date().getDate();

  // below condition check whether log folder path available or not
  if (fs.existsSync(process.env.LOG_FILE_PATH)) {
    // below code will fetch all available log files inside the folder path
    var loggerFileList = fs.readdirSync(process.env.LOG_FOLDER_FILES_PATH);
    // filtering the list based on projects
    loggerFileList = loggerFileList.filter((item) =>
      item.includes(process.env.LOG_FILE_NAME_PREFIX)
    );
    // sorting the list to descending order
    loggerFileList.sort(function (a, b) {
      return (
        fs.statSync(process.env.LOG_FOLDER_FILES_PATH + b).mtime.getTime() -
        fs.statSync(process.env.LOG_FOLDER_FILES_PATH + a).mtime.getTime()
      );
    });

    // below function will fetch the latest log file size in bytes
    var recentlyCreatedFileSizeInBytes = getFilesizeInBytes(
      `${process.env.LOG_FILE_PATH}/${loggerFileList[0]}`
    );
    // checking whether the latest log file size exceeds to our max limit
    if (recentlyCreatedFileSizeInBytes >= process.env.BYTE_LENGTH) {
      loggerFileName = `${process.env.LOG_FILE_NAME_PREFIX}_log_${currentdate}.log`;
    } else {
      loggerFileName = `${loggerFileList[0]}`;
    }
  } else {
    // initial logger file
    loggerFileName = `${process.env.LOG_FILE_NAME_PREFIX}_log_${currentdate}.log`;
  }

  transports.push(
    new winston.transports.File({
      filename: `${process.env.LOG_FILE_PATH}/${loggerFileName}`,
    }),
    new winston.transports.Console()
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.label({
      label: `VesselCare🏷️`,
    }),
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    // winston.format.colorize(),
    winston.format.printf(
      (info) =>
        `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`
    )
  ),
  transports,
});

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

module.exports = logger;
