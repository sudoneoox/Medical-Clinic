#!/bin/bash

DIR="."

# Get all files matching the pattern NNNN_*.sql
files=($(ls $DIR/[0-9][0-9][0-9][0-9]_*.sql | sort))

counter=0

for file in "${files[@]}"; do
    new_num=$(printf "%04d" $counter)
    
    suffix=$(echo "$file" | sed 's/^.*\/[0-9]\{4\}_//')
    
    new_name="${DIR}/${new_num}_${suffix}"
    
    # Rename the file if the name would change
    if [ "$file" != "$new_name" ]; then
        mv "$file" "$new_name"
        echo "Renamed $file to $new_name"
    fi
    
    ((counter++))
done

echo "File renaming finished"