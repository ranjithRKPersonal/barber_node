const slugify = require("slugify");
const shortid = require("shortid");
const { v4: uuidv4 } = require("uuid");
var mongoose = require("mongoose");

const createRequestDemo = async (adminDbConnection, req) => {
  try {
    const Tenant = await adminDbConnection.model("RequestDemo");
    let entryObj = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      businessCategory: req.body.businessCategory,
      address: req.body.address,
      createByRole: req.body.createByRole || "Client",
      createdDate: req.body.createdDate || new Date(),
    };
    console.log(">>data", entryObj);
    // const EntryScan = await adminDbConnection.model("RequestDemo");
    const entryData = await new Tenant(entryObj).save();
    return entryData;
  } catch (error) {
    console.log("Login Tenant error", error);
    throw error;
  }
};

module.exports = {
  createRequestDemo,
};
