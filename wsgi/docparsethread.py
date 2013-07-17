from threading import Thread
from lxml.html import tostring
from models import db
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

        word_class_list = self.contentdoc.xpath(
            "div//div[@class='top-container']//span[@class='pos']")
        word_class = ','.join(
            polish(tostring(w)).strip() for w in word_class_list)

        if db.words.find({'word': word}).count():
            return

        phonetic_list = self.contentdoc.xpath(
            "div//div[@class='top-container']//span[@class='phon-us']")
        phonetic = ';'.join(
            polish(tostring(p)).strip() for p in phonetic_list)

        definitions = self.contentdoc.xpath(
            "div//span[(@class='d' or @class='ud')"
            "and starts-with(@id, '{}_')]".format(word))
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
                examps = examps or ['']
                defs.append({'explain': exp, 'example': examps})
        defs = defs or [{'explain': '', 'example': ['']}]

        db.words.save({
            "word": word,
            "content": self.contentstr,
            "related": self.related,
            "word_info": {
                "word_class": word_class,
                "phonetic": phonetic,
                "definition": defs
            }
        })
