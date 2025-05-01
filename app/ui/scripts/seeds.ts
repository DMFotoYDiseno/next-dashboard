import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { config } from 'dotenv'; // Importa dotenv para cargar variables de entorno

// Carga las variables de entorno desde .env (si usas un archivo .env localmente)
config();

// Define las funciones seed (seedUsers, seedInvoices, etc.) aquí
// ... (copia las funciones seedUsers, seedInvoices, seedCustomers, seedRevenue de tu route.ts) ...
// Asegúrate de que acepten 'sql' como argumento

async function main() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('Error: POSTGRES_URL environment variable is not set.');
    process.exit(1); // Salir si la variable no está definida
  }

  let sql: postgres.Sql | null = null;
  try {
    // Conecta a la base de datos
    sql = postgres(connectionString, { ssl: 'require' });

    console.log('Seeding database...');
    // Usa una transacción y pasa la instancia 'sql' a las funciones seed
    await sql.begin(async (sql) => {
        await seedUsers(sql);
        await seedCustomers(sql);
        await seedInvoices(sql);
        await seedRevenue(sql);
    });
    console.log('Database seeding completed successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Salir con error
  } finally {
    // Asegúrate de cerrar la conexión si se abrió
    if (sql) {
      await sql.end().catch(console.error);
      console.log('Database connection closed.');
    }
  }
}

// Llama a la función principal para ejecutar el script
main();
