cd ../licenca-be
bash run_server.sh 
cd ../licenca-fe
bash run_server.sh
open -n -a /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir="/tmp/ChromeDevSession" http://localhost:8000/licenca.html
