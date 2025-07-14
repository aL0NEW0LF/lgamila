import { join } from 'node:path';
import { logger } from '@/lib/logger';

async function runScript() {
  const scriptName = process.argv[2];

  if (!scriptName) {
    logger.error('Please provide a script name as an argument');
    process.exit(1);
  }

  try {
    const scriptPath = join(import.meta.dir, `${scriptName}.ts`);
    const script = await import(scriptPath);

    if (typeof script.default !== 'function') {
      logger.error(
        `Script ${scriptName}.ts does not have a default export function`
      );
      process.exit(1);
    }

    await script.default();
  } catch (error) {
    logger.withError(error).error(`Failed to run script ${scriptName}.ts`);
    process.exit(1);
  }
}

runScript();
