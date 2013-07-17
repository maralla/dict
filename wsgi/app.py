from flask import (
    Flask,
    render_template,
    jsonify,
    make_response,
    abort,
    request,
    redirect,
    g
)

from models import db
from lxml import etree
from lxml.html import tostring
from urllib2 import urlopen

from docparsethread import DocParseThread, polish

app = Flask(__name__)
app.config.from_object("settings")


@app.before_request
def get_oxfordpic():
    if request.path.startswith('/external'):
        return redirect('%s/%s' % (app.config['URL'], request.path))


@app.teardown_request
def teardown_request(exception):
    if getattr(g, 'thread', None):
        g.thread.join()


@app.route('/')
def index():
    return render_template('words.html')


@app.route('/word/<word>')
def word_def(word):
    word = word.lower()
    phrase = '-'.join(word.split())
    words = [word, phrase, '%s_1' % word, '%s_1' % phrase]
    cursor = db.words.find({'word': {'$in': words}})
    if cursor.count():
        w = cursor.next()
        return jsonify(word=word, content=w['content'], related=w['related'])
    try:
        word_define = urlopen('%s/dictionary/%s' % (app.config['URL'], word))
    except:
        abort(404)
    doc = etree.HTML(word_define.read())
    if '/spellcheck/?q' in word_define.url:
        content = polish(tostring(doc.xpath(
            "/html/body/div[@id='ox-container']"
            "/div[@id='ox-wrapper']/div[@id='main_column']")[0])).strip()
        related = '#'
    else:
        contentElem = doc.xpath(
            "/html/body/div[@id='ox-container']/div[@id='ox-wrapper']"
            "/div[@id='main_column']/div[@id='main-container']"
            "/div[@id='entryContent']")[0]
        content = polish(tostring(contentElem)).strip()
        related = polish(tostring(doc.xpath(
            "/html/body/div[@id='ox-container']/div[@id='leftcolumn']"
            "/div[@id='relatedentries']")[0])).strip()
        thread = DocParseThread(contentElem, content, related)
        thread.start()
        g.thread = thread
    return jsonify(word=word, content=content, related=related)


@app.errorhandler(404)
def word_error(error):
    response = make_response('', 404)
    response.mimetype = 'application/json'
    return response
