FROM node
ENV MONGO-DB USERNAME=admin \
    MONGO-DB-PASSWORD=password
RUN mkdir -p /home/app
COPY . /home/app
CMD ["node","/home/app/server.js"]