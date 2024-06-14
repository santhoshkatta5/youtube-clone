// src/components/VideoPlayPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { YOUTUBE_API_KEY } from '../config';
import './VideoPlayPage.css'; // for styling

const VideoPlayPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        setVideo(response.data.items[0]);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    const fetchRelatedVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        setRelatedVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching related videos:', error);
      }
    };

    fetchVideoDetails();
    fetchRelatedVideos();
  }, [videoId]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-play-page">
      <div className="video-player">
        <iframe
          title={video.snippet.title}
          width="640"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="related-videos">
        {relatedVideos.map((related) => (
          <div key={related.id.videoId} className="related-video-card">
            <Link to={`/video/${related.id.videoId}`}>
              <img
                src={related.snippet.thumbnails.default.url}
                alt={related.snippet.title}
              />
              <div className="related-video-info">
                <h4>{related.snippet.title}</h4>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayPage;
