.PHONY: test build

test:
	bun test

build:
	bun build src/index.ts --outdir dist
