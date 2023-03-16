# How to release a new LivingAPI version


## Requirements

This project uses "git flow", so to be able to properly create releases you
have to execute `git flow init` once.

Also you need to have `npm` installed, and you need to have run `npm install`
once.


## During development

Document changes in `CHANGELOG.md`. Ideally this is done during development.
If not, do a diff against the last released version and document the changes
you see.


## Preparing for a release

1.	When the time comes for a release, open a release branch like this:

	```
	git flow release start x.y.z
	```

	(using the correct version number).

2. Bump the version number in `package.json`. Since the version number is
	incorporated into the generated source and the generated source is checked
	in, you have to build the release files, after you update the version number
	like this:
	
	```
	npm run build
	```
	
	This should rebuild `dist/umd/livingapi.js`, `dist/umd/livingapi.js.map`,
	`dist/esm-node/livingapi.js`, `dist/esm-node/livingapi.js.map`,
	`dist/esm-static/livingapi.js` and `dist/esm-static/livingapi.js.map`.

3.	Update UL4 and LivingAPI version number in the example code in `README.md`.

4. Check in the resulting changes.

5.	Close the release branch with the following command:

	```
	git flow release finish x.y.z
	```

	(using the same version number that you used in step 1).

6.	Push all changes to the internal Gitlab instance with:

	```
	git push --all
	```

	The internal Gitlab instance will automatically mirror what you pushed to
	`github.com`.


## Releasing the new version on `npmjs.org`

To push the finish release to `npmjs.org` do the following:

```
npm publish --access public
```

The release should be visible at https://www.npmjs.com/package/@livinglogic/livingapi
after this.
