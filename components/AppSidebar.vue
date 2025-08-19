<template>
  <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <div class="logo" v-if="!isCollapsed">
        <span class="logo-icon">📊</span>
        <span class="logo-text">Retail Analytics</span>
      </div>
      <div class="logo-collapsed" v-else>
        <span class="logo-icon">📊</span>
      </div>
      <button class="collapse-btn" @click="toggleCollapse">
        {{ isCollapsed ? '→' : '←' }}
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text" v-if="!isCollapsed">{{ item.name }}</span>
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-profile" v-if="!isCollapsed">
        <div class="user-avatar">
          <span class="avatar-text">JD</span>
        </div>
        <div class="user-info">
          <span class="user-name">John Doe</span>
          <span class="user-role">Field Agent</span>
        </div>
      </div>
      <div class="user-avatar-collapsed" v-else>
        <span class="avatar-text">JD</span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',
  data() {
    return {
      isCollapsed: false,
      menuItems: [
        { name: 'Dashboard', path: '/', icon: '🏠' },
        { name: 'Analytics', path: '/analytics', icon: '📈' },
        { name: 'Calendar', path: '/calendar', icon: '📅' },
        { name: 'Visits', path: '/visits', icon: '📍' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
        { name: 'AI Assistant', path: '/ai', icon: '🤖' }
      ]
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.app-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 20px;
}

.logo-text {
  font-weight: 600;
  color: #1f2937;
}

.logo-collapsed {
  display: flex;
  justify-content: center;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.collapse-btn:hover {
  background: #f3f4f6;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
  border-right: 3px solid #2563eb;
}

.nav-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar, .user-avatar-collapsed {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}

.user-avatar-collapsed {
  margin: 0 auto;
}
</style> 