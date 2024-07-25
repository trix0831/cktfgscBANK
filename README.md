# 2024_camp

This is the web bank of game "casino" in the summer camp held by CKSC and TFGSC.
Program based on the website of game monopoly in NTUEE camp.

Main author: trix0831
NTUEE contributor: rayray2002, jerry1249756, hackhaha1, lin-1214, trix0831

## Development
### Install packages
```bash
yarn install-all
```


### Frontend
```bash
cd frontend
yarn start
```

### Backend
```bash
cd backend
yarn initdata
yarn server
```
## Deployment
### Local
```bash
yarn build-frontend
yarn start
```

### Docker
#### Build and Push
```bash
bash scripts/build_and_push.sh
```

#### Run
```bash
# Simple
docker-compose up -d
# Pull and Run
bash scripts/run.sh
```

#### Init
```bash
bash scripts/initdb.sh
```
