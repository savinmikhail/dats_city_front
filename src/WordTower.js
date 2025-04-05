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

const createTextShape = (char) => {
  const shape = new THREE.Shape();
  
  switch(char.toUpperCase()) {
    case 'А':
      shape.moveTo(0, 0);
      shape.lineTo(0.3, 1);
      shape.lineTo(0.6, 0);
      break;
    case 'Б':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, 0.5);
      shape.lineTo(0, 0.5);
      break;
    case 'В':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.5, 1);
      shape.bezierCurveTo(0.6, 1, 0.6, 0.75, 0.5, 0.5);
      shape.lineTo(0, 0.5);
      break;
    case 'Г':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      break;
    case 'Д':
      shape.moveTo(0.1, 0);
      shape.lineTo(0, 0.2);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, 0.2);
      shape.lineTo(0.5, 0);
      break;
    case 'Е':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.5, 0.5);
      break;
    case 'Ё':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.5, 0.5);
      // Точки
      shape.moveTo(0.2, 1.2);
      shape.lineTo(0.25, 1.2);
      shape.moveTo(0.4, 1.2);
      shape.lineTo(0.45, 1.2);
      break;
    case 'Ж':
      shape.moveTo(0, 0);
      shape.lineTo(0.6, 1);
      shape.moveTo(0.3, 0);
      shape.lineTo(0.3, 1);
      shape.moveTo(0.6, 0);
      shape.lineTo(0, 1);
      break;
    case 'З':
      shape.moveTo(0, 0.8);
      shape.bezierCurveTo(0.3, 1, 0.6, 0.9, 0.6, 0.7);
      shape.bezierCurveTo(0.6, 0.5, 0.3, 0.5, 0.3, 0.5);
      shape.bezierCurveTo(0.3, 0.5, 0.6, 0.5, 0.6, 0.3);
      shape.bezierCurveTo(0.6, 0.1, 0.3, 0, 0, 0.2);
      break;
    case 'И':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 0);
      shape.lineTo(0.6, 1);
      break;
    case 'Й':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 0);
      shape.lineTo(0.6, 1);
      // Крышка
      shape.moveTo(0.1, 1.1);
      shape.lineTo(0.5, 1.1);
      break;
    case 'К':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.6, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.6, 0);
      break;
    case 'Л':
      shape.moveTo(0, 0);
      shape.lineTo(0.3, 1);
      shape.lineTo(0.6, 0);
      break;
    case 'М':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.3, 0.3);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, 0);
      break;
    case 'Н':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.6, 0.5);
      shape.moveTo(0.6, 0);
      shape.lineTo(0.6, 1);
      break;
    case 'О':
      shape.moveTo(0.3, 0);
      shape.bezierCurveTo(0.1, 0, 0, 0.2, 0, 0.5);
      shape.bezierCurveTo(0, 0.8, 0.1, 1, 0.3, 1);
      shape.bezierCurveTo(0.5, 1, 0.6, 0.8, 0.6, 0.5);
      shape.bezierCurveTo(0.6, 0.2, 0.5, 0, 0.3, 0);
      break;
    case 'П':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, 0);
      break;
    case 'Р':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.5, 1);
      shape.bezierCurveTo(0.6, 1, 0.6, 0.75, 0.5, 0.5);
      shape.lineTo(0, 0.5);
      break;
    case 'С':
      shape.moveTo(0.6, 0.2);
      shape.bezierCurveTo(0.3, 0, 0, 0.2, 0, 0.5);
      shape.bezierCurveTo(0, 0.8, 0.3, 1, 0.6, 0.8);
      break;
    case 'Т':
      shape.moveTo(0.3, 0);
      shape.lineTo(0.3, 1);
      shape.moveTo(0, 1);
      shape.lineTo(0.6, 1);
      break;
    case 'У':
      shape.moveTo(0, 1);
      shape.lineTo(0.3, 0.5);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.3, 0);
      break;
    case 'Ф':
      shape.moveTo(0.3, 0);
      shape.lineTo(0.3, 1);
      shape.moveTo(0.3, 0.3);
      shape.bezierCurveTo(0.1, 0.3, 0, 0.4, 0, 0.5);
      shape.bezierCurveTo(0, 0.6, 0.1, 0.7, 0.3, 0.7);
      shape.bezierCurveTo(0.5, 0.7, 0.6, 0.6, 0.6, 0.5);
      shape.bezierCurveTo(0.6, 0.4, 0.5, 0.3, 0.3, 0.3);
      break;
    case 'Х':
      shape.moveTo(0, 0);
      shape.lineTo(0.6, 1);
      shape.moveTo(0.6, 0);
      shape.lineTo(0, 1);
      break;
    case 'Ц':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.5, 1);
      shape.lineTo(0.5, 0);
      shape.lineTo(0.6, -0.2);
      shape.lineTo(0.6, 0);
      shape.lineTo(0, 0);
      break;
    case 'Ч':
      shape.moveTo(0, 1);
      shape.lineTo(0, 0.5);
      shape.lineTo(0.6, 0.5);
      shape.lineTo(0.6, 1);
      break;
    case 'Ш':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, 0);
      shape.moveTo(0.3, 0);
      shape.lineTo(0.3, 1);
      break;
    case 'Щ':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, -0.2);
      shape.lineTo(0.7, -0.2);
      shape.lineTo(0.7, 0);
      shape.lineTo(0.6, 0);
      shape.moveTo(0.3, 0);
      shape.lineTo(0.3, 1);
      break;
    case 'Ъ':
      shape.moveTo(0.1, 0);
      shape.lineTo(0.1, 1);
      shape.lineTo(0.5, 1);
      shape.bezierCurveTo(0.6, 1, 0.6, 0.75, 0.5, 0.5);
      shape.lineTo(0.1, 0.5);
      shape.moveTo(0, 1);
      shape.lineTo(0.1, 1);
      break;
    case 'Ы':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.moveTo(0.6, 0);
      shape.lineTo(0.6, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.4, 0.5);
      break;
    case 'Ь':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.5, 1);
      shape.bezierCurveTo(0.6, 1, 0.6, 0.75, 0.5, 0.5);
      shape.lineTo(0, 0.5);
      break;
    case 'Э':
      shape.moveTo(0, 0.2);
      shape.bezierCurveTo(0.3, 0, 0.6, 0.2, 0.6, 0.5);
      shape.bezierCurveTo(0.6, 0.8, 0.3, 1, 0, 0.8);
      shape.moveTo(0.2, 0.5);
      shape.lineTo(0.6, 0.5);
      break;
    case 'Ю':
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.moveTo(0, 0.5);
      shape.lineTo(0.3, 0.5);
      shape.moveTo(0.3, 0);
      shape.bezierCurveTo(0.1, 0, 0, 0.2, 0, 0.5);
      shape.bezierCurveTo(0, 0.8, 0.1, 1, 0.3, 1);
      shape.bezierCurveTo(0.5, 1, 0.6, 0.8, 0.6, 0.5);
      shape.bezierCurveTo(0.6, 0.2, 0.5, 0, 0.3, 0);
      break;
    case 'Я':
      shape.moveTo(0.6, 0);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.1, 1);
      shape.bezierCurveTo(0, 1, 0, 0.75, 0.1, 0.5);
      shape.lineTo(0.6, 0.5);
      shape.moveTo(0.1, 0.5);
      shape.lineTo(0.4, 0);
      break;
    default:
      shape.moveTo(0, 0);
      shape.lineTo(0, 1);
      shape.lineTo(0.6, 1);
      shape.lineTo(0.6, 0);
      shape.lineTo(0, 0);
  }
  
  return shape;
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

    // Добавляем несколько направленных источников света с разных сторон
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

    // Materials
    const textMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00aaff,
      specular: 0x444444,
      shininess: 100,
      side: THREE.DoubleSide,
      flatShading: false
    });

    // Create text meshes
    towerData.forEach(({ word, pos, dir }) => {
      const [dirX, dirY, dirZ] = directionVectors[dir];
      const letterSpacing = 1.2; // Увеличенное расстояние между буквами
      
      word.split('').forEach((char, charIndex) => {
        const shape = createTextShape(char);
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 0.4, // Увеличенная толщина
          bevelEnabled: true,
          bevelThickness: 0.1, // Увеличенная толщина фаски
          bevelSize: 0.05, // Увеличенный размер фаски
          bevelSegments: 8, // Больше сегментов для фаски
          steps: 2, // Добавляем промежуточные шаги при экструзии
          curveSegments: 12 // Больше сегментов для кривых
        });

        // Масштабируем геометрию для увеличения размера букв
        geometry.scale(1.5, 1.5, 1.5);
        geometry.computeBoundingBox();
        geometry.computeVertexNormals(); // Пересчитываем нормали для лучшего освещения
        
        const mesh = new THREE.Mesh(geometry, textMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Позиционируем букву относительно начальной позиции слова
        mesh.position.x = pos[0] + dirX * charIndex * letterSpacing;
        mesh.position.y = pos[1] + dirY * charIndex * letterSpacing;
        mesh.position.z = pos[2] + dirZ * charIndex * letterSpacing;
        
        // Поворачиваем буквы в зависимости от направления
        if (dir === 1) { // вдоль Z
          mesh.rotation.y = Math.PI;
        } else if (dir === 2) { // вдоль X
          mesh.rotation.y = Math.PI / 2;
        } else if (dir === 3) { // вдоль Y
          mesh.rotation.x = -Math.PI / 2;
        }
        
        scene.add(mesh);
      });
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
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
