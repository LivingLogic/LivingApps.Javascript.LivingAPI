echo build LivingApps.Javascript.LivingAPI
tsc -p ./tsconfig.json & 
tsc -p ./tsconfig.cjs.json
echo bundle it
rollup -c rollup.config.js