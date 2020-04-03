import * as THREE from 'three';
import ThreeApp from "./base/ThreeApp";
import fragmentSource from "./shaders/fragment-particles.glsl";
import vertexSource from "./shaders/vertex-particles.glsl";

const PARTICLE_COUNT = 10000;
const PARTICLE_SPREAD = 50;
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
    this.createParticles();
    this.createLight();
  }

  createLight() {
    const { scene } = this.app;
    const geo = new THREE.SphereBufferGeometry(0.35, 15, 15);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geo, mat);
    this.light = mesh;
    scene.add(mesh);
  }

  createParticles() {
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
      uTime: { value: 0 },
      uSpread: { value: PARTICLE_SPREAD },
      uScale: { value: 4 },
      uSpeed: { value: 0.2 },
      uFadeOut: { value: 3 },
      uLightPosition: { value: new THREE.Vector3() },
      uResolution: { value: new THREE.Vector2() },
    };

    const mat = new THREE.ShaderMaterial({
      fragmentShader: fragmentSource,
      vertexShader: vertexSource,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      uniforms,
    });

    const mesh = new THREE.Points(geo, mat);
    this.uniforms = uniforms;
    this.pointsMesh = mesh;
    scene.add(mesh);
  }

  updateParticles(delta) {
    const { uniforms: u, app } = this;
    u.uTime.value += delta;
    u.uResolution.value.set(app.width, app.height);
    u.uLightPosition.value.copy(this.light.position);
  }

  onRender({ elapsedTime, delta, scene, camera, renderer }) {
    const { light } = this;
    this.updateParticles(delta);
    //light.position.copy(camera.position).multiplyScalar(0.5);
    renderer.render(scene, camera);
  }
}