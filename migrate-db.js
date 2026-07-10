const mysql = require('mysql2/promise');
const { Client } = require('pg');

// Database configurations
const mysqlConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'DigitalSolutionsDB@108',
    database: 'ecommerce'
};

const pgConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'ecommerce'
};

// Tables to migrate (ordered to respect relations as much as possible, though constraints will be disabled)
const tables = [
    'users',
    'admin_users',
    'categories',
    'products',
    'product_variants',
    'product_images',
    'addresses',
    'orders',
    'order_items',
    'payments',
    'shipments',
    'refresh_tokens',
    'password_reset_tokens',
    'gallery_images',
    'cms_pages',
    'settings',
    'banners',
    'testimonials',
    'blog_posts'
];

async function migrate() {
    console.log('Starting migration from MySQL to PostgreSQL...');
    
    // Connect to MySQL
    const mysqlConn = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL.');

    // Connect to PostgreSQL
    const pgClient = new Client(pgConfig);
    await pgClient.connect();
    console.log('Connected to PostgreSQL.');

    try {
        // Disable triggers/foreign keys validation in PostgreSQL for this session
        console.log('Temporarily disabling constraints in PostgreSQL...');
        await pgClient.query("SET session_replication_role = 'replica';");

        for (const table of tables) {
            console.log(`\n----------------------------------------`);
            console.log(`Migrating table: ${table}...`);

            // 1. Fetch data from MySQL
            const [rows] = await mysqlConn.query(`SELECT * FROM \`${table}\``);
            console.log(`Fetched ${rows.length} rows from MySQL.`);

            // 2. Clear PostgreSQL table
            await pgClient.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
            console.log(`Truncated target table "${table}" in PostgreSQL.`);

            if (rows.length === 0) {
                console.log(`No rows to insert for "${table}".`);
                continue;
            }

            // 3. Build parameterized insert query for PostgreSQL
            const columns = Object.keys(rows[0]);
            const colNamesStr = columns.map(c => `"${c}"`).join(', ');
            
            // Migrate rows
            let insertedCount = 0;
            for (const row of rows) {
                const values = [];
                const valuePlaceholders = [];
                
                columns.forEach((col, idx) => {
                    let val = row[col];
                    // Handle buffer type
                    if (val && typeof val === 'object' && val.type === 'Buffer') {
                        val = Buffer.from(val.data);
                    }
                    values.push(val);
                    valuePlaceholders.push(`$${idx + 1}`);
                });

                const insertQuery = `INSERT INTO "${table}" (${colNamesStr}) VALUES (${valuePlaceholders.join(', ')})`;
                await pgClient.query(insertQuery, values);
                insertedCount++;
            }
            console.log(`Successfully inserted ${insertedCount} rows into PostgreSQL table "${table}".`);

            // 4. Update the sequence value so future auto-generated IDs don't collide
            const seqNameResult = await pgClient.query(`
                SELECT pg_get_serial_sequence($1, 'id') AS seq_name
            `, [table]);
            
            const seqName = seqNameResult.rows[0].seq_name;
            if (seqName) {
                await pgClient.query(`
                    SELECT setval($1, COALESCE((SELECT MAX("id") FROM "${table}"), 1), true)
                `, [seqName]);
                console.log(`Reset sequence "${seqName}" to maximum primary key value.`);
            }
        }

        console.log(`\n----------------------------------------`);
        console.log('All tables migrated successfully!');

    } catch (err) {
        console.error('Migration failed with error:', err);
    } finally {
        // Re-enable foreign key checks
        console.log('Restoring constraints in PostgreSQL...');
        await pgClient.query("SET session_replication_role = 'origin';");

        // Close connections
        await mysqlConn.end();
        await pgClient.end();
        console.log('Database connections closed.');
    }
}

migrate();
