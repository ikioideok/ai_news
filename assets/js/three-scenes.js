// Three.js Scenes for AIMA Inc Website
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

    // Hero Section: 3D Future City Skyline
    initHeroScene() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create city skyline
        const cityGroup = new THREE.Group();
        const buildings = [];
        const lights = [];
        const constructionEffects = [];

        // Building configurations (reduce for mobile)
        const buildingCount = this.isMobile ? 8 : 15;
        const buildingConfigs = this.generateBuildingConfigs(buildingCount);
        
        buildingConfigs.forEach((config, i) => {
            // Create building structure
            const buildingGeometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
            
            // Different materials for different building states
            const materials = {
                construction: new THREE.MeshBasicMaterial({ 
                    color: 0x666666,
                    transparent: true,
                    opacity: 0.6,
                    wireframe: true
                }),
                complete: new THREE.MeshBasicMaterial({
                    color: config.color,
                    transparent: true,
                    opacity: 0.8
                }),
                premium: new THREE.MeshBasicMaterial({
                    color: this.goldColor,
                    transparent: true,
                    opacity: 0.9
                })
            };
            
            const building = new THREE.Mesh(buildingGeometry, materials.construction);
            building.position.set(config.x, config.height / 2, config.z);
            building.scale.y = 0; // Start with no height
            
            // Add building edges for glow effect
            const edges = new THREE.EdgesGeometry(buildingGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({ 
                color: this.lightGoldColor,
                transparent: true,
                opacity: 0
            });
            const buildingEdges = new THREE.LineSegments(edges, edgeMaterial);
            buildingEdges.position.copy(building.position);
            buildingEdges.scale.copy(building.scale);
            
            cityGroup.add(building);
            cityGroup.add(buildingEdges);
            
            // Add window lights
            const windowLights = this.createWindowLights(config);
            windowLights.forEach(light => {
                light.position.add(building.position);
                cityGroup.add(light);
                lights.push(light);
            });
            
            // Construction sparks effect
            const sparks = this.createConstructionSparks(config);
            sparks.forEach(spark => {
                spark.position.add(building.position);
                cityGroup.add(spark);
                constructionEffects.push(spark);
            });
            
            buildings.push({
                mesh: building,
                edges: buildingEdges,
                config: config,
                growthProgress: 0,
                stage: 'waiting', // waiting -> construction -> complete -> premium
                delay: i * 0.3, // Staggered construction
                lights: windowLights,
                sparks: sparks
            });
        });

        // Add ground plane
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            transparent: true,
            opacity: 0.3
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        cityGroup.add(ground);

        // Add ambient lighting effect
        const ambientParticles = this.createAmbientParticles();
        ambientParticles.forEach(particle => cityGroup.add(particle));

        scene.add(cityGroup);
        camera.position.set(0, 2, 6);
        camera.lookAt(0, 1, 0);

        this.scenes.hero = scene;
        this.cameras.hero = camera;
        this.renderers.hero = renderer;

        // Animation loop
        let time = 0;
        const animate = () => {
            this.animationIds.hero = requestAnimationFrame(animate);
            time += 0.016; // ~60fps
            
            // Slowly rotate the entire city
            cityGroup.rotation.y += 0.003;
            
            buildings.forEach((buildingObj, i) => {
                const { mesh, edges, config, delay } = buildingObj;
                const adjustedTime = Math.max(0, time - delay);
                
                // Building growth stages
                if (buildingObj.stage === 'waiting' && adjustedTime > 0) {
                    buildingObj.stage = 'construction';
                }
                
                if (buildingObj.stage === 'construction') {
                    // Grow building
                    buildingObj.growthProgress = Math.min(1, adjustedTime * 0.8);
                    mesh.scale.y = buildingObj.growthProgress;
                    edges.scale.y = buildingObj.growthProgress;
                    
                    // Show construction sparks
                    buildingObj.sparks.forEach(spark => {
                        spark.material.opacity = buildingObj.growthProgress * 0.5;
                    });
                    
                    if (buildingObj.growthProgress >= 1) {
                        buildingObj.stage = 'complete';
                        // Switch to complete material
                        mesh.material = new THREE.MeshBasicMaterial({
                            color: config.color,
                            transparent: true,
                            opacity: 0.8
                        });
                    }
                }
                
                if (buildingObj.stage === 'complete' && adjustedTime > 3) {
                    buildingObj.stage = 'premium';
                    // Special buildings get gold treatment
                    if (config.isPremium) {
                        mesh.material = new THREE.MeshBasicMaterial({
                            color: this.goldColor,
                            transparent: true,
                            opacity: 0.9
                        });
                        edges.material.opacity = 0.8;
                    }
                    
                    // Turn on window lights
                    buildingObj.lights.forEach(light => {
                        light.material.opacity = Math.random() > 0.7 ? 1 : 0.3;
                    });
                }
                
                if (buildingObj.stage === 'premium') {
                    // Flickering window lights
                    buildingObj.lights.forEach((light, lightIndex) => {
                        if (Math.random() < 0.02) { // 2% chance per frame
                            light.material.opacity = Math.random() > 0.5 ? 1 : 0.3;
                        }
                    });
                    
                    // Hide construction sparks
                    buildingObj.sparks.forEach(spark => {
                        spark.material.opacity = 0;
                    });
                }
            });

            renderer.render(scene, camera);
        };
        animate();
    }

    // Vision Section: Dynamic 3D Neural Network
    initVisionScene() {
        const canvas = document.getElementById('vision-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create expanding neural network
        const networkGroup = new THREE.Group();
        const networkNodes = [];
        const networkConnections = [];

        // Generate random network positions (reduce for mobile)
        const networkNodeCount = this.isMobile ? 40 : 80;
        for (let i = 0; i < networkNodeCount; i++) {
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            );

            const nodeGeometry = new THREE.SphereGeometry(0.05, 6, 6);
            const nodeMaterial = new THREE.MeshBasicMaterial({ 
                color: this.goldColor,
                transparent: true,
                opacity: 0
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.copy(position);
            
            networkGroup.add(node);
            networkNodes.push({ mesh: node, originalPos: position.clone(), delay: Math.random() * 2 });
        }

        scene.add(networkGroup);
        camera.position.z = 15;

        this.scenes.vision = scene;
        this.cameras.vision = camera;
        this.renderers.vision = renderer;

        // Animation with scroll progress
        const animate = () => {
            this.animationIds.vision = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    }

    // Service Section: 3D Geometric Transformations
    initServiceScene() {
        const canvas = document.getElementById('service-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create morphing geometric shapes
        const geometryGroup = new THREE.Group();
        const shapes = [];

        // Create multiple geometric shapes
        const geometries = [
            new THREE.OctahedronGeometry(2),
            new THREE.IcosahedronGeometry(1.8),
            new THREE.TetrahedronGeometry(2.2),
            new THREE.DodecahedronGeometry(1.5)
        ];

        geometries.forEach((geometry, i) => {
            const material = new THREE.MeshBasicMaterial({
                color: this.goldColor,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (i - 1.5) * 3,
                Math.sin(i) * 2,
                Math.cos(i) * 2
            );
            geometryGroup.add(mesh);
            shapes.push({ mesh, baseY: mesh.position.y });
        });

        scene.add(geometryGroup);
        camera.position.z = 12;

        this.scenes.service = scene;
        this.cameras.service = camera;
        this.renderers.service = renderer;

        const animate = () => {
            this.animationIds.service = requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            shapes.forEach((shape, i) => {
                shape.mesh.rotation.x += 0.01;
                shape.mesh.rotation.y += 0.015;
                shape.mesh.position.y = shape.baseY + Math.sin(time + i) * 0.5;
            });

            renderer.render(scene, camera);
        };
        animate();
    }

    // Company Section: 3D Architectural Structure
    initCompanyScene() {
        const canvas = document.getElementById('company-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create 3D building structure
        const buildingGroup = new THREE.Group();
        
        // Create wireframe building
        const buildingGeometry = new THREE.BoxGeometry(4, 6, 3);
        const edges = new THREE.EdgesGeometry(buildingGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: this.goldColor,
            transparent: true,
            opacity: 0.8
        });
        const building = new THREE.LineSegments(edges, lineMaterial);
        buildingGroup.add(building);

        // Add floating elements around building (reduce for mobile)
        const elementCount = this.isMobile ? 10 : 20;
        for (let i = 0; i < elementCount; i++) {
            const elementGeometry = new THREE.SphereGeometry(0.1, 6, 6);
            const elementMaterial = new THREE.MeshBasicMaterial({ 
                color: this.lightGoldColor,
                transparent: true,
                opacity: 0.6
            });
            const element = new THREE.Mesh(elementGeometry, elementMaterial);
            element.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6
            );
            buildingGroup.add(element);
        }

        scene.add(buildingGroup);
        camera.position.set(5, 3, 8);
        camera.lookAt(0, 0, 0);

        this.scenes.company = scene;
        this.cameras.company = camera;
        this.renderers.company = renderer;

        const animate = () => {
            this.animationIds.company = requestAnimationFrame(animate);
            
            buildingGroup.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        };
        animate();
    }

    // Unleashed Section: 3D Space Particles
    initUnleashedScene() {
        const canvas = document.getElementById('unleashed-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(this.pixelRatio);

        // Create particle system (reduce for mobile)
        const particleCount = this.isMobile ? 500 : 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            // Color (gold variations)
            const goldIntensity = Math.random() * 0.5 + 0.5;
            colors[i * 3] = 0.83 * goldIntensity;     // R
            colors[i * 3 + 1] = 0.69 * goldIntensity; // G
            colors[i * 3 + 2] = 0.22 * goldIntensity; // B

            // Velocity
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 20;

        this.scenes.unleashed = scene;
        this.cameras.unleashed = camera;
        this.renderers.unleashed = renderer;

        const animate = () => {
            this.animationIds.unleashed = requestAnimationFrame(animate);
            
            // Update particle positions
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                // Wrap around boundaries
                if (Math.abs(positions[i * 3]) > 25) velocities[i].x *= -1;
                if (Math.abs(positions[i * 3 + 1]) > 25) velocities[i].y *= -1;
                if (Math.abs(positions[i * 3 + 2]) > 25) velocities[i].z *= -1;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // Rotate camera around particles
            const time = Date.now() * 0.0005;
            camera.position.x = Math.cos(time) * 20;
            camera.position.z = Math.sin(time) * 20;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();
    }

    // Generate building configurations for city skyline
    generateBuildingConfigs(count) {
        const configs = [];
        const cityRadius = 3;
        
        for (let i = 0; i < count; i++) {
            // Distribute buildings in a rough circle
            const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            const distance = 1 + Math.random() * cityRadius;
            
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            // Vary building dimensions
            const width = 0.3 + Math.random() * 0.4;
            const depth = 0.3 + Math.random() * 0.4;
            const height = 0.5 + Math.random() * 2.5;
            
            // Some buildings are premium (taller, special)
            const isPremium = height > 2.0 && Math.random() > 0.7;
            
            // Color variations
            let color;
            if (isPremium) {
                color = this.goldColor;
            } else {
                const colors = [0x4A90E2, 0x7ED321, 0xF5A623, 0xD0021B, 0x9013FE];
                color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            configs.push({
                x, z, width, height, depth, color, isPremium
            });
        }
        
        // Sort by height so taller buildings are in back
        configs.sort((a, b) => a.height - b.height);
        
        return configs;
    }
    
    // Create window lights for buildings
    createWindowLights(config) {
        const lights = [];
        const windowsPerFloor = Math.max(2, Math.floor(config.width * 8));
        const floors = Math.max(3, Math.floor(config.height * 5));
        
        for (let floor = 0; floor < floors; floor++) {
            for (let window = 0; window < windowsPerFloor; window++) {
                if (Math.random() > 0.3) { // Not all windows have lights
                    const lightGeometry = new THREE.PlaneGeometry(0.05, 0.05);
                    const lightMaterial = new THREE.MeshBasicMaterial({
                        color: Math.random() > 0.8 ? this.lightGoldColor : 0xFFFFAA,
                        transparent: true,
                        opacity: 0
                    });
                    const light = new THREE.Mesh(lightGeometry, lightMaterial);
                    
                    // Position on building face
                    light.position.set(
                        (window / windowsPerFloor - 0.5) * config.width * 0.8,
                        (floor / floors - 0.5) * config.height + 0.1,
                        config.depth / 2 + 0.01
                    );
                    
                    lights.push(light);
                }
            }
        }
        
        return lights;
    }
    
    // Create construction spark effects
    createConstructionSparks(config) {
        const sparks = [];
        const sparkCount = Math.floor(config.height * 3);
        
        for (let i = 0; i < sparkCount; i++) {
            const sparkGeometry = new THREE.SphereGeometry(0.02, 4, 4);
            const sparkMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFAA00,
                transparent: true,
                opacity: 0
            });
            const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
            
            // Random position around building
            spark.position.set(
                (Math.random() - 0.5) * config.width,
                Math.random() * config.height,
                (Math.random() - 0.5) * config.depth
            );
            
            sparks.push(spark);
        }
        
        return sparks;
    }
    
    // Create ambient particle effects
    createAmbientParticles() {
        const particles = [];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.01, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: this.silverColor,
                transparent: true,
                opacity: Math.random() * 0.5
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.set(
                (Math.random() - 0.5) * 8,
                Math.random() * 4,
                (Math.random() - 0.5) * 8
            );
            
            particles.push(particle);
        }
        
        return particles;
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