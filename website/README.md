# AssignMate Website

A beautiful, modern landing page for the AssignMate homework planner app.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-first approach
- ⚡ Fast loading with optimized assets
- 🎯 SEO optimized
- 📧 Contact form
- 📥 Download buttons for Android/iOS
- 🌟 Smooth animations and interactions

## File Structure

```
website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── assets/             # Images and assets
│   ├── icon.png        # App icon
│   ├── favicon.png     # Website favicon
│   └── placeholder-images.html  # Placeholder images guide
└── README.md           # This file
```

## Deployment Options

### 1. GitHub Pages (Free)
1. Create a new repository on GitHub
2. Upload all website files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://yourusername.github.io/repository-name`

### 2. Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the website folder
3. Your site will be deployed instantly with a custom URL

### 3. Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files
3. Deploy with one click

### 4. Custom Domain
- Purchase a domain from providers like Namecheap, GoDaddy, etc.
- Point the domain to your hosting provider
- Update DNS settings

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #007AFF;
    --secondary-color: #34C759;
    /* ... other colors */
}
```

### Content
- Update app information in `index.html`
- Replace placeholder images with actual screenshots
- Modify contact information and links

### Features
- Add Google Analytics for tracking
- Integrate with email services for contact form
- Add social media links
- Include app store badges

## Screenshots Needed

Replace these placeholder images with actual screenshots:
- `assets/screenshot-home.png` - Home screen
- `assets/screenshot-add.png` - Add assignment screen
- `assets/screenshot-list.png` - Assignment list screen
- `assets/screenshot-timer.png` - Pomodoro timer screen
- `assets/phone-mockup.png` - Phone mockup image
- `assets/phone-download.png` - Download section phone image

## Contact Form

The contact form is currently set up for demonstration. To make it functional:
1. Use a service like Formspree, Netlify Forms, or EmailJS
2. Update the form action in `script.js`
3. Add proper validation and error handling

## SEO Optimization

The website includes:
- Meta descriptions
- Open Graph tags
- Semantic HTML structure
- Fast loading times
- Mobile responsiveness

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This website is part of the AssignMate project and follows the same MIT license.

