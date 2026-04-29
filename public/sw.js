self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_TRACKING_NOTIFICATION') {
    const { collector, startTime, distance } = event.data;
    
    self.registration.showNotification('LIS Logistics Tracking', {
      body: `Collector: ${collector}\nTracking started at ${new Date(startTime).toLocaleTimeString()}\nDistance: ${distance || 0} km`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'logistics-tracking',
      sticky: true,
      ongoing: true, // Keep it persistent on Android
      requireInteraction: true,
      vibrate: [100, 50, 100],
      data: {
        url: self.registration.scope
      }
    });
  }
  
  if (event.data && event.data.type === 'STOP_TRACKING_NOTIFICATION') {
    self.registration.getNotifications({ tag: 'logistics-tracking' }).then(notifications => {
      notifications.forEach(notification => notification.close());
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});
