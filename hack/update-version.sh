#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
newVersion=$1

# Args: $1: error message
function print_error() {
    echo >&2 -e "${RED}ERROR: $1${NC}"
}

# Args: $1: success message
function print_success() {
    echo >&2 -e "${GREEN}SUCCESS: $1${NC}"
}

if [[ ! $PWD == *hack ]]; then
    print_error 'You must run this script from the hack directory'
    exit 1
fi

if [[ $newVersion == "" ]]; then
    print_error 'You must specify the new version as the first argument'
    exit 1
fi

# Args: $1: file, $2: new version
function updateVersion() {
    FILEPATH=$1
    if [[ ! -f $FILEPATH ]]; then
        print_error "File $FILEPATH does not exist"
        exit 1
    fi
    NEW_VERSION=$2
    if [[ $NEW_VERSION == "" ]]; then
        print_error "New version is empty"
        exit 1
    fi
    sed -i "0,/\"version\": \".*\"/s//\"version\": \"$NEW_VERSION\"/" $FILEPATH
    if [[ $? != "0" ]]; then
        print_error "Failed to update version in $FILEPATH"
        exit 1
    fi
}

updateVersion ../src/manifest.json $newVersion
updateVersion ../content-scripts/package.json $newVersion
updateVersion ../content-scripts/package-lock.json $newVersion
updateVersion ../integration-tests/package.json $newVersion
updateVersion ../integration-tests/package-lock.json $newVersion
updateVersion ../popup/package.json $newVersion
updateVersion ../popup/package-lock.json $newVersion

print_success 'All versions have been updated successfully'