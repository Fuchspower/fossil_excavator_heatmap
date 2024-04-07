import React from 'react';

// for some reason Math.gcd or Math.lcm do not exist in my environment -.-
export function gcd(a,b){
    let remainder = 0;
    while ((a % b > 0)) {
        remainder = a % b;
        a = b;
        b = remainder;
    }
    return b;
}

export function lcm(a, b){
    return a * b / gcd(a,b)
}

export function getCoordinatesByIndex(index, width){
    return {x: index % width + 1, y: Math.floor(index / width) + 1}
}

export function getIndexByCoordinates(x, y, width){
    return (y - 1) * width + x - 1;
}

export function getBlueHue(percentage, highlight){
    let ret = "#" // RGB Hex Value Prefix
         + ((highlight ? 0.8 : 1) * 255 * percentage >= 239.5 ? "0" : "") // leading 0 if R/G value is single-digit
         + (257 * (255 - Math.round((highlight ? 0.8 : 1) * 255 * percentage))).toString(16)  // 257_10 = 101_16, duplicating R and G value
         + "FF" // full blue
    console.log(ret)
    return ret
}