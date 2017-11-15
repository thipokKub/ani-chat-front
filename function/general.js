
/**
 * randInt give random number in range [min, max] (inclusive, inclusive)
 */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This function will give random number between [num - ratio*num, num + ratio*num]
 */
export function randomRatio(num, ratio) {
    return random(num - ratio*num, num + ratio*num);
}