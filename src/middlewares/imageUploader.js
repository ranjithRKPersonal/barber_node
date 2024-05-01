const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const upload = multer({ 'dest': '/uploads/'});

