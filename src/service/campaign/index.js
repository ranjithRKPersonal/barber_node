var mongoose = require('mongoose');
const logger = require('../../logger/index');
const createCampaign = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger createCampaign service ] ');
    const Campaign = await dbConnection.model('Campaign');
    const campaignExists = await Campaign.findOne({
      name: req.body.name,
      story: { $in: [1, 0, 2] }
    });
    if (campaignExists) throw new Error('Campaign already exists');
    const newCampaign = new Campaign({
      name: req.body.name,
      description: req.body.description,
      templateDetails: req.body.templateDetails,
      clientIds: req.body.clientIds,
      deliveryStatus: req.body.deliveryStatus
    });
    await newCampaign.save();
    return newCampaign;
  } catch (error) {
    logger.error(' [ Failed createCampaign service ] ', error.message);
    throw new Error(error.message);
  }
};

const editCampaign = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger editCampaign service ] ');
    const Campaign = await dbConnection.model('Campaign');
    // Retrieve the original record
    const campaignFound = await Campaign.findById(req.body._id);

    if (!campaignFound) {
      throw new Error('Campaign not found');
    }
    // Check for duplicates
    const duplicateCampaign = await Campaign.findOne({
      name: req.body.name,
    });

    if (duplicateCampaign && duplicateCampaign._id.toString() !== req.body._id) {
      throw new Error('Campaign already exits');
    }

    const newCampaign = await Campaign.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
            name: req.body.name,
            description: req.body.description,
            templateDetails: req.body.templateDetails,
            clientIds: req.body.clientIds,
            deliveryStatus: req.body.deliveryStatus
        },
      },
      { new: true }
    );
    if (newCampaign) return newCampaign;
    else throw new Error('Failed editCampaign');
  } catch (error) {
    logger.error(' [ Failed editCampaign service ] ', error.message);
    throw new Error(error.message);
  }
};


const getSingleCampaign = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getSingleCampaign service ] ');
    const Campaign = await dbConnection.model('Campaign');
    const Client = await dbConnection.model('Client');
    const UserCollectionName = await dbConnection.model('Client').collection
    .name;
    console.log("++++ req.query._id____", req.query._id);
    const campaignFound = await Campaign.aggregate([
        {
          $lookup: {
            from: UserCollectionName,
            localField: 'clientIds',
            foreignField: '_id',
            as: 'clients',
          },
        },
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.query._id)
          },
        },
      ]).exec();
    var nonSendClients = await Client.find({
        _id: { $nin: campaignFound[0].clientIds }
    })
    var campaignFoundNew = campaignFound
    if (campaignFoundNew) {
        campaignFoundNew.nonSendClients = nonSendClients;
        return { campaign: campaignFound , sendClients: campaignFound[0].clients ,  nonSendClients } ;
    }
    else throw new Error('Failed getSingleCampaign');
  } catch (error) {
    logger.error(' [ Failed getSingleCampaign service ] ', error.message);
    throw new Error(error.message);
  }
};

const getAllCampaign = async (dbConnection, req) => {
  try {
    logger.info(' [ Trigger getAllCampaign service ] ');
    const UserCollectionName = await dbConnection.model('Client').collection
    .name;
    const Campaign = await dbConnection.model('Campaign');
    const campaignListFound = await Campaign.aggregate([
        {
          $lookup: {
            from: UserCollectionName,
            localField: 'clientIds',
            foreignField: '_id',
            as: 'clients',
          },
        }
      ]).exec();
    if (campaignListFound) return campaignListFound;
    else throw new Error('Failed getAllCampaign');
  } catch (error) {
    logger.error(' [ Failed getAllCampaign service ] ');
    throw new Error(error.message);
  }
};


module.exports = {
  createCampaign,
  getAllCampaign,
  getSingleCampaign,
  editCampaign
};
