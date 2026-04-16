import { createApp } from './app.js';
import { testDbConnection } from './config/db.js';
import { env, validateEnv } from './config/env.js';

async function bootstrap() {
  validateEnv(['PORT', 'GEMINI_API_KEY', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']);
  try {
    await testDbConnection();
  } catch (error) {
    console.log('No fue posible conectarse a la base de datos configurada. No se creara ninguna base de datos.');
    console.error(error.message);
    process.exit(1);
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Servidor escuchando en http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('No se pudo iniciar la aplicación:', error);
  process.exit(1);
});
