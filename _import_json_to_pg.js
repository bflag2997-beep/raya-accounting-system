// Import existing JSON data into PostgreSQL
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost', port: 5432, database: 'raya_db',
  user: 'postgres', password: 'Ihsaan.1997@@'
});

const data = JSON.parse(fs.readFileSync('D:/raya_data/raya_data.json', 'utf8'));

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users
    if (data.usersDb && data.usersDb.length) {
      for (const u of data.usersDb) {
        await client.query(
          `INSERT INTO app_users (id, username, pass, full_name, role, perms, last_login)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (id) DO UPDATE SET username=EXCLUDED.username, pass=EXCLUDED.pass,
             full_name=EXCLUDED.full_name, role=EXCLUDED.role, perms=EXCLUDED.perms`,
          [u.id, u.username, u.pass, u.name||u.full_name, u.role, JSON.stringify(u.perms||{}), null]
        );
      }
      console.log('Users imported:', data.usersDb.length);
    }

    // Suppliers
    if (data.suppliers && data.suppliers.length) {
      for (const s of data.suppliers) {
        await client.query(
          `INSERT INTO suppliers (id, code, name, account_code, phone, city, balance, notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, code=EXCLUDED.code,
             account_code=EXCLUDED.account_code, phone=EXCLUDED.phone, city=EXCLUDED.city,
             balance=EXCLUDED.balance, notes=EXCLUDED.notes`,
          [s.id, s.code||null, s.name, s.accountCode||null, s.phone||null, s.city||null, parseFloat(s.balance||0), s.notes||null]
        );
      }
      console.log('Suppliers imported:', data.suppliers.length);
    }

    // Perm Modules
    if (data.permMods && data.permMods.length) {
      for (const p of data.permMods) {
        await client.query(
          `INSERT INTO perm_modules (key, label, sort_order)
           VALUES ($1,$2,$3)
           ON CONFLICT (key) DO UPDATE SET label=EXCLUDED.label, sort_order=EXCLUDED.sort_order`,
          [p.key, p.label, p.sort||0]
        );
      }
      console.log('Perm modules imported:', data.permMods.length);
    }

    // Customers
    if (data.customers && data.customers.length) {
      for (const c of data.customers) {
        await client.query(
          `INSERT INTO customers (id, code, name, account_code, phone, city, debt, notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, code=EXCLUDED.code,
             account_code=EXCLUDED.account_code, phone=EXCLUDED.phone, city=EXCLUDED.city,
             debt=EXCLUDED.debt, notes=EXCLUDED.notes`,
          [c.id, c.code||null, c.name, c.accountCode||null, c.phone||null, c.city||null, parseFloat(c.debt||0), c.notes||null]
        );
      }
      console.log('Customers imported:', data.customers.length);
    }

    // Journal entries
    if (data.journal && data.journal.length) {
      for (const j of data.journal) {
        await client.query(
          `INSERT INTO journal_entries (id, entry_date, journal, ref, customer, customer_id, supplier, supplier_id, entry_type, method, narration, lines)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
           ON CONFLICT (id) DO NOTHING`,
          [j.id, j.date||j.entry_date, j.journal||null, j.ref||null, j.customer||null, j.customerId||j.customer_id||null,
           j.supplier||null, j.supplierId||j.supplier_id||null, j.type||j.entry_type||null, j.method||null, j.narration||null,
           JSON.stringify(j.lines||[])]
        );
      }
      console.log('Journal entries imported:', data.journal.length);
    }

    await client.query('COMMIT');
    console.log('\nAll data imported to PostgreSQL successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Import failed:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
