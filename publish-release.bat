del LambdaPackage.zip
cd "src"
"C:\Program Files\7-Zip\7z" a -r ..\LambdaPackage.zip * -x!.git
cd ..
aws lambda update-function-code --function-name alexa-skill-haltestelle-weststrasse-chemnitz --zip-file fileb://LambdaPackage.zip