#!/bin/bash

SOURCE_FILE="src/index.tsx"
BACKUP_FILE="src/index.tsx.bak"

cp $SOURCE_FILE $BACKUP_FILE
sed -i 's/ mockValue={mockValue}//' $SOURCE_FILE

export BUILD_PATH="../src/popup"
react-scripts build

cp $BACKUP_FILE $SOURCE_FILE
rm $BACKUP_FILE



sed -i 's/src="\//src="/g' $BUILD_PATH/index.html
sed -i 's/href="\//href="/g' $BUILD_PATH/index.html