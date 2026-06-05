const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  console.log("Gələn data:", req.body);
  try {
    const place = new Place(req.body);
    const newPlace = await place.save();
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Tapılmadı' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Silindi ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;