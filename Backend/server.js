const ServisEventsFunction = require("./servis-events");
const ServisUsersFunction = require("./servis-users");
const ServisCartsFunction = require("./servis-ecommerce");
const mongooseDB = require("./servis-users/config/db");
const ServisUploadFunction = require("./servis-upload");

mongooseDB();


ServisUsersFunction();

ServisEventsFunction();

ServisCartsFunction();

ServisUploadFunction();
