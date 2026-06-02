/* ============================================
   Particles.js - Three.js Neural Network Background
   AI-inspired animated particle system
   ============================================ */

// ============================================
// Configuration
// ============================================
const PARTICLE_CONFIG = {
    count: 80,           // Number of particles
    connectionDistance: 150, // Max distance for connections
    mouseInfluence: 100,     // Mouse influence radius
    speed: 0.3,              // Particle movement speed
    particleSize: 2,         // Base particle size
    lineOpacity: 0.15,       // Connection line opacity
    colors: {
        particle: 0x00D4FF,  // Accent color
        line: 0x00D4FF,      // Line color
        particleAlt: 0x7C3AED // Secondary accent
    }
};

// ============================================
// Three.js Scene Setup
// ============================================
let scene, camera, renderer;
let particles = [];
let lines = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    
    if (!canvas) {
        console.warn('Particles canvas not found');
        return;
    }
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 400;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Create particles
    createParticles();
    
    // Create connection lines
    createLines();
    
    // Event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation
    animate();
}

// ============================================
// Create Particles
// ============================================
function createParticles() {
    const geometry = new THREE.SphereGeometry(PARTICLE_CONFIG.particleSize, 8, 8);
    
    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        // Alternate between two colors
        const color = i % 5 === 0 ? PARTICLE_CONFIG.colors.particleAlt : PARTICLE_CONFIG.colors.particle;
        
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random initial position
        particle.position.x = Math.random() * 800 - 400;
        particle.position.y = Math.random() * 800 - 400;
        particle.position.z = Math.random() * 400 - 200;
        
        // Store velocity for animation
        particle.velocity = {
            x: (Math.random() - 0.5) * PARTICLE_CONFIG.speed,
            y: (Math.random() - 0.5) * PARTICLE_CONFIG.speed,
            z: (Math.random() - 0.5) * PARTICLE_CONFIG.speed * 0.5
        };
        
        // Store original position for returning
        particle.originalPosition = {
            x: particle.position.x,
            y: particle.position.y,
            z: particle.position.z
        };
        
        particles.push(particle);
        scene.add(particle);
    }
}

// ============================================
// Create Connection Lines
// ============================================
function createLines() {
    const material = new THREE.LineBasicMaterial({
        color: PARTICLE_CONFIG.colors.line,
        transparent: true,
        opacity: PARTICLE_CONFIG.lineOpacity
    });
    
    // Create a line pool for reuse
    for (let i = 0; i < PARTICLE_CONFIG.count * 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6); // 2 points * 3 coordinates
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const line = new THREE.Line(geometry, material.clone());
        line.visible = false;
        lines.push(line);
        scene.add(line);
    }
}

// ============================================
// Update Connections
// ============================================
function updateConnections() {
    let lineIndex = 0;
    
    // Hide all lines first
    lines.forEach(line => line.visible = false);
    
    // Check connections between particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            if (lineIndex >= lines.length) break;
            
            const dx = particles[i].position.x - particles[j].position.x;
            const dy = particles[i].position.y - particles[j].position.y;
            const dz = particles[i].position.z - particles[j].position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < PARTICLE_CONFIG.connectionDistance) {
                const line = lines[lineIndex];
                const positions = line.geometry.attributes.position.array;
                
                positions[0] = particles[i].position.x;
                positions[1] = particles[i].position.y;
                positions[2] = particles[i].position.z;
                positions[3] = particles[j].position.x;
                positions[4] = particles[j].position.y;
                positions[5] = particles[j].position.z;
                
                line.geometry.attributes.position.needsUpdate = true;
                
                // Fade based on distance
                const opacity = (1 - distance / PARTICLE_CONFIG.connectionDistance) * PARTICLE_CONFIG.lineOpacity;
                line.material.opacity = opacity;
                line.visible = true;
                
                lineIndex++;
            }
        }
    }
}

// ============================================
// Animation Loop
// ============================================
function animate() {
    requestAnimationFrame(animate);
    
    // Update particle positions
    particles.forEach(particle => {
        // Apply velocity
        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        particle.position.z += particle.velocity.z;
        
        // Boundary check - wrap around
        if (particle.position.x > 400) particle.position.x = -400;
        if (particle.position.x < -400) particle.position.x = 400;
        if (particle.position.y > 400) particle.position.y = -400;
        if (particle.position.y < -400) particle.position.y = 400;
        if (particle.position.z > 200) particle.position.z = -200;
        if (particle.position.z < -200) particle.position.z = 200;
        
        // Mouse influence
        const dx = (mouseX - particle.position.x) * 0.0001;
        const dy = (-mouseY - particle.position.y) * 0.0001;
        
        particle.position.x += dx;
        particle.position.y += dy;
    });
    
    // Update connection lines
    updateConnections();
    
    // Subtle camera movement based on mouse
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.01;
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.01;
    camera.lookAt(scene.position);
    
    // Render
    renderer.render(scene, camera);
}

// ============================================
// Event Handlers
// ============================================
function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// Performance Optimization
// ============================================
let isTabVisible = true;

document.addEventListener('visibilitychange', function() {
    isTabVisible = !document.hidden;
});

// Reduce particle count on mobile for better performance
function adjustForMobile() {
    if (window.innerWidth < 768) {
        PARTICLE_CONFIG.count = 40;
        PARTICLE_CONFIG.connectionDistance = 100;
    }
}

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    adjustForMobile();
    
    // Delay initialization slightly to ensure DOM is fully ready
    setTimeout(initParticles, 100);
});

// ============================================
// Cleanup Function
// ============================================
function destroyParticles() {
    if (renderer) {
        renderer.dispose();
    }
    
    particles.forEach(particle => {
        particle.geometry.dispose();
        particle.material.dispose();
    });
    
    lines.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
    });
    
    particles = [];
    lines = [];
}

// Export for potential use elsewhere
window.particleSystem = {
    init: initParticles,
    destroy: destroyParticles,
    config: PARTICLE_CONFIG
};
