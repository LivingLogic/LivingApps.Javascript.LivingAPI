rm -Rf ./dist
echo build LivingApps.Javascript.LivingAPI
tsc -p ./config/tsconfig.es2015.json & 
tsc -p ./tsconfig.json
wait
echo copy modules
cp -R ./src/modules ./dist/es2015/
cp -R ./src/modules ./dist/umd/
echo finished copying