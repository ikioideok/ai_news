// Three.js Scenes for AIMA Inc Website - Rubik's Cube Version
// Wait for THREE to be loaded
function waitForTHREE() {
    if (typeof THREE !== 'undefined') {
        // THREE is loaded, initialize manager
        window.threeManager = new ThreeJSManager();
        return true;
    }
    return false;
}

class ThreeJSManager {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationIds = {};
        this.goldColor = 0xD4AF37;
        this.lightGoldColor = 0xF7E98E;
        this.silverColor = 0xE5E7EB;
        this.blueColor = 0x4A90E2; // Analysis phase
        this.greenColor = 0x7ED321; // New fifth color for optimization phase
    }

    // Initialize all Three.js scenes
    init() {
        // Performance optimization: Check device capabilities
        this.isMobile = window.innerWidth < 768;
        this.pixelRatio = Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2);
        
        this.initHeroScene();
        this.initVisionScene();
        this.initServiceScene();
        this.initCompanyScene();
        this.initUnleashedScene();
    }

    // Hero Section: Elegant Rubik's Cube
    initHeroScene() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(90, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000); // Wider field of view
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create Rubik's Cube
        const cubeGroup = new THREE.Group();
        const cubeSize = 20.0; // Enormous size - fills the screen
        const gap = 1.0;       // Large gap for visibility
        const totalSize = cubeSize + gap;
        
        // Store cube pieces and their states
        const cubePieces = [];

        // Create 3x3x3 cube pieces
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    // Skip center piece (not visible)
                    if (x === 1 && y === 1 && z === 1) continue;
                    
                    const pieceGroup = new THREE.Group();
                    
                    // Create wireframe cube
                    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const edges = new THREE.EdgesGeometry(geometry);
                    
                    // Start with silver, will change during solving
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: this.silverColor,
                        transparent: true,
                        opacity: 0.4,
                        linewidth: 0.5
                    });
                    
                    const wireframe = new THREE.LineSegments(edges, lineMaterial);
                    pieceGroup.add(wireframe);
                    
                    // Position the piece
                    pieceGroup.position.set(
                        (x - 1) * totalSize,
                        (y - 1) * totalSize,
                        (z - 1) * totalSize
                    );
                    
                    // Add small randomization to initial positions (scrambled state)
                    pieceGroup.rotation.x = (Math.random() - 0.5) * 0.3;
                    pieceGroup.rotation.y = (Math.random() - 0.5) * 0.3;
                    pieceGroup.rotation.z = (Math.random() - 0.5) * 0.3;
                    
                    cubeGroup.add(pieceGroup);
                    cubePieces.push({
                        group: pieceGroup,
                        wireframe: wireframe,
                        originalPosition: { x, y, z },
                        currentState: 'scrambled', // scrambled -> solving -> solved
                        solveDelay: (cubePieces.length * 0.5) + Math.random() * 5, // Much more spread out timing
                        cycleDuration: 60 // 5x longer cycle (60 seconds)
                    });
                }
            }
        }

        // Remove the distracting glow sphere
        // const glowGeometry = new THREE.SphereGeometry(3.5, 16, 16);
        // const glowMaterial = new THREE.MeshBasicMaterial({
        //     color: this.lightGoldColor,
        //     transparent: true,
        //     opacity: 0.05
        // });
        // const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        // cubeGroup.add(glowSphere);

        scene.add(cubeGroup);
        camera.position.set(35, 25, 40); // Slightly pulled back for better view
        camera.lookAt(0, 0, 0);

        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;

        // Animation loop
        let time = 0;
        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            time += 0.016;
            
            // Gentle floating motion
            cubeGroup.position.y = Math.sin(time * 0.5) * 0.1;
            
            // Slow rotation
            cubeGroup.rotation.y += 0.008;
            cubeGroup.rotation.x += 0.003;
            
            // Looping solving animation
            cubePieces.forEach((piece, i) => {
                // Calculate cycle time (loop every 12 seconds)
                const cycleTime = time % piece.cycleDuration;
                const adjustedTime = cycleTime - piece.solveDelay;
                
                // Reset state at beginning of each cycle
                if (cycleTime < piece.solveDelay) {
                    piece.currentState = 'scrambled';
                    
                    // Scrambled state: silver color and random rotations
                    piece.wireframe.material.color.setHex(this.silverColor);
                    piece.wireframe.material.opacity = 0.4;
                    
                    // Add continuous small random movements
                    const scrambleIntensity = 0.3;
                    piece.group.rotation.x = Math.sin(time * 0.5 + i) * scrambleIntensity;
                    piece.group.rotation.y = Math.cos(time * 0.7 + i) * scrambleIntensity;
                    piece.group.rotation.z = Math.sin(time * 0.9 + i) * scrambleIntensity;
                }
                
                // Analysis phase (first 10 seconds) - Blue
                else if (adjustedTime > 0 && adjustedTime < 10) {
                    if (piece.currentState !== 'analyzing') {
                        piece.currentState = 'analyzing';
                    }
                    
                    // Blue color during analysis
                    piece.wireframe.material.color.setHex(this.blueColor);
                    piece.wireframe.material.opacity = 0.5 + Math.sin(adjustedTime * 3) * 0.15;
                    
                    // Continue slight random movements during analysis
                    const analyzeIntensity = 0.15;
                    piece.group.rotation.x = Math.sin(time * 0.8 + i) * analyzeIntensity;
                    piece.group.rotation.y = Math.cos(time * 1.0 + i) * analyzeIntensity;
                    piece.group.rotation.z = Math.sin(time * 1.2 + i) * analyzeIntensity;
                }
                
                // Optimization phase (10-20 seconds) - Green
                else if (adjustedTime >= 10 && adjustedTime < 20) {
                    if (piece.currentState !== 'optimizing') {
                        piece.currentState = 'optimizing';
                    }
                    
                    // Green color during optimization
                    piece.wireframe.material.color.setHex(this.greenColor);
                    piece.wireframe.material.opacity = 0.55 + Math.sin((adjustedTime - 10) * 2.5) * 0.12;
                    
                    // Gradual alignment during optimization
                    const optimizeProgress = (adjustedTime - 10) / 10;
                    const easeProgress = optimizeProgress * optimizeProgress; // Quadratic ease
                    
                    piece.group.rotation.x *= (1 - easeProgress * 0.5);
                    piece.group.rotation.y *= (1 - easeProgress * 0.5);
                    piece.group.rotation.z *= (1 - easeProgress * 0.5);
                }
                
                // Solving phase (20-35 seconds) - Gold
                else if (adjustedTime >= 20 && adjustedTime < 35) {
                    if (piece.currentState !== 'solving') {
                        piece.currentState = 'solving';
                    }
                    
                    // Change to gold color during solving
                    piece.wireframe.material.color.setHex(this.goldColor);
                    piece.wireframe.material.opacity = 0.6 + Math.sin((adjustedTime - 20) * 2) * 0.1;
                    
                    // Final alignment during solving
                    const solvingProgress = (adjustedTime - 20) / 15;
                    const easeProgress = 1 - Math.pow(1 - solvingProgress, 3); // Ease out cubic
                    
                    piece.group.rotation.x *= (1 - easeProgress);
                    piece.group.rotation.y *= (1 - easeProgress);
                    piece.group.rotation.z *= (1 - easeProgress);
                }
                
                // Solved phase (35-60 seconds) - White
                else if (adjustedTime >= 35) {
                    if (piece.currentState !== 'solved') {
                        piece.currentState = 'solved';
                    }
                    
                    // Final state: clean white lines
                    piece.wireframe.material.color.setHex(0xFFFFFF);
                    
                    // Gentle pulsing effect for solved pieces
                    const solvedTime = adjustedTime - 35;
                    const pulse = 0.8 + Math.sin(solvedTime * 1.5 + i * 0.5) * 0.15;
                    piece.wireframe.material.opacity = pulse;
                    
                    // Perfect alignment
                    piece.group.rotation.set(0, 0, 0);
                }
            });
            
            // Continuous glow effect that intensifies when solved
            const cycleProgress = (time % 60) / 60;
            let glowIntensity = 0.05;
            
            // Glow sphere removed - no longer needed

            renderer.render(scene, camera);
        };
        animate();
    }

    // Vision Section: Elegant Neural Network
    initVisionScene() {
        const canvas = document.getElementById('vision-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create refined neural network
        const networkGroup = new THREE.Group();
        const networkNodes = [];
        const networkConnections = [];

        // Generate neural network nodes (reduce for mobile)
        const networkNodeCount = this.isMobile ? 30 : 60;
        for (let i = 0; i < networkNodeCount; i++) {
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 8
            );

            // Create wireframe nodes instead of solid spheres
            const nodeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            const edges = new THREE.EdgesGeometry(nodeGeometry);
            const nodeMaterial = new THREE.LineBasicMaterial({ 
                color: this.silverColor,
                transparent: true,
                opacity: 0,
                linewidth: 0.5
            });
            const node = new THREE.LineSegments(edges, nodeMaterial);
            node.position.copy(position);
            
            networkGroup.add(node);
            networkNodes.push({ 
                mesh: node, 
                originalPos: position.clone(), 
                delay: Math.random() * 3,
                phase: 'dormant',
                cycleDuration: 15 + Math.random() * 10 // 15-25 second cycles
            });
        }

        // Create connections between nearby nodes
        for (let i = 0; i < networkNodes.length; i++) {
            for (let j = i + 1; j < networkNodes.length; j++) {
                const distance = networkNodes[i].originalPos.distanceTo(networkNodes[j].originalPos);
                if (distance < 8 && Math.random() > 0.7) {
                    const points = [networkNodes[i].originalPos, networkNodes[j].originalPos];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({ 
                        color: this.silverColor,
                        transparent: true,
                        opacity: 0,
                        linewidth: 0.3
                    });
                    const line = new THREE.Line(geometry, material);
                    networkGroup.add(line);
                    networkConnections.push({
                        mesh: line,
                        startNode: i,
                        endNode: j,
                        opacity: 0
                    });
                }
            }
        }

        scene.add(networkGroup);
        camera.position.z = 20;

        this.scenes.vision = scene;
        this.cameras.vision = camera;
        this.renderers.vision = renderer;

        // Enhanced animation loop
        let time = 0;
        const animate = () => {
            this.animationIds.vision = requestAnimationFrame(animate);
            time += 0.016;
            
            // Gentle camera movement
            camera.position.x = Math.sin(time * 0.1) * 2;
            camera.position.y = Math.cos(time * 0.15) * 1;
            camera.lookAt(0, 0, 0);
            
            // Animate nodes through phases
            networkNodes.forEach((nodeObj, i) => {
                const cycleTime = time % nodeObj.cycleDuration;
                const adjustedTime = cycleTime - nodeObj.delay;
                
                if (adjustedTime < 0) {
                    // Dormant phase
                    nodeObj.phase = 'dormant';
                    nodeObj.mesh.material.color.setHex(this.silverColor);
                    nodeObj.mesh.material.opacity = 0.1 + Math.sin(time + i) * 0.05;
                } else if (adjustedTime < 3) {
                    // Activation phase - Blue
                    nodeObj.phase = 'activating';
                    nodeObj.mesh.material.color.setHex(this.blueColor);
                    nodeObj.mesh.material.opacity = 0.3 + Math.sin(adjustedTime * 2) * 0.2;
                } else if (adjustedTime < 6) {
                    // Processing phase - Green
                    nodeObj.phase = 'processing';
                    nodeObj.mesh.material.color.setHex(this.greenColor);
                    nodeObj.mesh.material.opacity = 0.4 + Math.sin((adjustedTime - 3) * 3) * 0.15;
                } else if (adjustedTime < 9) {
                    // Solution phase - Gold
                    nodeObj.phase = 'solving';
                    nodeObj.mesh.material.color.setHex(this.goldColor);
                    nodeObj.mesh.material.opacity = 0.6 + Math.sin((adjustedTime - 6) * 2) * 0.1;
                } else {
                    // Complete phase - White
                    nodeObj.phase = 'complete';
                    nodeObj.mesh.material.color.setHex(0xFFFFFF);
                    nodeObj.mesh.material.opacity = 0.7 + Math.sin((adjustedTime - 9) * 1.5) * 0.1;
                }
            });
            
            // Animate connections based on connected nodes
            networkConnections.forEach(connection => {
                const startNode = networkNodes[connection.startNode];
                const endNode = networkNodes[connection.endNode];
                
                // Connection active if both nodes are active
                if (startNode.phase !== 'dormant' && endNode.phase !== 'dormant') {
                    const avgOpacity = (startNode.mesh.material.opacity + endNode.mesh.material.opacity) / 2;
                    connection.mesh.material.opacity = Math.min(0.3, avgOpacity * 0.5);
                    
                    // Use color of more advanced phase
                    if (startNode.phase === 'complete' || endNode.phase === 'complete') {
                        connection.mesh.material.color.setHex(0xFFFFFF);
                    } else if (startNode.phase === 'solving' || endNode.phase === 'solving') {
                        connection.mesh.material.color.setHex(this.goldColor);
                    } else if (startNode.phase === 'processing' || endNode.phase === 'processing') {
                        connection.mesh.material.color.setHex(this.greenColor);
                    } else {
                        connection.mesh.material.color.setHex(this.blueColor);
                    }
                } else {
                    connection.mesh.material.opacity = Math.max(0, connection.mesh.material.opacity - 0.01);
                }
            });
            
            renderer.render(scene, camera);
        };
        animate();
    }

    // Service Section: Elegant Geometric Evolution
    initServiceScene() {
        const canvas = document.getElementById('service-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create refined geometric shapes
        const geometryGroup = new THREE.Group();
        const shapes = [];

        // Create multiple wireframe geometric shapes
        const geometryConfigs = [
            { geometry: new THREE.OctahedronGeometry(2.5), position: [-4, 0, -2] },
            { geometry: new THREE.IcosahedronGeometry(2.2), position: [4, 0, -2] },
            { geometry: new THREE.TetrahedronGeometry(2.8), position: [-4, 0, 2] },
            { geometry: new THREE.DodecahedronGeometry(2.0), position: [4, 0, 2] },
            { geometry: new THREE.BoxGeometry(3, 3, 3), position: [0, 0, 0] }
        ];

        geometryConfigs.forEach((config, i) => {
            // Create wireframe version
            const edges = new THREE.EdgesGeometry(config.geometry);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: this.silverColor,
                transparent: true,
                opacity: 0.3,
                linewidth: 0.5
            });
            const wireframe = new THREE.LineSegments(edges, lineMaterial);
            wireframe.position.set(...config.position);
            
            geometryGroup.add(wireframe);
            shapes.push({ 
                mesh: wireframe, 
                originalPos: wireframe.position.clone(),
                phase: 'dormant',
                cycleDuration: 20 + Math.random() * 10,
                delay: i * 2
            });
        });

        scene.add(geometryGroup);
        camera.position.set(0, 3, 15);
        camera.lookAt(0, 0, 0);

        this.scenes.service = scene;
        this.cameras.service = camera;
        this.renderers.service = renderer;

        let time = 0;
        const animate = () => {
            this.animationIds.service = requestAnimationFrame(animate);
            time += 0.016;
            
            // Subtle camera orbit
            const orbitRadius = 15;
            camera.position.x = Math.sin(time * 0.05) * orbitRadius * 0.3;
            camera.position.z = Math.cos(time * 0.05) * orbitRadius;
            camera.lookAt(0, 0, 0);
            
            shapes.forEach((shapeObj, i) => {
                const cycleTime = time % shapeObj.cycleDuration;
                const adjustedTime = cycleTime - shapeObj.delay;
                
                // Gentle floating motion
                shapeObj.mesh.position.y = shapeObj.originalPos.y + Math.sin(time * 0.3 + i) * 0.5;
                
                if (adjustedTime < 0) {
                    // Dormant phase - Silver
                    shapeObj.phase = 'dormant';
                    shapeObj.mesh.material.color.setHex(this.silverColor);
                    shapeObj.mesh.material.opacity = 0.2 + Math.sin(time * 0.5 + i) * 0.1;
                    
                    // Slow rotation
                    shapeObj.mesh.rotation.x += 0.003;
                    shapeObj.mesh.rotation.y += 0.005;
                } else if (adjustedTime < 4) {
                    // Analysis phase - Blue
                    shapeObj.phase = 'analyzing';
                    shapeObj.mesh.material.color.setHex(this.blueColor);
                    shapeObj.mesh.material.opacity = 0.4 + Math.sin(adjustedTime * 2) * 0.15;
                    
                    // Faster rotation during analysis
                    shapeObj.mesh.rotation.x += 0.008;
                    shapeObj.mesh.rotation.y += 0.012;
                } else if (adjustedTime < 8) {
                    // Optimization phase - Green
                    shapeObj.phase = 'optimizing';
                    shapeObj.mesh.material.color.setHex(this.greenColor);
                    shapeObj.mesh.material.opacity = 0.5 + Math.sin((adjustedTime - 4) * 2.5) * 0.12;
                    
                    // Complex rotation patterns
                    shapeObj.mesh.rotation.x += 0.015;
                    shapeObj.mesh.rotation.y += 0.020;
                    shapeObj.mesh.rotation.z += 0.008;
                } else if (adjustedTime < 12) {
                    // Solution phase - Gold
                    shapeObj.phase = 'solving';
                    shapeObj.mesh.material.color.setHex(this.goldColor);
                    shapeObj.mesh.material.opacity = 0.7 + Math.sin((adjustedTime - 8) * 3) * 0.1;
                    
                    // Dramatic rotation
                    shapeObj.mesh.rotation.x += 0.025;
                    shapeObj.mesh.rotation.y += 0.030;
                } else {
                    // Complete phase - White
                    shapeObj.phase = 'complete';
                    shapeObj.mesh.material.color.setHex(0xFFFFFF);
                    shapeObj.mesh.material.opacity = 0.8 + Math.sin((adjustedTime - 12) * 1.5) * 0.1;
                    
                    // Elegant slow rotation
                    shapeObj.mesh.rotation.x += 0.005;
                    shapeObj.mesh.rotation.y += 0.008;
                }
            });

            renderer.render(scene, camera);
        };
        animate();
    }

    // Company Section: Elegant Architectural Evolution
    initCompanyScene() {
        const canvas = document.getElementById('company-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create sophisticated architectural structure
        const architectureGroup = new THREE.Group();
        const structures = [];
        
        // Create multiple building structures with varying heights
        const buildingConfigs = [
            { width: 2, height: 8, depth: 2, x: -4, z: -4 },
            { width: 3, height: 6, depth: 2.5, x: 0, z: -4 },
            { width: 2.5, height: 10, depth: 2, x: 4, z: -4 },
            { width: 3.5, height: 4, depth: 3, x: -4, z: 0 },
            { width: 4, height: 12, depth: 3.5, x: 0, z: 0 }, // Central tower
            { width: 3, height: 5, depth: 2.8, x: 4, z: 0 },
            { width: 2.2, height: 7, depth: 2.2, x: -4, z: 4 },
            { width: 2.8, height: 9, depth: 2.5, x: 0, z: 4 },
            { width: 3.2, height: 6, depth: 2.8, x: 4, z: 4 }
        ];

        buildingConfigs.forEach((config, i) => {
            const buildingGeometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
            const edges = new THREE.EdgesGeometry(buildingGeometry);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: this.silverColor,
                transparent: true,
                opacity: 0.3,
                linewidth: 0.5
            });
            const building = new THREE.LineSegments(edges, lineMaterial);
            building.position.set(config.x, config.height / 2, config.z);
            
            architectureGroup.add(building);
            structures.push({
                mesh: building,
                originalPos: building.position.clone(),
                phase: 'dormant',
                cycleDuration: 25 + Math.random() * 15,
                delay: i * 1.5,
                config: config
            });
        });

        // Add connecting bridges between buildings
        const bridgeGeometry = new THREE.BoxGeometry(1, 0.2, 0.2);
        const bridgeEdges = new THREE.EdgesGeometry(bridgeGeometry);
        for (let i = 0; i < 5; i++) {
            const bridge = new THREE.LineSegments(bridgeEdges, new THREE.LineBasicMaterial({
                color: this.silverColor,
                transparent: true,
                opacity: 0.2,
                linewidth: 0.3
            }));
            bridge.position.set(
                (Math.random() - 0.5) * 6,
                2 + Math.random() * 4,
                (Math.random() - 0.5) * 6
            );
            bridge.rotation.y = Math.random() * Math.PI;
            architectureGroup.add(bridge);
        }

        scene.add(architectureGroup);
        camera.position.set(12, 8, 12);
        camera.lookAt(0, 3, 0);

        this.scenes.company = scene;
        this.cameras.company = camera;
        this.renderers.company = renderer;

        let time = 0;
        const animate = () => {
            this.animationIds.company = requestAnimationFrame(animate);
            time += 0.016;
            
            // Slow camera orbit around the city
            const orbitRadius = 18;
            camera.position.x = Math.cos(time * 0.02) * orbitRadius;
            camera.position.z = Math.sin(time * 0.02) * orbitRadius;
            camera.position.y = 8 + Math.sin(time * 0.03) * 2;
            camera.lookAt(0, 3, 0);
            
            structures.forEach((structureObj, i) => {
                const cycleTime = time % structureObj.cycleDuration;
                const adjustedTime = cycleTime - structureObj.delay;
                
                if (adjustedTime < 0) {
                    // Dormant phase - Silver
                    structureObj.phase = 'dormant';
                    structureObj.mesh.material.color.setHex(this.silverColor);
                    structureObj.mesh.material.opacity = 0.15 + Math.sin(time * 0.3 + i) * 0.05;
                } else if (adjustedTime < 5) {
                    // Planning phase - Blue
                    structureObj.phase = 'planning';
                    structureObj.mesh.material.color.setHex(this.blueColor);
                    structureObj.mesh.material.opacity = 0.4 + Math.sin(adjustedTime * 2) * 0.15;
                } else if (adjustedTime < 10) {
                    // Development phase - Green
                    structureObj.phase = 'developing';
                    structureObj.mesh.material.color.setHex(this.greenColor);
                    structureObj.mesh.material.opacity = 0.5 + Math.sin((adjustedTime - 5) * 2.5) * 0.12;
                } else if (adjustedTime < 15) {
                    // Construction phase - Gold
                    structureObj.phase = 'constructing';
                    structureObj.mesh.material.color.setHex(this.goldColor);
                    structureObj.mesh.material.opacity = 0.7 + Math.sin((adjustedTime - 10) * 3) * 0.1;
                } else {
                    // Complete phase - White
                    structureObj.phase = 'complete';
                    structureObj.mesh.material.color.setHex(0xFFFFFF);
                    structureObj.mesh.material.opacity = 0.8 + Math.sin((adjustedTime - 15) * 1.5) * 0.1;
                }
            });
            
            renderer.render(scene, camera);
        };
        animate();
    }

    // Unleashed Section: Transcendent Particle Evolution
    initUnleashedScene() {
        const canvas = document.getElementById('unleashed-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create elegant particle clusters (reduce for mobile)
        const particleGroup = new THREE.Group();
        const particleClusters = [];
        const clusterCount = this.isMobile ? 8 : 15;

        for (let cluster = 0; cluster < clusterCount; cluster++) {
            const clusterCenter = new THREE.Vector3(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );

            const particlesPerCluster = this.isMobile ? 20 : 40;
            const clusterParticles = [];

            for (let i = 0; i < particlesPerCluster; i++) {
                // Create wireframe particles instead of solid points
                const particleGeometry = new THREE.SphereGeometry(0.05, 6, 6);
                const edges = new THREE.EdgesGeometry(particleGeometry);
                const particleMaterial = new THREE.LineBasicMaterial({
                    color: this.silverColor,
                    transparent: true,
                    opacity: 0.1,
                    linewidth: 0.3
                });
                
                const particle = new THREE.LineSegments(edges, particleMaterial);
                
                // Position particles in cluster formation
                const offset = new THREE.Vector3(
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 3
                );
                particle.position.copy(clusterCenter).add(offset);
                
                particleGroup.add(particle);
                clusterParticles.push({
                    mesh: particle,
                    originalPos: particle.position.clone(),
                    clusterCenter: clusterCenter,
                    phase: 'dormant',
                    cycleDuration: 30 + Math.random() * 20,
                    delay: Math.random() * 10
                });
            }
            
            particleClusters.push({
                center: clusterCenter,
                particles: clusterParticles,
                phase: 'dormant'
            });
        }

        scene.add(particleGroup);
        camera.position.z = 25;

        this.scenes.unleashed = scene;
        this.cameras.unleashed = camera;
        this.renderers.unleashed = renderer;

        let time = 0;
        const animate = () => {
            this.animationIds.unleashed = requestAnimationFrame(animate);
            time += 0.016;
            
            // Dynamic camera movement through the particle field
            const orbitRadius = 30;
            camera.position.x = Math.cos(time * 0.03) * orbitRadius;
            camera.position.y = Math.sin(time * 0.025) * orbitRadius * 0.5;
            camera.position.z = Math.sin(time * 0.03) * orbitRadius;
            camera.lookAt(0, 0, 0);
            
            // Animate particle clusters
            particleClusters.forEach((cluster, clusterIndex) => {
                cluster.particles.forEach((particleObj, i) => {
                    const cycleTime = time % particleObj.cycleDuration;
                    const adjustedTime = cycleTime - particleObj.delay;
                    
                    // Gentle orbital motion around cluster center
                    const angle = time * 0.2 + i * 0.5;
                    const radius = 1 + Math.sin(time * 0.1 + i) * 0.5;
                    const orbitOffset = new THREE.Vector3(
                        Math.cos(angle) * radius,
                        Math.sin(angle * 0.7) * radius * 0.5,
                        Math.sin(angle) * radius
                    );
                    particleObj.mesh.position.copy(particleObj.clusterCenter).add(orbitOffset);
                    
                    if (adjustedTime < 0) {
                        // Dormant phase - Silver
                        particleObj.phase = 'dormant';
                        particleObj.mesh.material.color.setHex(this.silverColor);
                        particleObj.mesh.material.opacity = 0.05 + Math.sin(time + i) * 0.02;
                    } else if (adjustedTime < 6) {
                        // Awakening phase - Blue
                        particleObj.phase = 'awakening';
                        particleObj.mesh.material.color.setHex(this.blueColor);
                        particleObj.mesh.material.opacity = 0.2 + Math.sin(adjustedTime * 2) * 0.1;
                    } else if (adjustedTime < 12) {
                        // Evolution phase - Green
                        particleObj.phase = 'evolving';
                        particleObj.mesh.material.color.setHex(this.greenColor);
                        particleObj.mesh.material.opacity = 0.3 + Math.sin((adjustedTime - 6) * 2.5) * 0.08;
                    } else if (adjustedTime < 18) {
                        // Transformation phase - Gold
                        particleObj.phase = 'transforming';
                        particleObj.mesh.material.color.setHex(this.goldColor);
                        particleObj.mesh.material.opacity = 0.5 + Math.sin((adjustedTime - 12) * 3) * 0.1;
                    } else {
                        // Transcendence phase - White
                        particleObj.phase = 'transcendent';
                        particleObj.mesh.material.color.setHex(0xFFFFFF);
                        particleObj.mesh.material.opacity = 0.6 + Math.sin((adjustedTime - 18) * 1.5) * 0.15;
                    }
                    
                    // Add rotation based on phase
                    const rotationSpeed = particleObj.phase === 'transcendent' ? 0.02 : 0.005;
                    particleObj.mesh.rotation.x += rotationSpeed;
                    particleObj.mesh.rotation.y += rotationSpeed * 1.5;
                });
            });
            
            renderer.render(scene, camera);
        };
        animate();
    }

    // Handle window resize
    handleResize() {
        // Update mobile detection
        this.isMobile = window.innerWidth < 768;
        this.pixelRatio = Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2);
        
        Object.keys(this.cameras).forEach(key => {
            if (key === 'hero') {
                const canvas = document.getElementById('hero-canvas');
                if (canvas) {
                    this.cameras[key].aspect = canvas.offsetWidth / canvas.offsetHeight;
                    this.cameras[key].updateProjectionMatrix();
                    this.renderers[key].setSize(canvas.offsetWidth, canvas.offsetHeight);
                    this.renderers[key].setPixelRatio(this.pixelRatio);
                }
            } else {
                this.cameras[key].aspect = window.innerWidth / window.innerHeight;
                this.cameras[key].updateProjectionMatrix();
                this.renderers[key].setSize(window.innerWidth, window.innerHeight);
                this.renderers[key].setPixelRatio(this.pixelRatio);
            }
        });
    }

    // Clean up animations
    cleanup() {
        Object.values(this.animationIds).forEach(id => {
            if (id) cancelAnimationFrame(id);
        });
    }
}

// Initialize Three.js manager when THREE is loaded
if (!waitForTHREE()) {
    // If THREE is not loaded yet, wait for it
    const checkTHREE = setInterval(() => {
        if (waitForTHREE()) {
            clearInterval(checkTHREE);
        }
    }, 50);
}