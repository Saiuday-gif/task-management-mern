const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(upload.single('file'), createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;