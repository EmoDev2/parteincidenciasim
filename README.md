# 📜 Firma Tu Parte de Incidencias

Simulador 2D de despacho de dirección, estilo juego `.io`. Eres quien firma los partes del **IES Calagman Skecherini**. Lee cada parte, decide la sanción, escribe los números **a mano con el ratón** (el juego los reconoce), firma… y aguanta madres enfadadas, evaluaciones y el temido **BOSS FINAL**.

> *Bear ha puesto un parte… no te preocupes, desahógate y firma partes de incidencias.*

---

## ▶️ Cómo jugar

Abre `index.html` con Chrome, Edge o Firefox. No necesita instalar nada.

> Para jugar **desde el móvil** hay que servir la carpeta desde una web (Netlify Drop, GitHub Pages, itch.io…). Abierto como archivo suelto no funciona bien en la mayoría de móviles.

### El parte
1. **Lee** el parte: alumno, curso, profesor, materia, descripción de la incidencia y gravedad (el profesor marca con X o tick irregulares).
2. **Mira la sanción propuesta** por el profesor.
3. Si el profesor pide **expulsión**, decide **SÍ o NO** (`¿APROBAR LA EXPULSIÓN?`):
   - Si es justa → **SÍ**, casilla *Expulsión* y los números (días / semanas / meses).
   - Si es desproporcionada → **NO** y pon solo *Amonestación*.
4. Escribe los números **a mano** en las casillas (vacío = 0). El juego detecta lo que dibujas.
5. **Firma** en el recuadro de Dirección y pulsa **ENTREGAR** (o `Enter`).
6. Si el parte **no tiene sentido** (“me ha mirado raro”), pulsa **ANULAR**: +150 puntos. Anular un parte normal cuesta puntos.

### Jornadas y evaluaciones
- Una **jornada** son 6 partes.
- Cada **5 jornadas** hay una **sesión de evaluación**: notas por materia (verde ≥ Bien, amarillo = Suficiente, rojo = Insuficiente), informes de cada profesor, votación del claustro y decisión: **pasar de curso, repetir, DIVER o titular**. Navega con las flechas ◀ ▶.

### Eventos y extras
- **Madre enfadada** (10%): escucha su razón y decide *mantener*, *anular* o **llamar al alumno al calabozo** (despacho 3D de la Jefa de Estudios). Puedes **ver el parte original** en todo momento.
- **BOSS FINAL** cada 10 partes: alarma, pantalla roja, expulsión definitiva.
- **DESAHÓGATE**: grito y lluvia de papeles para bajar el estrés.
- **Rango de mano dura**: 20 rangos, de *Aprendiz de Dirección* a *Directora del Calabozo Eterno*. Suben con errores, expulsiones y partes por todo.
- Si el **estrés** llega al 100%, te quemas y termina la partida. Se guarda tu récord.

### Controles
| Acción | Ratón / táctil | Teclado |
|---|---|---|
| Escribir números / firmar | Arrastrar en la casilla | — |
| Entregar | Botón ENTREGAR | `Enter` |
| Pausa | Botón ⏸ | `P` / `Esc` |
| Sonido | Botón 🔊 | `M` |
| Evaluación: cambiar página | ◀ ▶ | `←` `→` |

En **móvil**, al tocar una casilla o la firma se abre una pizarra grande para escribir con el dedo.

---

## 🧩 Contenido

- Miles de incidencias generadas por combinación (vapeo, baño, clase, convivencia, daños, redes, excursiones, FP…), con nombres, cursos (1º ESO a 2º Bach y FP) y profesores variados.
- Partes **justos**, **con sanciones exageradas** y **sin sentido**.
- Firma del profesor generada con **curvas bezier aleatorias**.
- **Reconocedor de dígitos** manuscritos (red neuronal pequeña entrenada con el conjunto de dígitos de scikit-learn, integrada en `model.js`).
- Música y efectos **sintetizados** con WebAudio (sin archivos de audio).
- Despacho en **pseudo-3D** con cámara animada.

## 📁 Estructura

```
index.html        página y metadatos (favicon, miniatura al compartir)
game.js           motor del juego, escenas, papel, firma, madre, despacho 3D
data.js           nombres, cursos, partes, madres
incidents.js      generador de incidencias
incidents2.js     ampliación de datos (más familias, detalles, madres…)
eval.js           sesión de evaluación (notas, informes, votación)
audio.js          música y efectos sintetizados (+ soporte de MP3)
model.js          pesos del reconocedor de dígitos
img/              PNG/JPG (taza, reloj, planta, sello, pluma, textura de mesa y papel…)
audio/            (opcional) tus propios MP3, ver audio/LEEME.txt
icon.png          icono, favicon y miniatura
```

## 🎧 MP3 propios (opcional)

Pon archivos `.mp3` en `audio/` con estos nombres y sustituirán a los sonidos sintetizados (si falta alguno, se usa el sintetizado):

- Música (bucle): `music-menu.mp3`, `music-play.mp3`, `music-tense.mp3`, `music-office.mp3`
- Efectos: `click`, `paper`, `stamp`, `ding`, `ok`, `bad`, `bell`, `alarm`, `knock`, `door`, `chair`, `scream`, `boss`, `fanfare`, `tick`, `void`, `angryVoice` (cada uno como `nombre.mp3`)

## 🖼️ Cambiar las imágenes

Las imágenes de `img/` son sustituibles por otras con **el mismo nombre**: `mug.png`, `clock.png`, `plant.png`, `stamp.png`, `pen.png`, `papers.png`, `sheet.png`, `desk.jpg`, `paper.jpg`.

## 🌐 Publicarlo

- **Netlify Drop**: arrastra la carpeta a `app.netlify.com/drop` y obtienes un enlace.
- **GitHub Pages**: sube la carpeta a un repositorio y activa *Settings → Pages*.
- Si lo publicas, pon la **URL completa** de la imagen en `og:image` y `twitter:image` de `index.html` para que la miniatura salga al compartir el enlace.

## ⚠️ Aviso

**Obra de ficción y parodia.** Todos los nombres, personas, centros y hechos son inventados. Cualquier parecido con la realidad es pura coincidencia. “IES Calagman Skecherini” no es un centro real.

## 📄 Créditos y licencias

- Código, imágenes generadas, música y efectos: creados para este proyecto.
- Tipografías de **Google Fonts** (licencia abierta): UnifrakturCook, Caveat, Patrick Hand, Lora y Special Elite. Sin conexión se usan fuentes del sistema.
- El `icon.png` es obra del autor del juego.
