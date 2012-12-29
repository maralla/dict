from threading import Thread
from lxml.html import tostring
from app import connection
import re

def polish(st):
    return re.sub('\s+', ' ', st)

class DocParseThread(Thread):
    def __init__(self, contentdoc, contentstr, related, *args, **kargs):
        self.contentdoc = contentdoc
        self.contentstr = contentstr
        self.related = related
        Thread.__init__(self, *args, **kargs)

    def run(self):
        word = self.contentdoc.xpath("div[@class='entry']")
        word = polish(word[0].attrib['id']).strip()

        word_class = self.contentdoc.xpath("div//div[@class='top-container']"
                                           "//span[@class='pos']")
        word_class = ','.join(polish(tostring(w)).strip() for w in word_class)\
                if word_class else ''

        if connection.dictionary.words.find({'word': word}).count():
            return

        phonetic = self.contentdoc.xpath("div//div[@class='top-container']"
                                         "//span[@class='phon-us']")
        phonetic = ';'.join(polish(tostring(p)).strip() for p in phonetic)\
                if phonetic else u''

        definitions = self.contentdoc.xpath(
            "div//span[(@class='d' or @class='ud')"
            "and starts-with(@id, '%s_')]" % word)
        defs = []
        if definitions:
            for d in definitions:
                examps = []
                exp = polish(tostring(d)).strip()
                for e in d.itersiblings(tag='span', preceding=False):
                    if e.attrib.get('class', None) == 'x-g':
                        examps.append(polish(tostring(e)).strip())
                if not examps:
                    parent = d.getparent()
                    if parent.attrib.get('class', None) == 'def_block':
                        for e in parent.itersiblings(tag='span',
                                preceding=False):
                            if e.attrib.get('class', None) == 'x-g':
                                examps.append(polish(tostring(e)).strip())
                if not examps: examps = ['']
                defs.append({'explain': exp, 'example': examps})
        if not defs: defs = [{'explain': '', 'example': ['']}]

        connection.dictionary.words.save(
            {'word': word, 'content': self.contentstr,
             'related': self.related,
             'word_info': {
                'word_class': word_class,
                'phonetic': phonetic,
                'definition': defs
            }}
        )
