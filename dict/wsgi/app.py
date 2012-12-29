from flask import Flask
from mongokit import Connection
from documents import Word

URL = 'http://oaadonline.oxfordlearnersdictionaries.com'
HOST = 'localhost'
PORT = 27017

app = Flask(__name__)
app.config.from_object(__name__)
connection = Connection(host=app.config['HOST'], port=app.config['PORT'])
connection.register([Word])

import views
