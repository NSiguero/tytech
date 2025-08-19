<template>
  <div class="image-carousel">
    <div class="carousel-header">
      <h3>Store Photos</h3>
      <div class="carousel-controls">
        <button class="control-btn" @click="prevSlide">←</button>
        <span class="slide-counter">{{ currentSlide + 1 }} / {{ images.length }}</span>
        <button class="control-btn" @click="nextSlide">→</button>
      </div>
    </div>
    
    <div class="carousel-container">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="carousel-slide"
        >
          <img :src="image.url" :alt="image.alt" class="slide-image" />
          <div class="slide-overlay">
            <div class="slide-info">
              <h4>{{ image.title }}</h4>
              <p>{{ image.description }}</p>
              <div class="slide-actions">
                <button class="action-btn">📊 Analyze</button>
                <button class="action-btn">✏️ Edit</button>
                <button class="action-btn">📧 Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="carousel-indicators">
      <button 
        v-for="(image, index) in images" 
        :key="index"
        class="indicator"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageCarousel',
  data() {
    return {
      currentSlide: 0,
      images: [
        {
          url: '/placeholder.svg?height=300&width=400&query=store shelf 1',
          alt: 'Store Shelf 1',
          title: 'Oreo Display',
          description: 'Main shelf display at Carrefour'
        },
        {
          url: '/placeholder.svg?height=300&width=400&query=store shelf 2',
          alt: 'Store Shelf 2',
          title: 'Kinder Section',
          description: 'Chocolate aisle at Mercadona'
        },
        {
          url: '/placeholder.svg?height=300&width=400&query=store shelf 3',
          alt: 'Store Shelf 3',
          title: 'Lay\'s Corner',
          description: 'Snack section at Día'
        },
        {
          url: '/placeholder.svg?height=300&width=400&query=store shelf 4',
          alt: 'Store Shelf 4',
          title: 'Coca-Cola Display',
          description: 'Beverage area at Lidl'
        }
      ]
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.images.length
    },
    prevSlide() {
      this.currentSlide = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1
    },
    goToSlide(index) {
      this.currentSlide = index
    }
  },
  mounted() {
    // Auto-play carousel
    setInterval(() => {
      this.nextSlide()
    }, 5000)
  }
}
</script>

<style scoped>
.image-carousel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.carousel-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carousel-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.slide-counter {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  height: 300px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px;
}

.slide-info h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.slide-info p {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.9;
}

.slide-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.indicator.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.indicator:hover {
  background: #9ca3af;
}
</style> 