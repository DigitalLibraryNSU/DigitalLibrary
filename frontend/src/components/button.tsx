import styled from "styled-components";
import {FC} from "react";

type ButtonProps = {
    name: string;
};

const Button: FC<ButtonProps> = ({name}) => {
    return (
        <StyledWrapper>
            <button className="cta">
                <span className="hover-underline-animation"> {name} </span>
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .cta {
        border: none;
        background: none;
        cursor: pointer;
    }

    .cta span {
        padding-bottom: 7px;
        letter-spacing: 4px;
        font-size: 12px;
        text-transform: uppercase;
    }

    .cta svg {
        transform: translateX(-8px);
        transition: all 0.3s ease;
    }

    .cta:hover svg {
        transform: translateX(0);
    }

    .cta:active svg {
        transform: scale(0.9);
    }

    .hover-underline-animation {
        position: relative;
        color: black;
        padding-bottom: 20px;
    }

    .hover-underline-animation:after {
        content: "";
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #cf0000;
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
    }

    .cta:hover .hover-underline-animation:after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }

`;

export default Button;
