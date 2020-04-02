uniform sampler2D uParticleT1;
uniform sampler2D uParticleT2;
uniform sampler2D uParticleT3;
uniform vec2 uResolution;
varying float vAlpha;
varying vec3 vVelocity;

void main() {
  vec4 color = texture2D(uParticleT3, gl_PointCoord);
  if (vVelocity.x > 0.) { color = texture2D(uParticleT1, gl_PointCoord); }
  if (vVelocity.y > 0.) { color = texture2D(uParticleT2, gl_PointCoord); }
  float alpha = color.a * vAlpha;
  gl_FragColor = vec4(color.rgb, alpha);
}