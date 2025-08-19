<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">📊</span>
          <span class="logo-text">Retail Analytics</span>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">
            <span class="avatar-text">JD</span>
          </div>
          <div class="user-details">
            <span class="user-name">John Doe</span>
            <span class="user-role">Field Agent</span>
          </div>
        </div>
        <button class="theme-toggle" @click="toggleTheme">
          🌙
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      isDark: false
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.body.classList.toggle('dark', this.isDark)
    }
  }
}
</script>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background: #f3f4f6;
}
</style> 