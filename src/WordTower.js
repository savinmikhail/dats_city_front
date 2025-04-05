import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const towerData = [
  {
    id: 0,
    pos: [0, 0, 0],
    word: "повестка",
    dir: 2
  },
  {
    id: 1,
    pos: [0, 0, 0],
    word: "плаз",
    dir: 3
  },
  {
    id: 9,
    pos: [2, 0, 0],
    word: "вжатие",
    dir: 3
  },
  {
    id: 8,
    pos: [4, 0, 0],
    word: "септуор",
    dir: 3
  },
  {
    id: 11,
    pos: [6, 0, 0],
    word: "карел",
    dir: 3
  },
  {
    id: 1,
    pos: [8, 0, 0],
    word: "плаз",
    dir: 3
  },
  {
    id: 324,
    pos: [0, 0, -3],
    word: "затёсывание",
    dir: 2
  }
];

const directionVectors = {
  1: [0, 0, -1], // назад по Z
  2: [1, 0, 0],  // вправо по X
  3: [0, 1, 0]   // вверх по Y
};

const WordTower = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(10, 10, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const lights = [
      { position: [10, 10, 10], intensity: 0.8 },
      { position: [-10, -10, -10], intensity: 0.3 },
      { position: [0, 20, 0], intensity: 0.5 }
    ];

    lights.forEach(({ position, intensity }) => {
      const light = new THREE.DirectionalLight(0xffffff, intensity);
      light.position.set(...position);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add(light);
    });

    // Create text sprite function
    const createTextSprite = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 32; // Уменьшаем размер шрифта для кубиков
      context.font = `${fontSize}px Arial`;
      
      // Measure text
      const metrics = context.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      // Set canvas size with padding
      canvas.width = textWidth + 10;
      canvas.height = textHeight + 10;

      // Draw background
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      context.font = `${fontSize}px Arial`;
      context.fillStyle = 'white';
      context.textBaseline = 'middle';
      context.fillText(text, 5, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      
      const sprite = new THREE.Sprite(spriteMaterial);
      const scale = 0.5; // Уменьшаем масштаб спрайта для кубиков
      sprite.scale.set(scale * canvas.width / canvas.height, scale, 1);
      
      return sprite;
    };

    // Box material
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00aaff,
      specular: 0x444444,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });

    // Create letter cubes with text sprites
    towerData.forEach(({ word, pos, dir }) => {
      const [dirX, dirY, dirZ] = directionVectors[dir];
      const letterSpacing = 1.2; // Расстояние между кубиками
      
      word.split('').forEach((letter, index) => {
        // Create cube for each letter
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cube = new THREE.Mesh(cubeGeometry, boxMaterial);
        cube.castShadow = true;
        cube.receiveShadow = true;

        // Create text sprite for the letter
        const textSprite = createTextSprite(letter);
        
        // Position the cube
        cube.position.set(
          pos[0] + dirX * index * letterSpacing,
          pos[1] + dirY * index * letterSpacing,
          pos[2] + dirZ * index * letterSpacing
        );

        // Position text sprite on the cube
        if (dir === 1) { // вдоль Z
          cube.rotation.y = Math.PI / 2;
          textSprite.position.set(0, 0.6, 0);
        } else if (dir === 2) { // вдоль X
          textSprite.position.set(0, 0.6, 0);
        } else if (dir === 3) { // вдоль Y
          cube.rotation.z = Math.PI / 2;
          textSprite.position.set(0, 0, 0.6);
        }

        // Add text sprite as child of cube
        cube.add(textSprite);
        scene.add(cube);
      });
    });

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Update all sprites to face camera
      scene.traverse((object) => {
        if (object instanceof THREE.Sprite) {
          object.quaternion.copy(camera.quaternion);
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default WordTower;
