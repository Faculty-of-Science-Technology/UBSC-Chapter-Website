// Generate a random HEX color that works well with white text.
export function randomColor(nohash: boolean = false) {
    // Attr: https://github.com/jeongyk89/jeongyk89.github.io/blob/ba79dcf1d7f227ba773d2c14a6923444a08db0a5/playground/artwork4.html#L30
    const letters = '0123456789ABCDEF';
    let color = '';
    if (!nohash) color += '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}