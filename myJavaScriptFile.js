// myJavaScriptFile.js

window.onload = init;

var WIDTH = window.innerWidth;
var HEIGHT =  window.innerHeight;

var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

var renderer;
var scene;
var camera;
var stats;

var clock = new THREE.Clock();
var keyboard = new THREEx .KeyboardState();

var keyboard;

var raycaster, raycasterFront, raycasterBack;

var objects = [];

var yVelocity = 0;
var yAcceleration = 2.0;

var myColladaLoader;
var terrain;
var arrow, arrowTwo, arrowThree, arrowFour, arrowFive, arrowSix;

var skyBoxMesh;
var texture_placeholder;

function init() {

  renderer = new THREE.WebGLRenderer();

  var docElement = document.getElementById('myDivContainer');
  docElement.appendChild(renderer.domElement);

  renderer.setClearColor("rgb(135,206,250)");

  renderer.setSize( window.innerWidth, window.innerHeight );

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  docElement.appendChild( stats.domElement );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

  scene.add(camera);
  camera.position.set(200,0,225);
  camera.lookAt(scene.position);
  camera.rotation.y = 90 * Math.PI / 180;

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0 ,-1, 0), 0, 10);

  initScene();

  render();
}

function initScene() {

  texture_placeholder = document.createElement( 'canvas' );
  texture_placeholder.width = 128;
  texture_placeholder.height = 128;

  var context = texture_placeholder.getContext( '2d' );
  context.fillStyle = 'rgb( 200, 200, 200)';
  context.fillRect( 0 , 0, texture_placeholder.width, texture_placeholder.height );

  var materials = [
    loadTexture( ' textures/cube/skybox/Left.png' ), loadTexture( ' textures/cube/skybox/Right.png' ), loadTexture( ' textures/cube/skybox/Up.png' ),
    loadTexture( ' textures/cube/skybox/Down.png' ), loadTexture( ' textures/cube/skybox/Back.png' ), loadTexture( ' textures/cube/skybox/Front.png' )
  ];

skyBoxMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 7, 7, 7), new THREE.MeshFaceMaterial( materials ));
skyBoxMesh.scale.x = - 1;
scene.add(skyBoxMesh);

  var light = new THREE.DirectionalLight( 0xffffff, 1.5 ,1.5 );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  var light2 = new THREE.DirectionalLight( 0xffffff, 1.5, 1.5  );
  light2.position.set( -1, -1, -1 );
  scene.add( light2 );

  myColladaLoader = new THREE.ColladaLoader();
  myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load( 'arrow.DAE', function ( collada ) {

			arrow = collada.scene;

      arrow.position.set(170,-4.5,225);
      arrow.rotation.y = 90 * Math.PI / 180;

      arrow.scale.x = arrow.scale.y = arrow.scale.z = 0.3;
      arrow.updateMatrix();

      arrow.name = "arrow";
			scene.add(arrow);
      objects.push(arrow);

		} );

    myColladaLoader.load( 'arrow.DAE', function ( collada ) {

        arrowTwo = collada.scene;

        arrowTwo.position.set(0,-4.5,225);
        arrowTwo.rotation.y = 0 * Math.PI / 180;

        arrowTwo.scale.x = arrowTwo.scale.y = arrowTwo.scale.z = 0.3;
        arrowTwo.updateMatrix();

        arrowTwo.name = "arrowTwo";
        scene.add(arrowTwo);
        objects.push(arrowTwo);

      } );

      myColladaLoader.load( 'arrow.DAE', function ( collada ) {

          arrowThree = collada.scene;

          arrowThree.position.set(0,-4.5,40);
          arrowThree.rotation.y = 270 * Math.PI / 180;

          arrowThree.scale.x = arrowThree.scale.y = arrowThree.scale.z = 0.3;
          arrowThree.updateMatrix();

          arrowThree.name = "arrowThree";
          scene.add(arrowThree);
          objects.push(arrowThree);

        } );

        myColladaLoader.load( 'arrow.DAE', function ( collada ) {

            arrowFour = collada.scene;

            arrowFour.position.set(120,-4.5,40);
            arrowFour.rotation.y = 270 * Math.PI / 180;

            arrowFour.scale.x = arrowFour.scale.y = arrowFour.scale.z = 0.3;
            arrowFour.updateMatrix();

            arrowFour.name = "arrowFour";
            scene.add(arrowFour);
            objects.push(arrowFour);

          } );

          myColladaLoader.load( 'arrow.DAE', function ( collada ) {

              arrowFive = collada.scene;

              arrowFive.position.set(260,-4.5,40);
              arrowFive.rotation.y = 0 * Math.PI / 180;

              arrowFive.scale.x = arrowFive.scale.y = arrowFive.scale.z = 0.3;
              arrowFive.updateMatrix();

              arrowFive.name = "arrowFive";
              scene.add(arrowFive);
              objects.push(arrowFive);

            } );

            myColladaLoader.load( 'arrow.DAE', function ( collada ) {

                arrowSix = collada.scene;

                arrowSix.position.set(260,-4.5,-60);
                arrowSix.rotation.y = 90 * Math.PI / 180;

                arrowSix.scale.x = arrowSix.scale.y = arrowSix.scale.z = 0.3;
                arrowSix.updateMatrix();

                arrowSix.name = "arrowSix";
                scene.add(arrowSix);
                objects.push(arrowSix);

              } );


    myColladaLoader.load( 'room.DAE', function ( collada ) {

        terrain = collada.scene;

        terrain.position.x = 0;
        terrain.position.y = -5;
        terrain.position.z = 0;

        terrain.scale.x = terrain.scale.y = terrain.scale.z = 0.5;
        terrain.updateMatrix();


        terrain.name = "terrain";
        scene.add(terrain);
        objects.push(terrain);

      } );

}

function render() {

  var deltaTime = clock.getDelta();

  var tmpY = camera.position.y;

  var matrix = new THREE.Matrix4();
  matrix.extractRotation( camera.matrix );
  var trajectory = new THREE.Vector3( 0,0,-1);
  trajectory = trajectory.applyMatrix4(matrix);

  var trajectoryBack = new THREE.Vector3(0,0,-1).negate();
  trajectoryBack = trajectoryBack.applyMatrix4(matrix);

  raycasterFrontC = new THREE.Raycaster( camera.position,trajectory,0,2);
  var intersectionsFront = raycasterFrontC.intersectObjects( objects, true);
  raycasterBackC = new THREE.Raycaster( camera.position, trajectoryBack,0,2);
  var intersectionsBack = raycasterBackC.intersectObjects( objects, true);

  camera.position.y = tmpY;

  raycaster.ray.origin.copy( camera.position );
  raycaster.ray.y -= 1;
  var intersections = raycaster.intersectObjects( objects, true );

  yVelocity = yVelocity  - yAcceleration * deltaTime;

  camera.position.y = camera.position.y = yVelocity;

  document.getElementById("debugInfo").innerHTML =  "Gravity = " + intersections.length +
    "<br>" +"Front Collision = " + intersectionsFront.length +
    "<br>" + "Back Collision = " + intersectionsBack.length;

    if ( intersections.length > 0) {
      if(camera.position.y < tmpY) {
        camera.position.y = tmpY;
      }
    }

    var moveDistance = 20 * deltaTime;
    var rotateAngle = Math.PI / 2 * deltaTime;
    var rotation_matrix = new THREE.Matrix4().identity();

    if(intersectionsFront.length > 0) {
      if( intersectionsFront[0].object.parent.id == "node-Exit") {
        document.getElementById("info").innerHTML = "You Evacuated Successfully!";
      }
    }

    if( keyboard.pressed("W")) {
      if(intersectionsFront.length > 0 ) {
        moveDistance = 0;
      } else {
      camera.translateZ( -moveDistance );
    }
  }
    if ( keyboard.pressed("S") ) {
      if (intersectionsBack.length > 0) {
        moveDistance = 0;
      } else {
      camera.translateZ(  moveDistance );
      }
    }
    if ( keyboard.pressed("A") ) {
      camera.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    }
    if ( keyboard.pressed("D") ) {
      camera.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    }

  renderer.render(scene, camera);

  stats.update();

  requestAnimationFrame(render);

}

function loadTexture( path ) {
  var texture = new THREE.Texture( texture_placeholder );
  var material = new THREE.MeshBasicMaterial( {map: texture, overdraw: 0.5 });

  var image = new Image();

  image.onload = function () {
    texture.image = this;
    texture.needsUpdate = true;
  };

  image.src = path;

  return material;
}

//-------------------------------------------------
//                          EOF
//-------------------------------------------------
