# 2024_camp

This is the website of game "Monopoly" in NTUEE camp for freshman!

2022: By rayray2002, jerry1249756 and hackhaha1\
2023: By lin-1214

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
