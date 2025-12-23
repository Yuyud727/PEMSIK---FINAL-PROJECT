const fs = require("fs");
const path = require("path");

const dbfolder = path.join(__dirname, "db");
const outputFile = path.join(__dirname, "db.json");

const files = fs.readdirSync(dbfolder).filter((f) => f.endsWith(".json"));

const combined = {};

for (const file of files) {
  const filePath = path.join(dbfolder, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const filenameKey = path.basename(file, ".json"); // contoh: mahasiswa.json -> mahasiswa

  // Jika format file ialah { mahasiswa: [...] } ambil itu.
  // Kalau format file ialah [...] ambil terus dan guna nama fail sebagai key.
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      combined[keys[0]] = data[keys[0]];
    } else {
      // banyak key dalam satu file: merge semua key sekali
      for (const k of keys) combined[k] = data[k];
    }
  } else {
    combined[filenameKey] = data;
  }
}

fs.writeFileSync(outputFile, JSON.stringify(combined, null, 2));
console.log(`Merged ${files.length} files into db.json`);
