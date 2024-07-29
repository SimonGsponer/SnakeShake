FROM python:3.12-bookworm

COPY /app.py /app.py
COPY /requirements.txt /requirements.txt

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "flask"]
CMD [ "run", "--host", "0.0.0.0", "--port", "8080"]