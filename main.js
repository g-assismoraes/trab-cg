import Camera from './camera.js';
import Light from './light.js';
import Mesh from './mesh.js';

class Scene {
  constructor(gl) {
    // Camera virtual
    this.cam = new Camera(gl);

    // Luz
    this.light2 = new Light(40.0, 10.0, 40.0);
    this.light = new Light(-40.0, 10.0, -40.0);

    // Mesh
    this.mesh = new Mesh(10.0, gl);
    this.copy = new Mesh(-10.0, gl);

    // this.mesh = new Mesh(1.0, gl);
    // this.copy = new Mesh(-1.0, gl);
  }

  async init(gl) {
    await this.mesh.loadMeshV4();
    this.mesh.init(gl, this.light, this.light2);

    await this.copy.loadMeshV4()
    this.copy.init(gl, this.light, this.light2);
  }

  draw(gl) {  
    this.cam.updateCam();
    this.light.updateLight();
    this.light2.updateLight();

    this.mesh.draw(gl, this.cam, this.light, this.light2);
    this.copy.draw(gl, this.cam, this.light, this.light2);
  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");

    this.gl = canvas.getContext("webgl2");
    this.setViewport();

    this.scene = new Scene(this.gl);
    this.scene.init(this.gl).then(() => {
      this.draw();
    });
  }

  setViewport() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onkeypress = function (e) {
  e = e || window.event;
  if (e.keyCode == 112 || e.keyCode == 80) {
    Camera.updateProjectionType()
  }}

window.onload = () => {
  const app = new Main();
  app.draw();
}


