  import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { ExerciceService } from '../../services/exercice.service'; // Importa el servicio de ejercicios



  /**
   * Para instalar three se instala las librerias y la biblioteca de tipos
   * npm i three
   * npm i --save-dev @types/three
   */

  @Injectable({
    providedIn: 'root'
  })
  export class ThreeService implements OnDestroy {

    /*
    Al declarar una variable tipandola, por ejemplo
      private canvas : HTMLCanvasElement;

    Vamos a utilizar un signo "!" antes de los ":" para indicarle a TypeScript que la variable
    cuando vaya a ser usada
    */
    private canvas !: HTMLCanvasElement;
    private renderer !: THREE.WebGLRenderer;
    private camera !: THREE.PerspectiveCamera;
    private scene !: THREE.Scene;
    private light!: THREE.DirectionalLight;
    private controls !: OrbitControls;
    private frameId !: number;
    private model !: THREE.Object3D;
    private selectedCube: THREE.Mesh | null = null;
    private muscleInfoDiv!: HTMLDivElement;







    constructor(
      private ngZone: NgZone,
      private exerciceService: ExerciceService // Inyecta el servicio de ejercicios
    ) {
      this.muscleInfoDiv = document.createElement('div');
      this.muscleInfoDiv.id = 'muscleInfo';
    }

    public ngOnDestroy(): void {
      if (this.frameId != null) {
        cancelAnimationFrame(this.frameId);
      }
    }


    public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
      // The first step is to get the reference of the canvas element from our HTML document
      this.canvas = canvas.nativeElement;

      const canvasRect = this.canvas.getBoundingClientRect(); // Obtener la posición del canvas
      console.log(canvasRect);


      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,    // transparent background
        antialias: true // smooth edges
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // create the scene
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
      );
      this.camera.position.z = 5;
      this.scene.add(this.camera);



      // Cambios en la creación de la luz
      this.light = new THREE.DirectionalLight(0xF1C4A4, 1); // Direccional y blanco

      this.light.position.set(0, 5, 5); // Ajusta la posición de la luz

      this.light.castShadow = true; // Habilita la proyección de sombras
      this.scene.add(this.light);

      //Controles de la camara

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 1.5;
      this.controls.maxDistance = 5;
      this.controls.enablePan = true; // Habilitar el movimiento horizontal
      this.controls.enableZoom = true; // Habilitar el zoom
      this.controls.enableDamping = true; // Habilitar amortiguación

      // Limitar el ángulo vertical
      const currentVerticalAngle = this.controls.getPolarAngle();
      console.log(currentVerticalAngle);
      this.controls.minPolarAngle = Math.PI - currentVerticalAngle;
      this.controls.maxPolarAngle = Math.PI - currentVerticalAngle;

      // Agregar el div al documento y posicionarlo
      document.body.appendChild(this.muscleInfoDiv);
      this.muscleInfoDiv.style.display = 'none'; // Ocultar el div inicialmente
      this.muscleInfoDiv.style.position = 'absolute';
      this.muscleInfoDiv.style.top = '100px'; // Ajusta la distancia desde la parte superior
      this.muscleInfoDiv.style.left = '100px'; // Ajusta la distancia desde la izquierda
      this.muscleInfoDiv.style.zIndex = '999'; // Asegúrate de que esté por encima del canvas
      this.muscleInfoDiv.style.width = '430px'; // Establece el ancho del div
      this.muscleInfoDiv.style.padding = '20px'; // Añade un relleno para el contenido
      this.muscleInfoDiv.style.borderRadius = '10px'; // Agrega bordes redondeados
      this.muscleInfoDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Agrega sombra
      this.muscleInfoDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Color blanco con opacidad
      // Agrega estilos para la barra de desplazamiento
      this.muscleInfoDiv.style.maxHeight = '585px'; // Establecer una altura máxima
      this.muscleInfoDiv.style.overflowY = 'auto'; // Habilitar el desbordamiento vertical

      // Establece estilos específicos de la barra de desplazamiento en Firefox
      this.muscleInfoDiv.style.setProperty('-ms-overflow-style', 'scrollbar');
      this.muscleInfoDiv.style.setProperty('scrollbar-width', 'thin');
      this.muscleInfoDiv.style.setProperty('scrollbar-color', '#888 #ddd');

      // Crear el elemento h2 y agregarlo al div
      const muscleTitle = document.createElement('h2');
      muscleTitle.style.fontSize = '24px'; // Establece el tamaño de fuente del título
      this.muscleInfoDiv.appendChild(muscleTitle);
      console.log("muscleTitle:", muscleTitle);


      ///////////////////////////////////////////////////////////////////////////////////////
      // Después de la creación de otros elementos, como los botones existentes o el div de controles
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.position = 'absolute';
      buttonsContainer.style.bottom = '20px';
      buttonsContainer.style.left = '50%';
      buttonsContainer.style.transform = 'translateX(-50%)';
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.alignItems = 'center';
      buttonsContainer.style.justifyContent = 'center';


      // Variables de estado para los botones
      let button1Clicked = false;
      let button2Clicked = false;
      let button3Clicked = false;

      // Dentro de la función createScene()

      // Crear un elemento 'img' para la imagen
      const imageElement = document.createElement('img');
      imageElement.src = 'assets/images/NoName7.png'; // Reemplaza 'ruta/de/la/imagen.png' con la ruta de tu imagen
      imageElement.style.position = 'absolute';
      imageElement.style.top = '10px'; // Ajusta la distancia desde la parte superior
      imageElement.style.right = '10px'; // Ajusta la distancia desde la derecha
      imageElement.style.width = '80px'; // Establece el ancho de la imagen
      imageElement.style.height = '80px'; // Establece la altura de la imagen
      imageElement.style.cursor = 'pointer'; // Cambia el cursor al pasar sobre la imagen

      // Crear un elemento 'a' para el enlace
      const linkElement = document.createElement('a');
      linkElement.href = 'https://www.tecnicfit.ovh/noname7'; // Reemplaza 'https://www.ejemplo.com' con la URL deseada
      linkElement.target = '_blank'; // Abre el enlace en una nueva pestaña
      linkElement.style.position = 'absolute';
      linkElement.style.top = '10px'; // Ajusta la distancia desde la parte superior
      linkElement.style.right = '10px'; // Ajusta la distancia desde la derecha
      linkElement.style.width = '50px'; // Establece el ancho del enlace
      linkElement.style.height = '50px'; // Establece la altura del enlace
      linkElement.style.display = 'block'; // Hace que el enlace ocupe todo el contenedor

      // Agregar la imagen al enlace
      linkElement.appendChild(imageElement);

      // Agregar el enlace al contenedor del documento
      document.body.appendChild(linkElement);


      // Crear botón 1
      /*const button1 = document.createElement('button');
      button1.textContent = 'Botón 1';
      button1.style.marginRight = '10px'; // Ajusta el margen si es necesario

      // Crear botón 2
      const button2 = document.createElement('button');
      button2.textContent = 'Botón 2';

      // Agregar los botones al contenedor de botones
      buttonsContainer.appendChild(button1);
      buttonsContainer.appendChild(button2);

      // Event listener para el botón 1
      button1.addEventListener('click', () => {
          if (!button1Clicked) {
              button1Clicked = true;
              button3Clicked = false;
              button2Clicked = false;
              //cargarTodosLosModelos(); // Llama a la función solo si el botón no ha sido pulsado antes
          }
      });

        // Event listener para el botón 2
      button2.addEventListener('click', () => {
        if (!button2Clicked) {
            button2Clicked = true;
            button3Clicked = false;
            button1Clicked = false;
            this.cargarAnimacion(); // Llama a la función solo si el botón no ha sido pulsado antes
        }
    });

      // Crear botón 3
      const button3 = document.createElement('button');
      button3.textContent = 'Eliminar Modelos';
      button3.style.marginRight = '10px'; // Ajusta el margen si es necesario

      // Event listener para el botón 3
      button3.addEventListener('click', () => {
        if (!button3Clicked) {
            button3Clicked = true;
            button2Clicked = false;
            button1Clicked = false;
            this.scene.clear(); // Llama a la función solo si el botón no ha sido pulsado antes
        }
      });

      // Agregar el botón 3 al contenedor de botones
      buttonsContainer.appendChild(button3);*/

      // Agregar el contenedor de botones al cuerpo del documento
      document.body.appendChild(buttonsContainer);
      ////////////////////////////////////////////////////

      // Modelos
      const loader = new GLTFLoader();
      const textureLoader = new THREE.TextureLoader();

      // Agregar imagen de fondo
      const backgroundTexture = textureLoader.load('assets/images/background/GYM.jpg');
      this.scene.background = backgroundTexture;

        // Llamar a cargarTodosLosModelos directamente al crear la escena
        this.cargarTodosLosModelos();
      }

      private eliminarTodosLosModelos(): void {
        // Recorrer todos los hijos de la escena y eliminarlos
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);

            // Liberar la geometría y el material si es un Mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose(); // Liberar la geometría del modelo
                child.material.dispose(); // Liberar el material del modelo
            }
        }
    }
    public cargarTodosLosModelos(): void {
        // Eliminar todos los modelos existentes de la escena
        console.log("Eliminando modelos existentes...");
        this.eliminarTodosLosModelos();
        // Implementación de cargarTodosLosModelos
        // Modelo 1 (Cuerpo)
        const loader = new GLTFLoader();
        loader.load('assets/modelos/CuerpoSin3.glb', (gltf) => {
          const model = gltf.scene;
          model.scale.set(3, 3, 3);
          model.position.set(0, -2.5, 0);
          model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                  const newMaterial = new THREE.MeshBasicMaterial({ color: 0x37538E });
                  child.material = newMaterial;
              }
          });
          this.scene.add(model);
          this.model = model;
      });

      // Modelo 2 (Bíceps)
      const loaderBiceps = new GLTFLoader();
      loaderBiceps.load('assets/modelos/Biceps.glb', (gltfBiceps) => {
          const modeloBiceps = gltfBiceps.scene;
          modeloBiceps.scale.set(3, 3, 3);
          modeloBiceps.position.set(0, -2.5, 0);
          modeloBiceps.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                  child.material.map = null;
                  const newMaterialBiceps = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
                  child.material = newMaterialBiceps;
                  this.addClickEvent(child, 'Biceps');
                  this.addHoverEffect(child);
              }
          });
          this.scene.add(modeloBiceps);
      });
        // Modelo 3 (Tríceps)
        const tricepsLoader = new GLTFLoader();
        tricepsLoader.load('assets/modelos/Triceps.glb', (gltfTriceps: GLTF) => {
          const modeloTriceps = gltfTriceps.scene;
          modeloTriceps.scale.set(3, 3, 3);
          modeloTriceps.position.set(0, -2.5, 0);
          modeloTriceps.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialTriceps = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialTriceps;
              this.addClickEvent(child, 'Triceps');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloTriceps);
        });

        // Modelo 4 (Cuádriceps)
        const cuadricepsLoader = new GLTFLoader();
        cuadricepsLoader.load('assets/modelos/Cuadriceps.glb', (gltfCuadriceps: GLTF) => {
          const modeloCuadriceps = gltfCuadriceps.scene;
          modeloCuadriceps.scale.set(3, 3, 3);
          modeloCuadriceps.position.set(0, -2.5, 0);
          modeloCuadriceps.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialCuadriceps = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialCuadriceps;
              this.addClickEvent(child, 'Cuadriceps');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloCuadriceps);
        });

        // Modelo 5 (Hombros)
        const deltoidesLoader = new GLTFLoader();
        deltoidesLoader.load('assets/modelos/Hombros.glb', (gltfDeltoides: GLTF) => {
          const modeloDeltoides = gltfDeltoides.scene;
          modeloDeltoides.scale.set(3, 3, 3);
          modeloDeltoides.position.set(0, -2.5, 0);
          modeloDeltoides.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialDeltoides = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialDeltoides;
              this.addClickEvent(child, 'Hombros');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloDeltoides);
        });
        // Modelo 6 (Isquiotables)
        const isquiotablesLoader = new GLTFLoader();
        isquiotablesLoader.load('assets/modelos/Isquiotables.glb', (gltfIsquiotables: GLTF) => {
          const modeloIsquiotables = gltfIsquiotables.scene;
          modeloIsquiotables.scale.set(3, 3, 3);
          modeloIsquiotables.position.set(0, -2.5, 0);
          modeloIsquiotables.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialIsquiotables = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialIsquiotables;
              this.addClickEvent(child, 'Isquiotibiales');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloIsquiotables);
        });

        // Modelo 7 (Gemelos)
        const gemelosLoader = new GLTFLoader();
        gemelosLoader.load('assets/modelos/Gemelos.glb', (gltfGemelos: GLTF) => {
          const modeloGemelos = gltfGemelos.scene;
          modeloGemelos.scale.set(3, 3, 3);
          modeloGemelos.position.set(0, -2.5, 0);
          modeloGemelos.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialGemelos = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialGemelos;
              this.addClickEvent(child, 'Gemelos');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloGemelos);
        });

        // Modelo 8 (Gluteos)
        const gluteosLoader = new GLTFLoader();
        gluteosLoader.load('assets/modelos/Gluteos.glb', (gltfGluteos: GLTF) => {
          const modeloGluteos = gltfGluteos.scene;
          modeloGluteos.scale.set(3, 3, 3);
          modeloGluteos.position.set(0, -2.5, 0);
          modeloGluteos.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialGluteos = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialGluteos;
              this.addClickEvent(child, 'Gluteos');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloGluteos);
        });

        // Modelo 9 (Pectoral)
        const pechoLoader = new GLTFLoader();
        pechoLoader.load('assets/modelos/Pectoral.glb', (gltfPecho: GLTF) => {
          const modeloPecho = gltfPecho.scene;
          modeloPecho.scale.set(3, 3, 3);
          modeloPecho.position.set(0, -2.5, 0);
          modeloPecho.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialPecho = new THREE.MeshBasicMaterial({ color: 0x86A6EA  });
              child.material = newMaterialPecho;
              this.addClickEvent(child, 'Pectorales');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloPecho);
        });

        // Modelo 10 (Abdominales)
        const abdominalesLoader = new GLTFLoader();
        abdominalesLoader.load('assets/modelos/Abdominales.glb', (gltfAbdominales: GLTF) => {
          const modeloAbdominales = gltfAbdominales.scene;
          modeloAbdominales.scale.set(3, 3, 3);
          modeloAbdominales.position.set(0, -2.5, 0.01);
          modeloAbdominales.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialAbdominales = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialAbdominales;
              this.addClickEvent(child, 'Abdominales');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloAbdominales);
        });

        // Modelo 11 (Antebrazo)
        const antebrazoLoader = new GLTFLoader();
        antebrazoLoader.load('assets/modelos/Antebrazos.glb', (gltfAbdominales: GLTF) => {
          const modeloAntebrazo = gltfAbdominales.scene;
          modeloAntebrazo.scale.set(3, 3, 3);
          modeloAntebrazo.position.set(0, -2.5, 0);
          modeloAntebrazo.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialAntebrazo = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialAntebrazo;
              this.addClickEvent(child, 'Antebrazos');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloAntebrazo);
        });

        // Modelo 12 (Oblicuos)
        const oblicuosLoader = new GLTFLoader();
          oblicuosLoader.load('assets/modelos/Oblicuos.glb', (gltfAbdominales: GLTF) => {
          const modeloOblicuos = gltfAbdominales.scene;
          modeloOblicuos.scale.set(3, 3, 3);
          modeloOblicuos.position.set(0, -2.5, 0);
          modeloOblicuos.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialOblicuos = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialOblicuos;
              this.addClickEvent(child, 'Oblicuos');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloOblicuos);
        });

        // Modelo 13 (Espalda)
        const espaldaLoader = new GLTFLoader();
        espaldaLoader.load('assets/modelos/Espalda.glb', (gltfEspalda: GLTF) => {
          const modeloEspalda = gltfEspalda.scene;
          modeloEspalda.scale.set(3, 3, 3);
          modeloEspalda.position.set(0, -2.5, 0);
          modeloEspalda.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = null;
              const newMaterialEspalda = new THREE.MeshBasicMaterial({ color: 0x86A6EA });
              child.material = newMaterialEspalda;
              this.addClickEvent(child, 'Espalda');
              this.addHoverEffect(child);
            }
          });
          this.scene.add(modeloEspalda);
        });
      }

      public cargarAnimacion(): void {
        // Eliminar todos los modelos existentes de la escena
        console.log("Eliminando modelos existentes...");
        this.eliminarTodosLosModelos();

        const loader = new GLTFLoader();
        const modeloPath = 'assets/modelos/Animación/Animacion.glb';

        loader.load(
            modeloPath,
            (gltf: GLTF) => {
                const modelo = gltf.scene;

                // Escalar el modelo
                modelo.scale.set(3, 3, 3); // Escalar el modelo a tres veces su tamaño original
                modelo.position.set(0, -2.5, 0);

                // Busca todas las animaciones en el modelo
                const mixer = new THREE.AnimationMixer(modelo);
                gltf.animations.forEach((clip) => {
                    // Agrega cada clip de animación al mixer
                    const action = mixer.clipAction(clip);
                    // Configura la acción para que se repita en bucle
                    action.setLoop(THREE.LoopRepeat);
                    // Reproduce la acción
                    action.play();
                });

                // Agregar una luz direccional a la escena
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(5, 5, 5); // Posición de la luz
                this.scene.add(directionalLight);

                // Agrega el modelo con la animación a la escena
                this.scene.add(modelo);

                // Definir la función de renderizado
                const render = () => {
                    // Actualizar el mixer en cada frame
                    mixer.update(0.0167); // Actualiza el mixer con un delta time fijo de aproximadamente 60 fps
                    // Renderizar la escena
                    this.renderer.render(this.scene, this.camera);

                    // Solicitar el próximo frame de animación
                    this.frameId = requestAnimationFrame(render);
                };

                // Iniciar el bucle de renderizado
                render();
            },
            undefined,
            (error: ErrorEvent) => {
                console.error('Error al cargar el modelo:', error);
            }
        );
    }


    private async addExerciseItemsToDiv(muscleName: string): Promise<void> {
      try {
          const response: any = await this.exerciceService.getItems().toPromise();
          if (response && response['ejercicios']) {
              const items = response['ejercicios'];
              if (Array.isArray(items)) {
                  let lastPausedButton: HTMLElement | null = null;
                  let isExpanded = false; // Variable para controlar si el ejercicio está expandido

                  // Filtrar los ejercicios según el músculo seleccionado
                  const filteredItems = items.filter(item => item.musculo.toLowerCase() === muscleName.toLowerCase());

                  filteredItems.forEach(item => {
                      // Crear un div para contener el ejercicio
                      const exerciseDiv = document.createElement('div');
                      exerciseDiv.classList.add('exercise-item');
                      exerciseDiv.style.backgroundColor = this.getRandomColor(); // Establecer color de fondo aleatorio
                      exerciseDiv.style.margin = '10px';
                      exerciseDiv.style.borderRadius = '10px';
                      exerciseDiv.style.padding = '10px'; // Añadir espacio interno
                      exerciseDiv.style.display = 'flex'; // Utilizar flexbox
                      exerciseDiv.style.alignItems = 'center'; // Alinear elementos verticalmente al centro
                      exerciseDiv.style.transition = 'transform 0.3s, background-color 0.3s'; // Agregar transición para suavizar el efecto de agrandamiento y cambio de color

                      // Guardar el color original del ejercicio
                      const originalColor = exerciseDiv.style.backgroundColor;

                      // Agregar evento para agrandar el ejercicio al pasar el ratón por encima, si no está expandido
                      exerciseDiv.addEventListener('mouseenter', () => {
                          if (!exerciseDiv.classList.contains('expanded')) {
                              exerciseDiv.style.transform = 'scale(1.1)'; // Agrandar el ejercicio al 110% de su tamaño original
                          }
                      });

                      // Agregar evento para restaurar el tamaño original y el color al quitar el ratón, si no está expandido
                      exerciseDiv.addEventListener('mouseleave', () => {
                          if (!exerciseDiv.classList.contains('expanded')) {
                              exerciseDiv.style.transform = 'scale(1)'; // Restaurar el tamaño original del ejercicio
                          }
                      });

                      // Crear elemento de imagen
                      const imageElement = document.createElement('img');
                      imageElement.src = '../../../assets/uploads/foto/' + item.imagen; // Asignar la URL de la imagen
                      imageElement.style.width = '100px'; // Establecer ancho de la miniatura
                      imageElement.style.height = '100px'; // Establecer alto de la miniatura

                      // Crear un div para contener el título y la descripción
                      const textContainer = document.createElement('div');
                      textContainer.style.maxWidth = 'calc(100% - 120px)'; // Establecer un ancho máximo para el contenedor de texto
                      textContainer.style.flex = '1'; // Permitir que el contenedor de texto ocupe todo el espacio restante
                      textContainer.style.display = 'flex'; // Utilizar flexbox
                      textContainer.style.flexDirection = 'column'; // Alinear los elementos en columna
                      textContainer.style.marginLeft = '10px'; // Añadir margen a la izquierda para separar la imagen del texto

                      // Crear elemento de título
                      const titleSpan = document.createElement('span');
                      titleSpan.textContent = item.titulo;
                      titleSpan.style.fontWeight = 'bold';
                      titleSpan.style.color = '#fff'; // Cambiar color del título del ejercicio a blanco
                      titleSpan.style.fontSize = '18px'; // Cambiar el tamaño del texto del título
                      titleSpan.style.marginBottom = '5px'; // Añadir margen inferior al título
                      titleSpan.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)'; // Aplicar sombreado al texto

                      // Crear elemento de descripción limitado a 100 palabras
                      const descriptionSpan = document.createElement('span');
                      const words = item.descripcion.split(' '); // Dividir la descripción en palabras
                      const limitedDescription = words.slice(0, 5).join(' '); // Tomar las primeras 5 palabras y unirlas de nuevo
                      descriptionSpan.textContent = limitedDescription + (words.length > 5 ? '...' : ''); // Agregar puntos suspensivos si hay más de 20 palabras
                      descriptionSpan.style.color = '#333'; // Cambiar color del texto de la descripción

                      // Agregar elementos al contenedor de texto
                      textContainer.appendChild(titleSpan);
                      textContainer.appendChild(descriptionSpan);

                      // Crear el botón de reproducción y agregarle el evento click
                      const playButton = document.createElement('div');
                      playButton.classList.add('play-button');
                      playButton.innerHTML = '&#9658;'; // Código HTML para el triángulo (►)
                      playButton.style.position = 'fixed'; // Fijar la posición del botón
                      playButton.style.top = '10px'; // Ajustar la posición en la parte superior
                      playButton.style.right = '10px'; // Ajustar la posición en la derecha
                      playButton.style.width = '30px';
                      playButton.style.height = '30px';
                      playButton.style.fontSize = '30px';
                      playButton.style.color = '#fff';
                      playButton.style.cursor = 'pointer';
                      playButton.style.zIndex = '1';
                      let val = 1;

                      playButton.addEventListener('click', () => {
                          //if (isExpanded) return; // Si ya está expandido, no hacer nada

                          if (lastPausedButton !== null && lastPausedButton !== playButton) {
                              // Si hay un botón en estado de pausa y no es el mismo que el actual,
                              // cambia su icono a reproducción (triángulo)
                              lastPausedButton.innerHTML = '&#9658;';
                          }

                          // Lógica para reproducir o pausar el ejercicio...
                          if (val === 1) {
                              // Cambiar el botón al estado de pausa
                              playButton.innerHTML = '&#10074;&#10074;';
                              lastPausedButton = playButton; // Actualizar el último botón en estado de pausa
                              //this.scene.clear(); // Limpiar la escena
                              val = 0;
                              this.cargarAnimacion();
                          } else {
                              // Cambiar el botón al estado de reproducción
                              playButton.innerHTML = '&#9658;';
                              lastPausedButton = null; // No hay ningún botón en estado de pausa
                              //this.scene.clear(); // Limpiar la escena
                              this.cargarTodosLosModelos();
                              val = 1;
                          }
                      });

                      // Agregar elementos al div de ejercicio
                      exerciseDiv.appendChild(imageElement);
                      exerciseDiv.appendChild(textContainer);
                      exerciseDiv.appendChild(playButton);

                      // Agregar div al div principal
                      this.muscleInfoDiv.appendChild(exerciseDiv);

                      exerciseDiv.addEventListener('click', () => {
                          const expandedItems = this.muscleInfoDiv.querySelectorAll('.exercise-item.expanded');
                          if (exerciseDiv.classList.contains('expanded')) {
                              exerciseDiv.classList.remove('expanded');
                              exerciseDiv.style.height = 'auto';
                              exerciseDiv.style.marginTop = '10px';
                              // Restaurar descripción limitada
                              descriptionSpan.textContent = limitedDescription + (words.length > 5 ? '...' : '');
                              // Quitar el video si existe
                              const videoLink = exerciseDiv.querySelector('.video-link') as HTMLElement;
                              if (videoLink) {
                                  videoLink.remove();
                              }
                          } else {
                              // Contraer todos los ejercicios expandidos
                              expandedItems.forEach(expandedItem => {
                                  if (expandedItem instanceof HTMLElement) {
                                      expandedItem.classList.remove('expanded');
                                      expandedItem.style.height = 'auto';
                                      expandedItem.style.marginTop = '10px';
                                      // Restaurar descripción limitada
                                      const expandedDescriptionSpan = expandedItem.querySelector('.description') as HTMLElement;
                                      if (expandedDescriptionSpan) {
                                          const expandedWords = expandedDescriptionSpan.textContent!.split(' ');
                                          const expandedLimitedDescription = expandedWords.slice(0, 5).join(' ');
                                          expandedDescriptionSpan.textContent = expandedLimitedDescription + (expandedWords.length > 5 ? '...' : '');
                                      }
                                      // Quitar el video si existe
                                      const expandedVideoLink = expandedItem.querySelector('.video-link') as HTMLElement;
                                      if (expandedVideoLink) {
                                          expandedVideoLink.remove();
                                      }
                                  }
                              });
                              exerciseDiv.classList.add('expanded');
                              exerciseDiv.style.height = 'auto';
                              exerciseDiv.style.marginTop = '15px';
                              exerciseDiv.style.marginBottom = '15px';
                              isExpanded = true; // Marcar como expandido
                              // Mostrar descripción completa
                              descriptionSpan.textContent = item.descripcion;
                              // Agregar video si existe
                              const videoId = this.getYouTubeVideoId(item.video);
                              if (videoId) {
                                  const videoLink = document.createElement('a');
                                  videoLink.href = item.video;
                                  videoLink.target = '_blank';
                                  videoLink.classList.add('video-link');
                                  videoLink.style.borderRadius = '10px';
                                  videoLink.style.overflow = 'hidden';
                                  videoLink.style.marginTop = '20px';
                                  const videoThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                  videoLink.innerHTML = `<img src="${videoThumbnailUrl}" style="width: 100%; height: auto;">`;
                                  // Añadir el videoLink debajo del textContainer
                                  textContainer.appendChild(videoLink); // Agregar video al contenedor de video
                              }
                          }
                      });
                  });
              } else {
                  console.error('La propiedad "ejercicios" en la respuesta no es un array:', items);
              }
          } else {
              console.error('La respuesta no tiene la propiedad "ejercicios" o es null/undefined:', response);
          }
      } catch (error) {
          console.error('Error al obtener los elementos:', error);
      }
  }




    // Función para extraer el ID del video de YouTube desde el enlace
    private getYouTubeVideoId(url: string): string | null {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }





    private addHoverEffect(mesh: THREE.Mesh): void {
      const originalColor = (mesh.material as THREE.MeshBasicMaterial).color.getHex();
      const hoverColor = 0xF85270; // Rojo

      const onDocumentMouseMove = (event: MouseEvent) => {
        if (!this.selectedCube) {
          const mouse = new THREE.Vector2();
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, this.camera);

          // Reemplaza `mesh` con el objeto que deseas que tenga el efecto de hover
          const intersects = raycaster.intersectObject(mesh);

          if (intersects.length > 0) {
            (mesh.material as THREE.MeshBasicMaterial).color.setHex(hoverColor);
          } else {
            (mesh.material as THREE.MeshBasicMaterial).color.setHex(originalColor);
          }
        }
      };

      document.addEventListener('mousemove', onDocumentMouseMove);
    }


    private addClickEvent(mesh: THREE.Mesh, muscleName: string): void {
      const originalColor = (mesh.material as THREE.MeshBasicMaterial).color.getHex();
      const selectedColor = 0xF85270;  // Rojo
      let isMuscleSelected = false; // Bandera para controlar si el músculo está seleccionado

      const onClick = async (event: MouseEvent) => {
          const mouse = new THREE.Vector2(
              (event.clientX / window.innerWidth) * 2 - 1,
              -(event.clientY / window.innerHeight) * 2 + 1
          );

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, this.camera);

          const intersects = raycaster.intersectObject(mesh);

          if (intersects.length > 0) {
              if (isMuscleSelected) {
                  // Si el músculo ya está seleccionado, hacer zoom hacia atrás y deseleccionarlo
                  this.deselectMuscle(mesh, muscleName, originalColor);
                  this.zoomOutFromMuscle(mesh, intersects[0].point);
                  isMuscleSelected = false; // Establecer la bandera a falso
              } else {
                  // Si el músculo no está seleccionado, seleccionarlo y hacer zoom hacia adelante
                  this.selectMuscle(mesh, muscleName, selectedColor);
                  this.zoomInToMuscle(mesh, intersects[0].point);
                  isMuscleSelected = true; // Establecer la bandera a true
              }
          }
      };


      // Agregar evento de clic al botón para resetear la posición de la cámara
      const resetButton = document.getElementById('newButton');
      if (resetButton) {
          resetButton.addEventListener('click', () => {
              console.log('¡Se hizo clic en el nuevo botón!');
              this.resetCameraPosition(); // Aquí llamamos a la función para resetear la posición de la cámara
          });
      }

    // Crear y agregar el div de controles
    this.createControlsDiv();

    this.renderer.domElement.addEventListener('click', onClick);

    this.ngZone.runOutsideAngular(() => {
        window.addEventListener('beforeunload', () => {
            this.renderer.domElement.removeEventListener('click', onClick);
        });
    });
  }

  private deselectMuscle(mesh: THREE.Mesh, muscleName: string, originalColor: number): void {
    // Restaurar el color original del músculo
    (mesh.material as THREE.MeshBasicMaterial).color.setHex(originalColor);

    // Limpiar la selección del músculo
    this.selectedCube = null;

    // Ocultar la información del músculo
    this.muscleInfoDiv.style.display = 'none';
    console.log(`Muscle deselected: ${muscleName}`);
  }

  private selectMuscle(mesh: THREE.Mesh, muscleName: string, selectedColor: number): void {
      console.log("Modelo");
      this.resetCubeColors();
      (mesh.material as THREE.MeshBasicMaterial).color.setHex(selectedColor);
      this.selectedCube = mesh;
      this.updateMuscleInfoDiv(muscleName);
      this.displayMuscleInfoDiv();
      console.log(`Muscle selected: ${muscleName}`);
  }

  private zoomInToMuscle(mesh: THREE.Mesh, clickPosition: THREE.Vector3): void {
    const desiredDistanceToClick = 2; // Distancia deseada para acercarse al músculo

    // Calcular la dirección desde la cámara hacia el punto de clic del ratón
    const directionToClick = clickPosition.clone().sub(this.camera.position).normalize();

    // Calcular la distancia en el eje Z (profundidad)
    const distanceZ = directionToClick.z * desiredDistanceToClick;

    // Calcular la distancia en los ejes X e Y basándose en la distancia en Z y la posición relativa del punto de clic del ratón
    const distanceX = directionToClick.x * Math.sqrt(desiredDistanceToClick ** 2 - distanceZ ** 2);
    const distanceY = directionToClick.y * Math.sqrt(desiredDistanceToClick ** 2 - distanceZ ** 2);

    // Calcular la nueva posición de la cámara para centrarse en el punto de clic del ratón
    const newPosition = new THREE.Vector3(
        clickPosition.x - distanceX,
        clickPosition.y - distanceY,
        clickPosition.z - distanceZ
    );

    this.animateCameraToPosition(newPosition, clickPosition);
  }

  private zoomOutFromMuscle(mesh: THREE.Mesh, clickPosition: THREE.Vector3): void {
    const desiredDistanceToClick = 4; // Distancia deseada para alejarse del músculo

    // Calcular la dirección desde el punto de clic del ratón hacia la cámara
    const directionToCamera = this.camera.position.clone().sub(clickPosition).normalize();

    // Calcular la nueva posición de la cámara para alejarse del punto de clic del ratón
    const newPosition = clickPosition.clone().add(directionToCamera.multiplyScalar(desiredDistanceToClick));

    this.animateCameraToPosition(newPosition, clickPosition);
  }

  private animateCameraToPosition(targetPosition: THREE.Vector3, lookAtPosition: THREE.Vector3): void {
    const animationFrames = 50; // Aumentar el número de fotogramas de animación para una transición más suave
    let frameCount = 0;

    // Función de animación que se llama en cada fotograma
    const animateCamera = () => {
        frameCount++;

        // Calcular la nueva posición de la cámara interpolando entre la posición actual y la deseada
        const position = this.camera.position.clone().lerp(targetPosition, frameCount / animationFrames);

        // Actualizar la posición de la cámara
        this.camera.position.copy(position);
        this.camera.lookAt(lookAtPosition); // Mantener la cámara mirando hacia el punto de interés

        // Si aún no se ha alcanzado el número total de fotogramas, continuar la animación
        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    // Iniciar la animación
    animateCamera();
  }

  private updateMuscleInfoDiv(muscleName: string): void {
    this.muscleInfoDiv.innerHTML = '';

    // Crear una cruz para cerrar el muscleInfoDiv y deseleccionar el modelo de músculo
    const closeButton = document.createElement('span');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.color = '#888';
    closeButton.addEventListener('click', () => {
        this.muscleInfoDiv.style.display = 'none'; // Ocultar el muscleInfoDiv al hacer clic en la cruz
        this.resetCubeColors(); // Deseleccionar el modelo de músculo al hacer clic en la cruz
    });

    // Agregar la cruz al muscleInfoDiv
    this.muscleInfoDiv.appendChild(closeButton);

    const muscleTitle = document.createElement('h2');
    muscleTitle.textContent = muscleName;
    muscleTitle.style.fontSize = '24px';
    muscleTitle.style.fontWeight = 'bold';
    muscleTitle.style.color = '#333';
    this.muscleInfoDiv.appendChild(muscleTitle);

    this.addExerciseItemsToDiv(muscleName);
}



private getRandomColor(): string {
  const colors = ['#2d98c2', '#59bbe0 ', '#548ea4', '#4e7fe5', '#95b4f5', '#2e4e8f', '#3d7af8', '#59509a', '#9de0fa', '#b8e6f8', '#1bb4ef', '#755dcf'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}



    private displayMuscleInfoDiv(): void {
      this.muscleInfoDiv.style.display = 'block';
    }

    private resetCubeColors(): void {
      if (this.selectedCube) {
        (this.selectedCube.material as THREE.MeshBasicMaterial).color.setHex(0x86A6EA);
        this.selectedCube = null;
      }
    }



    public animate(): void {
      // We have to run this outside angular zones,
      // because it could trigger heavy changeDetection cycles.
      this.ngZone.runOutsideAngular(() => {
        if (document.readyState !== 'loading') {
          this.render();
        } else {
          window.addEventListener('DOMContentLoaded', () => {
            this.render();
          });
        }

        window.addEventListener('resize', () => {
          this.resize();
        });
      });
      this.controls.update(); // Actualizar los controles en cada cuadro
    }

    public render(): void {
      this.frameId = requestAnimationFrame(() => {
        this.render();
      });

      // Asegurarse de que el modelo esté definido antes de acceder a su propiedad rotation
      if (this.model) {
        this.model.rotation.x += 0;
        this.model.rotation.y += 0;
      }

      this.renderer.render(this.scene, this.camera);
    }



    public resize(): void {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    }

    private createControlsDiv(): void {
      // Obtener el div de controles si ya existe
      let controlsDiv = document.getElementById('controlsDiv');

      // Si el div de controles ya existe, eliminarlo
      if (controlsDiv) {
          controlsDiv.remove();
      }

      // Crear el nuevo div de controles
      controlsDiv = document.createElement('div');
      controlsDiv.id = 'controlsDiv';
      controlsDiv.style.position = 'absolute';
      controlsDiv.style.right = '50%'; // Posiciona el div en el centro horizontalmente
      controlsDiv.style.transform = 'translateX(50%)'; // Ajusta la posición para mantenerlo centrado
      controlsDiv.style.bottom = '1px';
      controlsDiv.style.padding = '1px';
      controlsDiv.style.backgroundColor = '#FFFFFF';
      controlsDiv.style.borderRadius = '5px';
      controlsDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      controlsDiv.style.transition = 'width 0.3s, height 0.3s, transform 0.3s'; // Añade transform a la transición
      controlsDiv.style.width = '300px';
      controlsDiv.style.height = '90px';
      controlsDiv.style.display = 'flex'; // Cambia a flexbox
      controlsDiv.style.flexDirection = 'column'; // Cambia la dirección de los elementos a columna
      controlsDiv.style.alignItems = 'center'; // Centra horizontalmente los elementos

      // Guardar las propiedades originales del controlsDiv
      controlsDiv['originalWidth'] = controlsDiv.style.width;
      controlsDiv['originalHeight'] = controlsDiv.style.height;
      controlsDiv['originalTransform'] = controlsDiv.style.transform;

      // Crear el botón de alternancia (toggleButton)
      const toggleButton = document.createElement('button');
      toggleButton.textContent = '-------'; // Texto que simula una barra lateral
      toggleButton.style.width = 'auto'; // Ancho automático para que se ajuste al texto
      toggleButton.style.padding = '1px'; // Padding similar al del botón de cambio de tamaño
      toggleButton.style.borderRadius = '0'; // Elimina el borde redondeado
      toggleButton.style.border = 'none'; // Elimina el borde
      toggleButton.style.backgroundColor = 'transparent'; // Fondo transparente
      toggleButton.style.color = '#3498db'; // Color del texto
      toggleButton.style.cursor = 'pointer';
      toggleButton.style.fontWeight = 'bold';
      toggleButton.style.fontSize = '14px';
      toggleButton.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.3)';
      controlsDiv.appendChild(toggleButton); // Agrega el toggleButton al principio del div

      // Crear un contenedor para los botones de acción
      const actionButtonsContainer = document.createElement('div');
      actionButtonsContainer.style.display = 'flex'; // Cambia a flexbox
      actionButtonsContainer.style.justifyContent = 'center'; // Centra los botones horizontalmente

      // Crear los botones con diferentes iconos
      const buttonsData = [
          { icon: 'assets/images/frente.jpg', action: () => this.resetCameraPosition(), backgroundColor: '#A9CCE3' },
          { icon: 'assets/images/espalda.jpg', action: () => this.moveCameraBehindModel(), backgroundColor: '#AED6F1' },
          { icon: 'assets/images/pehco.jpg', action: () => this.moveCameraPecho(), backgroundColor: '#F9E79F' },
          { icon: 'assets/images/piernas.jpg', action: () => this.moveCameraPiernas(), backgroundColor: '#F5CBA7' }
      ];

      // Definir una función para restaurar las propiedades originales de los botones
      const restoreButtonProperties = (button: HTMLElement) => {
          button.style.margin = '5px';
          button.style.display = 'flex';
          button.style.left = 'auto'; // Restaurar la propiedad left
          button.style.padding = '5px'; // Elimina el padding
          button.style.borderRadius = '5px'; // Restaurar el borde redondeado
          console.log('ADIOS');
      };

      buttonsData.forEach(buttonData => {
          const button = document.createElement('button');
          const icon = document.createElement('img');
          icon.src = buttonData.icon;
          icon.width = 40; // Ajusta el ancho de la imagen del icono
          icon.height = 40; // Ajusta la altura de la imagen del icono
          icon.style.objectFit = 'cover'; // Ajusta el tamaño del icono dentro del contenedor
          button.appendChild(icon); // Agrega la imagen del icono al botón

          // Estilos para el botón
          button.style.width = '50px'; // Tamaño fijo para los botones de acción
          button.style.height = '50px'; // Tamaño fijo para los botones de acción
          button.style.padding = '0'; // Elimina el padding
          button.style.borderRadius = '5px';
          button.style.border = 'none';
          button.style.backgroundColor = buttonData.backgroundColor;
          button.style.cursor = 'pointer';
          button.style.margin = '5px'; // Margen para separar los botones

          // Guardar las propiedades originales del botón
          button['originalMargin'] = button.style.margin;
          button['originalDisplay'] = button.style.display;
          button['originalLeft'] = button.style.left;
          button['originalPadding'] = button.style.padding;
          button['originalBorderRadius'] = button.style.borderRadius;

          // Agregar evento de clic al botón
          button.addEventListener('click', buttonData.action);

          // Agregar el botón al contenedor de botones de acción
          actionButtonsContainer.appendChild(button);
      });

      // Agregar el contenedor de botones de acción al div de controles
      controlsDiv.appendChild(actionButtonsContainer);

      // Función para alternar la visibilidad de los botones de zoom
      const toggleZoomButtons = () => {
          actionButtonsContainer.childNodes.forEach(child => {
              if (child instanceof HTMLElement) {
                  child.style.display = child.style.display === 'none' ? 'flex' : 'none';
              }
          });
      };

      // Función para alternar la visibilidad y tamaño del div de controles
      const toggleControls = () => {
          toggleZoomButtons(); // Ocultar o mostrar los botones de zoom
          if (toggleButton && controlsDiv) {
              toggleButton.textContent = toggleButton.textContent === '-------' ? '-------' : '-------'; // Cambiar el texto del botón de alternancia
              controlsDiv.style.width = controlsDiv.style.width === '300px' ? '100px' : '300px'; // Cambiar el ancho del div
              controlsDiv.style.height = controlsDiv.style.height === '90px' ? '23px' : '90px'; // Cambiar el alto del div

              // Ajustar la posición del controlsDiv cuando se cambia el tamaño
              controlsDiv.style.transform = controlsDiv.style.width === '200px' ? 'translateX(0)' : 'translateX(50%)';

              // Restaurar las propiedades originales de los elementos hijos del controlsDiv
              if (controlsDiv.style.width === '300px') {
                  actionButtonsContainer.childNodes.forEach(child => {
                      if (child instanceof HTMLElement) {
                          restoreButtonProperties(child);
                          console.log('HOLAAAAAAAAA');
                      }
                  });
              }
          }
      };

      // Agregar evento de clic al botón de alternancia
      toggleButton.addEventListener('click', toggleControls);

      // Agregar el div de controles al contenedor principal si existe
      const controlsContainer = document.getElementById('controlsContainer');
      if (controlsContainer && controlsDiv) {
          controlsContainer.appendChild(controlsDiv);
      } else {
          console.error('No se pudo encontrar el contenedor de controles o el div de controles.');
      }
  }

  private resetCameraPosition(): void {
    const currentCameraPosition = this.camera.position.clone(); // Posición actual de la cámara
    const initialCameraPosition = new THREE.Vector3(0, 0, 5); // Posición inicial de la cámara

    const animationFrames = 200; // Número de fotogramas de animación

    let frameCount = 0;

    // Función de animación que se llama en cada fotograma
    const animateCamera = () => {
        frameCount++;

        // Calcular la nueva posición de la cámara interpolando entre la posición actual y la inicial
        const newPosition = currentCameraPosition.clone()
            .lerp(initialCameraPosition, frameCount / animationFrames);

        // Actualizar la posición de la cámara
        this.camera.position.copy(newPosition);
        this.camera.lookAt(0, 0, 0); // Orientar la cámara hacia el origen de la escena

        // Si aún no se ha alcanzado el número total de fotogramas, continuar la animación
        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    // Iniciar la animación
    animateCamera();
  }

  private moveCameraBehindModel(): void {
    const currentCameraPosition = this.camera.position.clone();
    const EspaldaCameraPosition = new THREE.Vector3(0, 0, -5);

    const animationFrames = 200;

    let frameCount = 0;

    const animateCamera = () => {
        frameCount++;

        const newPosition = currentCameraPosition.clone()
            .lerp(EspaldaCameraPosition, frameCount / animationFrames);

        this.camera.position.copy(newPosition);
        this.camera.lookAt(0, 0, 0);

        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();
  }

  private moveCameraPecho(): void {
    const currentCameraPosition = this.camera.position.clone();
    const PechoCameraPosition = new THREE.Vector3(0, 1.5, 2);

    const animationFrames = 100;

    let frameCount = 0;

    const animateCamera = () => {
        frameCount++;

        const newPosition = currentCameraPosition.clone()
            .lerp(PechoCameraPosition, frameCount / animationFrames);

        this.camera.position.copy(newPosition);
        this.camera.lookAt(0, 2, 0);

        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();
  }

  private moveCameraPiernas(): void {
    const currentCameraPosition = this.camera.position.clone();
    const PiernasCameraPosition = new THREE.Vector3(0, -0.5, 2);

    const animationFrames = 100;

    let frameCount = 0;

    const animateCamera = () => {
        frameCount++;

        const newPosition = currentCameraPosition.clone()
            .lerp(PiernasCameraPosition, frameCount / animationFrames);

        this.camera.position.copy(newPosition);
        this.camera.lookAt(0, -0.5, 0);

        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();
  }

  /*private moveCameraEspalda(): void {
    const currentCameraPosition = this.camera.position.clone();
    const EspaldaCameraPosition = new THREE.Vector3(0, 1.5, -2);

    const animationFrames = 100;

    let frameCount = 0;

    const animateCamera = () => {
        frameCount++;

        const newPosition = currentCameraPosition.clone()
            .lerp(EspaldaCameraPosition, frameCount / animationFrames);

        this.camera.position.copy(newPosition);
        this.camera.lookAt(0, 2, 0);

        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();
  }*/

  /*private moveCameraPiernasDetras(): void {
    const currentCameraPosition = this.camera.position.clone();
    const PiernasCameraPosition = new THREE.Vector3(0, -0.5, -2);

    const animationFrames = 100;

    let frameCount = 0;

    const animateCamera = () => {
        frameCount++;

        const newPosition = currentCameraPosition.clone()
            .lerp(PiernasCameraPosition, frameCount / animationFrames);

        this.camera.position.copy(newPosition);
        this.camera.lookAt(0, -0.5, 0);

        if (frameCount < animationFrames) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();
  }*/

  }


