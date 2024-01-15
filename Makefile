# Default rule.
build:
	@make build-popup
	@make build-content-scripts

test:
	@echo "Running All Tests"
	@make integration-tests
	@make unit-tests
	
install-popup: popup/.installed.mkf

popup/.installed.mkf: popup/package.json
	@echo "Installing Popup"
	@cd ./popup && npm ci
	@touch popup/.installed.mkf

build-popup: popup/.built.mkf

popup/.built.mkf: $(shell find ./popup -type f -not -ipath "*/node_modules*" -not -path "./popup/.built.mkf")
	@make install-popup
	@echo "Building Popup"
	@cd ./popup && npm run build
	@touch popup/.built.mkf
	
install-tests: tests/.installed.mkf

tests/.installed.mkf: tests/package.json
	@echo "Installing Tests"
	@cd ./tests && npm ci
	@touch tests/.installed.mkf
	
integration-tests:
	@make install-tests
	@make build
	@echo "Running Integration Tests"
	@cd ./tests && npm test
	
unit-tests:
	@make install-popup
	@echo "Running Unit Tests"
	@cd ./popup && npm test

install-content-scripts: content-scripts/.installed.mkf
	
content-scripts/.installed.mkf: content-scripts/package.json
	@echo "Installing Content Scripts"
	@cd ./content-scripts && npm ci
	@touch content-scripts/.installed.mkf	

build-content-scripts: content-scripts/.built.mkf

content-scripts/.built.mkf: $(shell find ./content-scripts -type f -not -ipath "*/node_modules*" -not -path "./content-scripts/.built.mkf")
	@make install-content-scripts
	@echo "Building Content Scripts"
	@cd ./content-scripts && npm run build
	@touch content-scripts/.built.mkf
	