const Task = require('../models/Task');
const { cloudinary } = require('../config/cloudinary');
const { sendTaskEmail } = require('../utils/emailService');
const { getWeatherByCity } = require('../utils/weatherService');

const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const numericPage = Number(page);
    const numericLimit = Number(limit);
    const skip = (numericPage - 1) * numericLimit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Task.countDocuments(query),
    ]);

    const tasksWithWeather = await Promise.all(
      tasks.map(async (task) => {
        const weather = task.location ? await getWeatherByCity(task.location) : null;
        return { ...task.toObject(), weather };
      })
    );

    res.json({
      data: tasksWithWeather,
      meta: {
        total,
        page: numericPage,
        lastPage: Math.ceil(total / numericLimit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    let fileUrl = '';

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: 'tasks' });
      fileUrl = uploadRes.secure_url;
    }

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
      fileUrl,
    });

    sendTaskEmail(
      req.user.email,
      'New Task Created',
      `You created a new task: "${task.title}".`
    );

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.status === 'DONE') {
      sendTaskEmail(
        req.user.email,
        'Task Completed',
        `Congratulations! Task "${task.title}" has been marked as DONE.`
      );
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };