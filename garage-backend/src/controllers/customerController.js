const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const customers = await Customer.find(query)
      .populate('vehicles')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Customer.countDocuments(query);

    res.json({
      customers,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalCustomers: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate({
      path: 'vehicles',
      populate: {
        path: 'serviceHistory',
        options: { sort: { createdAt: -1 }, limit: 5 },
      },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Phone number or email already exists',
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Phone number or email already exists',
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Also delete associated vehicles
    await Vehicle.deleteMany({ customer: req.params.id });
    await customer.deleteOne();

    res.json({ message: 'Customer and associated vehicles removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
