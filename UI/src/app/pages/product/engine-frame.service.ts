import {
    AnimationMixer,
    Clock,
    Color,
    DirectionalLight,
    HemisphereLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
  } from 'three';
  
  import {
    GLTF,
    GLTFLoader
  } from 'three/examples/jsm/loaders/GLTFLoader';
  
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Injectable, OnDestroy } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EngineFrameService  {
    aspect: number;
    camera: PerspectiveCamera;
    container: HTMLElement;
    controls: OrbitControls;
    hemisphere: HemisphereLight;
    loader: GLTFLoader;
    mainLight: DirectionalLight;
    scene: Scene;
  
    deltaX = 0.01;
    deltaY = 0.01;
    deltaZ = 0.01;
    far = 100;
    fov = 35;
    gammaFactor = 2.2;
    gammaOutput = true;
    near = 1;
    physicallyCorrectLights = true;
    sceneBackground = 0x8fbcd4;
    renderer = new WebGLRenderer({ antialias: true });
  
    clock = new Clock();
    mixers = new Array<AnimationMixer>();    
    itemPosition = new Vector3(0, 0, 0);
    itemUrl = ''
    
    directionalLightOptions = {
      color: 0xffffff,
      intensity: 5
    };
  
    hemisphereOptions = {
      skyColor: 0xddeeff,
      groundColor: 0x0f0e0d,
      intensity: 5
    };
  
    // CAMERA
  
    private createCamera = () => {
      this.camera = new PerspectiveCamera(
        this.fov,
        this.aspect,
        this.near,
        this.far
      );
  
      // this.camera.position.set(-75, 35, 142);
      this.camera.position.set(-1.5, 1.5, 6.5);
    }
  
    // CONTROLS
  
    private createControls = () => this.controls = new OrbitControls(this.camera, this.container);
  
    // LIGHTING
  
    private createLight = () => {
      this.hemisphere = new HemisphereLight(
        this.hemisphereOptions.skyColor,
        this.hemisphereOptions.groundColor,
        this.hemisphereOptions.intensity
      );
  
      this.mainLight = new DirectionalLight(
        this.directionalLightOptions.color,
        this.directionalLightOptions.intensity
      );
      this.mainLight.position.set(10, 10, 10);
  
      this.scene.add(this.hemisphere, this.mainLight);
    }
  
    // GEOMETRY
  
     private  createModels = async () => {
      this.loader = new GLTFLoader();
      const loadModel = (gltf: GLTF, position: Vector3) => {
        const model = gltf.scene.children[0];
        model.position.copy(position);
        model.scale.set(0.02, 0.02, 0.02);
  
        const animation = gltf.animations[0];
  
        const mixer = new AnimationMixer(model);
        this.mixers.push(mixer);
  
        const action = mixer.clipAction(animation);
        action.play();
  
        this.scene.add(model);
      }
  
      const gltf = await this.loader.loadAsync(this.itemUrl);
      loadModel(gltf, this.itemPosition)
    }
  
    // RENDERER
  
    private onWindowResize = () => {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer && this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  
    private createRenderer = () => {
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
  
      this.renderer.gammaFactor = this.gammaFactor;
      this.gammaOutput = true;
      this.renderer.physicallyCorrectLights = true;
  
      this.container.appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize);
    }
  
    // INITIALIZATION
  
    private update = () => {
      const delta = this.clock.getDelta();
      this.mixers.forEach(x => x.update(delta));
    }
  
    private render = () => this.renderer.render(this.scene, this.camera);
  
    start = () => this.renderer.setAnimationLoop(() => {
      this.update();
      this.render();
    });
  
    stop = () => this.renderer.setAnimationLoop(null);
  
    initialize = (container: HTMLElement, itemUrl: string) => {
      this.itemUrl = itemUrl;
      this.container = container;
      this.scene = new Scene();
      this.scene.background = new Color(this.sceneBackground);
      this.aspect = container.clientWidth / container.clientHeight;
  
      this.createCamera();
      this.createControls();
      this.createLight();
      this.createModels();
      this.createRenderer();
      this.start();
    }
}