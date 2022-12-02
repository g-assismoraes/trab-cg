export default class Camera {
  constructor(gl) {
    // Posição da camera
    this.eye = vec3.fromValues(1, 4, 1.0);
    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 1.0, 0.0);
    this.r_factor = 0.0;

    // Parâmetros da projeção
    this.fovy = Math.PI / 2;
    this.aspect = gl.canvas.width / gl.canvas.height;

    this.left = -10.5;
    this.right = 10.5;
    this.top = 10.5;
    this.bottom = -10.5;

    this.near = 0;
    this.far = 20;

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
    this.r_factor += 0.02
    // this.x = 35*Math.sin(this.t)
    // this.z = 25*Math.cos(this.t)
    this.eye = vec3.fromValues(10*Math.sin(this.r_factor), 4, 10*Math.cos(this.r_factor));
    // this.x = 8*Math.sin(this.r_factor)
    // this.z = 8*Math.cos(this.r_factor)
    //this.eye = vec3.fromValues(this.x, this.y, this.z);

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