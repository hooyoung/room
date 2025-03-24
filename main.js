import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FirstPersonControls } from './modules/FirstPersonControls.js';

let camera, controls, scene, renderer;
let parentElt = document.querySelector('.right');
let sock;


const clock = new THREE.Clock();

initNet();
initRenderer();

function initNet() {
	sock = new WebSocket("ws://localhost:8765/");
	sock.addEventListener("message", ({data}) => {
		const div = document.createElement("div");
		div.textContent = data;
		document.querySelector("#chatwindow").appendChild(div);
	});

	const form = document.querySelector("#chatform");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		sock.send(JSON.stringify({chat: document.querySelector("#msg").value}));
		form.reset();
	});
}

function initRenderer() {

	camera = new THREE.PerspectiveCamera( 70, parentElt.clientWidth / parentElt.clientHeight, 0.1, 100 );
	camera.position.set(3,2,0);
	camera.lookAt(5,2,-0.5);

	scene = new THREE.Scene();


	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

	const loader = new GLTFLoader()
	loader.load(
		'blend.glb',
		function (gltf) {
			scene.add(gltf.scene);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.log(error);
		}
	);

	console.log(camera);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( parentElt.clientWidth, parentElt.clientHeight );
	renderer.setAnimationLoop( animate );
	parentElt.appendChild( renderer.domElement );


	controls = new FirstPersonControls( camera, renderer.domElement );

	parentElt.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

	camera.aspect = parentElt.clientWidth / parentElt.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( parentElt.clientWidth, parentElt.clientHeight );
}

function animate() {
	controls.update(clock.getDelta());

	renderer.render( scene, camera );

}
