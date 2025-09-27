import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

/** Paths and templates */
export const SERVICES_DIR = 'src/services/prisma';
export const ENTITIES_DIR = SERVICES_DIR + '/entities';
export const PRISMA_SERVICE_PATH = SERVICES_DIR + '/prisma.service.ts';
export const PRISMA_MODULE_PATH = SERVICES_DIR + '/prisma.module.ts';
export const PRISMA_SETUP_PATH = 'prisma/setup';
export const TEMPLATE_PRISMA_SERVICE_PATH = PRISMA_SETUP_PATH + '/prisma-service.template';
export const TEMPLATE_ENTITY_SERVICE_PATH = PRISMA_SETUP_PATH + '/entity-service.template';
export const TEMPLATE_PRISMA_MODULE_PATH = PRISMA_SETUP_PATH + '/prisma-module.template';

/** Interfaces */
export interface EntityConfig {
  names: {
    class: string;
    property: {
      singular: string;
      plural: string;
    };
    file: string;
  };
}

export interface RunOptions {
  entities: EntityConfig[];
  reset?: boolean;
  seed?: boolean;
}

/** Run the setup to generate Prisma service and entity services */
export const run = (options: RunOptions) => {
  const { entities, reset } = options;

  /** Ensure directories exist */
  if (!existsSync(SERVICES_DIR)) mkdirSync(SERVICES_DIR, { recursive: true });
  if (!existsSync(ENTITIES_DIR)) mkdirSync(ENTITIES_DIR, { recursive: true });

  if (reset) {
    /** Remove existing files */
    if (existsSync(PRISMA_SERVICE_PATH)) unlinkSync(PRISMA_SERVICE_PATH);
    const files = readdirSync(ENTITIES_DIR).filter((file) => file.endsWith('.service.ts'));
    for (const file of files) unlinkSync(`${ENTITIES_DIR}/${file}`);
  }

  /** Read templates */
  const prismaServiceTemplate = readFileSync(TEMPLATE_PRISMA_SERVICE_PATH, { encoding: 'utf-8' });
  const prismaModuleTemplate = readFileSync(TEMPLATE_PRISMA_MODULE_PATH, { encoding: 'utf-8' });
  const entityServiceTemplate = readFileSync(TEMPLATE_ENTITY_SERVICE_PATH, { encoding: 'utf-8' });

  /** Write prisma service and module files */
  writeFileSync(PRISMA_SERVICE_PATH, prismaServiceTemplate, { encoding: 'utf-8' });
  writeFileSync(PRISMA_MODULE_PATH, prismaModuleTemplate, { encoding: 'utf-8' });

  for (const entity of entities) {
    /** Write entity service files */
    const entityServiceContent = entityServiceTemplate
      .replace(/__ENTITY_NAME__/g, entity.names.class)
      .replace(/__ENTITY_PROPERTY_NAME__/g, entity.names.property.singular)
      .replace(/__MULTIPLE_ENTITY_PROPERTY_NAME__/g, entity.names.property.plural);

    writeFileSync(`${ENTITIES_DIR}/${entity.names.file}-entity.service.ts`, entityServiceContent, {
      encoding: 'utf-8',
    });
  }
};

// Example usage
// [ ] Find a way to pass entities from Prisma schema or elsewhere
const entities = [
  { names: { class: 'User', property: { singular: 'user', plural: 'users' }, file: 'user' } },
  { names: { class: 'Session', property: { singular: 'session', plural: 'sessions' }, file: 'session' } },
  {
    names: {
      class: 'TwoFactorAuthSetup',
      property: { singular: 'twoFactorAuthSetup', plural: 'twoFactorAuthSetups' },
      file: 'two-factor-auth-setup',
    },
  },
];

run({ entities, reset: true });
