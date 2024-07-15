FROM node:21

WORKDIR /app

COPY ./dependencies/* .

RUN npm install --save

COPY ./src ./src

EXPOSE ${FRONTEND_PORT}

# Running entry point starting server
CMD ["npm", "run", "dev"]
