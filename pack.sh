cd src 
version=`awk 'BEGIN {FS=":|\""} $2 == "version" {print $5; }' manifest.json`
zip $version.zip -r *
cd ..
