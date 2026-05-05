import time
from collections import defaultdict, deque
from threading import Lock


class SimpleRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits = defaultdict(deque)
        self._lock = Lock()

    def allow(self, key: str) -> bool:
        now = time.time()
        with self._lock:
            q = self._hits[key]
            cutoff = now - self.window_seconds

            while q and q[0] <= cutoff:
                q.popleft()

            if len(q) >= self.max_requests:
                return False

            q.append(now)
            return True
