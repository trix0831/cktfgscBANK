yarn build-frontend
docker-compose down
docker image rm trix0831/cktfgsc-bank
docker build . -t trix0831/cktfgsc-bank
docker push trix0831/cktfgsc-bank