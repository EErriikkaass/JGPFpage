# Babylon.js Multi-Scene Project Documentation

## Table of Contents
- [Overview](#overview)
- [How the App Runs](#how-the-app-runs)
- [Project Structure](#project-structure)
- [main.ts](#maints)
- [GUI Overlay](#guiguiscenets)
- [Scene 1](#scene-1)
- [Scene 2](#scene-2)
- [Scene Switching](#scene-switching)
- [Assets](#assets)
- [Known Issues and Improvements](#known-issues-and-improvements)

## Overview

This project is a Babylon.js application that renders **two 3D scenes** and a persistent **GUI overlay**.  
It uses **one Babylon Engine** and **one render loop**, and switches between scenes using a shared scene index.

### Features
- **Two 3D scenes**
  - **Scene 1:** basic objects, skybox, textured ground, manual WASD movement, trigger zone to switch scenes
  - **Scene 2:** physics-enabled using cannon-es, heightmap terrain, water plane, physics boxes, impulse movement, return trigger
- **One GUI overlay scene**
  - Always visible
  - Buttons to switch between Scene 1 and Scene 2

---

## How the App Runs

1. `main.ts` creates a `<canvas>` and the Babylon Engine.
2. Scene 1 and Scene 2 are created and stored in an array.
3. The GUI overlay scene is created and always rendered on top.
4. A single render loop renders:
   - the active 3D scene (`scenes[currentIndex]`)
   - then the GUI scene (overlay)

---

## Project Structure

```text
src/
  main.ts
  main.css
  gui/
    guiScene.ts
  scene1/
    createStartScene.ts
  scene2/
    createStartScene.ts
assets/
  texturesx/skybox*
  environments/valleygrass.png
  environments/villageheightmap.png
  wood.jpg
index.html
```

## main.ts

### Purpose
`main.ts` is the entry point of the application. It creates the HTML canvas, initialises the Babylon `Engine`, creates both 3D scenes, creates the GUI overlay scene, and runs a **single** render loop that draws the active scene and then the GUI on top.

---

### Key Responsibilities
- Create and append the render `<canvas>` to the DOM
- Create the Babylon `Engine`
- Store available scenes in an array and track the active scene with `currentIndex`
- Provide `setSceneIndex(i)` so scenes and GUI can switch the active scene
- Run one render loop that renders:
  1. the active 3D scene
  2. the GUI overlay scene
- Resize the engine when the window size changes

---

### Canvas Setup
A `<canvas>` element is created dynamically and added to the page:

- `id`: `renderCanvas`
- `class`: `background-canvas`

This allows styling via `main.css`.

---

### Engine Setup
The Babylon engine is created using the canvas:

- `new Engine(canvas, true, {}, true)`
- The second `true` enables antialiasing
- The final `true` enables adapting to device ratio

---

### Scene Index and Switching
The active scene is controlled by a numeric index:

- `currentIndex` starts at `0`
- `setSceneIndex(i)` updates `currentIndex`

Both Scene 1 and Scene 2 receive `setSceneIndex` so they can switch scenes automatically (for example, when the player enters a trigger zone).

---

### Scene Creation
Scenes are stored in an array so the active one can be rendered by index:

- `scenes[0] = createScene1(engine, setSceneIndex)`
- `scenes[1] = createScene2(engine, setSceneIndex)`

The GUI overlay is created separately:

- `const gui = menuScene(engine, setSceneIndex)`

The GUI scene is always rendered (on top), regardless of the active 3D scene.

---

### Render Loop
Only **one** render loop is used:

1. Render the active 3D scene:
   - `scenes[currentIndex].scene.render()`
2. Render the GUI overlay scene on top:
   - `gui.scene.autoClear = false`
   - `gui.scene.render()`

`autoClear = false` prevents the GUI scene from clearing the framebuffer, allowing it to overlay the 3D scene.

---

### Resize Handling
The engine is resized when the browser window changes size:

- `window.addEventListener("resize", () => engine.resize())`

This ensures the render canvas and aspect ratio stay correct on resize.

## gui/guiScene.ts

### Purpose
`guiScene.ts` creates a **GUI-only Babylon Scene** that renders as an overlay on top of the active 3D scene.  
It provides two buttons that allow the user to switch between Scene 1 and Scene 2 at any time.

---

### Key Responsibilities
- Create a Babylon `Scene` used only for GUI
- Create a fullscreen `AdvancedDynamicTexture` (Babylon GUI)
- Create and attach a GUI camera
- Create buttons that call `setSceneIndex(i)`
- Provide a `dispose()` method to clean up GUI resources

---

### createButton Function
`createButton(...)` is a helper function that builds a styled Babylon GUI button and adds it to the UI.

**Inputs**
- `name`: internal button name
- `text`: text displayed on the button
- `x`, `y`: button position offsets (e.g. `"120px"`)
- `ui`: the fullscreen `AdvancedDynamicTexture`
- `onClick`: callback function fired on button press

**Behaviour**
- Creates a simple button using `GUI.Button.CreateSimpleButton(...)`
- Applies styling:
  - `width`: `160px`
  - `height`: `50px`
  - `cornerRadius`: `20`
  - `background`: `purple`
  - `color`: `white`
- Subscribes to click events using `onPointerUpObservable`
- Adds the button to the UI using `ui.addControl(btn)`

---

### createCamera Function
`createCamera(scene)` creates an `ArcRotateCamera` to support the GUI scene.

**Camera Configuration**
- Name: `"guiCam"`
- Target: `Vector3.Zero()`
- Attached to controls using `attachControl(true)`

---

### Exported Function: guiScene(engine, setSceneIndex)
The default export creates and returns the GUI scene setup.

**Parameters**
- `engine`: Babylon `Engine`
- `setSceneIndex(i)`: callback used to switch the active 3D scene

**Steps**
1. Create a new Babylon `Scene`
2. Create a fullscreen UI texture:
   - `GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene)`
3. Create two buttons:
   - `"SCENE 1"` button calls `setSceneIndex(0)`
   - `"SCENE 2"` button calls `setSceneIndex(1)`
4. Create and attach the GUI camera

---

### Returned Object
The function returns an object (typed as `GuiSceneData`) containing:
- `scene`: the GUI Babylon scene
- `ui`: fullscreen UI texture
- `camera`: GUI camera
- `dispose()`: cleanup method which calls `ui.dispose()`

## Scene 1

### File
`scene1/createStartScene.ts`

---

### Purpose
Scene 1 is a basic Babylon.js scene that demonstrates:
- Creating simple meshes (box, sphere, ground)
- Adding lighting and shadows
- Applying materials and textures
- Adding a skybox
- Moving the player sphere using **WASD** (non-physics movement)
- Switching to Scene 2 when the player enters a trigger zone

---

### Key Objects Created
- **Box** (`CreateBox`)
  - Positioned at `y = 3`
  - Rotates slightly each frame for a simple animation
- **Sphere** (`CreateSphere`)
  - Acts as the “player” object
  - Starts at `(0, 1, 0)`
- **Ground** (`CreateGround`)
  - Size: `20 x 20`
  - Receives shadows
- **Lights**
  - Hemispheric light for ambient lighting
  - Directional “sun” light for stronger lighting + shadows
- **Camera**
  - `ArcRotateCamera` targeting the center of the scene

---

### Visual Features

#### Skybox
A large cube surrounds the scene and uses a cube texture to simulate a sky.

- Texture path: `./assets/texturesx/skybox`
- Uses `Texture.SKYBOX_MODE`
- Lighting disabled to keep the skybox bright and consistent

---

#### Ground Texture
The ground uses a repeating grass texture:
- Texture path: `./assets/environments/valleygrass.png`
- Repeats:
  - `uScale = 6`
  - `vScale = 6`

---

#### Materials
- **Sphere material**
  - Blue-ish diffuse colour
  - Light specular shine
- **Box material**
  - Orange diffuse colour

---

#### Shadows
A directional light is used as a “sun” and a `ShadowGenerator` is configured:
- Blur exponential shadow map enabled
- `blurKernel = 16`
- Box and sphere are added as shadow casters
- Ground receives shadows

---

### Player Controls (WASD)
Keyboard state is tracked using `keydown` and `keyup` listeners:

- `W` moves forward (+Z)
- `S` moves backward (-Z)
- `A` moves left (-X)
- `D` moves right (+X)

Movement is applied by directly changing the sphere position each frame (not physics-based).

---

### Trigger Zone (Scene 1 → Scene 2)
A trigger mesh is created to switch scenes:

- Mesh name: `"trigger"`
- Position: `(6, 1, 0)`
- Scaled taller: `(1, 2, 1)`
- Visible and styled with an emissive “portal” material

#### Switching Logic
Each frame, the scene checks if the sphere intersects the trigger:
- Uses `intersectsMesh(trigger, false)`
- Uses `wasInside` to detect **entering** the trigger (prevents repeated switching)

When the sphere enters the trigger:
- `setSceneIndex(1)` switches to Scene 2

---

### Per-frame Update
An `onBeforeRenderObservable` callback runs every frame to:
- Rotate the box slightly
- Apply WASD movement to the sphere
- Check trigger collision and switch scenes

---

### Cleanup
The scene stores the observable handle (`obs`) and removes it in `dispose()`:

- `scene.onBeforeRenderObservable.remove(obs)`

## Scene 2

### File
`scene2/createStartScene.ts`

---

### Purpose
Scene 2 is a physics-enabled Babylon.js scene using **cannon-es**. It demonstrates:
- Enabling physics with `CannonJSPlugin`
- Loading a heightmap terrain with a fallback ground
- Adding a water plane
- Spawning dynamic physics objects (boxes)
- Controlling the player sphere using **impulses** (WASD)
- Switching back to Scene 1 when the player enters a return trigger

---

### Physics Setup

#### Physics Engine
- Physics library: `cannon-es`
- Babylon plugin: `CannonJSPlugin`

#### Gravity
Physics gravity is set to:

- `(0, -9.81, 0)`

#### Enabling Physics
Physics is enabled when the scene is created:

- `scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON))`

---

### Environment

#### Skybox
A skybox is created using a cube texture:
- Texture path: `./assets/texturesx/skybox`
- Uses `Texture.SKYBOX_MODE`
- Lighting disabled for consistent appearance

---

#### Terrain (Heightmap with Fallback)
The terrain system is designed to always provide a usable floor:

1. **Fallback ground** is created immediately:
   - Large flat ground (`200 x 200`)
   - Has a static physics collider (`mass: 0`)
   - Ensures the player doesn’t fall while the heightmap loads

2. A **heightmap terrain** is loaded asynchronously using:
   - `./assets/environments/villageheightmap.png`
   - `CreateGroundFromHeightMap(...)`

3. On successful load:
   - A grass texture is applied (`valleygrass.png`)
   - A `HeightmapImpostor` collider is created (`mass: 0`)
   - The terrain receives shadows
   - The fallback ground is disposed

4. On error:
   - An error message is logged
   - The fallback ground remains

---

#### Water Plane
A water plane is created as a large ground mesh:
- Position: `y = 0.05`
- Material:
  - Dark blue diffuse colour
  - Transparent (`alpha = 0.6`)
- Optional static collider (so objects don’t fall through):
  - `BoxImpostor`, `mass: 0`

---

### Scene Objects

#### Cylinder
- Mesh: `CreateCylinder`
- Position: `(1, 1, 1)`
- Material:
  - Uses texture `./assets/wood.jpg`
  - Specular disabled (black)
  - Emissive tint applied

---

#### Sphere (Player)
- Mesh: `CreateSphere`
- Start position: `(-4, 4, 0)`
- Physics body:
  - `SphereImpostor`
  - `mass: 2`

##### Damping
Damping is applied to reduce endless rolling/spinning:
- `linearDamping = 0.9`
- `angularDamping = 0.9`

---

#### Physics Boxes
A set of 10 dynamic boxes are spawned:
- Mesh: `CreateBox`
- Physics body:
  - `BoxImpostor`
  - `mass: 1`
- These boxes can be pushed by the player sphere

---

### Lighting and Shadows
Scene 2 includes:
- Hemispheric light for general lighting
- Directional “sun” light for shadows
- `ShadowGenerator` configured similarly to Scene 1:
  - blur exponential shadow map enabled
  - `blurKernel = 16`
- The sphere and cylinder act as shadow casters
- Terrain receives shadows when loaded

---

### Player Controls (WASD with Physics Impulses)
Keyboard input is tracked using `keydown` and `keyup`.

Instead of changing position directly, Scene 2 applies impulses (required for physics stability):
- `W` applies impulse in +Z
- `S` applies impulse in -Z
- `A` applies impulse in -X
- `D` applies impulse in +X

Impulse is applied using:
- `physicsImpostor.applyImpulse(impulse, sphere.getAbsolutePosition())`

---

### Return Trigger (Scene 2 → Scene 1)
A trigger mesh is created to switch back to Scene 1:

- Mesh name: `"returnTrigger"`
- Position: `(6, 1, 0)`
- Scaled taller: `(1, 2, 1)`
- Visible and styled with an emissive “portal” material

#### Switching Logic
Each frame, the scene checks intersection between the sphere and the trigger:
- Uses `intersectsMesh(returnTrigger, false)`
- Uses `wasInside` to detect entering the trigger

When the sphere enters the trigger:
- `setSceneIndex(0)` switches back to Scene 1

---

### Per-frame Update
An `onBeforeRenderObservable` callback runs every frame to:
- Apply physics impulses based on WASD keys
- Check trigger collision and switch scenes

---

### Cleanup
The scene stores the observable handle (`obs`) and removes it in `dispose()`:

- `scene.onBeforeRenderObservable.remove(obs)`

## Scene Switching

### How Switching Works
Scene switching is controlled by a shared index stored in `main.ts`.

- `currentIndex` determines which 3D scene is currently active
- `setSceneIndex(i)` updates `currentIndex`

On the next frame, the render loop renders the new active scene.

---

### Where setSceneIndex Comes From
`setSceneIndex` is defined in `main.ts` and passed into:
- Scene 1 (`scene1/createStartScene.ts`)
- Scene 2 (`scene2/createStartScene.ts`)
- GUI overlay (`gui/guiScene.ts`)

This means any scene (or the GUI) can request a scene switch.

---

### Switching Methods

#### 1) GUI Buttons (Always Available)
The GUI overlay contains two buttons:
- **SCENE 1** → calls `setSceneIndex(0)`
- **SCENE 2** → calls `setSceneIndex(1)`

Because the GUI scene is always rendered, these buttons work no matter which 3D scene is currently active.

---

#### 2) Trigger Zones (Automatic Switching)
Both 3D scenes include a trigger mesh that switches the scene when the player sphere enters it:

- **Scene 1 trigger** switches to Scene 2
  - `setSceneIndex(1)`
- **Scene 2 return trigger** switches to Scene 1
  - `setSceneIndex(0)`

Triggers use Babylon collision checking:
- `sphere.intersectsMesh(trigger, false)`

---

### Why wasInside Is Used
Both scenes use a `wasInside` boolean to detect **entering** a trigger instead of repeatedly triggering every frame.

This prevents:
- Switching instantly on scene load if the sphere starts inside the trigger
- Switching multiple times while the sphere stays inside the trigger volume

Basic logic:
- `inside` = sphere is currently intersecting trigger
- If `inside` is true and `wasInside` was false → the sphere has just entered
- Then update `wasInside = inside` each frame

---

### Summary
- Scene switching is controlled by `currentIndex`
- `setSceneIndex(i)` is shared across the app
- Switching is triggered either by:
  - GUI buttons
  - Entering trigger zones
- `wasInside` ensures triggers fire only on entry

## Assets

### Required Asset Files
The following files are expected at runtime (based on the code provided):

- `./assets/texturesx/skybox`  
  Cube texture set used for the skybox in Scene 1 and Scene 2.
- `./assets/environments/valleygrass.png`  
  Grass texture used for ground/terrain materials.
- `./assets/environments/villageheightmap.png`  
  Heightmap image used to generate the terrain mesh in Scene 2.
- `./assets/wood.jpg`  
  Texture used on the cylinder material in Scene 2.

---

### What Happens If Assets Are Missing
If any required assets are missing or paths are incorrect, you may see:

- A **black or missing skybox**
- Scene 2 **terrain failing to load**
  - In this case, the **fallback ground** remains active
  - An error will be logged to the console (from `onError`)
- Textures appearing **plain coloured** or not loading
- Console errors such as missing file / failed network request messages

## Known Issues and Improvements

### 1) Keyboard Listeners Are Added Per Scene
Both Scene 1 and Scene 2 attach `window` event listeners for `keydown` and `keyup`.

If the user switches scenes many times, these listeners can **stack up**, causing input to be handled multiple times.

**Why this happens**
- Each scene calls:
  - `window.addEventListener("keydown", ...)`
  - `window.addEventListener("keyup", ...)`
- But the listeners are **not removed** in `dispose()`

**Improvements**
- Centralise keyboard input in `main.ts` and share a single `keys` object with scenes
- Or store the handler functions and remove them during cleanup:
  - `window.removeEventListener("keydown", handler)`
  - `window.removeEventListener("keyup", handler)`

---

### 2) Cleanup Is Partial
Both scenes remove their `onBeforeRenderObservable` observer, but do not fully clean up:

- Meshes may remain in memory if scenes are recreated
- Materials/textures are not explicitly disposed
- Keyboard listeners are not removed (see issue #1)

**Improvements**
- Extend `dispose()` to also:
  - remove event listeners
  - dispose meshes/materials/textures if the scene will not be reused
- Consider calling `scene.dispose()` if the scene is intended to be destroyed and rebuilt

---

### 3) Terrain Loads Asynchronously (Scene 2)
Scene 2 loads the heightmap terrain asynchronously, which means:

- The terrain is not available instantly
- The fallback ground is necessary so the player always has a floor

**This is a good design choice**
Because it ensures the scene remains usable even if:
- the heightmap takes time to load
- the heightmap fails to load completely

**Possible improvements**
- Add a loading message in the GUI while the heightmap is loading
- Add a visual indicator when terrain loading fails (in addition to console logs)

---

### Summary
- Input listeners should be centralised or properly removed
- `dispose()` could be expanded for full cleanup
- The heightmap fallback system is robust, but could be improved with UI feedback

