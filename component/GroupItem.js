import React from 'react';
import styled from 'styled-components';

const GroupItemStyle = styled.article`
border: 1px solid rgba(0, 0, 0, 0.1);
display: flex;
justify-content: center;
align-items: center;
box-sizing: border-box;
padding: 10px 20px;
background-color: #FFFFFF45;
position: relative;
/* width: calc(100% - 5px);
left: -5px; */

&:hover {
    filter: brightness(0.9);
}

&:active {
    filter: brightness(0.85);
}

> img, .img {
    width: 100px;
    max-width: 100px;
    min-width: 100px;
    max-height: 100px;
    min-height: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
        width: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img.logo {
        width: 60%;
    }
}

.img {
    position: relative;
    background: linear-gradient(to bottom right, ${(props) => props.outerColor} , ${(props) => props.innerColor });
    padding: 0px;
    margin: 0px;
}

&> div {
    flex: 1;
    box-sizing: border-box;
    padding: 20px 35px 20px 10px;
    position: relative;
    h2 {
        font-size: 1.2rem;
        line-height: 1.2rem;
        margin: 0px;
        padding: 0px;
    }
    [data-role="notification"] {
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        background-color: red;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFF;
    }
}
`;

const colorList = [
    "#462D3C",
    "#5D3642",
    "#7A4349",
    "#A05A52",
    "#BF7957",
    "#EDA05F",
    "#F3CCA1",
    "#B6D43B",
    "#70AA34",
    "#397A43",
    "#3C5956",
    "#302B2E",
    "#595252",
    "#7C6F70",
    "#A0938D",
    "#CFC6B8",
    "#DFF6F5",
    "#89EBF0",
    "#28CCDF",
    "#3877A7",
    "#394677",
    "#39314A",
    "#8E468B",
    "#CC6093",
    "#FEAEB6",
    "#F4B41A",
    "#F47D1C",
    "#E6472D",
    "#A83B3B",
    "#816F94",
    "#4E536A"
]

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function isDark(hex1, hex2) {
    let color1 = hexToRgb(hex1)
    let color2 = hexToRgb(hex2)
    let val = 0, count = 0;
    if(color1) {
        val += RGBtoHSV(color1.r, color1.g, color1.b).v
        count += 1
    }
    if(color2) {
        val += RGBtoHSV(color2.r, color2.g, color2.b).v
        count += 1
    }
    if(count > 0) return val/count < 0.9;
    return false;
}

function translateColorItem(hashId, isReverse) {
    if (isReverse) {
        let sum = 0;
        for(let i = 0; i < hashId.length; i++) {
            sum += hashId[i].charCodeAt(0) * hashId[i].charCodeAt(0)
            if(i > 0) {
                sum -= hashId[i-1].charCodeAt(0)
            }
        }
        return sum % colorList.length;
    } else {
        let sum = 0;
        for (let i = hashId.length - 1; i >= 0; i--) {
            sum += hashId[i].charCodeAt(0)
            if (i > 0) {
                sum += (hashId[i - 1].charCodeAt(0) - hashId[i].charCodeAt(0))
            }
        }
        return sum % colorList.length;
    }
}

const GroupItem = (props) => {
    const { item } = props;
    const innerColor = colorList[translateColorItem(item._id, false)]
    const outerColor = colorList[translateColorItem(item._id, true)]
    const isDarkImg = isDark(innerColor, outerColor);

    return (
        <GroupItemStyle
            innerColor={innerColor}
            outerColor={outerColor}
            onClick={props.onSelect}
        >
            <div className="img">
                <p>
                    <img src={isDarkImg ? "/static/resources/logo/light.png" : "/static/resources/logo/dark.png"} className="logo" alt="logo" />
                </p>
            </div>
            <div>
                <h2>{item.name}</h2>
                <div>
                    <span>Members {item.members.length}</span>
                </div>
                <div data-role="notification">
                    999+
                </div>
            </div>
        </GroupItemStyle>
    );
}

export default GroupItem;