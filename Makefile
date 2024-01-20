# Default rule.
build:
	@make build-popup
	@make build-content-scripts

test:
	@echo "Running All Tests"
	@make integration-test
	@make unit-test
	
install-popup: popup/.installed.mkf

popup/.installed.mkf: popup/package.json
	@echo "Installing Popup"
	@cd ./popup && npm ci
	@touch popup/.installed.mkf

build-popup: popup/.built.mkf

popup/.built.mkf: $(shell find ./popup -type f -not -ipath "*/node_modules*" -not -path "./popup/.built.mkf" -not -iregex ".*\.test.tsx?")
	@make install-popup
	@echo "Building Popup"
	@cd ./popup && npm run build
	@touch popup/.built.mkf
	
install-integration-tests: integration-tests/.installed.mkf

integration-tests/.installed.mkf: integration-tests/package.json
	@echo "Installing Tests"
	@cd ./integration-tests && npm ci
	@touch integration-tests/.installed.mkf
	
integration-test:
	@make install-integration-tests
	@make build
	@echo "Running Integration Tests"
	@cd ./integration-tests && npm test
	
unit-test:
	@make install-popup
	@echo "Running Unit Tests"
	@cd ./popup && npm run test:without-watch

install-content-scripts: content-scripts/.installed.mkf
	
content-scripts/.installed.mkf: content-scripts/package.json
	@echo "Installing Content Scripts"
	@cd ./content-scripts && npm ci
	@touch content-scripts/.installed.mkf	

build-content-scripts: content-scripts/.built.mkf

content-scripts/.built.mkf: $(shell find ./content-scripts -type f -not -ipath "*/node_modules*" -not -path "./content-scripts/.built.mkf -not -iregex ".*\.test.tsx?"") $(shell find ./popup/src/common -type f -not -iregex ".*\.test.tsx?")
	@make install-content-scripts
	@echo "Building Content Scripts"
	@cd ./content-scripts && npm run build
	@touch content-scripts/.built.mkf
	