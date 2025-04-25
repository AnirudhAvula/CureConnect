const router = require("express").Router();
const Doctor = require("../models/Doctor");

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({}, { password: 0 }); // hide password
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching doctors", error: err.message });
  }
});

//GEt doctors based on specialization
router.get("/specialization/:field", async (req, res) => {
    const field = req.params.field;
    const doctors = await Doctor.find({ specialization: field }, { password: 0 });
    res.json(doctors);
  });
  

module.exports = router;
