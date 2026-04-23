.PHONY: test test.bdd build

test:
	bun test

test.bdd:
	bunx cucumber-js

build:
	bun build src/index.ts --outdir dist
