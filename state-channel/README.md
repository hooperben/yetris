# State Channel Server

This is an express app that was generated with [create-express-api](https://github.com/w3cj/express-api-starter-ts).

### Deployment

```bash
docker build --platform linux/amd64 -t gcr.io/cabs-330704/yetroid:latest .
docker push gcr.io/cabs-330704/yetroid:latest

kubectl create configmap yetroid-config --from-env-file=.prod.env

kubectl delete configmap yetroid-config
```

### Known issues

- need to migrate this from a server to more of a state channel
- fix the game state sharing
