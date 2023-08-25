<template>
  fghfgh
  <component v-for="(c, index) in component" v-bind:key="index" :is="c"></component>
  dfrgdf
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import { defineAsyncComponent } from 'vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  data() {
    return {
      components: [],
    }
  },
  async created() {


    try {
      let templateString, scriptString, styleString = '';
      const componentContent = await this.fetchRemoteComponent(); // Load the remote component

      var doc = document.implementation.createHTMLDocument('');

      // IE requires the <base> to come with <style>
      doc.body.innerHTML = (this.baseURI ? '<base href="' + this.baseURI + '">' : '') + componentContent;
      for (var it = doc.body.firstChild; it; it = it.nextSibling) {
        console.log(it.nodeName);
        switch (it.nodeName) {
          case 'TEMPLATE':
            templateString = it.innerHTML;
            break;
          case 'SCRIPT':
            scriptString = it.textContent;
            break;
          case 'STYLE':
            styleString = it.textContent;
            break;
        }
      }
      console.log(templateString);
      console.log(scriptString);
      console.log(styleString);

      this.components.push({
        template: templateString,
        ...scriptString.default, // Spread script properties
        style: styleString // Use the first style block, adjust as needed
      });

      const MyAComponent = defineAsyncComponent(async () => {
        const template = `
    <div>
      This is my component.
    </div>
  `;
        const script = `
    import { defineComponent } from 'vue';

    export default defineComponent({
      name: 'MyComponent',
      template,
    });
  `;

        return {
          template,
          script,
        };
      });
      this.components.push(MyAComponent);


      const asyncComponent = defineAsyncComponent({
        name: 'asyncComponent',
        loader: () => {
          const template = '<div>{{ message }}</div>';

          return {
            template,
            data() {
              return {
                message: 'Hello from async component!',
              };
            },
          };
        },
      });
      this.components.push(asyncComponent);


      const MyComponent = defineAsyncComponent(async () => {
        const component = {
          name: 'MyComponent',
          template: templateString,
          script: scriptString,
          style: styleString,
        }
        return {
          component,
        };
      });
      this.components.push(MyComponent);

      const dynamicComponent = defineAsyncComponent({
        name: 'dynamicComponent',
        loader: async () => {
          const [template, script, style] = await Promise.all([
            templateString,
            scriptString,
            styleString
          ]);

          const options = {
            template,
            ...eval(`(${script})`), // Evaluate the script string to an object
          };

          if (style) {
            options.styles = [{ content: style, scoped: true }];
          }

          return options;
        },
      });
      this.components.push(dynamicComponent);

      console.log(this.components);

      /*
      const dynamicComponent = {
        template: template || '',
        ...script,
        ...style,
      };*/



      return;
      /**
       * const { template, script, style } = VueLoader.parseComponent(componentContent);

      // Define the dynamic component using parsed content
      const dynamicComponent = {
        template: template.content || '',
        ...script.content,
        ...style.content,
      };

      // Register the dynamic component globally
      const dynamicComponentName = `dynamic-component-${Math.random().toString(36).substr(2, 9)}`;
      this.components.push({
        name: dynamicComponentName,
        component: dynamicComponent
      });
      */

    } catch (error) {
      console.error('Error loading remote component:', error);
    }
  },
  methods: {
    fetchRemoteComponent: async function () {
      const response = await fetch('https://utupress.github.io/blocks/header1/index.vue');
      if (!response.ok) {
        throw new Error(`Failed to fetch remote component: ${response.statusText}`);
      }
      return await response.text();
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
