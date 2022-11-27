export default class Light {
  constructor(x, y, z) {

    this.pos = vec4.fromValues(x, y, z, 1.0);

    this.amb_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.amb_k = 0.1;

    this.dif_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.dif_k = 0.5;

    this.esp_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.esp_k = 0.4;
    this.esp_p = 5.0;
  }

  createUniforms(gl, program, num){
    const posLoc = gl.getUniformLocation(program, "light_pos"+num);
    gl.uniform4fv(posLoc, this.pos);

    const ambCLoc = gl.getUniformLocation(program, "light_amb_c"+num);
    gl.uniform4fv(ambCLoc, this.amb_c);
    const ambKLoc = gl.getUniformLocation(program, "light_amb_k"+num)
    gl.uniform1f(ambKLoc, this.amb_k);

    const difCLoc = gl.getUniformLocation(program, "light_dif_c"+num);
    gl.uniform4fv(difCLoc, this.dif_c);
    const difKLoc = gl.getUniformLocation(program, "light_dif_k"+num)
    gl.uniform1f(difKLoc, this.dif_k);

    const espCLoc = gl.getUniformLocation(program, "light_esp_c"+num);
    gl.uniform4fv(espCLoc, this.pos);
    const espKLoc = gl.getUniformLocation(program, "light_esp_k"+num)
    gl.uniform1f(espKLoc, this.esp_k);
    const espPLoc = gl.getUniformLocation(program, "light_esp_p"+num)
    gl.uniform1f(espPLoc, this.esp_p);
  }

  updateLight() {
    // TODO: Change light position
  }
}