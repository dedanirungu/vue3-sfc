// astexplorer: https://astexplorer.net/
// babel-core doc: https://babeljs.io/docs/en/babel-core


import * as SparkMD5 from 'spark-md5'


import { createSFCModule } from './createVue3SFCModule'


/**
 * @internal
 */
const genSourcemap = !!process.env.GEN_SOURCEMAP;

const version = process.env.VERSION;


// tools
/**
 * @internal
 */
export function formatError(message, path, source) {
	return path + '\n' + message;
}


/**
 * @internal
 */
export function formatErrorLineColumn(message, path, source, line, column) {
	if (!line) {
		return formatError(message, path, source)
	}

	const location = {
		start: { line, column },
	};

	return formatError(message, path, source)
}

/**
 * @internal
 */
export function formatErrorStartEnd(message, path, source, start, end) {
	if (!start) {
		return formatError(message, path, source)
	}

	const location = {
		start: { line: 1, column: start }
	};
	if (end) {
		location.end = { line: 1, column: end }
	}

	return formatError(message, path, source)
}


/**
 * @internal
 */
export function hash(...valueList) {

	return valueList.reduce((hashInstance, val) => hashInstance.append(String(val)), new SparkMD5()).end().slice(0, 8);
}



/**
 * Simple cache helper
 * preventCache usage: non-fatal error
 * @internal
 */
export async function withCache(cacheInstance, key, valueFactory) {

	let cachePrevented = false;

	const api = {
		preventCache: () => cachePrevented = true,
	}

	if (!cacheInstance)
		return await valueFactory(api);

	const hashedKey = hash(...key);
	const valueStr = await cacheInstance.get(hashedKey);
	if (valueStr)
		return JSON.parse(valueStr);

	const value = await valueFactory(api);

	if (!cachePrevented)
		await cacheInstance.set(hashedKey, JSON.stringify(value));

	return value;
}

/**
 * @internal
 */
export class Loading {

	promise;

	constructor(promise) {

		this.promise = promise;
	}
}




// @ts-ignore
//const targetBrowserBabelPlugins = { ...(typeof ___targetBrowserBabelPlugins !== 'undefined' ? ___targetBrowserBabelPlugins : {}) };


/**
 * @internal
 */



// module tools


export async function loadModuleInternal(pathCx, options) {

	const { moduleCache, loadModule, handleModule } = options;

	const { id, path, getContent } = options.getResource(pathCx, options);

	if (id in moduleCache) {

		if (moduleCache[id] instanceof Loading)
			return await (moduleCache[id] ).promise;
		else
			return moduleCache[id];
	}


	moduleCache[id] = new Loading((async () => {

		if (loadModule) {

			const module = await loadModule(id, options);
			if (module !== undefined)
				return moduleCache[id] = module;
		}

		const { getContentData, type } = await getContent();

		// note: null module is accepted
		let module = undefined;

		if (handleModule !== undefined)
			module = await handleModule(type, getContentData, path, options);

		if (module === undefined)
			module = await defaultHandleModule(type, getContentData, path, options);

		if (module === undefined)
			throw new TypeError(`Unable to handle ${type} files (${path})`);

		return moduleCache[id] = module;

	})());

	return await (moduleCache[id]).promise;
}









/**
 * Default implementation of handleModule
 */
async function defaultHandleModule(type, getContentData, path, options) {

	switch (type) {
		case 'vue':
		case '.vue': return createSFCModule((await getContentData(false)), path, options);
		//case '.js': return createJSModule((await getContentData(false)) as string, false, path, options);
		//case '.mjs': return createJSModule((await getContentData(false)) as string, true, path, options);
	}

	return undefined;
}
