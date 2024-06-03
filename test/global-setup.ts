import 'tsconfig-paths/register';
import { startApp } from '#test/e2e/e2e-helper';
import datasource from '#config/ormconfig';

export default async () => {
  console.log('Starting nestapp and datasource...');
  const app = await startApp();
  if (!datasource.isInitialized) {
    await datasource.initialize();
  }
  global.app = app;
  global.datasource = datasource;
};
