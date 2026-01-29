declare module "simplex-noise" {
  export type NoiseFunction3D = (x: number, y: number, z: number) => number;

  export default class SimplexNoise {
    constructor(randomOrSeed?: string | (() => number));
    noise2D(x: number, y: number): number;
    noise3D(x: number, y: number, z: number): number;
    noise4D(x: number, y: number, z: number, w: number): number;
  }

  export function createNoise3D(
    randomOrSeed?: string | (() => number),
  ): NoiseFunction3D;
}
