clear
while read line
do
    [ -z "$line" ] && continue

    clear
    node validate.js "$line" --pretty
done
