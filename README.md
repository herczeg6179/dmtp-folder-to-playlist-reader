# dmtp-folder-to-playlist-reader

The point of this repo is to provide various libraries that take a doler structure meant for the [DM Tool Music Player](https://github.com/herczeg6179/dm-tool-music-player) and produce a structured JSON that tells the player the available files.

The file structure should be a flat list of folders - these will be the playlists - and inside them a bunch of sound files - these are the tracks on the playlist.

So this:

```
baseFolder
└───playlist-1
│   └───file001.mp3
│   └───file002.mp3
|
└───playlist-2
│   └───file011.mp3
│   └───file012.mp3
│
└───playlist-3
    └───file021.mp3
    └───file022.mp3
```

Translates into this:

```
[
    {
        playlist: playlist-1,
        tracks: [
            { extension: mp3, name: file001, url: {baseUrl}/playlist-1/file001.mp3 },
            { extension: mp3, name: file002, url: {baseUrl}/playlist-1/file002.mp3 }
        ]
    },
    {
        playlist: playlist-2,
        tracks: [
            { extension: mp3, name: file011, url: {baseUrl}/playlist-2/file011.mp3 },
            { extension: mp3, name: file012, url: {baseUrl}/playlist-2/file012.mp3 }
        ]
    },
    {
        playlist: playlist-3,
        tracks: [
            { extension: mp3, name: file021, url: {baseUrl}/playlist-3/file021.mp3 },
            { extension: mp3, name: file022, url: {baseUrl}/playlist-3/file022.mp3 }
        ]
    }
]
```
