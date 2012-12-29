from flask import Flask
from mongokit import Connection, Database
from documents import Word
import os

app = Flask(__name__)

URL = 'http://oaadonline.oxfordlearnersdictionaries.com'
HOST = os.environ['OPENSHIFT_MONGODB_DB_HOST']
PORT = os.environ['OPENSHIFT_MONGODB_DB_PORT']
#HOST = 'localhost'
#PORT = 27017

app.config.from_object(__name__)
connection = Connection(host=HOST, port=int(PORT))
connection.register([Word])
db = Database(connection, 't')
#db = Database(connection, 'dictionary')
db.authenticate('admin', 'fk5es-3PTd8c')

import views
