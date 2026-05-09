const ServiceRequest = require('../models/ServiceRequest');
const Vehicle = require('../models/Vehicle');

// @desc    Get all service requests
// @route   GET /api/services
// @access  Private
const getServiceRequests = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, status, priority } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { requestNumber: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const serviceRequests = await ServiceRequest.find(query)
      .populate('vehicle', 'licensePlate make model year')
      .populate('customer', 'firstName lastName phone')
      .populate('assignedMechanic', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ServiceRequest.countDocuments(query);

    res.json({
      serviceRequests,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalRequests: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service request
// @route   GET /api/services/:id
// @access  Private
const getServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('vehicle')
      .populate('customer')
      .populate('assignedMechanic', 'username email phone')
      .populate('createdBy', 'username');

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create service request
// @route   POST /api/services
// @access  Private
const createServiceRequest = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const serviceRequest = await ServiceRequest.create(serviceData);

    // Add service to vehicle's history
    await Vehicle.findByIdAndUpdate(req.body.vehicle, {
      $push: { serviceHistory: serviceRequest._id },
    });

    const populated = await ServiceRequest.findById(serviceRequest._id)
      .populate('vehicle', 'licensePlate make model year')
      .populate('customer', 'firstName lastName phone')
      .populate('assignedMechanic', 'username')
      .populate('createdBy', 'username');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service request
// @route   PUT /api/services/:id
// @access  Private
const updateServiceRequest = async (req, res) => {
  try {
    // If status is being set to completed, add completedDate
    if (req.body.status === 'completed') {
      req.body.completedDate = new Date();
    }

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('vehicle', 'licensePlate make model year')
      .populate('customer', 'firstName lastName phone')
      .populate('assignedMechanic', 'username')
      .populate('createdBy', 'username');

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service request
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Remove from vehicle's service history
    await Vehicle.findByIdAndUpdate(serviceRequest.vehicle, {
      $pull: { serviceHistory: serviceRequest._id },
    });

    await serviceRequest.deleteOne();

    res.json({ message: 'Service request removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
};
