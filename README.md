# 🎯 Librería de Mónadas Funcionales en TypeScript

Este proyecto implementa una colección de mónadas funcionales en TypeScript orientadas a mejorar la gestión de efectos, errores y dependencias en arquitecturas limpias y hexagonales. Incluye `Either`, `IO`, `Option`, `Reader`, `Task`, `TaskEither` y combinaciones como `ReaderTaskEither`.

---

## 📋 Tabla de Contenidos

- [¿Qué es una Mónada?](#-qué-es-una-mónada)
- [Objetivo del Proyecto](#-objetivo-del-proyecto)
- [Mónadas Incluidas](#-mónadas-incluidas)
- [Cuándo y Por Qué Usarlas](#-cuándo-y-por-qué-usarlas)
- [Instalación](#-instalación)
- [Ejecutar los Tests](#-ejecutar-los-tests)
- [Licencia](#-licencia)

---

## 🧠 ¿Qué es una Mónada?

Una mónada es un patrón funcional que permite encadenar operaciones secuenciales en un contexto determinado, gestionando efectos secundarios, errores o estados de forma segura y composable. Son una abstracción que facilita escribir código limpio, predecible y fácil de mantener, especialmente en arquitecturas basadas en principios funcionales.

---

## 🎯 Objetivo del Proyecto

El objetivo es proporcionar una implementación robusta y ligera de mónadas comunes usadas en TypeScript, pensadas para integrarse fácilmente en proyectos con arquitectura hexagonal o limpia, ayudando a manejar:

- Errores explícitos (`Either`)
- Computaciones asíncronas (`Task`)
- Dependencias ambientales (`Reader`)
- Efectos perezosos (`IO`)
- Opciones de valor (`Option`)

Además, combina estas abstracciones para resolver casos complejos como operaciones asíncronas con posible error y acceso a entorno (`ReaderTaskEither`).

---

## 🟢 Mónadas Incluidas

### 1. `Either<L, R>`

Representa un valor que puede ser un error (`Left`) o un valor correcto (`Right`). Ideal para manejo explícito de errores sin excepciones.

### 2. `IO<R>`

Encapsula operaciones perezosas que producen un valor `R` sin efectos secundarios visibles hasta su ejecución. Útil para operaciones impuras controladas.

### 3. `Option<R>`

Modela valores opcionales que pueden estar presentes (`Some`) o ausentes (`None`), evitando valores nulos o indefinidos.

### 4. `Task<R>`

Representa una computación asíncrona que produce un valor `R` cuando se ejecuta. Facilita composición de operaciones asíncronas.

### 5. `TaskEither<L, R>`

Combina `Task` y `Either` para representar operaciones asíncronas que pueden fallar explícitamente con un error `L`.

### 6. `Reader<Env, R>`

Modela funciones dependientes de un entorno `Env`, permitiendo inyectar dependencias de forma funcional y testable.

### 7. `ReaderTaskEither<Env, L, R>`

Combina `Reader`, `Task` y `Either` para operaciones asíncronas que dependen de un entorno y pueden fallar con error explícito.

### 8. Interfaces comunes

- `Monad<R>`: Contrato que asegura la implementación de los métodos esenciales (`map`, `flatMap`).
- `Matchable<R, L>`: Para manejar patrones de valores tipo `Either`.
- `Taskable<R>`: Para convertir valores en tareas asíncronas.

---

## 🧩 Cuándo y Por Qué Usarlas

- Usa **`Either`** para evitar excepciones y modelar errores de forma explícita y segura.
- Usa **`IO`** para controlar efectos perezosos (lectura de configuración, generación de IDs).
- Usa **`Option`** para manejar valores opcionales sin usar null/undefined.
- Usa **`Task`** para computaciones asíncronas composables, sin lanzar promesas directamente.
- Usa **`TaskEither`** para flujos asíncronos con manejo explícito de errores.
- Usa **`Reader`** para inyectar dependencias y entornos de forma funcional.
- Usa **`ReaderTaskEither`** para operaciones asíncronas dependientes de entorno con errores controlados.

Estas abstracciones facilitan un código más modular, testeable y mantenible, ideales para arquitecturas hexagonales y limpias donde las dependencias, efectos y errores deben gestionarse con claridad.

---

## 💾 Instalación

Para instalar las dependencias y esta librería, ejecuta:

```bash
npm install
```

---

## 🧪 Ejecutar los Tests

Para correr los tests unitarios con Vitest:

```bash
npm run test
```

---

## 📝 Licencia

Este proyecto está licenciado bajo la licencia MIT.

En la raíz del repositorio encontrarás un archivo llamado `LICENSE` que contiene el texto completo de la licencia. Este archivo indica los términos bajo los cuales puedes usar, modificar y distribuir este proyecto.

La licencia MIT es muy permisiva, permitiendo el uso libre del código siempre que se mantenga el aviso de copyright y la licencia original.

No se requiere configuración adicional para usar el proyecto bajo esta licencia, simplemente respeta las condiciones indicadas en el archivo `LICENSE`.
