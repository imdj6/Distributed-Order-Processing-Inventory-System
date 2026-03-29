🔥 Core Features & Guarantees
Queue-First Asynchronous Processing: API responds immediately after persisting a PENDING order. Workers process the queue asynchronously using BullMQ.

Distributed Locking: Utilizes Redis-based distributed locks (per productId) to eliminate race conditions across multiple distributed workers, guaranteeing no inventory overselling.

Strict Idempotency: Implements a unique idempotencyKey at the database level. Workers independently verify CONFIRMED status before processing to prevent duplicate orders and double-charging during network partitions or retry loops.

Resilience & Fault Tolerance: * Configured with Exponential Backoff retries for transient failures (e.g., brief DB unavailability).

Implements a Dead Letter Queue (DLQ) to catch and store poison-pill jobs or permanent failures for manual observability and recovery.

Observability: Integrated with Bull-Board for real-time monitoring of active, waiting, failed, and DLQ jobs.

🧱 Tech Stack
Component	Technology
Backend Framework	NestJS (TypeScript)
Database	PostgreSQL
ORM	Prisma
Caching & Locking	Redis (ioredis)
Message Queue	BullMQ
Monitoring	Bull-Board
🧠 Key Design Decisions
Why Redis Distributed Locks over Database Row-Level Locks?
In high-concurrency flash sales, thousands of users might attempt to buy the same item simultaneously. Relying on SELECT ... FOR UPDATE in PostgreSQL would exhaust the database connection pool, starving the rest of the application. Redis offloads this queuing pressure to a highly-optimized in-memory store.

Why the Queue-First approach?
By decoupling order ingestion from inventory processing, the API layer can ingest tens of thousands of requests per second without being bottlenecked by complex, multi-step database transactions.

🚀 Getting Started (Local Development)
1. Prerequisites
Node.js (v18+)

Docker & Docker Compose (for PostgreSQL and Redis)

2. Environment Setup
Clone the repository and install dependencies:

Bash
git clone [https://github.com/yourusername/Distributed-Order-Processing-Inventory-System.git](https://github.com/yourusername/Distributed-Order-Processing-Inventory-System.git)
cd Distributed-Order-Processing-Inventory-System
npm install
Create a .env file in the root directory:

Code snippet
DATABASE_URL="postgresql://user:password@localhost:5432/order_db?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
3. Database Migration
Bash
npx prisma migrate dev --name init
npx prisma generate
4. Running the Application
Because this system is designed for horizontal scaling, the API and the Worker run as completely separate processes. You will need two terminal instances.

Terminal 1: Start the API Gateway

Bash
npm run start:dev
Terminal 2: Start the Background Worker

Bash
npm run start:worker
(Ensure start:worker is mapped to your worker entry file in package.json)

🧪 Testing Strategy
Concurrency Testing: Used Autocannon to simulate heavy parallel requests on a single product to verify lock integrity and zero overselling.

Idempotency Testing: Simulated worker crashes immediately after DB commits to ensure BullMQ retries do not result in double inventory deduction.

Failure Simulation: Forcibly downed Postgres to trigger BullMQ's exponential backoff, observing successful recovery upon DB restoration.

🔮 Future Enhancements
Payment Gateway Integration: Implement two-phase commit or saga pattern for distributed transactions across third-party providers.

Optimistic Concurrency Control (OCC): Add DB versioning as a fallback constraint against premature Redis lock expiration (Watchdog/TTL edge cases).

Distributed Tracing: Integrate OpenTelemetry for cross-service request tracking.
"""

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

print("Successfully generated README.md")


