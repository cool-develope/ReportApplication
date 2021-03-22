# DailyReport

This is a simple project to report news and reports.
We use **Gin-Gonic** as a backend framework, **Next.js** as a frontend framework, **GraphQL** as a data query, and **Kubernetes** as a deploy environment.


## Docker CMD

```cmd
# Server Side

docker build -t server/gin-gonic .
docker tag server/gin-gonic localhost:5000/gin-gonic
docker push localhost:5000/gin-gonic
kubectl apply -f k8s.yaml

# Client Side

docker build -t client/nextjs .
docker tag client/nextjs localhost:5000/nextjs
docker push localhost:5000/nextjs
kubectl apply -f k8s.yaml

```