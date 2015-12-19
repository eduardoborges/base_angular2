# Base para projetos em Angular2

Esse código base foi utilizado no Hands-on de Angular2 organizado pelo GDG Aracaju.

Para começar a utilizar o código, baixe o .zip (ou clone o repositório) e rode os seguintes comandos:

```{shell}
npm install
bower install
gulp libs
gulp typing
gulp play
```

Para verificar se está funcionando, crie um Componente 'Hello Worl' em `app.ts`

```{typescript}
import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'blog'
  })
@View({
  template: `Hello, World!`
  })
class Blog {}

boostrap(Blog);
```
