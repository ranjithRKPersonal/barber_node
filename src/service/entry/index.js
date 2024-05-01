const slugify = require('slugify');
const shortid = require('shortid');
const config = require('../../config/env.json');
const { v4: uuidv4 } = require('uuid');
var mongoose = require('mongoose');
const { BaseUrl, SubUrl } = require('../../constants/statusConstants');
const { default: axios } = require('axios');

const convertObjectId = (string) => {
  return mongoose.Types.ObjectId(string);
};

const getRecentOutEntry = async (dbConnection, req) => {
  try {
    const Entry = dbConnection.model('Entry');
    var entryList = await Entry.find({
      phoneNumber: req.body.phoneNumber,
      $nor: [
        {
          story: 3,
        },
      ],
    });
    if (entryList.length != 0) {
      var recentEntry = entryList[entryList.length - 1];
      if (!recentEntry.outEntry) {
        return recentEntry;
      } else {
        throw Error('In entry not found');
      }
    } else {
      throw Error('In entry not found');
    }
  } catch (err) {
    throw Error('In entry not found');
  }
};

const verifyAndUpdateInCompleteEntry = async (dbConnection, req, role) => {
  const Entry = dbConnection.model('Entry');
  var entryList = await Entry.find({
    phoneNumber: req.body.phoneNumber,
    $nor: [
      {
        story: 3,
      },
    ],
  });
  if (entryList.length != 0) {
    var recentEntry = entryList[entryList.length - 1];
    if (!recentEntry.outEntry) {
      var entryUpdates = recentEntry.entryUpdates;
      var outEntry = {
        entryStatus: false,
      };
      var entryUpdates = recentEntry.entryUpdates;
      entryUpdates.push({
        type: 'AutoUpdate',
        role: role,
        userId: req.userData.payload._id,
        updatedDate: new Date(),
      });
      recentEntry.entryUpdates = entryUpdates;
      recentEntry.outEntry = outEntry;
      recentEntry.save();
      return 'In Complete Entry Auto Updated';
    } else {
      return 'No In Complete Entry';
    }
  } else {
    return 'No In Complete Entry';
  }
};

const getEntryCount = (entryList, type) => {
  var entryCount = 0;
  let entryValue = entryList.reduce((entryCount, entry) => {
    if (type == 'Out' && entry?.outEntry) {
      entryCount += 1;
    }
    return entryCount;
  }, entryCount);
  return entryValue;
};

const getAllDashboardEntrys = (filter) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var query;

  switch (filter) {
    case 'Today': {
      let customDate = `${year}-${month}-${day}`;
      let fromLimit = customDate;
      let lastDate = fromLimit.split('-')[2].split('"')[0];
      let toLimit = `${fromLimit.split('-')[0]}-${fromLimit.split('-')[1]}-${
        parseInt(lastDate) + 1
      }`;
      query = {
        story: { $in: [1, 0, 2] },
        'inEntry.createdDate': {
          $gte: new Date(fromLimit),
          $lt: new Date(toLimit),
        },
      };
      break;
    }
    case 'Yesterday': {
      let fromLimit = `${year}-${month}-${day - 1}`;
      let toLimit = `${year}-${month}-${day}`;
      query = {
        story: { $in: [1, 0, 2] },
        'inEntry.createdDate': {
          $gte: new Date(fromLimit),
          $lt: new Date(toLimit),
        },
      };
      break;
    }
    case 'LastWeek': {
      let fromLimit = `${year}-${month}-${day - 7}`;
      let toLimit = `${year}-${month}-${day + 1}`;
      query = {
        story: { $in: [1, 0, 2] },
        'inEntry.createdDate': {
          $gte: new Date(fromLimit),
          $lte: new Date(toLimit),
        },
      };
      break;
    }
    case 'LastMonth': {
      let lastMonthModifier = month == 1 ? 12 : month - 1;
      let fromLimit = `${year}-${month - lastMonthModifier}-${day}`;
      let toLimit = `${year}-${month}-${day + 1}`;
      query = {
        story: { $in: [1, 0, 2] },
        'inEntry.createdDate': {
          $gte: new Date(fromLimit),
          $lte: new Date(toLimit),
        },
      };
      break;
    }
    default: {
      let fromLimit = `${year}-${month}-${day}`;
      query = {
        story: { $in: [1, 0, 2] },
        'inEntry.createdDate': { $gt: new Date(fromLimit) },
      };
      break;
    }
  }
  return { query };
};
/*
Test Cases  Todo Works
i) InEntry : 
1) Check Visitor Registration When Entry By Visitor
2) Allow Without Registration When Entry Done By Admin Role
3) Check User Recent InEntry Status Update Accordingly

ii) OutEntry :
1) Should Be Have Previous InEntry
2) Should Update Previous InEntry
3) Check Visitor Registration When Entry By Visitor
4) Allow Without Registration When Entry Done By Admin Role
*/
const createEntry = async (dbConnection, req) => {
  try {
    var actionCreaterId = req.userData.payload._id;
    var randomId = Math.floor(1000 + Math.random() * 9000);
    var passId = new Date().getTime();
    var entryPassId = `${randomId}${passId}`;
    const entryType = req.body.type;
    var {
      name,
      reason,
      address,
      temperature,
      purpose,
      inEntry,
      email,
      phoneNumber,
      outEntry,
      countryCode,
    } = req.body;
    // const role = req.userData.payload.customDomain ? "Admin" : "Client";
    const role = 'Client';
    const Entry = await dbConnection.model('Entry');
    if (entryType == 'In' && role == 'Admin') {
      inEntry.createByRole = role;
      inEntry.createDate = new Date();
      inEntry.createrId = actionCreaterId;
      entryObj = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        userId: req.body._id,
        reason: reason,
        address: address,
        vehicleNumber: req.body.vehicleNumber,
        temperature: temperature,
        purpose: purpose,
        inEntry: inEntry,
        entryPassId: entryPassId,
        story: 0,
        entryUpdates: [
          {
            type: 'Create',
            role: 'Admin',
            userId: actionCreaterId,
            updatedDate: new Date(),
          },
        ],
      };
      const updateInCompleteEntry = await verifyAndUpdateInCompleteEntry(
        dbConnection,
        req,
        role
      );
      console.log(updateInCompleteEntry);
      const entryData = await new Entry(entryObj).save();
      if (entryData) {
        var time = new Date(entryData.createdDate)
          .toLocaleTimeString('en-US')
          .replace(/:\d{2}\s/, ' ');
        var date = new Date(entryData.createdDate).toISOString().split('T')[0];
        const url = `${BaseUrl.MSG_91}${SubUrl.SEND_SINGLE_SMS}?
      template_id=${config.MSG_91_ENTRY_ACKNOWLEDGEMENT_VISITOR_FLOW_ID}
      &authkey=${config.MSG_91_AUTH_KEY}`;
        var reqDetail = {
          method: 'post',
          url: url,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
          },
          data: {
            flow_id: config.MSG_91_ENTRY_ACKNOWLEDGEMENT_VISITOR_FLOW_ID,
            sender: config.MSG_91_SENDER_ID,
            mobiles: `${countryCode}${phoneNumber}`,
            NAME: name.toUpperCase(),
            PURPOSE: purpose.type,
            VISITORPASSID: entryPassId,
            ENTRYTYPE: entryType,
            TIME: time,
            DATE: `${new Date(entryData.createdDate).getDate()}-${new Date(
              entryData.createdDate
            ).getMonth()}-${new Date(entryData.createdDate).getFullYear()}`,
            ORANIZATIONNAME: req.body.businessName.split('_')[0],
            LINK: 'https://myvisitor360.com/scanner',
            template_id: config.MSG_91_ENTRY_ACKNOWLEDGEMENT_VISITOR_FLOW_ID,
          },
        };
        var entryPass = await axios(reqDetail);
      }
      return entryData;
    } else if (entryType == 'In' && role == 'Client') {
      if (req.body.entryId) {
        var entry = await Entry.findOne({
          _id: req.body.entryId,
          $nor: [{ story: '3' }],
        });
        var outEntry = {
          entryStatus: false,
        };
        if (entry) {
          var entryUpdates = entry.entryUpdates;
          entryUpdates.push({
            type: 'AutoUpdate',
            role: role,
            userId: actionCreaterId,
            updatedDate: new Date(),
          });
          entry.entryUpdates = entryUpdates;
          entry.outEntry = outEntry;
          entry.save();
        }
      } else {
        const updateInCompleteEntry = await verifyAndUpdateInCompleteEntry(
          dbConnection,
          req,
          role
        );
        console.log(updateInCompleteEntry);
      }
      inEntry.createByRole = role;
      inEntry.createDate = new Date();
      inEntry.createrId = actionCreaterId;
      entryObj = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        userId: req.body._id,
        reason: reason,
        address: address,
        vehicleNumber: req.body.vehicleNumber,
        temperature: temperature,
        purpose: purpose,
        inEntry: inEntry,
        entryPassId: entryPassId,
        story: 0,
        entryUpdates: [
          {
            type: 'Create',
            role: 'Client',
            userId: actionCreaterId,
            updatedDate: new Date(),
          },
        ],
      };
      const entryData = await new Entry(entryObj).save();
      if (entryData) {
        var time = new Date(entryData.createdDate)
          .toLocaleTimeString('en-US')
          .replace(/:\d{2}\s/, ' ');
        var date = new Date(entryData.createdDate);
        const url = `${BaseUrl.MSG_91}${SubUrl.SEND_SINGLE_SMS}?
      template_id=${config.MSG_91_ENTRY_ACKNOWLEDGEMENT_VISITOR_FLOW_ID}
      &authkey=${config.MSG_91_AUTH_KEY}`;
        var reqDetail = {
          method: 'post',
          url: url,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
          },
          data: {
            flow_id: config.MSG_91_ENTRY_ACKNOWLEDGEMENT_VISITOR_FLOW_ID,
            sender: config.MSG_91_SENDER_ID,
            mobiles: `${countryCode}${phoneNumber}`,
            NAME: name.toUpperCase(),
            PURPOSE: purpose.type,
            VISITORPASSID: entryPassId,
            ENTRYTYPE: entryType,
            TIME: time,
            DATE: `${new Date(entryData.createdDate).getDate()}-${new Date(
              entryData.createdDate
            ).getMonth()}-${new Date(entryData.createdDate).getFullYear()}`,
            ORANIZATIONNAME: req.body.businessName.split('_')[0],
            LINK: 'https://myvisitor360.com/scanner',
            template_id: config.MSG_91_ENTRY_ACKNOWLEDGEMENT_VISITOR_FLOW_ID,
          },
        };
        var entryPass = await axios(reqDetail);
        console.log(entryPass.data);
      } else {
        throw new Error('Entry failed something went wrong');
      }
      return entryData;
    } else if (entryType == 'Out' && role == 'Admin') {
      var entry = await Entry.findOne({
        _id: req.body.entryId,
        $nor: [{ story: '3' }],
      });
      if (entry && !entry.outEntry) {
        var outEntry = req.body;
        var entryUpdates = entry.entryUpdates;
        entryUpdates.push({
          type: 'UpdateOut',
          role: 'Admin',
          userId: actionCreaterId,
          updatedDate: new Date(),
        });
        entry.entryUpdates = entryUpdates;
        outEntry.createByRole = role;
        outEntry.createDate = new Date();
        outEntry.createrId = actionCreaterId;
        outEntry.entryStatus = true;
        entry.outEntry = outEntry;
        entry.save();
        return entry;
      } else {
        throw new Error('Entry Not Found');
      }
    } else if (entryType == 'Out' && role == 'Client') {
      var entry = await Entry.findOne({
        _id: req.body.entryId,
        $nor: [{ story: '3' }],
      });
      if (entry && !entry.outEntry) {
        var outEntry = req.body;
        var entryUpdates = entry.entryUpdates;
        entryUpdates.push({
          type: 'UpdateOut',
          role: 'Client',
          userId: actionCreaterId,
          updatedDate: new Date(),
        });
        entry.entryUpdates = entryUpdates;
        outEntry.createByRole = role;
        outEntry.createDate = new Date();
        outEntry.createrId = req.userData.payload._id;
        entry.outEntry = outEntry;
        entry.save();
        return entry;
      } else {
        const checkRecentOutEntry = await getRecentOutEntry(dbConnection, req);
        console.log(checkRecentOutEntry);
        if (checkRecentOutEntry) {
          let entry = await Entry.findOne({
            _id: checkRecentOutEntry._id,
            $nor: [{ story: '3' }],
          });
          var outEntry = req.body;
          var entryUpdates = entry.entryUpdates;
          entryUpdates.push({
            type: 'UpdateOut',
            role: 'Client',
            userId: actionCreaterId,
            updatedDate: new Date(),
          });
          entry.entryUpdates = entryUpdates;
          outEntry.createByRole = role;
          outEntry.createDate = new Date();
          outEntry.createrId = req.userData.payload._id;
          entry.outEntry = outEntry;
          entry.save();
          return entry;
        } else {
          throw new Error('In Entry Not Found');
        }
      }
    }
  } catch (error) {
    console.log('Create entry error', error);
    throw error;
  }
};

const addEntryKey = async (dbConnection, req) => {
  try {
    let entryObj = {
      scanId: uuidv4(),
    };
    const EntryScan = await dbConnection.model('ScanSchema');
    const entryData = await new EntryScan(entryObj).save();
    return entryData;
  } catch (error) {
    console.log('Create entry key error', error);
    throw error;
  }
};

const filterAllEntrys = async (dbConnection, req) => {
  try {
    // const currentPage = req.query && req.query.page ? parseInt(req.query.page) : 1;
    // const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10;
    // const skip = (currentPage - 1) * limit;
    const filter = req.query && req.query.filter ? req.query.filter : 'all';
    let sortQuery;
    let query;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = year + '-' + month + '-' + day;
    var cond;
    switch (filter) {
      case 'InEntry': {
        query = {
          story: { $in: [1, 0, 2] },
          entryType: { $in: [0] },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
      case 'OutEntry': {
        query = {
          story: { $in: [1, 0, 2] },
          outEntry: { $exists: false },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
      case 'Today': {
        let customDate = `${year}-${month}-${day}`;
        let fromLimit = customDate;
        let lastDate = fromLimit.split('-')[2].split('"')[0];
        let toLimit = `${fromLimit.split('-')[0]}-${fromLimit.split('-')[1]}-${
          parseInt(lastDate) + 1
        }`;
        query = {
          story: { $in: [1, 0, 2] },
          'inEntry.createdDate': {
            $gte: new Date(fromLimit),
            $lt: new Date(toLimit),
          },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
      case 'Yesterday': {
        let fromLimit = `${year}-${month}-${day - 1}`;
        let toLimit = `${year}-${month}-${day}`;
        query = {
          story: { $in: [1, 0, 2] },
          'inEntry.createdDate': {
            $gte: new Date(fromLimit),
            $lt: new Date(toLimit),
          },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
      case 'LastWeek': {
        let fromLimit = `${year}-${month}-${day - 7}`;
        let toLimit = `${year}-${month}-${day}`;
        query = {
          story: { $in: [1, 0, 2] },
          'inEntry.createdDate': {
            $gte: new Date(fromLimit),
            $lte: new Date(toLimit),
          },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
      case 'LastMonth': {
        let lastMonthModifier = month == 1 ? 12 : month - 1;
        let fromLimit = `${year}-${month - lastMonthModifier}-${day}`;
        let toLimit = `${year}-${month}-${day}`;
        query = {
          story: { $in: [1, 0, 2] },
          'inEntry.createdDate': {
            $gte: new Date(fromLimit),
            $lte: new Date(toLimit),
          },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
      case 'Month': {
        if (req.query.date) {
          var newDate = new Date(req.query.date);
          req.query.fromDate = `"${req.query.fromDate}"`;
          req.query.toDate = `"${req.query.toDate}"`;
          sortQuery = { createdAt: -1 };
          query = {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear(),
          };
          cond = [
            {
              $project: {
                month: { $month: '$inEntry.createdDate' },
                year: { $year: '$inEntry.createdDate' },
                _id: 1,
                inEntry: 1,
                outEntry: 1,
                name: 1,
                phoneNumber: 1,
                reason: 1,
                temperature: 1,
                purpose: 1,
                entryPassId: 1,
                email: 1,
                createdAt: 1,
                address: 1,
              },
            },
            {
              $match: query,
            },
            {
              $facet: {
                paginatedResults: [{ $sort: sortQuery }],
                totalCount: [
                  {
                    $count: 'count',
                  },
                ],
              },
            },
          ];
        }
      }
      case 'CustomDate': {
        if (req.query.fromDate && req.query.toDate) {
          req.query.fromDate = `"${req.query.fromDate}"`;
          req.query.toDate = `"${req.query.toDate}"`;
          let toDate = new Date(req.query.toDate);
          query = {
            story: { $in: [1, 0, 2] },
            'inEntry.createdDate': {
              $gte: new Date(req.query.fromDate),
              $lte: new Date(
                toDate.getFullYear(),
                toDate.getMonth(),
                toDate.getDate() + 1
              ),
            },
          };
          sortQuery = { createdAt: -1 };
        } else {
          let fromLimit = req.query.fromDate;
          fromLimit = `"${fromLimit}"`;
          let lastDate = fromLimit.split('-')[2].split('"')[0];
          let toLimit = `${fromLimit.split('-')[0]}-${
            fromLimit.split('-')[1]
          }-${parseInt(lastDate) + 1}`;
          query = {
            story: { $in: [1, 0, 2] },
            'inEntry.createdDate': {
              $gte: new Date(fromLimit),
              $lt: new Date(toLimit),
            },
          };
          sortQuery = { createdAt: -1 };
        }
        break;
      }
      default: {
        let fromLimit = `${year}-${month}-${day}`;
        query = {
          story: { $in: [1, 0, 2] },
          'inEntry.createdDate': { $gt: new Date(fromLimit) },
        };
        sortQuery = { createdAt: -1 };
        break;
      }
    }
    if (filter !== 'Month') {
      cond = [
        { $match: query },
        {
          $facet: {
            paginatedResults: [
              { $sort: sortQuery },
              // { $skip: skip },
              // { $limit: limit },
            ],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ];
    }

    const Entry = await dbConnection.model('Entry');
    let entryList = await Entry.aggregate(cond);
    let response = {
      total_count: entryList[0].totalCount[0]
        ? entryList[0].totalCount[0].count
        : 0,
      // limit: limit,
      // skip: skip,
      data: entryList[0].paginatedResults,
    };
    return response;
  } catch (error) {
    console.log('Faild to get entry list filter lists error', error);
    throw error;
  }
};

const getAllEntrys = async (dbConnection, req) => {
  try {
    // const currentPage = req.query && req.query.page ? parseInt(req.query.page) : 1;
    // const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10;
    // const skip = (currentPage - 1) * limit;
    const query = {
      story: { $in: [1, 0, 2] },
    };
    const cond = [
      { $match: query },
      {
        $facet: {
          paginatedResults: [
            { $sort: { createdAt: -1 } },
            // { $skip: skip },
            // { $limit: limit },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];
    const Entry = await dbConnection.model('Entry');
    let entryList = await Entry.aggregate(cond);
    let response = {
      total_count: entryList[0].totalCount[0]
        ? entryList[0].totalCount[0].count
        : 0,
      // limit: limit,
      // skip: skip,
      data: entryList[0].paginatedResults,
    };
    return response;
  } catch (error) {
    console.log('Faild to get entry lists error', error);
    throw error;
  }
};

const getAllEntrysDashboard = async (dbConnection, req) => {
  try {
    const Entry = await dbConnection.model('Entry');
    let filterList = ['Today', 'Yesterday', 'LastWeek', 'LastMonth'];
    var queryList = [];
    filterList.forEach((data) => {
      queryList.push(getAllDashboardEntrys(data));
    });

    let queryListValues = {
      today: [
        {
          $match: queryList[0].query,
        },
      ],
      yesterday: [
        {
          $match: queryList[1].query,
        },
      ],
      lastWeek: [
        {
          $match: queryList[2].query,
        },
      ],
      lastMonth: [
        {
          $match: queryList[3].query,
        },
      ],
    };

    let entryListToday = await Entry.aggregate(queryListValues.today);
    let entryListYesterday = await Entry.aggregate(queryListValues.yesterday);
    let entryListLastweek = await Entry.aggregate(queryListValues.lastWeek);
    let entryListLastmonth = await Entry.aggregate(queryListValues.lastMonth);

    entryListCount = {
      today: {
        total: entryListToday.length,
        inEntry: entryListToday.length,
        outEntry: getEntryCount(entryListToday, 'Out'),
      },
      yesterday: {
        total: entryListYesterday.length,
        inEntry: entryListYesterday.length,
        outEntry: getEntryCount(entryListYesterday, 'Out'),
      },
      lastWeek: {
        total: entryListLastweek.length,
        inEntry: entryListLastweek.length,
        outEntry: getEntryCount(entryListLastweek, 'Out'),
      },
      lastMonth: {
        total: entryListLastmonth.length,
        inEntry: entryListLastmonth.length,
        outEntry: getEntryCount(entryListLastmonth, 'Out'),
      },
    };

    let response = {
      data: entryListCount,
    };
    return response;
  } catch (error) {
    console.log('Faild to get entry lists error', error);
    throw error;
  }
};
const deleteEntry = async (dbConnection, req) => {
  try {
    let Entry = await dbConnection.model('Entry');
    let _id = req.body._id;
    let query = {
      _id: _id,
      $nor: [{ story: '3' }],
    };

    let isValidDeleteEntry = await Entry.findOne(query);
    if (isValidDeleteEntry == null) throw new Error('Entry not found');
    var entryUpdates = isValidDeleteEntry.entryUpdates;
    entryUpdates.push({
      type: 'Delete',
      role: 'Admin',
      userId: req.user.payload._id,
      updatedDate: new Date(),
    });
    isValidDeleteEntry.entryUpdates = entryUpdates;
    await isValidDeleteEntry.save();
    await Entry.findOneAndUpdate({ _id: _id }, { $set: { story: 3 } }).exec(
      (err, data) => {
        if (err) throw new Error('Failed to delete entry try again');
        else return data;
      }
    );
  } catch (error) {
    console.log('Failed to delete entry try again', error);
    throw error;
  }
};
const getEntry = async (dbConnection, req) => {
  try {
    let _id = req.query._id;
    let Entry = await dbConnection.model('Entry');
    let entryData = await Entry.findOne({
      _id: _id,
      $nor: [{ story: '3' }],
    });
    if (entryData) {
      let newEntryData = JSON.parse(JSON.stringify(entryData));
      newEntryData.phone = {
        phoneNumber: newEntryData.phoneNumber,
        countryCode: newEntryData.countryCode ? newEntryData.countryCode : '91',
      };
      return newEntryData;
    } else {
      throw new Error('Entry not found');
    }
  } catch (error) {
    console.log('Faild to get entry error', error);
    throw error;
  }
};

const getAllEntry = async (dbConnection, req) => {
  try {
    let Entry = await dbConnection.model('Entry');
    let entryDataList = await Entry.find({
      $nor: [{ story: '3' }],
    }).sort({ createdAt: -1 });
    if (entryDataList) {
      return entryDataList;
    } else {
      throw new Error('Entry list not found');
    }
  } catch (error) {
    console.log('Faild to get entry list error', error);
    throw error;
  }
};

const editEntry = async (dbConnection, req) => {
  try {
    let _id = req.body._id;
    let Entry = await dbConnection.model('Entry');
    let query = {
      _id: _id,
      $nor: [{ story: '3' }],
    };
    let isEntryPresent = await Entry.findOne(query);
    if (isEntryPresent) {
      var entryUpdates = isEntryPresent.entryUpdates;
      entryUpdates.push({
        type: 'Edit',
        role: 'Admin',
        userId: req.user.payload._id,
        updatedDate: new Date(),
      });
      let entryObj = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        temperature: req.body.temperature,
        address: req.body.address,
        purpose: req.body.purpose,
        reason: req.body.reason,
        story: 1,
        createByRole: 'Admin',
        updatedDate: new Date(),
        inEntry: req.body.inEntry,
        outEntry: req.body.outEntry,
        entryPassId: req.body.entryPassId,
        entryUpdates: entryUpdates,
      };
      const entry = await Entry.findOneAndUpdate({ _id: _id }, entryObj, {
        new: true,
      });
      return entry;
    } else {
      throw new Error('Entry not found');
    }
  } catch (error) {
    console.log('Edit entry error', error);
    throw error;
  }
};
module.exports = {
  createEntry,
  filterAllEntrys,
  getAllEntrys,
  getAllEntrysDashboard,
  addEntryKey,
  deleteEntry,
  getEntry,
  editEntry,
  getAllEntry,
};
