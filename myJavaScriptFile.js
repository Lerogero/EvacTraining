// myJavaScriptFile.js

// Set the initialise function to be called
// when the page has loaded.

window.onload = init;

// set the size of our canvas / view onto the scene.
var WIDTH = window.innerWidth;
var HEIGHT =  window.innerHeight;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

// Declare the variables we will need for the three.js
var renderer;
var scene;
var camera;
var stats;

var clock = new THREE.Clock();
var keyboard = new THREEx .KeyboardState();

var keyboard;

var raycaster;
var raycasterF;
var raycasterB;

var objects = [];

var yVelocity = 0;
var yAcceleration = 2.0;

var myColladaLoader;
var terrain;
var arrow;
var arrowTwo;

var arrowAnimations;
var keyFrameAnimations = [];
var keyFrameAnimationsLength = 0;
var lastFrameCurrentTime = [];

var skyBoxMesh;
var texture_placeholder;

var score = 0;

function init() {

  renderer = new THREE.WebGLRenderer();


  var docElement = document.getElementById('myDivContainer');
  docElement.appendChild(renderer.domElement);

  renderer.setClearColor("rgb(135,206,250)");

  renderer.setSize( window.innerWidth, window.innerHeight );
  // Set the rednerer size for window rescale.
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  // Stats of performance of game
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  docElement.appendChild( stats.domElement );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

  scene.add(camera);
  camera.position.set(-4,0,30);
  camera.lookAt(scene.position);

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0 ,-1, 0), 0, 10);

  initScene();

  render();
}


function initScene() {

  // Skybox
  texture_placeholder = document.createElement( 'canvas' );
  texture_placeholder.width = 128;
  texture_placeholder.height = 128;

  var context = texture_placeholder.getContext( '2d' );
  context.fillStyle = 'rgb( 200, 200, 200)';
  context.fillRect( 0 , 0, texture_placeholder.width, texture_placeholder.height );

  var materials = [
    loadTexture( ' textures/cube/skybox/Left.png' ),
    loadTexture( ' textures/cube/skybox/Right.png' ),
    loadTexture( ' textures/cube/skybox/Up.png' ),
    loadTexture( ' textures/cube/skybox/Down.png' ),
    loadTexture( ' textures/cube/skybox/Back.png' ),
    loadTexture( ' textures/cube/skybox/Front.png' )
  ];

skyBoxMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 7, 7, 7), new THREE.MeshFaceMaterial( materials ));
skyBoxMesh.scale.x = - 1;
scene.add(skyBoxMesh);

  // Add light
  var light = new THREE.DirectionalLight( 0xffffff, 1.5, 1.5  );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  var light2 = new THREE.DirectionalLight( 0xffffff, 1.5, 1.5  );
  light2.position.set( -1, -1, -1 );
  scene.add( light2 );

  myColladaLoader = new THREE.ColladaLoader();
  myColladaLoader.options.convertUpAxis = true;

  // Import arrow model
	myColladaLoader.load( 'arrow.DAE', function ( collada ) {
			// Here we store the dae in a global variable.
			arrow = collada.scene;

      arrowAnimations = collada.animations;

      keyFrameAnimationsLength = arrowAnimations.length;

      for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
        lastFrameCurrentTime[i];
      }

      for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
        var animation = arrowAnimations[ i ];

        var keyFrameAnimation = new THREE.KeyFrameAnimation( animation );
        keyFrameAnimation.timeScale = 1;
        keyFrameAnimation.loop = false;

        keyFrameAnimations.push( keyFrameAnimation );
      }

			// Position your model in the scene (world space).objects
      arrow.position.set(-5,-2.5,20);
      arrow.rotation.y = 4.6;
			// Scale your model to the correct size.
      arrow.scale.x = arrow.scale.y = arrow.scale.z = 0.1;
      arrow.updateMatrix();

			// Add the model to the scene.

      arrow.name = "arrow";
			scene.add(arrow);
      objects.push(arrow);

		} );

    // Import arrow model
    myColladaLoader.load( 'arrow.DAE', function ( collada ) {
        // Here we store the dae in a global variable.
        arrowTwo = collada.scene;

        arrowTwoAnimations = collada.animations;

        keyFrameAnimationsLength = arrowTwoAnimations.length;

        for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
          lastFrameCurrentTime[i];
        }

        for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
          var animation = arrowTwoAnimations[ i ];

          var keyFrameAnimation = new THREE.KeyFrameAnimation( animation );
          keyFrameAnimation.timeScale = 1;
          keyFrameAnimation.loop = false;

          keyFrameAnimations.push( keyFrameAnimation );
        }

        // Position your model in the scene (world space).objects
        arrowTwo.position.set(-10,-2.5,20);
        arrowTwo.rotation.y = 4.6;
        // Scale your model to the correct size.
        arrowTwo.scale.x = arrowTwo.scale.y = arrowTwo.scale.z = 0.1;
        arrowTwo.updateMatrix();

        // Add the model to the scene.

        arrowTwo.name = "arrowTwo";
        scene.add(arrowTwo);
        objects.push(arrowTwo);

      } );

    // Import terrain model
    myColladaLoader.load( 'grant.DAE', function ( collada ) {
        // Here we store the dae in a global variable.
        terrain = collada.scene;

        // Position your model in the scene (world space).
        terrain.position.x = 0;
        terrain.position.y = -5;
        terrain.position.z = 0;

        // Scale your model to the correct size.
        terrain.scale.x = terrain.scale.y = terrain.scale.z = 1;
        terrain.updateMatrix();

        // Add the model to the scene.
        terrain.name = "terrain";
        scene.add(terrain);
        objects.push(terrain);

        startAnimations();
      } );

}

// Start the animations
function startAnimations() {
  for ( var i = 0; i < keyFrameAnimationsLength; i++)  {
    var animation = keyFrameAnimations[i];
    animation.play();
  }
}

// Loop through the animations when animations finished
function loopAnimations() {
  for ( var i = 0; i < keyFrameAnimationsLength; i ++ ) {
    if(keyFrameAnimations[i].isPlaying && !keyFrameAnimations[i].isPaused) {
      if(keyFrameAnimations[i].currentTime == lastFrameCurrentTime[i]) {
        keyFrameAnimations[i].stop();
        keyFrameAnimations[i].play();
        lastFrameCurrentTime[i] = 0;
      }
    }
  }
}

function render() {

  var deltaTime = clock.getDelta();

  THREE.AnimationHandler.update( deltaTime );
  loopAnimations();

  var tmpY = camera.position.y;

  // Check camera rotation
  var matrix = new THREE.Matrix4();
  matrix.extractRotation( camera.matrix );
  var direction = new THREE.Vector3( 0,0,-1);
  direction = direction.applyMatrix4(matrix);

  var directionB = new THREE.Vector3(0,0,-1).negate();
  directionB = directionB.applyMatrix4(matrix);

  // Raycaster in direction of front and back of camera
  raycasterFC = new THREE.Raycaster( camera.position,direction,0,2);
  var intersectionsF = raycasterFC.intersectObjects( objects, true);
  raycasterBC = new THREE.Raycaster( camera.position, directionB,0,2);
  var intersectionsB = raycasterBC.intersectObjects( objects, true);

  camera.position.y = tmpY;

  // Raycaster gravity down
  raycaster.ray.origin.copy( camera.position );
  raycaster.ray.y -= 1;
  var intersections = raycaster.intersectObjects( objects, true );

  yVelocity = yVelocity  - yAcceleration * deltaTime;

  camera.position.y = camera.position.y = yVelocity;

  //Debugger
  document.getElementById("debugInfo").innerHTML =  "Gravity = " + intersections.length +
    "<br>" +"Forward Collision = " + intersectionsF.length +
    "<br>" + "Back Collision = " + intersectionsB.length;

    if ( intersections.length > 0) {
      if(camera.position.y < tmpY) {
        camera.position.y = tmpY;
      }
    }

    var moveDistance = 20 * deltaTime;
    var rotateAngle = Math.PI / 2 * deltaTime;
    var rotation_matrix = new THREE.Matrix4().identity();

    // Check intersections with arrow, then move.
    if(intersectionsF.length > 0) {
      if( intersectionsF[0].object.parent.id == "node-Torus001") {

        // Switch to move the arrow around depnding on score
        switch (score){
          case 0:
          arrow.position.set(-15, -2, 4); //sets the position of the arrow after  a hit
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 10:
          arrow.position.set(-24.5,-2 ,70);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 20:
		  arrow.position.set(-45,-2 ,20);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 30:
		    arrow.position.set(20,-2, -17);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 40:
		  arrow.position.set(23,-2, 7);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 50:
		  arrow.position.set(45,-2, 15);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 60:
		    arrow.position.set(20,-2, 35);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 70:
		  arrow.position.set(40,-2, 51);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 80:
		  arrow.position.set(0,-2, 73);
            score = score + 10;
            document.getElementById("score").innerHTML = "Score: " + score;
            break;
          case 90:
			score = score + 10;
			document.getElementById("score").innerHTML = "Score: " + score;
            alert("You Win! Press CTRL + R to play again!");
            break;
        }
      }
    }

    // Movement controls
    if( keyboard.pressed("W")) {
      if(intersectionsF.length > 0 ) {
        moveDistance = 0;
      } else {
      camera.translateZ( -moveDistance );
    }
  }
    if ( keyboard.pressed("S") ) {
      if (intersectionsB.length > 0) {
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

  // Check for animation loop
  for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
    lastFrameCurrentTime[i] = keyFrameAnimations[i].currentTime;
  }
}

// Load the skybox textures
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
