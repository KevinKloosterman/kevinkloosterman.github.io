// Initiate dataLayer object
window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

gtag('consent', 'default', {
  'functionality_storage': 'granted',
  'security_storage': 'granted',
  'personalization_storage': 'granted',
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_personalization': 'denied',
  'ad_user_data': 'denied'
});

// Generic pageview event (not page_view to prevent History Change classification)
window.dataLayer.push({event: 'pageview'});
