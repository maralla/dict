from mongokit import Document
import re

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
