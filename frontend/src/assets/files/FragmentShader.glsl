
// FRAGMENT SHADER
precision mediump float;

// ENTRADA, PROVENIENTE DEL VERTEX SHADER
varying vec3 Position;         // VÉRTICES EN COORDINADAS DE VISTA
varying vec4 Normal;           // NORMAL EN COORDENADAS DE VISTA

// SALIDA PARA COMUNICAR CON EL RESTO DEL PIPELINE

//out vec4 FragColor; //COLOR DEL FRAGMENTO

// ESTADO DE OPENGL
uniform vec4 LightPosition;     // POSICIÓN DE LA LUZ EN COORDENADAS DE VISTA
uniform vec4 LightPosition2;     // POSICIÓN DE LA LUZ EN COORDENADAS DE VISTA
uniform vec3 LightIntensity;    // INTENSIDAD DE LA LUZ (MISMA PARA AMB., ESP. Y DIF.)
uniform vec3 Kd;                // COMPONENTE DIFUSA DEL MATERIAL
uniform vec3 Ka;                // COMPONENTE AMBIENTAL DEL MATERIAL
uniform vec3 Ks;                // COMPONENTE ESPECULAR DEL MATERIAL
uniform float Shininess;        // FACTOR DE BRILLO DEL MATERIAL
uniform vec4 colorId;     // POSICIÓN DE LA LUZ EN COORDENADAS DE VISTA


uniform int mode;

// our texture

varying vec2 v_texcoord;
//

uniform sampler2D u_texture;
//


// FUNCION QUE CALCULA EL MODELO DE PHONG


void main () { // CALCULAR EL COLOR DEL FRAGMENTO 
if (mode == 1) {
  // Perform the initialization to render for the "select_program"
  // ...

  vec3 norm = Normal.xyz;

    vec3 n = normalize(norm); 
    vec3 l = normalize(vec3(LightPosition) - Position); 

    vec3 v = normalize(vec3(-Position)); 
    vec3 r = reflect(-l, n);

    vec3 light1 = LightIntensity * (Ka + Kd * max (dot (l, n), 0.0) + Ks * pow (max (dot (r,v), 0.0), Shininess));


////////////////light2
    l = normalize(vec3(LightPosition2) - Position); 

    r = reflect(-l, n);

    vec3 light2 = LightIntensity * (Ka + Kd * max (dot (l, n), 0.0) + Ks * pow (max (dot (r,v), 0.0), Shininess));

    vec3 light = light1 + light2;

    gl_FragColor = vec4 (light, 1.0); 

    //gl_FragColor = texture2D(u_image, v_texCoord);
    //gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    //gl_FragColor = texture2D(u_texture, v_texcoord);


}else{
        gl_FragColor = colorId; // Color rojo sólido

}
    
}
  
/*
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.1, 0.0, 1.0); // Color rojo sólido
}


precision mediump float;

    void main(void) {
      gl_FragColor = vec4(1.0, 0.2, 0.0, 1.0);
    }
    */