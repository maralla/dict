import re
import settings

from mongokit import (
    Document,
    Connection,
    Database
)


def word_validator(value):
    word = re.compile(r'^[-A-Za-z0-9_]+(?: +[-A-Za-z0-9_]+)*$')
    return bool(word.match(value))


class Word(Document):
    structure = {
        'word': basestring,
        'content': basestring,
        'related': basestring,
        'word_info': {
            'word_class': basestring,
            'phonetic': unicode,
            'definition': [{
                'explain': basestring,
                'example': [basestring],
            }],
        },
    }

    required = ['word']
    validators = {
        'word': word_validator,
    }

conn = Connection(host=settings.HOST, port=int(settings.PORT))
conn.register([Word])
#db = Database(conn, 't')
db = Database(conn, 'dictionary')
#db.authenticate('admin', 'fk5es-3PTd8c')
