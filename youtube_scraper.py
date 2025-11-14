"""
YouTube API Script to fetch videos and shorts from BJJ channels
Requires: google-api-python-client
Install with: pip install google-api-python-client
"""

import json
import sys
import re
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import socket
import time

# Read API key from environment variable (for CI/CD) or use hardcoded value (for local dev)
API_KEY = os.environ.get('YOUTUBE_API_KEY')

# List of BJJ channels to scrape
BJJ_CHANNELS = ["@JonThomasBJJ",
    "@TarikBJJ"
    , "@JordanTeachesJiujitsu", "@DefensiveBJJ", "@LachlanGilesBJJ", "@KeenanCornelius", "@WrestlingUniversity", "@LIMIBJJ", "@jjbcanape", "@josephbreza-grappling9459", "@shintaronakano2842", "@FrenchGuianajiu-jitsuTV",
    "@InvisibleJiuJitsu", "@kurtosiander", "@Chewjitsu", "@BJJFanatics", "@BJJScout", "@LEONLARMAN", "@DubiousDom", "@Heather_MorganBJJ",
    "@GracieBreakdown", "@BJJLibrary", "@BernardoFariaBJJ", "@MMALeech", "@ZombieProofBJJ", #
    "@Wardziak", "@EnergiaMartialArts", "@vincenguyenbjj", "@Grapplers_Guide", "@atosjiujitsuhq", "@bzglick", "@Shigashi84",
    "@BTeamJiuJitsu", "@BJJGlobetrotters", "@JiuJitsuInMinutesbyJasonScully", "@SticksandStonesBJJ", "@EnergiaMartialArts"
    "@nathanorchard10p", "@ArnaudPiétéUnidade", "@YoshiJiuJitsuTech", "@zukaBJJ", "@yogaforbjj", "@darkhorsemartialarts","@roydean", "@1MinuteJiuJitsu","@samir.bensaid", "@ArtofJiuJitsu", "@mendesbros", "@Submissions101", "@DeepDiveJJ",
"@BJJTrickster", "@poundforpoundmunich", "@BirdWiltseBjj", "@10thplanetnetwork42", "@brandonmcninja", "@10thPlanetBathNY", "@twistereddie","@Gordonlovesjiujitsu", "@lutaonthemat", "@JiuJitsuFlo" ,  "@TeachMeGrapping"#, "UCBNsOFfO-TZDIpygfz5paa"
]


# Example list of 'fight & match' channels (events, match highlights)
# You can add or remove channels here (use the channel handle or name)
FIGHT_CHANNELS = [
    "@Flograppling", "@ArtofJiuJitsu","@BTeamJiuJitsu", "@adcc-official",
    "@IBJJF", "@polarisbjj", "@ufcbjjofficial"
    # "@FloGrapplingHighlights",
    # "@UFC"  # optional — replace with whatever fight/match channels you want
]


def get_youtube_service():
    """Initialize YouTube API service"""
    try:
        service = build('youtube', 'v3', developerKey=API_KEY)
        return service
    except Exception as e:
        print(f"Error creating YouTube service: {e}")
        print("Please check your internet connection and API key.")
        raise


def get_channel_id(youtube, channel_name):
    """Get channel ID from channel name"""
    try:
        request = youtube.search().list(
            part='snippet',
            q=channel_name,
            type='channel',
            maxResults=1
        )
        response = request.execute()
        
        if response['items']:
            channel_id = response['items'][0]['snippet']['channelId']
            print(f"Found channel ID for '{channel_name}': {channel_id}")
            return channel_id
        else:
            print(f"Channel '{channel_name}' not found")
            return None
    except HttpError as e:
        print(f"An HTTP error occurred: {e}")
        return None
    except socket.error as e:
        print(f"Connection error for '{channel_name}': {e}")
        print("This might be a network/firewall/proxy issue.")
        return None
    except Exception as e:
        print(f"Unexpected error for '{channel_name}': {e}")
        return None


def resolve_channel_identifier(youtube, channel_input):
    """Resolve a channel identifier.

    If the input is already a channel ID (starts with 'UC' or is embedded in a '/channel/<id>' URL)
    return it directly. Otherwise, treat the input as a channel name/handle and search for it.
    """
    if not channel_input:
        return None

    raw = str(channel_input).strip()

    # Detect channel URL with /channel/<id>
    m = re.search(r"/channel/([A-Za-z0-9_-]+)", raw)
    if m:
        channel_id = m.group(1)
        print(f"Detected channel ID in URL for '{channel_input}': {channel_id}")
        return channel_id

    # If it looks like a channel ID (most start with 'UC'), return it
    if raw.startswith('UC') and re.match(r'^UC[0-9A-Za-z_-]{8,}$', raw):
        print(f"Using provided channel ID: {raw}")
        return raw

    # Otherwise assume it's a handle or display name; strip leading @ if present
    search_name = raw.lstrip('@')
    return get_channel_id(youtube, search_name)


def get_channel_videos(youtube, channel_id, max_results=5000):
    """Fetch all videos and shorts from a channel"""
    videos = []
    
    try:
        # Get uploads playlist ID
        request = youtube.channels().list(
            part='contentDetails',
            id=channel_id
        )
        response = request.execute()
        
        if not response['items']:
            print(f"No channel found with ID: {channel_id}")
            return videos
        
        uploads_playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        
        # Fetch videos from uploads playlist
        next_page_token = None
        
        while True:
            playlist_request = youtube.playlistItems().list(
                part='snippet',
                playlistId=uploads_playlist_id,
                maxResults=5000,
                pageToken=next_page_token
            )
            playlist_response = playlist_request.execute()
            
            video_ids = [item['snippet']['resourceId']['videoId'] 
                        for item in playlist_response['items']]
            
            # Get detailed video information
            videos_request = youtube.videos().list(
                part='snippet,contentDetails,statistics',
                id=','.join(video_ids)
            )
            videos_response = videos_request.execute()
            
            # Extract video details
            for video in videos_response['items']:
                video_data = {
                    'title': video['snippet']['title'],
                    'description': video['snippet']['description'],
                    'tags': video['snippet'].get('tags', []),
                    'youtube_link': f"https://www.youtube.com/watch?v={video['id']}",
                    'published_at': video['snippet']['publishedAt'],
                    'channel_title': video['snippet']['channelTitle'],
                    'video_id': video['id'],
                    'duration': video['contentDetails']['duration'],
                    'view_count': video['statistics'].get('viewCount', 0),
                    'like_count': video['statistics'].get('likeCount', 0),
                    'comment_count': video['statistics'].get('commentCount', 0),
                    'thumbnail': video['snippet']['thumbnails']['high']['url'],
                    'default_language': video['snippet'].get('defaultLanguage', 'unknown'),
                    'default_audio_language': video['snippet'].get('defaultAudioLanguage', 'unknown')
                }
                # Add channel name explicitly
                video_data['channel_name'] = video['snippet']['channelTitle']
                videos.append(video_data)
            
            next_page_token = playlist_response.get('nextPageToken')
            
            # Check if we've reached the max results or no more pages
            if not next_page_token or (max_results and len(videos) >= max_results):
                break
        
        print(f"Fetched {len(videos)} videos from channel")
        return videos[:max_results] if max_results else videos
        
    except HttpError as e:
        print(f"An HTTP error occurred: {e}")
        return videos


def scrape_all_channels(channel_names, max_results_per_channel= 5000):
    """Scrape videos from all specified channels"""
    youtube = get_youtube_service()
    all_videos = []
    
    for channel_name in channel_names:
        print(f"\n{'='*60}")
        print(f"Processing channel: {channel_name}")
        print(f"{'='*60}")

        # Resolve channel identifier (accept raw IDs, channel URLs, or handles)
        channel_id = resolve_channel_identifier(youtube, channel_name)

        if channel_id:
            # Get videos from channel
            videos = get_channel_videos(youtube, channel_id, max_results_per_channel)
            all_videos.extend(videos)
            print(f"Total videos collected so far: {len(all_videos)}")
    
    return all_videos


def save_to_json(data, filename='bjj_videos.json'):
    """Save video data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\n{'='*60}")
    print(f"Data saved to {filename}")
    print(f"Total videos: {len(data)}")
    print(f"{'='*60}")


def scrape_and_save_fight_channels(channel_names, max_results_per_channel=5000, output_file='fight_simple.json'):
    """Scrape fight/match channels and save a simplified JSON file.

    This re-uses existing scraping helpers and writes a minimal JSON similar to the
    simplified BJJ output (channel_name, title, description, tags, youtube_link, view_count, language).
    """
    print('\nStarting fight/match channels scrape...')
    youtube = get_youtube_service()
    all_videos = []

    for channel_name in channel_names:
        print(f"\n{'='*60}")
        print(f"Processing fight channel: {channel_name}")
        print(f"{'='*60}")

        channel_id = resolve_channel_identifier(youtube, channel_name)
        if channel_id:
            videos = get_channel_videos(youtube, channel_id, max_results_per_channel)
            all_videos.extend(videos)

    if not all_videos:
        print('No fight/match videos collected.')
        return None

    def extract_athletes_from_title(title: str):
        """Try to extract athlete names from titles using common separators like 'vs', 'v.', 'vs.' or '-'.

        This function aggressively strips trailing event info from each side. It:
        - removes parenthetical content
        - splits on common separators (|, -, :, —, –) and keeps the first segment
        - removes trailing keywords like 'Highlights', 'Full Match', event names like 'IBJJF', 'ADCC'
        - strips year tokens like '2023'
        - attempts to capture a leading name phrase using a capitalized-word heuristic
        """
        if not title:
            return []

        # Normalize spacing / NBSP
        t = title.replace('\xa0', ' ').strip()

        # Acceptable separators to split the main title into two sides
        separators = [r" vs ", r" v. ", r" vs. ", r" v "]

        def remove_parens(s: str) -> str:
            return re.sub(r"\(.*?\)", "", s).strip()

        def remove_trailing_event_info(s: str) -> str:
            # Cut on common secondary separators and keep the first chunk
            s = re.split(r"\|| — | – | - |:|\u2013|\u2014", s)[0]
            # Remove common trailing words that indicate events or extras
            s = re.sub(r"\b(Highlights|Highlight|Full Match|Full Fight|Replay|Semifinal|Final|Quarterfinal|Quarter-finals|Round\s*\d+|ADCC|IBJJF|Polaris|Eternal|202\d)\b", "", s, flags=re.I)
            # Remove standalone year tokens
            s = re.sub(r"\b20\d{2}\b", "", s)
            return s.strip()

        def leading_name_hint(s: str) -> str:
            # Try to extract a leading name (allow small particles like 'de', 'da', 'van') up to 5 words
            m = re.match(r"^([A-Z][\w'\.-]+(?:\s+(?:[A-Z][\w'\.-]+|de|da|do|dos|van|von|la|le|del|di)){0,4})", s)
            if m:
                return m.group(1).strip()
            # If no capitalized match, fallback to the cleaned string
            return s.strip()

        # Try separators in order
        for sep in separators:
            if sep in t:
                parts = [p.strip() for p in re.split(re.escape(sep), t, maxsplit=1) if p.strip()]
                if len(parts) >= 2:
                    left = remove_parens(parts[0])
                    right = remove_parens(parts[1])

                    left = remove_trailing_event_info(left)
                    right = remove_trailing_event_info(right)

                    # Try to extract a more focused name from each side
                    a1 = leading_name_hint(left)
                    a2 = leading_name_hint(right)

                    # Validate that these look like names (contain letters)
                    if re.search(r"[A-Za-z]", a1) and re.search(r"[A-Za-z]", a2):
                        return [a1, a2]

        # Fallback regex: 'Name1 vs Name2' anywhere in title
        m = re.search(r"([A-Z][\w'\.-]+(?:\s+[A-Z][\w'\.-]+)*)\s+vs\.?\s+([A-Z][\w'\.-]+(?:\s+[A-Z][\w'\.-]+)*)", t, flags=re.I)
        if m:
            return [m.group(1).strip(), m.group(2).strip()]

        return []

    simplified = []
    for v in all_videos:
        title = v.get('title', '')
        athletes = extract_athletes_from_title(title)
        simplified.append({
            'channel_name': v.get('channel_name'),
            'title': title,
            'description': v.get('description'),
            'tags': v.get('tags', []),
            'youtube_link': v.get('youtube_link'),
            'view_count': int(v.get('view_count', 0)) if v.get('view_count') is not None else 0,
            'language': v.get('default_audio_language', v.get('default_language', 'unknown')),
            'athletes': athletes
        })

    save_to_json(simplified, output_file)
    return simplified


def main():
    """Main execution function - alternates between technique and fight channels based on day of week"""
    import datetime
    
    # Check if API key is set
    if API_KEY == 'YOUR_API_KEY_HERE':
        print("\n" + "!"*60)
        print("ERROR: Please set your YouTube API key in the script!")
        print("Get your API key from: https://console.cloud.google.com/")
        print("!"*60)
        return
    
    # Determine what to scrape based on day of week
    # Monday=0, Tuesday=1, ..., Sunday=6
    # Odd days (Mon, Wed, Fri, Sun): scrape technique channels
    # Even days (Tue, Thu, Sat): scrape fight channels
    today = datetime.datetime.now()
    day_of_week = today.weekday()  # 0=Monday, 6=Sunday
    
    if day_of_week % 2 == 0:  # Even day (Mon, Wed, Fri)
        print("="*60)
        print(f"Today is {today.strftime('%A')} - Scraping TECHNIQUE channels")
        print("="*60)
        print(f"Channels to scrape: {', '.join(BJJ_CHANNELS)}")
        
        # Scrape technique channels
        all_videos = scrape_all_channels(BJJ_CHANNELS, max_results_per_channel=5000)
        
        # Save to JSON file
        if all_videos:
            save_to_json(all_videos, 'bjj_videos.json')
            
            # Also create a simplified version with just the requested fields
            simplified_videos = [
                {
                    'channel_name': video['channel_name'],
                    'title': video['title'],
                    'description': video['description'],
                    'tags': video['tags'],
                    'youtube_link': video['youtube_link'],
                    'view_count': int(video.get('view_count', 0)),
                    'language': video.get('default_audio_language', video.get('default_language', 'unknown'))
                }
                for video in all_videos
            ]
            save_to_json(simplified_videos, 'bjj_videos_simple.json')
        else:
            print("\nNo videos were collected.")
    
    else:  # Odd day (Tue, Thu, Sat, Sun)
        print("="*60)
        print(f"Today is {today.strftime('%A')} - Scraping FIGHT channels")
        print("="*60)
        print(f"Channels to scrape: {', '.join(FIGHT_CHANNELS)}")
        
        # Scrape fight/match channels
        scrape_and_save_fight_channels(FIGHT_CHANNELS, max_results_per_channel=20000, output_file='fight_simple.json')


if __name__ == '__main__':
    main()
