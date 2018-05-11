echo build LivingApps.Javascript.LivingAPI
tsc -p ./tsconfig.json & 
tsc -p ./tsconfig.umd.json
echo copy modules
cp -R ./src/modules ./dist/es2015/
cp -R ./src/modules ./dist/umd/