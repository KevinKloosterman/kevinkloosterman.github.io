function consentUpdate() {
    if (consentCookieExists()) {
        let consentDict = JSON.parse(getConsentCookie());
        gtag('consent', 'update', consentDict);
    }
}

function setConsentAcceptAll() {
    let consentDict = {
        "functionality_storage": 'granted',
        "security_storage": 'granted',
        "personalization_storage": 'granted',
        "analytics_storage": 'granted',
        "ad_storage": 'granted',
        "ad_personalization": 'granted',
        "ad_user_data": 'granted'
    };

    setConsentCookie(consentDict);
    consentUpdate();
    hideCookieBanner();
}

function customizeConsent() {
    let consentContent = document.querySelector('.consent-content');
    consentContent.innerHTML = `
        <h2>Customize Consent</h2>
        <p>Please select your preferences:</p>
        <div>
            <input type="checkbox" id="functionality" checked disabled>
            <label for="functionality">Functionality Cookies (Required)</label>
        </div>
        <div>
            <input type="checkbox" id="security" checked disabled>
            <label for="security">Security Cookies (Required)</label>
        </div>
        <div>
            <input type="checkbox" id="personalization" checked>
            <label for="personalization">Personalization Cookies</label>
        </div>
        <div>
            <input type="checkbox" id="analytics" checked>
            <label for="analytics">Analytics Cookies</label>
        </div>
        <div>
            <input type="checkbox" id="ad_storage">
            <label for="ad_storage">Advertising Storage Cookies</label>
        </div>
        <div>
            <input type="checkbox" id="ad_personalization">
            <label for="ad_personalization">Personalized Advertising Cookies</label>
        </div>
        <div>
            <input type="checkbox" id="ad_user_data">
            <label for="ad_user_data">User Data Sharing Cookies for Advertising</label>
        </div>
        <div class="consent-buttons">
            <button class="consent-button accept-all" onclick="saveCustomizedConsent()">Save Preferences</button>
        </div>
    `;
}

function saveCustomizedConsent() {
    function grantifyBool(is_checked) {
        if (is_checked) {
            return 'granted';
        } else {
            return 'denied';
        }
    }

    let consentDict = {
        "functionality_storage": grantifyBool(document.getElementById('functionality').checked),
        "security_storage": grantifyBool(document.getElementById('security').checked),
        "personalization_storage": grantifyBool(document.getElementById('personalization').checked),
        "analytics_storage": grantifyBool(document.getElementById('analytics').checked),
        "ad_storage": grantifyBool(document.getElementById('ad_storage').checked),
        "ad_personalization": grantifyBool(document.getElementById('ad_personalization').checked),
        "ad_user_data": grantifyBool(document.getElementById('ad_user_data').checked)
    };

    setConsentCookie(consentDict);
    consentUpdate();
    hideCookieBanner();
}

function setConsentCookie(consent) {
    let consentString = JSON.stringify(consent);
    document.cookie = "consent=" + encodeURIComponent(consentString) + ";path=/;max-age=" + (365*24*60*60) + ";SameSite=Lax;";
}

function consentCookieExists() {
    return document.cookie.split(';').some((cookie) => {
        return cookie.trim().startsWith("consent" + '=');
    });
}

function getConsentCookie() {
    const name = "consent=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function showCookieBanner() {
    document.getElementById('consent-banner-placeholder').style.display = 'flex';
}

function hideCookieBanner() {
    document.getElementById('consent-banner-placeholder').style.display = 'none';
}

// Initial check for consent availability
if (!consentCookieExists()) {
    showCookieBanner();
} else {
    hideCookieBanner();
}

// Always fire consentUpdate to overwrite default with potentially available consent
consentUpdate();

// Generic pageview event (not page_view to prevent History Change classification)
window.dataLayer.push({event: 'pageview'});
