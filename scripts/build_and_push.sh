yarn build-frontend
docker-compose down
docker image rm rayray2002/monopoly
docker build . -t rayray2002/monopoly
docker push rayray2002/monopoly