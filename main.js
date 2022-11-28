import Camera from './camera.js';
import Light from './light.js';
import Mesh from './mesh.js';

class Scene {
  constructor(gl) {
    // Camera virtual
    this.cam = new Camera(gl);

    // Luz
    this.light = new Light(2.0, 2.0, 2.0);
    this.light2 = new Light(-2.0, 2.0, -2.0);

    // Mesh
    this.mesh = new Mesh(3.0, gl);
    this.copy = new Mesh(-3.0, gl);

    // this.mesh = new Mesh(1.0, gl);
    // this.copy = new Mesh(-1.0, gl);

    Scene.vertexSelected = -2;
    Scene.meshSelected = 1;
    
  }

  static updateVertexSelection(vid, m){
    Scene.vertexSelected = vid
    Scene.meshSelected = m
  }

  async init(gl) {
    await this.mesh.loadMeshV4('model.obj');
    this.mesh.init(gl, this.light, this.light2);

    await this.copy.loadMeshV4('bunny2.obj')
    this.copy.init(gl, this.light, this.light2);
  }

  draw(gl) {  
    this.cam.updateCam();
    this.light.updateLight();
    this.light2.updateLight();

    if (Scene.vertexSelected != -2) {
      if (Scene.meshSelected == 1) this.mesh.callEstrela(Scene.vertexSelected);
      else this.copy.callEstrela(Scene.vertexSelected);
      Scene.vertexSelected = -2;
    }

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
    this.gl.canvas.width = 1280 * devicePixelRatio;
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
    Camera.updateProjectionType();
  }

  if (e.keyCode == 73 || e.keyCode == 105){ //tecla i/I para estrela da malha 1
    let resp = prompt("Insira o ID de um vertex da malha 1:", "-1");
    let text;
    if (resp == null || resp == "") {
      text = 'error'
    } else {
      Scene.updateVertexSelection(parseInt(resp), 1)
    }
  }
  if (e.keyCode == 79 || e.keyCode == 111){ //tecla o/O para estrela da malha 2
    let resp = prompt("Insira o ID de um vertex da malha 2:", "-1");
    let text;
    if (resp == null || resp == "") {
      text = 'error'
    } else {
      Scene.updateVertexSelection(parseInt(resp), 2)
    }
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}


