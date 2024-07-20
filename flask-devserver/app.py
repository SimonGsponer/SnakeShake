import logging
import time
import random

from flask import Flask

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

@app.route("/")
def hello_world():
    time.sleep(random.randint(1,10))
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run()