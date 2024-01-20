#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
NEW_VERSION=$1

# Args: $1: error message
function print_error() {
    echo >&2 -e "${RED}ERROR: $1${NC}"
}

# Args: $1: success message
function print_success() {
    echo >&2 -e "${GREEN}SUCCESS: $1${NC}"
}

PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$PARENT_PATH"

if [[ $NEW_VERSION == "" ]]; then
    print_error 'You must specify the new version as the first argument'
    exit 1
fi

# Args: $1: file, $2: new version
function updateVersion() {
    filePath=$1
    if [[ ! -f $filePath ]]; then
        print_error "File $filePath does not exist"
        exit 1
    fi
    newVersion=$2
    if [[ $newVersion == "" ]]; then
        print_error "New version is empty"
        exit 1
    fi
    sed -i "0,/\"version\": \".*\"/s//\"version\": \"$newVersion\"/" $filePath
    if [[ $? != "0" ]]; then
        print_error "Failed to update version in $filePath"
        exit 1
    fi
}

# Args: $1: error message
function exit_with_error_if_last_command_failed() {
    if [[ $? != "0" ]]; then
        print_error "$1"
        exit 1
    fi
}

updateVersion ../src/manifest.json $NEW_VERSION

updateVersion ../content-scripts/package.json $NEW_VERSION
cd ../content-scripts && npm i && cd -
exit_with_error_if_last_command_failed "Failed to update content-scripts package-lock.json"

updateVersion ../integration-tests/package.json $NEW_VERSION
cd ../integration-tests && npm i && cd -
exit_with_error_if_last_command_failed "Failed to update integration-tests package-lock.json"

updateVersion ../popup/package.json $NEW_VERSION
cd ../popup && npm i && cd -
exit_with_error_if_last_command_failed "Failed to update popup package-lock.json"

print_success 'All versions have been updated successfully'
