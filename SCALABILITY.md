# TaskFlow – Scalability & Architecture Notes

## Current Architecture

```
Client (React) → Nginx → Node.js API → MySQL
```

The current monolithic design is intentional for v1 simplicity. Below is a concrete roadmap for scaling each layer.

---

## 1. Horizontal Scaling (Stateless API)

The Express backend is **stateless by design** — JWT tokens carry all session state, so any number of API instances can serve the same request without coordination.

```
                    ┌─────────────────────────────────┐
Clients  ──────▶   │  Load Balancer (Nginx / AWS ALB) │
                    └──────┬──────────┬───────────────┘
                           │          │
                    ┌──────▼──┐  ┌────▼────┐
                    │  API #1 │  │  API #2 │   ... (N replicas)
                    └──────┬──┘  └────┬────┘
                           └────┬─────┘
                           ┌────▼─────┐
                           │  MySQL   │  (Primary + Read Replicas)
                           └──────────┘
```

**Steps to implement:**
- Deploy API in Docker Swarm or Kubernetes with `replicas: 3+`
- Use AWS ALB or Nginx upstream round-robin
- Store no local state; all state lives in DB or Redis

---

## 2. Caching with Redis

Two caching strategies are already scaffolded in the codebase:

| Layer | What to cache | TTL |
|---|---|---|
| Auth tokens | Blacklisted/revoked JWTs | Until expiry |
| Task lists | User's task list (GET /tasks) | 60 seconds |
| Admin stats | Dashboard aggregates | 5 minutes |

```js
// Example: cache GET /tasks per user
const cacheKey = `tasks:user:${req.user.id}:page:${page}`;
const cached   = await redis.get(cacheKey);
if (cached) return res.json(JSON.parse(cached));
// ... fetch from DB, then:
await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
```

---

## 3. Database Scaling

### Read Replicas
- Route all `SELECT` queries to read replicas
- Route `INSERT/UPDATE/DELETE` to the primary
- `mysql2` pool config supports multiple hosts

### Connection Pooling
- Current pool: 10 connections per node
- Scale: Use **ProxySQL** or **PlanetScale** to pool across instances

### Future: Sharding
- Partition `tasks` table by `user_id % N` for multi-tenant scale
- Or migrate to **CockroachDB** for geo-distributed writes

---

## 4. Microservices Migration Path

The current folder structure mirrors the service boundaries for easy extraction:

```
taskflow/
├── backend/src/
│   ├── routes/auth.*     →  auth-service     (Port 5001)
│   ├── routes/task.*     →  task-service     (Port 5002)
│   └── routes/admin.*    →  admin-service    (Port 5003)
```

Each service would:
- Own its own database schema
- Communicate via REST or a message broker (RabbitMQ / Kafka)
- Be independently deployable and scalable

**Event-driven example:**
```
User registers (auth-service)
    └──▶ Publishes "user.created" to RabbitMQ
              └──▶ notification-service sends welcome email
              └──▶ analytics-service tracks signup
```

---

## 5. Logging & Observability

Already implemented with **Winston** structured logging. At scale:

| Tool | Purpose |
|---|---|
| Winston → CloudWatch / Datadog | Centralized log aggregation |
| Prometheus + Grafana | API latency, error rate metrics |
| OpenTelemetry | Distributed tracing across services |
| Sentry | Real-time error tracking |

---

## 6. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml (reference)
on: [push to main]
jobs:
  test  → build → docker push → kubectl rollout
```

- Blue/green deploys to avoid downtime
- Automated DB migrations on deploy

---

## Summary

| Concern | Solution |
|---|---|
| API scale-out | Kubernetes HPA, stateless JWT |
| DB read scale | MySQL read replicas + ProxySQL |
| Caching | Redis (token blacklist + response cache) |
| Async workloads | RabbitMQ / BullMQ job queues |
| Observability | Winston + Prometheus + Sentry |
| Deployment | Docker + GitHub Actions + ECR/EKS |
| Future | Microservices with API Gateway (Kong) |
