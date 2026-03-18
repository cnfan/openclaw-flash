<template>
  <div class="restart-snippet">
    <div class="restart-snippet__title">重启网关</div>
    <div class="restart-snippet__block">
      <div class="restart-snippet__label">非 Docker</div>
      <pre><code>openclaw gateway restart</code></pre>
    </div>
    <div class="restart-snippet__block">
      <div class="restart-snippet__label">Docker</div>
      <pre><code>docker exec -it openclaw-cli openclaw gateway restart</code></pre>
    </div>
  </div>
</template>

<style scoped>
.restart-snippet {
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 0.9rem 1rem;
  margin: 0.8rem 0 1rem;
  background: var(--vp-c-bg-soft);
}

.restart-snippet__title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.restart-snippet__block + .restart-snippet__block {
  margin-top: 0.6rem;
}

.restart-snippet__label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.25rem;
}

pre {
  margin: 0;
}
</style>
