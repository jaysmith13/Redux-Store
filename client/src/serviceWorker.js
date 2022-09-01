








































































function checkValidServiceWorker(swUrl, config) {
fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
         const contentType = response.headers.get('content-type');
 if (
   response.status === 404 ||
   (contentType != null && contentType.indexOf('javascript') === -1)
 ) {
 navigator.serviceWorker.ready.then(registration => {
    registration.unregister().then(() => {
      window.location.reload();
    });
  });
} else {
   registerValidSW(swUrl, config);
}
})
.catch(() => {
console.log(
  'No internet connection found. App is running in offline mode.'
);
});
}



export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }