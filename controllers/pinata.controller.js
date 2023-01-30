require("dotenv").config();
const { Readable } = require("stream");
const pinataSDK = require("@pinata/sdk");
const db = require("../models");
const IpfsLog = db.ipfsLog;

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

const pinFileToIPFS = async (req, res) => {
  const { originalname, buffer } = req.file;

  const options = {
    pinataMetadata: {
      name: originalname
    }
  };

  const stream = Readable.from(buffer);
  try {
    await testConnection();

    const pinnedFile = await pinFile(stream, options);
    console.log("PINNED FILE ", pinnedFile);
    // res.status(200).json({ message: "success" });
    const log = await createIpfsLog(
      buffer,
      originalname,
      pinnedFile,
      req.body.username
    );

    res.status(200).json({
      message: "success",
      fileName: log.dataValues.fileName,
      ipfsHash: log.dataValues.ipfsHash
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const pinJSONToIPFS = async (req, res) => {
  const options = {
    pinataMetadata: {
      name: req.body.name
    }
  };
  const obj = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image
  };
  try {
    await testConnection();
    const pinnedFile = await pinJson(obj, options);
    res.status(200).json({ message: "success", response: pinnedFile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//pin nft image to pinata
const pinFile = (stream, options) => {
  return new Promise((resolve, reject) => {
    pinata
      .pinFileToIPFS(stream, options)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject({ message: err.message }));
  });
};

//pin token data to pinata
const pinJson = (obj, options) => {
  return new Promise((resolve, reject) => {
    pinata
      .pinJSONToIPFS(obj, options)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
};

//create log of ipfs pinning to our off chain DB
const createIpfsLog = (buffer, fileName, pinFile, username) => {
  return new Promise((resolve, reject) => {
    IpfsLog.create({
      ipfsHash: pinFile.IpfsHash,
      fileName: fileName,
      pinSize: pinFile.PinSize,
      timestamp: pinFile.Timestamp,
      data: buffer,
      username: username
    })
      .then((log) => {
        resolve(log);
      })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
};

const getIPFSPins = async (req, res) => {
  try {
    await testConnection();
    const ipfsLogs = await IpfsLog.findAll();
    const result = ipfsLogs.map((ipfs) => {
      return {
        fileName: ipfs.fileName,
        hash: ipfs.ipfsHash,
        creator: ipfs.username
      };
    });
    res.status(200).send({ message: "success", data: result });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const testConnection = async () => {
  const testConnection = await pinata.testAuthentication();
  if (!testConnection) res.status(500).send("NOT AUTHENTICATED");
  return testConnection;
};

module.exports = { getIPFSPins, pinFileToIPFS, pinJSONToIPFS };
