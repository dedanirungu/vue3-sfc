import * as Vue from 'vue';
import {
    loadModule
} from './vue3-sfc-loader';


const options = {
    moduleCache: {
        vue: Vue
    },
    async getFile(url) {
        const res = await fetch(url)
        if (!res.ok)
            throw Object.assign(new Error(`${res.statusText} ${url}`), { res })
        return await res.text();
    },
    addStyle(textContent) {
        const style = Object.assign(document.createElement("style"), { textContent })
        const ref = document.head.getElementsByTagName("style")[0] || null
        document.head.insertBefore(style, ref)
    },
}

const fetchComponent = (comp_path) => {

    console.log(comp_path);
    let path_url = window.assets_url + '/assets/' + comp_path;

    try {
        return Vue.defineAsyncComponent(() => loadModule(path_url, options));
    } catch (error) {
        throw new Error(`Error raised on file ${comp_path}`);
    }

}

const app = Vue.createApp({
    components: {
        //'my-component': Vue.defineAsyncComponent(() => loadModule('https://utupress.github.io/blocks/alert/index.vue', options)),
        'async-component': Vue.defineAsyncComponent(async () => {
            const template = `
            <div class="row m-2">

            <div class="col-8">
                <h2>
                    Welcome Back {{ name }}! 🥳
                </h2>
                <small class="card-subtitle text-no-wrap ps-2">
                    Keep improving the sales.
                </small>
                <div class="card-text d-flex align-center mt-2 pb-2 ps-2">
                    <div>
                        <button class="btn btn-primary" href="#" @click="loadModule('testing')">
                            View Invoices
                        </button>
                    </div>
                </div>
            </div>
    
            <div class="col-4 greeting-card-trophy-wrapper">
                <img height="108px" style="max-width:83px;" class="greeting-card-trophy"
                    :src=" 'images/misc/trophy.png'" />
            </div>
    
        </div>
            `;
            const script = `
            return {
                data(){
                    return {
                        name:'Dedan'
                    }
                },
                methods: {
                    loadModule(path) {
                        alert(path);
                    },
                },
            
            };
            `;

            const style = `
            .card-subtitle{color:red;}
            `;
            // Add the styles to the document's head
            const styleTag = document.createElement('style');
            styleTag.innerText = style;
            document.head.appendChild(styleTag);

            // Create a function from the script string and execute it
            const scriptFunction = new Function(script);
            const componentOptions = scriptFunction();


            return {
                template,
                ...componentOptions, // Spread the component options
                setup() {
                    // Apply the styles using the styles property
                    return {
                        style
                    };
                },
            };
        })
    },
    template: '<div>fsdfsdfsd <my-component></my-component> dddddd <async-component></async-component></div>'
});

app.mount('#app');
