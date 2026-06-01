<template>
  <div>
    <header class="nav-header">
      <NuxtLink to="/" class="nav-logo">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">SWU Tracker</span>
      </NuxtLink>
      <nav>
        <ul class="nav-links">
          <li><NuxtLink to="/">Collection</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <main class="page-content">
      <slot />
    </main>
  </div>
</template>
