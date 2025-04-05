import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const defaultTowerData = [
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
  1: [0, -1, 0], // вниз по Y
  2: [1, 0, 0],  // вправо по X
  3: [0, 0, 1]   // вверх по Z
};

const TowerInput = ({ onUpdate }) => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultTowerData, null, 2));
  const [error, setError] = useState('');

  const handleUpdate = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      onUpdate(parsedData);
      setError('');
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 100,
      left: 20,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          style={{
            width: '300px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid #666',
            padding: '10px',
            fontFamily: 'monospace'
          }}
        />
      </div>
      <button
        onClick={handleUpdate}
        style={{
          padding: '10px 20px',
          background: '#00aaff',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        Update Tower
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

const WordTower = () => {
  const mountRef = useRef(null);
  const [towerData, setTowerData] = useState(defaultTowerData);

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
      const fontSize = 32;
      context.font = `${fontSize}px Arial`;
      
      const metrics = context.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      canvas.width = textWidth + 10;
      canvas.height = textHeight + 10;

      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);

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
      const scale = 0.5;
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

    // Function to create tower
    const createTower = (data) => {
      // Clear existing objects
      scene.children = scene.children.filter(child => 
        child instanceof THREE.AmbientLight || 
        child instanceof THREE.DirectionalLight ||
        child instanceof THREE.GridHelper ||
        child instanceof THREE.AxesHelper ||
        child instanceof THREE.Sprite
      );

      // Create letter cubes with text sprites
      data.forEach(({ word, pos, dir }) => {
        const [dirX, dirY, dirZ] = directionVectors[dir];
        
        word.split('').forEach((letter, index) => {
          const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
          const cube = new THREE.Mesh(cubeGeometry, boxMaterial);
          cube.castShadow = true;
          cube.receiveShadow = true;

          const textSprite = createTextSprite(letter);
          
          cube.position.set(
            pos[0] + dirX * index,
            pos[1] + dirY * index,
            pos[2] + dirZ * index
          );

          if (dir === 1) { // вдоль Y
            cube.rotation.x = Math.PI / 2;
            textSprite.position.set(0, 0, 0.6);
          } else if (dir === 2) { // вдоль X
            textSprite.position.set(0, 0, 0.6);
          } else if (dir === 3) { // вдоль Z
            textSprite.position.set(0, 0.6, 0);
          }

          cube.add(textSprite);
          scene.add(cube);
        });
      });
    };

    // Grid helper
    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);

    // Add vertical grid lines
    const verticalGridSize = 100;
    const verticalGridDivisions = 20;
    const verticalGridHelper = new THREE.GridHelper(verticalGridSize, verticalGridDivisions);
    verticalGridHelper.rotation.x = Math.PI / 2;
    verticalGridHelper.position.y = verticalGridSize / 2;
    scene.add(verticalGridHelper);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create axis labels
    const createAxisLabel = (text, color) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = 24;
      context.font = `${fontSize}px Arial`;
      
      const metrics = context.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      canvas.width = textWidth + 10;
      canvas.height = textHeight + 10;

      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = `${fontSize}px Arial`;
      context.fillStyle = color;
      context.textBaseline = 'middle';
      context.fillText(text, 5, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.5 * canvas.width / canvas.height, 0.5, 1);
      
      return sprite;
    };

    // Add labels to axes
    const axisLabels = [
      { text: 'X', color: '#ff0000', position: [5.5, 0, 0] },
      { text: 'Y', color: '#00ff00', position: [0, -5.5, 0] },
      { text: 'Z', color: '#0000ff', position: [0, 0, 5.5] }
    ];

    axisLabels.forEach(({ text, color, position }) => {
      const label = createAxisLabel(text, color);
      label.position.set(...position);
      scene.add(label);
    });

    // Initial tower creation
    createTower(towerData);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
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
  }, [towerData]);

  return (
    <>
      <TowerInput onUpdate={setTowerData} />
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
    </>
  );
};

export default WordTower;
