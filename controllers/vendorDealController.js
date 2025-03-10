const VendorDeal = require('../models/VendorDeal');
const winston = require('winston');
const QRCode = require('qrcode');

exports.createDeal = async (req, res) => {
  try {
    const { vendorId, locationIds, description, startDate, endDate, qrCodeRequired } = req.body;
    const deal = await VendorDeal.create({
      vendorId,
      locationId: locationIds[0],
      validLocations: locationIds,
      description,
      startDate,
      endDate,
      active: false,
      qrCodeRequired,
      qrCodeExpiration: endDate
    });
    res.json({ message: 'Deal created successfully', deal });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error creating deal', details: error.message });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const { dealId } = req.params;
    const deal = await VendorDeal.findByPk(dealId);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    if (!deal.qrCodeRequired) return res.status(400).json({ error: 'QR code not required for this deal' });

    const qrCodeData = `deal:${deal.id}:locations:${deal.validLocations.join(',')}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    res.json({ qrCodeImage, expiration: deal.qrCodeExpiration, validLocations: deal.validLocations });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error generating QR code', details: error.message });
  }
};

exports.validateQRCode = async (req, res) => {
  try {
    const { qrCodeData, scannedLocationId } = req.body;
    if (!qrCodeData.startsWith('deal:')) return res.status(400).json({ error: 'Invalid QR code' });

    const parts = qrCodeData.split(':');
    const dealId = parts[1];
    const validLocationIds = parts[3].split(',');

    if (!validLocationIds.includes(scannedLocationId)) {
      return res.status(400).json({ error: 'QR code is not valid for this location' });
    }

    const deal = await VendorDeal.findByPk(dealId);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    if (new Date() > new Date(deal.qrCodeExpiration)) return res.status(400).json({ error: 'QR code has expired' });

    res.json({ message: 'QR code is valid for this deal at this location', deal });
  } catch (error) {
    winston.error(error.message);
    res.status(500).json({ error: 'Error validating QR code', details: error.message });
  }
};
