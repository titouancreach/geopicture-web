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
docker-compose run build yarn
```

Start the developpement server
```
docker-compose up -d
```

## Features

Clone of https://github.com/titouancreach/geopictures-visu with some addition:
  - entirely accessible from a web browser (no more elecron)
  - every image manipulation is done client side
  - typescript
  - react with react-leaflet
  - dynamically add or remove picture
  - click on the picture in the list to zoom to it
 
## Deploy to gh pages
```
yarn deploy
```
