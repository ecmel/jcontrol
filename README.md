# Refable Light

Lighter version of [Refable](https://github.com/ecmel/refable)

## Installation

```bash
npm install refable-light --save-dev
```

## Application

Application is the main class for bootstrapping. Controllers are registered on an application instance. For registering glob of controllers please refer to your bundler's documentation.

```ts
import { Application } from "jcontrol";
import Search from "./controllers/search";

const application = new Application();

application.register("search", Search);

application.run();
```

## Controllers

Controllers are instances of classes that you register in your application. Each controller class inherits from the Controller base class.

```html
<div data-controller="search"></div>
```

```ts
import { Controller } from "jcontrol";

export default class extends Controller {
  created() {
    //
  }

  connected() {
    //
  }

  disconnected() {
    //
  }
}
```

Controller classes are templated so more specific elements can be used if needed.

```ts
import { Controller } from "jcontrol";

export default class extends Controller<HTMLElement> {
  //
}
```
