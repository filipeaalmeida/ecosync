pkill -f 5000
sleep 2
source env/bin/activate
gunicorn -w 4 -b 127.0.0.1:5000 --reload api:app >> run_server.sh.log 2>> run_server.sh.log &
