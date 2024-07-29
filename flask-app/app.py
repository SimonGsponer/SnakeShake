import os
import logging
import time
import random
import string
from uuid import uuid4

from flask import Flask, jsonify
from psycopg_pool import ConnectionPool
from sqlalchemy import create_engine, inspect
from sqlalchemy import URL, Column, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Session
from sqlalchemy import func


log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

url_object = URL.create(
    "postgresql+psycopg",
    username=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_CONTAINERNAME'],
    port=os.environ['POSTGRES_PORT'],
    database=os.environ['POSTGRES_DB'],
)

engine = create_engine(
    url_object,
    pool_pre_ping=True,
    pool_size=5,
    pool_recycle=3600
)

# declarative base class
class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "accounts"
    user_id = Column(String, primary_key=True)
    username = Column(String, nullable=False, unique=True)

# conn_string = "postgresql://%s:%s@%s:%s/%s" % (
#     os.environ['POSTGRES_USER'],
#     os.environ['POSTGRES_PASSWORD'],
#     "postgresql",
#     '8090',
#     os.environ['POSTGRES_DB']
# )

# pool_pre_ping
# pool_size=5
# pool_recycle=3600

# conn_string = "host=postgresql port=8090 user=postgres dbname=snakeshake_db password=postgress"
#conn_string = "postgresql://postgres_usr:postgres@postgresql:8090/snakeshake_db"
#pool = ConnectionPool(conn_string, open=True)

@app.route("/")
def hello_world():
    time_to_wait = random.randint(1,10)
    time.sleep(time_to_wait)

    res = {
        'message': 'Hello World!',
        'waiting_time': time_to_wait
    }

    return jsonify(res)

@app.route("/tables")
def tables():
    time.sleep(random.randint(1,10))
    inspection = inspect(engine)
    return inspection.get_table_names()


@app.route("/new_user")
def new_user():
    username = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(25))
    new_user = User(
        user_id=uuid4(),
        username=username
    )

    with Session(engine) as session:
        session.add(new_user)
        session.commit()

    res = {
        'user_created': True,
        'username': username
    }

    return jsonify(res)


@app.route("/users")
def get_all_users():

    with Session(engine) as session:
        n_users = session.query(func.count(User.user_id)).scalar() 

    res = {
        'number_of_users': n_users,
    }

    return jsonify(res)


if __name__ == "__main__":
    app.run()