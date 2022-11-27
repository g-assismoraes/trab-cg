export default class Camera {
  constructor(gl) {
    this.x = 2.0
    this.y = 15.0
    // this.y = 1.0
    this.z = 2.0

    this.t = 0.0

    // Posição da camera
    this.eye = vec3.fromValues(this.x, this.y, this.z);

    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 1.0, 0.0);

    // Parâmetros da projeção
    this.fovy = Math.PI / 2;
    this.aspect = gl.canvas.width / gl.canvas.height;

    this.left = -50;
    this.right = 50;
    this.top = 50;
    this.bottom = -50;

    this.near = 0;
    this.far = 100;

    // Matrizes View e Projection
    this.view = mat4.create();
    this.proj = mat4.create();

    this.projectionType = 'perspective';
  }

  getView() {
    return this.view;
  }

  getProj() {
    return this.proj;
  }

  updateViewMatrix() {
    mat4.identity( this.view );
    mat4.lookAt(this.view, this.eye, this.at, this.up);
    // TODO: Tentar implementar as contas diretamente
  }

  updateProjectionMatrix() {
    mat4.identity( this.proj );
    if (Camera.projectionType === 'ortho') {
      mat4.ortho(this.proj, this.left * this.aspect, this.right * this.aspect, this.bottom , this.top, this.near, this.far);
    } else {
      mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
    }
  }

  updateCam() {
    this.t += 0.02
    this.x = 35*Math.sin(this.t)
    this.z = 25*Math.cos(this.t)
    // this.x = 1.7*Math.sin(this.t)
    // this.z = 1.7*Math.cos(this.t)

    this.eye = vec3.fromValues(this.x, this.y, this.z);
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  static updateProjectionType(){
    if (this.projectionType === 'ortho'){
      Camera.projectionType = 'perspective';
    }
    else {
      Camera.projectionType = 'ortho';
    }
  }
};