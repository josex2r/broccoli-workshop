# broccoli-workshop

Presentación e introducción a [broccoli.js](http://broccolijs.com/) en español.

[Check the example page!](https://josex2r.github.io/broccoli-workshop/#/)

## Índice

- [Broccoli.js](#broccoli-js)
- [Arquitectura](#arquitectura)
  - [Trees](#trees)
  - [Encadenamiento](#encadenamiento)
  - [File System API](#file-system-api)
  - [Caché](#cache)
- []()

## ¿Qué es broccoli.js?

[broccoli.js](http://broccolijs.com/) es una herramienta que funciona sobre `node.js` para la compilación/construcción de proyectos.

Esta herramienta no es excluyente y se puede combinar con otras como `grunt` ([grunt-broccoli](https://www.npmjs.com/package/grunt-broccoli)) o `gulp`.

Podríamos decir que tiene más parecido con `gulp` porque prevalece la codificación frente a la configuración.

La principal característica de [broccoli.js](http://broccolijs.com/) es la velocidad con la que es capaz de (re)construir proyectos.

## Arquitectura

La principal característica de [broccoli.js](http://broccolijs.com/) es el uso de **trees**.

Un **tree** no es más que un directorio con una serie de ficheros y/o directorios.

Para construir los proyectos se apoya en una serie de **plugins**, que modifican y transforman los ficheros mediante la [File System API](https://nodejs.org/api/fs.html) de `node.js`.

Otra de sus características más importantes es el uso de la `caché`, la cual le otorga esa gran velocidad de construcción sin la necesidad de paralelizar tareas.

### Trees

Como hemos comentado anteriormente, un **tree** es un directorio.

Si lo comparamos con otras herramientas podríamos pensar que un **tree** está formado por un solo fichero o un **stream** de datos, pero la filosofía de [broccoli.js](http://broccolijs.com/) es compilar un proyecto entero y raramente tenemos que manejar ficheros individuales.

> tree-goes-in-tree-goes-out

Es por ello que la filosofía principal del framework es procesar **trees** de entrada para devolver un único **tree** de salida.

Ejemlpo:

```javascript
var compileSass = require('broccoli-sass');

var styles = compileSass(['scss', 'sass-vendors'], 'main.scss', 'app.css');
```

### Encadenamiento

Los plugins son paquetes [npm](https://www.npmjs.com/) que nos permiten abstraernos de tareas complejas y reutilizar herramientas que otras personas han programado.

El encadenamiento de **plugins** es una de las características más importantes y nos permite realizar transformaciones sobre otros trees que devuelven los **plugins**.

Ejemplo:

```javascript
var JSHinter = require('broccoli-jshint');
var esTranspiler = require('broccoli-babel-transpiler');
var concat = require('broccoli-concat');

var tree = new JSHinter('app');
tree = esTranspiler(tree);
tree = concat(tree, {
  outputFile: 'app.js'
});
```

### File System API

[broccoli.js](http://broccolijs.com/) utiliza la api nativa de `node.js` para la lectura/escritura de ficheros.

¿Por qué?
Pues porque los plugins leen ficheros, los modifican y los escriben en un directorio temporal y para ello no es necesario crear una nueva herramienta.

Y sí, en este punto ya te estará chirriando las palabras `directorio temporal`, pero junto a el sistema de caché que implementan los **plugins** y que los ordenadores son cada vez más rápidos esto no es un problema.

A continuación aparece un trozo de código que representa a un plugin, en el se puede ver como en la función `build()` se puede acceder a las variables de contexto `this.inputPaths` y `this.outputPath` con las que habrá que interactuar para procesar los ficheros.

```javascript
var Plugin = require('broccoli-plugin');

MyPlugin.prototype = Object.create(Plugin.prototype);
MyPlugin.prototype.constructor = MyPlugin;
function MyPlugin(inputNode) {
  Plugin.call(this, [inputNode]);
}

MyPlugin.prototype.build = function() {
  // Build from this.inputPaths[0] to this.outputPath
};
```

### Caché

Puede chocar que no se paralelicen tareas, pero para optimizar el tiempo que se puede ganar mediante esta técnica se ha incorporado un sistema de cacheado en el que cada plugin persiste su **tree** de salida mediante el uso de la memoria y de un directorio temporal que maneja [broccoli.js](http://broccolijs.com/) automáticamente.

Otros plugins, como [broccoli-caching-writer](https://github.com/ember-cli/broccoli-caching-writer), permiten añadir una comprobación extra persistiendo en memoria un hash que representa los **trees** de entrada.

En el momento que el algún fichero cambie, el hash no coincidirá y se volverá a ejecutar el **plugin**.

En la siguiente imagen podemos ver la carpeta temporal generada por el [ejemplo 1](https://github.com/josex2r/broccoli-workshop/tree/master/examples/example1)

![tmp](img/tmp.png)
