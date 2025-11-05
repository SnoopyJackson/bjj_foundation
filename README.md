# BJJ Foundation 🥋

> *"The Encyclopedia Galactica of Brazilian Jiu-Jitsu"*

A comprehensive web application for discovering, browsing, and filtering BJJ technique videos from top instructors. Inspired by Isaac Asimov's Foundation series, this project preserves and organizes BJJ knowledge for practitioners across the galaxy.

![BJJ Foundation](banner.png)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Setup](#api-setup)
- [Classification System](#classification-system)
- [Web App](#web-app)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### YouTube Scraper
- 🎥 Fetch videos and shorts from multiple BJJ channels
- 📊 Extract comprehensive metadata (title, description, tags, views, etc.)
- 🔄 Handles pagination automatically
- 💾 Export to JSON format
- ⚡ Configurable video limits per channel

### Video Classification
- 🤖 Automatic classification using BJJ terminology
- 🛡️ Guard types (Closed Guard, Spider Guard, De La Riva, etc.)
- 📍 Positions (Mount, Back Control, Side Control, etc.)
- ⚔️ Passes (Knee Slice, Toreando, Leg Drag, etc.)
- 🌀 Sweeps (Scissor Sweep, Flower Sweep, etc.)
- 🎯 Submissions (Armbar, Triangle, Heel Hook, etc.)
- 🏷️ Emoji tags for visual recognition
- 📝 Preserves all video metadata

### Web Application
- 🎨 Beautiful sci-fi themed interface (Asimov Foundation inspired)
- 🔍 Real-time search across titles, descriptions, and tags
- 🎛️ Advanced filtering system
- 📱 Fully responsive (desktop, tablet, mobile)
- 🖼️ Video thumbnails with play overlays
- 📊 View count display
- 🏷️ Color-coded classification tags
- ⚡ Fast, client-side filtering
- 🌙 Dark theme optimized for viewing

## 🎬 Demo

Open `index.html` in your browser to see the web app in action!

## 📁 Project Structure

```
bjj_foundation/
├── index.html                      # Main web application
├── style.css                       # Styling and responsive design
├── app.js                          # Frontend JavaScript logic
├── banner.png                      # Hero banner image
├── youtube_scraper.py              # YouTube API scraper
├── classify_bjj_videos.py          # Video classification script
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── bjj_videos.json                 # Full video data (generated)
├── bjj_videos_simple.json          # Simplified video data (generated)
└── bjj_simple_processed.json       # Classified video data (generated)
```

## 🚀 Installation

### Prerequisites

- Python 3.9 or higher
- A modern web browser (Chrome, Firefox, Safari, Edge)
- YouTube Data API v3 key (free)

### Step 1: Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install google-api-python-client
```

### Step 2: Set Up YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### Step 3: Configure API Key

Open `youtube_scraper.py` and add your API key:

```python
API_KEY = 'your_actual_api_key_here'
```

## 📖 Usage

### 1. Scrape YouTube Videos

```bash
python youtube_scraper.py
```

This will:
- Fetch videos from all configured channels
- Generate `bjj_videos.json` (complete data)
- Generate `bjj_videos_simple.json` (simplified data)

**Default Channels:**
- @TarikBJJ
- @JonThomasBJJ
- @JordanTeachesJiujitsu
- @DefensiveBJJ
- @LachlanGilesBJJ
- @KeenanCornelius

### 2. Classify Videos

```bash
python classify_bjj_videos.py
```

This will:
- Read `bjj_videos_simple.json`
- Classify videos based on BJJ terminology
- Generate `bjj_simple_processed.json` with classifications

### 3. Open Web App

Simply open `index.html` in your browser:

```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

Or navigate to:
```
file:///path/to/bjj_foundation/index.html
```

## 🔑 API Setup

### YouTube Data API Quota

- **Daily Quota:** 10,000 units
- **Search Request:** ~1 unit
- **Playlist Items:** ~1 unit
- **Video Details:** ~1 unit

**Example:** Fetching 500 videos from 6 channels ≈ 3,000-4,000 units

### Quota Management

- The script fetches up to 500 videos per channel by default
- Adjust `max_results_per_channel` in `youtube_scraper.py` to manage quota
- Quota resets daily at midnight Pacific Time

## 🏷️ Classification System

### Guard Types 🛡️
- 🔒 Closed Guard
- 🌊 Open Guard
- ⚖️ Half Guard
- 🦋 Butterfly Guard
- 🪝 De La Riva
- 🔄 Reverse De La Riva
- 🕷️ Spider Guard
- 🪢 Lasso Guard
- ❌ X Guard
- 🦵 Single Leg X
- ⚔️ 50/50 Guard
- ⚡ Z Guard
- 🔐 Reverse Closed Guard
- 🤸 Rubber Guard
- 🪱 Worm Guard
- 🅺 K Guard

### Classification Improvements ✅

- Priority-based matching: the classifier now checks for longer/more specific keywords before shorter ones (for example "single leg x" will match before "single leg"), which reduces incorrect or ambiguous matches.
- Multilingual support: many glossary entries include French variants (accented and unaccented) so French-language video titles are classified more reliably.
- Tip: when adding new keywords to `BJJ_GLOSSARY`, prefer adding the most specific phrases first and include common spelling/diacritic variants.

### Other Categories
- **Positions:** Mount, Back Control, Side Control, North South, Knee on Belly, Turtle
- **Passes:** Guard Pass, Knee Slice, Toreando, Leg Drag, Over Under, Stack Pass
- **Sweeps:** Scissor Sweep, Hip Bump, Flower Sweep, Balloon Sweep
- **Submissions:** Armbar, Triangle, RNC, Guillotine, Kimura, Heel Hook, Kneebar, and more
- **Techniques:** Takedown, Escape, Reversal, Transition, Defense, Counter, Grip Fighting

## 🌐 Web App

### Features

#### Search Bar 🔍
- Real-time search as you type
- Searches across titles, descriptions, and tags
- Clear button for quick reset

### Performance & Mobile Optimizations ⚡

- Debounced search input (300ms): reduces repeated filtering while typing, improves responsiveness on slower devices.
- Mobile-specific rendering limits: mobile devices render far fewer cards by default (50) to avoid heavy DOM work and speed up initial results.
- Batched DOM updates using DocumentFragment: reduces reflows by inserting many cards in a single operation.
- Lazy-loading thumbnails: thumbnails use native `loading="lazy"` to defer image downloads until the user scrolls them into view.

These changes significantly improve perceived performance on phones and tablets while keeping desktop behavior responsive.

#### Filters 🎛️
- **Guard Type:** Filter by specific guard variations
- **Technique:** Pass, Sweep, Submission, Position, or Other
- **Position:** Filter by specific positions
- **Submission:** Filter by submission types
- **Reset:** Clear all filters instantly

#### Video Cards 🎴
- High-quality thumbnails
- View count with smart formatting (1.2K, 1.5M)
- Color-coded classification tags
- Click to watch on YouTube
- Hover effects and animations

#### Responsive Design 📱
- Desktop: Grid layout with multiple columns
- Tablet: Optimized 2-column layout
- Mobile: Single column, touch-friendly

## 🎨 Customization

### Add More Channels

Edit `youtube_scraper.py`:

```python
BJJ_CHANNELS = [
    "@TarikBJJ",
    "@YourChannel",
    "@AnotherChannel"
]
```

### Adjust Video Limits

In `youtube_scraper.py`:

```python
all_videos = scrape_all_channels(BJJ_CHANNELS, max_results_per_channel=500)
```

### Add New Classifications

Edit `classify_bjj_videos.py`:

1. Add to `BJJ_GLOSSARY`:
```python
"your_technique": [
    "keyword1", "keyword2", "keyword-variant"
]
```

2. Add to appropriate category in `CATEGORY_GROUPS`

3. Optionally add emoji in `GUARD_EMOJIS` (for guard types)

### Customize Web App Theme

Edit `style.css` variables:

```css
:root {
    --primary-dark: #0a0e27;
    --accent-gold: #d4af37;
    --accent-blue: #4a9eff;
    /* Modify other colors as needed */
}
```

### Change Banner Image

Replace `banner.png` with your own image (recommended: 1920x400px)

## 🔧 Troubleshooting

### API Issues

**"API key not valid"**
- Verify YouTube Data API v3 is enabled
- Check API key is correctly copied
- Ensure no extra spaces in the key

**"Quota exceeded"**
- Wait 24 hours for quota to reset
- Reduce `max_results_per_channel`
- Request quota increase in Google Cloud Console

**"Channel not found"**
- Use channel handle format: `@ChannelName`
- Verify channel exists and is public
- Try using the exact channel URL handle

### Classification Issues

**No classifications appearing**
- Ensure `bjj_videos_simple.json` exists
- Run `classify_bjj_videos.py` after scraping
- Check that videos have titles/descriptions

**Missing classifications**
- Add more keywords to `BJJ_GLOSSARY`
- Check for spelling variations
- Verify video metadata contains technique names

### Web App Issues

**Videos not loading**
- Ensure `bjj_simple_processed.json` exists
- Check browser console for errors (F12)
- Verify JSON file is valid

**Images not showing**
- Check internet connection (thumbnails from YouTube)
- Verify `banner.png` exists for hero banner
- Check browser cache and refresh (Ctrl+F5)

### Python Errors

**Module not found**
```bash
pip install google-api-python-client
```

**Wrong Python version**
- Use Python 3.9 or higher
- Check: `python --version`

## 📊 Data Format

### bjj_videos_simple.json
```json
{
  "title": "Armbar from Closed Guard",
  "description": "Learn this essential submission...",
  "tags": ["bjj", "submission", "armbar"],
  "youtube_link": "https://www.youtube.com/watch?v=...",
  "view_count": 15000
}
```

### bjj_simple_processed.json
```json
{
  "title": "Armbar from Closed Guard",
  "description": "Learn this essential submission...",
  "tags": ["bjj", "submission", "armbar"],
  "youtube_link": "https://www.youtube.com/watch?v=...",
  "view_count": 15000,
  "classification": {
    "guard_type": ["🔒 Closed Guard"],
    "submission": ["Armbar"]
  }
}
```

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- Add more BJJ channels
- Expand classification keywords
- Improve UI/UX design
- Add new features (favorites, playlists, etc.)
- Translate to other languages
- Create mobile app version

## 📝 License

This project is for educational purposes. YouTube content belongs to respective channel owners.

## 🙏 Acknowledgments

- Inspired by Isaac Asimov's *Foundation* series
- All BJJ instructors sharing knowledge on YouTube
- The BJJ community for preserving and spreading technique

## 📮 Contact

For questions, suggestions, or issues, please open an issue on the project repository.

---

**Made with 💙 for the BJJ community**

*"Violence is the last refuge of the incompetent... but in BJJ, technique is the refuge of the knowledgeable."*
