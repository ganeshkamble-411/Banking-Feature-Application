import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import '@carbon/web-components/es/components/ui-shell/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/text-input/index.js';
import '@carbon/web-components/es/components/number-input/index.js';
import '@carbon/web-components/es/components/form/index.js';
import '@carbon/web-components/es/components/stack/index.js';


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
