// Cookie Consent Management for Atlas Logged
// Handles GDPR-compliant cookie consent for Chatwoot live chat

(function() {
    'use strict';

    const CONSENT_KEY = 'chatwoot-consent';
    const CHATWOOT_CONFIG = {
        baseUrl: 'https://app.chatwoot.com',
        websiteToken: 'xiyWsj719fc5BZUsg8i4n88i'
    };

    // Check if user is coming from the Atlas Logged app
    function isFromApp() {
        // Check custom user agent from iOS app
        const isAppUserAgent = navigator.userAgent.includes('AtlasLogged/');

        // Check URL parameter for explicit consent
        const urlParams = new URLSearchParams(window.location.search);
        const hasConsentParam = urlParams.get('consent') === 'chat';

        return isAppUserAgent || hasConsentParam;
    }

    // Get current consent status from localStorage
    function getConsentStatus() {
        return localStorage.getItem(CONSENT_KEY);
    }

    // Save consent status
    function saveConsentStatus(status) {
        localStorage.setItem(CONSENT_KEY, status);

        // Dispatch custom event for analytics/tracking (optional)
        window.dispatchEvent(new CustomEvent('chatwoot-consent-changed', {
            detail: { consent: status }
        }));
    }

    // Load Chatwoot widget
    function loadChatwoot() {
        // Configure Chatwoot settings
        window.chatwootSettings = {
            hideMessageBubble: false,
            position: "right",
            locale: "en"
        };

        // Load Chatwoot SDK
        var BASE_URL = CHATWOOT_CONFIG.baseUrl;
        var g = document.createElement('script');
        var s = document.getElementsByTagName('script')[0];

        g.src = BASE_URL + "/packs/js/sdk.js";
        g.defer = true;
        g.async = true;

        g.onload = function() {
            if (window.chatwootSDK) {
                window.chatwootSDK.run({
                    websiteToken: CHATWOOT_CONFIG.websiteToken,
                    baseUrl: BASE_URL
                });
            }
        };

        s.parentNode.insertBefore(g, s);
    }

    // Accept cookies and load Chatwoot
    function acceptCookies() {
        saveConsentStatus('accepted');
        hideCookieBanner();
        loadChatwoot();
    }

    // Reject cookies
    function rejectCookies() {
        saveConsentStatus('rejected');
        hideCookieBanner();
    }

    // Show cookie consent banner
    function showCookieBanner() {
        // Check if banner already exists
        if (document.getElementById('cookie-consent-banner')) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.setAttribute('aria-live', 'polite');

        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <p><strong>We use cookies for customer support</strong></p>
                    <p>This website uses Chatwoot (a third-party service) for live chat support. Cookies help maintain your chat session across visits.</p>
                    <a href="https://atlaslogged.com/privacy.html" target="_blank" rel="noopener noreferrer">View Privacy Policy</a>
                </div>
                <div class="cookie-banner-actions">
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept" aria-label="Accept cookies">
                        Accept
                    </button>
                    <button id="cookie-reject" class="cookie-btn cookie-btn-reject" aria-label="Reject cookies">
                        Reject
                    </button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(30, 41, 59, 0.98);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 1.5rem;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
                z-index: 999999;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
                text-align: center;
            }

            .cookie-banner-text {
                color: #fff;
            }

            .cookie-banner-text p {
                margin: 0 0 0.5rem 0;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            .cookie-banner-text strong {
                font-weight: 600;
                font-size: 1.05rem;
            }

            .cookie-banner-text a {
                color: #60a5fa;
                text-decoration: underline;
                font-size: 0.9rem;
                transition: color 0.2s;
            }

            .cookie-banner-text a:hover {
                color: #93c5fd;
            }

            .cookie-banner-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            .cookie-btn {
                padding: 0.75rem 2rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 120px;
            }

            .cookie-btn-accept {
                background: #2563eb;
                color: white;
            }

            .cookie-btn-accept:hover {
                background: #1d4ed8;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            }

            .cookie-btn-reject {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .cookie-btn-reject:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            @media (min-width: 768px) {
                .cookie-banner-content {
                    flex-direction: row;
                    justify-content: space-between;
                    text-align: left;
                }

                .cookie-banner-text {
                    flex: 1;
                }

                .cookie-banner-actions {
                    flex-shrink: 0;
                }
            }

            @media (max-width: 767px) {
                #cookie-consent-banner {
                    padding: 1rem;
                }

                .cookie-banner-text p {
                    font-size: 0.875rem;
                }

                .cookie-btn {
                    padding: 0.65rem 1.5rem;
                    font-size: 0.875rem;
                    min-width: 100px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
        document.getElementById('cookie-reject').addEventListener('click', rejectCookies);
    }

    // Hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    // Add slideDown animation
    const slideDownStyle = document.createElement('style');
    slideDownStyle.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(slideDownStyle);

    // Initialize on DOM ready
    function init() {
        // If coming from app, auto-accept and load Chatwoot
        if (isFromApp()) {
            saveConsentStatus('accepted');
            loadChatwoot();
            return;
        }

        // Check existing consent status
        const consentStatus = getConsentStatus();

        if (consentStatus === 'accepted') {
            // User previously accepted, load Chatwoot
            loadChatwoot();
        } else if (consentStatus === 'rejected') {
            // User previously rejected, don't show banner or load Chatwoot
            // They can manually change this by clearing localStorage
        } else {
            // No consent decision yet, show banner
            showCookieBanner();
        }
    }

    // Export functions for manual control (optional)
    window.ChatwootConsent = {
        accept: acceptCookies,
        reject: rejectCookies,
        reset: function() {
            localStorage.removeItem(CONSENT_KEY);
            location.reload();
        },
        getStatus: getConsentStatus
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
