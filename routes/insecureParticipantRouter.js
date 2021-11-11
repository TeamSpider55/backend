const express = require("express");
const router = express.Router();
const Util = require("../lib/timeUtil");
const participantController = require("../controllers/participantController");

router.post("/:invitation", async (req, res) => {
    let link = req.params.invitation;
    res.json(participantController.confirmParticipant(link));
});

module.exports = router;