FROM python:3.7

RUN pip3 install --upgrade pip

ENV FLASK_APP app.py
ENV FLASK_CONFIG docker

RUN mkdir -p /usr/labellab/labellab-flask
WORKDIR /usr/labellab/labellab-flask

COPY requirements.txt requirements.txt
COPY docker.txt docker.txt
RUN pip install -r docker.txt
COPY . .

RUN chmod +x boot.sh

EXPOSE 5000

ENTRYPOINT [ "./boot.sh" ]