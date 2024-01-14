#!/bin/bash

SOURCE_FILE="src/index.tsx"

SOURCE_FILE_CONTENT=$(cat $SOURCE_FILE)

trap handle_interrupt_signal INT

function handle_interrupt_signal() {
        echo "$SOURCE_FILE_CONTENT" > $SOURCE_FILE
        exit 1
}

sed -i 's/ mockValue={mockValue}//' $SOURCE_FILE

export BUILD_PATH="../src/popup"
react-scripts build

echo "$SOURCE_FILE_CONTENT" > $SOURCE_FILE

sed -i 's/src="\//src="/g' $BUILD_PATH/index.html
sed -i 's/href="\//href="/g' $BUILD_PATH/index.html

sed 's/<link rel="manifest" href="manifest.json"\/>//' index.html 
rm $BUILD_PATH/manifest.json