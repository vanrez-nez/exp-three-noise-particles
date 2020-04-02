#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise4 = require(glsl-noise/classic/4d)

attribute vec3 velocity;
uniform float uTime;
uniform float uSpread;
uniform float uScale;
uniform float uFadeOut;
varying float vAlpha;
varying vec3 vVelocity;

#define PI 3.14159265359

void main() {
  vec3 v = normalize(velocity);
  vVelocity = v;
  vec3 p = position;
  float r = snoise3(p + (uTime * 0.01)) * PI * 2.;
  float x = p.x + cos(uTime * 0.1 + r) * uSpread * v.x;
  float y = p.y + sin(uTime * 0.1 + r) * uSpread * v.y;
  float z = p.z + cos(uTime * 0.1 + r) * uSpread * v.z;

  vec4 mvPosition = modelViewMatrix * vec4(vec3(x, y, z), 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (uSpread * uScale) / -mvPosition.z;
  vAlpha = clamp((uFadeOut) / -mvPosition.z, 0.1, 1.0);
}