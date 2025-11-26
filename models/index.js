import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// baca config.json secara manual
const configPath = path.resolve(__dirname, '../config/config.json');
const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = configFile[env];

const db = {};
let sequelize;

// inisialisasi Sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// otomatis import semua file model di folder ini
const files = fs.readdirSync(__dirname).filter(file =>
  file.indexOf('.') !== 0 && file !== basename && file.endsWith('.js')
);

for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const { default: modelDefiner } = await import(`file://${modelPath}`);
  const model = modelDefiner(sequelize, DataTypes);
  db[model.name] = model;
}

// setup relasi antar model
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
