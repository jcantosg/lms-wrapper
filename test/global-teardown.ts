export default async () => {
  console.log('Closing nestapp and datasource...');
  await global.datasource.destroy();
  await global.app.close();
  process.exit();
};
