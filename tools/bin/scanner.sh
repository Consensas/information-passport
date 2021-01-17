clear

python scanner.py |
while IFS= read -r line
do
	[ -z "$line" ] && continue
    node validate.js "$line" --pretty --clear
done
