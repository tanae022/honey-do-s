import { r as __toESM } from "./rolldown-runtime-SbdDWaPq.js";
import { Ct as uint8FromBufLike, Et as hexToBytes, St as uint8Equals, Tt as bytesToHex, _t as AnonymousIdentity, bt as IC_REQUEST_DOMAIN_SEPARATOR, ct as require_react, dt as HttpAgent, ft as ED25519_OID, gt as Endpoint, ht as ed25519, lt as StorageClient, mt as wrapDER, pt as unwrapDER, st as require_jsx_runtime, ut as Actor, vt as SignIdentity, wt as Principal, xt as requestIdOf, yt as IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR } from "./createLucideIcon-CK3986Sn.js";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/object-storage/dist/blob.js
var ExternalBlob = class ExternalBlob {
	_blob;
	directURL;
	contentType;
	filename;
	onProgress = void 0;
	constructor(directURL, blob) {
		if (blob) this._blob = blob;
		this.directURL = directURL;
	}
	static fromURL(url) {
		return new ExternalBlob(url, null);
	}
	static fromBytes(blob, contentType, filename) {
		const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: contentType?.trim() || "application/octet-stream" }));
		const externalBlob = new ExternalBlob(url, blob);
		if (contentType?.trim()) externalBlob.contentType = contentType.trim();
		if (filename?.trim()) externalBlob.filename = filename.trim();
		return externalBlob;
	}
	async getBytes() {
		if (this._blob) return this._blob;
		const blob = await (await fetch(this.directURL)).blob();
		this._blob = new Uint8Array(await blob.arrayBuffer());
		return this._blob;
	}
	getDirectURL() {
		return this.directURL;
	}
	withUploadProgress(onProgress) {
		this.onProgress = onProgress;
		return this;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+core-infrastructure@1.4.1_@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/core-infrastructure/dist/config.js
var DEFAULT_BUCKET_NAME = "default-bucket";
var DEFAULT_PROJECT_ID = "0000000-0000-0000-0000-00000000000";
var configCache = null;
/**
* Synchronous access to the config cached by a previous `loadConfig()` call.
* Needed by code paths that must stay inside a user-activation window (e.g.
* opening the Internet Identity popup from a click handler) and therefore
* cannot await. Returns `null` if `loadConfig()` has not completed yet.
*/
function getCachedConfig() {
	return configCache;
}
async function loadConfig() {
	if (configCache) return configCache;
	const backendCanisterId = {}.CANISTER_ID_BACKEND;
	const envBaseUrl = {}.BASE_URL || "/";
	const baseUrl = envBaseUrl.endsWith("/") ? envBaseUrl : `${envBaseUrl}/`;
	try {
		const config = await (await fetch(`${baseUrl}env.json`)).json();
		if (!backendCanisterId && config.backend_canister_id === "undefined") {
			console.error("CANISTER_ID_BACKEND is not set");
			throw new Error("CANISTER_ID_BACKEND is not set");
		}
		const runtimeStorageGatewayUrl = config.storage_gateway_url && config.storage_gateway_url !== "undefined" ? config.storage_gateway_url : void 0;
		const fullConfig = {
			backend_host: config.backend_host === "undefined" ? void 0 : config.backend_host,
			backend_canister_id: config.backend_canister_id === "undefined" ? backendCanisterId : config.backend_canister_id,
			storage_gateway_url: runtimeStorageGatewayUrl ?? "nogateway",
			bucket_name: DEFAULT_BUCKET_NAME,
			project_id: config.project_id !== "undefined" ? config.project_id : DEFAULT_PROJECT_ID,
			ii_derivation_origin: config.ii_derivation_origin === "undefined" ? void 0 : config.ii_derivation_origin
		};
		configCache = fullConfig;
		return fullConfig;
	} catch {
		if (!backendCanisterId) {
			console.error("CANISTER_ID_BACKEND is not set");
			throw new Error("CANISTER_ID_BACKEND is not set");
		}
		return {
			backend_host: void 0,
			backend_canister_id: backendCanisterId,
			storage_gateway_url: "nogateway",
			bucket_name: DEFAULT_BUCKET_NAME,
			project_id: DEFAULT_PROJECT_ID,
			ii_derivation_origin: void 0
		};
	}
}
function extractAgentErrorMessage(error) {
	const errorString = String(error);
	const match = errorString.match(/with message:\s*'([^']+)'/s);
	return match ? match[1] : errorString;
}
function processError(e) {
	if (e && typeof e === "object" && "message" in e) throw new Error(extractAgentErrorMessage(`${e.message}`));
	throw e;
}
/**
* Load the app's mock backend when `VITE_USE_MOCK=true`.
* Pass `import.meta.glob("./mocks/backend.{ts,tsx,js,jsx}")` evaluated in app source:
* Vite resolves the pattern relative to the file containing the call,
* so a glob inside this package can never see the app's files.
* Globbing (instead of a static import) keeps builds green when the mock file is absent.
*/
async function loadMockBackendFromModules(mockModules) {
	return null;
}
async function createActorWithConfig(createActor, options) {
	const { mockModules, ...resolvedOptions } = options ?? {};
	if (mockModules) {
		const mock = await loadMockBackendFromModules(mockModules);
		if (mock) return mock;
	}
	const config = await loadConfig();
	const agent = new HttpAgent({
		...resolvedOptions.agentOptions,
		host: config.backend_host
	});
	if (config.backend_host?.includes("localhost")) await agent.fetchRootKey().catch((err) => {
		console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
		console.error(err);
	});
	const actorOptions = {
		...resolvedOptions,
		agent,
		processError
	};
	const storageClient = new StorageClient(config.bucket_name, config.storage_gateway_url, config.backend_canister_id, config.project_id, agent);
	const MOTOKO_DEDUPLICATION_SENTINEL = "!caf!";
	const uploadFile = async (file) => {
		const { hash } = await storageClient.putFile(await file.getBytes(), file.onProgress, file.contentType, file.filename);
		return new TextEncoder().encode(MOTOKO_DEDUPLICATION_SENTINEL + hash);
	};
	const downloadFile = async (bytes) => {
		const hash = new TextDecoder().decode(new Uint8Array(bytes)).substring(5);
		const url = await storageClient.getDirectURL(hash);
		return ExternalBlob.fromURL(url);
	};
	return createActor(config.backend_canister_id, uploadFile, downloadFile, actorOptions);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/subscribable.js
var Subscribable = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
		this.subscribe = this.subscribe.bind(this);
	}
	subscribe(listener) {
		this.listeners.add(listener);
		this.onSubscribe();
		return () => {
			this.listeners.delete(listener);
			this.onUnsubscribe();
		};
	}
	hasListeners() {
		return this.listeners.size > 0;
	}
	onSubscribe() {}
	onUnsubscribe() {}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/focusManager.js
var FocusManager = class extends Subscribable {
	#focused;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onFocus) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const listener = () => onFocus();
				window.addEventListener("visibilitychange", listener, false);
				return () => {
					window.removeEventListener("visibilitychange", listener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup((focused) => {
			if (typeof focused === "boolean") this.setFocused(focused);
			else this.onFocus();
		});
	}
	setFocused(focused) {
		if (this.#focused !== focused) {
			this.#focused = focused;
			this.onFocus();
		}
	}
	onFocus() {
		const isFocused = this.isFocused();
		this.listeners.forEach((listener) => {
			listener(isFocused);
		});
	}
	isFocused() {
		if (typeof this.#focused === "boolean") return this.#focused;
		return globalThis.document?.visibilityState !== "hidden";
	}
};
var focusManager = new FocusManager();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/timeoutManager.js
var defaultTimeoutProvider = {
	setTimeout: (callback, delay) => setTimeout(callback, delay),
	clearTimeout: (timeoutId) => clearTimeout(timeoutId),
	setInterval: (callback, delay) => setInterval(callback, delay),
	clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
	#provider = defaultTimeoutProvider;
	#providerCalled = false;
	setTimeoutProvider(provider) {
		this.#provider = provider;
	}
	setTimeout(callback, delay) {
		return this.#provider.setTimeout(callback, delay);
	}
	clearTimeout(timeoutId) {
		this.#provider.clearTimeout(timeoutId);
	}
	setInterval(callback, delay) {
		return this.#provider.setInterval(callback, delay);
	}
	clearInterval(intervalId) {
		this.#provider.clearInterval(intervalId);
	}
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
	setTimeout(callback, 0);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/utils.js
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
	return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
	return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
	return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
	return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
	const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
	if (queryKey) {
		if (exact) {
			if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
		} else if (!partialMatchKey(query.queryKey, queryKey)) return false;
	}
	if (type !== "all") {
		const isActive = query.isActive();
		if (type === "active" && !isActive) return false;
		if (type === "inactive" && isActive) return false;
	}
	if (typeof stale === "boolean" && query.isStale() !== stale) return false;
	if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
	if (predicate && !predicate(query)) return false;
	return true;
}
function matchMutation(filters, mutation) {
	const { exact, status, predicate, mutationKey } = filters;
	if (mutationKey) {
		if (!mutation.options.mutationKey) return false;
		if (exact) {
			if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
		} else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
	}
	if (status && mutation.state.status !== status) return false;
	if (predicate && !predicate(mutation)) return false;
	return true;
}
function hashQueryKeyByOptions(queryKey, options) {
	return (options?.queryKeyHashFn || hashKey)(queryKey);
}
function hashKey(queryKey) {
	return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function partialMatchKey(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a && b && typeof a === "object" && typeof b === "object") return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
	return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
	if (a === b) return a;
	if (depth > 500) return b;
	const array = isPlainArray(a) && isPlainArray(b);
	if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
	const aSize = (array ? a : Object.keys(a)).length;
	const bItems = array ? b : Object.keys(b);
	const bSize = bItems.length;
	const copy = array ? new Array(bSize) : {};
	let equalItems = 0;
	for (let i = 0; i < bSize; i++) {
		const key = array ? i : bItems[i];
		const aItem = a[key];
		const bItem = b[key];
		if (aItem === bItem) {
			copy[key] = aItem;
			if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
			continue;
		}
		if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
			copy[key] = bItem;
			continue;
		}
		const v = replaceEqualDeep(aItem, bItem, depth + 1);
		copy[key] = v;
		if (v === aItem) equalItems++;
	}
	return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
	if (!b || Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (a[key] !== b[key]) return false;
	return true;
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	if (Object.getPrototypeOf(o) !== Object.prototype) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
	return new Promise((resolve) => {
		timeoutManager.setTimeout(resolve, timeout);
	});
}
function replaceData(prevData, data, options) {
	if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
	else if (options.structuralSharing !== false) return replaceEqualDeep(prevData, data);
	return data;
}
function addToEnd(items, item, max = 0) {
	const newItems = [...items, item];
	return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
	const newItems = [item, ...items];
	return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
	if (!options.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
	if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
	return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
	if (typeof throwOnError === "function") return throwOnError(...params);
	return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
	let consumed = false;
	let signal;
	Object.defineProperty(object, "signal", {
		enumerable: true,
		get: () => {
			signal ??= getSignal();
			if (consumed) return signal;
			consumed = true;
			if (signal.aborted) onCancelled();
			else signal.addEventListener("abort", onCancelled, { once: true });
			return signal;
		}
	});
	return object;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/environmentManager.js
var environmentManager = /* @__PURE__ */ (() => {
	let isServerFn = () => isServer;
	return {
		/**
		* Returns whether the current runtime should be treated as a server environment.
		*/
		isServer() {
			return isServerFn();
		},
		/**
		* Overrides the server check globally.
		*/
		setIsServer(isServerValue) {
			isServerFn = isServerValue;
		}
	};
})();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/thenable.js
function pendingThenable() {
	let resolve;
	let reject;
	const thenable = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	thenable.status = "pending";
	thenable.catch(() => {});
	function finalize(data) {
		Object.assign(thenable, data);
		delete thenable.resolve;
		delete thenable.reject;
	}
	thenable.resolve = (value) => {
		finalize({
			status: "fulfilled",
			value
		});
		resolve(value);
	};
	thenable.reject = (reason) => {
		finalize({
			status: "rejected",
			reason
		});
		reject(reason);
	};
	return thenable;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/notifyManager.js
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
	let queue = [];
	let transactions = 0;
	let notifyFn = (callback) => {
		callback();
	};
	let batchNotifyFn = (callback) => {
		callback();
	};
	let scheduleFn = defaultScheduler;
	const schedule = (callback) => {
		if (transactions) queue.push(callback);
		else scheduleFn(() => {
			notifyFn(callback);
		});
	};
	const flush = () => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) scheduleFn(() => {
			batchNotifyFn(() => {
				originalQueue.forEach((callback) => {
					notifyFn(callback);
				});
			});
		});
	};
	return {
		batch: (callback) => {
			let result;
			transactions++;
			try {
				result = callback();
			} finally {
				transactions--;
				if (!transactions) flush();
			}
			return result;
		},
		/**
		* All calls to the wrapped function will be batched.
		*/
		batchCalls: (callback) => {
			return (...args) => {
				schedule(() => {
					callback(...args);
				});
			};
		},
		schedule,
		/**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/
		setNotifyFunction: (fn) => {
			notifyFn = fn;
		},
		/**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* By default React Query will use the batch function provided by ReactDOM or React Native.
		*/
		setBatchNotifyFunction: (fn) => {
			batchNotifyFn = fn;
		},
		setScheduler: (fn) => {
			scheduleFn = fn;
		}
	};
}
var notifyManager = createNotifyManager();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/onlineManager.js
var OnlineManager = class extends Subscribable {
	#online = true;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onOnline) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const onlineListener = () => onOnline(true);
				const offlineListener = () => onOnline(false);
				window.addEventListener("online", onlineListener, false);
				window.addEventListener("offline", offlineListener, false);
				return () => {
					window.removeEventListener("online", onlineListener);
					window.removeEventListener("offline", offlineListener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup(this.setOnline.bind(this));
	}
	setOnline(online) {
		if (this.#online !== online) {
			this.#online = online;
			this.listeners.forEach((listener) => {
				listener(online);
			});
		}
	}
	isOnline() {
		return this.#online;
	}
};
var onlineManager = new OnlineManager();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/retryer.js
function defaultRetryDelay(failureCount) {
	return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
	return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
	constructor(options) {
		super("CancelledError");
		this.revert = options?.revert;
		this.silent = options?.silent;
	}
};
function createRetryer(config) {
	let isRetryCancelled = false;
	let failureCount = 0;
	let continueFn;
	const thenable = pendingThenable();
	const isResolved = () => thenable.status !== "pending";
	const cancel = (cancelOptions) => {
		if (!isResolved()) {
			const error = new CancelledError(cancelOptions);
			reject(error);
			config.onCancel?.(error);
		}
	};
	const cancelRetry = () => {
		isRetryCancelled = true;
	};
	const continueRetry = () => {
		isRetryCancelled = false;
	};
	const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
	const canStart = () => canFetch(config.networkMode) && config.canRun();
	const resolve = (value) => {
		if (!isResolved()) {
			continueFn?.();
			thenable.resolve(value);
		}
	};
	const reject = (value) => {
		if (!isResolved()) {
			continueFn?.();
			thenable.reject(value);
		}
	};
	const pause = () => {
		return new Promise((continueResolve) => {
			continueFn = (value) => {
				if (isResolved() || canContinue()) continueResolve(value);
			};
			config.onPause?.();
		}).then(() => {
			continueFn = void 0;
			if (!isResolved()) config.onContinue?.();
		});
	};
	const run = () => {
		if (isResolved()) return;
		let promiseOrValue;
		const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
		try {
			promiseOrValue = initialPromise ?? config.fn();
		} catch (error) {
			promiseOrValue = Promise.reject(error);
		}
		Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
			if (isResolved()) return;
			const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
			const retryDelay = config.retryDelay ?? defaultRetryDelay;
			const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
			const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
			if (isRetryCancelled || !shouldRetry) {
				reject(error);
				return;
			}
			failureCount++;
			config.onFail?.(failureCount, error);
			sleep(delay).then(() => {
				return canContinue() ? void 0 : pause();
			}).then(() => {
				if (isRetryCancelled) reject(error);
				else run();
			});
		});
	};
	return {
		promise: thenable,
		status: () => thenable.status,
		cancel,
		continue: () => {
			continueFn?.();
			return thenable;
		},
		cancelRetry,
		continueRetry,
		canStart,
		start: () => {
			if (canStart()) run();
			else pause().then(run);
			return thenable;
		}
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/removable.js
var Removable = class {
	#gcTimeout;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (isValidTimeout(this.gcTime)) this.#gcTimeout = timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime);
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (environmentManager.isServer() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		if (this.#gcTimeout) {
			timeoutManager.clearTimeout(this.#gcTimeout);
			this.#gcTimeout = void 0;
		}
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/query.js
var Query = class extends Removable {
	#initialState;
	#revertState;
	#cache;
	#client;
	#retryer;
	#defaultOptions;
	#abortSignalConsumed;
	constructor(config) {
		super();
		this.#abortSignalConsumed = false;
		this.#defaultOptions = config.defaultOptions;
		this.setOptions(config.options);
		this.observers = [];
		this.#client = config.client;
		this.#cache = this.#client.getQueryCache();
		this.queryKey = config.queryKey;
		this.queryHash = config.queryHash;
		this.#initialState = getDefaultState$1(this.options);
		this.state = config.state ?? this.#initialState;
		this.scheduleGc();
	}
	get meta() {
		return this.options.meta;
	}
	get promise() {
		return this.#retryer?.promise;
	}
	setOptions(options) {
		this.options = {
			...this.#defaultOptions,
			...options
		};
		this.updateGcTime(this.options.gcTime);
		if (this.state && this.state.data === void 0) {
			const defaultState = getDefaultState$1(this.options);
			if (defaultState.data !== void 0) {
				this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
				this.#initialState = defaultState;
			}
		}
	}
	optionalRemove() {
		if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
	}
	setData(newData, options) {
		const data = replaceData(this.state.data, newData, this.options);
		this.#dispatch({
			data,
			type: "success",
			dataUpdatedAt: options?.updatedAt,
			manual: options?.manual
		});
		return data;
	}
	setState(state, setStateOptions) {
		this.#dispatch({
			type: "setState",
			state,
			setStateOptions
		});
	}
	cancel(options) {
		const promise = this.#retryer?.promise;
		this.#retryer?.cancel(options);
		return promise ? promise.then(noop).catch(noop) : Promise.resolve();
	}
	destroy() {
		super.destroy();
		this.cancel({ silent: true });
	}
	get resetState() {
		return this.#initialState;
	}
	reset() {
		this.destroy();
		this.setState(this.resetState);
	}
	isActive() {
		return this.observers.some((observer) => resolveEnabled(observer.options.enabled, this) !== false);
	}
	isDisabled() {
		if (this.getObserversCount() > 0) return !this.isActive();
		return this.options.queryFn === skipToken || !this.isFetched();
	}
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	isStatic() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveStaleTime(observer.options.staleTime, this) === "static");
		return false;
	}
	isStale() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
		return this.state.data === void 0 || this.state.isInvalidated;
	}
	isStaleByTime(staleTime = 0) {
		if (this.state.data === void 0) return true;
		if (staleTime === "static") return false;
		if (this.state.isInvalidated) return true;
		return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
	}
	onFocus() {
		this.observers.find((x) => x.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	onOnline() {
		this.observers.find((x) => x.shouldFetchOnReconnect())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	addObserver(observer) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
			this.clearGcTimeout();
			this.#cache.notify({
				type: "observerAdded",
				query: this,
				observer
			});
		}
	}
	removeObserver(observer) {
		if (this.observers.includes(observer)) {
			this.observers = this.observers.filter((x) => x !== observer);
			if (!this.observers.length) {
				if (this.#retryer) {
					if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) this.#retryer.cancel({ revert: true });
					else this.#retryer.cancelRetry();
				}
				this.scheduleGc();
			}
			this.#cache.notify({
				type: "observerRemoved",
				query: this,
				observer
			});
		}
	}
	getObserversCount() {
		return this.observers.length;
	}
	#isInitialPausedFetch() {
		return this.state.fetchStatus === "paused" && this.state.status === "pending";
	}
	invalidate() {
		if (!this.state.isInvalidated) this.#dispatch({ type: "invalidate" });
	}
	async fetch(options, fetchOptions) {
		if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
			if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({ silent: true });
			else if (this.#retryer) {
				this.#retryer.continueRetry();
				return this.#retryer.promise;
			}
		}
		if (options) this.setOptions(options);
		if (!this.options.queryFn) {
			const observer = this.observers.find((x) => x.options.queryFn);
			if (observer) this.setOptions(observer.options);
		}
		const abortController = new AbortController();
		const addSignalProperty = (object) => {
			Object.defineProperty(object, "signal", {
				enumerable: true,
				get: () => {
					this.#abortSignalConsumed = true;
					return abortController.signal;
				}
			});
		};
		const fetchFn = () => {
			const queryFn = ensureQueryFn(this.options, fetchOptions);
			const createQueryFnContext = () => {
				const queryFnContext2 = {
					client: this.#client,
					queryKey: this.queryKey,
					meta: this.meta
				};
				addSignalProperty(queryFnContext2);
				return queryFnContext2;
			};
			const queryFnContext = createQueryFnContext();
			this.#abortSignalConsumed = false;
			if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
			return queryFn(queryFnContext);
		};
		const createFetchContext = () => {
			const context2 = {
				fetchOptions,
				options: this.options,
				queryKey: this.queryKey,
				client: this.#client,
				state: this.state,
				fetchFn
			};
			addSignalProperty(context2);
			return context2;
		};
		const context = createFetchContext();
		this.options.behavior?.onFetch(context, this);
		this.#revertState = this.state;
		if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
			type: "fetch",
			meta: context.fetchOptions?.meta
		});
		this.#retryer = createRetryer({
			initialPromise: fetchOptions?.initialPromise,
			fn: context.fetchFn,
			onCancel: (error) => {
				if (error instanceof CancelledError && error.revert) this.setState({
					...this.#revertState,
					fetchStatus: "idle"
				});
				abortController.abort();
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue: () => {
				this.#dispatch({ type: "continue" });
			},
			retry: context.options.retry,
			retryDelay: context.options.retryDelay,
			networkMode: context.options.networkMode,
			canRun: () => true
		});
		try {
			const data = await this.#retryer.start();
			if (data === void 0) throw new Error(`${this.queryHash} data is undefined`);
			this.setData(data);
			this.#cache.config.onSuccess?.(data, this);
			this.#cache.config.onSettled?.(data, this.state.error, this);
			return data;
		} catch (error) {
			if (error instanceof CancelledError) {
				if (error.silent) return this.#retryer.promise;
				else if (error.revert) {
					if (this.state.data === void 0) throw error;
					return this.state.data;
				}
			}
			this.#dispatch({
				type: "error",
				error
			});
			this.#cache.config.onError?.(error, this);
			this.#cache.config.onSettled?.(this.state.data, error, this);
			throw error;
		} finally {
			this.scheduleGc();
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					fetchFailureCount: action.failureCount,
					fetchFailureReason: action.error
				};
				case "pause": return {
					...state,
					fetchStatus: "paused"
				};
				case "continue": return {
					...state,
					fetchStatus: "fetching"
				};
				case "fetch": return {
					...state,
					...fetchState(state.data, this.options),
					fetchMeta: action.meta ?? null
				};
				case "success":
					const newState = {
						...state,
						...successState(action.data, action.dataUpdatedAt),
						dataUpdateCount: state.dataUpdateCount + 1,
						...!action.manual && {
							fetchStatus: "idle",
							fetchFailureCount: 0,
							fetchFailureReason: null
						}
					};
					this.#revertState = action.manual ? newState : void 0;
					return newState;
				case "error":
					const error = action.error;
					return {
						...state,
						error,
						errorUpdateCount: state.errorUpdateCount + 1,
						errorUpdatedAt: Date.now(),
						fetchFailureCount: state.fetchFailureCount + 1,
						fetchFailureReason: error,
						fetchStatus: "idle",
						status: "error",
						isInvalidated: true
					};
				case "invalidate": return {
					...state,
					isInvalidated: true
				};
				case "setState": return {
					...state,
					...action.state
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.observers.forEach((observer) => {
				observer.onQueryUpdate();
			});
			this.#cache.notify({
				query: this,
				type: "updated",
				action
			});
		});
	}
};
function fetchState(data, options) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
		...data === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function successState(data, dataUpdatedAt) {
	return {
		data,
		dataUpdatedAt: dataUpdatedAt ?? Date.now(),
		error: null,
		isInvalidated: false,
		status: "success"
	};
}
function getDefaultState$1(options) {
	const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
	const hasData = data !== void 0;
	const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
	return {
		data,
		dataUpdateCount: 0,
		dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: false,
		status: hasData ? "success" : "pending",
		fetchStatus: "idle"
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/queryObserver.js
var QueryObserver = class extends Subscribable {
	constructor(client, options) {
		super();
		this.options = options;
		this.#client = client;
		this.#selectError = null;
		this.#currentThenable = pendingThenable();
		this.bindMethods();
		this.setOptions(options);
	}
	#client;
	#currentQuery = void 0;
	#currentQueryInitialState = void 0;
	#currentResult = void 0;
	#currentResultState;
	#currentResultOptions;
	#currentThenable;
	#selectError;
	#selectFn;
	#selectResult;
	#lastQueryWithDefinedData;
	#staleTimeoutId;
	#refetchIntervalId;
	#currentRefetchInterval;
	#trackedProps = /* @__PURE__ */ new Set();
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			this.#currentQuery.addObserver(this);
			if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
			else this.updateResult();
			this.#updateTimers();
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	shouldFetchOnReconnect() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#clearStaleTimeout();
		this.#clearRefetchInterval();
		this.#currentQuery.removeObserver(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = this.#currentQuery;
		this.options = this.#client.defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#updateQuery();
		this.#currentQuery.setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#currentQuery,
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
		this.updateResult();
		if (mounted && (this.#currentQuery !== prevQuery || resolveEnabled(this.options.enabled, this.#currentQuery) !== resolveEnabled(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
		const nextRefetchInterval = this.#computeRefetchInterval();
		if (mounted && (this.#currentQuery !== prevQuery || resolveEnabled(this.options.enabled, this.#currentQuery) !== resolveEnabled(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
	}
	getOptimisticResult(options) {
		const query = this.#client.getQueryCache().build(this.#client, options);
		const result = this.createResult(query, options);
		if (shouldAssignObserverCurrentProperties(this, result)) {
			this.#currentResult = result;
			this.#currentResultOptions = this.options;
			this.#currentResultState = this.#currentQuery.state;
		}
		return result;
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked?.(key);
			if (key === "promise") {
				this.trackProp("data");
				if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") this.#currentThenable.reject(/* @__PURE__ */ new Error("experimental_prefetchInRender feature flag is not enabled"));
			}
			return Reflect.get(target, key);
		} });
	}
	trackProp(key) {
		this.#trackedProps.add(key);
	}
	getCurrentQuery() {
		return this.#currentQuery;
	}
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
	fetchOptimistic(options) {
		const defaultedOptions = this.#client.defaultQueryOptions(options);
		const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
		return query.fetch().then(() => this.createResult(query, defaultedOptions));
	}
	fetch(fetchOptions) {
		return this.#executeFetch({
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return this.#currentResult;
		});
	}
	#executeFetch(fetchOptions) {
		this.#updateQuery();
		let promise = this.#currentQuery.fetch(this.options, fetchOptions);
		if (!fetchOptions?.throwOnError) promise = promise.catch(noop);
		return promise;
	}
	#updateStaleTimeout() {
		this.#clearStaleTimeout();
		const staleTime = resolveStaleTime(this.options.staleTime, this.#currentQuery);
		if (environmentManager.isServer() || this.#currentResult.isStale || !isValidTimeout(staleTime)) return;
		const timeout = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
		this.#staleTimeoutId = timeoutManager.setTimeout(() => {
			if (!this.#currentResult.isStale) this.updateResult();
		}, timeout);
	}
	#computeRefetchInterval() {
		return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
	}
	#updateRefetchInterval(nextInterval) {
		this.#clearRefetchInterval();
		this.#currentRefetchInterval = nextInterval;
		if (environmentManager.isServer() || resolveEnabled(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) return;
		this.#refetchIntervalId = timeoutManager.setInterval(() => {
			if (this.options.refetchIntervalInBackground || focusManager.isFocused()) this.#executeFetch();
		}, this.#currentRefetchInterval);
	}
	#updateTimers() {
		this.#updateStaleTimeout();
		this.#updateRefetchInterval(this.#computeRefetchInterval());
	}
	#clearStaleTimeout() {
		if (this.#staleTimeoutId) {
			timeoutManager.clearTimeout(this.#staleTimeoutId);
			this.#staleTimeoutId = void 0;
		}
	}
	#clearRefetchInterval() {
		if (this.#refetchIntervalId) {
			timeoutManager.clearInterval(this.#refetchIntervalId);
			this.#refetchIntervalId = void 0;
		}
	}
	createResult(query, options) {
		const prevQuery = this.#currentQuery;
		const prevOptions = this.options;
		const prevResult = this.#currentResult;
		const prevResultState = this.#currentResultState;
		const prevResultOptions = this.#currentResultOptions;
		const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult?.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) {
			if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
			else try {
				this.#selectFn = options.select;
				data = options.select(data);
				data = replaceData(prevResult?.data, data, options);
				this.#selectResult = data;
				this.#selectError = null;
			} catch (selectError) {
				this.#selectError = selectError;
			}
		}
		if (this.#selectError) {
			error = this.#selectError;
			data = this.#selectResult;
			errorUpdatedAt = Date.now();
			status = "error";
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		const nextResult = {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			promise: this.#currentThenable,
			isEnabled: resolveEnabled(options.enabled, query) !== false
		};
		if (this.options.experimental_prefetchInRender) {
			const hasResultData = nextResult.data !== void 0;
			const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
			const finalizeThenableIfPossible = (thenable) => {
				if (isErrorWithoutData) thenable.reject(nextResult.error);
				else if (hasResultData) thenable.resolve(nextResult.data);
			};
			const recreateThenable = () => {
				const pending = this.#currentThenable = nextResult.promise = pendingThenable();
				finalizeThenableIfPossible(pending);
			};
			const prevThenable = this.#currentThenable;
			switch (prevThenable.status) {
				case "pending":
					if (query.queryHash === prevQuery.queryHash) finalizeThenableIfPossible(prevThenable);
					break;
				case "fulfilled":
					if (isErrorWithoutData || nextResult.data !== prevThenable.value) recreateThenable();
					break;
				case "rejected": if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) recreateThenable();
			}
		}
		return nextResult;
	}
	updateResult() {
		const prevResult = this.#currentResult;
		const nextResult = this.createResult(this.#currentQuery, this.options);
		this.#currentResultState = this.#currentQuery.state;
		this.#currentResultOptions = this.options;
		if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
		if (shallowEqualObjects(nextResult, prevResult)) return;
		this.#currentResult = nextResult;
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(this.#currentResult).some((key) => {
				const typedKey = key;
				return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		this.#notify({ listeners: shouldNotifyListeners() });
	}
	#updateQuery() {
		const query = this.#client.getQueryCache().build(this.#client, this.options);
		if (query === this.#currentQuery) return;
		const prevQuery = this.#currentQuery;
		this.#currentQuery = query;
		this.#currentQueryInitialState = query.state;
		if (this.hasListeners()) {
			prevQuery?.removeObserver(this);
			query.addObserver(this);
		}
	}
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) this.#updateTimers();
	}
	#notify(notifyOptions) {
		notifyManager.batch(() => {
			if (notifyOptions.listeners) this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
			this.#client.getQueryCache().notify({
				query: this.#currentQuery,
				type: "observerResultsUpdated"
			});
		});
	}
};
function shouldLoadOnMount(query, options) {
	return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
		const value = typeof field === "function" ? field(query) : field;
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
	if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) return true;
	return false;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/mutation.js
var Mutation = class extends Removable {
	#client;
	#observers;
	#mutationCache;
	#retryer;
	constructor(config) {
		super();
		this.#client = config.client;
		this.mutationId = config.mutationId;
		this.#mutationCache = config.mutationCache;
		this.#observers = [];
		this.state = config.state || getDefaultState();
		this.setOptions(config.options);
		this.scheduleGc();
	}
	setOptions(options) {
		this.options = options;
		this.updateGcTime(this.options.gcTime);
	}
	get meta() {
		return this.options.meta;
	}
	addObserver(observer) {
		if (!this.#observers.includes(observer)) {
			this.#observers.push(observer);
			this.clearGcTimeout();
			this.#mutationCache.notify({
				type: "observerAdded",
				mutation: this,
				observer
			});
		}
	}
	removeObserver(observer) {
		this.#observers = this.#observers.filter((x) => x !== observer);
		this.scheduleGc();
		this.#mutationCache.notify({
			type: "observerRemoved",
			mutation: this,
			observer
		});
	}
	optionalRemove() {
		if (!this.#observers.length) {
			if (this.state.status === "pending") this.scheduleGc();
			else this.#mutationCache.remove(this);
		}
	}
	continue() {
		return this.#retryer?.continue() ?? this.execute(this.state.variables);
	}
	async execute(variables) {
		const onContinue = () => {
			this.#dispatch({ type: "continue" });
		};
		const mutationFnContext = {
			client: this.#client,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		};
		this.#retryer = createRetryer({
			fn: () => {
				if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
				return this.options.mutationFn(variables, mutationFnContext);
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#mutationCache.canRun(this)
		});
		const restored = this.state.status === "pending";
		const isPaused = !this.#retryer.canStart();
		try {
			if (restored) onContinue();
			else {
				this.#dispatch({
					type: "pending",
					variables,
					isPaused
				});
				if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
				const context = await this.options.onMutate?.(variables, mutationFnContext);
				if (context !== this.state.context) this.#dispatch({
					type: "pending",
					context,
					variables,
					isPaused
				});
			}
			const data = await this.#retryer.start();
			await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
			await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
			await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
			await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
			this.#dispatch({
				type: "success",
				data
			});
			return data;
		} catch (error) {
			try {
				await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			this.#dispatch({
				type: "error",
				error
			});
			throw error;
		} finally {
			this.#mutationCache.runNext(this);
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					failureCount: action.failureCount,
					failureReason: action.error
				};
				case "pause": return {
					...state,
					isPaused: true
				};
				case "continue": return {
					...state,
					isPaused: false
				};
				case "pending": return {
					...state,
					context: action.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: action.isPaused,
					status: "pending",
					variables: action.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...state,
					data: action.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: false
				};
				case "error": return {
					...state,
					data: void 0,
					error: action.error,
					failureCount: state.failureCount + 1,
					failureReason: action.error,
					isPaused: false,
					status: "error"
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.#observers.forEach((observer) => {
				observer.onMutationUpdate(action);
			});
			this.#mutationCache.notify({
				mutation: this,
				type: "updated",
				action
			});
		});
	}
};
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: false,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/mutationObserver.js
var MutationObserver = class extends Subscribable {
	#client;
	#currentResult = void 0;
	#currentMutation;
	#mutateOptions;
	constructor(client, options) {
		super();
		this.#client = client;
		this.setOptions(options);
		this.bindMethods();
		this.#updateResult();
	}
	bindMethods() {
		this.mutate = this.mutate.bind(this);
		this.reset = this.reset.bind(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		this.options = this.#client.defaultMutationOptions(options);
		if (!shallowEqualObjects(this.options, prevOptions)) this.#client.getMutationCache().notify({
			type: "observerOptionsUpdated",
			mutation: this.#currentMutation,
			observer: this
		});
		if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) this.reset();
		else if (this.#currentMutation?.state.status === "pending") this.#currentMutation.setOptions(this.options);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.#currentMutation?.removeObserver(this);
	}
	onMutationUpdate(action) {
		this.#updateResult();
		this.#notify(action);
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	reset() {
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = void 0;
		this.#updateResult();
		this.#notify();
	}
	mutate(variables, options) {
		this.#mutateOptions = options;
		this.#currentMutation?.removeObserver(this);
		this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
		this.#currentMutation.addObserver(this);
		return this.#currentMutation.execute(variables);
	}
	#updateResult() {
		const state = this.#currentMutation?.state ?? getDefaultState();
		this.#currentResult = {
			...state,
			isPending: state.status === "pending",
			isSuccess: state.status === "success",
			isError: state.status === "error",
			isIdle: state.status === "idle",
			mutate: this.mutate,
			reset: this.reset
		};
	}
	#notify(action) {
		notifyManager.batch(() => {
			if (this.#mutateOptions && this.hasListeners()) {
				const variables = this.#currentResult.variables;
				const onMutateResult = this.#currentResult.context;
				const context = {
					client: this.#client,
					meta: this.options.meta,
					mutationKey: this.options.mutationKey
				};
				if (action?.type === "success") {
					try {
						this.#mutateOptions.onSuccess?.(action.data, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(action.data, null, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				} else if (action?.type === "error") {
					try {
						this.#mutateOptions.onError?.(action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#mutateOptions.onSettled?.(void 0, action.error, variables, onMutateResult, context);
					} catch (e) {
						Promise.reject(e);
					}
				}
			}
			this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var QueryClientContext = import_react.createContext(void 0);
var useQueryClient = (queryClient) => {
	const client = import_react.useContext(QueryClientContext);
	if (queryClient) return queryClient;
	if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
	return client;
};
var QueryClientProvider = ({ client, children }) => {
	import_react.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientContext.Provider, {
		value: client,
		children
	});
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var IsRestoringContext = import_react.createContext(false);
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
function createValue() {
	let isReset = false;
	return {
		clearReset: () => {
			isReset = false;
		},
		reset: () => {
			isReset = true;
		},
		isReset: () => {
			return isReset;
		}
	};
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
var useQueryErrorResetBoundary = () => import_react.useContext(QueryErrorResetBoundaryContext);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
	import_react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/suspense.js
var ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function useBaseQuery(options, Observer, queryClient) {
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const client = useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	client.getDefaultOptions().queries?._experimental_beforeQuery?.(defaultedOptions);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
	ensureSuspenseTimers(defaultedOptions);
	ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	useClearResetErrorBoundary(errorResetBoundary);
	const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
	const [observer] = import_react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && options.subscribed !== false;
	import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	import_react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (shouldSuspend(defaultedOptions, result)) throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	client.getDefaultOptions().queries?._experimental_afterQuery?.(defaultedOptions, result);
	if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) (isNewCacheEntry ? fetchOptimistic(defaultedOptions, observer, errorResetBoundary) : query?.promise)?.catch(noop).finally(() => {
		observer.updateResult();
	});
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-query@5.95.2_react@19.1.5/node_modules/@tanstack/react-query/build/modern/useMutation.js
function useMutation(options, queryClient) {
	const client = useQueryClient(queryClient);
	const [observer] = import_react.useState(() => new MutationObserver(client, options));
	import_react.useEffect(() => {
		observer.setOptions(options);
	}, [observer, options]);
	const result = import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	const mutate = import_react.useCallback((variables, mutateOptions) => {
		observer.mutate(variables, mutateOptions).catch(noop);
	}, [observer]);
	if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) throw result.error;
	return {
		...result,
		mutate,
		mutateAsync: result.mutate
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/identity/identity/ed25519.js
function isObject(value) {
	return value !== null && typeof value === "object";
}
var Ed25519PublicKey = class Ed25519PublicKey {
	/**
	* Construct Ed25519PublicKey from an existing PublicKey
	* @param {unknown} maybeKey - existing PublicKey, ArrayBuffer, DerEncodedPublicKey, or hex string
	* @returns {Ed25519PublicKey} Instance of Ed25519PublicKey
	*/
	static from(maybeKey) {
		if (typeof maybeKey === "string") {
			const key = hexToBytes(maybeKey);
			return this.fromRaw(key);
		}
		if (isObject(maybeKey)) {
			const key = maybeKey;
			if (isObject(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) return this.fromDer(key);
			if (ArrayBuffer.isView(key)) {
				const view = key;
				return this.fromRaw(uint8FromBufLike(view.buffer));
			}
			if (key instanceof ArrayBuffer) return this.fromRaw(uint8FromBufLike(key));
			if ("rawKey" in key && key.rawKey instanceof Uint8Array) return this.fromRaw(key.rawKey);
			if ("derKey" in key) return this.fromDer(key.derKey);
			if ("toDer" in key) return this.fromDer(key.toDer());
		}
		throw new Error("Cannot construct Ed25519PublicKey from the provided key.");
	}
	static fromRaw(rawKey) {
		return new Ed25519PublicKey(rawKey);
	}
	static fromDer(derKey) {
		return new Ed25519PublicKey(this.derDecode(derKey));
	}
	static {
		this.RAW_KEY_LENGTH = 32;
	}
	static derEncode(publicKey) {
		const key = wrapDER(publicKey, ED25519_OID);
		key.__derEncodedPublicKey__ = void 0;
		return key;
	}
	static derDecode(key) {
		const unwrapped = unwrapDER(key, ED25519_OID);
		if (unwrapped.length !== this.RAW_KEY_LENGTH) throw new Error("An Ed25519 public key must be exactly 32bytes long");
		return unwrapped;
	}
	#rawKey;
	get rawKey() {
		return this.#rawKey;
	}
	#derKey;
	get derKey() {
		return this.#derKey;
	}
	constructor(key) {
		if (key.byteLength !== Ed25519PublicKey.RAW_KEY_LENGTH) throw new Error("An Ed25519 public key must be exactly 32bytes long");
		this.#rawKey = key;
		this.#derKey = Ed25519PublicKey.derEncode(key);
	}
	toDer() {
		return this.derKey;
	}
	toRaw() {
		return this.rawKey;
	}
};
/**
* Ed25519KeyIdentity is an implementation of SignIdentity that uses Ed25519 keys. This class is used to sign and verify messages for an agent.
*/
var Ed25519KeyIdentity = class Ed25519KeyIdentity extends SignIdentity {
	/**
	* Generate a new Ed25519KeyIdentity.
	* @param seed a 32-byte seed for the private key. If not provided, a random seed will be generated.
	* @returns Ed25519KeyIdentity
	*/
	static generate(seed) {
		if (seed && seed.length !== 32) throw new Error("Ed25519 Seed needs to be 32 bytes long.");
		if (!seed) seed = ed25519.utils.randomPrivateKey();
		if (uint8Equals(seed, new Uint8Array(new Array(32).fill(0)))) console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
		const sk = /* @__PURE__ */ new Uint8Array(32);
		for (let i = 0; i < 32; i++) sk[i] = seed[i];
		const pk = ed25519.getPublicKey(sk);
		return Ed25519KeyIdentity.fromKeyPair(pk, sk);
	}
	static fromParsedJson(obj) {
		const [publicKeyDer, privateKeyRaw] = obj;
		return new Ed25519KeyIdentity(Ed25519PublicKey.fromDer(hexToBytes(publicKeyDer)), hexToBytes(privateKeyRaw));
	}
	static fromJSON(json) {
		const parsed = JSON.parse(json);
		if (Array.isArray(parsed)) {
			if (typeof parsed[0] === "string" && typeof parsed[1] === "string") return this.fromParsedJson([parsed[0], parsed[1]]);
			throw new Error("Deserialization error: JSON must have at least 2 items.");
		}
		throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
	}
	static fromKeyPair(publicKey, privateKey) {
		return new Ed25519KeyIdentity(Ed25519PublicKey.fromRaw(publicKey), privateKey);
	}
	static fromSecretKey(secretKey) {
		const publicKey = ed25519.getPublicKey(secretKey);
		return Ed25519KeyIdentity.fromKeyPair(publicKey, secretKey);
	}
	#publicKey;
	#privateKey;
	constructor(publicKey, privateKey) {
		super();
		this.#publicKey = Ed25519PublicKey.from(publicKey);
		this.#privateKey = privateKey;
	}
	/**
	* Serialize this key to JSON.
	*/
	toJSON() {
		return [bytesToHex(this.#publicKey.toDer()), bytesToHex(this.#privateKey)];
	}
	/**
	* Return a copy of the key pair.
	*/
	getKeyPair() {
		return {
			secretKey: this.#privateKey,
			publicKey: this.#publicKey
		};
	}
	/**
	* Return the public key.
	*/
	getPublicKey() {
		return this.#publicKey;
	}
	/**
	* Signs a blob of data, with this identity's private key.
	* @param challenge - challenge to sign with this identity's secretKey, producing a signature
	*/
	async sign(challenge) {
		const signature = ed25519.sign(challenge, this.#privateKey.slice(0, 32));
		Object.defineProperty(signature, "__signature__", {
			enumerable: false,
			value: void 0
		});
		return signature;
	}
	/**
	* Verify
	* @param sig - signature to verify
	* @param msg - message to verify
	* @param pk - public key
	* @returns - true if the signature is valid, false otherwise
	*/
	static verify(sig, msg, pk) {
		const [signature, message, publicKey] = [
			sig,
			msg,
			pk
		].map((x) => {
			if (typeof x === "string") x = hexToBytes(x);
			return uint8FromBufLike(x);
		});
		return ed25519.verify(signature, message, publicKey);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/identity/identity/ecdsa.js
var CryptoError = class CryptoError extends Error {
	constructor(message) {
		super(message);
		this.message = message;
		Object.setPrototypeOf(this, CryptoError.prototype);
	}
};
/**
* Utility method to ensure that a subtleCrypto implementation is provided or is available in the global context
* @param subtleCrypto SubtleCrypto implementation
* @returns subleCrypto
*/
function _getEffectiveCrypto(subtleCrypto) {
	if (typeof globalThis !== "undefined" && globalThis["crypto"] && globalThis["crypto"]["subtle"]) return globalThis["crypto"]["subtle"];
	if (subtleCrypto) return subtleCrypto;
	if (typeof crypto !== "undefined" && crypto["subtle"]) return crypto.subtle;
	throw new CryptoError("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
}
/**
* An identity interface that wraps an ECDSA keypair using the P-256 named curve. Supports DER-encoding and decoding for agent calls
*/
var ECDSAKeyIdentity = class ECDSAKeyIdentity extends SignIdentity {
	/**
	* Generates a randomly generated identity for use in calls to the Internet Computer.
	* @param {CryptoKeyOptions} options optional settings
	* @param {CryptoKeyOptions['extractable']} options.extractable - whether the key should allow itself to be used. Set to false for maximum security.
	* @param {CryptoKeyOptions['keyUsages']} options.keyUsages - a list of key usages that the key can be used for
	* @param {CryptoKeyOptions['subtleCrypto']} options.subtleCrypto interface
	* @returns a {@link ECDSAKeyIdentity}
	*/
	static async generate(options) {
		const { extractable = false, keyUsages = ["sign", "verify"], subtleCrypto } = options ?? {};
		const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
		const keyPair = await effectiveCrypto.generateKey({
			name: "ECDSA",
			namedCurve: "P-256"
		}, extractable, keyUsages);
		const derKey = uint8FromBufLike(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
		Object.assign(derKey, { __derEncodedPublicKey__: void 0 });
		return new this(keyPair, derKey, effectiveCrypto);
	}
	/**
	* generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
	* @param keyPair a CryptoKeyPair
	* @param subtleCrypto - a SubtleCrypto interface in case one is not available globally
	* @returns an {@link ECDSAKeyIdentity}
	*/
	static async fromKeyPair(keyPair, subtleCrypto) {
		const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
		const derKey = uint8FromBufLike(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
		Object.assign(derKey, { __derEncodedPublicKey__: void 0 });
		return new ECDSAKeyIdentity(keyPair, derKey, effectiveCrypto);
	}
	constructor(keyPair, derKey, subtleCrypto) {
		super();
		this._keyPair = keyPair;
		this._derKey = derKey;
		this._subtleCrypto = subtleCrypto;
	}
	/**
	* Return the internally-used key pair.
	* @returns a CryptoKeyPair
	*/
	getKeyPair() {
		return this._keyPair;
	}
	/**
	* Return the public key.
	* @returns an {@link PublicKey & DerCryptoKey}
	*/
	getPublicKey() {
		const derKey = this._derKey;
		const key = Object.create(this._keyPair.publicKey);
		key.toDer = function() {
			return derKey;
		};
		return key;
	}
	/**
	* Signs a blob of data, with this identity's private key.
	* @param {Uint8Array} challenge - challenge to sign with this identity's secretKey, producing a signature
	* @returns {Promise<Signature>} signature
	*/
	async sign(challenge) {
		const signature = uint8FromBufLike(await this._subtleCrypto.sign({
			name: "ECDSA",
			hash: { name: "SHA-256" }
		}, this._keyPair.privateKey, challenge));
		Object.assign(signature, { __signature__: void 0 });
		return signature;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/identity/identity/partial.js
/**
* A partial delegated identity, representing a delegation chain and the public key that it targets
*/
var PartialIdentity = class {
	#inner;
	/**
	* The raw public key of this identity.
	*/
	get rawKey() {
		return this.#inner.rawKey;
	}
	/**
	* The DER-encoded public key of this identity.
	*/
	get derKey() {
		return this.#inner.derKey;
	}
	/**
	* The DER-encoded public key of this identity.
	*/
	toDer() {
		return this.#inner.toDer();
	}
	/**
	* The inner {@link PublicKey} used by this identity.
	*/
	getPublicKey() {
		return this.#inner;
	}
	/**
	* The {@link Principal} of this identity.
	*/
	getPrincipal() {
		if (!this.#inner.rawKey) throw new Error("Cannot get principal from a public key without a raw key.");
		return Principal.fromUint8Array(new Uint8Array(this.#inner.rawKey));
	}
	/**
	* Required for the Identity interface, but cannot implemented for just a public key.
	*/
	transformRequest() {
		return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
	}
	constructor(inner) {
		this.#inner = inner;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/identity/identity/delegation.js
/**
* Safe wrapper around bytesToHex that handles ArrayBuffer/Uint8Array type conversion.
* Required because `@noble/hashes` v1.8+ strictly expects Uint8Array inputs.
* @param data The binary data to convert to hexadecimal string (ArrayBuffer, Uint8Array, or ArrayLike<number>)
*/
function safeBytesToHex(data) {
	if (data instanceof Uint8Array) return bytesToHex(data);
	return bytesToHex(new Uint8Array(data));
}
function _parseBlob(value) {
	if (typeof value !== "string" || value.length < 64) throw new Error("Invalid public key.");
	return hexToBytes(value);
}
/**
* A single delegation object that is signed by a private key. This is constructed by
* `DelegationChain.create()`.
*
* {@link DelegationChain}
*/
var Delegation = class {
	constructor(pubkey, expiration, targets) {
		this.pubkey = pubkey;
		this.expiration = expiration;
		this.targets = targets;
	}
	toCborValue() {
		return {
			pubkey: this.pubkey,
			expiration: this.expiration,
			...this.targets && { targets: this.targets }
		};
	}
	toJSON() {
		return {
			expiration: this.expiration.toString(16),
			pubkey: safeBytesToHex(this.pubkey),
			...this.targets && { targets: this.targets.map((p) => p.toHex()) }
		};
	}
};
/**
* Sign a single delegation object for a period of time.
* @param from The identity that lends its delegation.
* @param to The identity that receives the delegation.
* @param expiration An expiration date for this delegation.
* @param targets Limit this delegation to the target principals.
*/
async function _createSingleDelegation(from, to, expiration, targets) {
	const delegation = new Delegation(to.toDer(), BigInt(+expiration) * BigInt(1e6), targets);
	const challenge = new Uint8Array([...IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR, ...new Uint8Array(requestIdOf({ ...delegation }))]);
	return {
		delegation,
		signature: await from.sign(challenge)
	};
}
/**
* A chain of delegations. This is JSON Serializable.
* This is the object to serialize and pass to a DelegationIdentity. It does not keep any
* private keys.
*/
var DelegationChain = class DelegationChain {
	/**
	* Create a delegation chain between two (or more) keys. By default, the expiration time
	* will be very short (15 minutes).
	*
	* To build a chain of more than 2 identities, this function needs to be called multiple times,
	* passing the previous delegation chain into the options argument. For example:
	* @example
	* const rootKey = createKey();
	* const middleKey = createKey();
	* const bottomeKey = createKey();
	*
	* const rootToMiddle = await DelegationChain.create(
	*   root, middle.getPublicKey(), Date.parse('2100-01-01'),
	* );
	* const middleToBottom = await DelegationChain.create(
	*   middle, bottom.getPublicKey(), Date.parse('2100-01-01'), { previous: rootToMiddle },
	* );
	*
	* // We can now use a delegation identity that uses the delegation above:
	* const identity = DelegationIdentity.fromDelegation(bottomKey, middleToBottom);
	* @param from The identity that will delegate.
	* @param to The identity that gets delegated. It can now sign messages as if it was the
	*           identity above.
	* @param expiration The length the delegation is valid. By default, 15 minutes from calling
	*                   this function.
	* @param options A set of options for this delegation. expiration and previous
	* @param options.previous - Another DelegationChain that this chain should start with.
	* @param options.targets - targets that scope the delegation (e.g. Canister Principals)
	*/
	static async create(from, to, expiration = new Date(Date.now() + 9e5), options = {}) {
		const delegation = await _createSingleDelegation(from, to, expiration, options.targets);
		return new DelegationChain([...options.previous?.delegations || [], delegation], options.previous?.publicKey || from.getPublicKey().toDer());
	}
	/**
	* Creates a DelegationChain object from a JSON string.
	* @param json The JSON string to parse.
	*/
	static fromJSON(json) {
		const { publicKey, delegations } = typeof json === "string" ? JSON.parse(json) : json;
		if (!Array.isArray(delegations)) throw new Error("Invalid delegations.");
		const parsedDelegations = delegations.map((signedDelegation) => {
			const { delegation, signature } = signedDelegation;
			const { pubkey, expiration, targets } = delegation;
			if (targets !== void 0 && !Array.isArray(targets)) throw new Error("Invalid targets.");
			return {
				delegation: new Delegation(_parseBlob(pubkey), BigInt(`0x${expiration}`), targets && targets.map((t) => {
					if (typeof t !== "string") throw new Error("Invalid target.");
					return Principal.fromHex(t);
				})),
				signature: _parseBlob(signature)
			};
		});
		return new this(parsedDelegations, _parseBlob(publicKey));
	}
	/**
	* Creates a DelegationChain object from a list of delegations and a DER-encoded public key.
	* @param delegations The list of delegations.
	* @param publicKey The DER-encoded public key of the key-pair signing the first delegation.
	*/
	static fromDelegations(delegations, publicKey) {
		return new this(delegations, publicKey);
	}
	constructor(delegations, publicKey) {
		this.delegations = delegations;
		this.publicKey = publicKey;
	}
	toJSON() {
		return {
			delegations: this.delegations.map((signedDelegation) => {
				const { delegation, signature } = signedDelegation;
				const { targets } = delegation;
				return {
					delegation: {
						expiration: delegation.expiration.toString(16),
						pubkey: safeBytesToHex(delegation.pubkey),
						...targets && { targets: targets.map((t) => t.toHex()) }
					},
					signature: safeBytesToHex(signature)
				};
			}),
			publicKey: safeBytesToHex(this.publicKey)
		};
	}
};
/**
* An Identity that adds delegation to a request. Everywhere in this class, the name
* innerKey refers to the SignIdentity that is being used to sign the requests, while
* originalKey is the identity that is being borrowed. More identities can be used
* in the middle to delegate.
*/
var DelegationIdentity = class extends SignIdentity {
	/**
	* Create a delegation without having access to delegateKey.
	* @param key The key used to sign the requests.
	* @param delegation A delegation object created using `createDelegation`.
	*/
	static fromDelegation(key, delegation) {
		return new this(key, delegation);
	}
	constructor(_inner, _delegation) {
		super();
		this._inner = _inner;
		this._delegation = _delegation;
	}
	getDelegation() {
		return this._delegation;
	}
	getPublicKey() {
		return {
			derKey: this._delegation.publicKey,
			toDer: () => this._delegation.publicKey
		};
	}
	sign(blob) {
		return this._inner.sign(blob);
	}
	async transformRequest(request) {
		const { body, ...fields } = request;
		const requestId = await requestIdOf(body);
		return {
			...fields,
			body: {
				content: body,
				sender_sig: await this.sign(new Uint8Array([...IC_REQUEST_DOMAIN_SEPARATOR, ...new Uint8Array(requestId)])),
				sender_delegation: this._delegation.delegations,
				sender_pubkey: this._delegation.publicKey
			}
		};
	}
};
/**
* A partial delegated identity, representing a delegation chain and the public key that it targets
*/
var PartialDelegationIdentity = class PartialDelegationIdentity extends PartialIdentity {
	#delegation;
	/**
	* The Delegation Chain of this identity.
	*/
	get delegation() {
		return this.#delegation;
	}
	constructor(inner, delegation) {
		super(inner);
		this.#delegation = delegation;
	}
	/**
	* Create a {@link PartialDelegationIdentity} from a {@link PublicKey} and a {@link DelegationChain}.
	* @param key The {@link PublicKey} to delegate to.
	* @param delegation a {@link DelegationChain} targeting the inner key.
	*/
	static fromDelegation(key, delegation) {
		return new PartialDelegationIdentity(key, delegation);
	}
};
/**
* Analyze a DelegationChain and validate that it's valid, ie. not expired and apply to the
* scope.
* @param chain The chain to validate.
* @param checks Various checks to validate on the chain.
*/
function isDelegationValid(chain, checks) {
	for (const { delegation } of chain.delegations) if (+new Date(Number(delegation.expiration / BigInt(1e6))) <= +Date.now()) return false;
	const scopes = [];
	const maybeScope = checks?.scope;
	if (maybeScope) {
		if (Array.isArray(maybeScope)) scopes.push(...maybeScope.map((s) => typeof s === "string" ? Principal.fromText(s) : s));
		else scopes.push(typeof maybeScope === "string" ? Principal.fromText(maybeScope) : maybeScope);
	}
	for (const s of scopes) {
		const scope = s.toText();
		for (const { delegation } of chain.delegations) {
			if (delegation.targets === void 0) continue;
			let none = true;
			for (const target of delegation.targets) if (target.toText() === scope) {
				none = false;
				break;
			}
			if (none) return false;
		}
	}
	return true;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/identity/identity/attributes.js
/**
* An Identity decorator that injects `sender_info` into the request body
* before delegating to an inner identity for signing.
*
* Because `sender_info` is part of the request content, it is included in the
* representation-independent hash (`requestIdOf`) and covered by the sender's
* signature for `call` and `query` endpoints.
*
* The IC does not hash `sender_info` for `read_state` requests, so the
* decorator skips injection for that endpoint to avoid signature verification
* failures on update-call polls.
*
* @example
* ```ts
* const inner = DelegationIdentity.fromDelegation(key, chain);
* const identity = new AttributesIdentity({
*   inner,
*   attributes: { data: new Uint8Array([...]), signature: new Uint8Array([...]) },
*   signer: { canisterId: Principal.fromText('aaaaa-aa') },
* });
* const agent = HttpAgent.create({ identity });
* ```
*/
var AttributesIdentity = class {
	#inner;
	#attributes;
	#signer;
	/**
	* @param options - Configuration for the identity.
	* @param options.inner - The inner identity to delegate signing to.
	* @param options.attributes - The signed attributes to include in the request.
	* @param options.signer - The canister that signed the attributes.
	*/
	constructor(options) {
		this.#inner = options.inner;
		this.#attributes = options.attributes;
		this.#signer = options.signer;
	}
	getPrincipal() {
		return this.#inner.getPrincipal();
	}
	transformRequest(request) {
		if (request.endpoint === Endpoint.ReadState) return this.#inner.transformRequest(request);
		return this.#inner.transformRequest({
			...request,
			body: {
				...request.body,
				sender_info: {
					signer: this.#signer.canisterId.toUint8Array(),
					info: this.#attributes.data,
					sig: this.#attributes.signature
				}
			}
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/identity/identity/webauthn.js
var PubKeyCoseAlgo;
(function(PubKeyCoseAlgo) {
	PubKeyCoseAlgo[PubKeyCoseAlgo["ECDSA_WITH_SHA256"] = -7] = "ECDSA_WITH_SHA256";
})(PubKeyCoseAlgo || (PubKeyCoseAlgo = {}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+signer@5.4.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/signer/lib/esm/signer.js
var GENERIC_ERROR = 1e3;
var NETWORK_ERROR = 4e3;
var toBase64$1 = (bytes) => {
	if ("toBase64" in bytes && typeof bytes.toBase64 === "function") return bytes.toBase64();
	let binary = "";
	for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
	return globalThis.btoa(binary);
};
var fromBase64$1 = (str) => {
	if ("fromBase64" in Uint8Array && typeof Uint8Array.fromBase64 === "function") return Uint8Array.fromBase64(str);
	const binary = globalThis.atob(str);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
};
var asRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
var asString = (value) => typeof value === "string" ? value : void 0;
var asArray = (value) => Array.isArray(value) ? value : void 0;
/**
* Ensures a JSON-RPC request contains only valid JSON values by
* round-tripping through `JSON.stringify` / `JSON.parse`.
*
* - Properties with `undefined` values are stripped.
* - `undefined`, `NaN`, and `Infinity` inside arrays become `null`.
* - Non-serializable values such as `BigInt` will cause an error.
* @param request - The JSON-RPC request to clean.
*/
var jsonCleanTransform = (request) => JSON.parse(JSON.stringify(request));
/**
* Creates a transform that appends the ICRC-95 derivation origin to request params.
* @param derivationOrigin - The derivation origin URL to include.
* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_95_derivationorigin.md
*/
var icrc95DerivationOriginTransform = (derivationOrigin) => {
	return (request) => ({
		...request,
		params: {
			...request.params,
			icrc95DerivationOrigin: derivationOrigin
		}
	});
};
/**
* Error thrown when a signer returns a JSON-RPC error response
* or when a transport-level failure occurs.
*/
var SignerError = class extends Error {
	/** The JSON-RPC error code. */
	code;
	/** Optional additional error data from the signer. */
	data;
	constructor(error, options) {
		super(error.message, options);
		this.code = error.code;
		this.data = error.data;
	}
};
/**
* Client for interacting with an ICRC-25 compliant signer.
*
* Signers are applications that hold private keys and can sign messages
* on behalf of a user. They communicate over a {@link Transport} using
* JSON-RPC 2.0 messages as defined by the ICRC-25 standard.
* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_25_signer_interaction_standard.md
* @example
* ```ts
* import { Signer } from "@icp-sdk/signer";
* import { PostMessageTransport } from "@icp-sdk/signer/web";
*
* const transport = new PostMessageTransport({ url: "https://oisy.com/sign" });
* const signer = new Signer({ transport });
*
* const standards = await signer.getSupportedStandards();
* const accounts = await signer.getAccounts();
* ```
*/
var Signer = class {
	#options;
	#channel;
	#establishingChannel;
	#scheduledChannelClosure;
	#pendingRequestCount = 0;
	constructor(options) {
		const transforms = [...options.transforms ?? []];
		if (options.derivationOrigin) transforms.push(icrc95DerivationOriginTransform(options.derivationOrigin));
		transforms.push(jsonCleanTransform);
		this.#options = {
			autoCloseTransportChannel: true,
			closeTransportChannelAfter: 200,
			crypto: globalThis.crypto,
			...options,
			transforms
		};
	}
	/** The transport used to communicate with the signer. */
	get transport() {
		return this.#options.transport;
	}
	/**
	* Whether the transport channel auto-closes after a response is received.
	* Can be toggled at runtime, which is useful for multi-step flows that
	* need to await async work between requests without losing the channel.
	* Setting this to `false` also cancels any auto-close already scheduled
	* by a prior response.
	*/
	get autoCloseTransportChannel() {
		return this.#options.autoCloseTransportChannel;
	}
	set autoCloseTransportChannel(value) {
		this.#options.autoCloseTransportChannel = value;
		if (!value) clearTimeout(this.#scheduledChannelClosure);
	}
	/**
	* Opens a communication channel with the signer.
	* Reuses an existing open channel if available.
	*/
	async openChannel() {
		clearTimeout(this.#scheduledChannelClosure);
		if (this.#establishingChannel) await this.#establishingChannel;
		if (this.#channel && !this.#channel.closed) return this.#channel;
		const channel = this.#options.transport.establishChannel();
		this.#establishingChannel = channel.then(() => {}).catch(() => {});
		this.#channel = void 0;
		this.#channel = await channel.catch((error) => {
			throw new SignerError({
				code: NETWORK_ERROR,
				message: error instanceof Error ? error.message : "Network error"
			}, { cause: error });
		});
		this.#establishingChannel = void 0;
		return this.#channel;
	}
	/** Closes the current communication channel, if open. */
	async closeChannel() {
		await this.#channel?.close();
	}
	/**
	* Sends a JSON-RPC request over the transport channel.
	* @param request - The JSON-RPC request to send.
	*/
	async sendRequest(request) {
		const channel = await this.openChannel();
		const { promise, resolve, reject } = Promise.withResolvers();
		const expectsResponse = request.id !== void 0 && request.id !== null;
		if (expectsResponse) this.#pendingRequestCount++;
		let settled = false;
		const settle = () => {
			if (settled) return;
			settled = true;
			if (expectsResponse) this.#pendingRequestCount--;
		};
		const removeResponseListener = channel.addEventListener("response", (response) => {
			if (response.id !== request.id) return;
			removeResponseListener();
			removeCloseListener();
			settle();
			if ("error" in response && (typeof response.error !== "object" || response.error === null || typeof response.error.code !== "number" || typeof response.error.message !== "string")) resolve({
				jsonrpc: "2.0",
				id: response.id,
				error: {
					code: GENERIC_ERROR,
					message: "Invalid error response from signer"
				}
			});
			else resolve(response);
			if (this.#options.autoCloseTransportChannel && this.#pendingRequestCount === 0) this.#scheduledChannelClosure = setTimeout(() => {
				if (!channel.closed) channel.close();
			}, this.#options.closeTransportChannelAfter);
		});
		const removeCloseListener = channel.addEventListener("close", () => {
			removeResponseListener();
			removeCloseListener();
			settle();
			reject(new SignerError({
				code: NETWORK_ERROR,
				message: "Channel was closed before a response was received"
			}));
		});
		let transformedRequest;
		try {
			transformedRequest = this.#applyTransforms(request);
		} catch (cause) {
			removeResponseListener();
			removeCloseListener();
			settle();
			reject(new SignerError({
				code: GENERIC_ERROR,
				message: `Transform failed: ${cause instanceof Error ? cause.message : cause}`
			}, { cause }));
			return promise;
		}
		try {
			await channel.send(transformedRequest);
		} catch (error) {
			removeResponseListener();
			removeCloseListener();
			settle();
			reject(new SignerError({
				code: NETWORK_ERROR,
				message: error instanceof Error ? error.message : "Network error"
			}, { cause: error }));
		}
		return promise;
	}
	/**
	* Queries which ICRC standards the signer supports.
	* Use this to determine signer capabilities before calling other methods.
	* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_25_signer_interaction_standard.md
	*/
	getSupportedStandards() {
		return this.#rpc({
			method: "icrc25_supported_standards",
			decode: (result) => {
				const standards = asArray(asRecord(result)?.supportedStandards);
				if (!standards) throw new Error("Expected supportedStandards array");
				return standards.map((item) => {
					const obj = asRecord(item);
					const name = asString(obj?.name);
					const url = asString(obj?.url);
					if (name === void 0 || url === void 0) throw new Error("Expected { name, url }");
					return {
						name,
						url
					};
				});
			}
		});
	}
	/**
	* Requests the signer to grant permission for the given scopes.
	* The signer may prompt the user for approval.
	* @param scopes - The permission scopes to request.
	* @returns The current state of each requested scope after the user's decision.
	*/
	requestPermissions(scopes) {
		return this.#rpc({
			method: "icrc25_request_permissions",
			params: scopes,
			encode: (scopes) => ({ scopes }),
			decode: (result) => {
				const scopes = asArray(asRecord(result)?.scopes);
				if (!scopes) throw new Error("Expected scopes array");
				return scopes.map((item) => {
					const obj = asRecord(item);
					const scope = asRecord(obj?.scope);
					const state = asString(obj?.state);
					if (!scope || typeof scope.method !== "string" || !state) throw new Error("Expected { scope: { method }, state }");
					return {
						scope,
						state
					};
				});
			}
		});
	}
	/**
	* Queries the current state of all permission scopes.
	* @returns The current permission state for each scope the signer supports.
	*/
	getPermissions() {
		return this.#rpc({
			method: "icrc25_permissions",
			decode: (result) => {
				const scopes = asArray(asRecord(result)?.scopes);
				if (!scopes) throw new Error("Expected scopes array");
				return scopes.map((item) => {
					const obj = asRecord(item);
					const scope = asRecord(obj?.scope);
					const state = asString(obj?.state);
					if (!scope || typeof scope.method !== "string" || !state) throw new Error("Expected { scope: { method }, state }");
					return {
						scope,
						state
					};
				});
			}
		});
	}
	/**
	* Requests the accounts managed by the signer.
	* Each account has an owner {@link Principal} and an optional 32-byte subaccount.
	*
	* Requires the `icrc27_accounts` permission scope.
	* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_27_accounts.md
	*/
	getAccounts() {
		return this.#rpc({
			method: "icrc27_accounts",
			decode: (result) => {
				const accounts = asArray(asRecord(result)?.accounts);
				if (!accounts) throw new Error("Expected accounts array");
				return accounts.map((item) => {
					const obj = asRecord(item);
					const owner = asString(obj?.owner);
					const subaccount = asString(obj?.subaccount);
					if (!owner) throw new Error("Expected account.owner string");
					return {
						owner: Principal.fromText(owner),
						subaccount: subaccount !== void 0 ? fromBase64$1(subaccount) : void 0
					};
				});
			}
		});
	}
	/**
	* Requests a delegation chain from the signer for session-based authentication.
	* This allows the relying party to sign canister calls without requiring
	* user approval for each individual call.
	* @param params - The delegation request parameters.
	* @param params.publicKey - The session's public key to delegate to.
	* @param params.targets - Optional canister IDs to restrict the delegation to.
	*   When provided, the signer creates an account delegation; otherwise a
	*   relying party delegation.
	* @param params.maxTimeToLive - Optional maximum delegation lifetime in nanoseconds.
	* @returns A {@link DelegationChain} that can be used with `DelegationIdentity`.
	* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_34_delegation.md
	*/
	requestDelegation(params) {
		return this.#rpc({
			method: "icrc34_delegation",
			params,
			encode: (v) => ({
				publicKey: toBase64$1(new Uint8Array(v.publicKey.toDer())),
				targets: v.targets?.map((t) => t.toText()),
				maxTimeToLive: v.maxTimeToLive !== void 0 ? String(v.maxTimeToLive) : void 0
			}),
			decode: (result) => {
				const r = asRecord(result);
				const publicKey = asString(r?.publicKey);
				const signerDelegation = asArray(r?.signerDelegation);
				if (!publicKey || !signerDelegation) throw new Error("Expected { publicKey, signerDelegation }");
				return DelegationChain.fromDelegations(signerDelegation.map((item) => {
					const obj = asRecord(item);
					const del = asRecord(obj?.delegation);
					const pubkey = asString(del?.pubkey);
					const expiration = del?.expiration;
					const signature = asString(obj?.signature);
					if (!pubkey || expiration === void 0 || !signature) throw new Error("Expected delegation { pubkey, expiration, signature }");
					const targets = asArray(del?.targets);
					return {
						delegation: new Delegation(fromBase64$1(pubkey), BigInt(expiration), targets?.map((t) => Principal.fromText(t))),
						signature: fromBase64$1(signature)
					};
				}), fromBase64$1(publicKey));
			}
		});
	}
	/**
	* Requests the signer to execute a canister call on behalf of the user.
	* The signer will prompt the user for approval before signing and
	* submitting the call to the Internet Computer.
	* @param params - The canister call parameters.
	* @param params.canisterId - The target canister.
	* @param params.sender - The principal executing the call.
	* @param params.method - The canister method to invoke.
	* @param params.arg - The Candid-encoded call arguments.
	* @param params.nonce - Optional nonce (max 32 bytes) for replay protection.
	* @returns The CBOR-encoded content map and certificate from the IC,
	*   which can be used to verify the call's execution.
	* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_49_call_canister.md
	*/
	callCanister(params) {
		return this.#rpc({
			method: "icrc49_call_canister",
			params,
			encode: (v) => ({
				canisterId: v.canisterId.toText(),
				sender: v.sender.toText(),
				method: v.method,
				arg: toBase64$1(v.arg),
				nonce: v.nonce !== void 0 ? toBase64$1(v.nonce) : void 0
			}),
			decode: (result) => {
				const r = asRecord(result);
				const contentMap = asString(r?.contentMap);
				const certificate = asString(r?.certificate);
				if (!contentMap || !certificate) throw new Error("Expected { contentMap, certificate }");
				return {
					contentMap: fromBase64$1(contentMap),
					certificate: fromBase64$1(certificate)
				};
			}
		});
	}
	/**
	* Sends a JSON-RPC request to the signer and decodes the result.
	* Handles encoding params, validating the response, and throwing
	* {@link SignerError} on JSON-RPC errors or invalid results.
	* @param args - The RPC call configuration.
	*/
	async #rpc(args) {
		let params;
		if (args.encode) try {
			params = args.encode(args.params);
		} catch (cause) {
			throw new SignerError({
				code: GENERIC_ERROR,
				message: `Failed to encode params: ${cause instanceof Error ? cause.message : cause}`
			}, { cause });
		}
		const response = await this.sendRequest({
			id: this.#options.crypto.randomUUID(),
			jsonrpc: "2.0",
			method: args.method,
			params
		});
		if ("error" in response) throw new SignerError(response.error);
		if ("result" in response) try {
			return args.decode(response.result);
		} catch (cause) {
			throw new SignerError({
				code: GENERIC_ERROR,
				message: `Invalid result from signer: ${cause instanceof Error ? cause.message : cause}`
			}, { cause });
		}
		throw new SignerError({
			code: GENERIC_ERROR,
			message: "Response contains neither result nor error"
		});
	}
	/**
	* Applies all configured transforms to a JSON-RPC request.
	* @param request - The JSON-RPC request to transform.
	*/
	#applyTransforms(request) {
		return this.#options.transforms.reduce((req, transform) => transform(req), request);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+signer@5.4.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/signer/lib/esm/transport.js
var isJsonRpcResponse = (message) => typeof message === "object" && message !== null && message.jsonrpc === "2.0" && "id" in message && (typeof message.id === "string" || typeof message.id === "number");
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+signer@5.4.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/signer/lib/esm/web/heartbeat/client.js
var HeartbeatClient = class {
	#options;
	#status;
	constructor(options) {
		this.#options = {
			establishTimeout: 1e4,
			pendingTimeout: 3e5,
			disconnectTimeout: 5e3,
			statusPollingRate: 300,
			window: globalThis.window,
			crypto: globalThis.crypto,
			...options
		};
		this.#establish();
	}
	#establish() {
		let pending = [];
		const create = () => {
			const id = this.#options.crypto.randomUUID();
			pending.push(id);
			return id;
		};
		const listener = this.#receiveStatusResponse((response) => {
			if ("result" in response.data && response.data.id !== null && pending.includes(response.data.id)) {
				pending = [];
				listener();
				clearInterval(interval);
				clearTimeout(timeout);
				this.#status = response.data.result;
				this.#options.onEstablish(response.origin, response.data.result);
				this.#maintain(response.origin, response.data.result);
			}
		});
		const timeout = setTimeout(() => {
			listener();
			clearInterval(interval);
			this.#options.onEstablishTimeout();
		}, this.#options.establishTimeout);
		const interval = setInterval(() => this.#sendStatusRequest(create()), this.#options.statusPollingRate);
	}
	#maintain(origin, status) {
		let timeout;
		let pending = [];
		const consume = (id) => {
			const index = pending.findIndex((entry) => entry.id === id);
			if (index > -1) pending.splice(index, 1);
			return index > -1;
		};
		const create = () => {
			const id = this.#options.crypto.randomUUID();
			const time = Date.now();
			pending = pending.filter((entry) => time - this.#options.disconnectTimeout > entry.time);
			pending.push({
				id,
				time
			});
			return id;
		};
		const resetTimeout = (status) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				listener();
				this.#options.onDisconnect();
			}, status === "pending" ? this.#options.pendingTimeout : this.#options.disconnectTimeout);
		};
		const listener = this.#receiveStatusResponse((response) => {
			if ("result" in response.data && response.data.id !== null && response.origin === origin && consume(response.data.id)) {
				resetTimeout(response.data.result);
				if (this.#status !== response.data.result) {
					this.#status = response.data.result;
					this.#options.onStatusChange(response.data.result);
				}
			}
			setTimeout(() => this.#sendStatusRequest(create()), this.#options.statusPollingRate);
		});
		resetTimeout(status);
		this.#sendStatusRequest(create());
	}
	#receiveStatusResponse(handler) {
		const listener = (event) => {
			if (event.source === this.#options.signerWindow && isJsonRpcResponse(event.data) && "result" in event.data && event.data.result === "pending" || event.data.result === "ready") handler(event);
		};
		this.#options.window.addEventListener("message", listener);
		return () => this.#options.window.removeEventListener("message", listener);
	}
	#sendStatusRequest(id) {
		this.#options.signerWindow.postMessage({
			jsonrpc: "2.0",
			id,
			method: "icrc29_status"
		}, "*");
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+signer@5.4.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/signer/lib/esm/web/postMessageTransport.js
var NON_CLICK_ESTABLISHMENT_LINK = "https://github.com/slide-computer/signer-js/blob/main/packages/signer-web/README.md#channels-must-be-established-in-a-click-handler";
/** Error thrown by {@link PostMessageTransport} for transport-level failures. */
var PostMessageTransportError = class extends Error {};
var withinClick = false;
if (globalThis.window) {
	globalThis.window.addEventListener("click", () => withinClick = true, true);
	globalThis.window.addEventListener("click", () => withinClick = false);
}
/**
* ICRC-29 post message transport for communicating with web-based signers.
*
* Opens a window to the signer's URL and establishes a communication channel
* using the ICRC-29 heartbeat protocol (`icrc29_status` polling). Messages
* are exchanged via `window.postMessage`.
* @see https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_29_window_post_message_transport.md
* @example
* ```ts
* const transport = new PostMessageTransport({ url: "https://oisy.com/sign" });
* const signer = new Signer({ transport });
* ```
*/
var PostMessageTransport = class {
	#options;
	constructor(options) {
		if (!(() => {
			try {
				const url = new URL(options.url);
				return url.protocol === "https:" || url.hostname === "127.0.0.1" || url.hostname.split(".").slice(-1)[0] === "localhost";
			} catch {
				return false;
			}
		})()) throw new PostMessageTransportError("Invalid signer RPC url");
		this.#options = {
			windowOpenerFeatures: "",
			window: globalThis.window,
			establishTimeout: 12e4,
			pendingTimeout: 3e5,
			disconnectTimeout: 2e3,
			statusPollingRate: 300,
			crypto: globalThis.crypto,
			manageFocus: true,
			closeOnEstablishTimeout: true,
			closeOnPendingTimeout: true,
			detectNonClickEstablishment: true,
			...options
		};
	}
	/**
	* Opens the signer window and establishes a communication channel
	* via the ICRC-29 heartbeat handshake.
	* @throws {PostMessageTransportError} If called outside a click handler
	*   (when `detectNonClickEstablishment` is enabled), if the window
	*   cannot be opened, or if the handshake times out.
	*/
	establishChannel() {
		if (this.#options.detectNonClickEstablishment && !withinClick) return Promise.reject(new PostMessageTransportError(`Signer window should not be opened outside of click handler, see: ${NON_CLICK_ESTABLISHMENT_LINK}`));
		let signerWindow;
		try {
			const result = this.#options.window.open(this.#options.url, `${new URL(this.#options.url).origin}-signer-window`, this.#options.windowOpenerFeatures);
			if (!result) return Promise.reject(new PostMessageTransportError("Signer window could not be opened"));
			signerWindow = result;
		} catch (error) {
			return Promise.reject(new PostMessageTransportError(error instanceof Error ? error.message : "Signer window could not be opened"));
		}
		return new Promise((resolve, reject) => {
			let channel;
			new HeartbeatClient({
				...this.#options,
				signerWindow,
				onEstablish: (origin, status) => {
					channel = new PostMessageChannel({
						...this.#options,
						signerOrigin: origin,
						signerWindow,
						signerStatus: status
					});
					resolve(channel);
				},
				onEstablishTimeout: () => {
					if (this.#options.closeOnEstablishTimeout) signerWindow.close();
					reject(new PostMessageTransportError("Communication channel could not be established within a reasonable time"));
				},
				onPendingTimeout: () => {
					if (this.#options.closeOnPendingTimeout) signerWindow.close();
					reject(new PostMessageTransportError("Communication channel was pending for too long"));
				},
				onDisconnect: () => channel.close(),
				onStatusChange: (status) => channel.changeStatus(status)
			});
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+signer@5.4.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/signer/lib/esm/web/postMessageChannel.js
/**
* A {@link Channel} implementation that communicates with a signer
* via `window.postMessage`. Created by {@link PostMessageTransport}
* after the ICRC-29 heartbeat handshake completes.
*
* Messages are filtered by source window and origin to prevent
* cross-origin interference. When the signer status is `"pending"`,
* outgoing messages are queued and flushed when it becomes `"ready"`.
*/
var PostMessageChannel = class {
	#closeListeners = /* @__PURE__ */ new Set();
	#options;
	#closed = false;
	#pendingQueue = [];
	constructor(options) {
		this.#options = {
			signerStatus: "ready",
			window: globalThis.window,
			manageFocus: true,
			...options
		};
	}
	/** Whether this channel has been closed. */
	get closed() {
		return this.#closed;
	}
	addEventListener(...[event, listener]) {
		switch (event) {
			case "close":
				this.#closeListeners.add(listener);
				return () => {
					this.#closeListeners.delete(listener);
				};
			case "response": {
				const messageListener = (event) => {
					if (event.source !== this.#options.signerWindow || event.origin !== this.#options.signerOrigin || !isJsonRpcResponse(event.data)) return;
					listener(event.data);
				};
				this.#options.window.addEventListener("message", messageListener);
				return () => {
					this.#options.window.removeEventListener("message", messageListener);
				};
			}
		}
	}
	/**
	* Sends a JSON-RPC request to the signer. If the signer status is
	* `"pending"`, the request is queued until {@link changeStatus} is
	* called with `"ready"`.
	* @param request - The JSON-RPC request to send.
	*/
	send(request) {
		if (this.#closed) return Promise.reject(new PostMessageTransportError("Communication channel is closed"));
		if (this.#options.signerStatus === "pending") {
			this.#pendingQueue.push(request);
			return Promise.resolve();
		}
		try {
			this.#options.signerWindow.postMessage(request, this.#options.signerOrigin);
			if (this.#options.manageFocus) this.#options.signerWindow.focus();
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve();
	}
	/** Closes the signer window and notifies all close listeners. */
	close() {
		if (this.#closed) return Promise.resolve();
		this.#closed = true;
		this.#options.signerWindow.close();
		if (this.#options.manageFocus) this.#options.window.focus();
		for (const listener of this.#closeListeners) listener();
		return Promise.resolve();
	}
	/**
	* Updates the signer status. When transitioning to `"ready"`,
	* all queued messages are flushed to the signer window.
	* @param status - The new signer status.
	*/
	changeStatus(status) {
		this.#options.signerStatus = status;
		if (status === "ready") {
			const requests = this.#pendingQueue;
			this.#pendingQueue = [];
			requests.forEach((request) => {
				this.#options.signerWindow.postMessage(request, this.#options.signerOrigin);
			});
		}
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+auth@7.1.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/auth/dist/esm/client/idle-manager.js
var events = [
	"mousedown",
	"mousemove",
	"keydown",
	"touchstart",
	"wheel"
];
/**
* Detects if the user has been idle for a duration of `idleTimeout` ms, and calls `onIdle` and registered callbacks.
* By default, the IdleManager will log a user out after 10 minutes of inactivity.
* To override these defaults, you can pass an `onIdle` callback, or configure a custom `idleTimeout` in milliseconds.
*
* IdleManager is a singleton: multiple calls to `create()` return the same instance,
* registering any new `onIdle` callback. Call `exit()` to tear down the singleton.
*/
var IdleManager = class IdleManager {
	static #instance;
	#callbacks = [];
	#idleTimeout;
	#timeoutID = void 0;
	#resetTimer;
	/**
	* Creates or returns the singleton {@link IdleManager}.
	* If the instance already exists, any provided `onIdle` callback is registered
	* on the existing instance.
	* @param {IdleManagerOptions} options Optional configuration
	* @see {@link IdleManagerOptions}
	* @param options.onIdle Callback once user has been idle. Use to prompt for fresh sign-in, and use `Actor.agentOf(your_actor).invalidateIdentity()` to protect the user
	* @param options.idleTimeout timeout in ms
	* @param options.captureScroll capture scroll events
	* @param options.scrollDebounce scroll debounce time in ms
	*/
	static create(options = {}) {
		if (IdleManager.#instance) {
			if (options.onIdle) IdleManager.#instance.registerCallback(options.onIdle);
			return IdleManager.#instance;
		}
		const instance = new IdleManager(options);
		IdleManager.#instance = instance;
		return instance;
	}
	/**
	* @param options {@link IdleManagerOptions}
	*/
	constructor(options = {}) {
		const { onIdle, idleTimeout = 6e5 } = options || {};
		this.#callbacks = onIdle ? [onIdle] : [];
		this.#idleTimeout = idleTimeout;
		this.#resetTimer = this._resetTimer.bind(this);
		window.addEventListener("load", this.#resetTimer, true);
		events.forEach((name) => {
			document.addEventListener(name, this.#resetTimer, true);
		});
		const debounce = (func, wait) => {
			let timeout;
			return (...args) => {
				const context = this;
				const later = () => {
					timeout = void 0;
					func.apply(context, args);
				};
				clearTimeout(timeout);
				timeout = window.setTimeout(later, wait);
			};
		};
		if (options?.captureScroll) {
			const scroll = debounce(this.#resetTimer, options?.scrollDebounce ?? 100);
			window.addEventListener("scroll", scroll, true);
		}
		this.#resetTimer();
	}
	/**
	* @param {IdleCB} callback function to be called when user goes idle
	*/
	registerCallback(callback) {
		this.#callbacks.push(callback);
	}
	/**
	* Tears down listeners, fires all callbacks, and clears the singleton.
	*/
	exit() {
		clearTimeout(this.#timeoutID);
		window.removeEventListener("load", this.#resetTimer, true);
		events.forEach((name) => {
			document.removeEventListener(name, this.#resetTimer, true);
		});
		this.#callbacks.forEach((cb) => {
			cb();
		});
		IdleManager.#instance = void 0;
	}
	/**
	* Resets the timeouts during cleanup
	*/
	_resetTimer() {
		const exit = this.exit.bind(this);
		window.clearTimeout(this.#timeoutID);
		this.#timeoutID = window.setTimeout(exit, this.#idleTimeout);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
	return idbProxyableTypes || (idbProxyableTypes = [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	]);
}
function getCursorAdvanceMethods() {
	return cursorAdvanceMethods || (cursorAdvanceMethods = [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
	const promise = new Promise((resolve, reject) => {
		const unlisten = () => {
			request.removeEventListener("success", success);
			request.removeEventListener("error", error);
		};
		const success = () => {
			resolve(wrap(request.result));
			unlisten();
		};
		const error = () => {
			reject(request.error);
			unlisten();
		};
		request.addEventListener("success", success);
		request.addEventListener("error", error);
	});
	promise.then((value) => {
		if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
	}).catch(() => {});
	reverseTransformCache.set(promise, request);
	return promise;
}
function cacheDonePromiseForTransaction(tx) {
	if (transactionDoneMap.has(tx)) return;
	const done = new Promise((resolve, reject) => {
		const unlisten = () => {
			tx.removeEventListener("complete", complete);
			tx.removeEventListener("error", error);
			tx.removeEventListener("abort", error);
		};
		const complete = () => {
			resolve();
			unlisten();
		};
		const error = () => {
			reject(tx.error || new DOMException("AbortError", "AbortError"));
			unlisten();
		};
		tx.addEventListener("complete", complete);
		tx.addEventListener("error", error);
		tx.addEventListener("abort", error);
	});
	transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
	get(target, prop, receiver) {
		if (target instanceof IDBTransaction) {
			if (prop === "done") return transactionDoneMap.get(target);
			if (prop === "objectStoreNames") return target.objectStoreNames || transactionStoreNamesMap.get(target);
			if (prop === "store") return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
		}
		return wrap(target[prop]);
	},
	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
	has(target, prop) {
		if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) return true;
		return prop in target;
	}
};
function replaceTraps(callback) {
	idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
	if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
		const tx = func.call(unwrap(this), storeNames, ...args);
		transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
		return wrap(tx);
	};
	if (getCursorAdvanceMethods().includes(func)) return function(...args) {
		func.apply(unwrap(this), args);
		return wrap(cursorRequestMap.get(this));
	};
	return function(...args) {
		return wrap(func.apply(unwrap(this), args));
	};
}
function transformCachableValue(value) {
	if (typeof value === "function") return wrapFunction(value);
	if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
	if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
	return value;
}
function wrap(value) {
	if (value instanceof IDBRequest) return promisifyRequest(value);
	if (transformCache.has(value)) return transformCache.get(value);
	const newValue = transformCachableValue(value);
	if (newValue !== value) {
		transformCache.set(value, newValue);
		reverseTransformCache.set(newValue, value);
	}
	return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/index.js
/**
* Open a database.
*
* @param name Name of the database.
* @param version Schema version.
* @param callbacks Additional callbacks.
*/
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
	const request = indexedDB.open(name, version);
	const openPromise = wrap(request);
	if (upgrade) request.addEventListener("upgradeneeded", (event) => {
		upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
	});
	if (blocked) request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
	openPromise.then((db) => {
		if (terminated) db.addEventListener("close", () => terminated());
		if (blocking) db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
	}).catch(() => {});
	return openPromise;
}
var readMethods = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
];
var writeMethods = [
	"put",
	"add",
	"delete",
	"clear"
];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
	if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) return;
	if (cachedMethods.get(prop)) return cachedMethods.get(prop);
	const targetFuncName = prop.replace(/FromIndex$/, "");
	const useIndex = prop !== targetFuncName;
	const isWrite = writeMethods.includes(targetFuncName);
	if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
	const method = async function(storeName, ...args) {
		const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
		let target = tx.store;
		if (useIndex) target = target.index(args.shift());
		return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
	};
	cachedMethods.set(prop, method);
	return method;
}
replaceTraps((oldTraps) => ({
	...oldTraps,
	get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
	has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+auth@7.1.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/auth/dist/esm/client/db.js
var AUTH_DB_NAME = "auth-client-db";
var OBJECT_STORE_NAME = "ic-keyval";
var _openDbStore = async (dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version) => {
	if (globalThis.localStorage?.getItem("delegation")) {
		globalThis.localStorage.removeItem(KEY_STORAGE_DELEGATION);
		globalThis.localStorage.removeItem(KEY_STORAGE_KEY);
	}
	return await openDB(dbName, version, { upgrade: (database) => {
		if (database.objectStoreNames.contains(storeName)) database.clear(storeName);
		database.createObjectStore(storeName);
	} });
};
async function _getValue(db, storeName, key) {
	return await db.get(storeName, key);
}
async function _setValue(db, storeName, key, value) {
	return await db.put(storeName, value, key);
}
async function _removeValue(db, storeName, key) {
	return await db.delete(storeName, key);
}
/**
* Simple Key Value store
* Defaults to `'auth-client-db'` with an object store of `'ic-keyval'`
*/
var IdbKeyVal = class IdbKeyVal {
	_db;
	_storeName;
	/**
	* @param {DBCreateOptions} options - DBCreateOptions
	* @param {DBCreateOptions['dbName']} options.dbName name for the indexeddb database
	* @default
	* @param {DBCreateOptions['storeName']} options.storeName name for the indexeddb Data Store
	* @default
	* @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
	*/
	static async create(options) {
		const { dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version = 1 } = options ?? {};
		const db = await _openDbStore(dbName, storeName, version);
		return new IdbKeyVal(db, storeName);
	}
	constructor(_db, _storeName) {
		this._db = _db;
		this._storeName = _storeName;
	}
	/**
	* Basic setter
	* @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
	* @param value value to set
	* @returns void
	*/
	async set(key, value) {
		return await _setValue(this._db, this._storeName, key, value);
	}
	/**
	* Basic getter
	* Pass in a type T for type safety if you know the type the value will have if it is found
	* @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
	* @returns `Promise<T | null>`
	* @example
	* await get<string>('exampleKey') -> 'exampleValue'
	*/
	async get(key) {
		return await _getValue(this._db, this._storeName, key) ?? null;
	}
	/**
	* Remove a key
	* @param key {@link IDBValidKey}
	* @returns void
	*/
	async remove(key) {
		return await _removeValue(this._db, this._storeName, key);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+auth@7.1.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/auth/dist/esm/client/storage.js
var KEY_STORAGE_KEY = "identity";
var KEY_STORAGE_DELEGATION = "delegation";
/**
* Legacy implementation of AuthClientStorage, for use where IndexedDb is not available
*/
var LocalStorage = class {
	prefix;
	_localStorage;
	constructor(prefix = "ic-", _localStorage) {
		this.prefix = prefix;
		this._localStorage = _localStorage;
	}
	get(key) {
		return Promise.resolve(this._getLocalStorage().getItem(this.prefix + key));
	}
	set(key, value) {
		this._getLocalStorage().setItem(this.prefix + key, value);
		return Promise.resolve();
	}
	remove(key) {
		this._getLocalStorage().removeItem(this.prefix + key);
		return Promise.resolve();
	}
	_getLocalStorage() {
		if (this._localStorage) return this._localStorage;
		const ls = globalThis.localStorage;
		if (!ls) throw new Error("Could not find local storage.");
		return ls;
	}
};
/**
* IdbStorage is an interface for simple storage of string key-value pairs built on {@link IdbKeyVal}
*
* It replaces {@link LocalStorage}
* @see implements {@link AuthClientStorage}
*/
var IdbStorage = class {
	#options;
	/**
	* @param options - DBCreateOptions
	* @param options.dbName - name for the indexeddb database
	* @param options.storeName - name for the indexeddb Data Store
	* @param options.version - version of the database. Increment to safely upgrade
	* @example
	* ```ts
	* const storage = new IdbStorage({ dbName: 'my-db', storeName: 'my-store', version: 2 });
	* ```
	*/
	constructor(options) {
		this.#options = options ?? {};
	}
	initializedDb;
	get _db() {
		return new Promise((resolve, reject) => {
			if (this.initializedDb) {
				resolve(this.initializedDb);
				return;
			}
			IdbKeyVal.create(this.#options).then((db) => {
				this.initializedDb = db;
				resolve(db);
			}).catch(reject);
		});
	}
	async get(key) {
		return await (await this._db).get(key);
	}
	async set(key, value) {
		await (await this._db).set(key, value);
	}
	async remove(key) {
		await (await this._db).remove(key);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+auth@7.1.0_@icp-sdk+core@5.4.0/node_modules/@icp-sdk/auth/dist/esm/client/auth-client.js
var NANOSECONDS_PER_HOUR = BigInt(1e9) * BigInt(3600);
var IDENTITY_PROVIDER_DEFAULT = "https://id.ai/authorize";
var DEFAULT_MAX_TIME_TO_LIVE = BigInt(8) * NANOSECONDS_PER_HOUR;
var ECDSA_KEY_LABEL = "ECDSA";
var ED25519_KEY_LABEL = "Ed25519";
var KEY_STORAGE_EXPIRATION = "ic-delegation_expiration";
var OPENID_PROVIDER_URLS = {
	google: "https://accounts.google.com",
	apple: "https://appleid.apple.com",
	microsoft: "https://login.microsoftonline.com/{tid}/v2.0"
};
var DEFAULT_OPENID_SCOPE_KEYS = [
	"name",
	"email",
	"verified_email"
];
/**
* Manages authentication and identity for Internet Computer web apps.
*
* @example
* const authClient = new AuthClient();
*
* const identity = authClient.isAuthenticated()
*   ? await authClient.getIdentity()
*   : await authClient.signIn();
*/
var AuthClient = class {
	#identity = new AnonymousIdentity();
	#chain = null;
	#storage;
	#signer;
	#options;
	#initPromise = null;
	idleManager;
	constructor(options = {}) {
		this.#options = options;
		this.#storage = options.storage ?? new IdbStorage();
		const identityProviderUrl = new URL(options.identityProvider?.toString() || IDENTITY_PROVIDER_DEFAULT);
		if (options.openIdProvider) identityProviderUrl.searchParams.set("openid", OPENID_PROVIDER_URLS[options.openIdProvider]);
		const transport = new PostMessageTransport({
			url: identityProviderUrl.toString(),
			windowOpenerFeatures: options.windowOpenerFeatures
		});
		this.#signer = new Signer({
			transport,
			derivationOrigin: options.derivationOrigin?.toString()
		});
		this.#registerDefaultIdleCallback();
		this.#init();
	}
	/**
	* Returns the current identity, restoring a previous session if available.
	*/
	async getIdentity() {
		await this.#init();
		return this.#identity;
	}
	/**
	* Checks whether the user has an active, non-expired session.
	*/
	isAuthenticated() {
		const expiration = getExpirationFlag();
		if (expiration === null) return false;
		return BigInt(Date.now()) * BigInt(1e6) < expiration;
	}
	/**
	* Opens the identity provider, requests a delegation, and returns the authenticated identity.
	*
	* @param options - Sign-in options.
	* @param options.maxTimeToLive - Maximum lifetime of the delegation in nanoseconds.
	* @param options.targets - Restrict the delegation to specific canisters.
	* @returns The authenticated identity.
	* @throws When authentication fails.
	*
	* @example
	* try {
	*   const identity = await authClient.signIn();
	* } catch (error) {
	*   console.error('Sign-in failed:', error);
	* }
	*/
	async signIn(options) {
		await this.#signer.openChannel();
		const maxTimeToLive = options?.maxTimeToLive ?? DEFAULT_MAX_TIME_TO_LIVE;
		const key = this.#options.identity ?? await generateKey(this.#options.keyType ?? ECDSA_KEY_LABEL);
		const delegationChain = await this.#signer.requestDelegation({
			publicKey: key.getPublicKey(),
			targets: options?.targets,
			maxTimeToLive
		});
		this.#chain = delegationChain;
		if ("toDer" in key) this.#identity = PartialDelegationIdentity.fromDelegation(key, this.#chain);
		else this.#identity = DelegationIdentity.fromDelegation(key, this.#chain);
		const idleOptions = this.#options?.idleOptions;
		if (!this.idleManager && !idleOptions?.disableIdle) {
			this.idleManager = IdleManager.create(idleOptions);
			this.#registerDefaultIdleCallback();
		}
		await persistChain(this.#storage, this.#chain);
		await persistKey(this.#storage, key);
		return this.#identity;
	}
	/**
	* Requests signed identity attributes from the identity provider.
	*
	* The `nonce` may be a `Uint8Array` or a `Promise<Uint8Array>`. Passing a
	* promise lets the identity provider window open while the nonce (typically
	* fetched from the RP canister) is still being resolved, avoiding a perceived
	* delay before the user sees the prompt. Auto-close of the signer transport
	* channel is temporarily disabled while awaiting the promise so the window
	* cannot be closed out from under the pending flow.
	*
	* @param params - Request parameters.
	* @param params.keys - Attribute keys to request (e.g. `['email', 'name']`).
	* @param params.nonce - 32-byte nonce issued by the RP canister, or a promise
	*   resolving to one.
	* @returns Signed attribute data and signature.
	* @throws When the identity provider returns an error or an invalid response.
	*/
	async requestAttributes(params) {
		const nonceBytes = await this.#resolveNonce(params.nonce);
		const response = await this.#signer.sendRequest({
			jsonrpc: "2.0",
			id: globalThis.crypto.randomUUID(),
			method: "ii-icrc3-attributes",
			params: {
				keys: params.keys,
				nonce: toBase64(nonceBytes)
			}
		});
		if ("error" in response) throw new Error(response.error.message);
		const result = response.result;
		if (typeof result?.data !== "string" || typeof result?.signature !== "string") throw new Error("Invalid response: missing data or signature");
		try {
			return {
				data: fromBase64(result.data),
				signature: fromBase64(result.signature)
			};
		} catch (cause) {
			throw new Error("Invalid response: data or signature is not valid base64", { cause });
		}
	}
	/**
	* Clears the stored session and resets the client to an anonymous state.
	*
	* @param options - Sign-out options.
	* @param options.returnTo - URL to navigate to after sign-out.
	*/
	async signOut(options = {}) {
		await deleteStorage(this.#storage);
		this.#identity = new AnonymousIdentity();
		this.#chain = null;
		if (options.returnTo) try {
			window.history.pushState({}, "", options.returnTo);
		} catch {
			window.location.href = options.returnTo;
		}
	}
	async #resolveNonce(nonce) {
		if (!(nonce instanceof Promise)) return nonce;
		await this.#signer.openChannel();
		const previousAutoClose = this.#signer.autoCloseTransportChannel;
		this.#signer.autoCloseTransportChannel = false;
		try {
			return await nonce;
		} finally {
			this.#signer.autoCloseTransportChannel = previousAutoClose;
		}
	}
	#init() {
		if (!this.#initPromise) this.#initPromise = this.#hydrate();
		return this.#initPromise;
	}
	async #hydrate() {
		const key = this.#options.identity ?? await restoreKey(this.#storage, this.#options.keyType ?? ECDSA_KEY_LABEL);
		if (!key) return;
		const chain = await restoreChain(this.#storage);
		if (!chain) return;
		this.#chain = chain;
		if ("toDer" in key) this.#identity = PartialDelegationIdentity.fromDelegation(key, chain);
		else this.#identity = DelegationIdentity.fromDelegation(key, chain);
		if (!this.#options.idleOptions?.disableIdle && !this.idleManager) {
			this.idleManager = IdleManager.create(this.#options.idleOptions);
			this.#registerDefaultIdleCallback();
		}
	}
	#registerDefaultIdleCallback() {
		const idleOptions = this.#options?.idleOptions;
		if (!idleOptions?.onIdle && !idleOptions?.disableDefaultIdleCallback) this.idleManager?.registerCallback(() => {
			this.signOut();
			location.reload();
		});
	}
};
/**
* Encodes a Uint8Array to a base64 string.
* @param bytes - The bytes to encode.
*/
function toBase64(bytes) {
	if ("toBase64" in bytes && typeof bytes.toBase64 === "function") return bytes.toBase64();
	let binary = "";
	for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
	return globalThis.btoa(binary);
}
/**
* Decodes a base64 string to a Uint8Array.
* @param str - The base64-encoded string.
*/
function fromBase64(str) {
	if ("fromBase64" in Uint8Array && typeof Uint8Array.fromBase64 === "function") return Uint8Array.fromBase64(str);
	const binary = globalThis.atob(str);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
/**
* Generates a new session key.
* @param keyType - The key algorithm to use.
*/
async function generateKey(keyType) {
	if (keyType === ED25519_KEY_LABEL) return Ed25519KeyIdentity.generate();
	return await ECDSAKeyIdentity.generate();
}
/**
* Saves a session key to storage.
* @param storage - The storage backend.
* @param key - The key to persist.
*/
async function persistKey(storage, key) {
	await storage.set(KEY_STORAGE_KEY, serializeKey(key));
}
/**
* Loads a session key from storage. Falls back to migrating a legacy
* key from localStorage if nothing is found in the primary store.
* @param storage - The storage backend.
* @param keyType - The expected key algorithm (determines deserialization).
*/
async function restoreKey(storage, keyType) {
	let stored = await storage.get(KEY_STORAGE_KEY);
	if (!stored) stored = await migrateFromLocalStorage(storage, keyType);
	if (!stored) return null;
	try {
		if (typeof stored === "object") return await ECDSAKeyIdentity.fromKeyPair(stored);
		return Ed25519KeyIdentity.fromJSON(stored);
	} catch {
		return null;
	}
}
/**
* Converts a key into a format suitable for storage.
* @param key - The key to serialize.
*/
function serializeKey(key) {
	if (key instanceof ECDSAKeyIdentity) return key.getKeyPair();
	if (key instanceof Ed25519KeyIdentity) return JSON.stringify(key.toJSON());
	throw new Error("Unsupported key type");
}
/**
* Saves the delegation chain and caches its earliest expiration
* in localStorage so {@link AuthClient.isAuthenticated} can check it synchronously.
* @param storage - The storage backend.
* @param chain - The delegation chain to persist.
*/
async function persistChain(storage, chain) {
	await storage.set(KEY_STORAGE_DELEGATION, JSON.stringify(chain.toJSON()));
	let earliest = null;
	for (const { delegation } of chain.delegations) if (earliest === null || delegation.expiration < earliest) earliest = delegation.expiration;
	if (earliest !== null) localStorage.setItem(KEY_STORAGE_EXPIRATION, earliest.toString());
}
/**
* Loads the delegation chain from storage. Returns `null` and wipes
* storage if the chain is expired or corrupted.
* @param storage - The storage backend.
*/
async function restoreChain(storage) {
	try {
		const raw = await storage.get(KEY_STORAGE_DELEGATION);
		if (!raw || typeof raw !== "string") return null;
		const chain = DelegationChain.fromJSON(raw);
		if (!isDelegationValid(chain)) {
			await deleteStorage(storage);
			return null;
		}
		return chain;
	} catch (e) {
		console.error(e);
		await deleteStorage(storage);
		return null;
	}
}
/**
* Clears all session data from storage.
* @param storage - The storage backend.
*/
async function deleteStorage(storage) {
	await storage.remove(KEY_STORAGE_KEY);
	await storage.remove(KEY_STORAGE_DELEGATION);
	await storage.remove("iv");
	localStorage.removeItem(KEY_STORAGE_EXPIRATION);
}
/** Reads the cached delegation expiration from localStorage (nanoseconds). */
function getExpirationFlag() {
	const value = localStorage.getItem(KEY_STORAGE_EXPIRATION);
	if (value === null) return null;
	return BigInt(value);
}
/**
* One-time migration: moves a legacy session stored in localStorage
* into the primary storage, then cleans up the old entries.
* @param storage - The target storage backend.
* @param keyType - The expected key algorithm (only ECDSA keys are migrated).
*/
async function migrateFromLocalStorage(storage, keyType) {
	try {
		const fallback = new LocalStorage();
		const localChain = await fallback.get(KEY_STORAGE_DELEGATION);
		const localKey = await fallback.get(KEY_STORAGE_KEY);
		if (!localChain || !localKey || keyType !== ECDSA_KEY_LABEL) return null;
		console.log("Discovered an identity stored in localstorage. Migrating to IndexedDB");
		await storage.set(KEY_STORAGE_DELEGATION, localChain);
		await storage.set(KEY_STORAGE_KEY, localKey);
		await fallback.remove(KEY_STORAGE_DELEGATION);
		await fallback.remove(KEY_STORAGE_KEY);
		return localKey;
	} catch (error) {
		console.error(`error while attempting to recover localstorage: ${error}`);
		return null;
	}
}
/**
* Scopes attribute keys to an OpenID provider.
*
* When using one-click sign-in, attributes can be scoped to the same provider
* so the user grants access in a single step without an additional prompt.
*
* @param params.openIdProvider - The OpenID provider the keys should be scoped to.
* @param params.keys - The attribute keys to scope. Defaults to `['name', 'email', 'verified_email']`.
* @returns The scoped attribute keys as `openid:<provider-url>:<key>`.
*
* @example
* scopedKeys({ openIdProvider: 'google', keys: ['email'] });
* // ['openid:https://accounts.google.com:email']
*/
function scopedKeys(params) {
	const provider = OPENID_PROVIDER_URLS[params.openIdProvider];
	return (params.keys ?? DEFAULT_OPENID_SCOPE_KEYS).map((key) => `openid:${provider}:${key}`);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+core-infrastructure@1.4.1_@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/core-infrastructure/dist/hooks/useInternetIdentity.js
var iiAttributesIDL = ({ IDL: I }) => I.Service({
	_internet_identity_sign_in_start: I.Func([], [I.Vec(I.Nat8)], []),
	_internet_identity_sign_in_finish: I.Func([], [I.Variant({
		ok: I.Null,
		err: I.Record({})
	})], []),
	_initialize_access_control: I.Func([], [], [])
});
var II_SIGNER_CANISTER_ID = {}.II_CANISTER_ID ?? "rdmx6-jaaaa-aaaaa-aaadq-cai";
var ONE_HOUR_IN_NANOSECONDS = BigInt(36e11);
var DEFAULT_IDENTITY_PROVIDER = "https://id.ai/authorize";
var DEFAULT_ATTRIBUTE_KEYS = ["verified_email"];
var InternetIdentityReactContext = (0, import_react.createContext)(void 0);
/**
* Single constructor for every `AuthClient` — the shared client built at
* provider initialization and the per-login clients for the one-click and
* SSO variants (`identityProvider` and `openIdProvider` are constructor-only
* options on `@icp-sdk/auth`, so variants need their own client).
* Delegation storage is shared across all clients, so a variant sign-in is
* still restored by the shared client on reload and cleared by `clear()`.
*
* Deliberately synchronous: the signer window must be opened inside the
* click's user-activation frame, so no awaits are allowed between the click
* and `signIn()`. Callers that may run before the config cache is populated
* (provider initialization) must `await loadConfig()` first; the login path
* reads the cache, which is populated by then.
*/
function buildAuthClient(config, loginOptions, createOptions) {
	const identityProviderUrl = new URL((createOptions?.identityProvider ?? DEFAULT_IDENTITY_PROVIDER ?? "https://id.ai").toString());
	identityProviderUrl.pathname = "/authorize";
	const ssoDomain = loginOptions?.ssoDomain?.trim();
	if (ssoDomain) identityProviderUrl.searchParams.set("sso", ssoDomain);
	return new AuthClient({
		idleOptions: {
			disableDefaultIdleCallback: true,
			disableIdle: true,
			...createOptions?.idleOptions
		},
		derivationOrigin: config?.ii_derivation_origin,
		...createOptions,
		identityProvider: identityProviderUrl,
		openIdProvider: ssoDomain ? void 0 : loginOptions?.provider
	});
}
/**
* Pick the attribute keys to request from II for a sign-in variant. Explicit
* keys from `withAttributes` always win; otherwise the keys are scoped to the
* sign-in variant so the user grants access in a single step.
*/
function resolveAttributeKeys(attrs, loginOptions) {
	if (attrs.keys) return attrs.keys;
	const ssoDomain = loginOptions?.ssoDomain?.trim();
	if (ssoDomain) return [`sso:${ssoDomain}:name`, `sso:${ssoDomain}:email`];
	if (loginOptions?.provider) return scopedKeys({ openIdProvider: loginOptions.provider });
	return DEFAULT_ATTRIBUTE_KEYS;
}
/**
* Create an inline actor for the two IdentityAttributes mixin methods.
* Uses the same `backend_canister_id` and `backend_host` as the rest of the app.
*/
async function createIIAttributesActor(identity) {
	const config = await loadConfig();
	const agent = new HttpAgent({
		host: config.backend_host,
		identity
	});
	if (config.backend_host?.includes("localhost")) await agent.fetchRootKey().catch(() => {});
	return Actor.createActor(iiAttributesIDL, {
		agent,
		canisterId: config.backend_canister_id
	});
}
/**
* Helper function to set loginError state.
*/
function assertProviderPresent(context) {
	if (!context) throw new Error("InternetIdentityProvider is not present. Wrap your component tree with it.");
}
/**
* Hook to access the internet identity as well as loginStatus along with
* login and clear functions.
*/
var useInternetIdentity = () => {
	const context = (0, import_react.useContext)(InternetIdentityReactContext);
	assertProviderPresent(context);
	return context;
};
/**
* The InternetIdentityProvider component makes the saved identity available
* after page reloads. It also allows you to configure default options
* for AuthClient and login.
*
*
* @example
* ```tsx
* <InternetIdentityProvider>
*   <App />
* </InternetIdentityProvider>
* ```
*
* Attribute verification is enabled by default (`verified_email` from Internet Identity).
* Pass `withAttributes={false}` to use plain sign-in only, or override keys explicitly:
* ```tsx
* <InternetIdentityProvider withAttributes={{ keys: ['email', 'verified_email'] }}>
*   <App />
* </InternetIdentityProvider>
* ```
*/
function InternetIdentityProvider({ children, createOptions, withAttributes = {} }) {
	const [authClient, setAuthClient] = (0, import_react.useState)(void 0);
	const [identity, setIdentity] = (0, import_react.useState)(void 0);
	const [loginStatus, setStatus] = (0, import_react.useState)("initializing");
	const [loginError, setError] = (0, import_react.useState)(void 0);
	const withAttributesRef = (0, import_react.useRef)(withAttributes);
	withAttributesRef.current = withAttributes;
	const createOptionsRef = (0, import_react.useRef)(createOptions);
	createOptionsRef.current = createOptions;
	const setErrorMessage = (0, import_react.useCallback)((message) => {
		setStatus("loginError");
		setError(new Error(message));
	}, []);
	const handleLoginSuccess = (0, import_react.useCallback)(async (client) => {
		const latestIdentity = await client.getIdentity();
		if (!latestIdentity) {
			setErrorMessage("Identity not found after successful login");
			return;
		}
		setIdentity(latestIdentity);
		setStatus("success");
	}, [setErrorMessage]);
	const handleLoginError = (0, import_react.useCallback)((maybeError) => {
		setErrorMessage(maybeError ?? "Login failed");
	}, [setErrorMessage]);
	const login = (0, import_react.useCallback)((loginOptions) => {
		if (!authClient) {
			setErrorMessage("AuthClient is not initialized yet, make sure to call `login` on user interaction e.g. click.");
			return;
		}
		if (authClient.isAuthenticated()) {
			setErrorMessage("User is already authenticated");
			return;
		}
		if (loginOptions?.ssoDomain !== void 0 && !loginOptions.ssoDomain.trim()) {
			setErrorMessage("ssoDomain must be a non-empty domain such as \"acme.com\"");
			return;
		}
		const options = { maxTimeToLive: ONE_HOUR_IN_NANOSECONDS * BigInt(720) };
		setStatus("logging-in");
		const attrs = withAttributesRef.current;
		const startSignIn = (client) => {
			if (attrs !== false) {
				const noncePromise = createIIAttributesActor().then((actor) => actor._internet_identity_sign_in_start());
				const signInPromise = client.signIn(options);
				const attributesPromise = client.requestAttributes({
					keys: resolveAttributeKeys(attrs, loginOptions),
					nonce: noncePromise
				});
				Promise.all([signInPromise, attributesPromise]).then(async ([plainIdentity, { data, signature }]) => {
					const actor = await createIIAttributesActor(plainIdentity);
					if (!data || data.length === 0) {
						await handleLoginSuccess(client);
						await actor._initialize_access_control();
						return;
					}
					const signerCanisterId = Principal.fromText(II_SIGNER_CANISTER_ID);
					const finishActor = await createIIAttributesActor(new AttributesIdentity({
						inner: plainIdentity,
						attributes: {
							data,
							signature
						},
						signer: { canisterId: signerCanisterId }
					}));
					try {
						await finishActor._internet_identity_sign_in_finish();
					} catch (error) {
						console.error(error);
					}
					await handleLoginSuccess(client);
				}).catch((unknownError) => {
					handleLoginError(unknownError instanceof Error ? unknownError.message : void 0);
				});
			} else client.signIn(options).then(async (plainIdentity) => {
				await (await createIIAttributesActor(plainIdentity))._initialize_access_control();
				handleLoginSuccess(client);
			}).catch((unknownError) => {
				handleLoginError(unknownError instanceof Error ? unknownError.message : void 0);
			});
		};
		if (Boolean(loginOptions?.ssoDomain?.trim() || loginOptions?.provider)) try {
			startSignIn(buildAuthClient(getCachedConfig(), loginOptions ?? {}, createOptionsRef.current));
		} catch (unknownError) {
			handleLoginError(unknownError instanceof Error ? unknownError.message : void 0);
		}
		else startSignIn(authClient);
	}, [
		authClient,
		handleLoginError,
		handleLoginSuccess,
		setErrorMessage
	]);
	const clear = (0, import_react.useCallback)(() => {
		if (!authClient) {
			setErrorMessage("Auth client not initialized");
			return;
		}
		authClient.signOut().then(() => {
			setIdentity(void 0);
			setAuthClient(void 0);
			setStatus("idle");
			setError(void 0);
		}).catch((unknownError) => {
			setStatus("loginError");
			setError(unknownError instanceof Error ? unknownError : /* @__PURE__ */ new Error("Logout failed"));
		});
	}, [authClient, setErrorMessage]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				setStatus("initializing");
				let existingClient = authClient;
				if (!existingClient) {
					const config = await loadConfig();
					if (cancelled) return;
					existingClient = buildAuthClient(config, void 0, createOptions);
					setAuthClient(existingClient);
				}
				if (cancelled) return;
				if (existingClient.isAuthenticated()) {
					const loadedIdentity = await existingClient.getIdentity();
					if (cancelled) return;
					setIdentity(loadedIdentity);
					setStatus("success");
				} else {
					setIdentity(void 0);
					setStatus("idle");
				}
			} catch (unknownError) {
				if (cancelled) return;
				setIdentity(void 0);
				setStatus("loginError");
				setError(unknownError instanceof Error ? unknownError : /* @__PURE__ */ new Error("Initialization failed"));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [createOptions, authClient]);
	const value = (0, import_react.useMemo)(() => ({
		identity,
		login,
		clear,
		loginStatus,
		isInitializing: loginStatus === "initializing",
		isLoginIdle: loginStatus === "idle",
		isLoggingIn: loginStatus === "logging-in",
		isLoginSuccess: loginStatus === "success",
		isLoginError: loginStatus === "loginError",
		isAuthenticated: !!identity && !identity.getPrincipal().isAnonymous(),
		loginError
	}), [
		identity,
		login,
		clear,
		loginStatus,
		loginError
	]);
	return (0, import_react.createElement)(InternetIdentityReactContext.Provider, {
		value,
		children
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+core-infrastructure@1.4.1_@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/core-infrastructure/dist/hooks/useActor.js
var ACTOR_QUERY_KEY = "actor";
function useActor(createActor, options) {
	const { identity, isAuthenticated } = useInternetIdentity();
	const queryClient = useQueryClient();
	const mockModules = options?.mockModules;
	const actorQuery = useQuery({
		queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
		queryFn: async () => {
			if (!isAuthenticated) return await createActorWithConfig(createActor, { mockModules });
			return await createActorWithConfig(createActor, {
				agentOptions: { identity },
				mockModules
			});
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: true
	});
	(0, import_react.useEffect)(() => {
		if (actorQuery.data) {
			queryClient.invalidateQueries({ predicate: (query) => {
				return !query.queryKey.includes(ACTOR_QUERY_KEY);
			} });
			queryClient.refetchQueries({ predicate: (query) => {
				return !query.queryKey.includes(ACTOR_QUERY_KEY);
			} });
		}
	}, [actorQuery.data, queryClient]);
	return {
		actor: actorQuery.data || null,
		isFetching: actorQuery.isFetching
	};
}
export { resolveStaleTime as C, loadConfig as D, Subscribable as E, partialMatchKey as S, focusManager as T, hashKey as _, useQuery as a, matchQuery as b, Mutation as c, notifyManager as d, addConsumeAwareSignal as f, functionalUpdate as g, ensureQueryFn as h, useMutation as i, Query as l, addToStart as m, InternetIdentityProvider as n, QueryClientProvider as o, addToEnd as p, useInternetIdentity as r, useQueryClient as s, useActor as t, onlineManager as u, hashQueryKeyByOptions as v, skipToken as w, noop as x, matchMutation as y };
