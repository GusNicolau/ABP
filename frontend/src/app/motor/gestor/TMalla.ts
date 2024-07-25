import { ElementRef } from '@angular/core';
import * as glm from 'gl-matrix';
import { TNodo } from '../arbol/TNodo';
import TCamara from '../arbol/TCamara';
import { TEntidad } from '../arbol/TEntidad';
import { TLuz } from '../arbol/TLuz';
import { TModelo } from '../arbol/TModelo';
import { TRecursoMaterial } from './TRecursoMaterial';
import { TRecursoTextura } from './TRecursoTextura';
//import * as inverse from 'matrix-inverse';

export class TMalla {
  vertices: number[];
  normales: number[];
  coordtex: number[];
  indices: number[];

  color: glm.vec3 | null;
  indice: number;
  colorId: glm.vec4;
  //color_aux: 
  //texturas: TTextura[];

  seleccionado: boolean;

  hoveado: boolean;


  constructor(nom: string, ind: number) {
    this.vertices = [];
    this.normales = [];
    this.coordtex = [];
    this.indices = [];

    

    this.color = null;
    this.indice = ind;
    
    this.colorId = glm.vec4.fromValues(((ind >>  0) & 0xFF) / 0xFF,
    ((ind >>  8) & 0xFF) / 0xFF,
    ((ind >> 16) & 0xFF) / 0xFF,
    ((ind >> 24) & 0xFF) / 0xFF,)
    //console.log("Mi id es: " + this.indice + "y mi color es "+ this.colorId);

    const id = this.colorId[0] + (this.colorId[1] << 8) + (this.colorId[2] << 16) + (this.colorId[3] << 24);
    //console.log("Mi color es: " + this.colorId + "y mi indice es "+ ind);
    //console.log("Mi color es: " + this.colorId + "y mi indice es "+ id);
    //console.log(id);

    this.seleccionado = false;

    this.hoveado = false;

    //this.texturas = [];
  }

  setIndices (arry: number[]){
    this.indices = arry;
  }

  setNormales(arry: number[]){
    this.normales = arry;
  }

  setColor(colore: glm.vec3){
    this.color = colore;
  }

  setCoordTex(arry: number[]){
    if(this.coordtex.length == 0){
      this.coordtex = arry;
    }else{
      arry.forEach((elemento: number) => {
          // Cuerpo de la función de devolución de llamada
          this.coordtex.push(elemento);
      });
    }
    
  }

  getId(): number{
    return this.indice;
  }

  setVertices(arry: number[]){
      this.vertices = arry;
  }

  setSeleccionado(vale: boolean){
    this.seleccionado = vale;
  }

  setHoveado(vale: boolean){
    this.hoveado = vale;
  }


  dibujar(canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, mnodo:TNodo, cnodo:TNodo, centidad: TCamara){
      const gl = canvas.nativeElement.getContext('webgl');

      const model: glm.mat4 = mnodo.getMatrizTransf();
      const cam: glm.mat4 = cnodo.getMatrizVist();
      const proyection: glm.mat4 = centidad.getProyeccion();


      //console.log(cam);
      var view: glm.mat4 = glm.mat4.create();
      glm.mat4.invert(view, cam);

      //console.log(view);


      // Definir la posición de la cámara
      const posicionCamara: glm.vec3 = glm.vec3.fromValues(0, 0, 25); // Por ejemplo, la cámara está en (0, 0, 5)

      // Definir hacia dónde mira la cámara (punto de mira)
      const puntoDeMira: glm.vec3 = glm.vec3.fromValues(0, 0, 0); // Por ejemplo, la cámara mira al origen

      // Definir el vector que indica la dirección "arriba" en el espacio
      const arriba: glm.vec3 = glm.vec3.fromValues(0, 1, 0); // Por ejemplo, el vector arriba es el eje y

      // Crear la matriz de vista (matriz de cámara)
      const matrizDeVista: glm.mat4 = glm.mat4.create();
      glm.mat4.lookAt(matrizDeVista, posicionCamara, puntoDeMira, arriba);

      /*
      console.log("matriz de camara es: " );
      //cnodo.imprimirMatriz();
      console.log(glm.mat4.invert(view, cam));

      console.log("matriz de vist es: " );
      console.log(glm.mat4.invert(view, glm.mat4.fromValues(
          parseFloat(cam[0].toFixed(7)), parseFloat(cam[1].toFixed(6)), parseFloat(cam[2].toFixed(6)), parseFloat(cam[3].toFixed(6)),
          parseFloat(cam[4].toFixed(6)), parseFloat(cam[5].toFixed(6)), parseFloat(cam[6].toFixed(6)), parseFloat(cam[7].toFixed(6)),
          parseFloat(cam[8].toFixed(6)), parseFloat(cam[9].toFixed(6)), parseFloat(cam[10].toFixed(6)), parseFloat(cam[11].toFixed(6)),
          parseFloat(cam[12].toFixed(6)), parseFloat(cam[13].toFixed(6)), parseFloat(cam[14].toFixed(6)), parseFloat(cam[15].toFixed(6)))));
*/
      //console.log("matriz de proyeccion es: " );
      //centidad.imprimirMatriz(model);



      //console.log(programa);

      gl?.useProgram(programa);


      //var rotationMatrix = gl?.getUniformLocation(programa, "rotationMatrix");
      var modelMatrix = gl?.getUniformLocation(programa, "ModelMatrix");
      //console.log(gl?.getError());
      //console.log(modelMatrix);

      var viewMatrix = gl?.getUniformLocation(programa, "ViewMatrix");
      var projectionMatrix = gl?.getUniformLocation(programa, "ProjectionMatrix");
      
      

      //console.log(modelMatrix);
      //console.log(viewMatrix);
      //console.log(projectionMatrix);

      if(modelMatrix != null && viewMatrix != null && projectionMatrix != null){
          gl?.uniformMatrix4fv(modelMatrix, false, model);
          gl?.uniformMatrix4fv(viewMatrix, false, matrizDeVista );
          gl?.uniformMatrix4fv(projectionMatrix, false, proyection);
      }else{
          console.error("error definiendo los uniform en el shader actual");
      }

      //enlazar los atributos con posiciones y linkprogram archivo
      gl?.bindAttribLocation(programa, 0, "vertexPosition");
      gl?.bindAttribLocation(programa, 1, "vertexNormal");
      gl?.linkProgram(programa);

      //Crear buffers para postiton y normals, activarlos con los datos y asociarlos a la variable in del shader
      const poBuffer = gl?.createBuffer();
      if(poBuffer != undefined){
          gl?.bindBuffer(gl.ARRAY_BUFFER, poBuffer);
      }

      const vert = new Float32Array(this.vertices);
      gl?.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);

      gl?.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl?.enableVertexAttribArray(0);


      const nBuffer = gl?.createBuffer();
      if(nBuffer != undefined){
          gl?.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
      }

      const norm = new Float32Array(this.normales);
      gl?.bufferData(gl.ARRAY_BUFFER, norm, gl.STATIC_DRAW);

      gl?.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
      gl?.enableVertexAttribArray(1);

      gl?.drawArrays(gl.TRIANGLES, 0, 5)

      //gl?.clearColor(1, 1, 0.2, 1);
      //gl?.clear(gl.COLOR_BUFFER_BIT);
  }



  ///// //// //////////////// ///// // ///7
  dibujar1(canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, mnodo:TNodo, cnodo:TNodo, centidad: TCamara){
      const gl = canvas.nativeElement.getContext('webgl');
      
      const programInfo = {
          program: programa,
          attribLocations: {
            vertexPosition: gl?.getAttribLocation(programa, "position"),
          },
          uniformLocations: {
            modelMatrix: gl?.getUniformLocation(programa, "ModelMatrix"),
            viewMatrix: gl?.getUniformLocation(programa, "ViewMatrix"),
            projectionMatrix: gl?.getUniformLocation(programa, "ProjectionMatrix"),
          },
        };


        const bufferss = this.initBuffers(gl);

        this.drawScene(gl, programInfo, bufferss);



      //gl?.clearColor(1, 1, 0.2, 1);
      //gl?.clear(gl.COLOR_BUFFER_BIT);
  }

  initBuffers(gl) {
    // Create a buffer for the square's positions.
  
    const poBuffer = gl?.createBuffer();
    const nBuffer = gl?.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
  
    if(poBuffer != undefined){
        gl?.bindBuffer(gl.ARRAY_BUFFER, poBuffer);
    }
    if(nBuffer != undefined){
        gl?.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    }

    // Now create an array of positions for the square.
  
    const vert = new Float32Array(this.vertices);
    const norm = new Float32Array(this.normales);

  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
  
    gl?.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    gl?.bufferData(gl.ARRAY_BUFFER, norm, gl.STATIC_DRAW);
  
    return {
      position: poBuffer,
      normals: nBuffer,
    };
  }

    drawScene(gl, programInfo, buffers) {

      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
      gl.clearDepth(1.0); // Clear everything
      gl.enable(gl.DEPTH_TEST); // Enable depth testing
      gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    
      // Clear the canvas before we start drawing on it.
    
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
      // Create a perspective matrix, a special matrix that is
      // used to simulate the distortion of perspective in a camera.
      // Our field of view is 45 degrees, with a width/height
      // ratio that matches the display size of the canvas
      // and we only want to see objects between 0.1 units
      // and 100 units away from the camera.
    
      const fieldOfView = (45 * Math.PI) / 180; // in radians
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = glm.mat4.create();
    
      // note: glmatrix.js always has the first argument
      // as the destination to receive the result.
      glm.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
      // Set the drawing position to the "identity" point, which is
      // the center of the scene.
      const viewMatrix =glm.mat4.create();
    
      // Now move the drawing position a bit to where we want to
      // start drawing the square.
    
      glm.mat4.translate(
        viewMatrix, // destination matrix
        viewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0],
      ); // amount to translate
    
      glm.mat4.rotate(
        viewMatrix, // destination matrix
        viewMatrix, // matrix to translate
        2.6,
        [0, 1, 0],
      ); // amount to translate


      const modelMatrix = glm.mat4.create();
    
    
      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute.
      {
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

        gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset,
        );
        //gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        //gl.enableVertexAttribArray(1);

      }
    
      // Tell WebGL to use our program when drawing
    
      gl.useProgram(programInfo.program);
    
      // Set the shader uniforms
    
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
      );

      //console.log(programInfo.uniformLocations.projectionMatrix);

      
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix,
      );

      gl.uniformMatrix4fv(
          programInfo.uniformLocations.viewMatrix,
          false,
          viewMatrix,
        );
    
      {
        const offset = 0;
        const vertexCount = 5;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        //console.log(gl?.getError());

        //gl.drawArrays(gl.TRIANGLES, 0, 5)
      }
  }


  dibujar3(canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, mnodo:TNodo, cnodo:TNodo, centidad: TCamara){
    const gl = canvas.nativeElement.getContext('webgl');
    
    const programInfo = {
        program: programa,
        attribLocations: {
          vertexPosition: gl?.getAttribLocation(programa, "aVertexPosition"),
        },
        uniformLocations: {
          projectionMatrix: gl?.getUniformLocation(programa, "uProjectionMatrix"),
          modelViewMatrix: gl?.getUniformLocation(programa, "uModelViewMatrix"),
        },
      };


      const bufferss = this.initBuffers3(gl);

      this.drawScene3(gl, programInfo, bufferss, centidad, cnodo, mnodo);

    //gl?.clearColor(1, 1, 0.2, 1);
    //gl?.clear(gl.COLOR_BUFFER_BIT);
      return true;
  }

  initBuffers3(gl) {
    // Create a buffer for the square's positions.
  
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = this.vertices;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    const normals = this.normales;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);



    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    const texts = this.coordtex;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(texts),
      gl.STATIC_DRAW);

/*
    const cubeVerticesTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
    const tects = this.coordtex;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(tects),
      gl.STATIC_DRAW
    );
  */  

    /*
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = this.indices;
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    )
*/
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
  
    

    // Now create an array of positions for the square.
  
    //gl?.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    //console.log(positions);
  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
  
    const indexBuffer = this.initIndexBuffer(gl);;

    return {
        position: positionBuffer,
        normal: normalBuffer,
        indexs : indexBuffer,
        //uves: cubeVerticesTextureCoordBuffer, 
        textur: textureBuffer, 
    };
  }

  drawScene3(gl, programInfo, buffers, centidad, cnodo, mnodo) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    //const fieldOfView = (45 * Math.PI) / 180; // in radians
    //const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    //const zNear = 0.1;
    //const zFar = 100.0;

    const projectionMatrix = centidad.getProyeccion();

    //const modelMatrix = mnodo.getMatrizTransf();
	const modelMatrix = glm.mat4.create();

    const viewMatrix = cnodo.getMatrizVist();
    
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = glm.mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    glm.mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

  
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3; // pull out 2 values per iteration
      const type = gl.FLOAT; // the data in the buffer is 32bit floats
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      //gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      //gl.enableVertexAttribArray(1);

    }
  
    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
  
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );

    //console.log(programInfo.uniformLocations.projectionMatrix);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );
    
    {
      const offset = 0;
      const vertexCount = 5;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      //console.log(gl?.getError());

      //gl.drawArrays(gl.TRIANGLES, 0, 5)
    }
    return true;
  }



  //////////////////!!!!!!!!!!!! UTILIZADO ACTUALMENTE CON EL API DE LA APLICACIÓN, LOS DEMÁS FUNCIONAN CON OTRAS COSAS !!!!!!!!!!!!!!!!!\\\\\\\\\\\\\\\\\\\\\

  dibujar4(canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, mat4, cnodo:TNodo, modelo: TModelo | null,centidad: TCamara, luzes:TNodo[], modo: number){
    const gl = canvas.nativeElement.getContext('webgl');
    
    const programInfo = {
        program: programa,
        attribLocations: {
          vertexPosition: gl?.getAttribLocation(programa, "VertexPosition"),
          vertexNormal: gl?.getAttribLocation(programa, "VertexNormal"),
          texcoordLocation: gl?.getAttribLocation(programa, "a_texcoord"),

          //textureCoordAttribute: gl?.getAttribLocation(programa, "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl?.getUniformLocation(programa, "ProjectionMatrix"),
          modelViewMatrix: gl?.getUniformLocation(programa, "ModelViewMatrix"),
          normalMatrix: gl?.getUniformLocation(programa, "NormalMatrix"),
          MVP: gl?.getUniformLocation(programa, "MVP"),

          /////////////////////////////////////////////////////////////////

          lightPosition: gl?.getUniformLocation(programa, "LightPosition"),
          lightPosition2: gl?.getUniformLocation(programa, "LightPosition2"),
          lightIntensity: gl?.getUniformLocation(programa, "LightIntensity"),
          kd: gl?.getUniformLocation(programa, "Kd"),
          ka: gl?.getUniformLocation(programa, "Ka"),
          ks: gl?.getUniformLocation(programa, "Ks"),
          shininess: gl?.getUniformLocation(programa, "Shininess"),
          mode: gl?.getUniformLocation(programa, "mode"),
          colorId: gl?.getUniformLocation(programa, "colorId"),
        },
      };
      
      //console.log("Errores : " + gl?.getError());

      const bufferss = this.initBuffers3(gl);

      this.drawScene4(gl, programInfo, bufferss, centidad, cnodo, modelo,luzes,mat4, modo);

    //gl?.clearColor(1, 1, 0.2, 1);
    //gl?.clear(gl.COLOR_BUFFER_BIT);
      return true;
  }

  initIndexBuffer(gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
  
    const indices = this.indices;
    //console.log("ESTE ES EL ARRAY DE INDICES:" + indices);
    // Now send the element array to GL
  
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );
  
    return indexBuffer;
  }


  async drawScene4(gl, programInfo, buffers, centidad, cnodo, modelo,luces: TNodo[], mat4, modo) {
    //gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    //gl.clearDepth(1.0); // Clear everything
    //gl.enable(gl.DEPTH_TEST); // Enable depth testing
    //gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    
  
    // Clear the canvas before we start drawing on it.
  
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    //const fieldOfView = (45 * Math.PI) / 180; // in radians
    //const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    //const zNear = 0.1;
    //const zFar = 100.0;

    const projectionMatrix = centidad.getProyeccion();

    const modelMatrix = mat4;

    const viewMatrix = cnodo.getMatrizVist();
    
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = glm.mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    glm.mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);


    const normalMatrix = glm.mat4.create();
    glm.mat4.invert(normalMatrix, modelViewMatrix);
    glm.mat4.transpose(normalMatrix, normalMatrix);


    const MVP = glm.mat4.create();
    glm.mat4.multiply(MVP, projectionMatrix, viewMatrix);
    glm.mat4.multiply(MVP, MVP, modelMatrix);


    ///////////////////////////////

    var lightPosition = glm.vec4.fromValues(0, 0.0, 0, 1.0);
    if(luces[0] != null){
      lightPosition = glm.vec4.fromValues(luces[0].getTraslacion()[0], luces[0].getTraslacion()[1], luces[0].getTraslacion()[2], 1.0);
    }
    
    glm.vec4.transformMat4(lightPosition, lightPosition, modelViewMatrix);


    const lightPosition2 = glm.vec4.fromValues(0, 0, 0, 1.0);
    if(luces[1] != null){
      lightPosition = glm.vec4.fromValues(luces[1].getTraslacion()[0], luces[1].getTraslacion()[1], luces[1].getTraslacion()[2], 1.0);
    }
    glm.vec4.transformMat4(lightPosition2, lightPosition2, modelViewMatrix);

  var luz1 :TEntidad = luces[1].getEntidad()!;
  var luz2 :TEntidad = luces[1].getEntidad()!;

  var lightIntensity = glm.vec3.fromValues(1, 1, 1);

  if(luz1 instanceof TLuz && luz2 instanceof TLuz){
    lightIntensity = glm.vec3.fromValues((luz1.getIntensidad()[0]+ luz2.getIntensidad()[0])/2, (luz1.getIntensidad()[1]+ luz2.getIntensidad()[1])/2, (luz1.getIntensidad()[2]+ luz2.getIntensidad()[2])/2);
  }

    
    var kd = glm.vec3.fromValues(0.8828125*1.2, 0.765625*1.2, 0.671875*1.2);
    //var kd = glm.vec3.fromValues(0.8828125, 0.765625, 0.671875);

    var ka = glm.vec3.fromValues(0.2, 0.2, 0.2);
//    const ka = glm.vec3.fromValues(0.1, 0.1, 0.4);

    var ks = glm.vec3.fromValues(0.05, 0.05, 0.05);

    if(this.color != null){

      ka = this.color;
      kd = this.color;
      ks = glm.vec3.fromValues(this.color[0]*0.1, this.color[1]*0.1, this.color[2]*0.1);

      //kd = glm.vec3.fromValues(0.7, 0.8, 1);

      
    }else{
    }

    if(this.seleccionado){
      kd = glm.vec3.fromValues(1, 0.0, 0.0);
      ka = glm.vec3.fromValues(1, 0.0, 0.0);
      ks = glm.vec3.fromValues(0.8, 0.0, 0.0);
    }

    if(this.hoveado){
      kd = glm.vec3.fromValues(1, 0.0, 0.0);
      ka = glm.vec3.fromValues(1, 0.0, 0.0);
      ks = glm.vec3.fromValues(0.8, 0.0, 0.0);
    }

    var shininess = 64.0;


    if(modelo!= null && modelo instanceof TModelo){
      var material1: TRecursoMaterial | null = modelo.getMaterial();
      if(material1!= null){
        kd = material1.getKd();
        ka = material1.getKa();
        ks = material1.getKs();

        shininess = material1.getNs();
      }
      var textura11: TRecursoTextura | null = modelo.getTextura();
      if(textura11 != null){
        //console.log(textura11);
        //gl.bindTexture(gl.TEXTURE_2D, textura11.texture);
      }
    }

    const mode = modo;
    if(mode == 1){

    }




  
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3; // pull out 2 values per iteration
      const type = gl.FLOAT; // the data in the buffer is 32bit floats
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      //gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      //gl.enableVertexAttribArray(1);

    }

    {
      const numComponents = 3; // pull out 2 values per iteration
      const type = gl.FLOAT; // the data in the buffer is 32bit floats
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);

      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset,
      );
      //gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
      //gl.enableVertexAttribArray(1);

    }




    {

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textur);

      // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(programInfo.attribLocations.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  
    gl.enableVertexAttribArray(programInfo.attribLocations.texcoordLocation);



    }




    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexs);


    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);











  
    // Set the shader uniforms
  
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix,
    );

    //console.log(programInfo.uniformLocations.projectionMatrix);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix,
    );

    
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix,
    );

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.MVP,
      false,
      MVP,
    );

    /////////////////////////

    gl.uniform4fv(
      programInfo.uniformLocations.lightPosition,
      lightPosition,
    );

    gl.uniform4fv(
      programInfo.uniformLocations.lightPosition2,
      lightPosition2,
    );

    gl.uniform3fv(
      programInfo.uniformLocations.lightIntensity,
      lightIntensity,
    );

    gl.uniform3fv(
      programInfo.uniformLocations.kd,
      kd,
    );

    gl.uniform3fv(
      programInfo.uniformLocations.ka,
      ka,
    );

    gl.uniform3fv(
      programInfo.uniformLocations.ks,
      ks,
    );

    gl.uniform1f(
      programInfo.uniformLocations.shininess,
      shininess,
    );

    gl.uniform1i(
      programInfo.uniformLocations.mode,
      mode,
    );

    gl.uniform1i(programInfo.textureLocation, 0);

    gl.uniform4fv(
      programInfo.uniformLocations.colorId,
      this.colorId,
    );
  
    {
      const vertexCount = this.indices.length;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      //gl.drawArrays(gl.TRIANGLES, offset, vertexCount);

      //gl.drawElements(gl.TRIANGLE, vertexCount, type, offset);
      //console.log(gl?.getError());

      //gl.drawArrays(gl.TRIANGLES, 0, 5)
    }
    return true;
  }
}