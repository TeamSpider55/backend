const express = require("express");
const router = express.Router();
const Util = require("../lib/timeUtil");
const participantController = require("../controllers/participantController");

router.get("/confirm/:invitation", async (req, res) => {
    let link = req.params.invitation;
    res.json({data: "hellloo----------------------------------------------" + link});
    participantController.confirmParticipant(req.body.start, req.body);
});

module.exports = router;