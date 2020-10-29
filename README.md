# Geopicture web

## Playground
Play here: https://titouancreach.github.io/geopicture-web/

## Run using docker

Go to the docker folder:
```
cd ./docker
```

Install yarn dependencies:

```
docker-compose run --rm build npm install
```

Start the developpement server
```
docker-compose up -d
```

## Features

Clone of https://github.com/titouancreach/geopictures-visu with some addition:
  - Entirely accessible from a web browser (no more elecron)
  - Every image manipulation is done client side
  - Typescript
  - React with react-leaflet
  - Dynamically add or remove picture
  - Click on the picture in the list to focus it
 
## Deploy to gh pages

```
docker-compose run --rm build npm run deploy
```
