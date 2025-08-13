import sys
from datetime import datetime

def logstd (*msg):
    msg = " ".join(msg)
    print (str(datetime.now()) + " - " + msg)
    sys.stdout.flush()

def converter_data(data_string):
    return datetime.strptime(data_string.strip(), '%d/%m/%Y').date()