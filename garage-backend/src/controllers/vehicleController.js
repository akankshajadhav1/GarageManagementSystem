const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, customer } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { licensePlate: { $regex: search, $options: 'i' } },
          { make: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (customer) {
      query.customer = customer;
    }

    const vehicles = await Vehicle.find(query)
      .populate('customer', 'firstName lastName phone email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Vehicle.countDocuments(query);

    res.json({
      vehicles,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalVehicles: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('customer', 'firstName lastName phone email')
      .populate({
        path: 'serviceHistory',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'assignedMechanic', select: 'username' },
      });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    // Add vehicle to customer's vehicles array
    await Customer.findByIdAndUpdate(req.body.customer, {
      $push: { vehicles: vehicle._id },
    });

    const populated = await Vehicle.findById(vehicle._id).populate(
      'customer',
      'firstName lastName phone email'
    );

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'License plate or VIN already exists',
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('customer', 'firstName lastName phone email');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'License plate or VIN already exists',
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Remove vehicle from customer's vehicles array
    await Customer.findByIdAndUpdate(vehicle.customer, {
      $pull: { vehicles: vehicle._id },
    });

    await vehicle.deleteOne();

    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
