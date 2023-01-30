const { authJwt } = require("../middleware");
const controller = require("../controllers/pinata.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const ipfsUpload = multer({
  storage: storage
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/pinata/file",
    [authJwt.verifyToken, ipfsUpload.single("ipfsFile")],
    controller.pinFileToIPFS
  );
  app.post("/api/pinata/json", [authJwt.verifyToken], controller.pinJSONToIPFS);
  app.get("/api/pinata", [authJwt.verifyToken], controller.getIPFSPins);
};
