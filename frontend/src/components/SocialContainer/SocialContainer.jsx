import './SocialContainer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook, faXTwitter } from "@fortawesome/free-brands-svg-icons";

export default function SocialContainer() {
    return (
        <div className="social-container">
            <a href="#" className="social"><FontAwesomeIcon icon={faGoogle} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faXTwitter} /></a>
        </div>
    )
}