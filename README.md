# 🎧 Spotify Account Cloner (Frontend)

Developed end-to-end by **Sultan Rasul**, this frontend powers the **Spotify Account Cloner**, a web app that allows users to securely sign in with two Spotify accounts and transfer playlists, liked songs, albums, podcasts, and episodes between them.

It provides a fully interactive interface for **Spotify OAuth 2.0 authorisation**, visual **progress tracking**, and seamless data cloning

⚠️ *The app is currently in Spotify Developer Test Mode and has not yet been approved by Spotify.  
To log in and allow the website to fetch your Spotify data, you must be added as a tester.  
Please get in touch with me with your Spotify email if you’d like access.*  

🔗 **Live Site:** [Spotify Account Cloner](https://cloner.sultanrasul.com)  
🔗 **Backend Repository:** [Spotify Account Cloner (Backend)](https://github.com/sultanrasul/Cloneify-Backend)

---

## 🧠 Overview

This frontend handles:

- Dual Spotify account login via backend-managed OAuth 2.0 authorisation  
- Secure token storage in the browser (`localStorage`)  
- Fetching user data (playlists, songs, albums, podcasts, etc.) from Spotify’s Web API  
- One-click cloning of playlists and media between profiles  
- Real-time progress display for each media category  
- Automatic token refresh and UI updates  

The system uses the backend for authentication, while all cloning operations occur client-side using Spotify’s public APIs.

---

## 🔐 Authorisation Flow

1. The user logs in to two different Spotify accounts (Account 1 and Account 2).  
2. Each login triggers an OAuth 2.0 authorisation handled by the backend (`/backend/login1` and `/backend/login2`).  
3. Tokens are saved locally and refreshed automatically when expired.  
4. The user selects which categories to clone — playlists, songs, albums, podcasts, or episodes.  
5. The app fetches all media from Account 1 and recreates them in Account 2.  

Progress is displayed in real time using animated progress bars for each category.

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/sultanrasul/Spotify-Account-Cloner-Frontend.git
cd Spotify-Account-Cloner-Frontend

# 2. Ensure the backend is running (port 8888 by default)

# 3. Open index.html in your browser or serve locally
# Example:
npx serve .
```
This frontend communicates with the backend hosted at:
📡 https://cloner.sultanrasul.com/backend

---

## 🌐 Key Features

| Feature | Description |
|----------|--------------|
| Dual Login | Authenticate two Spotify accounts simultaneously |
| Token Management | Auto-refresh and secure local storage of access tokens |
| Media Cloning | Copy playlists, songs, albums, podcasts, and episodes |
| Progress Tracking | Live progress bars for each media type cloned |
| Profile Overview | Display account info, total playlists, followers, etc. |
| Error Handling | Graceful recovery and user notifications |

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend Integration | Express.js (OAuth authorisation + token exchange) |
| APIs | Spotify Web API |
| Storage | LocalStorage |
| Hosting | Nginx / Cloud / Static Hosting |
| Deployment | Compatible with modern browsers |

---

## 🧩 Backend Integration

This frontend is tightly integrated with the **Spotify Account Cloner Backend**, which provides all secure authorisation and token exchange endpoints.

Ensure the following environment consistency:
- The backend URL in `app.js` matches your hosted or local backend (e.g. `https://cloner.sultanrasul.com/backend`)
- Both services use the same Spotify app credentials and redirect URIs

Once connected, the frontend can clone all selected Spotify data from one account to another in a few clicks.

