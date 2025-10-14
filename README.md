# Atlas Logged Landing Page

Modern, animated landing page for atlaslogged.com built with vanilla HTML, CSS, and JavaScript.

## Features

- **Liquid Glass Effects**: Optional WebGL-based glass effects with real-time background blur
  - Desktop: Enabled by default
  - Mobile: Opt-in via popup (resets on page reload)
  - Live controls panel for adjusting glass parameters
- **Smooth Animations**: GSAP-powered scroll animations and transitions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Privacy-Focused Content**: Highlights the app's privacy-first approach
- **Interactive FAQ**: Accordion-style FAQ section
- **Chatwoot Integration**: Live chat support widget (requires configuration)
- **Fast Performance**: No build step, lightweight, SEO-friendly
- **Accessibility**: WCAG compliant with screen reader support

## Structure

```
website/
├── index.html                      # Main landing page
├── css/
│   ├── style.css                  # Custom styles and animations
│   └── liquid-glass.css           # Liquid glass effect styles
├── js/
│   ├── main.js                    # Interactive elements and GSAP animations
│   ├── liquid-glass-container.js  # WebGL container for liquid glass
│   ├── liquid-glass-button.js     # Glass button component
│   └── liquid-glass-controls.js   # Settings and controls for liquid glass
├── assets/
│   ├── logo.png                   # App logo (1024x1024)
│   ├── app-store-badge.svg        # App Store download badge
│   └── screenshots/               # iOS app screenshots (to be added)
├── CNAME                          # Custom domain configuration
└── README.md                      # This file
```

## Setup

### 1. Local Development

Simply open `index.html` in your browser. No build step required!

For a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server .

# Then visit http://localhost:8000
```

### 2. Chatwoot Configuration

To enable the Chatwoot live chat widget:

1. Sign up for Chatwoot at https://www.chatwoot.com/
2. Create a website inbox and get your credentials
3. In `index.html`, find the Chatwoot script section (near the bottom)
4. Uncomment the code and replace:
   - `YOUR_CHATWOOT_URL` with your Chatwoot instance URL
   - `YOUR_WEBSITE_TOKEN` with your website token

```javascript
// Example configuration
var BASE_URL="https://app.chatwoot.com";
websiteToken: 'your-token-here',
```

### 3. Add App Store Link

Update the download button links in `index.html`:
- Search for `href="#"` in the download buttons
- Replace with your actual App Store URL

### 4. Add Screenshots

Add iOS app screenshots to `assets/screenshots/`:
- Recommended: 1170 x 2532 pixels (iPhone 14 Pro size)
- Use iPhone mockups for professional presentation
- Add 4-6 screenshots showcasing key features

## Deployment

### GitHub Pages

The site is configured to auto-deploy via GitHub Actions when changes are pushed to `main`.

**Setup Steps:**

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - The site will deploy automatically

2. **Configure DNS** (for atlaslogged.com):
   - Add these DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153

   Type: CNAME
   Name: www
   Value: [username].github.io
   ```

3. **Enable HTTPS**:
   - In GitHub Pages settings, check "Enforce HTTPS"
   - DNS propagation may take 24-48 hours

4. **Verify Deployment**:
   - Push changes to `main` branch
   - Check Actions tab for deployment status
   - Visit https://atlaslogged.com

### Manual Deployment

To deploy elsewhere (Netlify, Vercel, etc.):
```bash
# Just upload the entire website/ directory
# No build step required!
```

## Customization

### Colors

Update colors in `css/style.css`:
```css
:root {
    --primary-blue: #3b82f6;
    --secondary-purple: #a855f7;
    --dark-bg: #0f172a;
}
```

### Content

- **Hero Section**: Update tagline and description in `index.html`
- **Features**: Modify feature cards with your app's unique features
- **FAQ**: Add/remove questions in the FAQ section
- **Privacy Policy**: Update links to your actual policy pages

### Animations

Customize animations in `js/main.js`:
- Adjust GSAP animation timing
- Modify scroll trigger thresholds
- Change easing functions

## Technologies Used

- **Tailwind CSS** (via CDN): Utility-first CSS framework
- **GSAP 3.12**: Professional-grade animation library
- **ScrollTrigger**: Scroll-based animations
- **Vanilla JavaScript**: No framework dependencies
- **Chatwoot**: Open-source live chat support
- **[liquid-glass-js](https://github.com/dashersw/liquid-glass-js)**: WebGL-based liquid glass effect library
- **[html2canvas](https://html2canvas.hertzen.com/)**: Screenshot library for background capture (used by liquid-glass-js)

## Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- No build step or bundling required

## Browser Support

- Chrome/Edge: Latest 2 versions
- Safari: Latest 2 versions
- Firefox: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Android: Latest

## Accessibility

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Reduced motion support

## Future Enhancements

- [ ] Add blog section for travel stories
- [ ] Implement newsletter signup
- [ ] Add testimonials/reviews section
- [ ] Create video demo section
- [ ] Add multi-language support
- [ ] Implement dark/light mode toggle

## License

Proprietary - Atlas Logged © 2024

## Support

For questions or issues:
- Email: support@atlascodes.io
- Privacy Policy: https://atlascodes.ai/atlas-logged-privacy-policy
- FAQ: https://simcity.dev/atlas-logged-location-faq
