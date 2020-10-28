// Variables maestras
let renderer, scene, camera;

// Variables globales
let suelo, robot, base;
let brazo, eje, esparrago, rutula;
let antebrazo, disco, nervios = [];
let mano, dedos = [], pinzas = [];
let x = [1, 1, -1, -1], z = [-1, 1, 1, -1], material = [], angulo = 0;

// Acciones
init();
loadScene();
render();

function init() {
    // Crear el motor, la escena y la camara

    // Motor de render
    renderer = new THREE.WebGLRenderer();
    //Tamaño dela area donde vamos a dibujar
    renderer.setSize(window.innerWidth,window.innerHeight);
    //Color con el que se formatea el contenedor
    renderer.setClearColor(new THREE.Color(0x00AA00));
    //Agregamos el elemento canvas de renderer al contenedor
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    let ar = window.innerWidth / window.innerHeight;// Razón de aspecto
    camera = new THREE.PerspectiveCamera( 40, ar, 0.1, 7000); // Inicializa camara (Angulo, razón de aspecto, Distancia con efecto, Distancia sin efecto)
    //camera = new THREE.OrthographicCamera( -50, 50, 50, -50, 1, 1000 );
    scene.add(camera);//Agregamos la camara a la escena
    // Posición e la camara (Diferente a la posición  defecto)
    //camera.position.set(100,0,0);
    //camera.position.set(0,100,0);
    //camera.position.set(0,0,100);
    //camera.position.set(100,0,100);
    //camera.position.set(100,100,100);
    //camera.position.set(0,500,0);
    //camera.position.set(500,0,500);
    camera.position.set(400,400,400);
    camera.lookAt(new THREE.Vector3(0,0,0)); // A donde esta mirando la cámara
}

function loadScene() {
    // Cargar la escena con objetos
    generateMaterials();
    // Geometrias
    const geosuelo = new THREE.PlaneGeometry(750, 750, 20, 20);
    const geobase = new THREE.CylinderGeometry(50, 50, 15, 50);
    const geoeje = new THREE.CylinderGeometry(20, 20, 18, 40);
    const geoesparrago = new THREE.BoxGeometry(18, 120, 12);
    const georotula = new THREE.SphereGeometry(20, 32, 20);
    const geodisco = new THREE.CylinderGeometry(22, 22, 6, 40);
    const geonervios = new THREE.BoxGeometry(4, 80, 4);
    const geomano = new THREE.CylinderGeometry(15, 15, 40, 10);
    const ancho = 19, alto = 20, fondo = 4, mueve = ancho;
    const geopalma = new THREE.BoxGeometry(ancho, alto, fondo);
    const geopinza = buildPinzas(ancho/2, alto/2, fondo/2, mueve);
    //const geopinza = buildPinzas(ancho, alto, fondo, mueve);

    // Objetos
    suelo = new THREE.Mesh(geosuelo, material[0]);
    suelo.rotation.x += Math.PI/2;
    suelo.rotation.z += Math.PI/4;

    //Objeto robot (Add: base)
    robot = new THREE.Object3D();

    //Objeto base (Add: brazo)
    base = new THREE.Mesh(geobase, material[1]);
    base.position.y += 7.5;

    //Objeto brazo (Add: eje + esparrago + rotula + antebrazo)
    brazo = new THREE.Object3D();

    //Objeto eje
    eje = new THREE.Mesh(geoeje, material[2]);
    eje.rotation.x = Math.PI/2;

    //Objeto esparrago
    esparrago = new THREE.Mesh(geoesparrago, material[3]);
    esparrago.position.y += 60;

    //Objeto rotula
    rotula = new THREE.Mesh(georotula, material[4]);
    rotula.position.y += 120;

    //Objeto antebrazo (Add: disco + nervios + mano)
    antebrazo = new THREE.Object3D();
    antebrazo.position.y += 120;

    //Objeto disco
    disco = new THREE.Mesh(geodisco, material[5]);

    //Objeto disco
    for (let i = 0; i < 4; i++) {
        nervios[i] = new THREE.Mesh(geonervios, material[6]);
        nervios[i].position.y += 40;
        nervios[i].position.x += x[i] * (22/2.5 - 2);
        nervios[i].position.z += z[i] * (22/2.5 - 2);
    }

    //Objeto mano
    mano = new THREE.Mesh(geomano, material[7]);
    mano.position.y += 80;
    mano.rotation.x = Math.PI/2;

    //Objeto pinzas
    dedos[0] = new THREE.Mesh(geopalma, material[8]);
    dedos[0].position.x += 20;
    dedos[0].position.y += 10;//Con respecto a mano
    dedos[0].rotation.x = Math.PI/2;

    pinzas[0] = new THREE.Mesh(geopinza, material[1]);

    dedos[1] = new THREE.Mesh(geopalma, material[8]);
    dedos[1].position.x += 20;
    dedos[1].position.y += -10;//Con respecto a mano
    dedos[1].rotation.x = Math.PI/2;

    pinzas[1] = new THREE.Mesh(geopinza, material[1]);
    pinzas[1].rotation.x = Math.PI;

    //El grafo de escena es así:
    robot.add(base);
    base.add(brazo);
    brazo.add(eje);
    brazo.add(esparrago);
    brazo.add(rotula);
    antebrazo.add(disco);
    for (let i = 0; i < 4; i++) {
        antebrazo.add(nervios[i]);
    }
    dedos[0].add(pinzas[0]);
    mano.add(dedos[0]);
    dedos[1].add(pinzas[1]);
    mano.add(dedos[1]);
    //mano.add( new THREE.AxisHelper(1000) );
    antebrazo.add(mano);
    brazo.add(antebrazo);

    // Construir la escena
    scene.add(suelo);
    scene.add(robot);
    //scene.add( new THREE.AxisHelper(1000) ); // Ayudante de ejes para la escena

}

function update() {
    // Cambios entre frames
    //angulo += Math.PI/400;
    //robot.rotation.y = angulo;
}

function render() {
    // Dibujar cada frame y lo muestra
    requestAnimationFrame(render);// Llega el evento de dibujo en llamada recursiva
    update();//Actualiza la escena
    renderer.render( scene, camera ); // Le decimos al motor que renderice
}

function generateMaterials() {
    // Materiales
    material[0] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(51, 76, 255)"),
        wireframe:true
    });
    material[1] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(233, 51, 255)"),
        wireframe:true
    });
    material[2] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(73, 255, 51)"),
        wireframe:true
    });
    material[3] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(51, 255, 240)"),
        wireframe:true
    });
    material[4] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(184, 51, 255)"),
        wireframe:true
    });
    material[5] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 51, 51)"),
        wireframe:true
    });
    material[6] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(147, 51, 255)"),
        wireframe:true
    });
    material[7] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(51, 255, 215)"),
        wireframe:true
    });
    material[8] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 233, 51)"),
        wireframe:true
    });
}

function buildPinzas(ancho, alto, fondo, x) {
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-1 * ancho + x, -1 * alto,  1 * fondo),  // 0
        new THREE.Vector3( 1 * ancho + x, -1 * alto + (alto / 4),  1 * fondo),  // 1
        new THREE.Vector3(-1 * ancho + x,  1 * alto,  1 * fondo),  // 2
        new THREE.Vector3( 1 * ancho + x,  1 * alto - (alto / 4),  1 * fondo),  // 3
        new THREE.Vector3(-1 * ancho + x, -1 * alto, -1 * fondo),  // 4
        new THREE.Vector3( 1 * ancho + x, -1 * alto + (alto / 4), -1 * fondo / 2),  // 5
        new THREE.Vector3(-1 * ancho + x,  1 * alto, -1 * fondo),  // 6
        new THREE.Vector3( 1 * ancho + x,  1 * alto - (alto / 4), -1 * fondo / 2),  // 7
    );
    geometry.faces.push(
        // front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
    );

    geometry.computeFaceNormals();

    return geometry;
}