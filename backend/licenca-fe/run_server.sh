pkill -f http.server
sleep 2
python3 -m http.server >> run_server.sh.log 2>> run_server.sh.log &
