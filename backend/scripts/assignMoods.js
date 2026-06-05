require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Place = require('../models/Place');

const MOODS_BY_NAME = {
  "Milli Park": "Ailə",
  "Botanika Bağı": "Ailə",
  "Şəki Xan Sarayı": "Romantik",
  "Qəbələ Albaniya Kilsəsi": "Romantik",
  "Qırmızı Qəsəbə": "Dostlarla",
  "Lahıc Kəndi": "Dostlarla",
  "Hirkan Milli Parkı": "Tək",
  "Kürmük Məbədi": "Romantik",
  "Nohur Gölü": "Romantik",
  "Xınalıq Kəndi": "Tək",
  "Kiş Alban Kilsəsi": "Ailə",
  "Qobustan Qaya Rəsmləri": "Ailə",
  "Firuze Restoran": "Romantik",
  "Mugam Club": "Dostlarla",
  "Çay Evi 145": "Tək",
  "Paul Bakery": "Tək",
  "İçərişəhər": "Dostlarla",
  "Qız Qalası": "Romantik",
  "Şirvanşahlar Sarayı": "Romantik",
  "Alov Qüllələri": "Dostlarla",
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const places = await Place.find();
  let updated = 0;

  for (const place of places) {
    const mood = MOODS_BY_NAME[place.name];
    if (mood && place.mood !== mood) {
      place.mood = mood;
      await place.save();
      updated += 1;
      console.log(`✅ ${place.name} → ${mood}`);
    }
  }

  console.log(`\n${updated} yer yeniləndi.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
