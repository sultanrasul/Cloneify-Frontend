document.getElementById("clone").addEventListener("click", async function () {
  access_token1 = localStorage.getItem('access_token1');
  access_token2 = localStorage.getItem('access_token2');
  const all = document.getElementById("all");  
  const songs = document.getElementById("songs"); 
  const playlist = document.getElementById("playlist"); 
  const albums = document.getElementById("albums"); 
  const books = document.getElementById("books"); 
  const episodes = document.getElementById("episodes"); 
  const shows = document.getElementById("shows"); 

  if (songs && songs.checked) {  
    await cloneSongs();
  } 
  if (albums && albums.checked) {  
    await cloneAlbums();
  } 
  if (podcasts && podcasts.checked) {  
    await clonePodcasts();
  } 
  if (episodes && episodes.checked) {  
    await cloneEpisodes();
  } 
  if (playlist && playlist.checked) {  
    await clonePlaylists();
  } 
});

async function cloneSongs() {
  access_token1 = localStorage.getItem('access_token1');
  access_token2 = localStorage.getItem('access_token2');
  let results;
  const totalSongs1 = totalData1.songs; 
  const allTracks = [];
  let totalRetrieved = 0;
  let songsSent = 0;
  
  while (totalRetrieved < totalSongs1) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?limit=50&offset=${totalRetrieved}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token1}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Fetch failed with status: " + response.status);
      break;
    }

    results = await response.json();
    for (let i = 0; i < results.items.length; i++) {
      allTracks.push(results.items[i]["track"]["id"]);
    }
    totalRetrieved += results.items.length;

    // Update progress bar
    const percentage = `${Math.round((totalRetrieved/(totalSongs1*2)) * 100)}%`;
    updateProgress("songs", percentage);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  allTracks.reverse();
const promises = [];

for (let i = 0; i < allTracks.length; i++) {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      fetch(`https://api.spotify.com/v1/me/tracks?ids=${allTracks[i]}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token2}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          console.error(`Failed to add track with id ${allTracks[i]}`);
        }

        // Update progress bar
        songsSent++;
        const percentage = `${Math.round(((totalRetrieved+songsSent)/(totalSongs1*2)) * 100)}%`;
        updateProgress("songs", percentage);
        fetch('https://api.spotify.com/v1/me/tracks?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
                    .then(response => response.json())
                    .then(data => {
                        const ActualTotalSongs = data.total;
                        document.querySelector(`#songs2 p`).innerHTML = `Total Liked Songs: ${ActualTotalSongs}`
                    })
                    .catch(error => { console.log(error) })
        resolve();
      });
    }, i * 250);
  });
  promises.push(promise);
  }
  await Promise.all(promises);
}

async function clonePodcasts() {
  access_token1 = localStorage.getItem('access_token1');
  access_token2 = localStorage.getItem('access_token2');
  let results;
  const totalPodcasts1 = totalData1.podcasts;
  const allPodcasts = [];
  let totalRetrieved = 0;
  let podcastsSent = 0;
  const promises = [];
  
  while (totalRetrieved < totalPodcasts1) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/shows?limit=50&offset=${totalRetrieved}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token1}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Fetch failed with status: " + response.status);
      break;
    }

    results = await response.json();
    for (let i = 0; i < results.items.length; i++) {
      allPodcasts.push(results.items[i]["show"]["id"]);
    }
    totalRetrieved += results.items.length;

    // Update progress bar
    const percentage = `${Math.round((totalRetrieved/(totalPodcasts1*2)) * 100)}%`;
    updateProgress("podcasts", percentage);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  allPodcasts.reverse();
  for (let i = 0; i < allPodcasts.length; i++) {
    const promise = fetch(`https://api.spotify.com/v1/me/shows?ids=${allPodcasts[i]}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token2}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to add track with id ${allPodcasts[i]}`);
      }

      // Update progress bar
      podcastsSent++;
      const percentage = `${Math.round(((totalRetrieved+podcastsSent)/(totalPodcasts1*2)) * 100)}%`;
      updateProgress("podcasts", percentage);
      return fetch('https://api.spotify.com/v1/me/shows?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
                    .then(response => response.json())
                    .then(data => {
                        const ActualTotalPodcasts = data.total;
                        document.querySelector(`#podcasts2 p`).innerHTML = `Total Podcasts: ${ActualTotalPodcasts}`
                    })
                    .catch(error => { console.log(error) })
    });
    promises.push(promise);
  }

  await Promise.all(promises);
}

async function cloneAlbums() {
  access_token1 = localStorage.getItem('access_token1');
  access_token2 = localStorage.getItem('access_token2');
  let results;
  const totalAlbums1 = totalData1.albums;
  const allAlbums = [];
  let totalRetrieved = 0;
  let albumsSent = 0;
  let promises = [];
  
  while (totalRetrieved < totalAlbums1) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/albums?limit=50&offset=${totalRetrieved}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token1}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Fetch failed with status: " + response.status);
      break;
    }

    results = await response.json();
    for (let i = 0; i < results.items.length; i++) {
      allAlbums.push(results.items[i]["album"]["id"]);
    }
    totalRetrieved += results.items.length;

    // Update progress bar
    const percentage = `${Math.round((totalRetrieved/(totalAlbums1*2)) * 100)}%`;
    updateProgress("albums", percentage);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  allAlbums.reverse();
  for (let i = 0; i < allAlbums.length; i++) {
    const promise = fetch(`https://api.spotify.com/v1/me/albums?ids=${allAlbums[i]}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token2}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        console.error(`Failed to add album with id ${allAlbums[i]}`);
      }

      // Update progress bar
      albumsSent++;
      const percentage = `${Math.round(((totalRetrieved+albumsSent)/(totalAlbums1*2)) * 100)}%`;
      updateProgress("albums", percentage);
      fetch('https://api.spotify.com/v1/me/albums?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
                  .then(response => response.json())
                  .then(data => {
                      const ActualTotalAlbums = data.total;
                      document.querySelector(`#albums2 p`).innerHTML = `Total Albums: ${ActualTotalAlbums}`
                  })
                  .catch(error => { console.log(error) })
    });
    promises.push(promise);
  }

  await Promise.all(promises);
}
async function cloneEpisodes() {
  access_token1 = localStorage.getItem('access_token1');
  access_token2 = localStorage.getItem('access_token2');
  let results;
  const totalEpisodes1 = totalData1.episodes;
  const allEpisodes = [];
  let totalRetrieved = 0;
  let episodesSent = 0;
  let promises = [];

  while (totalRetrieved < totalEpisodes1) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/episodes?limit=50&offset=${totalRetrieved}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token1}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Fetch failed with status: " + response.status);
      break;
    }

    results = await response.json();
    for (let i = 0; i < results.items.length; i++) {
      allEpisodes.push(results.items[i]["episode"]["id"]);
    }
    totalRetrieved += results.items.length;

    // Update progress bar
    const percentage = `${Math.round((totalRetrieved/(totalEpisodes1*2)) * 100)}%`;
    updateProgress("episodes", percentage);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  allEpisodes.reverse();
  for (let i = 0; i < allEpisodes.length; i++) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        fetch(`https://api.spotify.com/v1/me/episodes?ids=${allEpisodes[i]}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token2}`,
          },
        })
        .then(response => {
          if (!response.ok) {
            console.error(`Failed to add episode with id ${allEpisodes[i]}`);
          }

          // Update progress bar
          episodesSent++;
          const percentage = `${Math.round(((totalRetrieved+episodesSent)/(totalEpisodes1*2)) * 100)}%`;
          updateProgress("episodes", percentage);
          fetch('https://api.spotify.com/v1/me/episodes?limit=1', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token2}` } })
                    .then(response => response.json())
                    .then(data => {
                        const ActualTotalEpisodes = data.total;
                        document.querySelector(`#episodes2 p`).innerHTML = `Total Episodes: ${ActualTotalEpisodes}`
                    })
                    .catch(error => { console.log(error) })

          resolve();
        })
        .catch(error => {
          console.error(`Failed to add episode with id ${allEpisodes[i]}`);
          resolve();
        });
      }, i * 250);
    });

    promises.push(promise);
  }

  await Promise.all(promises);

  console.log("All requests have been sent.");
}
async function clonePlaylists() {
  access_token1 = localStorage.getItem('access_token1');
  access_token2 = localStorage.getItem('access_token2');
  let results;
  const totalPlaylists1 = totalData1.playlists;
  const allPlaylists = [];
  let totalRetrieved = 0;
  let clonedPlaylists = 0; // Counter for cloned playlists

  while (totalRetrieved < totalPlaylists1) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=50&offset=${totalRetrieved}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token1}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Fetch failed with status: " + response.status);
      break;
    }

    results = await response.json();
    for (let i = 0; i < results.items.length; i++) {
      allPlaylists.push(results.items[i]["id"]);
    }
    totalRetrieved += results.items.length;

    // Update progress bar
    const percentage = `${Math.round((totalRetrieved/(totalPlaylists1*2)) * 100)}%`;
    updateProgress("playlists", percentage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  allPlaylists.reverse();
  console.log(allPlaylists);

    for (let i = 0; i < allPlaylists.length; i++) {
      console.log(`Cloning playlist - ID: ${allPlaylists[i]}`)
      const trackURIs = await getAllTrackURIs(allPlaylists[i], access_token1);
      console.log(trackURIs);

      // Get the playlist image
      const imageResponse = await fetch(`https://api.spotify.com/v1/playlists/${allPlaylists[i]}/images`, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } });
      const imageData = await imageResponse.json();
      const imageUrl = imageData.length > 0 ? imageData[0]["url"] : null;
      
      // Get the playlist name and description
      const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${allPlaylists[i]}`, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token1}` } });
      const playlistData = await playlistResponse.json();
      const playlistName = playlistData.name;
      const playlistDescription = playlistData.description;

      // Create the new playlist
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${profile_id2}/playlists`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token2}`
        },
        body: JSON.stringify({
            'name': playlistName,
            'description': playlistDescription,
            'public': false
      })
    });

  // Wait for the response to finish
  await createResponse;
  
  
    // Get the ID of the new playlist
  const response = await fetch(
    `https://api.spotify.com/v1/me/playlists`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token2}`,
      },
    }
  );
  const results = await response.json();
  let playlist_id_new;
  for (let j = 0; j < results.items.length; j++) {
    if (results.items[j].name === playlistName) {
        playlist_id_new = results.items[j].id;
        break;
    }
}

  console.log(`Processing playlist "${playlistName}"`);
  if (imageUrl) {
    const toDataURL = url => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

  let base64Img;
  toDataURL(imageUrl)
    .then(dataUrl => {
      const parts = dataUrl.split(',')
      base64Img = parts[1]
      // console.log(base64Img)
      // Call the function to create the playlist with the base64 encoded image
    })
    .then(() => {
      console.log(playlist_id_new);
      if (imageUrl) {
        return fetch(`https://api.spotify.com/v1/playlists/${playlist_id_new}/images`, { 
          body: base64Img,
          method: 'PUT', 
          headers: { 
            'Content-Type': 'image/jpeg',   
            'Authorization': `Bearer ${access_token2}` 
          }, 
        })
        .catch(error => console.log(error));
      }
    });
} else {
  console.log(`No image found for playlist "${playlistName}"`);
    await createResponse;
    }
    await addTrackURIsToPlaylist(trackURIs, playlist_id_new, access_token2)
    clonedPlaylists++
    const percentage = `${Math.round(50+(clonedPlaylists/(totalPlaylists1*2)) * 100)}%`;
    console.log(percentage);
    updateProgress("playlists",percentage)
  }
}

async function toggle(source) {
    checkboxes = document.getElementsByName('all');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
}

async function checkLengthOfChecked(){
    const all = document.getElementById("all");  
    const length = document.querySelectorAll('input[type="checkbox"]:checked').length
    if (length == 6){
        all.checked = true;
}
}


async function updateProgress(type,percentage){
  type = type.toLowerCase();
  const progress = document.getElementById(`width${type}`);
  progress.style.width = percentage;
  const h1Element = document.querySelector(`#width${type} h1`);
  h1Element.textContent = percentage;
};

async function getAllTrackURIs(playlistId, accessToken) {
  const trackURIs = [];
  let total
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;
  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      console.error(`Failed to fetch playlist tracks: ${response.status} ${response.statusText}`);
      break;
    }
    const data = await response.json();
    trackURIs.push(...data.items.map(item => item.track.uri));
    url = data.next;
    total = data.total
  }
  console.log(`Fetched ${trackURIs.length} tracks out of ${total} in the playlist`);
  return trackURIs;
}

async function addTrackURIsToPlaylist(trackURIs, playlistId, accessToken) {
  const maxBatchSize = 100;
  const numBatches = Math.ceil(trackURIs.length / maxBatchSize);
  for (let i = 0; i < numBatches; i++) {
    const startIndex = i * maxBatchSize;
    const endIndex = (i + 1) * maxBatchSize;
    const batch = trackURIs.slice(startIndex, endIndex);
    await addBatchOfTracksToPlaylist(batch, playlistId, accessToken);
  }
}

async function addBatchOfTracksToPlaylist(trackURIs, playlistId, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: trackURIs
    })
  });
  if (!response.ok) {
    console.error(`Failed to add tracks to playlist: ${response.status} ${response.statusText}`);
  }
}