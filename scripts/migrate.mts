import payload from 'payload';
import config from '../payload.config.ts';

await payload.init({
  config,
  disableDBConnect: false,
  disableOnInit: true,
});

await (payload.db as any).migrate();

console.log('Migrations complete');
process.exit(0);
