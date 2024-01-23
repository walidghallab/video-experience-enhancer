#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color
NEW_VERSION=$1

# Args: $1: error message
function print_error() {
    echo >&2 -e "${RED}ERROR: $1${NC}"
}

# Args: $1: notice message
function print_notice() {
    echo >&2 -e "${ORANGE}NOTICE: $1${NC}"
}

# Args: $1: success message
function print_success() {
    echo >&2 -e "${GREEN}SUCCESS: $1${NC}"
}

function exit_gracefully() {
        echo "$SOURCE_FILE_CONTENT" >$SOURCE_FILE
        exit 1
}

function handle_interrupt_signal() {
        print_notice "TERM signal received, terminating gracefully..."
        exit_gracefully
}

# Args: $1: error message
function exit_with_error_if_last_command_failed() {
        if [[ $? != "0" ]]; then
                print_error "$1"
                exit_gracefully
        fi
}

SOURCE_FILE="src/index.tsx"

SOURCE_FILE_CONTENT=$(cat $SOURCE_FILE)
exit_with_error_if_last_command_failed "Failed to backup $SOURCE_FILE"

trap handle_interrupt_signal INT

sed -i 's/ mockValue={mockValue}//' $SOURCE_FILE &&
sed -i 's/const mockValue = getMockValueForChromeContextProps();//' $SOURCE_FILE &&
sed -i 's/import { getMockValueForChromeContextProps.*ChromeContextProps.mock";//' $SOURCE_FILE &&
exit_with_error_if_last_command_failed "Failed to remove mockValue from $SOURCE_FILE"

export BUILD_PATH="../src/popup"
react-scripts build
exit_with_error_if_last_command_failed "Failed to build popup"

echo "$SOURCE_FILE_CONTENT" >$SOURCE_FILE

sed -i 's/<link rel="manifest" href="manifest.json"\/>//' $BUILD_PATH/index.html &&
rm $BUILD_PATH/manifest.json
exit_with_error_if_last_command_failed "Failed to adjust react built files to work as chrome extension"

print_success "Successfully built popup"