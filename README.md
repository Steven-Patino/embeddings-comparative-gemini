# Backend de embeddings con Express

Este proyecto expone una API en Express con arquitectura por capas para:

- recibir una palabra o frase
- generar embeddings con dos modelos de Gemini
- guardar ambos resultados en PostgreSQL
- comparar los embeddings persistidos usando similitud coseno
- mostrar el resultado en una interfaz web simple

## Arquitectura

La estructura principal está organizada así:

```text
src/
  clients/       -> integración con APIs externas
  config/        -> variables de entorno y conexión DB
  controllers/   -> capa HTTP
  middlewares/   -> manejo de errores
  repositories/  -> acceso a datos
  routes/        -> definición de endpoints
  services/      -> reglas de negocio
  utils/         -> utilidades compartidas
  validators/    -> validaciones básicas
```

## Requisitos

- Node.js 18+
- PostgreSQL 13+
- API key de Gemini

## Configuración

1. Crea tu archivo `.env` tomando como base `.env.example`.
2. Configura tus credenciales de PostgreSQL.
3. Ajusta `PRIMARY_EMBEDDING_MODEL`, `SECONDARY_EMBEDDING_MODEL` y `EMBEDDING_DIMENSIONS`.
4. Usa una dimensión común para ambos modelos. Por defecto queda en `1536`.
5. Inicializa la base de datos:

```bash
npm run db:init
```

6. Levanta el servidor:

```bash
npm run dev
```

7. Abre en el navegador:

```text
http://localhost:3000
```

## Endpoints

### Healthcheck

```http
GET /api/health
```

### Crear embeddings y guardarlos

```http
POST /api/embeddings
Content-Type: application/json

{
  "text": "inteligencia artificial"
}
```

### Crear, guardar y comparar en un solo paso

```http
POST /api/embeddings/compare
Content-Type: application/json

{
  "text": "inteligencia artificial"
}
```

Respuesta esperada:

```json
{
  "message": "Embeddings generados, almacenados y comparados correctamente.",
  "data": {
    "requestId": "uuid-del-registro",
    "similarity": 0.8732
  }
}
```

### Listar solicitudes

```http
GET /api/embeddings?limit=20
```

### Obtener una solicitud con sus resultados

```http
GET /api/embeddings/:requestId
```

### Comparar embeddings almacenados

```http
POST /api/comparisons/cosine
Content-Type: application/json

{
  "requestId": "uuid-del-registro"
}
```

## Modelo de datos

`npm run db:init` crea dos tablas:

- `embedding_requests`: guarda el texto original consultado.
- `embedding_results`: guarda un resultado por proveedor/modelo con vector, dimensiones y respuesta cruda.

## Notas

- La base quedó preparada para PostgreSQL porque es una opción sólida para persistencia y futuras comparaciones.
- Los embeddings se almacenan en `JSONB`. Si más adelante quieres búsquedas vectoriales nativas, podemos migrarlo a `pgvector`.
- El proyecto fuerza una dimensión común configurable para los dos modelos mediante `EMBEDDING_DIMENSIONS` para facilitar la comparación coseno.
- El modelo `text-embedding-004` no apareció disponible en la comprobación realizada el 16 de abril de 2026 con la Gemini API `v1beta`; por eso la configuración operativa quedó con `gemini-embedding-001` y `gemini-embedding-2-preview`.
