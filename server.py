from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

names = []
ms = []

common_vars = [5, 23]

ip = []
keys = {}


def show_names():
    if len(names) == 0:
        return 'None'
    else:
        return '<br>'.join(names)


def show_messages():
    if len(messages) == 0:
        return 'None'
    else:
        return '<br>'.join(messages)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.route('/message', methods=['Get', 'POST'])
@app.route('/message/<name>')
def messages():

    if request.method == 'POST':
        h = request.get_json()
        x = request.remote_addr
        ms.append({'ip': x, 'message': h['message']})
        # print(ms)
        # print(ip)
        return h['message']

    else:
        x = request.remote_addr
        if x not in ip:
            ip.append(x)

        return jsonify(ms)
        # return show_messages()


@app.route('/key', methods=['Get', 'POST'])
def set_keys():

    if request.method == 'POST':
        h = request.get_json()
        x = request.remote_addr
        keys[x] = h['key']
        return h['key']

    else:
        x = request.remote_addr

        y = list(keys.keys())

        print(keys)
        if(len(y) < 2):
            return 'No'

        for i in y:
            if x != i:
                return keys[i]

        # return show_messages()


@app.route('/', methods=['Get', 'POST'])
def root():

    if request.method == 'POST':
        return 'post happened'
    else:
        s = show_names()
        if s == 'None':
            return render_template('first.html')
        return (s + '<br> <br>' + '<a href="/name" target="_self"> \
                Enter your name</a>' + ' ' + '<a href="/image"target= \
                "_self">Show image</a>' + ' ' + '<a href="/page" target= \
                "_self">Show page</a>' + ' ' + '<a href="/code" target= \
                "_self">Show code</a>')


@app.route('/image', methods=['Get'])
def get_image():
    return render_template('image.html')


@app.route('/page', methods=['Get'])
def get_page():
    return render_template('page.html')


@app.route('/code', methods=['Get'])
def get_code():
    return render_template('code.html')


@app.route('/name', methods=['Get', 'POST'])
def add_name():
    if request.method == 'POST':
        h = request.get_json()
        names.append(h['name'])
        return h['name']
    else:
        return render_template('name.html')


@app.route('/ajax')
@app.route('/ajax/<name>')
def ajax(name=None):
    return render_template('ajax.html', name=name)


if(__name__ == '__main__'):
    app.run(debug=True, port=80, host='0.0.0.0')
