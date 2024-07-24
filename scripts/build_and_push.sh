yarn build-frontend
docker-compose down
docker image rm trix0831/cktfgscBANK
docker build . -t trix0831/cktfgscBANK
docker push trix0831/cktfgscBANK