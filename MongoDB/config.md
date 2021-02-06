# MongoDB Kube Config

## 1. Kubectl Config

```shell
# To create openEBS
kubectl apply -f openebs.yaml

# To create the namespace
kubectl create namespace mongo

# To create the storage class
kubectl apply -f storageclass.yaml -n mongo

# To create the service
kubectl apply -f service.yaml -n mongo

# To create the statefulSet
kubectl apply -f statefulset.yaml -n mongo
```

## 2. Mongo Config
  
```shell
# To connect to pod bash
kubectl -n mongo exec -it mongod-0 -- /bin/bash
mongo

# rs config
rs.status()
rs.initiate()
show dbs
show collections
db.blog.find()

# To dump from Mongo Database
mongodump

# To copy from container to local
kubectl -n mongo cp  mongod-0:dump $HOME/dump
```