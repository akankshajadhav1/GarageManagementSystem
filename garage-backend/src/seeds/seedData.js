const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const ServiceRequest = require('../models/ServiceRequest');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    await ServiceRequest.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@garage.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create mechanics
    const mechanic1 = await User.create({
      username: 'john_mechanic',
      email: 'john@garage.com',
      password: 'mech123',
      role: 'mechanic',
      phone: '555-0201',
    });

    const mechanic2 = await User.create({
      username: 'mike_mechanic',
      email: 'mike@garage.com',
      password: 'mech123',
      role: 'mechanic',
      phone: '555-0202',
    });

    // Create manager
    const manager = await User.create({
      username: 'sarah_manager',
      email: 'sarah@garage.com',
      password: 'manager123',
      role: 'manager',
      phone: '555-0301',
    });

    // Create receptionist
    await User.create({
      username: 'lisa_reception',
      email: 'lisa@garage.com',
      password: 'recep123',
      role: 'receptionist',
      phone: '555-0401',
    });

    console.log('👤 Created users');

    // Create customers
    const customers = await Customer.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '555-0101',
        address: { street: '123 Main St', city: 'Springfield', state: 'IL', zipCode: '62701' },
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '555-0102',
        address: { street: '456 Oak Ave', city: 'Springfield', state: 'IL', zipCode: '62702' },
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.j@email.com',
        phone: '555-0103',
        address: { street: '789 Pine Rd', city: 'Shelbyville', state: 'IL', zipCode: '62565' },
      },
      {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.w@email.com',
        phone: '555-0104',
        address: { street: '321 Elm St', city: 'Capital City', state: 'IL', zipCode: '62703' },
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.b@email.com',
        phone: '555-0105',
        address: { street: '654 Maple Dr', city: 'Springfield', state: 'IL', zipCode: '62704' },
      },
      {
        firstName: 'Diana',
        lastName: 'Martinez',
        email: 'diana.m@email.com',
        phone: '555-0106',
        address: { street: '987 Cedar Ln', city: 'Shelbyville', state: 'IL', zipCode: '62566' },
      },
      {
        firstName: 'Edward',
        lastName: 'Garcia',
        email: 'edward.g@email.com',
        phone: '555-0107',
        address: { street: '147 Birch Blvd', city: 'Springfield', state: 'IL', zipCode: '62705' },
      },
      {
        firstName: 'Fiona',
        lastName: 'Davis',
        email: 'fiona.d@email.com',
        phone: '555-0108',
        address: { street: '258 Walnut Way', city: 'Capital City', state: 'IL', zipCode: '62706' },
      },
    ]);

    console.log('👥 Created customers');

    // Create vehicles
    const vehicles = await Vehicle.create([
      { licensePlate: 'ABC-1234', make: 'Toyota', model: 'Camry', year: 2022, color: 'Silver', mileage: 25000, fuelType: 'Gasoline', transmission: 'Automatic', customer: customers[0]._id },
      { licensePlate: 'DEF-5678', make: 'Honda', model: 'Civic', year: 2021, color: 'Blue', mileage: 32000, fuelType: 'Gasoline', transmission: 'CVT', customer: customers[0]._id },
      { licensePlate: 'GHI-9012', make: 'Ford', model: 'F-150', year: 2023, color: 'Red', mileage: 12000, fuelType: 'Gasoline', transmission: 'Automatic', customer: customers[1]._id },
      { licensePlate: 'JKL-3456', make: 'BMW', model: '3 Series', year: 2022, color: 'Black', mileage: 18000, fuelType: 'Gasoline', transmission: 'Automatic', customer: customers[2]._id },
      { licensePlate: 'MNO-7890', make: 'Tesla', model: 'Model 3', year: 2023, color: 'White', mileage: 8000, fuelType: 'Electric', transmission: 'Automatic', customer: customers[3]._id },
      { licensePlate: 'PQR-1122', make: 'Chevrolet', model: 'Malibu', year: 2020, color: 'Gray', mileage: 45000, fuelType: 'Gasoline', transmission: 'Automatic', customer: customers[4]._id },
      { licensePlate: 'STU-3344', make: 'Mercedes', model: 'C-Class', year: 2021, color: 'Silver', mileage: 28000, fuelType: 'Diesel', transmission: 'Automatic', customer: customers[5]._id },
      { licensePlate: 'VWX-5566', make: 'Hyundai', model: 'Tucson', year: 2022, color: 'Green', mileage: 20000, fuelType: 'Hybrid', transmission: 'Automatic', customer: customers[6]._id },
      { licensePlate: 'YZA-7788', make: 'Nissan', model: 'Altima', year: 2021, color: 'Blue', mileage: 35000, fuelType: 'Gasoline', transmission: 'CVT', customer: customers[7]._id },
      { licensePlate: 'BCD-9900', make: 'Audi', model: 'A4', year: 2023, color: 'White', mileage: 5000, fuelType: 'Gasoline', transmission: 'Automatic', customer: customers[1]._id },
    ]);

    // Update customers with vehicle references
    for (const vehicle of vehicles) {
      await Customer.findByIdAndUpdate(vehicle.customer, {
        $push: { vehicles: vehicle._id },
      });
    }

    console.log('🚗 Created vehicles');

    // Create service requests with various statuses
    const now = new Date();
    const serviceRequests = await ServiceRequest.create([
      {
        vehicle: vehicles[0]._id, customer: customers[0]._id, description: 'Oil change and tire rotation',
        status: 'completed', priority: 'low', actualCost: 150, assignedMechanic: mechanic1._id,
        completedDate: new Date(now - 7 * 86400000), createdBy: admin._id,
        services: [{ name: 'Oil Change', description: 'Full synthetic oil change', cost: 75, duration: 1 }, { name: 'Tire Rotation', cost: 40, duration: 0.5 }],
        partsUsed: [{ name: 'Synthetic Oil 5W-30', quantity: 5, unitPrice: 7, total: 35 }],
      },
      {
        vehicle: vehicles[1]._id, customer: customers[0]._id, description: 'Brake pad replacement',
        status: 'in_progress', priority: 'high', estimatedCost: 400, assignedMechanic: mechanic1._id,
        estimatedCompletion: new Date(now + 2 * 86400000), createdBy: manager._id,
        services: [{ name: 'Brake Pad Replacement', description: 'Front and rear brake pads', cost: 250, duration: 3 }],
        partsUsed: [{ name: 'Ceramic Brake Pads (Front)', quantity: 1, unitPrice: 80, total: 80 }, { name: 'Ceramic Brake Pads (Rear)', quantity: 1, unitPrice: 70, total: 70 }],
      },
      {
        vehicle: vehicles[2]._id, customer: customers[1]._id, description: 'AC not cooling properly',
        status: 'diagnosing', priority: 'medium', estimatedCost: 300, assignedMechanic: mechanic2._id,
        createdBy: admin._id,
        services: [{ name: 'AC Diagnosis', description: 'Check refrigerant and compressor', cost: 100, duration: 2 }],
      },
      {
        vehicle: vehicles[3]._id, customer: customers[2]._id, description: 'Annual inspection and maintenance',
        status: 'pending', priority: 'low', estimatedCost: 200, createdBy: admin._id,
        services: [{ name: 'Annual Inspection', cost: 100, duration: 1.5 }],
      },
      {
        vehicle: vehicles[4]._id, customer: customers[3]._id, description: 'Battery health check and software update',
        status: 'waiting_parts', priority: 'medium', estimatedCost: 500, assignedMechanic: mechanic2._id,
        createdBy: manager._id,
        services: [{ name: 'Battery Diagnostic', cost: 150, duration: 1 }, { name: 'Software Update', cost: 100, duration: 0.5 }],
      },
      {
        vehicle: vehicles[5]._id, customer: customers[4]._id, description: 'Engine sputtering at idle',
        status: 'in_progress', priority: 'urgent', estimatedCost: 800, assignedMechanic: mechanic1._id,
        createdBy: admin._id,
        services: [{ name: 'Engine Diagnostic', cost: 150, duration: 2 }, { name: 'Spark Plug Replacement', cost: 120, duration: 1 }],
        partsUsed: [{ name: 'Spark Plugs (Set of 4)', quantity: 1, unitPrice: 60, total: 60 }],
      },
      {
        vehicle: vehicles[6]._id, customer: customers[5]._id, description: 'Transmission fluid change',
        status: 'completed', priority: 'medium', actualCost: 280, assignedMechanic: mechanic2._id,
        completedDate: new Date(now - 14 * 86400000), createdBy: admin._id,
        services: [{ name: 'Transmission Fluid Change', cost: 180, duration: 2 }],
        partsUsed: [{ name: 'ATF Fluid', quantity: 8, unitPrice: 12.5, total: 100 }],
      },
      {
        vehicle: vehicles[7]._id, customer: customers[6]._id, description: 'Hybrid system warning light on',
        status: 'diagnosing', priority: 'high', estimatedCost: 600, assignedMechanic: mechanic1._id,
        createdBy: manager._id,
        services: [{ name: 'Hybrid System Diagnostic', cost: 200, duration: 3 }],
      },
      {
        vehicle: vehicles[0]._id, customer: customers[0]._id, description: 'Windshield wiper replacement',
        status: 'completed', priority: 'low', actualCost: 45, assignedMechanic: mechanic2._id,
        completedDate: new Date(now - 30 * 86400000), createdBy: admin._id,
        services: [{ name: 'Wiper Replacement', cost: 15, duration: 0.25 }],
        partsUsed: [{ name: 'Wiper Blades (Pair)', quantity: 1, unitPrice: 30, total: 30 }],
      },
      {
        vehicle: vehicles[8]._id, customer: customers[7]._id, description: 'Alignment and balancing',
        status: 'pending', priority: 'medium', estimatedCost: 150, createdBy: admin._id,
        services: [{ name: 'Wheel Alignment', cost: 80, duration: 1 }, { name: 'Tire Balancing', cost: 40, duration: 0.5 }],
      },
    ]);

    // Update vehicles with service history
    for (const sr of serviceRequests) {
      await Vehicle.findByIdAndUpdate(sr.vehicle, {
        $push: { serviceHistory: sr._id },
      });
    }

    console.log('🔧 Created service requests');
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin:        admin@garage.com / admin123');
    console.log('   Manager:      sarah@garage.com / manager123');
    console.log('   Mechanic:     john@garage.com / mech123');
    console.log('   Receptionist: lisa@garage.com / recep123');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// Run seed if executed directly
if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garageDB')
    .then(() => {
      console.log('Connected to MongoDB');
      return seedDatabase();
    })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
