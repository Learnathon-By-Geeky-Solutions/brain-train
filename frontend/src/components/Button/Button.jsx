import "./Button.css";
import menuIcon from "../../assets/menu.png";

const iconNames = {
    menuIcon: menuIcon,
}

export default function Button({ icon, text, click }) {
    return (
        <button className="button" onClick={click}>
           {icon && <img className="button-icon" src={iconNames[icon]} alt="icon" />}
           {text && <span className='button-text'>{text}</span>}
        </button>
    )
}