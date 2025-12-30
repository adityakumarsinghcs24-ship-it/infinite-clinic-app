// Service to keep the backend server warm
import { API_BASE_URL } from '../config/api';

class KeepAliveService {
  private intervalId: number | null = null;
  private readonly PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

  start() {
    // Initial warm-up call
    this.warmUp();
    
    // Set up periodic pings
    this.intervalId = window.setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);
    
    console.log('🔥 Keep-alive service started');
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Keep-alive service stopped');
    }
  }

  private async warmUp() {
    try {
      const response = await fetch(`${API_BASE_URL}/warm-up/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('🚀 Backend warmed up successfully');
      }
    } catch (error) {
      console.log('❄️ Backend warm-up failed:', error);
    }
  }

  private async ping() {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('💓 Backend ping successful');
      }
    } catch (error) {
      console.log('💔 Backend ping failed:', error);
    }
  }
}

export const keepAliveService = new KeepAliveService();