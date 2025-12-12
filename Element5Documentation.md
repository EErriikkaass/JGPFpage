# BabylonJS Multi-Scene Physics Project

## Overview

This project is a **Babylon.js 3D application** built using **TypeScript** and **Vite**.  
It demonstrates multi-scene management, physics-based interactions, and real-time user input.

The application contains two main scenes:

- **Scene 1** – Player movement with trigger-based scene switching  
- **Scene 2** – Physics-enabled environment with terrain, water, and interactable objects

---

## Technologies Used

- **Babylon.js** – 3D rendering engine
- **TypeScript** – Strongly typed JavaScript
- **Vite** – Development server and bundler
- **Cannon-ES** – Physics engine
- **Babylon GUI** – User interface overlay

---

## Project Structure

babylonProj/
|-- assets/
│ |-- environments/
│ │ |-- villageheightmap.png
│ │ |-- valleygrass.png
│ |-- texturesx/
│ |-- skybox_*.jpg
│
|-- src/
│ |-- gui/
│ │ |-- guiScene.ts
│ |-- scene1/
│ │ |-- createStartScene.ts
│ |-- scene2/
│ │ |-- createStartScene.ts
│ |-- index.ts
│ |-- main.css
│
|-- index.html
|-- package.json
|-- tsconfig.json
|-- vite.config.ts


---

## Scene Management

Scene switching is controlled centrally in `index.ts`.

- A `currentIndex` variable tracks the active scene
- Each scene receives `setSceneIndex()` as a callback
- Only **one render loop** is used

```ts
let currentIndex = 0;

engine.runRenderLoop(() => {
  scenes[currentIndex].scene.render();
  gui.scene.autoClear = false;
  gui.scene.render();
});
