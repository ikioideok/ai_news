import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// -- 定数 ------------------------------------------------
const MODEL_PATH = './model.vrm'; // ★ご自身のモデルへのパスに変更してください

// -- レンダラーとシーンのセットアップ ---------------------
const canvas = document.getElementById('vrmPreviewCanvas');
if (!canvas) throw new Error('Preview canvas not found');

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
});
renderer.setPixelRatio(window.devicePixelRatio);

// CSSで指定された表示サイズを取得
const width = canvas.clientWidth;
const height = canvas.clientHeight;

const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 20);
camera.position.set(0, 1.4, 1.2);

renderer.setSize(width, height, false);
camera.updateProjectionMatrix();

// -- ライティング ---------------------------------------
const directionalLight = new THREE.DirectionalLight(0xffffff, 3.4);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.5);
scene.add(hemiLight);

// -- VRMモデルのロード ------------------------------------
let currentVRM = null;
const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));

loader.load(
    MODEL_PATH,
    (gltf) => {
        const vrm = gltf.userData.vrm;
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        
        currentVRM = vrm;

        // ▼▼▼ 腕の自然なAポーズ修正 ▼▼▼
        const deg = THREE.MathUtils.degToRad;
        const humanoid = vrm.humanoid;

        const leftUpperArm = humanoid.getNormalizedBoneNode('leftUpperArm');
        const rightUpperArm = humanoid.getNormalizedBoneNode('rightUpperArm');
        const leftLowerArm = humanoid.getNormalizedBoneNode('leftLowerArm');
        const rightLowerArm = humanoid.getNormalizedBoneNode('rightLowerArm');

        if (leftUpperArm && rightUpperArm && leftLowerArm && rightLowerArm) {
            leftUpperArm.rotation.set(deg(-10), 0, deg(80));
            rightUpperArm.rotation.set(deg(-10), 0, deg(-80));
            leftLowerArm.rotation.set(deg(0), deg(-95), deg(25));
            rightLowerArm.rotation.set(deg(0), deg(95), deg(-25));
        }
        // ▲▲▲ ここまで ▲▲▲

        // Y軸反転（正面向かせる）
        vrm.scene.rotation.y = Math.PI;

        scene.add(vrm.scene);

        // カメラ注視点
        const head = humanoid.getNormalizedBoneNode('head');
        if (head) {
            camera.lookAt(head.getWorldPosition(new THREE.Vector3()));
        }

        console.log('Preview VRM loaded successfully.');
    },
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error)
);

// -- アニメーションループ ---------------------------------
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    if (currentVRM) {
        const elapsedTime = clock.getElapsedTime();
        currentVRM.scene.position.y = Math.sin(elapsedTime * 1.5) * 0.01;
        currentVRM.update(delta);
    }

    renderer.render(scene, camera);
}

animate();
