# NestLayer Architecture

A guided tour of this backend — written for people who have never used NestJS.

Una guía de este backend — escrita para quienes nunca han usado NestJS.

---

## 1. What is NestLayer and why does it exist

### 🇬🇧 English

NestLayer is a **starter backend**: a small server you can run, read, and copy from. It is not a huge framework. It is a finished example of how a real API is usually organized.

Think of it like a furnished apartment instead of an empty plot of land. You can move in and see where the kitchen, the lock on the door, and the mailbox go — then change the furniture.

Most “hello world” tutorials only show one route that returns `"Hello World"`. That is like teaching someone to drive by showing them the steering wheel and never the road. NestLayer includes the pieces you meet at work:

- a database (PostgreSQL)
- login with tokens (JWT)
- protection of private routes
- validation of incoming data
- documentation in the browser (Swagger at `/docs`)
- errors that always look the same

The goal is that you **understand why** each folder exists, not that you memorize commands.

### 🇪🇸 Español

NestLayer es un **backend de partida**: un servidor pequeño que puedes ejecutar, leer y copiar. No es un framework enorme. Es un ejemplo terminado de cómo suele organizarse una API real.

Piénsalo como un departamento amoblado en vez de un terreno vacío. Puedes entrar y ver dónde queda la cocina, la chapa de la puerta y el buzón — y después cambiar los muebles.

La mayoría de los tutoriales de “hola mundo” solo muestran una ruta que responde `"Hello World"`. Es como enseñar a manejar mostrando el volante y nunca la calle. NestLayer incluye lo que te encuentras en el trabajo:

- una base de datos (PostgreSQL)
- login con tokens (JWT)
- protección de rutas privadas
- validación de los datos que llegan
- documentación en el navegador (Swagger en `/docs`)
- errores que siempre se ven igual

El objetivo es que **entiendas por qué** existe cada carpeta, no que memorices comandos.

---

## 2. What is NestJS

### 🇬🇧 English

**NestJS** is a tool for building the *server* part of an app in TypeScript (a typed version of JavaScript). The server is the building behind the website: the browser is a visitor; NestJS is how we organize the staff inside.

**Analogy: a well-run hotel.**

- Guests (apps, mobile clients, Swagger) arrive at the front door with a request: “I want to check in” or “I want my room key.”
- NestJS is the hotel’s **org chart**. It tells you who is the receptionist, who is security, who cooks, and who talks to the warehouse (the database).
- A **module** is a department (Auth, Users). You do not put the kitchen inside the lobby.
- You write small classes; Nest **creates** them and **passes** them to each other (this is called *dependency injection*). You do not shout across the lobby for a chef — the hotel already assigned one.

You do not need to know Express or Spring to start. Read NestLayer as: “HTTP comes in here, work happens there, data is saved over there.”

```ts
// A tiny NestJS controller: "when someone GETs /, answer with a string"
@Get()
getHello(): string {
  return this.appService.getHello();
}
```

### 🇪🇸 Español

**NestJS** es una herramienta para construir la parte *servidor* de una app en TypeScript (JavaScript con tipos). El servidor es el edificio detrás del sitio: el navegador es un visitante; NestJS es cómo organizamos al personal adentro.

**Analogía: un hotel bien llevado.**

- Los huéspedes (apps, móviles, Swagger) llegan a la puerta con un pedido: “quiero registrarme” o “quiero la llave de la habitación”.
- NestJS es el **organigrama** del hotel. Te dice quién es recepción, quién es seguridad, quién cocina y quién habla con el depósito (la base de datos).
- Un **módulo** es un departamento (Auth, Users). No pones la cocina en el lobby.
- Escribes clases pequeñas; Nest las **crea** y se las **pasa** unas a otras (*inyección de dependencias*). No gritas al chef desde el lobby: el hotel ya te asignó uno.

No hace falta conocer Express ni Spring para empezar. Lee NestLayer así: “el HTTP entra aquí, el trabajo pasa allá, los datos se guardan más allá”.

```ts
// Un controller mínimo: "cuando alguien hace GET /, responde con un string"
@Get()
getHello(): string {
  return this.appService.getHello();
}
```

---

## 3. Getting Started

### 🇬🇧 English

This is the “how do I turn the hotel lights on?” chapter. Follow the steps in order. If one fails, fix it before the next — each step needs the previous one, like putting on socks before shoes.

#### 1. Prerequisites — tools on your computer

Install these **before** you download the project:

- **Node.js 18 or higher.** Node is the program that *runs* JavaScript/TypeScript on your computer, not in a browser — like an engine that can run the hotel’s staff software.
- **npm.** It comes with Node. npm is a **delivery truck** for libraries: it downloads packages other people wrote (Nest, Prisma, bcrypt) so you do not write everything from scratch.
- **PostgreSQL 14 or higher.** PostgreSQL is a **filing cabinet** for structured data (users, emails). The API talks to it; it is not the same as the Nest server.
- **Git.** Git is a **time machine for files**: it copies projects from the internet and remembers every change.

Check versions in a terminal:

```bash
node -v
npm -v
psql --version
git --version
```

#### 2. Clone the repository

**Cloning** means “download a full copy of this project, including its history.” You get the same folders the author has.

```bash
git clone https://github.com/cedriccreed/nestlayer.git
cd nestlayer
```

`cd nestlayer` means “walk into that folder.” All later commands assume you are standing there.

#### 3. Install dependencies

`npm install` reads `package.json` (the shopping list) and fills a folder called **`node_modules`**. Think of `node_modules` as a **shared pantry**: flour, yeast, spices you did not grow yourself. You do not edit it by hand. You do not commit it to Git — everyone runs `npm install` on their machine.

```bash
npm install
```

Wait until it finishes without a red error.

#### 4. Set up environment variables

A **`.env` file** is a small config sheet with **secrets**: database password, JWT seals. The code looks up names like `DATABASE_URL` instead of hard-coding your password (which would leak if you published the code).

Copy the example file into a real `.env` (the example is safe to share; `.env` is yours):

```bash
cp .env.example .env
```

On Windows PowerShell you can use `copy .env.example .env` if `cp` is not available.

Open `.env` in your editor:

- **`DATABASE_URL`** — put *your* PostgreSQL user and password. Shape: `postgresql://USER:PASSWORD@localhost:5432/nestlayer`
- **`JWT_SECRET`** and **`JWT_REFRESH_SECRET`** — for local play they can be **any long random strings** (two *different* ones). In production, generate strong unique secrets.

Do not commit `.env` to GitHub.

#### 5. Create the database

A **database** is the filing cabinet we mentioned: empty rooms (tables) waiting for rows of users.

Create a database named **`nestlayer`** in PostgreSQL:

- In **pgAdmin**: right-click Databases → Create → Database → name `nestlayer`.
- Or in **psql**:

```bash
psql -U postgres -c "CREATE DATABASE nestlayer;"
```

The name `nestlayer` must match the last part of `DATABASE_URL`.

If you have Docker installed, you can skip creating the database manually and run:

```bash
docker-compose up -d
```

**Docker** runs PostgreSQL in an isolated box without installing it on your computer. Put `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` in `.env` (same values as in `DATABASE_URL`). `-d` keeps the box running in the background.

#### 6. Run migrations

A **migration** is a **saved blueprint**: “build a `User` table, add a `Role` enum.” Prisma keeps those blueprints in `prisma/migrations/`. Running migrate is like handing the blueprints to a builder so PostgreSQL actually constructs the rooms.

```bash
npx prisma migrate dev
```

`npx` means “run a tool from this project” (Prisma) without installing it globally. The first time it may ask for a name; that is OK. When it succeeds, the `User` table exists.

#### 7. Start the server (watch mode)

```bash
npm run start:dev
```

**Watch mode** means Nest **keeps looking at your files**. Save a `.ts` file and it recompiles and restarts — like a hotel that rebuilds the lobby every time you move a chair, so you do not reboot by hand.

You should see something like `Nest application successfully started`. Leave this terminal open.

#### 8. Open Swagger

In your browser go to:

**http://localhost:3000/docs**

`localhost` means “this computer.” `3000` is the default `PORT`. `/docs` is the map of the hotel.

You will see grouped endpoints (for example **Auth**: register, login, logout, refresh). You can try **POST /auth/register** from the page. The **Authorize** button is for pasting a JWT (the access token) so locked doors can be tested without another app.

If the page does not load, check that step 7 is still running and that nothing else is using port 3000.

### 🇪🇸 Español

Este es el capítulo “¿cómo prendo las luces del hotel?”. Sigue los pasos en orden. Si uno falla, arréglalo antes del siguiente: cada paso necesita el anterior, como los calcetines antes de los zapatos.

#### 1. Requisitos — herramientas en tu computador

Instálalas **antes** de bajar el proyecto:

- **Node.js 18 o superior.** Node es el programa que *ejecuta* JavaScript/TypeScript en tu computador, no en el navegador: el motor que corre el software del personal del hotel.
- **npm.** Viene con Node. npm es un **camión de delivery** de librerías: baja paquetes que escribió otra gente (Nest, Prisma, bcrypt) para que no construyas todo desde cero.
- **PostgreSQL 14 o superior.** PostgreSQL es un **archivador** de datos estructurados (usuarios, emails). La API le habla; no es lo mismo que el servidor Nest.
- **Git.** Git es una **máquina del tiempo para archivos**: copia proyectos de internet y recuerda cada cambio.

Revisa versiones en una terminal:

```bash
node -v
npm -v
psql --version
git --version
```

#### 2. Clonar el repositorio

**Clonar** significa “descargar una copia completa de este proyecto, con su historia”. Quedas con las mismas carpetas que el autor.

```bash
git clone https://github.com/cedriccreed/nestlayer.git
cd nestlayer
```

`cd nestlayer` significa “entra a esa carpeta”. Los comandos siguientes asumen que estás parado ahí.

#### 3. Instalar dependencias

`npm install` lee `package.json` (la lista de compras) y llena una carpeta llamada **`node_modules`**. Piensa en `node_modules` como una **despensa compartida**: harina, levadura, especias que tú no cultivaste. No la edites a mano. No la subas a Git: cada persona corre `npm install` en su máquina.

```bash
npm install
```

Espera a que termine sin un error en rojo.

#### 4. Configurar variables de entorno

Un archivo **`.env`** es una hojita de config con **secretos**: password de la base, lacres JWT. El código busca nombres como `DATABASE_URL` en vez de pegar tu password en el código (se filtraría al publicar).

Copia el archivo de ejemplo a un `.env` de verdad (el ejemplo se puede compartir; el `.env` es tuyo):

```bash
cp .env.example .env
```

En PowerShell de Windows puedes usar `copy .env.example .env` si no tienes `cp`.

Abre `.env` en el editor:

- **`DATABASE_URL`** — pon *tu* usuario y password de PostgreSQL. Forma: `postgresql://USER:PASSWORD@localhost:5432/nestlayer`
- **`JWT_SECRET`** y **`JWT_REFRESH_SECRET`** — en local pueden ser **cualquier string largo al azar** (dos *distintos*). En producción, genera secretos fuertes y únicos.

No subas `.env` a GitHub.

#### 5. Crear la base de datos

Una **base de datos** es el archivador: habitaciones vacías (tablas) esperando filas de usuarios.

Crea una base llamada **`nestlayer`** en PostgreSQL:

- En **pgAdmin**: clic derecho en Databases → Create → Database → nombre `nestlayer`.
- O en **psql**:

```bash
psql -U postgres -c "CREATE DATABASE nestlayer;"
```

El nombre `nestlayer` debe coincidir con la última parte de `DATABASE_URL`.

Si tienes Docker instalado, puedes saltarte crear la base a mano y correr:

```bash
docker-compose up -d
```

**Docker** ejecuta PostgreSQL en una caja aislada, sin instalarlo en tu computador. Pon `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` en `.env` (los mismos valores que en `DATABASE_URL`). `-d` deja la caja corriendo en segundo plano.

#### 6. Correr migraciones

Una **migración** es un **plano guardado**: “construye la tabla `User`, agrega el enum `Role`.” Prisma guarda esos planos en `prisma/migrations/`. Correr migrate es como entregar los planos a un constructor para que PostgreSQL arme las habitaciones de verdad.

```bash
npx prisma migrate dev
```

`npx` significa “ejecuta una herramienta de este proyecto” (Prisma) sin instalarla global. La primera vez puede pedir un nombre; está bien. Cuando termina bien, la tabla `User` existe.

#### 7. Arrancar el servidor (watch mode)

```bash
npm run start:dev
```

**Watch mode** significa que Nest **sigue mirando tus archivos**. Guardas un `.ts` y recompila y reinicia: como un hotel que reconstruye el lobby cada vez que mueves una silla, sin que tú reinicies a mano.

Deberías ver algo como `Nest application successfully started`. Deja esa terminal abierta.

#### 8. Abrir Swagger

En el navegador entra a:

**http://localhost:3000/docs**

`localhost` significa “este computador”. `3000` es el `PORT` por defecto. `/docs` es el mapa del hotel.

Verás endpoints agrupados (por ejemplo **Auth**: register, login, logout, refresh). Puedes probar **POST /auth/register** desde la página. El botón **Authorize** sirve para pegar un JWT (el access token) y probar puertas con chapa sin otra app.

Si la página no carga, revisa que el paso 7 siga corriendo y que nada más use el puerto 3000.

---

## 4. Folder Structure

### 🇬🇧 English

When you open the project, treat folders like labeled drawers. You should guess what is inside from the name.

```text
nestlayer/
├── prisma/                 Database "blueprint" and history of changes
│   ├── schema.prisma       What tables look like (User, Role)
│   └── migrations/         Saved SQL steps already applied
├── prisma.config.ts        Tells Prisma 7 how to find DATABASE_URL
├── src/                    All application code
│   ├── main.ts             The light switch: starts the server
│   ├── app.module.ts       The table of contents of the whole app
│   ├── app.controller.ts   Public GET /  ("is the server alive?")
│   ├── app.service.ts      The tiny function behind GET /
│   ├── auth/               Login, register, tokens
│   ├── users/              "Find this person by email or id"
│   ├── prisma/             Connection to PostgreSQL
│   └── common/             Tools shared by every department
├── test/                   Tests that pretend to be a real client
├── .env                    Secrets on YOUR machine only
└── ARCHITECTURE.md         This guide
```

**Plain-language map**

| You open… | It means… |
| --- | --- |
| `src/main.ts` | “Turn the hotel on”: pipes, error net, Swagger, listen on a port. |
| `src/app.module.ts` | “Who works here”: Config, Prisma, Users, Auth. |
| `src/auth/` | Everything about proving who you are. |
| `src/users/` | Looking up a user row. Auth *uses* this; it does not duplicate it. |
| `src/prisma/` | The one phone line to the database. |
| `src/common/` | Stickers, security rules, and the error safety net used everywhere. |
| `prisma/schema.prisma` | The drawing of tables. No passwords here (Prisma 7 keeps the URL elsewhere). |
| `.env` | The paper in the manager’s safe: URLs and secrets. Never put this on GitHub. |

Inside `auth/` you will see `dto/` (forms), `guards/` (door checks), `strategies/` (how to read a JWT). Inside `common/` you will see `decorators/`, `guards/`, `filters/`.

### 🇪🇸 Español

Cuando abras el proyecto, trata las carpetas como cajones con etiqueta. Deberías adivinar el contenido por el nombre.

```text
nestlayer/
├── prisma/                 "Plano" de la base y historial de cambios
│   ├── schema.prisma       Cómo se ven las tablas (User, Role)
│   └── migrations/         Pasos SQL ya aplicados
├── prisma.config.ts        Le dice a Prisma 7 dónde está DATABASE_URL
├── src/                    Todo el código de la aplicación
│   ├── main.ts             El interruptor: enciende el servidor
│   ├── app.module.ts       El índice de toda la app
│   ├── app.controller.ts   GET / público ("¿el servidor vive?")
│   ├── app.service.ts      La función chica detrás de GET /
│   ├── auth/               Login, registro, tokens
│   ├── users/              "Busca a esta persona por email o id"
│   ├── prisma/             Conexión a PostgreSQL
│   └── common/             Herramientas de todos los departamentos
├── test/                   Tests que fingen ser un cliente real
├── .env                    Secretos solo en TU máquina
└── ARCHITECTURE.md         Esta guía
```

**Mapa en lenguaje simple**

| Abres… | Significa… |
| --- | --- |
| `src/main.ts` | “Prende el hotel”: pipes, red de errores, Swagger, puerto. |
| `src/app.module.ts` | “Quién trabaja aquí”: Config, Prisma, Users, Auth. |
| `src/auth/` | Todo lo de demostrar quién eres. |
| `src/users/` | Buscar una fila de usuario. Auth *usa* esto; no lo duplica. |
| `src/prisma/` | La única línea telefónica a la base. |
| `src/common/` | Stickers, reglas de seguridad y la red de errores de todos. |
| `prisma/schema.prisma` | El dibujo de las tablas. Sin contraseñas (Prisma 7 guarda la URL en otro lado). |
| `.env` | El papel en la caja fuerte: URLs y secretos. Nunca en GitHub. |

Dentro de `auth/` verás `dto/` (formularios), `guards/` (revisión en la puerta), `strategies/` (cómo leer un JWT). Dentro de `common/`: `decorators/`, `guards/`, `filters/`.

---

## 5. The Layers of a Backend

### 🇬🇧 English

A **layer** is a job with a clear boundary. If you mix jobs, the hotel becomes chaos: the receptionist cooking, the chef checking IDs.

#### Controllers — the receptionist

They greet HTTP: “POST `/auth/login` arrived.” They do **not** hash passwords. They take the body, hand it to a service, and return whatever the service says.

```ts
@Post('login')
login(@Body() dto: LoginDto): Promise<AuthTokens> {
  return this.authService.login(dto); // receptionist delegates to the expert
}
```

#### Services — the expert who does the work

This is where “business logic” lives: *if the password is wrong, refuse; if it is right, give tokens.* `AuthService` and `UsersService` are the experts.

#### Prisma — the translator

Your code speaks TypeScript (`prisma.user.create(...)`). PostgreSQL speaks SQL. **Prisma** is the interpreter. You describe tables in `schema.prisma`; Prisma generates a client. In Prisma 7, a **driver adapter** (`PrismaPg` + `pg`) is the actual phone cable to Postgres.

#### Guards — the security guard at the door

Before the receptionist works, a guard can say “no badge, no entry.” `JwtAuthGuard` checks an access token. `RolesGuard` checks *role* (USER vs ADMIN). Authentication = who you are. Authorization = what you are allowed to do.

#### Decorators — sticky notes on functions

In TypeScript, a decorator looks like `@Something()`. It is a sticker: “this method is a POST” or “only ADMIN.” `@Roles(Role.ADMIN)` does not block anyone by itself; it is a note. `RolesGuard` reads the note.

`@CurrentUser()` is a sticker on a **parameter**: “fill this argument with the person Passport already identified.”

#### Filters — the safety net

If something throws (`UnauthorizedException`), a **filter** catches it before a raw crash reaches the user. `GlobalExceptionFilter` always returns the same JSON: status, message, error name, time, URL. Like a hotel that never shows guests the messy kitchen — only a polite, standard apology card.

#### DTOs — the form that validates data

**DTO** = Data Transfer Object = the paper form. “Email must look like an email. Password at least 8 characters.” `class-validator` stamps the form. `ValidationPipe` rejects junk **before** the expert works. `@ApiProperty()` also fills Swagger so humans see the form in `/docs`.

```ts
export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
```

### 🇪🇸 Español

Una **capa** es un trabajo con un límite claro. Si mezclas oficios, el hotel se vuelve un caos: recepción cocinando, el chef revisando carnets.

#### Controllers — la recepcionista

Reciben el HTTP: “llegó un POST `/auth/login`”. **No** hashean contraseñas. Toman el body, se lo pasan a un service y devuelven lo que el service diga.

```ts
@Post('login')
login(@Body() dto: LoginDto): Promise<AuthTokens> {
  return this.authService.login(dto); // recepción delega en la experta
}
```

#### Services — la experta que hace el trabajo

Aquí vive la “lógica de negocio”: *si la password está mal, rechaza; si está bien, entrega tokens.* `AuthService` y `UsersService` son las expertas.

#### Prisma — la traductora

Tu código habla TypeScript (`prisma.user.create(...)`). PostgreSQL habla SQL. **Prisma** es la intérprete. Describes tablas en `schema.prisma`; Prisma genera un cliente. En Prisma 7, un **driver adapter** (`PrismaPg` + `pg`) es el cable de teléfono hacia Postgres.

#### Guards — el guardia de seguridad en la puerta

Antes de que trabaje recepción, un guardia puede decir “sin credencial, no pasas”. `JwtAuthGuard` revisa el token de access. `RolesGuard` revisa el *rol* (USER vs ADMIN). Autenticación = quién eres. Autorización = qué se te permite.

#### Decorators — notas adhesivas en las funciones

En TypeScript un decorador se ve `@Something()`. Es un sticker: “este método es POST” o “solo ADMIN”. `@Roles(Role.ADMIN)` no bloquea a nadie solo; es una nota. `RolesGuard` lee la nota.

`@CurrentUser()` es un sticker en un **parámetro**: “llena este argumento con la persona que Passport ya identificó”.

#### Filters — la red de seguridad

Si algo lanza un error (`UnauthorizedException`), un **filtro** lo atrapa antes de que un crash crudo llegue al usuario. `GlobalExceptionFilter` siempre devuelve el mismo JSON: status, mensaje, nombre del error, hora, URL. Como un hotel que nunca muestra la cocina sucia: solo una tarjeta de disculpa estándar.

#### DTOs — el formulario que valida los datos

**DTO** = Data Transfer Object = el formulario de papel. “El email debe parecer un email. La password, al menos 8 caracteres.” `class-validator` sella el formulario. `ValidationPipe` rechaza basura **antes** de que trabaje la experta. `@ApiProperty()` además llena Swagger para que en `/docs` se vea el formulario.

```ts
export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
```

---

## 6. Authentication Flow

### 🇬🇧 English

Imagine **Ada** wants to use NestLayer, like checking into a hotel that uses keycards.

#### Chapter 1 — Register (`POST /auth/register`)

Ada fills a form: email, password, name. The receptionist (controller) will not even walk to the back if the form is invalid (pipe + DTO).

In the office (service), someone checks: is this email already a guest? If yes, “sorry, taken.” If no, they **do not write her password in the guestbook**. They run it through bcrypt (a blender that only goes one way) and store the mush. Ada gets back her profile **without** the password. She is a `USER`, not an admin, unless a human later promotes her.

#### Chapter 2 — Login (`POST /auth/login`)

Ada comes back with email and password. The expert loads her row. If the email is unknown **or** the blender-mush does not match, she hears the **same** “Invalid credentials.” That way a stranger cannot fish for which emails exist.

If it matches, the hotel prints two keycards:

1. **Access token** — short visit pass (default 15 minutes).
2. **Refresh token** — longer pass (default 7 days) to get a *new* visit pass.

The long pass is **photocopied through bcrypt** and the photocopy is locked in the safe (`User.refreshToken`). Ada receives both cards in JSON. She should keep them on her phone, not on a billboard.

#### Chapter 3 — A protected endpoint (`POST /auth/logout`, or any route with `JwtAuthGuard`)

Ada knocks on a private door with:

`Authorization: Bearer <access token>`

The security guard (JWT strategy) looks at the holographic stamp (`JWT_SECRET`). If the stamp is fake or expired, the door stays closed (`401`). If it is good, Passport pins a badge on her (`req.user` with her `id` and email). The receptionist can now say “this is Ada” without seeing her password.

Logout throws away the photocopy in the safe (`refreshToken = null`). Even if Ada still holds the old long keycard, the hotel will not honor it after that.

#### Chapter 4 — Refresh (`POST /auth/refresh`)

The short pass expired. Ada shows the **long** keycard. A *different* stamp is checked (`JWT_REFRESH_SECRET`). Then the hotel compares the card to the photocopy in the safe. Match? Print **new** pair and replace the photocopy (**rotation**). An old stolen long card stops working.

### 🇪🇸 Español

Imagina que **Ada** quiere usar NestLayer, como registrarse en un hotel que usa tarjetas-llave.

#### Capítulo 1 — Register (`POST /auth/register`)

Ada llena un formulario: email, password, nombre. La recepción (controller) ni siquiera camina al fondo si el formulario es inválido (pipe + DTO).

En la oficina (service) alguien revisa: ¿este email ya es huésped? Si sí, “lo siento, ocupado”. Si no, **no escriben su password en el libro**. La pasan por bcrypt (una licuadora que solo va en un sentido) y guardan el puré. Ada recibe su perfil **sin** la password. Es `USER`, no admin, salvo que un humano la ascienda después.

#### Capítulo 2 — Login (`POST /auth/login`)

Ada vuelve con email y password. La experta carga su fila. Si el email no existe **o** el puré no coincide, oye el **mismo** “Invalid credentials”. Así un extraño no pesca qué emails hay.

Si coincide, el hotel imprime dos tarjetas:

1. **Access token** — pase corto (por defecto 15 minutos).
2. **Refresh token** — pase largo (por defecto 7 días) para pedir un *nuevo* pase corto.

El pase largo se **fotocopia con bcrypt** y la fotocopia va a la caja fuerte (`User.refreshToken`). Ada recibe ambas tarjetas en JSON. Debe guardarlas en el teléfono, no en una valla.

#### Capítulo 3 — Un endpoint protegido (`POST /auth/logout`, o cualquier ruta con `JwtAuthGuard`)

Ada toca una puerta privada con:

`Authorization: Bearer <access token>`

El guardia (strategy JWT) mira el holograma (`JWT_SECRET`). Si es falso o está vencido, la puerta no abre (`401`). Si está bien, Passport le pone una credencial (`req.user` con su `id` y email). Recepción puede decir “es Ada” sin ver su password.

Logout tira la fotocopia de la caja (`refreshToken = null`). Aunque Ada aún tenga la tarjeta larga, el hotel ya no la honra.

#### Capítulo 4 — Refresh (`POST /auth/refresh`)

El pase corto venció. Ada muestra la tarjeta **larga**. Se revisa *otro* holograma (`JWT_REFRESH_SECRET`). Luego comparan la tarjeta con la fotocopia. ¿Coincide? Imprimen un **par nuevo** y reemplazan la fotocopia (**rotación**). Una tarjeta larga vieja robada deja de servir.

---

## 7. What is JWT and why access + refresh tokens

### 🇬🇧 English

**JWT** means JSON Web Token. It is a **signed** piece of text, not a password stored on the server for every click. Three parts, like a stamped letter: header, body (who you are, when it expires), signature (the wax seal).

Anyone can *read* the body (do not put secrets inside). Only someone with `JWT_SECRET` can *forge* a valid seal. The server verifies the seal on each request. That is **stateless** access: no “session drawer” for every click, just check the letter.

**Analogy: a museum day pass + a membership card.**

- The **access token** is a **day sticker** on your shirt. Staff glance at it. If someone photographs it, it is only useful until closing time (15 minutes here). Short life = less damage.
- The **refresh token** is your **membership card** kept in your wallet. You show it at a special desk to get a *new* sticker. It lasts longer, so we treat it more carefully: different secret, stored **hashed** in the database, replaced on each use, deleted on logout.

Why two cards? If we only had one long-lived token, stealing it would be like stealing a house key that never changes. If we only had a 15-minute token, Ada would type her password every quarter hour. Two tokens = convenience + a way to **revoke** (throw away the membership photocopy).

```text
Browser                    NestLayer
   |  POST /login             |
   | -----------------------> |
   |  access + refresh        |
   | <----------------------- |
   |  GET /private            |
   |  Bearer access           |
   | -----------------------> |
   |  200 or 401              |
   | <----------------------- |
   |  POST /refresh           |
   |  Bearer refresh          |
   | -----------------------> |
   |  new access + refresh    |
   | <----------------------- |
```

### 🇪🇸 Español

**JWT** significa JSON Web Token. Es un texto **firmado**, no una password guardada en el servidor para cada clic. Tres partes, como una carta lacrada: encabezado, cuerpo (quién eres, cuándo vence), firma (el sello de lacre).

Cualquiera puede *leer* el cuerpo (no pongas secretos ahí). Solo quien tiene `JWT_SECRET` puede *falsificar* un sello válido. El servidor verifica el sello en cada request. Eso es acceso **sin sesión en cajón**: no hay ficha por cada clic, solo se revisa la carta.

**Analogía: pase de un día en un museo + credencial de socio.**

- El **access token** es un **sticker de un día** en la polera. El personal lo mira de reojo. Si alguien lo fotografía, solo sirve hasta el cierre (aquí 15 minutos). Vida corta = menos daño.
- El **refresh token** es tu **credencial de socio** en la billetera. La muestras en un escritorio especial para un *sticker nuevo*. Dura más, así que la cuidamos más: otro secret, **hasheada** en la base, reemplazada en cada uso, borrada al logout.

¿Por qué dos tarjetas? Si solo hubiera un token eterno, robarlo sería como la llave de una casa que nunca cambia. Si solo hubiera un token de 15 minutos, Ada escribiría su password cada cuarto de hora. Dos tokens = comodidad + forma de **revocar** (tirar la fotocopia de socio).

```text
Navegador                  NestLayer
   |  POST /login             |
   | -----------------------> |
   |  access + refresh        |
   | <----------------------- |
   |  GET /private            |
   |  Bearer access           |
   | -----------------------> |
   |  200 o 401               |
   | <----------------------- |
   |  POST /refresh           |
   |  Bearer refresh          |
   | -----------------------> |
   |  nuevo access + refresh  |
   | <----------------------- |
```

---

## 8. What is bcrypt and why we never save plain passwords

### 🇬🇧 English

A **plain password** is what Ada types: `Str0ngPass!`. If we save that in the database and a thief copies the table, they can log in as Ada on this site *and* anywhere she reused the password.

**Hashing** is a one-way blender. `bcrypt` turns the password into a long string that cannot be “un-blended.” Login does not decrypt. It blends the attempt and **compares** to the stored mush.

**bcrypt** is slow on purpose (NestLayer uses **10 rounds**). Slow is good: a thief guessing millions of passwords waits. Fast hashes (old MD5) are like a blender that finishes in a millisecond — great for attackers.

We also hash **refresh tokens** in the database. Same idea: a stolen backup should not be a stack of ready-to-use membership cards.

Never log passwords. Never return them in JSON. `AuthService` strips `password` before answering register.

### 🇪🇸 Español

Una **password en claro** es lo que Ada escribe: `Str0ngPass!`. Si la guardamos en la base y un ladrón copia la tabla, entra como Ada en este sitio *y* donde haya repetido la clave.

**Hashear** es una licuadora de un solo sentido. `bcrypt` convierte la password en un string largo que no se puede “deslicuar”. El login no descifra. Licúa el intento y **compara** con el puré guardado.

**bcrypt** es lento a propósito (NestLayer usa **10 rounds**). Lento es bueno: un ladrón que prueba millones de claves espera. Los hashes rápidos (MD5 antiguo) son una licuadora de un milisegundo — perfectos para el atacante.

También hasheamos **refresh tokens** en la base. Misma idea: un backup robado no debe ser un fajo de credenciales listas para usar.

Nunca registres passwords en logs. Nunca las devuelvas en JSON. `AuthService` quita `password` antes de responder el register.

---

## 9. Environment Variables

### 🇬🇧 English

An **environment variable** is a named value **outside** the source code: `PORT=3000`. Why? Because the same code should run on your laptop and on a server without rewriting secrets. The laptop uses a local Postgres; production uses another. Code goes to GitHub; **secrets do not**.

They live in `.env` on your machine. `ConfigModule` + **Joi** read them when the app starts. If `JWT_SECRET` is missing, the process **dies immediately**. That is kinder than crashing on the first login at 3 a.m.

| Name | Must have? | Default | In one sentence |
| --- | --- | --- | --- |
| `PORT` | no | `3000` | Which door number the hotel listens on. |
| `NODE_ENV` | no | `development` | Are we rehearsing, on stage, or in tests? (`development` \| `production` \| `test`) |
| `DATABASE_URL` | **yes** | — | Address + password of PostgreSQL (Prisma CLI and the `pg` adapter). |
| `JWT_SECRET` | **yes** | — | Wax seal for **short** keycards. |
| `JWT_EXPIRES_IN` | no | `15m` | How long a short keycard lasts. |
| `JWT_REFRESH_SECRET` | **yes** | — | Wax seal for **membership** cards (different from access). |
| `JWT_REFRESH_EXPIRES_IN` | no | `7d` | How long a membership card lasts. |

If a secret leaks, change it (rotate) like changing locks after lost keys.

### 🇪🇸 Español

Una **variable de entorno** es un valor con nombre **fuera** del código: `PORT=3000`. ¿Por qué? El mismo código debe correr en tu laptop y en un servidor sin reescribir secretos. En la laptop hay un Postgres local; en producción, otro. El código va a GitHub; **los secretos no**.

Viven en `.env` en tu máquina. `ConfigModule` + **Joi** las leen al arrancar. Si falta `JWT_SECRET`, el proceso **muere al tiro**. Es más amable que caerse en el primer login a las 3 a.m.

| Nombre | ¿Obligatoria? | Default | En una frase |
| --- | --- | --- | --- |
| `PORT` | no | `3000` | Número de puerta donde escucha el hotel. |
| `NODE_ENV` | no | `development` | ¿Ensayo, escenario o tests? (`development` \| `production` \| `test`) |
| `DATABASE_URL` | **sí** | — | Dirección + clave de PostgreSQL (CLI de Prisma y el adapter `pg`). |
| `JWT_SECRET` | **sí** | — | Lacre de las tarjetas **cortas**. |
| `JWT_EXPIRES_IN` | no | `15m` | Cuánto dura una tarjeta corta. |
| `JWT_REFRESH_SECRET` | **sí** | — | Lacre de las tarjetas de **socio** (distinto al de access). |
| `JWT_REFRESH_EXPIRES_IN` | no | `7d` | Cuánto dura la de socio. |

Si un secreto se filtra, cámbialo (rotar) como cambiar chapas tras perder las llaves.

---

## 10. Design Decisions

### 🇬🇧 English

These choices are not “because Nest said so.” They are answers to real accidents.

**UUID instead of 1, 2, 3.** If ids are `1`, `2`, `3`, anyone can try `/users/4`. A UUID looks like random noise. You also do not advertise “we have exactly 10,403 users.”

**Default role `USER`.** Sign-up must not create an ADMIN by accident. Promoting someone is a separate, careful act.

**Global Prisma module.** One translator, one pool of database connections. Fifty PrismaClients would be fifty phone lines left off the hook.

**Prisma 7 adapter.** New Prisma does not hide a magic engine that reads the URL from the schema. We plug in `pg` on purpose so Node talks to Postgres in a normal way.

**Two JWT secrets.** If the short-card seal is copied, the thief still cannot print membership cards.

**Hashed refresh + logout nulls it.** That is how you “kick someone out” without waiting seven days.

**bcrypt 10 rounds.** A compromise: slow for attackers, acceptable for one login.

**ValidationPipe whitelist.** Extra JSON fields are stripped. That blocks sneaky `role: "ADMIN"` in a register body.

**Joi at boot.** Fail in one second, not after deploy when traffic starts.

**Global error filter.** Mobile apps can always read `message`. No guessing whether Nest sent a string or an object.

**Swagger `/docs`.** A map of the hotel with a “try it” button and a place to paste a Bearer token.

**Comments in the code.** NestLayer is a classroom that still compiles.

### 🇪🇸 Español

Estas elecciones no son “porque Nest lo dijo”. Son respuestas a accidentes reales.

**UUID en vez de 1, 2, 3.** Si los ids son `1`, `2`, `3`, cualquiera prueba `/users/4`. Un UUID parece ruido al azar. Tampoco anunciamos “tenemos exactamente 10.403 usuarios”.

**Rol por defecto `USER`.** El registro no debe crear un ADMIN por accidente. Ascender a alguien es un acto aparte y cuidadoso.

**Módulo Prisma global.** Un traductor, un pool de conexiones. Cincuenta PrismaClients serían cincuenta teléfonos descolgados.

**Adapter de Prisma 7.** El Prisma nuevo no esconde un motor mágico que lee la URL del schema. Enchufamos `pg` a propósito para que Node hable con Postgres de forma normal.

**Dos secrets JWT.** Si copian el lacre de la tarjeta corta, el ladrón aún no imprime credenciales de socio.

**Refresh hasheado + logout lo anula.** Así “echas a alguien” sin esperar siete días.

**bcrypt 10 rounds.** Un equilibrio: lento para atacantes, aceptable para un login.

**ValidationPipe whitelist.** Se cortan campos JSON de más. Eso bloquea un `role: "ADMIN"` colado en el register.

**Joi al arranque.** Fallar en un segundo, no después del deploy cuando llega tráfico.

**Filtro de errores global.** Las apps móviles siempre leen `message`. Sin adivinar si Nest mandó un string o un objeto.

**Swagger `/docs`.** Un mapa del hotel con botón de “probar” y un lugar para pegar el Bearer.

**Comentarios en el código.** NestLayer es un aula que igual compila.

---

## 11. Author

### 🇬🇧 English

NestLayer was created by **cedriccreed**, a Full Stack developer from Chile.

It was built so developers **at every level** — first API or tenth production service — can see a **real-world backend shape**: layers, security that you can explain to a friend, and comments that answer *why*. Fork it, break it, add a module. The architecture is meant to stay readable while it grows.

### 🇪🇸 Español

NestLayer lo creó **cedriccreed**, desarrollador Full Stack de Chile.

Está hecho para que developers **de todos los niveles** —primera API o décimo servicio en producción— vean una **forma de backend del mundo real**: capas, seguridad que puedes explicarle a un amigo, y comentarios que responden *por qué*. Haz fork, rómpelo, agrega un módulo. La arquitectura debe seguir siendo legible mientras crece.
