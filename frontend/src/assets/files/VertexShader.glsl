
// ATRIBUTOS 
attribute vec4 VertexPosition; //VÉRTICE EN SIT. COORD. LOCAL
attribute vec4 VertexNormal;   // NORMAL EN SIT. COORD. LOCAL

attribute vec2 a_texcoord;
//


// SALIDA PARA COMUNICAR CON EL FRAGMENT
varying vec3 Position;        // VÉRTICE EN COORDINADAS DE VISTA
varying vec4 Normal;          // NORMAL EN COORDENADAS DE VISTA

varying vec2 v_texcoord;
//


// ESTADO DE OPENGL
uniform mat4 ModelViewMatrix;     // MATRIZ DE MODELO Y VISTA, YA MULTIPLICADAS
uniform mat4 NormalMatrix;        // M. DE NORMALES transpose(inverse(ModelViewMatrix))
uniform mat4 ProjectionMatrix;    // MATRIZ DE PROYECCIÓN
uniform mat4 MVP;                 // MATRIZ MODELO*VISTA*PROYECCION

void main() {

  // TRANSFORMAR EL VÉRTICE Y LA NORMAL A COORDENADAS DE VISTA
  Position = vec3 (ModelViewMatrix * VertexPosition);
  Normal = normalize (NormalMatrix * VertexNormal);

  // TRANSFORMACIÓN COMPLETA DEL VÉRTICE
  //gl_Position = MVP * VertexPosition;
  gl_Position = MVP * VertexPosition;

    // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
  
}
 
 
/*
attribute vec4 VertexPosition;

  uniform mat4 ModelViewMatrix;
  uniform mat4 ProjectionMatrix;

  void main() {
    gl_Position = ProjectionMatrix * ModelViewMatrix * VertexPosition;
  }
  

    attribute vec4 VertexPosition;

    uniform mat4 ModelViewMatrix;
    uniform mat4 ProjectionMatrix;

    void main() {
      gl_Position = ProjectionMatrix * ModelViewMatrix * VertexPosition;
    }
    */
    