<template>
  <div class="ai-assistant">
    <div class="ai-header">
      <h3>AI Assistant</h3>
      <div class="ai-status">
        <span class="status-dot"></span>
        Online
      </div>
    </div>
    <div class="ai-chat">
      <div class="chat-messages">
        <div class="message ai-message">
          <div class="message-content">
            Hello! I'm your AI assistant. How can I help you today?
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type your message..." />
        <button class="send-btn">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIAssistant',
  data() {
    return {
      messages: []
    }
  }
}
</script>

<style scoped>
.ai-assistant {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ai-header {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.ai-chat {
  padding: 16px;
}

.chat-messages {
  min-height: 200px;
  margin-bottom: 16px;
}

.message {
  margin-bottom: 12px;
}

.ai-message .message-content {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
}

.chat-input {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
}

.send-btn {
  padding: 12px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> 