uniform vec3 uLightPosition;
uniform vec2 uResolution;
varying float vAlpha;
varying vec3 vVelocity;
varying vec3 vPosition;
varying float vLightDistance;

void main() {
  vec2 pos = 2.0 * gl_PointCoord - 1.0;
  float rad = dot(pos, pos);
  vec3 normal = vec3(pos, sqrt(1.0 - rad));
  vec3 lightDir = normalize(uLightPosition - vPosition) * vec3(1.0, -1.0, 1.0);
  float dist = clamp(vLightDistance, 0.0, 1.0);
  float color = max(dot(normal, lightDir), 0.0);
  // color += 0.2;
  float att = 1.0 / (1.0 + 0.1 * vLightDistance + 0.01 * vLightDistance * vLightDistance);
  float alpha = vAlpha - smoothstep(0.9, 1.0, length(pos));
  gl_FragColor = vec4(vec3(color), alpha);
}