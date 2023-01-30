module.exports = (sequelize, Sequelize) => {
  const IpfsLog = sequelize.define("ipfs_log", {
    ipfsHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fileName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pinSize: {
      type: Sequelize.STRING,
      allowNull: false
    },
    timestamp: {
      type: Sequelize.STRING,
      allowNull: false
    },
    data: {
      type: Sequelize.BLOB("tiny")
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return IpfsLog;
};
