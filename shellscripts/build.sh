echo build LivingApps.Javascript.LivingAPI
tsc -p ./tsconfig.json
echo bundle it
rollup -c rollup.config.js