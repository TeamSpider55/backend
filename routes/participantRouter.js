const express = require("express");
const router = express.Router();
const Util = require("../lib/timeUtil");
const participantController = require("../controllers/participantController");

const passport = require("passport");
router.use(passport.authenticate("jwt", { session: false }));

router.post("/pending", async(req, res) => {
    let user = req.user._id;
    
    participantController(req.body.start, req.body.end, user, req.body.email, 'pending');
});


router.post("/add", async(req, res) => {
    let user = req.user._id;
    
    participantController(req.body.start, req.body.end, user, req.body.email, 'confirm');
});

router.post("/confirm/:invitation", async (req, res) => {
    let link = req.params.invitation;
    res.json({data: "hellloo----------------------------------------------"});
    //participantController.confirmParticipant(req.body.start, req.body);
});