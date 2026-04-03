#!/bin/bash

echo "Detected languages:"
find . -type f -name "*.py" | grep -q . && echo "- Python"
find . -type f -name "*.java" | grep -q . && echo "- Java"
find . -type f -name "*.js" | grep -q . && echo "- JavaScript"
find . -type f -name "*.ts" | grep -q . && echo "- TypeScript"

echo "Design patterns detected:" > analysis_report.txt

grep -R "getInstance" . && echo "- Singleton" >> analysis_report.txt
grep -R "create[A-Z]" . && echo "- Factory Method" >> analysis_report.txt
grep -R "notify" . && echo "- Observer" >> analysis_report.txt
grep -R "Strategy" . && echo "- Strategy" >> analysis_report.txt
grep -R "Decorator" . && echo "- Decorator" >> analysis_report.txt

cat analysis_report.txt