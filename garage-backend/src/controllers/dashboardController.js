const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalServices = await ServiceRequest.countDocuments();
    const totalMechanics = await User.countDocuments({ role: 'mechanic', isActive: true });

    const activeServices = await ServiceRequest.countDocuments({
      status: { $in: ['pending', 'diagnosing', 'waiting_parts', 'in_progress'] },
    });

    const completedServices = await ServiceRequest.countDocuments({ status: 'completed' });

    // Revenue calculation
    const revenueResult = await ServiceRequest.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$actualCost' },
        },
      },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly revenue for chart (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await ServiceRequest.aggregate([
      {
        $match: {
          status: 'completed',
          completedDate: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedDate' },
            month: { $month: '$completedDate' },
          },
          revenue: { $sum: '$actualCost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Service status distribution
    const statusDistribution = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Priority distribution
    const priorityDistribution = await ServiceRequest.aggregate([
      {
        $match: {
          status: { $nin: ['completed', 'cancelled'] },
        },
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalCustomers,
      totalVehicles,
      totalServices,
      totalMechanics,
      activeServices,
      completedServices,
      totalRevenue,
      monthlyRevenue,
      statusDistribution,
      priorityDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentActivity = async (req, res) => {
  try {
    const recentServices = await ServiceRequest.find()
      .populate('vehicle', 'licensePlate make model')
      .populate('customer', 'firstName lastName')
      .populate('assignedMechanic', 'username')
      .sort({ updatedAt: -1 })
      .limit(10);

    const recentCustomers = await Customer.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      recentServices,
      recentCustomers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getRecentActivity };
