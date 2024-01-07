#!/bin/bash

SOURCE_FILE="src/index.tsx"
BACKUP_FILE="src/index.tsx.bak"

cp $SOURCE_FILE $BACKUP_FILE
sed -i 's/ mockValue={mockValue}//' $SOURCE_FILE

react-scripts build

cp $BACKUP_FILE $SOURCE_FILE
rm $BACKUP_FILE



sed -i 's/src="\//src="/g' build/index.html
sed -i 's/href="\//href="/g' build/index.html