const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_wsOIru8baG3Q@ep-dawn-flower-b54eopa6-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  console.log('Seeding Neon database...');
  
  // Seed trainers
  await pool.query(`
    INSERT INTO trainers (id, name, specialization, availability) 
    VALUES 
      (1, 'Marcus "Viper" Vance', 'HIIT, MetCon & Agility', 'Mon - Fri (06:00 - 14:00)'),
      (2, 'Elena Rostova', 'Powerlifting & Calisthenics', 'Tue - Sat (08:00 - 16:00)'),
      (3, 'Kai Chen', 'Functional Mobility & Flow Yoga', 'Mon - Thu (09:00 - 17:00)'),
      (4, 'Darius "The Hammer"', 'Muay Thai & Boxing', 'Wed - Sun (12:00 - 21:00)')
    ON CONFLICT (id) DO UPDATE SET 
      name = EXCLUDED.name,
      specialization = EXCLUDED.specialization,
      availability = EXCLUDED.availability;
  `);

  // Seed classes
  await pool.query(`
    INSERT INTO classes (id, name, trainer_id, time, capacity, difficulty_level)
    VALUES
      (1, 'Cyber HIIT Inferno', 1, '06:30 AM', 20, 'Advanced'),
      (2, 'Iron Titan Hypertrophy', 2, '08:00 AM', 15, 'Beast'),
      (3, 'Zenith Vinyasa Flow', 3, '10:00 AM', 25, 'Beginner'),
      (4, 'Apex Combat & Strike', 4, '05:30 PM', 16, 'Advanced')
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      trainer_id = EXCLUDED.trainer_id,
      time = EXCLUDED.time,
      capacity = EXCLUDED.capacity,
      difficulty_level = EXCLUDED.difficulty_level;
  `);

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
