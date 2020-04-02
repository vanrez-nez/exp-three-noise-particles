import * as THREE from 'three';
import ThreeApp from "./base/ThreeApp";
import fragmentSource from "./shaders/fragment-particles.glsl";
import vertexSource from "./shaders/vertex-particles.glsl";
import particleT1Url from '../images/particle-circle-t1.png';
import particleT2Url from '../images/particle-circle-t2.png';
import particleT3Url from '../images/particle-circle-t3.png';

const PARTICLE_COUNT = 2000;
const PARTICLE_SPREAD = 10;
export default class Demo {
  constructor() {
    this.app = new ThreeApp({
      onRenderCallback: this.onRender.bind(this),
      orbitControls: true,
      skyDome: false,
      axesHelper: true,
    });
    this.setup();
    this.app.start();
  }

  setup() {
    const { scene } = this.app;

    // Geometry
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
      vertices[i + 0] = THREE.MathUtils.randFloatSpread(PARTICLE_SPREAD);
      vertices[i + 1] = THREE.MathUtils.randFloatSpread(PARTICLE_SPREAD);
      vertices[i + 2] = THREE.MathUtils.randFloatSpread(PARTICLE_SPREAD);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const velocity = [];
    for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
      velocity[i + 0] = THREE.MathUtils.randFloat(-1, 1);
      velocity[i + 1] = THREE.MathUtils.randFloat(-1, 1);
      velocity[i + 2] = THREE.MathUtils.randFloat(-1, 1);
    }
    geo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocity, 3));

    // Material
    const uniforms = {
      uParticleT1: { value: new THREE.TextureLoader().load(particleT1Url) },
      uParticleT2: { value: new THREE.TextureLoader().load(particleT2Url) },
      uParticleT3: { value: new THREE.TextureLoader().load(particleT3Url) },
      uTime: { value: 0 },
      uSpread: { value: PARTICLE_SPREAD },
      uScale: { value: 8 },
      uFadeOut: { value: 2 },
      uResolution: { value: new THREE.Vector2() },
    };
    const mat = new THREE.ShaderMaterial({
      fragmentShader: fragmentSource,
      vertexShader: vertexSource,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      uniforms,
    });

    const mesh = new THREE.Points(geo, mat);
    this.uniforms = uniforms;
    this.pointsMesh = mesh;
    scene.add(mesh);
  }

  updateParticles(delta) {
    const { uniforms: u, app } = this;
    u.uTime.value += delta * 0.5;
    u.uResolution.value.set(app.width, app.height);
  }

  onRender({ delta, scene, camera, renderer }) {
    this.updateParticles(delta);
    renderer.render(scene, camera);
  }
}