import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';

// --- 基本設定 ---------------------------------------------------------------
const canvas = document.getElementById('vrmCanvas');
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// --- カメラ設定 -------------------------------------------------------------
// VRM表示エリアのサイズを起動時に取得。0の場合はエラー防止のため仮のサイズ(1)を使う
const initialWidth = canvas.clientWidth || 1;
const initialHeight = canvas.clientHeight || 1;

const camera = new THREE.PerspectiveCamera(30, initialWidth / initialHeight, 0.1, 20);
camera.position.set(0, 1.3, 2.2); // キャラクターが見やすい最適な初期位置

// カメラの注視点
const lookAtTarget = new THREE.Vector3(0, 1.1, 0);
camera.lookAt(lookAtTarget);

// --- レンダラー設定 ---------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(initialWidth, initialHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// --- ライト設定 -------------------------------------------------------------
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2.5);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(1, 2, 3);
scene.add(dirLight);

// --- VRMモデルのロード ------------------------------------------------------
const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));

let currentVrm = null;
const modelUrl = 'https://raw.githubusercontent.com/ikioideok/aima/main/MyAvatar_20250718160503.vrm';

loader.load(
    modelUrl,
    (gltf) => {
        const vrm = gltf.userData.vrm;
        vrm.scene.rotation.y = Math.PI; // モデルを180度回転させて正面を向かせる
        scene.add(vrm.scene);
        currentVrm = vrm;

        // --- ★★★ ここにポーズ設定を反映 ★★★ ---
        const humanoid = vrm.humanoid;
        const leftUpperArm = humanoid.getNormalizedBoneNode('leftUpperArm');
        const rightUpperArm = humanoid.getNormalizedBoneNode('rightUpperArm');
        const leftLowerArm = humanoid.getNormalizedBoneNode('leftLowerArm');
        const rightLowerArm = humanoid.getNormalizedBoneNode('rightLowerArm');
        const leftHand = humanoid.getNormalizedBoneNode('leftHand');
        const rightHand = humanoid.getNormalizedBoneNode('rightHand');

        if (leftUpperArm && rightUpperArm) {
            leftUpperArm.rotation.set(1.0, -2.2, 2.2);
            rightUpperArm.rotation.set(-0.4, 0.5, -1.0);
        }
        if (leftLowerArm && rightLowerArm) {
            leftLowerArm.rotation.set(-3.2, 4.0, 2.5);
            rightLowerArm.rotation.set(1.3, 2.1, 0.3);
        }
        if (leftHand && rightHand) {
            leftHand.rotation.set(1.0, 0.2, 1.0);
            leftHand.position.set(0.1, -0.2, 0.1);
            rightHand.rotation.set(2.0, 0.4, 0.3);
            rightHand.position.set(0.45, -0.1, -0.05);
        }

        const fingers = [
            'thumbProximal', 'thumbIntermediate', 'thumbDistal',
            'indexProximal', 'indexIntermediate', 'indexDistal',
            'middleProximal', 'middleIntermediate', 'middleDistal',
            'ringProximal', 'ringIntermediate', 'ringDistal',
            'littleProximal', 'littleIntermediate', 'littleDistal'
        ];
        for (const side of ['left', 'right']) {
            for (const name of fingers) {
                const boneName = `${side}${name.charAt(0).toUpperCase() + name.slice(1)}`;
                const finger = humanoid.getNormalizedBoneNode(boneName);
                if (finger) {
                    finger.rotation.set(-0.5, 0, 0);
                }
            }
        }
        // --- ポーズ設定ここまで ---
    },
    (progress) => console.log(`Loading model... ${Math.round(100 * (progress.loaded / progress.total))}%`),
    (error) => console.error('Failed to load VRM model:', error)
);

// --- アニメーションループ ----------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (currentVrm) {
        // 自然な揺れや瞬きなどを表現
        const elapsedTime = clock.getElapsedTime();
        const head = currentVrm.humanoid.getNormalizedBoneNode('head');
        if (head) {
            head.rotation.x = Math.sin(elapsedTime * 1.2) * 0.03;
            head.rotation.y = Math.sin(elapsedTime * 0.9) * 0.05;
        }
        const blinkCycle = 4.0 + Math.random() * 2.0;
        const timeInBlinkCycle = elapsedTime % blinkCycle;
        currentVrm.expressionManager.setValue('blink', timeInBlinkCycle < 0.1 ? 1.0 : 0.0);

        currentVrm.update(delta);
    }
    renderer.render(scene, camera);
}
animate();

// --- ウィンドウリサイズ対応 --------------------------------------------------
// Canvasのサイズが変更されたときに、描画サイズを正しく更新する
function onResize() {
    // clientWidth/Heightが0でなければ、その値を使ってアスペクト比とサイズを更新
    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
}
// ResizeObserverでCanvasのサイズ変更を監視（表示/非表示の切り替えにも対応）
const resizeObserver = new ResizeObserver(onResize);
resizeObserver.observe(canvas);