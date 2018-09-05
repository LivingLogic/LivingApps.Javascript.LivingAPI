rm -Rf ./dist
echo build LivingApps.Javascript.LivingAPI
./node_modules/typescript/bin/tsc
wait
echo copy modules
cp -R ./src/modules ./dist/es2015/
echo run rollup
./node_modules/rollup/bin/rollup -c
echo copy d.ts file
cp ./dist/es2015/livingsdk.d.ts ./dist/umd/livingsdk.d.ts