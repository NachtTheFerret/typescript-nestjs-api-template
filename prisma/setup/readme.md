# How that works?

This folder contains the Prisma setup for the project. It includes a script that generates the Prisma service and all entity services for seamless integration with NestJS. See `run.ts` for more details.

## Variables

- SERVICES_DIR: Directory where the Prisma services will be generated (`src/services/prisma`).
- ENTITIES_DIR: Directory for entity-specific services (`src/services/prisma/entities`).
- PRISMA_SERVICE_PATH: Path for the main Prisma service file (`src/services/prisma/prisma.service.ts`).
- PRISMA_SETUP_PATH: Path to the setup directory (`prisma/setup`).
- TEMPLATE_PRISMA_SERVICE_PATH: Path to the Prisma service template file (`prisma/setup/prisma-service.template`).
- TEMPLATE_ENTITY_SERVICE_PATH: Path to the entity service template file (`prisma/setup/entity-service.template`).

> This script can be integrated into your build or setup process to ensure that your Prisma services are always up-to-date with your schema and entities.
