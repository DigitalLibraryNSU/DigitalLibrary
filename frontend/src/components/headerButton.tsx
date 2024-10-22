import {FC} from "react";
import "../styles/headerButton.css"

type ButtonProps = {
    name: string;
};

const HeaderButton: FC<ButtonProps> = ({name}) => {
    return (
            <button className="header-button">
                <span className="header-button__underline"> {name} </span>
            </button>
    );
};

export default HeaderButton;
