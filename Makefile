# Default rule.
build:
	@make build-popup
	@make build-content-scripts
.PHONY: build

test:
	@echo "Running All Tests"
	@make integration-test
	@make unit-test
.PHONY: test

install-popup: popup/.installed.mkf
.PHONY: install-popup

popup/.installed.mkf: popup/package.json
	@echo "Installing Popup"
	@cd ./popup && npm ci
	@touch popup/.installed.mkf

build-popup: popup/.built.mkf
.PHONY: build-popup

popup/.built.mkf: $(shell find ./popup -type f -not -ipath "*/node_modules*" -not -path "./popup/.built.mkf" -not -iregex ".*\.test.tsx?")
	@make install-popup
	@echo "Building Popup"
	@cd ./popup && npm run build
	@touch popup/.built.mkf
	
install-integration-tests: integration-tests/.installed.mkf
.PHONY: install-integration-tests

integration-tests/.installed.mkf: integration-tests/package.json
	@echo "Installing Tests"
	@cd ./integration-tests && npm ci
	@touch integration-tests/.installed.mkf
	
integration-test:
	@make install-integration-tests
	@make build
	@echo "Running Integration Tests"
	@cd ./integration-tests && npm test
.PHONY: integration-test

unit-test:
	@make install-popup
	@make install-content-scripts
	@echo "Running Unit Tests"
	@cd ./popup && npm run test:no-watch
	@cd ./content-scripts && npm run test:no-watch
.PHONY: unit-test

install-content-scripts: content-scripts/.installed.mkf
.PHONY: install-content-scripts

content-scripts/.installed.mkf: content-scripts/package.json
	@echo "Installing Content Scripts"
	@cd ./content-scripts && npm ci
	@touch content-scripts/.installed.mkf	

build-content-scripts: content-scripts/.built.mkf
.PHONY: build-content-scripts

content-scripts/.built.mkf: $(shell find ./content-scripts -type f -not -ipath "*/node_modules*" -not -path "./content-scripts/.built.mkf" -not -iregex ".*\.test.tsx?") $(shell find ./popup/src/common -type f -not -iregex ".*\.test.tsx?")
	@make install-content-scripts
	@echo "Building Content Scripts"
	@cd ./content-scripts && npm run build
	@touch content-scripts/.built.mkf
	