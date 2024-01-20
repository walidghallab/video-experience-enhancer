#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

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

ZIPPED_FILE_NAME="video-experience-enhancer.zip"

cd .. && make && rm -f $ZIPPED_FILE_NAME && zip -r $ZIPPED_FILE_NAME src && mv $ZIPPED_FILE_NAME hack

if [[ $? != "0" ]]; then
    print_error "Failed to zip the extension"
    exit 1
fi

print_success 'The extension has been zipped successfully'