import * as THREE from 'three';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};


export default class Three {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      device.width / device.height,
      0.1,
      100
    );
    this.camera.position.set(0, 1, 5);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
     
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

   // this.composer = new EffectComposer( this.renderer );
    this.controls = new OrbitControls(this.camera, this.canvas);

    this.clock = new THREE.Clock();

    this.setLights();
    this.setGeometry();
    this.render();
    this.setResize();
  }

  setLights() {
    // this.ambientLight = new T.AmbientLight(new T.Color(1, 1, 1, 1));
    // this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(1,1,1)
    this.scene.add(this.directionalLight );
    this.helper = new THREE.DirectionalLightHelper( this.directionalLight , 5 );
    this.scene.add( this.helper );

  //   this.spotLight = new THREE.SpotLight( 0xffffff );
  //   this.spotLight.intensity=1
  //   this.spotLight.position.set( 1, 3, 1 );
  //  // this.spotLight.map = new THREE.TextureLoader().load( url );

  //   this.spotLight.castShadow = true;

  //   this.spotLight.shadow.mapSize.width = 1024;
  //   this.spotLight.shadow.mapSize.height = 1024;

    // this.spotLight.shadow.camera.near = 1;
    // this.spotLight.shadow.camera.far = 100;
    // this.spotLight.shadow.camera.fov = 30;

    // this.scene.add( this.spotLight );
    // this.helper2 = new THREE.SpotLightHelper( this.spotLight , 5 );
    // this.scene.add( this.helper2 );

  }

  setGeometry() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 128, 128);
    this.planeMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      wireframe: true,
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        progress: { type: 'f', value: 0 }
      }
    });

    this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.planeMesh.position.set(0,1,0)
    this.planeMesh.castShadow=true
   // this.scene.add(this.planeMesh);


    this.boxGeometry= new THREE.BoxGeometry(1,1,1)
     this.boxMaterial = new THREE.MeshStandardMaterial( {color: 0x00ff00} ); 
     this.cube = new THREE.Mesh(  this.boxGeometry,  this.boxMaterial ); 
     this.cube.castShadow=true
     this.cube.position.set(0,0.5,0)
     this.scene.add(  this.cube );


    this.planeGeometry2 = new THREE.PlaneGeometry(10, 10, 128, 128);
    this.testMaterial= new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    this.terrainPlain= new THREE.Mesh(this.planeGeometry2,  this.testMaterial)
    this.terrainPlain.rotation.set (-Math.PI / 2, 0,0 );
    this.terrainPlain.receiveShadow = true;
    this.scene.add(this.terrainPlain)

  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    //this.planeMesh.rotation.x = 0.2 * elapsedTime;
    //this.planeMesh.rotation.y = 0.1 * elapsedTime;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  //  this.composer.render();

  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
