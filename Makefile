PACKAGE = requests
NODEJS = $(if $(shell test -f /usr/bin/nodejs && echo "true"),nodejs,node)
CWD := $(shell pwd)
MOCHA = $(CWD)/node_modules/mocha/bin/mocha
UGLIFY = $(CWD)/node_modules/uglify-js/bin/uglifyjs
NODELINT = $(CWD)/node_modules/nodelint/nodelint

BUILDDIR = build

all: clean test build

build: $(wildcard  lib/*.js)
	mkdir -p $(BUILDDIR)
	$(UGLIFY) lib/requests.js > $(BUILDDIR)/requests.min.js

test:
	$(MOCHA) -R spec  --recursive test

clean:
	rm -rf $(BUILDDIR)

lint:
	$(NODELINT) --config nodelint.cfg lib/requests.js

.PHONY: test build all
