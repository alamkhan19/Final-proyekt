const express = require('express');
const mongoose = require('mongoose');
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Yanlış ID formatı' });
    }
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Tapılmadı' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Yanlış ID formatı' });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;

    let updated = await Place.findByIdAndUpdate(
      objectId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      const result = await Place.updateOne({ _id: objectId }, { $set: updateData });
      if (result.matchedCount > 0) {
        updated = await Place.findById(objectId);
      }
    }

    if (!updated) {
      return res.status(404).json({
        message: `Yer tapılmadı (Axtarılan ID: ${id}). Bazada bu ID-yə malik sənəd yoxdur.`
      });
    }
    res.json(updated);
  } catch (err) {
    console.error("PUT xəta:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Yanlış ID formatı' });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    let deleted = await Place.findByIdAndDelete(objectId);

    if (!deleted) {
      const result = await Place.deleteOne({ _id: objectId });
      if (result.deletedCount > 0) deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Tapılmadı' });
    }

    res.json({ message: 'Silindi ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
