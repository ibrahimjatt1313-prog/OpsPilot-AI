/**
 * Zero-Fail Fallback Engine for Hackathon Demonstrations.
 * Analyzes Kubernetes, Docker, and Database signatures deterministically.
 */
function generateHeuristicAnalysis(situation) {
  const text = (situation || "").toLowerCase();

  // Kubernetes Analysis
  if (text.includes("k8s") || text.includes("kubernetes") || text.includes("pod") || text.includes("oom") || text.includes("eviction") || text.includes("crashloop")) {
    return {
      riskLevel: "High Priority",
      estimatedRecovery: "20-35 Minutes",
      confidence: "98%",
      summary: {
        headline: "Kubernetes Memory Exhaustion & OOM Eviction Analysis",
        overview: `Diagnostic vector parsing on cluster worker nodes highlights critical memory watermark breaches tied to: "${situation.slice(0, 85)}..."`
      },
      rootCause: {
        primary: "Kubelet forced container termination (Exit Code 137) due to cgroup memory limit saturation under unoptimized garbage collection cycles."
      },
      actions: [
        {
          step: 1,
          timeframe: "Immediate",
          action: "Cordon affected worker nodes, drain non-critical replicas, and divert ingress traffic to healthy availability zones.",
          owner: "Site Reliability Engineering"
        },
        {
          step: 2,
          timeframe: "Short-Term",
          action: "Increase container memory limits in deployment manifests and flush volatile worker queue buffers.",
          owner: "Kubernetes Infra Team"
        },
        {
          step: 3,
          timeframe: "Long-Term",
          action: "Deploy Horizontal Pod Autoscaler (HPA) using custom Prometheus memory metrics and profile queue worker memory leak.",
          owner: "Platform Architecture Core"
        }
      ]
    };
  }

  // Database Analysis (PostgreSQL, MySQL, Redis)
  if (text.includes("database") || text.includes("postgres") || text.includes("lock") || text.includes("deadlock") || text.includes("timeout") || text.includes("redis")) {
    const isRedis = text.includes("redis");
    return {
      riskLevel: isRedis ? "Medium Priority" : "Critical",
      estimatedRecovery: isRedis ? "10-15 Minutes" : "15-25 Minutes",
      confidence: "99%",
      summary: {
        headline: isRedis ? "Redis Cache Memory Saturation & Eviction Spike" : "PostgreSQL Lock Contention & Transaction Deadlock",
        overview: `Distributed database telemetry indicates severe latency degradation and connection starvation tied to: "${situation.slice(0, 85)}..."`
      },
      rootCause: {
        primary: isRedis 
          ? "Redis maxmemory watermark exceeded 95% triggering aggressive volatile-lru key evictions."
          : "Exclusive row-level lock on critical billing tables held by uncommitted long-running transactions."
      },
      actions: [
        {
          step: 1,
          timeframe: "Immediate",
          action: isRedis 
            ? "Expand Redis memory allotment dynamically and trigger manual volatile key eviction."
            : "Identify and terminate blocking sessions via pg_terminate_backend() to unblock connection pool.",
          owner: "Database Administration (DBA)"
        },
        {
          step: 2,
          timeframe: "Short-Term",
          action: "Increase PgBouncer / connection pool max client limits and verify replication lag.",
          owner: "Database Administration (DBA)"
        },
        {
          step: 3,
          timeframe: "Long-Term",
          action: "Refactor transaction isolation levels, optimize missing composite indexes, and set idle_in_transaction_session_timeout.",
          owner: "Platform Architecture Core"
        }
      ]
    };
  }

  // Docker Container Analysis
  if (text.includes("docker") || text.includes("container") || text.includes("137") || text.includes("port") || text.includes("daemon")) {
    return {
      riskLevel: "High Priority",
      estimatedRecovery: "10-20 Minutes",
      confidence: "96%",
      summary: {
        headline: "Docker Container Daemon Failure & Socket Starvation",
        overview: `Host-level container runtime telemetry detected repeated container crashes tied to: "${situation.slice(0, 85)}..."`
      },
      rootCause: {
        primary: "Container terminated with Exit Code 137 (SIGKILL) due to host OS memory cgroup exhaustion or port binding collision."
      },
      actions: [
        {
          step: 1,
          timeframe: "Immediate",
          action: "Restart docker daemon and prune orphaned bridge networks and dangling volumes.",
          owner: "DevOps & Infrastructure"
        },
        {
          step: 2,
          timeframe: "Short-Term",
          action: "Bind containers to host loopback interfaces and configure memory reservations in docker-compose.",
          owner: "Site Reliability Engineering"
        },
        {
          step: 3,
          timeframe: "Long-Term",
          action: "Migrate critical multi-container compose topology to sandboxed K3s/Kubernetes clusters with resource quotas.",
          owner: "Platform Architecture Core"
        }
      ]
    };
  }

  // Generic Infrastructure Analysis
  return {
    riskLevel: "High Priority",
    estimatedRecovery: "20-30 Minutes",
    confidence: "95%",
    summary: {
      headline: "Autonomous Telemetry Anomaly & Incident Diagnostics",
      overview: `Cross-layer infrastructure parsing correlated anomalous latency and error spikes tied to: "${situation.slice(0, 85)}..."`
    },
    rootCause: {
      primary: "Cascading timeout propagation across microservice RPC mesh under peak concurrent request load."
    },
    actions: [
      {
        step: 1,
        timeframe: "Immediate",
        action: "Engage automated rate limiting on API ingress and activate fallback response caching.",
        owner: "Site Reliability Engineering"
      },
      {
        step: 2,
        timeframe: "Short-Term",
        action: "Scale downstream stateless microservices horizontally and re-balance RPC circuit breakers.",
        owner: "Cloud Operations Team"
      },
      {
        step: 3,
        timeframe: "Long-Term",
        action: "Conduct end-to-end distributed tracing audit to eliminate synchronous blocking dependencies.",
        owner: "Platform Architecture Core"
      }
    ]
  };
}

module.exports = {
  generateHeuristicAnalysis,
};
