const Vendor = require('../models/Vendor');

exports.createVendor = async (req, res) => {
  try {
    const { name, description, location, county, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: 'Vendor name and user ID are required' });
    }

    const vendor = await Vendor.create({ name, description, location, county, userId });

    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.submitClaim = async (req, res) => {
  try {
    const { vendorId, userId } = req.body;

    if (!vendorId || !userId) {
      return res.status(400).json({ error: 'Vendor ID and User ID are required' });
    }

    res.status(200).json({ message: 'Claim request submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const { claimId } = req.body;

    if (!claimId) {
      return res.status(400).json({ error: 'Claim ID is required' });
    }

    res.status(200).json({ message: 'Claim approved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


