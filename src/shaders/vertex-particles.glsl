#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

attribute vec3 velocity;

uniform float uTime;
uniform float uSpread;
uniform float uScale;
uniform float uSpeed;
uniform float uFadeOut;
uniform vec3 uLightPosition;
varying float vAlpha;
varying vec3 vVelocity;
varying float vLightDistance;
varying vec3 vPosition;

#define PI 3.14159265359


vec3 getWanderingPosition() {
  vec3 p = position;
  float t = uTime * uSpeed;
  float r = snoise2(p.xy + t * 0.01) * PI * 2.;
  float s = snoise2(p.xz + r) * 0.5;
  vec3 v = normalize(velocity) + s;
  float x = p.x + cos(t * 0.1 + r) * uSpread * v.x + s;
  float y = p.y + sin(t * 0.1 + r) * uSpread * v.y + s;
  float z = p.z + cos(t * 0.1 + r) * uSpread * v.z + s;
  return vec3(x, y, z);
}

void main() {

  vec3 wanderingPosition = getWanderingPosition();
  vec4 mvPosition = modelViewMatrix * vec4(wanderingPosition, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (uSpread * uScale) / -mvPosition.z;

  vec4 vertexWorldPosition = modelMatrix * vec4(wanderingPosition, 1.0);
  vLightDistance = distance(uLightPosition, vertexWorldPosition.xyz);
  vVelocity = velocity;
  vPosition = wanderingPosition;
  vAlpha = clamp((uFadeOut) / -mvPosition.z, 0.1, 1.0);
}