const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, updateJobStatus, addJobUpdate, getMyJobs, getJobsByVehicleId } = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getJobs);
router.get('/my-jobs', auth, getMyJobs); // Add this BEFORE :id route to avoid conflict if :id catches it (though :id is usually hex, better safe)
router.get('/:id', auth, getJobById);
router.get('/vehicle/:vehicleId', auth, getJobsByVehicleId);
router.post('/', auth, createJob);
router.put('/:id/status', auth, updateJobStatus);
router.post('/:id/updates', auth, addJobUpdate);

module.exports = router;
