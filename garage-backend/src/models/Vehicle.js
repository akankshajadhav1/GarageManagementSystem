const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      enum: [
        'Toyota',
        'Honda',
        'Ford',
        'Chevrolet',
        'BMW',
        'Mercedes',
        'Audi',
        'Hyundai',
        'Kia',
        'Nissan',
        'Volkswagen',
        'Subaru',
        'Mazda',
        'Lexus',
        'Jeep',
        'Ram',
        'GMC',
        'Tesla',
        'Volvo',
        'Porsche',
        'Other',
      ],
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
    },
    year: {
      type: Number,
      min: 1990,
      max: new Date().getFullYear() + 1,
    },
    color: {
      type: String,
      default: '',
    },
    vin: {
      type: String,
      unique: true,
      sparse: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    fuelType: {
      type: String,
      enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'],
      default: 'Gasoline',
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual', 'CVT'],
      default: 'Automatic',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    serviceHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRequest',
      },
    ],
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
