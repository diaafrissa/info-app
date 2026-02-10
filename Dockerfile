FROM node
WORKDIR /home/app
RUN npm install express mongoose body-parser multer
COPY . .
EXPOSE 3000
CMD ["node","server.js"]