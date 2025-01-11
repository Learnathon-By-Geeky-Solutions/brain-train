import './VideoPlayer.css';
import video from '../../assets/bg-video.mp4';

export default function VideoPlayer() {
    return (
        <div className="video-player">
            <video className="video" autoPlay loop muted>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}