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

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log("PUT ID:", id);
    
    const updateData = { ...req.body };
    delete updateData._id;

    let updated = await Place.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: false }
    );

    if (!updated) {
      console.log("Mongoose findByIdAndUpdate tapmadı, raw update yoxlanılır...");
      const updateResult = await Place.collection.updateOne(
        { _id: id },
        { $set: updateData }
      );
      if (updateResult.matchedCount > 0) {
        updated = await Place.collection.findOne({ _id: id });
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
    let deleted = await Place.findByIdAndDelete(id);
    
    if (!deleted) {
      console.log("Mongoose findByIdAndDelete tapmadı, raw delete yoxlanılır...");
      const deleteResult = await Place.collection.deleteOne({ _id: id });
      if (deleteResult.deletedCount > 0) {
        deleted = true;
      }
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