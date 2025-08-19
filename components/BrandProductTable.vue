<template>
  <div class="brand-product-table">
    <div class="table-header">
      <h3>Brand Performance</h3>
      <div class="table-actions">
        <button class="filter-btn">Filter</button>
        <button class="export-btn">Export</button>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Product</th>
            <th>Shelf Share</th>
            <th>Change</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="brand-info">
                <div class="brand-logo">{{ item.brandIcon }}</div>
                <span class="brand-name">{{ item.brand }}</span>
              </div>
            </td>
            <td>{{ item.product }}</td>
            <td>
              <div class="shelf-share">
                <span class="percentage">{{ item.shelfShare }}%</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: item.shelfShare + '%' }"></div>
                </div>
              </div>
            </td>
            <td>
              <span class="change" :class="item.changeType">
                {{ item.change }}
              </span>
            </td>
            <td>
              <span class="status" :class="item.status">
                {{ item.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="action-btn">📊</button>
                <button class="action-btn">✏️</button>
                <button class="action-btn">📧</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrandProductTable',
  data() {
    return {
      tableData: [
        {
          id: 1,
          brand: 'Oreo',
          brandIcon: '🍪',
          product: 'Oreo Original',
          shelfShare: 87,
          change: '+2.3%',
          changeType: 'positive',
          status: 'Good'
        },
        {
          id: 2,
          brand: 'Kinder',
          brandIcon: '🍫',
          product: 'Kinder Bueno',
          shelfShare: 72,
          change: '-1.1%',
          changeType: 'negative',
          status: 'Warning'
        },
        {
          id: 3,
          brand: 'Lay\'s',
          brandIcon: '🥔',
          product: 'Lay\'s Classic',
          shelfShare: 94,
          change: '+0.8%',
          changeType: 'positive',
          status: 'Excellent'
        },
        {
          id: 4,
          brand: 'Coca-Cola',
          brandIcon: '🥤',
          product: 'Coca-Cola Zero',
          shelfShare: 89,
          change: '+1.5%',
          changeType: 'positive',
          status: 'Good'
        }
      ]
    }
  }
}
</script>

<style scoped>
.brand-product-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.filter-btn, .export-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover, .export-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  font-size: 20px;
}

.brand-name {
  font-weight: 500;
  color: #1f2937;
}

.shelf-share {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage {
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.change {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.change.positive {
  background: #dcfce7;
  color: #166534;
}

.change.negative {
  background: #fee2e2;
  color: #dc2626;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.Good {
  background: #dbeafe;
  color: #1d4ed8;
}

.status.Warning {
  background: #fef3c7;
  color: #d97706;
}

.status.Excellent {
  background: #dcfce7;
  color: #166534;
}

.actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
}
</style> 