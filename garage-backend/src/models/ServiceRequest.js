const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'diagnosing', 'waiting_parts', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    estimatedCompletion: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    assignedMechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    services: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        cost: { type: Number, default: 0 },
        duration: { type: Number, default: 0 }, // in hours
      },
    ],
    partsUsed: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate request number before saving
serviceRequestSchema.pre('save', async function () {
  if (!this.requestNumber) {
    // Find the highest existing request number
    const lastRequest = await mongoose.model('ServiceRequest').findOne({}, {}, { sort: { 'requestNumber': -1 } });
    let nextNumber = 1;
    if (lastRequest && lastRequest.requestNumber) {
      const match = lastRequest.requestNumber.match(/SR-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    this.requestNumber = `SR-${String(nextNumber).padStart(5, '0')}`;
  }
});

// Calculate total cost virtual
serviceRequestSchema.virtual('totalCost').get(function () {
  const servicesTotal = this.services.reduce((sum, service) => sum + (service.cost || 0), 0);
  const partsTotal = this.partsUsed.reduce((sum, part) => sum + (part.total || 0), 0);
  return servicesTotal + partsTotal;
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
