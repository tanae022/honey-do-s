const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Home-CsyKSq69.js","assets/createLucideIcon-CK3986Sn.js","assets/rolldown-runtime-SbdDWaPq.js","assets/calendar-check-X2jabMoP.js","assets/HexTile-CHJQF8UZ.js","assets/HoneyCard-Dp51lMsB.js","assets/Request-D2TLFZ8E.js","assets/dist-DCUbDtYL.js","assets/check-qhjPHsNw.js","assets/label-DQWmTWtr.js","assets/dist-DWpcaKVu.js","assets/input-C4Zv5zIi.js","assets/textarea-_N2gIIQm.js","assets/Track-CimmWi0p.js","assets/message-square-Ciq8dACq.js","assets/send-BC-7IC_M.js","assets/thumbs-down-DKKayDLZ.js","assets/useAdminSettings-CtJqDOX4.js","assets/HexStatus-VnvmG7KX.js","assets/Dashboard-B5tY-ag5.js","assets/calendar-clock-BKRV_BaF.js","assets/calendar-plus-P14BfjVE.js","assets/file-text-BqDxuuUp.js","assets/admin-DxTl2OJo.js","assets/plus-BbIZ9xgk.js","assets/shield-alert-CwcHCNy3.js","assets/user-plus-DZOyHkAR.js","assets/useCustomers-it81kN8P.js","assets/admin-CtzrkfjB.js","assets/Requests-B6J63pFm.js","assets/Calendar-C0K83M12.js","assets/chevron-right-DovuHhu0.js","assets/map-pin-DHILvEJZ.js","assets/Customers-ByKDLgb4.js","assets/mail-CjefN9m4.js","assets/customers-CXB1Kudi.js","assets/CustomerProfile-nNmq-7cS.js","assets/arrow-left-JcWOqFAW.js","assets/Quotes-CXwtRCwy.js","assets/badge-check-CxAhc_Pv.js","assets/trash-2-hTaV3zpM.js","assets/Jobs-BVHZHOtg.js","assets/Payments-C7_MpPpE.js","assets/Messages-PLr5NS6Q.js","assets/Notifications-DNjriS4-.js","assets/Settings-Bqr-VNGZ.js","assets/Schedule-D28mbD0O.js"])))=>i.map(i=>d[i]);
import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime-SbdDWaPq.js";
import { C as resolveStaleTime, E as Subscribable, S as partialMatchKey, T as focusManager, _ as hashKey, a as useQuery, b as matchQuery, c as Mutation, d as notifyManager, f as addConsumeAwareSignal, g as functionalUpdate$1, h as ensureQueryFn, i as useMutation, l as Query, m as addToStart, n as InternetIdentityProvider, o as QueryClientProvider, p as addToEnd, r as useInternetIdentity, s as useQueryClient, t as useActor, u as onlineManager, v as hashQueryKeyByOptions, w as skipToken, x as noop, y as matchMutation } from "./dist-DCUbDtYL.js";
import { G as getService, K as cn, at as createActor, ct as require_react, it as ServiceCategory, l as countAwaitingQuote, ot as require_react_dom, st as require_jsx_runtime, t as createLucideIcon } from "./createLucideIcon-CK3986Sn.js";
// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
function infiniteQueryBehavior(pages) {
	return { onFetch: (context, query) => {
		const options = context.options;
		const direction = context.fetchOptions?.meta?.fetchMore?.direction;
		const oldPages = context.state.data?.pages || [];
		const oldPageParams = context.state.data?.pageParams || [];
		let result = {
			pages: [],
			pageParams: []
		};
		let currentPage = 0;
		const fetchFn = async () => {
			let cancelled = false;
			const addSignalProperty = (object) => {
				addConsumeAwareSignal(object, () => context.signal, () => cancelled = true);
			};
			const queryFn = ensureQueryFn(context.options, context.fetchOptions);
			const fetchPage = async (data, param, previous) => {
				if (cancelled) return Promise.reject();
				if (param == null && data.pages.length) return Promise.resolve(data);
				const createQueryFnContext = () => {
					const queryFnContext2 = {
						client: context.client,
						queryKey: context.queryKey,
						pageParam: param,
						direction: previous ? "backward" : "forward",
						meta: context.options.meta
					};
					addSignalProperty(queryFnContext2);
					return queryFnContext2;
				};
				const queryFnContext = createQueryFnContext();
				const page = await queryFn(queryFnContext);
				const { maxPages } = context.options;
				const addTo = previous ? addToStart : addToEnd;
				return {
					pages: addTo(data.pages, page, maxPages),
					pageParams: addTo(data.pageParams, param, maxPages)
				};
			};
			if (direction && oldPages.length) {
				const previous = direction === "backward";
				const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
				const oldData = {
					pages: oldPages,
					pageParams: oldPageParams
				};
				result = await fetchPage(oldData, pageParamFn(options, oldData), previous);
			} else {
				const remainingPages = pages ?? oldPages.length;
				do {
					const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
					if (currentPage > 0 && param == null) break;
					result = await fetchPage(result, param);
					currentPage++;
				} while (currentPage < remainingPages);
			}
			return result;
		};
		if (context.options.persister) context.fetchFn = () => {
			return context.options.persister?.(fetchFn, {
				client: context.client,
				queryKey: context.queryKey,
				meta: context.options.meta,
				signal: context.signal
			}, query);
		};
		else context.fetchFn = fetchFn;
	} };
}
function getNextPageParam(options, { pages, pageParams }) {
	const lastIndex = pages.length - 1;
	return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
	return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/mutationCache.js
var MutationCache = class extends Subscribable {
	constructor(config = {}) {
		super();
		this.config = config;
		this.#mutations = /* @__PURE__ */ new Set();
		this.#scopes = /* @__PURE__ */ new Map();
		this.#mutationId = 0;
	}
	#mutations;
	#scopes;
	#mutationId;
	build(client, options, state) {
		const mutation = new Mutation({
			client,
			mutationCache: this,
			mutationId: ++this.#mutationId,
			options: client.defaultMutationOptions(options),
			state
		});
		this.add(mutation);
		return mutation;
	}
	add(mutation) {
		this.#mutations.add(mutation);
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const scopedMutations = this.#scopes.get(scope);
			if (scopedMutations) scopedMutations.push(mutation);
			else this.#scopes.set(scope, [mutation]);
		}
		this.notify({
			type: "added",
			mutation
		});
	}
	remove(mutation) {
		if (this.#mutations.delete(mutation)) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const scopedMutations = this.#scopes.get(scope);
				if (scopedMutations) {
					if (scopedMutations.length > 1) {
						const index = scopedMutations.indexOf(mutation);
						if (index !== -1) scopedMutations.splice(index, 1);
					} else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
				}
			}
		}
		this.notify({
			type: "removed",
			mutation
		});
	}
	canRun(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const firstPendingMutation = this.#scopes.get(scope)?.find((m) => m.state.status === "pending");
			return !firstPendingMutation || firstPendingMutation === mutation;
		} else return true;
	}
	runNext(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") return (this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused))?.continue() ?? Promise.resolve();
		else return Promise.resolve();
	}
	clear() {
		notifyManager.batch(() => {
			this.#mutations.forEach((mutation) => {
				this.notify({
					type: "removed",
					mutation
				});
			});
			this.#mutations.clear();
			this.#scopes.clear();
		});
	}
	getAll() {
		return Array.from(this.#mutations);
	}
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((mutation) => matchMutation(defaultedFilters, mutation));
	}
	findAll(filters = {}) {
		return this.getAll().filter((mutation) => matchMutation(filters, mutation));
	}
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	resumePausedMutations() {
		const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
		return notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(noop))));
	}
};
function scopeFor(mutation) {
	return mutation.options.scope?.id;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/queryCache.js
var QueryCache = class extends Subscribable {
	constructor(config = {}) {
		super();
		this.config = config;
		this.#queries = /* @__PURE__ */ new Map();
	}
	#queries;
	build(client, options, state) {
		const queryKey = options.queryKey;
		const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
		let query = this.get(queryHash);
		if (!query) {
			query = new Query({
				client,
				queryKey,
				queryHash,
				options: client.defaultQueryOptions(options),
				state,
				defaultOptions: client.getQueryDefaults(queryKey)
			});
			this.add(query);
		}
		return query;
	}
	add(query) {
		if (!this.#queries.has(query.queryHash)) {
			this.#queries.set(query.queryHash, query);
			this.notify({
				type: "added",
				query
			});
		}
	}
	remove(query) {
		const queryInMap = this.#queries.get(query.queryHash);
		if (queryInMap) {
			query.destroy();
			if (queryInMap === query) this.#queries.delete(query.queryHash);
			this.notify({
				type: "removed",
				query
			});
		}
	}
	clear() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				this.remove(query);
			});
		});
	}
	get(queryHash) {
		return this.#queries.get(queryHash);
	}
	getAll() {
		return [...this.#queries.values()];
	}
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((query) => matchQuery(defaultedFilters, query));
	}
	findAll(filters = {}) {
		const queries = this.getAll();
		return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
	}
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	onFocus() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onFocus();
			});
		});
	}
	onOnline() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onOnline();
			});
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+query-core@5.95.2/node_modules/@tanstack/query-core/build/modern/queryClient.js
var QueryClient = class {
	#queryCache;
	#mutationCache;
	#defaultOptions;
	#queryDefaults;
	#mutationDefaults;
	#mountCount;
	#unsubscribeFocus;
	#unsubscribeOnline;
	constructor(config = {}) {
		this.#queryCache = config.queryCache || new QueryCache();
		this.#mutationCache = config.mutationCache || new MutationCache();
		this.#defaultOptions = config.defaultOptions || {};
		this.#queryDefaults = /* @__PURE__ */ new Map();
		this.#mutationDefaults = /* @__PURE__ */ new Map();
		this.#mountCount = 0;
	}
	mount() {
		this.#mountCount++;
		if (this.#mountCount !== 1) return;
		this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
			if (focused) {
				await this.resumePausedMutations();
				this.#queryCache.onFocus();
			}
		});
		this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
			if (online) {
				await this.resumePausedMutations();
				this.#queryCache.onOnline();
			}
		});
	}
	unmount() {
		this.#mountCount--;
		if (this.#mountCount !== 0) return;
		this.#unsubscribeFocus?.();
		this.#unsubscribeFocus = void 0;
		this.#unsubscribeOnline?.();
		this.#unsubscribeOnline = void 0;
	}
	isFetching(filters) {
		return this.#queryCache.findAll({
			...filters,
			fetchStatus: "fetching"
		}).length;
	}
	isMutating(filters) {
		return this.#mutationCache.findAll({
			...filters,
			status: "pending"
		}).length;
	}
	/**
	* Imperative (non-reactive) way to retrieve data for a QueryKey.
	* Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
	*
	* Hint: Do not use this function inside a component, because it won't receive updates.
	* Use `useQuery` to create a `QueryObserver` that subscribes to changes.
	*/
	getQueryData(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state.data;
	}
	ensureQueryData(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		const query = this.#queryCache.build(this, defaultedOptions);
		const cachedData = query.state.data;
		if (cachedData === void 0) return this.fetchQuery(options);
		if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
		return Promise.resolve(cachedData);
	}
	getQueriesData(filters) {
		return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
			return [queryKey, state.data];
		});
	}
	setQueryData(queryKey, updater, options) {
		const defaultedOptions = this.defaultQueryOptions({ queryKey });
		const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
		const data = functionalUpdate$1(updater, prevData);
		if (data === void 0) return;
		return this.#queryCache.build(this, defaultedOptions).setData(data, {
			...options,
			manual: true
		});
	}
	setQueriesData(filters, updater, options) {
		return notifyManager.batch(() => this.#queryCache.findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
	}
	getQueryState(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state;
	}
	removeQueries(filters) {
		const queryCache = this.#queryCache;
		notifyManager.batch(() => {
			queryCache.findAll(filters).forEach((query) => {
				queryCache.remove(query);
			});
		});
	}
	resetQueries(filters, options) {
		const queryCache = this.#queryCache;
		return notifyManager.batch(() => {
			queryCache.findAll(filters).forEach((query) => {
				query.reset();
			});
			return this.refetchQueries({
				type: "active",
				...filters
			}, options);
		});
	}
	cancelQueries(filters, cancelOptions = {}) {
		const defaultedCancelOptions = {
			revert: true,
			...cancelOptions
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
		return Promise.all(promises).then(noop).catch(noop);
	}
	invalidateQueries(filters, options = {}) {
		return notifyManager.batch(() => {
			this.#queryCache.findAll(filters).forEach((query) => {
				query.invalidate();
			});
			if (filters?.refetchType === "none") return Promise.resolve();
			return this.refetchQueries({
				...filters,
				type: filters?.refetchType ?? filters?.type ?? "active"
			}, options);
		});
	}
	refetchQueries(filters, options = {}) {
		const fetchOptions = {
			...options,
			cancelRefetch: options.cancelRefetch ?? true
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
			let promise = query.fetch(void 0, fetchOptions);
			if (!fetchOptions.throwOnError) promise = promise.catch(noop);
			return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
		}));
		return Promise.all(promises).then(noop);
	}
	fetchQuery(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
		const query = this.#queryCache.build(this, defaultedOptions);
		return query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
	}
	prefetchQuery(options) {
		return this.fetchQuery(options).then(noop).catch(noop);
	}
	fetchInfiniteQuery(options) {
		options.behavior = infiniteQueryBehavior(options.pages);
		return this.fetchQuery(options);
	}
	prefetchInfiniteQuery(options) {
		return this.fetchInfiniteQuery(options).then(noop).catch(noop);
	}
	ensureInfiniteQueryData(options) {
		options.behavior = infiniteQueryBehavior(options.pages);
		return this.ensureQueryData(options);
	}
	resumePausedMutations() {
		if (onlineManager.isOnline()) return this.#mutationCache.resumePausedMutations();
		return Promise.resolve();
	}
	getQueryCache() {
		return this.#queryCache;
	}
	getMutationCache() {
		return this.#mutationCache;
	}
	getDefaultOptions() {
		return this.#defaultOptions;
	}
	setDefaultOptions(options) {
		this.#defaultOptions = options;
	}
	setQueryDefaults(queryKey, options) {
		this.#queryDefaults.set(hashKey(queryKey), {
			queryKey,
			defaultOptions: options
		});
	}
	getQueryDefaults(queryKey) {
		const defaults = [...this.#queryDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	setMutationDefaults(mutationKey, options) {
		this.#mutationDefaults.set(hashKey(mutationKey), {
			mutationKey,
			defaultOptions: options
		});
	}
	getMutationDefaults(mutationKey) {
		const defaults = [...this.#mutationDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	defaultQueryOptions(options) {
		if (options._defaulted) return options;
		const defaultedOptions = {
			...this.#defaultOptions.queries,
			...this.getQueryDefaults(options.queryKey),
			...options,
			_defaulted: true
		};
		if (!defaultedOptions.queryHash) defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
		if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
		if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
		if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
		if (defaultedOptions.queryFn === skipToken) defaultedOptions.enabled = false;
		return defaultedOptions;
	}
	defaultMutationOptions(options) {
		if (options?._defaulted) return options;
		return {
			...this.#defaultOptions.mutations,
			...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
			...options,
			_defaulted: true
		};
	}
	clear() {
		this.#queryCache.clear();
		this.#mutationCache.clear();
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/cjs/scheduler.production.js
/**
* @license React
* scheduler.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_scheduler_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	function push(heap, node) {
		var index = heap.length;
		heap.push(node);
		a: for (; 0 < index;) {
			var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
			if (0 < compare(parent, node)) heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
			else break a;
		}
	}
	function peek(heap) {
		return 0 === heap.length ? null : heap[0];
	}
	function pop(heap) {
		if (0 === heap.length) return null;
		var first = heap[0], last = heap.pop();
		if (last !== first) {
			heap[0] = last;
			a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength;) {
				var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
				if (0 > compare(left, last)) rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
				else if (rightIndex < length && 0 > compare(right, last)) heap[index] = right, heap[rightIndex] = last, index = rightIndex;
				else break a;
			}
		}
		return first;
	}
	function compare(a, b) {
		var diff = a.sortIndex - b.sortIndex;
		return 0 !== diff ? diff : a.id - b.id;
	}
	exports.unstable_now = void 0;
	if ("object" === typeof performance && "function" === typeof performance.now) {
		var localPerformance = performance;
		exports.unstable_now = function() {
			return localPerformance.now();
		};
	} else {
		var localDate = Date, initialTime = localDate.now();
		exports.unstable_now = function() {
			return localDate.now() - initialTime;
		};
	}
	var taskQueue = [];
	var timerQueue = [];
	var taskIdCounter = 1;
	var currentTask = null;
	var currentPriorityLevel = 3;
	var isPerformingWork = !1;
	var isHostCallbackScheduled = !1;
	var isHostTimeoutScheduled = !1;
	var needsPaint = !1;
	var localSetTimeout = "function" === typeof setTimeout ? setTimeout : null;
	var localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null;
	var localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
	function advanceTimers(currentTime) {
		for (var timer = peek(timerQueue); null !== timer;) {
			if (null === timer.callback) pop(timerQueue);
			else if (timer.startTime <= currentTime) pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
			else break;
			timer = peek(timerQueue);
		}
	}
	function handleTimeout(currentTime) {
		isHostTimeoutScheduled = !1;
		advanceTimers(currentTime);
		if (!isHostCallbackScheduled) if (null !== peek(taskQueue)) isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline());
		else {
			var firstTimer = peek(timerQueue);
			null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
		}
	}
	var isMessageLoopRunning = !1;
	var taskTimeoutID = -1;
	var frameInterval = 5;
	var startTime = -1;
	function shouldYieldToHost() {
		return needsPaint ? !0 : exports.unstable_now() - startTime < frameInterval ? !1 : !0;
	}
	function performWorkUntilDeadline() {
		needsPaint = !1;
		if (isMessageLoopRunning) {
			var currentTime = exports.unstable_now();
			startTime = currentTime;
			var hasMoreWork = !0;
			try {
				a: {
					isHostCallbackScheduled = !1;
					isHostTimeoutScheduled && (isHostTimeoutScheduled = !1, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
					isPerformingWork = !0;
					var previousPriorityLevel = currentPriorityLevel;
					try {
						b: {
							advanceTimers(currentTime);
							for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost());) {
								var callback = currentTask.callback;
								if ("function" === typeof callback) {
									currentTask.callback = null;
									currentPriorityLevel = currentTask.priorityLevel;
									var continuationCallback = callback(currentTask.expirationTime <= currentTime);
									currentTime = exports.unstable_now();
									if ("function" === typeof continuationCallback) {
										currentTask.callback = continuationCallback;
										advanceTimers(currentTime);
										hasMoreWork = !0;
										break b;
									}
									currentTask === peek(taskQueue) && pop(taskQueue);
									advanceTimers(currentTime);
								} else pop(taskQueue);
								currentTask = peek(taskQueue);
							}
							if (null !== currentTask) hasMoreWork = !0;
							else {
								var firstTimer = peek(timerQueue);
								null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
								hasMoreWork = !1;
							}
						}
						break a;
					} finally {
						currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = !1;
					}
					hasMoreWork = void 0;
				}
			} finally {
				hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = !1;
			}
		}
	}
	var schedulePerformWorkUntilDeadline;
	if ("function" === typeof localSetImmediate) schedulePerformWorkUntilDeadline = function() {
		localSetImmediate(performWorkUntilDeadline);
	};
	else if ("undefined" !== typeof MessageChannel) {
		var channel = new MessageChannel(), port = channel.port2;
		channel.port1.onmessage = performWorkUntilDeadline;
		schedulePerformWorkUntilDeadline = function() {
			port.postMessage(null);
		};
	} else schedulePerformWorkUntilDeadline = function() {
		localSetTimeout(performWorkUntilDeadline, 0);
	};
	function requestHostTimeout(callback, ms) {
		taskTimeoutID = localSetTimeout(function() {
			callback(exports.unstable_now());
		}, ms);
	}
	exports.unstable_IdlePriority = 5;
	exports.unstable_ImmediatePriority = 1;
	exports.unstable_LowPriority = 4;
	exports.unstable_NormalPriority = 3;
	exports.unstable_Profiling = null;
	exports.unstable_UserBlockingPriority = 2;
	exports.unstable_cancelCallback = function(task) {
		task.callback = null;
	};
	exports.unstable_forceFrameRate = function(fps) {
		0 > fps || 125 < fps ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
	};
	exports.unstable_getCurrentPriorityLevel = function() {
		return currentPriorityLevel;
	};
	exports.unstable_next = function(eventHandler) {
		switch (currentPriorityLevel) {
			case 1:
			case 2:
			case 3:
				var priorityLevel = 3;
				break;
			default: priorityLevel = currentPriorityLevel;
		}
		var previousPriorityLevel = currentPriorityLevel;
		currentPriorityLevel = priorityLevel;
		try {
			return eventHandler();
		} finally {
			currentPriorityLevel = previousPriorityLevel;
		}
	};
	exports.unstable_requestPaint = function() {
		needsPaint = !0;
	};
	exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
		switch (priorityLevel) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: priorityLevel = 3;
		}
		var previousPriorityLevel = currentPriorityLevel;
		currentPriorityLevel = priorityLevel;
		try {
			return eventHandler();
		} finally {
			currentPriorityLevel = previousPriorityLevel;
		}
	};
	exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
		var currentTime = exports.unstable_now();
		"object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
		switch (priorityLevel) {
			case 1:
				var timeout = -1;
				break;
			case 2:
				timeout = 250;
				break;
			case 5:
				timeout = 1073741823;
				break;
			case 4:
				timeout = 1e4;
				break;
			default: timeout = 5e3;
		}
		timeout = options + timeout;
		priorityLevel = {
			id: taskIdCounter++,
			callback,
			priorityLevel,
			startTime: options,
			expirationTime: timeout,
			sortIndex: -1
		};
		options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = !0, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline())));
		return priorityLevel;
	};
	exports.unstable_shouldYield = shouldYieldToHost;
	exports.unstable_wrapCallback = function(callback) {
		var parentPriorityLevel = currentPriorityLevel;
		return function() {
			var previousPriorityLevel = currentPriorityLevel;
			currentPriorityLevel = parentPriorityLevel;
			try {
				return callback.apply(this, arguments);
			} finally {
				currentPriorityLevel = previousPriorityLevel;
			}
		};
	};
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/scheduler@0.26.0/node_modules/scheduler/index.js
var require_scheduler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_scheduler_production();
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react-dom@19.1.5_react@19.1.5/node_modules/react-dom/cjs/react-dom-client.production.js
/**
* @license React
* react-dom-client.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_client_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scheduler = require_scheduler();
	var React = require_react();
	var ReactDOM = require_react_dom();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function isValidContainer(node) {
		return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
	}
	function getNearestMountedFiber(fiber) {
		var node = fiber, nearestMounted = fiber;
		if (fiber.alternate) for (; node.return;) node = node.return;
		else {
			fiber = node;
			do
				node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
			while (fiber);
		}
		return 3 === node.tag ? nearestMounted : null;
	}
	function getSuspenseInstanceFromFiber(fiber) {
		if (13 === fiber.tag) {
			var suspenseState = fiber.memoizedState;
			null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
			if (null !== suspenseState) return suspenseState.dehydrated;
		}
		return null;
	}
	function assertIsMounted(fiber) {
		if (getNearestMountedFiber(fiber) !== fiber) throw Error(formatProdErrorMessage(188));
	}
	function findCurrentFiberUsingSlowPath(fiber) {
		var alternate = fiber.alternate;
		if (!alternate) {
			alternate = getNearestMountedFiber(fiber);
			if (null === alternate) throw Error(formatProdErrorMessage(188));
			return alternate !== fiber ? null : fiber;
		}
		for (var a = fiber, b = alternate;;) {
			var parentA = a.return;
			if (null === parentA) break;
			var parentB = parentA.alternate;
			if (null === parentB) {
				b = parentA.return;
				if (null !== b) {
					a = b;
					continue;
				}
				break;
			}
			if (parentA.child === parentB.child) {
				for (parentB = parentA.child; parentB;) {
					if (parentB === a) return assertIsMounted(parentA), fiber;
					if (parentB === b) return assertIsMounted(parentA), alternate;
					parentB = parentB.sibling;
				}
				throw Error(formatProdErrorMessage(188));
			}
			if (a.return !== b.return) a = parentA, b = parentB;
			else {
				for (var didFindChild = !1, child$0 = parentA.child; child$0;) {
					if (child$0 === a) {
						didFindChild = !0;
						a = parentA;
						b = parentB;
						break;
					}
					if (child$0 === b) {
						didFindChild = !0;
						b = parentA;
						a = parentB;
						break;
					}
					child$0 = child$0.sibling;
				}
				if (!didFindChild) {
					for (child$0 = parentB.child; child$0;) {
						if (child$0 === a) {
							didFindChild = !0;
							a = parentB;
							b = parentA;
							break;
						}
						if (child$0 === b) {
							didFindChild = !0;
							b = parentB;
							a = parentA;
							break;
						}
						child$0 = child$0.sibling;
					}
					if (!didFindChild) throw Error(formatProdErrorMessage(189));
				}
			}
			if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
		}
		if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
		return a.stateNode.current === a ? fiber : alternate;
	}
	function findCurrentHostFiberImpl(node) {
		var tag = node.tag;
		if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
		for (node = node.child; null !== node;) {
			tag = findCurrentHostFiberImpl(node);
			if (null !== tag) return tag;
			node = node.sibling;
		}
		return null;
	}
	var assign = Object.assign;
	var REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element");
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
		if (null == type) return null;
		if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
		if ("string" === typeof type) return type;
		switch (type) {
			case REACT_FRAGMENT_TYPE: return "Fragment";
			case REACT_PROFILER_TYPE: return "Profiler";
			case REACT_STRICT_MODE_TYPE: return "StrictMode";
			case REACT_SUSPENSE_TYPE: return "Suspense";
			case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			case REACT_ACTIVITY_TYPE: return "Activity";
		}
		if ("object" === typeof type) switch (type.$$typeof) {
			case REACT_PORTAL_TYPE: return "Portal";
			case REACT_CONTEXT_TYPE: return (type.displayName || "Context") + ".Provider";
			case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
			case REACT_FORWARD_REF_TYPE:
				var innerType = type.render;
				type = type.displayName;
				type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
				return type;
			case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
			case REACT_LAZY_TYPE:
				innerType = type._payload;
				type = type._init;
				try {
					return getComponentNameFromType(type(innerType));
				} catch (x) {}
		}
		return null;
	}
	var isArrayImpl = Array.isArray;
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	var sharedNotPendingObject = {
		pending: !1,
		data: null,
		method: null,
		action: null
	};
	var valueStack = [];
	var index = -1;
	function createCursor(defaultValue) {
		return { current: defaultValue };
	}
	function pop(cursor) {
		0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
	}
	function push(cursor, value) {
		index++;
		valueStack[index] = cursor.current;
		cursor.current = value;
	}
	var contextStackCursor = createCursor(null);
	var contextFiberStackCursor = createCursor(null);
	var rootInstanceStackCursor = createCursor(null);
	var hostTransitionProviderCursor = createCursor(null);
	function pushHostContainer(fiber, nextRootInstance) {
		push(rootInstanceStackCursor, nextRootInstance);
		push(contextFiberStackCursor, fiber);
		push(contextStackCursor, null);
		switch (nextRootInstance.nodeType) {
			case 9:
			case 11:
				fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
				break;
			default: if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI) nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
			else switch (fiber) {
				case "svg":
					fiber = 1;
					break;
				case "math":
					fiber = 2;
					break;
				default: fiber = 0;
			}
		}
		pop(contextStackCursor);
		push(contextStackCursor, fiber);
	}
	function popHostContainer() {
		pop(contextStackCursor);
		pop(contextFiberStackCursor);
		pop(rootInstanceStackCursor);
	}
	function pushHostContext(fiber) {
		null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
		var context = contextStackCursor.current;
		var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
		context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
	}
	function popHostContext(fiber) {
		contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
		hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
	}
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var scheduleCallback$3 = Scheduler.unstable_scheduleCallback;
	var cancelCallback$1 = Scheduler.unstable_cancelCallback;
	var shouldYield = Scheduler.unstable_shouldYield;
	var requestPaint = Scheduler.unstable_requestPaint;
	var now = Scheduler.unstable_now;
	var getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel;
	var ImmediatePriority = Scheduler.unstable_ImmediatePriority;
	var UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
	var NormalPriority$1 = Scheduler.unstable_NormalPriority;
	var LowPriority = Scheduler.unstable_LowPriority;
	var IdlePriority = Scheduler.unstable_IdlePriority;
	var log$1 = Scheduler.log;
	var unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue;
	var rendererID = null;
	var injectedHook = null;
	function setIsStrictModeForDevtools(newIsStrictMode) {
		"function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
		if (injectedHook && "function" === typeof injectedHook.setStrictMode) try {
			injectedHook.setStrictMode(rendererID, newIsStrictMode);
		} catch (err) {}
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
	var log = Math.log;
	var LN2 = Math.LN2;
	function clz32Fallback(x) {
		x >>>= 0;
		return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
	}
	var nextTransitionLane = 256;
	var nextRetryLane = 4194304;
	function getHighestPriorityLanes(lanes) {
		var pendingSyncLanes = lanes & 42;
		if (0 !== pendingSyncLanes) return pendingSyncLanes;
		switch (lanes & -lanes) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return lanes & 4194048;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return lanes & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return lanes;
		}
	}
	function getNextLanes(root, wipLanes, rootHasPendingCommit) {
		var pendingLanes = root.pendingLanes;
		if (0 === pendingLanes) return 0;
		var nextLanes = 0, suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes;
		root = root.warmLanes;
		var nonIdlePendingLanes = pendingLanes & 134217727;
		0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
		return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
	}
	function checkIfRootIsPrerendering(root, renderLanes) {
		return 0 === (root.pendingLanes & ~(root.suspendedLanes & ~root.pingedLanes) & renderLanes);
	}
	function computeExpirationTime(lane, currentTime) {
		switch (lane) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return currentTime + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return currentTime + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function claimNextTransitionLane() {
		var lane = nextTransitionLane;
		nextTransitionLane <<= 1;
		0 === (nextTransitionLane & 4194048) && (nextTransitionLane = 256);
		return lane;
	}
	function claimNextRetryLane() {
		var lane = nextRetryLane;
		nextRetryLane <<= 1;
		0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
		return lane;
	}
	function createLaneMap(initial) {
		for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
		return laneMap;
	}
	function markRootUpdated$1(root, updateLane) {
		root.pendingLanes |= updateLane;
		268435456 !== updateLane && (root.suspendedLanes = 0, root.pingedLanes = 0, root.warmLanes = 0);
	}
	function markRootFinished(root, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
		var previouslyPendingLanes = root.pendingLanes;
		root.pendingLanes = remainingLanes;
		root.suspendedLanes = 0;
		root.pingedLanes = 0;
		root.warmLanes = 0;
		root.expiredLanes &= remainingLanes;
		root.entangledLanes &= remainingLanes;
		root.errorRecoveryDisabledLanes &= remainingLanes;
		root.shellSuspendCounter = 0;
		var entanglements = root.entanglements, expirationTimes = root.expirationTimes, hiddenUpdates = root.hiddenUpdates;
		for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes;) {
			var index$5 = 31 - clz32(remainingLanes), lane = 1 << index$5;
			entanglements[index$5] = 0;
			expirationTimes[index$5] = -1;
			var hiddenUpdatesForLane = hiddenUpdates[index$5];
			if (null !== hiddenUpdatesForLane) for (hiddenUpdates[index$5] = null, index$5 = 0; index$5 < hiddenUpdatesForLane.length; index$5++) {
				var update = hiddenUpdatesForLane[index$5];
				null !== update && (update.lane &= -536870913);
			}
			remainingLanes &= ~lane;
		}
		0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, 0);
		0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root.tag && (root.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
	}
	function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
		root.pendingLanes |= spawnedLane;
		root.suspendedLanes &= ~spawnedLane;
		var spawnedLaneIndex = 31 - clz32(spawnedLane);
		root.entangledLanes |= spawnedLane;
		root.entanglements[spawnedLaneIndex] = root.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 4194090;
	}
	function markRootEntangled(root, entangledLanes) {
		var rootEntangledLanes = root.entangledLanes |= entangledLanes;
		for (root = root.entanglements; rootEntangledLanes;) {
			var index$6 = 31 - clz32(rootEntangledLanes), lane = 1 << index$6;
			lane & entangledLanes | root[index$6] & entangledLanes && (root[index$6] |= entangledLanes);
			rootEntangledLanes &= ~lane;
		}
	}
	function getBumpedLaneForHydrationByLane(lane) {
		switch (lane) {
			case 2:
				lane = 1;
				break;
			case 8:
				lane = 4;
				break;
			case 32:
				lane = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				lane = 128;
				break;
			case 268435456:
				lane = 134217728;
				break;
			default: lane = 0;
		}
		return lane;
	}
	function lanesToEventPriority(lanes) {
		lanes &= -lanes;
		return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
	}
	function resolveUpdatePriority() {
		var updatePriority = ReactDOMSharedInternals.p;
		if (0 !== updatePriority) return updatePriority;
		updatePriority = window.event;
		return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
	}
	function runWithPriority(priority, fn) {
		var previousPriority = ReactDOMSharedInternals.p;
		try {
			return ReactDOMSharedInternals.p = priority, fn();
		} finally {
			ReactDOMSharedInternals.p = previousPriority;
		}
	}
	var randomKey = Math.random().toString(36).slice(2);
	var internalInstanceKey = "__reactFiber$" + randomKey;
	var internalPropsKey = "__reactProps$" + randomKey;
	var internalContainerInstanceKey = "__reactContainer$" + randomKey;
	var internalEventHandlersKey = "__reactEvents$" + randomKey;
	var internalEventHandlerListenersKey = "__reactListeners$" + randomKey;
	var internalEventHandlesSetKey = "__reactHandles$" + randomKey;
	var internalRootNodeResourcesKey = "__reactResources$" + randomKey;
	var internalHoistableMarker = "__reactMarker$" + randomKey;
	function detachDeletedInstance(node) {
		delete node[internalInstanceKey];
		delete node[internalPropsKey];
		delete node[internalEventHandlersKey];
		delete node[internalEventHandlerListenersKey];
		delete node[internalEventHandlesSetKey];
	}
	function getClosestInstanceFromNode(targetNode) {
		var targetInst = targetNode[internalInstanceKey];
		if (targetInst) return targetInst;
		for (var parentNode = targetNode.parentNode; parentNode;) {
			if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
				parentNode = targetInst.alternate;
				if (null !== targetInst.child || null !== parentNode && null !== parentNode.child) for (targetNode = getParentSuspenseInstance(targetNode); null !== targetNode;) {
					if (parentNode = targetNode[internalInstanceKey]) return parentNode;
					targetNode = getParentSuspenseInstance(targetNode);
				}
				return targetInst;
			}
			targetNode = parentNode;
			parentNode = targetNode.parentNode;
		}
		return null;
	}
	function getInstanceFromNode(node) {
		if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
			var tag = node.tag;
			if (5 === tag || 6 === tag || 13 === tag || 26 === tag || 27 === tag || 3 === tag) return node;
		}
		return null;
	}
	function getNodeFromInstance(inst) {
		var tag = inst.tag;
		if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
		throw Error(formatProdErrorMessage(33));
	}
	function getResourcesFromRoot(root) {
		var resources = root[internalRootNodeResourcesKey];
		resources || (resources = root[internalRootNodeResourcesKey] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		});
		return resources;
	}
	function markNodeAsHoistable(node) {
		node[internalHoistableMarker] = !0;
	}
	var allNativeEvents = /* @__PURE__ */ new Set();
	var registrationNameDependencies = {};
	function registerTwoPhaseEvent(registrationName, dependencies) {
		registerDirectEvent(registrationName, dependencies);
		registerDirectEvent(registrationName + "Capture", dependencies);
	}
	function registerDirectEvent(registrationName, dependencies) {
		registrationNameDependencies[registrationName] = dependencies;
		for (registrationName = 0; registrationName < dependencies.length; registrationName++) allNativeEvents.add(dependencies[registrationName]);
	}
	var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
	var illegalAttributeNameCache = {};
	var validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
		if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return !0;
		if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return !1;
		if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = !0;
		illegalAttributeNameCache[attributeName] = !0;
		return !1;
	}
	function setValueForAttribute(node, name, value) {
		if (isAttributeNameSafe(name)) if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
					node.removeAttribute(name);
					return;
				case "boolean":
					var prefix$8 = name.toLowerCase().slice(0, 5);
					if ("data-" !== prefix$8 && "aria-" !== prefix$8) {
						node.removeAttribute(name);
						return;
					}
			}
			node.setAttribute(name, "" + value);
		}
	}
	function setValueForKnownAttribute(node, name, value) {
		if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					node.removeAttribute(name);
					return;
			}
			node.setAttribute(name, "" + value);
		}
	}
	function setValueForNamespacedAttribute(node, namespace, name, value) {
		if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					node.removeAttribute(name);
					return;
			}
			node.setAttributeNS(namespace, name, "" + value);
		}
	}
	var prefix;
	var suffix;
	function describeBuiltInComponentFrame(name) {
		if (void 0 === prefix) try {
			throw Error();
		} catch (x) {
			var match = x.stack.trim().match(/\n( *(at )?)/);
			prefix = match && match[1] || "";
			suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + prefix + name + suffix;
	}
	var reentry = !1;
	function describeNativeComponentFrame(fn, construct) {
		if (!fn || reentry) return "";
		reentry = !0;
		var previousPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var RunInRootFrame = { DetermineComponentFrameRoot: function() {
				try {
					if (construct) {
						var Fake = function() {
							throw Error();
						};
						Object.defineProperty(Fake.prototype, "props", { set: function() {
							throw Error();
						} });
						if ("object" === typeof Reflect && Reflect.construct) {
							try {
								Reflect.construct(Fake, []);
							} catch (x) {
								var control = x;
							}
							Reflect.construct(fn, [], Fake);
						} else {
							try {
								Fake.call();
							} catch (x$9) {
								control = x$9;
							}
							fn.call(Fake.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (x$10) {
							control = x$10;
						}
						(Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
					}
				} catch (sample) {
					if (sample && control && "string" === typeof sample.stack) return [sample.stack, control.stack];
				}
				return [null, null];
			} };
			RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
			namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
			if (sampleStack && controlStack) {
				var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
				for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");) RunInRootFrame++;
				for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");) namePropDescriptor++;
				if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];) namePropDescriptor--;
				for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--) if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
					if (1 !== RunInRootFrame || 1 !== namePropDescriptor) do
						if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
							var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
							fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
							return frame;
						}
					while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
					break;
				}
			}
		} finally {
			reentry = !1, Error.prepareStackTrace = previousPrepareStackTrace;
		}
		return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
	}
	function describeFiber(fiber) {
		switch (fiber.tag) {
			case 26:
			case 27:
			case 5: return describeBuiltInComponentFrame(fiber.type);
			case 16: return describeBuiltInComponentFrame("Lazy");
			case 13: return describeBuiltInComponentFrame("Suspense");
			case 19: return describeBuiltInComponentFrame("SuspenseList");
			case 0:
			case 15: return describeNativeComponentFrame(fiber.type, !1);
			case 11: return describeNativeComponentFrame(fiber.type.render, !1);
			case 1: return describeNativeComponentFrame(fiber.type, !0);
			case 31: return describeBuiltInComponentFrame("Activity");
			default: return "";
		}
	}
	function getStackByFiberInDevAndProd(workInProgress) {
		try {
			var info = "";
			do
				info += describeFiber(workInProgress), workInProgress = workInProgress.return;
			while (workInProgress);
			return info;
		} catch (x) {
			return "\nError generating stack: " + x.message + "\n" + x.stack;
		}
	}
	function getToStringValue(value) {
		switch (typeof value) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return value;
			case "object": return value;
			default: return "";
		}
	}
	function isCheckable(elem) {
		var type = elem.type;
		return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
	}
	function trackValueOnNode(node) {
		var valueField = isCheckable(node) ? "checked" : "value", descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField), currentValue = "" + node[valueField];
		if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
			var get = descriptor.get, set = descriptor.set;
			Object.defineProperty(node, valueField, {
				configurable: !0,
				get: function() {
					return get.call(this);
				},
				set: function(value) {
					currentValue = "" + value;
					set.call(this, value);
				}
			});
			Object.defineProperty(node, valueField, { enumerable: descriptor.enumerable });
			return {
				getValue: function() {
					return currentValue;
				},
				setValue: function(value) {
					currentValue = "" + value;
				},
				stopTracking: function() {
					node._valueTracker = null;
					delete node[valueField];
				}
			};
		}
	}
	function track(node) {
		node._valueTracker || (node._valueTracker = trackValueOnNode(node));
	}
	function updateValueIfChanged(node) {
		if (!node) return !1;
		var tracker = node._valueTracker;
		if (!tracker) return !0;
		var lastValue = tracker.getValue();
		var value = "";
		node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
		node = value;
		return node !== lastValue ? (tracker.setValue(node), !0) : !1;
	}
	function getActiveElement(doc) {
		doc = doc || ("undefined" !== typeof document ? document : void 0);
		if ("undefined" === typeof doc) return null;
		try {
			return doc.activeElement || doc.body;
		} catch (e) {
			return doc.body;
		}
	}
	var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
	function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
		return value.replace(escapeSelectorAttributeValueInsideDoubleQuotesRegex, function(ch) {
			return "\\" + ch.charCodeAt(0).toString(16) + " ";
		});
	}
	function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
		element.name = "";
		null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
		if (null != value) if ("number" === type) {
			if (0 === value && "" === element.value || element.value != value) element.value = "" + getToStringValue(value);
		} else element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
		else "submit" !== type && "reset" !== type || element.removeAttribute("value");
		null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
		null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
		null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
		null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
	}
	function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating) {
		null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
		if (null != value || null != defaultValue) {
			if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) return;
			defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
			value = null != value ? "" + getToStringValue(value) : defaultValue;
			isHydrating || value === element.value || (element.value = value);
			element.defaultValue = value;
		}
		checked = null != checked ? checked : defaultChecked;
		checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
		element.checked = isHydrating ? element.checked : !!checked;
		element.defaultChecked = !!checked;
		null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
	}
	function setDefaultValue(node, type, value) {
		"number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
	}
	function updateOptions(node, multiple, propValue, setDefaultSelected) {
		node = node.options;
		if (multiple) {
			multiple = {};
			for (var i = 0; i < propValue.length; i++) multiple["$" + propValue[i]] = !0;
			for (propValue = 0; propValue < node.length; propValue++) i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = !0);
		} else {
			propValue = "" + getToStringValue(propValue);
			multiple = null;
			for (i = 0; i < node.length; i++) {
				if (node[i].value === propValue) {
					node[i].selected = !0;
					setDefaultSelected && (node[i].defaultSelected = !0);
					return;
				}
				null !== multiple || node[i].disabled || (multiple = node[i]);
			}
			null !== multiple && (multiple.selected = !0);
		}
	}
	function updateTextarea(element, value, defaultValue) {
		if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
			element.defaultValue !== value && (element.defaultValue = value);
			return;
		}
		element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
	}
	function initTextarea(element, value, defaultValue, children) {
		if (null == value) {
			if (null != children) {
				if (null != defaultValue) throw Error(formatProdErrorMessage(92));
				if (isArrayImpl(children)) {
					if (1 < children.length) throw Error(formatProdErrorMessage(93));
					children = children[0];
				}
				defaultValue = children;
			}
			defaultValue ??= "";
			value = defaultValue;
		}
		defaultValue = getToStringValue(value);
		element.defaultValue = defaultValue;
		children = element.textContent;
		children === defaultValue && "" !== children && null !== children && (element.value = children);
	}
	function setTextContent(node, text) {
		if (text) {
			var firstChild = node.firstChild;
			if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
				firstChild.nodeValue = text;
				return;
			}
		}
		node.textContent = text;
	}
	var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function setValueForStyle(style, styleName, value) {
		var isCustomProperty = 0 === styleName.indexOf("--");
		null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style.setProperty(styleName, "") : "float" === styleName ? style.cssFloat = "" : style[styleName] = "" : isCustomProperty ? style.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style.cssFloat = value : style[styleName] = ("" + value).trim() : style[styleName] = value + "px";
	}
	function setValueForStyles(node, styles, prevStyles) {
		if (null != styles && "object" !== typeof styles) throw Error(formatProdErrorMessage(62));
		node = node.style;
		if (null != prevStyles) {
			for (var styleName in prevStyles) !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
			for (var styleName$16 in styles) styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
		} else for (var styleName$17 in styles) styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
	}
	function isCustomElement(tagName) {
		if (-1 === tagName.indexOf("-")) return !1;
		switch (tagName) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var aliases = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]);
	var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
		return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
	}
	var currentReplayingEvent = null;
	function getEventTarget(nativeEvent) {
		nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
		nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
		return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
	}
	var restoreTarget = null;
	var restoreQueue = null;
	function restoreStateOfTarget(target) {
		var internalInstance = getInstanceFromNode(target);
		if (internalInstance && (target = internalInstance.stateNode)) {
			var props = target[internalPropsKey] || null;
			a: switch (target = internalInstance.stateNode, internalInstance.type) {
				case "input":
					updateInput(target, props.value, props.defaultValue, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name);
					internalInstance = props.name;
					if ("radio" === props.type && null != internalInstance) {
						for (props = target; props.parentNode;) props = props.parentNode;
						props = props.querySelectorAll("input[name=\"" + escapeSelectorAttributeValueInsideDoubleQuotes("" + internalInstance) + "\"][type=\"radio\"]");
						for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
							var otherNode = props[internalInstance];
							if (otherNode !== target && otherNode.form === target.form) {
								var otherProps = otherNode[internalPropsKey] || null;
								if (!otherProps) throw Error(formatProdErrorMessage(90));
								updateInput(otherNode, otherProps.value, otherProps.defaultValue, otherProps.defaultValue, otherProps.checked, otherProps.defaultChecked, otherProps.type, otherProps.name);
							}
						}
						for (internalInstance = 0; internalInstance < props.length; internalInstance++) otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
					}
					break a;
				case "textarea":
					updateTextarea(target, props.value, props.defaultValue);
					break a;
				case "select": internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, !1);
			}
		}
	}
	var isInsideEventHandler = !1;
	function batchedUpdates$1(fn, a, b) {
		if (isInsideEventHandler) return fn(a, b);
		isInsideEventHandler = !0;
		try {
			return fn(a);
		} finally {
			if (isInsideEventHandler = !1, null !== restoreTarget || null !== restoreQueue) {
				if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn)) for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
			}
		}
	}
	function getListener(inst, registrationName) {
		var stateNode = inst.stateNode;
		if (null === stateNode) return null;
		var props = stateNode[internalPropsKey] || null;
		if (null === props) return null;
		stateNode = props[registrationName];
		a: switch (registrationName) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
				inst = !props;
				break a;
			default: inst = !1;
		}
		if (inst) return null;
		if (stateNode && "function" !== typeof stateNode) throw Error(formatProdErrorMessage(231, registrationName, typeof stateNode));
		return stateNode;
	}
	var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
	var passiveBrowserEventsSupported = !1;
	if (canUseDOM) try {
		var options = {};
		Object.defineProperty(options, "passive", { get: function() {
			passiveBrowserEventsSupported = !0;
		} });
		window.addEventListener("test", options, options);
		window.removeEventListener("test", options, options);
	} catch (e) {
		passiveBrowserEventsSupported = !1;
	}
	var root = null;
	var startText = null;
	var fallbackText = null;
	function getData() {
		if (fallbackText) return fallbackText;
		var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
		for (start = 0; start < startLength && startValue[start] === endValue[start]; start++);
		var minEnd = startLength - start;
		for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++);
		return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
	}
	function getEventCharCode(nativeEvent) {
		var keyCode = nativeEvent.keyCode;
		"charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
		10 === nativeEvent && (nativeEvent = 13);
		return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
	}
	function functionThatReturnsTrue() {
		return !0;
	}
	function functionThatReturnsFalse() {
		return !1;
	}
	function createSyntheticEvent(Interface) {
		function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
			this._reactName = reactName;
			this._targetInst = targetInst;
			this.type = reactEventType;
			this.nativeEvent = nativeEvent;
			this.target = nativeEventTarget;
			this.currentTarget = null;
			for (var propName in Interface) Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
			this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : !1 === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
			this.isPropagationStopped = functionThatReturnsFalse;
			return this;
		}
		assign(SyntheticBaseEvent.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var event = this.nativeEvent;
				event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = !1), this.isDefaultPrevented = functionThatReturnsTrue);
			},
			stopPropagation: function() {
				var event = this.nativeEvent;
				event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = !0), this.isPropagationStopped = functionThatReturnsTrue);
			},
			persist: function() {},
			isPersistent: functionThatReturnsTrue
		});
		return SyntheticBaseEvent;
	}
	var EventInterface = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(event) {
			return event.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	};
	var SyntheticEvent = createSyntheticEvent(EventInterface);
	var UIEventInterface = assign({}, EventInterface, {
		view: 0,
		detail: 0
	});
	var SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
	var lastMovementX;
	var lastMovementY;
	var lastMouseEvent;
	var MouseEventInterface = assign({}, UIEventInterface, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: getEventModifierState,
		button: 0,
		buttons: 0,
		relatedTarget: function(event) {
			return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
		},
		movementX: function(event) {
			if ("movementX" in event) return event.movementX;
			event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
			return lastMovementX;
		},
		movementY: function(event) {
			return "movementY" in event ? event.movementY : lastMovementY;
		}
	});
	var SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
	var SyntheticDragEvent = createSyntheticEvent(assign({}, MouseEventInterface, { dataTransfer: 0 }));
	var SyntheticFocusEvent = createSyntheticEvent(assign({}, UIEventInterface, { relatedTarget: 0 }));
	var SyntheticAnimationEvent = createSyntheticEvent(assign({}, EventInterface, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	}));
	var SyntheticClipboardEvent = createSyntheticEvent(assign({}, EventInterface, { clipboardData: function(event) {
		return "clipboardData" in event ? event.clipboardData : window.clipboardData;
	} }));
	var SyntheticCompositionEvent = createSyntheticEvent(assign({}, EventInterface, { data: 0 }));
	var normalizeKey = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	};
	var translateToKey = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	};
	var modifierKeyToProp = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function modifierStateGetter(keyArg) {
		var nativeEvent = this.nativeEvent;
		return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : !1;
	}
	function getEventModifierState() {
		return modifierStateGetter;
	}
	var SyntheticKeyboardEvent = createSyntheticEvent(assign({}, UIEventInterface, {
		key: function(nativeEvent) {
			if (nativeEvent.key) {
				var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
				if ("Unidentified" !== key) return key;
			}
			return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: getEventModifierState,
		charCode: function(event) {
			return "keypress" === event.type ? getEventCharCode(event) : 0;
		},
		keyCode: function(event) {
			return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
		},
		which: function(event) {
			return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
		}
	}));
	var SyntheticPointerEvent = createSyntheticEvent(assign({}, MouseEventInterface, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	}));
	var SyntheticTouchEvent = createSyntheticEvent(assign({}, UIEventInterface, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: getEventModifierState
	}));
	var SyntheticTransitionEvent = createSyntheticEvent(assign({}, EventInterface, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	}));
	var SyntheticWheelEvent = createSyntheticEvent(assign({}, MouseEventInterface, {
		deltaX: function(event) {
			return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
		},
		deltaY: function(event) {
			return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	}));
	var SyntheticToggleEvent = createSyntheticEvent(assign({}, EventInterface, {
		newState: 0,
		oldState: 0
	}));
	var END_KEYCODES = [
		9,
		13,
		27,
		32
	];
	var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
	var documentMode = null;
	canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
	var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode;
	var useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode);
	var SPACEBAR_CHAR = String.fromCharCode(32);
	var hasSpaceKeypress = !1;
	function isFallbackCompositionEnd(domEventName, nativeEvent) {
		switch (domEventName) {
			case "keyup": return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
			case "keydown": return 229 !== nativeEvent.keyCode;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function getDataFromCustomEvent(nativeEvent) {
		nativeEvent = nativeEvent.detail;
		return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
	}
	var isComposing = !1;
	function getNativeBeforeInputChars(domEventName, nativeEvent) {
		switch (domEventName) {
			case "compositionend": return getDataFromCustomEvent(nativeEvent);
			case "keypress":
				if (32 !== nativeEvent.which) return null;
				hasSpaceKeypress = !0;
				return SPACEBAR_CHAR;
			case "textInput": return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
			default: return null;
		}
	}
	function getFallbackBeforeInputChars(domEventName, nativeEvent) {
		if (isComposing) return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = !1, domEventName) : null;
		switch (domEventName) {
			case "paste": return null;
			case "keypress":
				if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
					if (nativeEvent.char && 1 < nativeEvent.char.length) return nativeEvent.char;
					if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
				}
				return null;
			case "compositionend": return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
			default: return null;
		}
	}
	var supportedInputTypes = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function isTextInputElement(elem) {
		var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
		return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? !0 : !1;
	}
	function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
		restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
		inst = accumulateTwoPhaseListeners(inst, "onChange");
		0 < inst.length && (nativeEvent = new SyntheticEvent("onChange", "change", null, nativeEvent, target), dispatchQueue.push({
			event: nativeEvent,
			listeners: inst
		}));
	}
	var activeElement$1 = null;
	var activeElementInst$1 = null;
	function runEventInBatch(dispatchQueue) {
		processDispatchQueue(dispatchQueue, 0);
	}
	function getInstIfValueChanged(targetInst) {
		if (updateValueIfChanged(getNodeFromInstance(targetInst))) return targetInst;
	}
	function getTargetInstForChangeEvent(domEventName, targetInst) {
		if ("change" === domEventName) return targetInst;
	}
	var isInputEventSupported = !1;
	if (canUseDOM) {
		var JSCompiler_inline_result$jscomp$282;
		if (canUseDOM) {
			var isSupported$jscomp$inline_417 = "oninput" in document;
			if (!isSupported$jscomp$inline_417) {
				var element$jscomp$inline_418 = document.createElement("div");
				element$jscomp$inline_418.setAttribute("oninput", "return;");
				isSupported$jscomp$inline_417 = "function" === typeof element$jscomp$inline_418.oninput;
			}
			JSCompiler_inline_result$jscomp$282 = isSupported$jscomp$inline_417;
		} else JSCompiler_inline_result$jscomp$282 = !1;
		isInputEventSupported = JSCompiler_inline_result$jscomp$282 && (!document.documentMode || 9 < document.documentMode);
	}
	function stopWatchingForValueChange() {
		activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
	}
	function handlePropertyChange(nativeEvent) {
		if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
			var dispatchQueue = [];
			createAndAccumulateChangeEvent(dispatchQueue, activeElementInst$1, nativeEvent, getEventTarget(nativeEvent));
			batchedUpdates$1(runEventInBatch, dispatchQueue);
		}
	}
	function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
		"focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
	}
	function getTargetInstForInputEventPolyfill(domEventName) {
		if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName) return getInstIfValueChanged(activeElementInst$1);
	}
	function getTargetInstForClickEvent(domEventName, targetInst) {
		if ("click" === domEventName) return getInstIfValueChanged(targetInst);
	}
	function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
		if ("input" === domEventName || "change" === domEventName) return getInstIfValueChanged(targetInst);
	}
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	function shallowEqual(objA, objB) {
		if (objectIs(objA, objB)) return !0;
		if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB) return !1;
		var keysA = Object.keys(objA), keysB = Object.keys(objB);
		if (keysA.length !== keysB.length) return !1;
		for (keysB = 0; keysB < keysA.length; keysB++) {
			var currentKey = keysA[keysB];
			if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey])) return !1;
		}
		return !0;
	}
	function getLeafNode(node) {
		for (; node && node.firstChild;) node = node.firstChild;
		return node;
	}
	function getNodeForCharacterOffset(root, offset) {
		var node = getLeafNode(root);
		root = 0;
		for (var nodeEnd; node;) {
			if (3 === node.nodeType) {
				nodeEnd = root + node.textContent.length;
				if (root <= offset && nodeEnd >= offset) return {
					node,
					offset: offset - root
				};
				root = nodeEnd;
			}
			a: {
				for (; node;) {
					if (node.nextSibling) {
						node = node.nextSibling;
						break a;
					}
					node = node.parentNode;
				}
				node = void 0;
			}
			node = getLeafNode(node);
		}
	}
	function containsNode(outerNode, innerNode) {
		return outerNode && innerNode ? outerNode === innerNode ? !0 : outerNode && 3 === outerNode.nodeType ? !1 : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : !1 : !1;
	}
	function getActiveElementDeep(containerInfo) {
		containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
		for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement;) {
			try {
				var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
			} catch (err) {
				JSCompiler_inline_result = !1;
			}
			if (JSCompiler_inline_result) containerInfo = element.contentWindow;
			else break;
			element = getActiveElement(containerInfo.document);
		}
		return element;
	}
	function hasSelectionCapabilities(elem) {
		var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
	}
	var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode;
	var activeElement = null;
	var activeElementInst = null;
	var lastSelection = null;
	var mouseDown = !1;
	function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
		var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
		mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = {
			start: doc.selectionStart,
			end: doc.selectionEnd
		} : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
			anchorNode: doc.anchorNode,
			anchorOffset: doc.anchorOffset,
			focusNode: doc.focusNode,
			focusOffset: doc.focusOffset
		}), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
			event: nativeEvent,
			listeners: doc
		}), nativeEvent.target = activeElement)));
	}
	function makePrefixMap(styleProp, eventName) {
		var prefixes = {};
		prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
		prefixes["Webkit" + styleProp] = "webkit" + eventName;
		prefixes["Moz" + styleProp] = "moz" + eventName;
		return prefixes;
	}
	var vendorPrefixes = {
		animationend: makePrefixMap("Animation", "AnimationEnd"),
		animationiteration: makePrefixMap("Animation", "AnimationIteration"),
		animationstart: makePrefixMap("Animation", "AnimationStart"),
		transitionrun: makePrefixMap("Transition", "TransitionRun"),
		transitionstart: makePrefixMap("Transition", "TransitionStart"),
		transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
		transitionend: makePrefixMap("Transition", "TransitionEnd")
	};
	var prefixedEventNames = {};
	var style = {};
	canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
	function getVendorPrefixedEventName(eventName) {
		if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
		if (!vendorPrefixes[eventName]) return eventName;
		var prefixMap = vendorPrefixes[eventName], styleProp;
		for (styleProp in prefixMap) if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) return prefixedEventNames[eventName] = prefixMap[styleProp];
		return eventName;
	}
	var ANIMATION_END = getVendorPrefixedEventName("animationend");
	var ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration");
	var ANIMATION_START = getVendorPrefixedEventName("animationstart");
	var TRANSITION_RUN = getVendorPrefixedEventName("transitionrun");
	var TRANSITION_START = getVendorPrefixedEventName("transitionstart");
	var TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel");
	var TRANSITION_END = getVendorPrefixedEventName("transitionend");
	var topLevelEventsToReactNames = /* @__PURE__ */ new Map();
	var simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	simpleEventPluginEvents.push("scrollEnd");
	function registerSimpleEvent(domEventName, reactName) {
		topLevelEventsToReactNames.set(domEventName, reactName);
		registerTwoPhaseEvent(reactName, [domEventName]);
	}
	var CapturedStacks = /* @__PURE__ */ new WeakMap();
	function createCapturedValueAtFiber(value, source) {
		if ("object" === typeof value && null !== value) {
			var existing = CapturedStacks.get(value);
			if (void 0 !== existing) return existing;
			source = {
				value,
				source,
				stack: getStackByFiberInDevAndProd(source)
			};
			CapturedStacks.set(value, source);
			return source;
		}
		return {
			value,
			source,
			stack: getStackByFiberInDevAndProd(source)
		};
	}
	var concurrentQueues = [];
	var concurrentQueuesIndex = 0;
	var concurrentlyUpdatedLanes = 0;
	function finishQueueingConcurrentUpdates() {
		for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex;) {
			var fiber = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var queue = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var update = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var lane = concurrentQueues[i];
			concurrentQueues[i++] = null;
			if (null !== queue && null !== update) {
				var pending = queue.pending;
				null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
				queue.pending = update;
			}
			0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
		}
	}
	function enqueueUpdate$1(fiber, queue, update, lane) {
		concurrentQueues[concurrentQueuesIndex++] = fiber;
		concurrentQueues[concurrentQueuesIndex++] = queue;
		concurrentQueues[concurrentQueuesIndex++] = update;
		concurrentQueues[concurrentQueuesIndex++] = lane;
		concurrentlyUpdatedLanes |= lane;
		fiber.lanes |= lane;
		fiber = fiber.alternate;
		null !== fiber && (fiber.lanes |= lane);
	}
	function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
		enqueueUpdate$1(fiber, queue, update, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function enqueueConcurrentRenderForLane(fiber, lane) {
		enqueueUpdate$1(fiber, null, null, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
		sourceFiber.lanes |= lane;
		var alternate = sourceFiber.alternate;
		null !== alternate && (alternate.lanes |= lane);
		for (var isHidden = !1, parent = sourceFiber.return; null !== parent;) parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = !0)), sourceFiber = parent, parent = parent.return;
		return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
	}
	function getRootForUpdatedFiber(sourceFiber) {
		if (50 < nestedUpdateCount) throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
		for (var parent = sourceFiber.return; null !== parent;) sourceFiber = parent, parent = sourceFiber.return;
		return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
	}
	var emptyContextObject = {};
	function FiberNode(tag, pendingProps, key, mode) {
		this.tag = tag;
		this.key = key;
		this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
		this.index = 0;
		this.refCleanup = this.ref = null;
		this.pendingProps = pendingProps;
		this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
		this.mode = mode;
		this.subtreeFlags = this.flags = 0;
		this.deletions = null;
		this.childLanes = this.lanes = 0;
		this.alternate = null;
	}
	function createFiberImplClass(tag, pendingProps, key, mode) {
		return new FiberNode(tag, pendingProps, key, mode);
	}
	function shouldConstruct(Component) {
		Component = Component.prototype;
		return !(!Component || !Component.isReactComponent);
	}
	function createWorkInProgress(current, pendingProps) {
		var workInProgress = current.alternate;
		null === workInProgress ? (workInProgress = createFiberImplClass(current.tag, pendingProps, current.key, current.mode), workInProgress.elementType = current.elementType, workInProgress.type = current.type, workInProgress.stateNode = current.stateNode, workInProgress.alternate = current, current.alternate = workInProgress) : (workInProgress.pendingProps = pendingProps, workInProgress.type = current.type, workInProgress.flags = 0, workInProgress.subtreeFlags = 0, workInProgress.deletions = null);
		workInProgress.flags = current.flags & 65011712;
		workInProgress.childLanes = current.childLanes;
		workInProgress.lanes = current.lanes;
		workInProgress.child = current.child;
		workInProgress.memoizedProps = current.memoizedProps;
		workInProgress.memoizedState = current.memoizedState;
		workInProgress.updateQueue = current.updateQueue;
		pendingProps = current.dependencies;
		workInProgress.dependencies = null === pendingProps ? null : {
			lanes: pendingProps.lanes,
			firstContext: pendingProps.firstContext
		};
		workInProgress.sibling = current.sibling;
		workInProgress.index = current.index;
		workInProgress.ref = current.ref;
		workInProgress.refCleanup = current.refCleanup;
		return workInProgress;
	}
	function resetWorkInProgress(workInProgress, renderLanes) {
		workInProgress.flags &= 65011714;
		var current = workInProgress.alternate;
		null === current ? (workInProgress.childLanes = 0, workInProgress.lanes = renderLanes, workInProgress.child = null, workInProgress.subtreeFlags = 0, workInProgress.memoizedProps = null, workInProgress.memoizedState = null, workInProgress.updateQueue = null, workInProgress.dependencies = null, workInProgress.stateNode = null) : (workInProgress.childLanes = current.childLanes, workInProgress.lanes = current.lanes, workInProgress.child = current.child, workInProgress.subtreeFlags = 0, workInProgress.deletions = null, workInProgress.memoizedProps = current.memoizedProps, workInProgress.memoizedState = current.memoizedState, workInProgress.updateQueue = current.updateQueue, workInProgress.type = current.type, renderLanes = current.dependencies, workInProgress.dependencies = null === renderLanes ? null : {
			lanes: renderLanes.lanes,
			firstContext: renderLanes.firstContext
		});
		return workInProgress;
	}
	function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
		var fiberTag = 0;
		owner = type;
		if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
		else if ("string" === typeof type) fiberTag = isHostHoistableType(type, pendingProps, contextStackCursor.current) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
		else a: switch (type) {
			case REACT_ACTIVITY_TYPE: return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
			case REACT_FRAGMENT_TYPE: return createFiberFromFragment(pendingProps.children, mode, lanes, key);
			case REACT_STRICT_MODE_TYPE:
				fiberTag = 8;
				mode |= 24;
				break;
			case REACT_PROFILER_TYPE: return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
			case REACT_SUSPENSE_TYPE: return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
			case REACT_SUSPENSE_LIST_TYPE: return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
			default:
				if ("object" === typeof type && null !== type) switch (type.$$typeof) {
					case REACT_PROVIDER_TYPE:
					case REACT_CONTEXT_TYPE:
						fiberTag = 10;
						break a;
					case REACT_CONSUMER_TYPE:
						fiberTag = 9;
						break a;
					case REACT_FORWARD_REF_TYPE:
						fiberTag = 11;
						break a;
					case REACT_MEMO_TYPE:
						fiberTag = 14;
						break a;
					case REACT_LAZY_TYPE:
						fiberTag = 16;
						owner = null;
						break a;
				}
				fiberTag = 29;
				pendingProps = Error(formatProdErrorMessage(130, null === type ? "null" : typeof type, ""));
				owner = null;
		}
		key = createFiberImplClass(fiberTag, pendingProps, key, mode);
		key.elementType = type;
		key.type = owner;
		key.lanes = lanes;
		return key;
	}
	function createFiberFromFragment(elements, mode, lanes, key) {
		elements = createFiberImplClass(7, elements, key, mode);
		elements.lanes = lanes;
		return elements;
	}
	function createFiberFromText(content, mode, lanes) {
		content = createFiberImplClass(6, content, null, mode);
		content.lanes = lanes;
		return content;
	}
	function createFiberFromPortal(portal, mode, lanes) {
		mode = createFiberImplClass(4, null !== portal.children ? portal.children : [], portal.key, mode);
		mode.lanes = lanes;
		mode.stateNode = {
			containerInfo: portal.containerInfo,
			pendingChildren: null,
			implementation: portal.implementation
		};
		return mode;
	}
	var forkStack = [];
	var forkStackIndex = 0;
	var treeForkProvider = null;
	var treeForkCount = 0;
	var idStack = [];
	var idStackIndex = 0;
	var treeContextProvider = null;
	var treeContextId = 1;
	var treeContextOverflow = "";
	function pushTreeFork(workInProgress, totalChildren) {
		forkStack[forkStackIndex++] = treeForkCount;
		forkStack[forkStackIndex++] = treeForkProvider;
		treeForkProvider = workInProgress;
		treeForkCount = totalChildren;
	}
	function pushTreeId(workInProgress, totalChildren, index) {
		idStack[idStackIndex++] = treeContextId;
		idStack[idStackIndex++] = treeContextOverflow;
		idStack[idStackIndex++] = treeContextProvider;
		treeContextProvider = workInProgress;
		var baseIdWithLeadingBit = treeContextId;
		workInProgress = treeContextOverflow;
		var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
		baseIdWithLeadingBit &= ~(1 << baseLength);
		index += 1;
		var length = 32 - clz32(totalChildren) + baseLength;
		if (30 < length) {
			var numberOfOverflowBits = baseLength - baseLength % 5;
			length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
			baseIdWithLeadingBit >>= numberOfOverflowBits;
			baseLength -= numberOfOverflowBits;
			treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit;
			treeContextOverflow = length + workInProgress;
		} else treeContextId = 1 << length | index << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress;
	}
	function pushMaterializedTreeId(workInProgress) {
		null !== workInProgress.return && (pushTreeFork(workInProgress, 1), pushTreeId(workInProgress, 1, 0));
	}
	function popTreeContext(workInProgress) {
		for (; workInProgress === treeForkProvider;) treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
		for (; workInProgress === treeContextProvider;) treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
	}
	var hydrationParentFiber = null;
	var nextHydratableInstance = null;
	var isHydrating = !1;
	var hydrationErrors = null;
	var rootOrSingletonContext = !1;
	var HydrationMismatchException = Error(formatProdErrorMessage(519));
	function throwOnHydrationMismatch(fiber) {
		queueHydrationError(createCapturedValueAtFiber(Error(formatProdErrorMessage(418, "")), fiber));
		throw HydrationMismatchException;
	}
	function prepareToHydrateHostInstance(fiber) {
		var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
		instance[internalInstanceKey] = fiber;
		instance[internalPropsKey] = props;
		switch (type) {
			case "dialog":
				listenToNonDelegatedEvent("cancel", instance);
				listenToNonDelegatedEvent("close", instance);
				break;
			case "iframe":
			case "object":
			case "embed":
				listenToNonDelegatedEvent("load", instance);
				break;
			case "video":
			case "audio":
				for (type = 0; type < mediaEventTypes.length; type++) listenToNonDelegatedEvent(mediaEventTypes[type], instance);
				break;
			case "source":
				listenToNonDelegatedEvent("error", instance);
				break;
			case "img":
			case "image":
			case "link":
				listenToNonDelegatedEvent("error", instance);
				listenToNonDelegatedEvent("load", instance);
				break;
			case "details":
				listenToNonDelegatedEvent("toggle", instance);
				break;
			case "input":
				listenToNonDelegatedEvent("invalid", instance);
				initInput(instance, props.value, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name, !0);
				track(instance);
				break;
			case "select":
				listenToNonDelegatedEvent("invalid", instance);
				break;
			case "textarea": listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children), track(instance);
		}
		type = props.children;
		"string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || !0 === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = !0) : instance = !1;
		instance || throwOnHydrationMismatch(fiber);
	}
	function popToNextHostParent(fiber) {
		for (hydrationParentFiber = fiber.return; hydrationParentFiber;) switch (hydrationParentFiber.tag) {
			case 5:
			case 13:
				rootOrSingletonContext = !1;
				return;
			case 27:
			case 3:
				rootOrSingletonContext = !0;
				return;
			default: hydrationParentFiber = hydrationParentFiber.return;
		}
	}
	function popHydrationState(fiber) {
		if (fiber !== hydrationParentFiber) return !1;
		if (!isHydrating) return popToNextHostParent(fiber), isHydrating = !0, !1;
		var tag = fiber.tag, JSCompiler_temp;
		if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
			if (JSCompiler_temp = 5 === tag) JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
			JSCompiler_temp = !JSCompiler_temp;
		}
		JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
		popToNextHostParent(fiber);
		if (13 === tag) {
			fiber = fiber.memoizedState;
			fiber = null !== fiber ? fiber.dehydrated : null;
			if (!fiber) throw Error(formatProdErrorMessage(317));
			a: {
				fiber = fiber.nextSibling;
				for (tag = 0; fiber;) {
					if (8 === fiber.nodeType) if (JSCompiler_temp = fiber.data, "/$" === JSCompiler_temp) {
						if (0 === tag) {
							nextHydratableInstance = getNextHydratable(fiber.nextSibling);
							break a;
						}
						tag--;
					} else "$" !== JSCompiler_temp && "$!" !== JSCompiler_temp && "$?" !== JSCompiler_temp || tag++;
					fiber = fiber.nextSibling;
				}
				nextHydratableInstance = null;
			}
		} else 27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
		return !0;
	}
	function resetHydrationState() {
		nextHydratableInstance = hydrationParentFiber = null;
		isHydrating = !1;
	}
	function upgradeHydrationErrorsToRecoverable() {
		var queuedErrors = hydrationErrors;
		null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, queuedErrors), hydrationErrors = null);
		return queuedErrors;
	}
	function queueHydrationError(error) {
		null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
	}
	var valueCursor = createCursor(null);
	var currentlyRenderingFiber$1 = null;
	var lastContextDependency = null;
	function pushProvider(providerFiber, context, nextValue) {
		push(valueCursor, context._currentValue);
		context._currentValue = nextValue;
	}
	function popProvider(context) {
		context._currentValue = valueCursor.current;
		pop(valueCursor);
	}
	function scheduleContextWorkOnParentPath(parent, renderLanes, propagationRoot) {
		for (; null !== parent;) {
			var alternate = parent.alternate;
			(parent.childLanes & renderLanes) !== renderLanes ? (parent.childLanes |= renderLanes, null !== alternate && (alternate.childLanes |= renderLanes)) : null !== alternate && (alternate.childLanes & renderLanes) !== renderLanes && (alternate.childLanes |= renderLanes);
			if (parent === propagationRoot) break;
			parent = parent.return;
		}
	}
	function propagateContextChanges(workInProgress, contexts, renderLanes, forcePropagateEntireTree) {
		var fiber = workInProgress.child;
		null !== fiber && (fiber.return = workInProgress);
		for (; null !== fiber;) {
			var list = fiber.dependencies;
			if (null !== list) {
				var nextFiber = fiber.child;
				list = list.firstContext;
				a: for (; null !== list;) {
					var dependency = list;
					list = fiber;
					for (var i = 0; i < contexts.length; i++) if (dependency.context === contexts[i]) {
						list.lanes |= renderLanes;
						dependency = list.alternate;
						null !== dependency && (dependency.lanes |= renderLanes);
						scheduleContextWorkOnParentPath(list.return, renderLanes, workInProgress);
						forcePropagateEntireTree || (nextFiber = null);
						break a;
					}
					list = dependency.next;
				}
			} else if (18 === fiber.tag) {
				nextFiber = fiber.return;
				if (null === nextFiber) throw Error(formatProdErrorMessage(341));
				nextFiber.lanes |= renderLanes;
				list = nextFiber.alternate;
				null !== list && (list.lanes |= renderLanes);
				scheduleContextWorkOnParentPath(nextFiber, renderLanes, workInProgress);
				nextFiber = null;
			} else nextFiber = fiber.child;
			if (null !== nextFiber) nextFiber.return = fiber;
			else for (nextFiber = fiber; null !== nextFiber;) {
				if (nextFiber === workInProgress) {
					nextFiber = null;
					break;
				}
				fiber = nextFiber.sibling;
				if (null !== fiber) {
					fiber.return = nextFiber.return;
					nextFiber = fiber;
					break;
				}
				nextFiber = nextFiber.return;
			}
			fiber = nextFiber;
		}
	}
	function propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree) {
		current = null;
		for (var parent = workInProgress, isInsidePropagationBailout = !1; null !== parent;) {
			if (!isInsidePropagationBailout) {
				if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = !0;
				else if (0 !== (parent.flags & 262144)) break;
			}
			if (10 === parent.tag) {
				var currentParent = parent.alternate;
				if (null === currentParent) throw Error(formatProdErrorMessage(387));
				currentParent = currentParent.memoizedProps;
				if (null !== currentParent) {
					var context = parent.type;
					objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
				}
			} else if (parent === hostTransitionProviderCursor.current) {
				currentParent = parent.alternate;
				if (null === currentParent) throw Error(formatProdErrorMessage(387));
				currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
			}
			parent = parent.return;
		}
		null !== current && propagateContextChanges(workInProgress, current, renderLanes, forcePropagateEntireTree);
		workInProgress.flags |= 262144;
	}
	function checkIfContextChanged(currentDependencies) {
		for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies;) {
			if (!objectIs(currentDependencies.context._currentValue, currentDependencies.memoizedValue)) return !0;
			currentDependencies = currentDependencies.next;
		}
		return !1;
	}
	function prepareToReadContext(workInProgress) {
		currentlyRenderingFiber$1 = workInProgress;
		lastContextDependency = null;
		workInProgress = workInProgress.dependencies;
		null !== workInProgress && (workInProgress.firstContext = null);
	}
	function readContext(context) {
		return readContextForConsumer(currentlyRenderingFiber$1, context);
	}
	function readContextDuringReconciliation(consumer, context) {
		null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
		return readContextForConsumer(consumer, context);
	}
	function readContextForConsumer(consumer, context) {
		var value = context._currentValue;
		context = {
			context,
			memoizedValue: value,
			next: null
		};
		if (null === lastContextDependency) {
			if (null === consumer) throw Error(formatProdErrorMessage(308));
			lastContextDependency = context;
			consumer.dependencies = {
				lanes: 0,
				firstContext: context
			};
			consumer.flags |= 524288;
		} else lastContextDependency = lastContextDependency.next = context;
		return value;
	}
	var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
		var listeners = [], signal = this.signal = {
			aborted: !1,
			addEventListener: function(type, listener) {
				listeners.push(listener);
			}
		};
		this.abort = function() {
			signal.aborted = !0;
			listeners.forEach(function(listener) {
				return listener();
			});
		};
	};
	var scheduleCallback$2 = Scheduler.unstable_scheduleCallback;
	var NormalPriority = Scheduler.unstable_NormalPriority;
	var CacheContext = {
		$$typeof: REACT_CONTEXT_TYPE,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function createCache() {
		return {
			controller: new AbortControllerLocal(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function releaseCache(cache) {
		cache.refCount--;
		0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
			cache.controller.abort();
		});
	}
	var currentEntangledListeners = null;
	var currentEntangledPendingCount = 0;
	var currentEntangledLane = 0;
	var currentEntangledActionThenable = null;
	function entangleAsyncAction(transition, thenable) {
		if (null === currentEntangledListeners) {
			var entangledListeners = currentEntangledListeners = [];
			currentEntangledPendingCount = 0;
			currentEntangledLane = requestTransitionLane();
			currentEntangledActionThenable = {
				status: "pending",
				value: void 0,
				then: function(resolve) {
					entangledListeners.push(resolve);
				}
			};
		}
		currentEntangledPendingCount++;
		thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
		return thenable;
	}
	function pingEngtangledActionScope() {
		if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
			null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
			var listeners = currentEntangledListeners;
			currentEntangledListeners = null;
			currentEntangledLane = 0;
			currentEntangledActionThenable = null;
			for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
		}
	}
	function chainThenableValue(thenable, result) {
		var listeners = [], thenableWithOverride = {
			status: "pending",
			value: null,
			reason: null,
			then: function(resolve) {
				listeners.push(resolve);
			}
		};
		thenable.then(function() {
			thenableWithOverride.status = "fulfilled";
			thenableWithOverride.value = result;
			for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
		}, function(error) {
			thenableWithOverride.status = "rejected";
			thenableWithOverride.reason = error;
			for (error = 0; error < listeners.length; error++) (0, listeners[error])(void 0);
		});
		return thenableWithOverride;
	}
	var prevOnStartTransitionFinish = ReactSharedInternals.S;
	ReactSharedInternals.S = function(transition, returnValue) {
		"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
		null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
	};
	var resumedCache = createCursor(null);
	function peekCacheFromPool() {
		var cacheResumedFromPreviousRender = resumedCache.current;
		return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
	}
	function pushTransition(offscreenWorkInProgress, prevCachePool) {
		null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
	}
	function getSuspendedCache() {
		var cacheFromPool = peekCacheFromPool();
		return null === cacheFromPool ? null : {
			parent: CacheContext._currentValue,
			pool: cacheFromPool
		};
	}
	var SuspenseException = Error(formatProdErrorMessage(460));
	var SuspenseyCommitException = Error(formatProdErrorMessage(474));
	var SuspenseActionException = Error(formatProdErrorMessage(542));
	var noopSuspenseyCommitThenable = { then: function() {} };
	function isThenableResolved(thenable) {
		thenable = thenable.status;
		return "fulfilled" === thenable || "rejected" === thenable;
	}
	function noop$3() {}
	function trackUsedThenable(thenableState, thenable, index) {
		index = thenableState[index];
		void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop$3, noop$3), thenable = index);
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
			default:
				if ("string" === typeof thenable.status) thenable.then(noop$3, noop$3);
				else {
					thenableState = workInProgressRoot;
					if (null !== thenableState && 100 < thenableState.shellSuspendCounter) throw Error(formatProdErrorMessage(482));
					thenableState = thenable;
					thenableState.status = "pending";
					thenableState.then(function(fulfilledValue) {
						if ("pending" === thenable.status) {
							var fulfilledThenable = thenable;
							fulfilledThenable.status = "fulfilled";
							fulfilledThenable.value = fulfilledValue;
						}
					}, function(error) {
						if ("pending" === thenable.status) {
							var rejectedThenable = thenable;
							rejectedThenable.status = "rejected";
							rejectedThenable.reason = error;
						}
					});
				}
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
				}
				suspendedThenable = thenable;
				throw SuspenseException;
		}
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
		if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
		var thenable = suspendedThenable;
		suspendedThenable = null;
		return thenable;
	}
	function checkIfUseWrappedInAsyncCatch(rejectedReason) {
		if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException) throw Error(formatProdErrorMessage(483));
	}
	var hasForceUpdate = !1;
	function initializeUpdateQueue(fiber) {
		fiber.updateQueue = {
			baseState: fiber.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function cloneUpdateQueue(current, workInProgress) {
		current = current.updateQueue;
		workInProgress.updateQueue === current && (workInProgress.updateQueue = {
			baseState: current.baseState,
			firstBaseUpdate: current.firstBaseUpdate,
			lastBaseUpdate: current.lastBaseUpdate,
			shared: current.shared,
			callbacks: null
		});
	}
	function createUpdate(lane) {
		return {
			lane,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function enqueueUpdate(fiber, update, lane) {
		var updateQueue = fiber.updateQueue;
		if (null === updateQueue) return null;
		updateQueue = updateQueue.shared;
		if (0 !== (executionContext & 2)) {
			var pending = updateQueue.pending;
			null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
			updateQueue.pending = update;
			update = getRootForUpdatedFiber(fiber);
			markUpdateLaneFromFiberToRoot(fiber, null, lane);
			return update;
		}
		enqueueUpdate$1(fiber, updateQueue, update, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function entangleTransitions(root, fiber, lane) {
		fiber = fiber.updateQueue;
		if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
			var queueLanes = fiber.lanes;
			queueLanes &= root.pendingLanes;
			lane |= queueLanes;
			fiber.lanes = lane;
			markRootEntangled(root, lane);
		}
	}
	function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
		var queue = workInProgress.updateQueue, current = workInProgress.alternate;
		if (null !== current && (current = current.updateQueue, queue === current)) {
			var newFirst = null, newLast = null;
			queue = queue.firstBaseUpdate;
			if (null !== queue) {
				do {
					var clone = {
						lane: queue.lane,
						tag: queue.tag,
						payload: queue.payload,
						callback: null,
						next: null
					};
					null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
					queue = queue.next;
				} while (null !== queue);
				null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
			} else newFirst = newLast = capturedUpdate;
			queue = {
				baseState: current.baseState,
				firstBaseUpdate: newFirst,
				lastBaseUpdate: newLast,
				shared: current.shared,
				callbacks: current.callbacks
			};
			workInProgress.updateQueue = queue;
			return;
		}
		workInProgress = queue.lastBaseUpdate;
		null === workInProgress ? queue.firstBaseUpdate = capturedUpdate : workInProgress.next = capturedUpdate;
		queue.lastBaseUpdate = capturedUpdate;
	}
	var didReadFromEntangledAsyncAction = !1;
	function suspendIfUpdateReadFromEntangledAsyncAction() {
		if (didReadFromEntangledAsyncAction) {
			var entangledActionThenable = currentEntangledActionThenable;
			if (null !== entangledActionThenable) throw entangledActionThenable;
		}
	}
	function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes) {
		didReadFromEntangledAsyncAction = !1;
		var queue = workInProgress$jscomp$0.updateQueue;
		hasForceUpdate = !1;
		var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
		if (null !== pendingQueue) {
			queue.shared.pending = null;
			var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
			lastPendingUpdate.next = null;
			null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
			lastBaseUpdate = lastPendingUpdate;
			var current = workInProgress$jscomp$0.alternate;
			null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
		}
		if (null !== firstBaseUpdate) {
			var newState = queue.baseState;
			lastBaseUpdate = 0;
			current = firstPendingUpdate = lastPendingUpdate = null;
			pendingQueue = firstBaseUpdate;
			do {
				var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
				if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
					0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = !0);
					null !== current && (current = current.next = {
						lane: 0,
						tag: pendingQueue.tag,
						payload: pendingQueue.payload,
						callback: null,
						next: null
					});
					a: {
						var workInProgress = workInProgress$jscomp$0, update = pendingQueue;
						updateLane = props;
						var instance = instance$jscomp$0;
						switch (update.tag) {
							case 1:
								workInProgress = update.payload;
								if ("function" === typeof workInProgress) {
									newState = workInProgress.call(instance, newState, updateLane);
									break a;
								}
								newState = workInProgress;
								break a;
							case 3: workInProgress.flags = workInProgress.flags & -65537 | 128;
							case 0:
								workInProgress = update.payload;
								updateLane = "function" === typeof workInProgress ? workInProgress.call(instance, newState, updateLane) : workInProgress;
								if (null === updateLane || void 0 === updateLane) break a;
								newState = assign({}, newState, updateLane);
								break a;
							case 2: hasForceUpdate = !0;
						}
					}
					updateLane = pendingQueue.callback;
					null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
				} else isHiddenUpdate = {
					lane: updateLane,
					tag: pendingQueue.tag,
					payload: pendingQueue.payload,
					callback: pendingQueue.callback,
					next: null
				}, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
				pendingQueue = pendingQueue.next;
				if (null === pendingQueue) if (pendingQueue = queue.shared.pending, null === pendingQueue) break;
				else isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
			} while (1);
			null === current && (lastPendingUpdate = newState);
			queue.baseState = lastPendingUpdate;
			queue.firstBaseUpdate = firstPendingUpdate;
			queue.lastBaseUpdate = current;
			null === firstBaseUpdate && (queue.shared.lanes = 0);
			workInProgressRootSkippedLanes |= lastBaseUpdate;
			workInProgress$jscomp$0.lanes = lastBaseUpdate;
			workInProgress$jscomp$0.memoizedState = newState;
		}
	}
	function callCallback(callback, context) {
		if ("function" !== typeof callback) throw Error(formatProdErrorMessage(191, callback));
		callback.call(context);
	}
	function commitCallbacks(updateQueue, context) {
		var callbacks = updateQueue.callbacks;
		if (null !== callbacks) for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++) callCallback(callbacks[updateQueue], context);
	}
	var currentTreeHiddenStackCursor = createCursor(null);
	var prevEntangledRenderLanesCursor = createCursor(0);
	function pushHiddenContext(fiber, context) {
		fiber = entangledRenderLanes;
		push(prevEntangledRenderLanesCursor, fiber);
		push(currentTreeHiddenStackCursor, context);
		entangledRenderLanes = fiber | context.baseLanes;
	}
	function reuseHiddenContextOnStack() {
		push(prevEntangledRenderLanesCursor, entangledRenderLanes);
		push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
	}
	function popHiddenContext() {
		entangledRenderLanes = prevEntangledRenderLanesCursor.current;
		pop(currentTreeHiddenStackCursor);
		pop(prevEntangledRenderLanesCursor);
	}
	var renderLanes = 0;
	var currentlyRenderingFiber = null;
	var currentHook = null;
	var workInProgressHook = null;
	var didScheduleRenderPhaseUpdate = !1;
	var didScheduleRenderPhaseUpdateDuringThisPass = !1;
	var shouldDoubleInvokeUserFnsInHooksDEV = !1;
	var localIdCounter = 0;
	var thenableIndexCounter$1 = 0;
	var thenableState$1 = null;
	var globalClientIdCounter = 0;
	function throwInvalidHookError() {
		throw Error(formatProdErrorMessage(321));
	}
	function areHookInputsEqual(nextDeps, prevDeps) {
		if (null === prevDeps) return !1;
		for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) if (!objectIs(nextDeps[i], prevDeps[i])) return !1;
		return !0;
	}
	function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
		renderLanes = nextRenderLanes;
		currentlyRenderingFiber = workInProgress;
		workInProgress.memoizedState = null;
		workInProgress.updateQueue = null;
		workInProgress.lanes = 0;
		ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
		shouldDoubleInvokeUserFnsInHooksDEV = !1;
		nextRenderLanes = Component(props, secondArg);
		shouldDoubleInvokeUserFnsInHooksDEV = !1;
		didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(workInProgress, Component, props, secondArg));
		finishRenderingHooks(current);
		return nextRenderLanes;
	}
	function finishRenderingHooks(current) {
		ReactSharedInternals.H = ContextOnlyDispatcher;
		var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
		renderLanes = 0;
		workInProgressHook = currentHook = currentlyRenderingFiber = null;
		didScheduleRenderPhaseUpdate = !1;
		thenableIndexCounter$1 = 0;
		thenableState$1 = null;
		if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
		null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = !0));
	}
	function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
		currentlyRenderingFiber = workInProgress;
		var numberOfReRenders = 0;
		do {
			didScheduleRenderPhaseUpdateDuringThisPass && (thenableState$1 = null);
			thenableIndexCounter$1 = 0;
			didScheduleRenderPhaseUpdateDuringThisPass = !1;
			if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
			numberOfReRenders += 1;
			workInProgressHook = currentHook = null;
			if (null != workInProgress.updateQueue) {
				var children = workInProgress.updateQueue;
				children.lastEffect = null;
				children.events = null;
				children.stores = null;
				null != children.memoCache && (children.memoCache.index = 0);
			}
			ReactSharedInternals.H = HooksDispatcherOnRerender;
			children = Component(props, secondArg);
		} while (didScheduleRenderPhaseUpdateDuringThisPass);
		return children;
	}
	function TransitionAwareHostComponent() {
		var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
		maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
		dispatcher = dispatcher.useState()[0];
		(null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
		return maybeThenable;
	}
	function checkDidRenderIdHook() {
		var didRenderIdHook = 0 !== localIdCounter;
		localIdCounter = 0;
		return didRenderIdHook;
	}
	function bailoutHooks(current, workInProgress, lanes) {
		workInProgress.updateQueue = current.updateQueue;
		workInProgress.flags &= -2053;
		current.lanes &= ~lanes;
	}
	function resetHooksOnUnwind(workInProgress) {
		if (didScheduleRenderPhaseUpdate) {
			for (workInProgress = workInProgress.memoizedState; null !== workInProgress;) {
				var queue = workInProgress.queue;
				null !== queue && (queue.pending = null);
				workInProgress = workInProgress.next;
			}
			didScheduleRenderPhaseUpdate = !1;
		}
		renderLanes = 0;
		workInProgressHook = currentHook = currentlyRenderingFiber = null;
		didScheduleRenderPhaseUpdateDuringThisPass = !1;
		thenableIndexCounter$1 = localIdCounter = 0;
		thenableState$1 = null;
	}
	function mountWorkInProgressHook() {
		var hook = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
		return workInProgressHook;
	}
	function updateWorkInProgressHook() {
		if (null === currentHook) {
			var nextCurrentHook = currentlyRenderingFiber.alternate;
			nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
		} else nextCurrentHook = currentHook.next;
		var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
		if (null !== nextWorkInProgressHook) workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
		else {
			if (null === nextCurrentHook) {
				if (null === currentlyRenderingFiber.alternate) throw Error(formatProdErrorMessage(467));
				throw Error(formatProdErrorMessage(310));
			}
			currentHook = nextCurrentHook;
			nextCurrentHook = {
				memoizedState: currentHook.memoizedState,
				baseState: currentHook.baseState,
				baseQueue: currentHook.baseQueue,
				queue: currentHook.queue,
				next: null
			};
			null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
		}
		return workInProgressHook;
	}
	function createFunctionComponentUpdateQueue() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function useThenable(thenable) {
		var index = thenableIndexCounter$1;
		thenableIndexCounter$1 += 1;
		null === thenableState$1 && (thenableState$1 = []);
		thenable = trackUsedThenable(thenableState$1, thenable, index);
		index = currentlyRenderingFiber;
		null === (null === workInProgressHook ? index.memoizedState : workInProgressHook.next) && (index = index.alternate, ReactSharedInternals.H = null === index || null === index.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
		return thenable;
	}
	function use(usable) {
		if (null !== usable && "object" === typeof usable) {
			if ("function" === typeof usable.then) return useThenable(usable);
			if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
		}
		throw Error(formatProdErrorMessage(438, String(usable)));
	}
	function useMemoCache(size) {
		var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
		null !== updateQueue && (memoCache = updateQueue.memoCache);
		if (null == memoCache) {
			var current = currentlyRenderingFiber.alternate;
			null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
				data: current.data.map(function(array) {
					return array.slice();
				}),
				index: 0
			})));
		}
		memoCache ??= {
			data: [],
			index: 0
		};
		null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
		updateQueue.memoCache = memoCache;
		updateQueue = memoCache.data[memoCache.index];
		if (void 0 === updateQueue) for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++) updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
		memoCache.index++;
		return updateQueue;
	}
	function basicStateReducer(state, action) {
		return "function" === typeof action ? action(state) : action;
	}
	function updateReducer(reducer) {
		return updateReducerImpl(updateWorkInProgressHook(), currentHook, reducer);
	}
	function updateReducerImpl(hook, current, reducer) {
		var queue = hook.queue;
		if (null === queue) throw Error(formatProdErrorMessage(311));
		queue.lastRenderedReducer = reducer;
		var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
		if (null !== pendingQueue) {
			if (null !== baseQueue) {
				var baseFirst = baseQueue.next;
				baseQueue.next = pendingQueue.next;
				pendingQueue.next = baseFirst;
			}
			current.baseQueue = baseQueue = pendingQueue;
			queue.pending = null;
		}
		pendingQueue = hook.baseState;
		if (null === baseQueue) hook.memoizedState = pendingQueue;
		else {
			current = baseQueue.next;
			var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$32 = !1;
			do {
				var updateLane = update.lane & -536870913;
				if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
					var revertLane = update.revertLane;
					if (0 === revertLane) null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
						lane: 0,
						revertLane: 0,
						action: update.action,
						hasEagerState: update.hasEagerState,
						eagerState: update.eagerState,
						next: null
					}), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$32 = !0);
					else if ((renderLanes & revertLane) === revertLane) {
						update = update.next;
						revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$32 = !0);
						continue;
					} else updateLane = {
						lane: 0,
						revertLane: update.revertLane,
						action: update.action,
						hasEagerState: update.hasEagerState,
						eagerState: update.eagerState,
						next: null
					}, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
					updateLane = update.action;
					shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
					pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
				} else revertLane = {
					lane: updateLane,
					revertLane: update.revertLane,
					action: update.action,
					hasEagerState: update.hasEagerState,
					eagerState: update.eagerState,
					next: null
				}, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
				update = update.next;
			} while (null !== update && update !== current);
			null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
			if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = !0, didReadFromEntangledAsyncAction$32 && (reducer = currentEntangledActionThenable, null !== reducer))) throw reducer;
			hook.memoizedState = pendingQueue;
			hook.baseState = baseFirst;
			hook.baseQueue = newBaseQueueLast;
			queue.lastRenderedState = pendingQueue;
		}
		null === baseQueue && (queue.lanes = 0);
		return [hook.memoizedState, queue.dispatch];
	}
	function rerenderReducer(reducer) {
		var hook = updateWorkInProgressHook(), queue = hook.queue;
		if (null === queue) throw Error(formatProdErrorMessage(311));
		queue.lastRenderedReducer = reducer;
		var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
		if (null !== lastRenderPhaseUpdate) {
			queue.pending = null;
			var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
			do
				newState = reducer(newState, update.action), update = update.next;
			while (update !== lastRenderPhaseUpdate);
			objectIs(newState, hook.memoizedState) || (didReceiveUpdate = !0);
			hook.memoizedState = newState;
			null === hook.baseQueue && (hook.baseState = newState);
			queue.lastRenderedState = newState;
		}
		return [newState, dispatch];
	}
	function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
		var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
		if (isHydrating$jscomp$0) {
			if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
			getServerSnapshot = getServerSnapshot();
		} else getServerSnapshot = getSnapshot();
		var snapshotChanged = !objectIs((currentHook || hook).memoizedState, getServerSnapshot);
		snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = !0);
		hook = hook.queue;
		updateEffectImpl(2048, 8, subscribeToStore.bind(null, fiber, hook, subscribe), [subscribe]);
		if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
			fiber.flags |= 2048;
			pushSimpleEffect(9, createEffectInstance(), updateStoreInstance.bind(null, fiber, hook, getServerSnapshot, getSnapshot), null);
			if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
			isHydrating$jscomp$0 || 0 !== (renderLanes & 124) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
		}
		return getServerSnapshot;
	}
	function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
		fiber.flags |= 16384;
		fiber = {
			getSnapshot,
			value: renderedSnapshot
		};
		getSnapshot = currentlyRenderingFiber.updateQueue;
		null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
	}
	function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
		inst.value = nextSnapshot;
		inst.getSnapshot = getSnapshot;
		checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	}
	function subscribeToStore(fiber, inst, subscribe) {
		return subscribe(function() {
			checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
		});
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function forceStoreRerender(fiber) {
		var root = enqueueConcurrentRenderForLane(fiber, 2);
		null !== root && scheduleUpdateOnFiber(root, fiber, 2);
	}
	function mountStateImpl(initialState) {
		var hook = mountWorkInProgressHook();
		if ("function" === typeof initialState) {
			var initialStateInitializer = initialState;
			initialState = initialStateInitializer();
			if (shouldDoubleInvokeUserFnsInHooksDEV) {
				setIsStrictModeForDevtools(!0);
				try {
					initialStateInitializer();
				} finally {
					setIsStrictModeForDevtools(!1);
				}
			}
		}
		hook.memoizedState = hook.baseState = initialState;
		hook.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: basicStateReducer,
			lastRenderedState: initialState
		};
		return hook;
	}
	function updateOptimisticImpl(hook, current, passthrough, reducer) {
		hook.baseState = passthrough;
		return updateReducerImpl(hook, currentHook, "function" === typeof reducer ? reducer : basicStateReducer);
	}
	function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
		if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
		fiber = actionQueue.action;
		if (null !== fiber) {
			var actionNode = {
				payload,
				action: fiber,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(listener) {
					actionNode.listeners.push(listener);
				}
			};
			null !== ReactSharedInternals.T ? setPendingState(!0) : actionNode.isTransition = !1;
			setState(actionNode);
			setPendingState = actionQueue.pending;
			null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
		}
	}
	function runActionStateAction(actionQueue, node) {
		var action = node.action, payload = node.payload, prevState = actionQueue.state;
		if (node.isTransition) {
			var prevTransition = ReactSharedInternals.T, currentTransition = {};
			ReactSharedInternals.T = currentTransition;
			try {
				var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
				null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
				handleActionReturnValue(actionQueue, node, returnValue);
			} catch (error) {
				onActionError(actionQueue, node, error);
			} finally {
				ReactSharedInternals.T = prevTransition;
			}
		} else try {
			prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
		} catch (error$38) {
			onActionError(actionQueue, node, error$38);
		}
	}
	function handleActionReturnValue(actionQueue, node, returnValue) {
		null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(function(nextState) {
			onActionSuccess(actionQueue, node, nextState);
		}, function(error) {
			return onActionError(actionQueue, node, error);
		}) : onActionSuccess(actionQueue, node, returnValue);
	}
	function onActionSuccess(actionQueue, actionNode, nextState) {
		actionNode.status = "fulfilled";
		actionNode.value = nextState;
		notifyActionListeners(actionNode);
		actionQueue.state = nextState;
		actionNode = actionQueue.pending;
		null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
	}
	function onActionError(actionQueue, actionNode, error) {
		var last = actionQueue.pending;
		actionQueue.pending = null;
		if (null !== last) {
			last = last.next;
			do
				actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
			while (actionNode !== last);
		}
		actionQueue.action = null;
	}
	function notifyActionListeners(actionNode) {
		actionNode = actionNode.listeners;
		for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
	}
	function actionStateReducer(oldState, newState) {
		return newState;
	}
	function mountActionState(action, initialStateProp) {
		if (isHydrating) {
			var ssrFormState = workInProgressRoot.formState;
			if (null !== ssrFormState) {
				a: {
					var JSCompiler_inline_result = currentlyRenderingFiber;
					if (isHydrating) {
						if (nextHydratableInstance) {
							b: {
								var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
								for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType;) {
									if (!inRootOrSingleton) {
										JSCompiler_inline_result$jscomp$0 = null;
										break b;
									}
									JSCompiler_inline_result$jscomp$0 = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
									if (null === JSCompiler_inline_result$jscomp$0) {
										JSCompiler_inline_result$jscomp$0 = null;
										break b;
									}
								}
								inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
								JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
							}
							if (JSCompiler_inline_result$jscomp$0) {
								nextHydratableInstance = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
								JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
								break a;
							}
						}
						throwOnHydrationMismatch(JSCompiler_inline_result);
					}
					JSCompiler_inline_result = !1;
				}
				JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
			}
		}
		ssrFormState = mountWorkInProgressHook();
		ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
		JSCompiler_inline_result = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: actionStateReducer,
			lastRenderedState: initialStateProp
		};
		ssrFormState.queue = JSCompiler_inline_result;
		ssrFormState = dispatchSetState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result);
		JSCompiler_inline_result.dispatch = ssrFormState;
		JSCompiler_inline_result = mountStateImpl(!1);
		inRootOrSingleton = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !1, JSCompiler_inline_result.queue);
		JSCompiler_inline_result = mountWorkInProgressHook();
		JSCompiler_inline_result$jscomp$0 = {
			state: initialStateProp,
			dispatch: null,
			action,
			pending: null
		};
		JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
		ssrFormState = dispatchActionState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result$jscomp$0, inRootOrSingleton, ssrFormState);
		JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
		JSCompiler_inline_result.memoizedState = action;
		return [
			initialStateProp,
			ssrFormState,
			!1
		];
	}
	function updateActionState(action) {
		return updateActionStateImpl(updateWorkInProgressHook(), currentHook, action);
	}
	function updateActionStateImpl(stateHook, currentStateHook, action) {
		currentStateHook = updateReducerImpl(stateHook, currentStateHook, actionStateReducer)[0];
		stateHook = updateReducer(basicStateReducer)[0];
		if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then) try {
			var state = useThenable(currentStateHook);
		} catch (x) {
			if (x === SuspenseException) throw SuspenseActionException;
			throw x;
		}
		else state = currentStateHook;
		currentStateHook = updateWorkInProgressHook();
		var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
		action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(9, createEffectInstance(), actionStateActionEffect.bind(null, actionQueue, action), null));
		return [
			state,
			dispatch,
			stateHook
		];
	}
	function actionStateActionEffect(actionQueue, action) {
		actionQueue.action = action;
	}
	function rerenderActionState(action) {
		var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
		if (null !== currentStateHook) return updateActionStateImpl(stateHook, currentStateHook, action);
		updateWorkInProgressHook();
		stateHook = stateHook.memoizedState;
		currentStateHook = updateWorkInProgressHook();
		var dispatch = currentStateHook.queue.dispatch;
		currentStateHook.memoizedState = action;
		return [
			stateHook,
			dispatch,
			!1
		];
	}
	function pushSimpleEffect(tag, inst, create, createDeps) {
		tag = {
			tag,
			create,
			deps: createDeps,
			inst,
			next: null
		};
		inst = currentlyRenderingFiber.updateQueue;
		null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
		create = inst.lastEffect;
		null === create ? inst.lastEffect = tag.next = tag : (createDeps = create.next, create.next = tag, tag.next = createDeps, inst.lastEffect = tag);
		return tag;
	}
	function createEffectInstance() {
		return {
			destroy: void 0,
			resource: void 0
		};
	}
	function updateRef() {
		return updateWorkInProgressHook().memoizedState;
	}
	function mountEffectImpl(fiberFlags, hookFlags, create, createDeps) {
		var hook = mountWorkInProgressHook();
		createDeps = void 0 === createDeps ? null : createDeps;
		currentlyRenderingFiber.flags |= fiberFlags;
		hook.memoizedState = pushSimpleEffect(1 | hookFlags, createEffectInstance(), create, createDeps);
	}
	function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var inst = hook.memoizedState.inst;
		null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(1 | hookFlags, inst, create, deps));
	}
	function mountEffect(create, createDeps) {
		mountEffectImpl(8390656, 8, create, createDeps);
	}
	function updateEffect(create, createDeps) {
		updateEffectImpl(2048, 8, create, createDeps);
	}
	function updateInsertionEffect(create, deps) {
		return updateEffectImpl(4, 2, create, deps);
	}
	function updateLayoutEffect(create, deps) {
		return updateEffectImpl(4, 4, create, deps);
	}
	function imperativeHandleEffect(create, ref) {
		if ("function" === typeof ref) {
			create = create();
			var refCleanup = ref(create);
			return function() {
				"function" === typeof refCleanup ? refCleanup() : ref(null);
			};
		}
		if (null !== ref && void 0 !== ref) return create = create(), ref.current = create, function() {
			ref.current = null;
		};
	}
	function updateImperativeHandle(ref, create, deps) {
		deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
		updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
	}
	function mountDebugValue() {}
	function updateCallback(callback, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var prevState = hook.memoizedState;
		if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
		hook.memoizedState = [callback, deps];
		return callback;
	}
	function updateMemo(nextCreate, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var prevState = hook.memoizedState;
		if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
		prevState = nextCreate();
		if (shouldDoubleInvokeUserFnsInHooksDEV) {
			setIsStrictModeForDevtools(!0);
			try {
				nextCreate();
			} finally {
				setIsStrictModeForDevtools(!1);
			}
		}
		hook.memoizedState = [prevState, deps];
		return prevState;
	}
	function mountDeferredValueImpl(hook, value, initialValue) {
		if (void 0 === initialValue || 0 !== (renderLanes & 1073741824)) return hook.memoizedState = value;
		hook.memoizedState = initialValue;
		hook = requestDeferredLane();
		currentlyRenderingFiber.lanes |= hook;
		workInProgressRootSkippedLanes |= hook;
		return initialValue;
	}
	function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
		if (objectIs(value, prevValue)) return value;
		if (null !== currentTreeHiddenStackCursor.current) return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = !0), hook;
		if (0 === (renderLanes & 42)) return didReceiveUpdate = !0, hook.memoizedState = value;
		hook = requestDeferredLane();
		currentlyRenderingFiber.lanes |= hook;
		workInProgressRootSkippedLanes |= hook;
		return prevValue;
	}
	function startTransition(fiber, queue, pendingState, finishedState, callback) {
		var previousPriority = ReactDOMSharedInternals.p;
		ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		dispatchOptimisticSetState(fiber, !1, queue, pendingState);
		try {
			var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) dispatchSetStateInternal(fiber, queue, chainThenableValue(returnValue, finishedState), requestUpdateLane(fiber));
			else dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane(fiber));
		} catch (error) {
			dispatchSetStateInternal(fiber, queue, {
				then: function() {},
				status: "rejected",
				reason: error
			}, requestUpdateLane());
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function noop$2() {}
	function startHostTransition(formFiber, pendingState, action, formData) {
		if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
		var queue = ensureFormComponentIsStateful(formFiber).queue;
		startTransition(formFiber, queue, pendingState, sharedNotPendingObject, null === action ? noop$2 : function() {
			requestFormReset$1(formFiber);
			return action(formData);
		});
	}
	function ensureFormComponentIsStateful(formFiber) {
		var existingStateHook = formFiber.memoizedState;
		if (null !== existingStateHook) return existingStateHook;
		existingStateHook = {
			memoizedState: sharedNotPendingObject,
			baseState: sharedNotPendingObject,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: basicStateReducer,
				lastRenderedState: sharedNotPendingObject
			},
			next: null
		};
		var initialResetState = {};
		existingStateHook.next = {
			memoizedState: initialResetState,
			baseState: initialResetState,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: basicStateReducer,
				lastRenderedState: initialResetState
			},
			next: null
		};
		formFiber.memoizedState = existingStateHook;
		formFiber = formFiber.alternate;
		null !== formFiber && (formFiber.memoizedState = existingStateHook);
		return existingStateHook;
	}
	function requestFormReset$1(formFiber) {
		var resetStateQueue = ensureFormComponentIsStateful(formFiber).next.queue;
		dispatchSetStateInternal(formFiber, resetStateQueue, {}, requestUpdateLane());
	}
	function useHostTransitionStatus() {
		return readContext(HostTransitionContext);
	}
	function updateId() {
		return updateWorkInProgressHook().memoizedState;
	}
	function updateRefresh() {
		return updateWorkInProgressHook().memoizedState;
	}
	function refreshCache(fiber) {
		for (var provider = fiber.return; null !== provider;) {
			switch (provider.tag) {
				case 24:
				case 3:
					var lane = requestUpdateLane();
					fiber = createUpdate(lane);
					var root$41 = enqueueUpdate(provider, fiber, lane);
					null !== root$41 && (scheduleUpdateOnFiber(root$41, provider, lane), entangleTransitions(root$41, provider, lane));
					provider = { cache: createCache() };
					fiber.payload = provider;
					return;
			}
			provider = provider.return;
		}
	}
	function dispatchReducerAction(fiber, queue, action) {
		var lane = requestUpdateLane();
		action = {
			lane,
			revertLane: 0,
			action,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
	}
	function dispatchSetState(fiber, queue, action) {
		dispatchSetStateInternal(fiber, queue, action, requestUpdateLane());
	}
	function dispatchSetStateInternal(fiber, queue, action, lane) {
		var update = {
			lane,
			revertLane: 0,
			action,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
		else {
			var alternate = fiber.alternate;
			if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate)) try {
				var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
				update.hasEagerState = !0;
				update.eagerState = eagerState;
				if (objectIs(eagerState, currentState)) return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), !1;
			} catch (error) {}
			action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
			if (null !== action) return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), !0;
		}
		return !1;
	}
	function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
		action = {
			lane: 2,
			revertLane: requestTransitionLane(),
			action,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (isRenderPhaseUpdate(fiber)) {
			if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
		} else throwIfDuringRender = enqueueConcurrentHookUpdate(fiber, queue, action, 2), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
	}
	function isRenderPhaseUpdate(fiber) {
		var alternate = fiber.alternate;
		return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
	}
	function enqueueRenderPhaseUpdate(queue, update) {
		didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = !0;
		var pending = queue.pending;
		null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
		queue.pending = update;
	}
	function entangleTransitionUpdate(root, queue, lane) {
		if (0 !== (lane & 4194048)) {
			var queueLanes = queue.lanes;
			queueLanes &= root.pendingLanes;
			lane |= queueLanes;
			queue.lanes = lane;
			markRootEntangled(root, lane);
		}
	}
	var ContextOnlyDispatcher = {
		readContext,
		use,
		useCallback: throwInvalidHookError,
		useContext: throwInvalidHookError,
		useEffect: throwInvalidHookError,
		useImperativeHandle: throwInvalidHookError,
		useLayoutEffect: throwInvalidHookError,
		useInsertionEffect: throwInvalidHookError,
		useMemo: throwInvalidHookError,
		useReducer: throwInvalidHookError,
		useRef: throwInvalidHookError,
		useState: throwInvalidHookError,
		useDebugValue: throwInvalidHookError,
		useDeferredValue: throwInvalidHookError,
		useTransition: throwInvalidHookError,
		useSyncExternalStore: throwInvalidHookError,
		useId: throwInvalidHookError,
		useHostTransitionStatus: throwInvalidHookError,
		useFormState: throwInvalidHookError,
		useActionState: throwInvalidHookError,
		useOptimistic: throwInvalidHookError,
		useMemoCache: throwInvalidHookError,
		useCacheRefresh: throwInvalidHookError
	};
	var HooksDispatcherOnMount = {
		readContext,
		use,
		useCallback: function(callback, deps) {
			mountWorkInProgressHook().memoizedState = [callback, void 0 === deps ? null : deps];
			return callback;
		},
		useContext: readContext,
		useEffect: mountEffect,
		useImperativeHandle: function(ref, create, deps) {
			deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
			mountEffectImpl(4194308, 4, imperativeHandleEffect.bind(null, create, ref), deps);
		},
		useLayoutEffect: function(create, deps) {
			return mountEffectImpl(4194308, 4, create, deps);
		},
		useInsertionEffect: function(create, deps) {
			mountEffectImpl(4, 2, create, deps);
		},
		useMemo: function(nextCreate, deps) {
			var hook = mountWorkInProgressHook();
			deps = void 0 === deps ? null : deps;
			var nextValue = nextCreate();
			if (shouldDoubleInvokeUserFnsInHooksDEV) {
				setIsStrictModeForDevtools(!0);
				try {
					nextCreate();
				} finally {
					setIsStrictModeForDevtools(!1);
				}
			}
			hook.memoizedState = [nextValue, deps];
			return nextValue;
		},
		useReducer: function(reducer, initialArg, init) {
			var hook = mountWorkInProgressHook();
			if (void 0 !== init) {
				var initialState = init(initialArg);
				if (shouldDoubleInvokeUserFnsInHooksDEV) {
					setIsStrictModeForDevtools(!0);
					try {
						init(initialArg);
					} finally {
						setIsStrictModeForDevtools(!1);
					}
				}
			} else initialState = initialArg;
			hook.memoizedState = hook.baseState = initialState;
			reducer = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: reducer,
				lastRenderedState: initialState
			};
			hook.queue = reducer;
			reducer = reducer.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, reducer);
			return [hook.memoizedState, reducer];
		},
		useRef: function(initialValue) {
			var hook = mountWorkInProgressHook();
			initialValue = { current: initialValue };
			return hook.memoizedState = initialValue;
		},
		useState: function(initialState) {
			initialState = mountStateImpl(initialState);
			var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
			queue.dispatch = dispatch;
			return [initialState.memoizedState, dispatch];
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			return mountDeferredValueImpl(mountWorkInProgressHook(), value, initialValue);
		},
		useTransition: function() {
			var stateHook = mountStateImpl(!1);
			stateHook = startTransition.bind(null, currentlyRenderingFiber, stateHook.queue, !0, !1);
			mountWorkInProgressHook().memoizedState = stateHook;
			return [!1, stateHook];
		},
		useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
			var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
			if (isHydrating) {
				if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
				getServerSnapshot = getServerSnapshot();
			} else {
				getServerSnapshot = getSnapshot();
				if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
				0 !== (workInProgressRootRenderLanes & 124) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
			}
			hook.memoizedState = getServerSnapshot;
			var inst = {
				value: getServerSnapshot,
				getSnapshot
			};
			hook.queue = inst;
			mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);
			fiber.flags |= 2048;
			pushSimpleEffect(9, createEffectInstance(), updateStoreInstance.bind(null, fiber, inst, getServerSnapshot, getSnapshot), null);
			return getServerSnapshot;
		},
		useId: function() {
			var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
			if (isHydrating) {
				var JSCompiler_inline_result = treeContextOverflow;
				var idWithLeadingBit = treeContextId;
				JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
				identifierPrefix = "«" + identifierPrefix + "R" + JSCompiler_inline_result;
				JSCompiler_inline_result = localIdCounter++;
				0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
				identifierPrefix += "»";
			} else JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "«" + identifierPrefix + "r" + JSCompiler_inline_result.toString(32) + "»";
			return hook.memoizedState = identifierPrefix;
		},
		useHostTransitionStatus,
		useFormState: mountActionState,
		useActionState: mountActionState,
		useOptimistic: function(passthrough) {
			var hook = mountWorkInProgressHook();
			hook.memoizedState = hook.baseState = passthrough;
			var queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			hook.queue = queue;
			hook = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !0, queue);
			queue.dispatch = hook;
			return [passthrough, hook];
		},
		useMemoCache,
		useCacheRefresh: function() {
			return mountWorkInProgressHook().memoizedState = refreshCache.bind(null, currentlyRenderingFiber);
		}
	};
	var HooksDispatcherOnUpdate = {
		readContext,
		use,
		useCallback: updateCallback,
		useContext: readContext,
		useEffect: updateEffect,
		useImperativeHandle: updateImperativeHandle,
		useInsertionEffect: updateInsertionEffect,
		useLayoutEffect: updateLayoutEffect,
		useMemo: updateMemo,
		useReducer: updateReducer,
		useRef: updateRef,
		useState: function() {
			return updateReducer(basicStateReducer);
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			return updateDeferredValueImpl(updateWorkInProgressHook(), currentHook.memoizedState, value, initialValue);
		},
		useTransition: function() {
			var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
			return ["boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable), start];
		},
		useSyncExternalStore: updateSyncExternalStore,
		useId: updateId,
		useHostTransitionStatus,
		useFormState: updateActionState,
		useActionState: updateActionState,
		useOptimistic: function(passthrough, reducer) {
			return updateOptimisticImpl(updateWorkInProgressHook(), currentHook, passthrough, reducer);
		},
		useMemoCache,
		useCacheRefresh: updateRefresh
	};
	var HooksDispatcherOnRerender = {
		readContext,
		use,
		useCallback: updateCallback,
		useContext: readContext,
		useEffect: updateEffect,
		useImperativeHandle: updateImperativeHandle,
		useInsertionEffect: updateInsertionEffect,
		useLayoutEffect: updateLayoutEffect,
		useMemo: updateMemo,
		useReducer: rerenderReducer,
		useRef: updateRef,
		useState: function() {
			return rerenderReducer(basicStateReducer);
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			var hook = updateWorkInProgressHook();
			return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
		},
		useTransition: function() {
			var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
			return ["boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable), start];
		},
		useSyncExternalStore: updateSyncExternalStore,
		useId: updateId,
		useHostTransitionStatus,
		useFormState: rerenderActionState,
		useActionState: rerenderActionState,
		useOptimistic: function(passthrough, reducer) {
			var hook = updateWorkInProgressHook();
			if (null !== currentHook) return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
			hook.baseState = passthrough;
			return [passthrough, hook.queue.dispatch];
		},
		useMemoCache,
		useCacheRefresh: updateRefresh
	};
	var thenableState = null;
	var thenableIndexCounter = 0;
	function unwrapThenable(thenable) {
		var index = thenableIndexCounter;
		thenableIndexCounter += 1;
		null === thenableState && (thenableState = []);
		return trackUsedThenable(thenableState, thenable, index);
	}
	function coerceRef(workInProgress, element) {
		element = element.props.ref;
		workInProgress.ref = void 0 !== element ? element : null;
	}
	function throwOnInvalidObjectType(returnFiber, newChild) {
		if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE) throw Error(formatProdErrorMessage(525));
		returnFiber = Object.prototype.toString.call(newChild);
		throw Error(formatProdErrorMessage(31, "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber));
	}
	function resolveLazy(lazyType) {
		var init = lazyType._init;
		return init(lazyType._payload);
	}
	function createChildReconciler(shouldTrackSideEffects) {
		function deleteChild(returnFiber, childToDelete) {
			if (shouldTrackSideEffects) {
				var deletions = returnFiber.deletions;
				null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
			}
		}
		function deleteRemainingChildren(returnFiber, currentFirstChild) {
			if (!shouldTrackSideEffects) return null;
			for (; null !== currentFirstChild;) deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
			return null;
		}
		function mapRemainingChildren(currentFirstChild) {
			for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild;) null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
			return existingChildren;
		}
		function useFiber(fiber, pendingProps) {
			fiber = createWorkInProgress(fiber, pendingProps);
			fiber.index = 0;
			fiber.sibling = null;
			return fiber;
		}
		function placeChild(newFiber, lastPlacedIndex, newIndex) {
			newFiber.index = newIndex;
			if (!shouldTrackSideEffects) return newFiber.flags |= 1048576, lastPlacedIndex;
			newIndex = newFiber.alternate;
			if (null !== newIndex) return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
			newFiber.flags |= 67108866;
			return lastPlacedIndex;
		}
		function placeSingleChild(newFiber) {
			shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
			return newFiber;
		}
		function updateTextNode(returnFiber, current, textContent, lanes) {
			if (null === current || 6 !== current.tag) return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
			current = useFiber(current, textContent);
			current.return = returnFiber;
			return current;
		}
		function updateElement(returnFiber, current, element, lanes) {
			var elementType = element.type;
			if (elementType === REACT_FRAGMENT_TYPE) return updateFragment(returnFiber, current, element.props.children, lanes, element.key);
			if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type)) return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
			current = createFiberFromTypeAndProps(element.type, element.key, element.props, null, returnFiber.mode, lanes);
			coerceRef(current, element);
			current.return = returnFiber;
			return current;
		}
		function updatePortal(returnFiber, current, portal, lanes) {
			if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
			current = useFiber(current, portal.children || []);
			current.return = returnFiber;
			return current;
		}
		function updateFragment(returnFiber, current, fragment, lanes, key) {
			if (null === current || 7 !== current.tag) return current = createFiberFromFragment(fragment, returnFiber.mode, lanes, key), current.return = returnFiber, current;
			current = useFiber(current, fragment);
			current.return = returnFiber;
			return current;
		}
		function createChild(returnFiber, newChild, lanes) {
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return newChild = createFiberFromText("" + newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
					case REACT_PORTAL_TYPE: return newChild = createFiberFromPortal(newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
					case REACT_LAZY_TYPE:
						var init = newChild._init;
						newChild = init(newChild._payload);
						return createChild(returnFiber, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return newChild = createFiberFromFragment(newChild, returnFiber.mode, lanes, null), newChild.return = returnFiber, newChild;
				if ("function" === typeof newChild.then) return createChild(returnFiber, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return createChild(returnFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectType(returnFiber, newChild);
			}
			return null;
		}
		function updateSlot(returnFiber, oldFiber, newChild, lanes) {
			var key = null !== oldFiber ? oldFiber.key : null;
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
					case REACT_PORTAL_TYPE: return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
					case REACT_LAZY_TYPE: return key = newChild._init, newChild = key(newChild._payload), updateSlot(returnFiber, oldFiber, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
				if ("function" === typeof newChild.then) return updateSlot(returnFiber, oldFiber, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectType(returnFiber, newChild);
			}
			return null;
		}
		function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
					case REACT_PORTAL_TYPE: return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
					case REACT_LAZY_TYPE:
						var init = newChild._init;
						newChild = init(newChild._payload);
						return updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
				if ("function" === typeof newChild.then) return updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectType(returnFiber, newChild);
			}
			return null;
		}
		function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
			for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
				oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
				var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
				if (null === newFiber) {
					null === oldFiber && (oldFiber = nextOldFiber);
					break;
				}
				shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
				currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
				null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
				previousNewFiber = newFiber;
				oldFiber = nextOldFiber;
			}
			if (newIdx === newChildren.length) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
			if (null === oldFiber) {
				for (; newIdx < newChildren.length; newIdx++) oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
				isHydrating && pushTreeFork(returnFiber, newIdx);
				return resultingFirstChild;
			}
			for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++) nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, newChildren[newIdx], lanes), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(null === nextOldFiber.key ? newIdx : nextOldFiber.key), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
			shouldTrackSideEffects && oldFiber.forEach(function(child) {
				return deleteChild(returnFiber, child);
			});
			isHydrating && pushTreeFork(returnFiber, newIdx);
			return resultingFirstChild;
		}
		function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
			if (null == newChildren) throw Error(formatProdErrorMessage(151));
			for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
				oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
				var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
				if (null === newFiber) {
					null === oldFiber && (oldFiber = nextOldFiber);
					break;
				}
				shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
				currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
				null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
				previousNewFiber = newFiber;
				oldFiber = nextOldFiber;
			}
			if (step.done) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
			if (null === oldFiber) {
				for (; !step.done; newIdx++, step = newChildren.next()) step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
				isHydrating && pushTreeFork(returnFiber, newIdx);
				return resultingFirstChild;
			}
			for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next()) step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
			shouldTrackSideEffects && oldFiber.forEach(function(child) {
				return deleteChild(returnFiber, child);
			});
			isHydrating && pushTreeFork(returnFiber, newIdx);
			return resultingFirstChild;
		}
		function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
			"object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE:
						a: {
							for (var key = newChild.key; null !== currentFirstChild;) {
								if (currentFirstChild.key === key) {
									key = newChild.type;
									if (key === REACT_FRAGMENT_TYPE) {
										if (7 === currentFirstChild.tag) {
											deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
											lanes = useFiber(currentFirstChild, newChild.props.children);
											lanes.return = returnFiber;
											returnFiber = lanes;
											break a;
										}
									} else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
										deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
										lanes = useFiber(currentFirstChild, newChild.props);
										coerceRef(lanes, newChild);
										lanes.return = returnFiber;
										returnFiber = lanes;
										break a;
									}
									deleteRemainingChildren(returnFiber, currentFirstChild);
									break;
								} else deleteChild(returnFiber, currentFirstChild);
								currentFirstChild = currentFirstChild.sibling;
							}
							newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(newChild.props.children, returnFiber.mode, lanes, newChild.key), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
						}
						return placeSingleChild(returnFiber);
					case REACT_PORTAL_TYPE:
						a: {
							for (key = newChild.key; null !== currentFirstChild;) {
								if (currentFirstChild.key === key) if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
									deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
									lanes = useFiber(currentFirstChild, newChild.children || []);
									lanes.return = returnFiber;
									returnFiber = lanes;
									break a;
								} else {
									deleteRemainingChildren(returnFiber, currentFirstChild);
									break;
								}
								else deleteChild(returnFiber, currentFirstChild);
								currentFirstChild = currentFirstChild.sibling;
							}
							lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
							lanes.return = returnFiber;
							returnFiber = lanes;
						}
						return placeSingleChild(returnFiber);
					case REACT_LAZY_TYPE: return key = newChild._init, newChild = key(newChild._payload), reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
				}
				if (isArrayImpl(newChild)) return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
				if (getIteratorFn(newChild)) {
					key = getIteratorFn(newChild);
					if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
					newChild = key.call(newChild);
					return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
				}
				if ("function" === typeof newChild.then) return reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectType(returnFiber, newChild);
			}
			return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
		}
		return function(returnFiber, currentFirstChild, newChild, lanes) {
			try {
				thenableIndexCounter = 0;
				var firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
				thenableState = null;
				return firstChildFiber;
			} catch (x) {
				if (x === SuspenseException || x === SuspenseActionException) throw x;
				var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
				fiber.lanes = lanes;
				fiber.return = returnFiber;
				return fiber;
			}
		};
	}
	var reconcileChildFibers = createChildReconciler(!0);
	var mountChildFibers = createChildReconciler(!1);
	var suspenseHandlerStackCursor = createCursor(null);
	var shellBoundary = null;
	function pushPrimaryTreeSuspenseHandler(handler) {
		var current = handler.alternate;
		push(suspenseStackCursor, suspenseStackCursor.current & 1);
		push(suspenseHandlerStackCursor, handler);
		null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
	}
	function pushOffscreenSuspenseHandler(fiber) {
		if (22 === fiber.tag) {
			if (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary) {
				var current = fiber.alternate;
				null !== current && null !== current.memoizedState && (shellBoundary = fiber);
			}
		} else reuseSuspenseHandlerOnStack(fiber);
	}
	function reuseSuspenseHandlerOnStack() {
		push(suspenseStackCursor, suspenseStackCursor.current);
		push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
	}
	function popSuspenseHandler(fiber) {
		pop(suspenseHandlerStackCursor);
		shellBoundary === fiber && (shellBoundary = null);
		pop(suspenseStackCursor);
	}
	var suspenseStackCursor = createCursor(0);
	function findFirstSuspended(row) {
		for (var node = row; null !== node;) {
			if (13 === node.tag) {
				var state = node.memoizedState;
				if (null !== state && (state = state.dehydrated, null === state || "$?" === state.data || isSuspenseInstanceFallback(state))) return node;
			} else if (19 === node.tag && void 0 !== node.memoizedProps.revealOrder) {
				if (0 !== (node.flags & 128)) return node;
			} else if (null !== node.child) {
				node.child.return = node;
				node = node.child;
				continue;
			}
			if (node === row) break;
			for (; null === node.sibling;) {
				if (null === node.return || node.return === row) return null;
				node = node.return;
			}
			node.sibling.return = node.return;
			node = node.sibling;
		}
		return null;
	}
	function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
		ctor = workInProgress.memoizedState;
		getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
		getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
		workInProgress.memoizedState = getDerivedStateFromProps;
		0 === workInProgress.lanes && (workInProgress.updateQueue.baseState = getDerivedStateFromProps);
	}
	var classComponentUpdater = {
		enqueueSetState: function(inst, payload, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.payload = payload;
			void 0 !== callback && null !== callback && (update.callback = callback);
			payload = enqueueUpdate(inst, update, lane);
			null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
		},
		enqueueReplaceState: function(inst, payload, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.tag = 1;
			update.payload = payload;
			void 0 !== callback && null !== callback && (update.callback = callback);
			payload = enqueueUpdate(inst, update, lane);
			null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
		},
		enqueueForceUpdate: function(inst, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.tag = 2;
			void 0 !== callback && null !== callback && (update.callback = callback);
			callback = enqueueUpdate(inst, update, lane);
			null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
		}
	};
	function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
		workInProgress = workInProgress.stateNode;
		return "function" === typeof workInProgress.shouldComponentUpdate ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : !0;
	}
	function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
		workInProgress = instance.state;
		"function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
		"function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
		instance.state !== workInProgress && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
	}
	function resolveClassComponentProps(Component, baseProps) {
		var newProps = baseProps;
		if ("ref" in baseProps) {
			newProps = {};
			for (var propName in baseProps) "ref" !== propName && (newProps[propName] = baseProps[propName]);
		}
		if (Component = Component.defaultProps) {
			newProps === baseProps && (newProps = assign({}, newProps));
			for (var propName$73 in Component) void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
		}
		return newProps;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	function defaultOnUncaughtError(error) {
		reportGlobalError(error);
	}
	function defaultOnCaughtError(error) {
		console.error(error);
	}
	function defaultOnRecoverableError(error) {
		reportGlobalError(error);
	}
	function logUncaughtError(root, errorInfo) {
		try {
			var onUncaughtError = root.onUncaughtError;
			onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
		} catch (e$74) {
			setTimeout(function() {
				throw e$74;
			});
		}
	}
	function logCaughtError(root, boundary, errorInfo) {
		try {
			var onCaughtError = root.onCaughtError;
			onCaughtError(errorInfo.value, {
				componentStack: errorInfo.stack,
				errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
			});
		} catch (e$75) {
			setTimeout(function() {
				throw e$75;
			});
		}
	}
	function createRootErrorUpdate(root, errorInfo, lane) {
		lane = createUpdate(lane);
		lane.tag = 3;
		lane.payload = { element: null };
		lane.callback = function() {
			logUncaughtError(root, errorInfo);
		};
		return lane;
	}
	function createClassErrorUpdate(lane) {
		lane = createUpdate(lane);
		lane.tag = 3;
		return lane;
	}
	function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
		var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
		if ("function" === typeof getDerivedStateFromError) {
			var error = errorInfo.value;
			update.payload = function() {
				return getDerivedStateFromError(error);
			};
			update.callback = function() {
				logCaughtError(root, fiber, errorInfo);
			};
		}
		var inst = fiber.stateNode;
		null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
			logCaughtError(root, fiber, errorInfo);
			"function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
			var stack = errorInfo.stack;
			this.componentDidCatch(errorInfo.value, { componentStack: null !== stack ? stack : "" });
		});
	}
	function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
		sourceFiber.flags |= 32768;
		if (null !== value && "object" === typeof value && "function" === typeof value.then) {
			returnFiber = sourceFiber.alternate;
			null !== returnFiber && propagateParentContextChanges(returnFiber, sourceFiber, rootRenderLanes, !0);
			sourceFiber = suspenseHandlerStackCursor.current;
			if (null !== sourceFiber) {
				switch (sourceFiber.tag) {
					case 13: return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root, value, rootRenderLanes)), !1;
					case 22: return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([value])
					}, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root, value, rootRenderLanes)), !1;
				}
				throw Error(formatProdErrorMessage(435, sourceFiber.tag));
			}
			attachPingListener(root, value, rootRenderLanes);
			renderDidSuspendDelayIfPossible();
			return !1;
		}
		if (isHydrating) return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), { cause: value }), queueHydrationError(createCapturedValueAtFiber(returnFiber, sourceFiber))), root = root.current.alternate, root.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(root.stateNode, value, rootRenderLanes), enqueueCapturedUpdate(root, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), !1;
		var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
		wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
		null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
		4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
		if (null === returnFiber) return !0;
		value = createCapturedValueAtFiber(value, sourceFiber);
		sourceFiber = returnFiber;
		do {
			switch (sourceFiber.tag) {
				case 3: return sourceFiber.flags |= 65536, root = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root, root = createRootErrorUpdate(sourceFiber.stateNode, value, root), enqueueCapturedUpdate(sourceFiber, root), !1;
				case 1: if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError)))) return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(rootRenderLanes, root, sourceFiber, value), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), !1;
			}
			sourceFiber = sourceFiber.return;
		} while (null !== sourceFiber);
		return !1;
	}
	var SelectiveHydrationException = Error(formatProdErrorMessage(461));
	var didReceiveUpdate = !1;
	function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
		workInProgress.child = null === current ? mountChildFibers(workInProgress, null, nextChildren, renderLanes) : reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
	}
	function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
		Component = Component.render;
		var ref = workInProgress.ref;
		if ("ref" in nextProps) {
			var propsWithoutRef = {};
			for (var key in nextProps) "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
		} else propsWithoutRef = nextProps;
		prepareToReadContext(workInProgress);
		nextProps = renderWithHooks(current, workInProgress, Component, propsWithoutRef, ref, renderLanes);
		key = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && key && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		return workInProgress.child;
	}
	function updateMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
		if (null === current) {
			var type = Component.type;
			if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare) return workInProgress.tag = 15, workInProgress.type = type, updateSimpleMemoComponent(current, workInProgress, type, nextProps, renderLanes);
			current = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
			current.ref = workInProgress.ref;
			current.return = workInProgress;
			return workInProgress.child = current;
		}
		type = current.child;
		if (!checkScheduledUpdateOrContext(current, renderLanes)) {
			var prevProps = type.memoizedProps;
			Component = Component.compare;
			Component = null !== Component ? Component : shallowEqual;
			if (Component(prevProps, nextProps) && current.ref === workInProgress.ref) return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		}
		workInProgress.flags |= 1;
		current = createWorkInProgress(type, nextProps);
		current.ref = workInProgress.ref;
		current.return = workInProgress;
		return workInProgress.child = current;
	}
	function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
		if (null !== current) {
			var prevProps = current.memoizedProps;
			if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref) if (didReceiveUpdate = !1, workInProgress.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes)) 0 !== (current.flags & 131072) && (didReceiveUpdate = !0);
			else return workInProgress.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		}
		return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
	}
	function updateOffscreenComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
		if ("hidden" === nextProps.mode) {
			if (0 !== (workInProgress.flags & 128)) {
				nextProps = null !== prevState ? prevState.baseLanes | renderLanes : renderLanes;
				if (null !== current) {
					nextChildren = workInProgress.child = current.child;
					for (prevState = 0; null !== nextChildren;) prevState = prevState | nextChildren.lanes | nextChildren.childLanes, nextChildren = nextChildren.sibling;
					workInProgress.childLanes = prevState & ~nextProps;
				} else workInProgress.childLanes = 0, workInProgress.child = null;
				return deferHiddenOffscreenComponent(current, workInProgress, nextProps, renderLanes);
			}
			if (0 !== (renderLanes & 536870912)) workInProgress.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, null !== current && pushTransition(workInProgress, null !== prevState ? prevState.cachePool : null), null !== prevState ? pushHiddenContext(workInProgress, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress);
			else return workInProgress.lanes = workInProgress.childLanes = 536870912, deferHiddenOffscreenComponent(current, workInProgress, null !== prevState ? prevState.baseLanes | renderLanes : renderLanes, renderLanes);
		} else null !== prevState ? (pushTransition(workInProgress, prevState.cachePool), pushHiddenContext(workInProgress, prevState), reuseSuspenseHandlerOnStack(workInProgress), workInProgress.memoizedState = null) : (null !== current && pushTransition(workInProgress, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack(workInProgress));
		reconcileChildren(current, workInProgress, nextChildren, renderLanes);
		return workInProgress.child;
	}
	function deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes) {
		var JSCompiler_inline_result = peekCacheFromPool();
		JSCompiler_inline_result = null === JSCompiler_inline_result ? null : {
			parent: CacheContext._currentValue,
			pool: JSCompiler_inline_result
		};
		workInProgress.memoizedState = {
			baseLanes: nextBaseLanes,
			cachePool: JSCompiler_inline_result
		};
		null !== current && pushTransition(workInProgress, null);
		reuseHiddenContextOnStack();
		pushOffscreenSuspenseHandler(workInProgress);
		null !== current && propagateParentContextChanges(current, workInProgress, renderLanes, !0);
		return null;
	}
	function markRef(current, workInProgress) {
		var ref = workInProgress.ref;
		if (null === ref) null !== current && null !== current.ref && (workInProgress.flags |= 4194816);
		else {
			if ("function" !== typeof ref && "object" !== typeof ref) throw Error(formatProdErrorMessage(284));
			if (null === current || current.ref !== ref) workInProgress.flags |= 4194816;
		}
	}
	function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
		prepareToReadContext(workInProgress);
		Component = renderWithHooks(current, workInProgress, Component, nextProps, void 0, renderLanes);
		nextProps = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && nextProps && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, Component, renderLanes);
		return workInProgress.child;
	}
	function replayFunctionComponent(current, workInProgress, nextProps, Component, secondArg, renderLanes) {
		prepareToReadContext(workInProgress);
		workInProgress.updateQueue = null;
		nextProps = renderWithHooksAgain(workInProgress, Component, nextProps, secondArg);
		finishRenderingHooks(current);
		Component = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && Component && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		return workInProgress.child;
	}
	function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
		prepareToReadContext(workInProgress);
		if (null === workInProgress.stateNode) {
			var context = emptyContextObject, contextType = Component.contextType;
			"object" === typeof contextType && null !== contextType && (context = readContext(contextType));
			context = new Component(nextProps, context);
			workInProgress.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
			context.updater = classComponentUpdater;
			workInProgress.stateNode = context;
			context._reactInternals = workInProgress;
			context = workInProgress.stateNode;
			context.props = nextProps;
			context.state = workInProgress.memoizedState;
			context.refs = {};
			initializeUpdateQueue(workInProgress);
			contextType = Component.contextType;
			context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
			context.state = workInProgress.memoizedState;
			contextType = Component.getDerivedStateFromProps;
			"function" === typeof contextType && (applyDerivedStateFromProps(workInProgress, Component, contextType, nextProps), context.state = workInProgress.memoizedState);
			"function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress, nextProps, context, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress.memoizedState);
			"function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308);
			nextProps = !0;
		} else if (null === current) {
			context = workInProgress.stateNode;
			var unresolvedOldProps = workInProgress.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
			context.props = oldProps;
			var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
			contextType = emptyContextObject;
			"object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
			var getDerivedStateFromProps = Component.getDerivedStateFromProps;
			contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
			unresolvedOldProps = workInProgress.pendingProps !== unresolvedOldProps;
			contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(workInProgress, context, nextProps, contextType);
			hasForceUpdate = !1;
			var oldState = workInProgress.memoizedState;
			context.state = oldState;
			processUpdateQueue(workInProgress, nextProps, context, renderLanes);
			suspendIfUpdateReadFromEntangledAsyncAction();
			oldContext = workInProgress.memoizedState;
			unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, nextProps), oldContext = workInProgress.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, oldProps, nextProps, oldState, oldContext, contextType)) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), nextProps = !1);
		} else {
			context = workInProgress.stateNode;
			cloneUpdateQueue(current, workInProgress);
			contextType = workInProgress.memoizedProps;
			contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
			context.props = contextType$jscomp$0;
			getDerivedStateFromProps = workInProgress.pendingProps;
			oldState = context.context;
			oldContext = Component.contextType;
			oldProps = emptyContextObject;
			"object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
			unresolvedOldProps = Component.getDerivedStateFromProps;
			(oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(workInProgress, context, nextProps, oldProps);
			hasForceUpdate = !1;
			oldState = workInProgress.memoizedState;
			context.state = oldState;
			processUpdateQueue(workInProgress, nextProps, context, renderLanes);
			suspendIfUpdateReadFromEntangledAsyncAction();
			var newState = workInProgress.memoizedState;
			contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(workInProgress, Component, unresolvedOldProps, nextProps), newState = workInProgress.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, contextType$jscomp$0, nextProps, oldState, newState, oldProps) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(nextProps, newState, oldProps)), "function" === typeof context.componentDidUpdate && (workInProgress.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), nextProps = !1);
		}
		context = nextProps;
		markRef(current, workInProgress);
		nextProps = 0 !== (workInProgress.flags & 128);
		context || nextProps ? (context = workInProgress.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress.flags |= 1, null !== current && nextProps ? (workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes), workInProgress.child = reconcileChildFibers(workInProgress, null, Component, renderLanes)) : reconcileChildren(current, workInProgress, Component, renderLanes), workInProgress.memoizedState = context.state, current = workInProgress.child) : current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		return current;
	}
	function mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes) {
		resetHydrationState();
		workInProgress.flags |= 256;
		reconcileChildren(current, workInProgress, nextChildren, renderLanes);
		return workInProgress.child;
	}
	var SUSPENDED_MARKER = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function mountSuspenseOffscreenState(renderLanes) {
		return {
			baseLanes: renderLanes,
			cachePool: getSuspendedCache()
		};
	}
	function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes) {
		current = null !== current ? current.childLanes & ~renderLanes : 0;
		primaryTreeDidDefer && (current |= workInProgressDeferredLane);
		return current;
	}
	function updateSuspenseComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, showFallback = !1, didSuspend = 0 !== (workInProgress.flags & 128), JSCompiler_temp;
		(JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? !1 : 0 !== (suspenseStackCursor.current & 2));
		JSCompiler_temp && (showFallback = !0, workInProgress.flags &= -129);
		JSCompiler_temp = 0 !== (workInProgress.flags & 32);
		workInProgress.flags &= -33;
		if (null === current) {
			if (isHydrating) {
				showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress) : reuseSuspenseHandlerOnStack(workInProgress);
				if (isHydrating) {
					var nextInstance = nextHydratableInstance, JSCompiler_temp$jscomp$0;
					if (JSCompiler_temp$jscomp$0 = nextInstance) {
						c: {
							JSCompiler_temp$jscomp$0 = nextInstance;
							for (nextInstance = rootOrSingletonContext; 8 !== JSCompiler_temp$jscomp$0.nodeType;) {
								if (!nextInstance) {
									nextInstance = null;
									break c;
								}
								JSCompiler_temp$jscomp$0 = getNextHydratable(JSCompiler_temp$jscomp$0.nextSibling);
								if (null === JSCompiler_temp$jscomp$0) {
									nextInstance = null;
									break c;
								}
							}
							nextInstance = JSCompiler_temp$jscomp$0;
						}
						null !== nextInstance ? (workInProgress.memoizedState = {
							dehydrated: nextInstance,
							treeContext: null !== treeContextProvider ? {
								id: treeContextId,
								overflow: treeContextOverflow
							} : null,
							retryLane: 536870912,
							hydrationErrors: null
						}, JSCompiler_temp$jscomp$0 = createFiberImplClass(18, null, null, 0), JSCompiler_temp$jscomp$0.stateNode = nextInstance, JSCompiler_temp$jscomp$0.return = workInProgress, workInProgress.child = JSCompiler_temp$jscomp$0, hydrationParentFiber = workInProgress, nextHydratableInstance = null, JSCompiler_temp$jscomp$0 = !0) : JSCompiler_temp$jscomp$0 = !1;
					}
					JSCompiler_temp$jscomp$0 || throwOnHydrationMismatch(workInProgress);
				}
				nextInstance = workInProgress.memoizedState;
				if (null !== nextInstance && (nextInstance = nextInstance.dehydrated, null !== nextInstance)) return isSuspenseInstanceFallback(nextInstance) ? workInProgress.lanes = 32 : workInProgress.lanes = 536870912, null;
				popSuspenseHandler(workInProgress);
			}
			nextInstance = nextProps.children;
			nextProps = nextProps.fallback;
			if (showFallback) return reuseSuspenseHandlerOnStack(workInProgress), showFallback = workInProgress.mode, nextInstance = mountWorkInProgressOffscreenFiber({
				mode: "hidden",
				children: nextInstance
			}, showFallback), nextProps = createFiberFromFragment(nextProps, showFallback, renderLanes, null), nextInstance.return = workInProgress, nextProps.return = workInProgress, nextInstance.sibling = nextProps, workInProgress.child = nextInstance, showFallback = workInProgress.child, showFallback.memoizedState = mountSuspenseOffscreenState(renderLanes), showFallback.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, nextProps;
			pushPrimaryTreeSuspenseHandler(workInProgress);
			return mountSuspensePrimaryChildren(workInProgress, nextInstance);
		}
		JSCompiler_temp$jscomp$0 = current.memoizedState;
		if (null !== JSCompiler_temp$jscomp$0 && (nextInstance = JSCompiler_temp$jscomp$0.dehydrated, null !== nextInstance)) {
			if (didSuspend) workInProgress.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags &= -257, workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes)) : null !== workInProgress.memoizedState ? (reuseSuspenseHandlerOnStack(workInProgress), workInProgress.child = current.child, workInProgress.flags |= 128, workInProgress = null) : (reuseSuspenseHandlerOnStack(workInProgress), showFallback = nextProps.fallback, nextInstance = workInProgress.mode, nextProps = mountWorkInProgressOffscreenFiber({
				mode: "visible",
				children: nextProps.children
			}, nextInstance), showFallback = createFiberFromFragment(showFallback, nextInstance, renderLanes, null), showFallback.flags |= 2, nextProps.return = workInProgress, showFallback.return = workInProgress, nextProps.sibling = showFallback, workInProgress.child = nextProps, reconcileChildFibers(workInProgress, current.child, null, renderLanes), nextProps = workInProgress.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, workInProgress = showFallback);
			else if (pushPrimaryTreeSuspenseHandler(workInProgress), isSuspenseInstanceFallback(nextInstance)) {
				JSCompiler_temp = nextInstance.nextSibling && nextInstance.nextSibling.dataset;
				if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
				JSCompiler_temp = digest;
				nextProps = Error(formatProdErrorMessage(419));
				nextProps.stack = "";
				nextProps.digest = JSCompiler_temp;
				queueHydrationError({
					value: nextProps,
					source: null,
					stack: null
				});
				workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress, renderLanes, !1), JSCompiler_temp = 0 !== (renderLanes & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
				JSCompiler_temp = workInProgressRoot;
				if (null !== JSCompiler_temp && (nextProps = renderLanes & -renderLanes, nextProps = 0 !== (nextProps & 42) ? 1 : getBumpedLaneForHydrationByLane(nextProps), nextProps = 0 !== (nextProps & (JSCompiler_temp.suspendedLanes | renderLanes)) ? 0 : nextProps, 0 !== nextProps && nextProps !== JSCompiler_temp$jscomp$0.retryLane)) throw JSCompiler_temp$jscomp$0.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
				"$?" === nextInstance.data || renderDidSuspendDelayIfPossible();
				workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else "$?" === nextInstance.data ? (workInProgress.flags |= 192, workInProgress.child = current.child, workInProgress = null) : (current = JSCompiler_temp$jscomp$0.treeContext, nextHydratableInstance = getNextHydratable(nextInstance.nextSibling), hydrationParentFiber = workInProgress, isHydrating = !0, hydrationErrors = null, rootOrSingletonContext = !1, null !== current && (idStack[idStackIndex++] = treeContextId, idStack[idStackIndex++] = treeContextOverflow, idStack[idStackIndex++] = treeContextProvider, treeContextId = current.id, treeContextOverflow = current.overflow, treeContextProvider = workInProgress), workInProgress = mountSuspensePrimaryChildren(workInProgress, nextProps.children), workInProgress.flags |= 4096);
			return workInProgress;
		}
		if (showFallback) return reuseSuspenseHandlerOnStack(workInProgress), showFallback = nextProps.fallback, nextInstance = workInProgress.mode, JSCompiler_temp$jscomp$0 = current.child, digest = JSCompiler_temp$jscomp$0.sibling, nextProps = createWorkInProgress(JSCompiler_temp$jscomp$0, {
			mode: "hidden",
			children: nextProps.children
		}), nextProps.subtreeFlags = JSCompiler_temp$jscomp$0.subtreeFlags & 65011712, null !== digest ? showFallback = createWorkInProgress(digest, showFallback) : (showFallback = createFiberFromFragment(showFallback, nextInstance, renderLanes, null), showFallback.flags |= 2), showFallback.return = workInProgress, nextProps.return = workInProgress, nextProps.sibling = showFallback, workInProgress.child = nextProps, nextProps = showFallback, showFallback = workInProgress.child, nextInstance = current.child.memoizedState, null === nextInstance ? nextInstance = mountSuspenseOffscreenState(renderLanes) : (JSCompiler_temp$jscomp$0 = nextInstance.cachePool, null !== JSCompiler_temp$jscomp$0 ? (digest = CacheContext._currentValue, JSCompiler_temp$jscomp$0 = JSCompiler_temp$jscomp$0.parent !== digest ? {
			parent: digest,
			pool: digest
		} : JSCompiler_temp$jscomp$0) : JSCompiler_temp$jscomp$0 = getSuspendedCache(), nextInstance = {
			baseLanes: nextInstance.baseLanes | renderLanes,
			cachePool: JSCompiler_temp$jscomp$0
		}), showFallback.memoizedState = nextInstance, showFallback.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, nextProps;
		pushPrimaryTreeSuspenseHandler(workInProgress);
		renderLanes = current.child;
		current = renderLanes.sibling;
		renderLanes = createWorkInProgress(renderLanes, {
			mode: "visible",
			children: nextProps.children
		});
		renderLanes.return = workInProgress;
		renderLanes.sibling = null;
		null !== current && (JSCompiler_temp = workInProgress.deletions, null === JSCompiler_temp ? (workInProgress.deletions = [current], workInProgress.flags |= 16) : JSCompiler_temp.push(current));
		workInProgress.child = renderLanes;
		workInProgress.memoizedState = null;
		return renderLanes;
	}
	function mountSuspensePrimaryChildren(workInProgress, primaryChildren) {
		primaryChildren = mountWorkInProgressOffscreenFiber({
			mode: "visible",
			children: primaryChildren
		}, workInProgress.mode);
		primaryChildren.return = workInProgress;
		return workInProgress.child = primaryChildren;
	}
	function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
		offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
		offscreenProps.lanes = 0;
		offscreenProps.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		};
		return offscreenProps;
	}
	function retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes) {
		reconcileChildFibers(workInProgress, current.child, null, renderLanes);
		current = mountSuspensePrimaryChildren(workInProgress, workInProgress.pendingProps.children);
		current.flags |= 2;
		workInProgress.memoizedState = null;
		return current;
	}
	function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
		fiber.lanes |= renderLanes;
		var alternate = fiber.alternate;
		null !== alternate && (alternate.lanes |= renderLanes);
		scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
	}
	function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode) {
		var renderState = workInProgress.memoizedState;
		null === renderState ? workInProgress.memoizedState = {
			isBackwards,
			rendering: null,
			renderingStartTime: 0,
			last: lastContentRow,
			tail,
			tailMode
		} : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode);
	}
	function updateSuspenseListComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
		reconcileChildren(current, workInProgress, nextProps.children, renderLanes);
		nextProps = suspenseStackCursor.current;
		if (0 !== (nextProps & 2)) nextProps = nextProps & 1 | 2, workInProgress.flags |= 128;
		else {
			if (null !== current && 0 !== (current.flags & 128)) a: for (current = workInProgress.child; null !== current;) {
				if (13 === current.tag) null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
				else if (19 === current.tag) scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
				else if (null !== current.child) {
					current.child.return = current;
					current = current.child;
					continue;
				}
				if (current === workInProgress) break a;
				for (; null === current.sibling;) {
					if (null === current.return || current.return === workInProgress) break a;
					current = current.return;
				}
				current.sibling.return = current.return;
				current = current.sibling;
			}
			nextProps &= 1;
		}
		push(suspenseStackCursor, nextProps);
		switch (revealOrder) {
			case "forwards":
				renderLanes = workInProgress.child;
				for (revealOrder = null; null !== renderLanes;) current = renderLanes.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes), renderLanes = renderLanes.sibling;
				renderLanes = revealOrder;
				null === renderLanes ? (revealOrder = workInProgress.child, workInProgress.child = null) : (revealOrder = renderLanes.sibling, renderLanes.sibling = null);
				initSuspenseListRenderState(workInProgress, !1, revealOrder, renderLanes, tailMode);
				break;
			case "backwards":
				renderLanes = null;
				revealOrder = workInProgress.child;
				for (workInProgress.child = null; null !== revealOrder;) {
					current = revealOrder.alternate;
					if (null !== current && null === findFirstSuspended(current)) {
						workInProgress.child = revealOrder;
						break;
					}
					current = revealOrder.sibling;
					revealOrder.sibling = renderLanes;
					renderLanes = revealOrder;
					revealOrder = current;
				}
				initSuspenseListRenderState(workInProgress, !0, renderLanes, null, tailMode);
				break;
			case "together":
				initSuspenseListRenderState(workInProgress, !1, null, null, void 0);
				break;
			default: workInProgress.memoizedState = null;
		}
		return workInProgress.child;
	}
	function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
		null !== current && (workInProgress.dependencies = current.dependencies);
		workInProgressRootSkippedLanes |= workInProgress.lanes;
		if (0 === (renderLanes & workInProgress.childLanes)) if (null !== current) {
			if (propagateParentContextChanges(current, workInProgress, renderLanes, !1), 0 === (renderLanes & workInProgress.childLanes)) return null;
		} else return null;
		if (null !== current && workInProgress.child !== current.child) throw Error(formatProdErrorMessage(153));
		if (null !== workInProgress.child) {
			current = workInProgress.child;
			renderLanes = createWorkInProgress(current, current.pendingProps);
			workInProgress.child = renderLanes;
			for (renderLanes.return = workInProgress; null !== current.sibling;) current = current.sibling, renderLanes = renderLanes.sibling = createWorkInProgress(current, current.pendingProps), renderLanes.return = workInProgress;
			renderLanes.sibling = null;
		}
		return workInProgress.child;
	}
	function checkScheduledUpdateOrContext(current, renderLanes) {
		if (0 !== (current.lanes & renderLanes)) return !0;
		current = current.dependencies;
		return null !== current && checkIfContextChanged(current) ? !0 : !1;
	}
	function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes) {
		switch (workInProgress.tag) {
			case 3:
				pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
				pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
				resetHydrationState();
				break;
			case 27:
			case 5:
				pushHostContext(workInProgress);
				break;
			case 4:
				pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
				break;
			case 10:
				pushProvider(workInProgress, workInProgress.type, workInProgress.memoizedProps.value);
				break;
			case 13:
				var state = workInProgress.memoizedState;
				if (null !== state) {
					if (null !== state.dehydrated) return pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags |= 128, null;
					if (0 !== (renderLanes & workInProgress.child.childLanes)) return updateSuspenseComponent(current, workInProgress, renderLanes);
					pushPrimaryTreeSuspenseHandler(workInProgress);
					current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
					return null !== current ? current.sibling : null;
				}
				pushPrimaryTreeSuspenseHandler(workInProgress);
				break;
			case 19:
				var didSuspendBefore = 0 !== (current.flags & 128);
				state = 0 !== (renderLanes & workInProgress.childLanes);
				state || (propagateParentContextChanges(current, workInProgress, renderLanes, !1), state = 0 !== (renderLanes & workInProgress.childLanes));
				if (didSuspendBefore) {
					if (state) return updateSuspenseListComponent(current, workInProgress, renderLanes);
					workInProgress.flags |= 128;
				}
				didSuspendBefore = workInProgress.memoizedState;
				null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
				push(suspenseStackCursor, suspenseStackCursor.current);
				if (state) break;
				else return null;
			case 22:
			case 23: return workInProgress.lanes = 0, updateOffscreenComponent(current, workInProgress, renderLanes);
			case 24: pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
		}
		return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	}
	function beginWork(current, workInProgress, renderLanes) {
		if (null !== current) if (current.memoizedProps !== workInProgress.pendingProps) didReceiveUpdate = !0;
		else {
			if (!checkScheduledUpdateOrContext(current, renderLanes) && 0 === (workInProgress.flags & 128)) return didReceiveUpdate = !1, attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes);
			didReceiveUpdate = 0 !== (current.flags & 131072) ? !0 : !1;
		}
		else didReceiveUpdate = !1, isHydrating && 0 !== (workInProgress.flags & 1048576) && pushTreeId(workInProgress, treeForkCount, workInProgress.index);
		workInProgress.lanes = 0;
		switch (workInProgress.tag) {
			case 16:
				a: {
					current = workInProgress.pendingProps;
					var lazyComponent = workInProgress.elementType, init = lazyComponent._init;
					lazyComponent = init(lazyComponent._payload);
					workInProgress.type = lazyComponent;
					if ("function" === typeof lazyComponent) shouldConstruct(lazyComponent) ? (current = resolveClassComponentProps(lazyComponent, current), workInProgress.tag = 1, workInProgress = updateClassComponent(null, workInProgress, lazyComponent, current, renderLanes)) : (workInProgress.tag = 0, workInProgress = updateFunctionComponent(null, workInProgress, lazyComponent, current, renderLanes));
					else {
						if (void 0 !== lazyComponent && null !== lazyComponent) {
							if (init = lazyComponent.$$typeof, init === REACT_FORWARD_REF_TYPE) {
								workInProgress.tag = 11;
								workInProgress = updateForwardRef(null, workInProgress, lazyComponent, current, renderLanes);
								break a;
							} else if (init === REACT_MEMO_TYPE) {
								workInProgress.tag = 14;
								workInProgress = updateMemoComponent(null, workInProgress, lazyComponent, current, renderLanes);
								break a;
							}
						}
						workInProgress = getComponentNameFromType(lazyComponent) || lazyComponent;
						throw Error(formatProdErrorMessage(306, workInProgress, ""));
					}
				}
				return workInProgress;
			case 0: return updateFunctionComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 1: return lazyComponent = workInProgress.type, init = resolveClassComponentProps(lazyComponent, workInProgress.pendingProps), updateClassComponent(current, workInProgress, lazyComponent, init, renderLanes);
			case 3:
				a: {
					pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
					if (null === current) throw Error(formatProdErrorMessage(387));
					lazyComponent = workInProgress.pendingProps;
					var prevState = workInProgress.memoizedState;
					init = prevState.element;
					cloneUpdateQueue(current, workInProgress);
					processUpdateQueue(workInProgress, lazyComponent, null, renderLanes);
					var nextState = workInProgress.memoizedState;
					lazyComponent = nextState.cache;
					pushProvider(workInProgress, CacheContext, lazyComponent);
					lazyComponent !== prevState.cache && propagateContextChanges(workInProgress, [CacheContext], renderLanes, !0);
					suspendIfUpdateReadFromEntangledAsyncAction();
					lazyComponent = nextState.element;
					if (prevState.isDehydrated) if (prevState = {
						element: lazyComponent,
						isDehydrated: !1,
						cache: nextState.cache
					}, workInProgress.updateQueue.baseState = prevState, workInProgress.memoizedState = prevState, workInProgress.flags & 256) {
						workInProgress = mountHostRootWithoutHydrating(current, workInProgress, lazyComponent, renderLanes);
						break a;
					} else if (lazyComponent !== init) {
						init = createCapturedValueAtFiber(Error(formatProdErrorMessage(424)), workInProgress);
						queueHydrationError(init);
						workInProgress = mountHostRootWithoutHydrating(current, workInProgress, lazyComponent, renderLanes);
						break a;
					} else {
						current = workInProgress.stateNode.containerInfo;
						switch (current.nodeType) {
							case 9:
								current = current.body;
								break;
							default: current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
						}
						nextHydratableInstance = getNextHydratable(current.firstChild);
						hydrationParentFiber = workInProgress;
						isHydrating = !0;
						hydrationErrors = null;
						rootOrSingletonContext = !0;
						renderLanes = mountChildFibers(workInProgress, null, lazyComponent, renderLanes);
						for (workInProgress.child = renderLanes; renderLanes;) renderLanes.flags = renderLanes.flags & -3 | 4096, renderLanes = renderLanes.sibling;
					}
					else {
						resetHydrationState();
						if (lazyComponent === init) {
							workInProgress = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
							break a;
						}
						reconcileChildren(current, workInProgress, lazyComponent, renderLanes);
					}
					workInProgress = workInProgress.child;
				}
				return workInProgress;
			case 26: return markRef(current, workInProgress), null === current ? (renderLanes = getResource(workInProgress.type, null, workInProgress.pendingProps, null)) ? workInProgress.memoizedState = renderLanes : isHydrating || (renderLanes = workInProgress.type, current = workInProgress.pendingProps, lazyComponent = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current).createElement(renderLanes), lazyComponent[internalInstanceKey] = workInProgress, lazyComponent[internalPropsKey] = current, setInitialProperties(lazyComponent, renderLanes, current), markNodeAsHoistable(lazyComponent), workInProgress.stateNode = lazyComponent) : workInProgress.memoizedState = getResource(workInProgress.type, current.memoizedProps, workInProgress.pendingProps, current.memoizedState), null;
			case 27: return pushHostContext(workInProgress), null === current && isHydrating && (lazyComponent = workInProgress.stateNode = resolveSingletonInstance(workInProgress.type, workInProgress.pendingProps, rootInstanceStackCursor.current), hydrationParentFiber = workInProgress, rootOrSingletonContext = !0, init = nextHydratableInstance, isSingletonScope(workInProgress.type) ? (previousHydratableOnEnteringScopedSingleton = init, nextHydratableInstance = getNextHydratable(lazyComponent.firstChild)) : nextHydratableInstance = init), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), markRef(current, workInProgress), null === current && (workInProgress.flags |= 4194304), workInProgress.child;
			case 5:
				if (null === current && isHydrating) {
					if (init = lazyComponent = nextHydratableInstance) lazyComponent = canHydrateInstance(lazyComponent, workInProgress.type, workInProgress.pendingProps, rootOrSingletonContext), null !== lazyComponent ? (workInProgress.stateNode = lazyComponent, hydrationParentFiber = workInProgress, nextHydratableInstance = getNextHydratable(lazyComponent.firstChild), rootOrSingletonContext = !1, init = !0) : init = !1;
					init || throwOnHydrationMismatch(workInProgress);
				}
				pushHostContext(workInProgress);
				init = workInProgress.type;
				prevState = workInProgress.pendingProps;
				nextState = null !== current ? current.memoizedProps : null;
				lazyComponent = prevState.children;
				shouldSetTextContent(init, prevState) ? lazyComponent = null : null !== nextState && shouldSetTextContent(init, nextState) && (workInProgress.flags |= 32);
				null !== workInProgress.memoizedState && (init = renderWithHooks(current, workInProgress, TransitionAwareHostComponent, null, null, renderLanes), HostTransitionContext._currentValue = init);
				markRef(current, workInProgress);
				reconcileChildren(current, workInProgress, lazyComponent, renderLanes);
				return workInProgress.child;
			case 6:
				if (null === current && isHydrating) {
					if (current = renderLanes = nextHydratableInstance) renderLanes = canHydrateTextInstance(renderLanes, workInProgress.pendingProps, rootOrSingletonContext), null !== renderLanes ? (workInProgress.stateNode = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null, current = !0) : current = !1;
					current || throwOnHydrationMismatch(workInProgress);
				}
				return null;
			case 13: return updateSuspenseComponent(current, workInProgress, renderLanes);
			case 4: return pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo), lazyComponent = workInProgress.pendingProps, null === current ? workInProgress.child = reconcileChildFibers(workInProgress, null, lazyComponent, renderLanes) : reconcileChildren(current, workInProgress, lazyComponent, renderLanes), workInProgress.child;
			case 11: return updateForwardRef(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 7: return reconcileChildren(current, workInProgress, workInProgress.pendingProps, renderLanes), workInProgress.child;
			case 8: return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 12: return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 10: return lazyComponent = workInProgress.pendingProps, pushProvider(workInProgress, workInProgress.type, lazyComponent.value), reconcileChildren(current, workInProgress, lazyComponent.children, renderLanes), workInProgress.child;
			case 9: return init = workInProgress.type._context, lazyComponent = workInProgress.pendingProps.children, prepareToReadContext(workInProgress), init = readContext(init), lazyComponent = lazyComponent(init), workInProgress.flags |= 1, reconcileChildren(current, workInProgress, lazyComponent, renderLanes), workInProgress.child;
			case 14: return updateMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 15: return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 19: return updateSuspenseListComponent(current, workInProgress, renderLanes);
			case 31: return lazyComponent = workInProgress.pendingProps, renderLanes = workInProgress.mode, lazyComponent = {
				mode: lazyComponent.mode,
				children: lazyComponent.children
			}, null === current ? (renderLanes = mountWorkInProgressOffscreenFiber(lazyComponent, renderLanes), renderLanes.ref = workInProgress.ref, workInProgress.child = renderLanes, renderLanes.return = workInProgress, workInProgress = renderLanes) : (renderLanes = createWorkInProgress(current.child, lazyComponent), renderLanes.ref = workInProgress.ref, workInProgress.child = renderLanes, renderLanes.return = workInProgress, workInProgress = renderLanes), workInProgress;
			case 22: return updateOffscreenComponent(current, workInProgress, renderLanes);
			case 24: return prepareToReadContext(workInProgress), lazyComponent = readContext(CacheContext), null === current ? (init = peekCacheFromPool(), null === init && (init = workInProgressRoot, prevState = createCache(), init.pooledCache = prevState, prevState.refCount++, null !== prevState && (init.pooledCacheLanes |= renderLanes), init = prevState), workInProgress.memoizedState = {
				parent: lazyComponent,
				cache: init
			}, initializeUpdateQueue(workInProgress), pushProvider(workInProgress, CacheContext, init)) : (0 !== (current.lanes & renderLanes) && (cloneUpdateQueue(current, workInProgress), processUpdateQueue(workInProgress, null, null, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction()), init = current.memoizedState, prevState = workInProgress.memoizedState, init.parent !== lazyComponent ? (init = {
				parent: lazyComponent,
				cache: lazyComponent
			}, workInProgress.memoizedState = init, 0 === workInProgress.lanes && (workInProgress.memoizedState = workInProgress.updateQueue.baseState = init), pushProvider(workInProgress, CacheContext, lazyComponent)) : (lazyComponent = prevState.cache, pushProvider(workInProgress, CacheContext, lazyComponent), lazyComponent !== init.cache && propagateContextChanges(workInProgress, [CacheContext], renderLanes, !0))), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 29: throw workInProgress.pendingProps;
		}
		throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function markUpdate(workInProgress) {
		workInProgress.flags |= 4;
	}
	function preloadResourceAndSuspendIfNeeded(workInProgress, resource) {
		if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4)) workInProgress.flags &= -16777217;
		else if (workInProgress.flags |= 16777216, !preloadResource(resource)) {
			resource = suspenseHandlerStackCursor.current;
			if (null !== resource && ((workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null !== shellBoundary : (workInProgressRootRenderLanes & 62914560) !== workInProgressRootRenderLanes && 0 === (workInProgressRootRenderLanes & 536870912) || resource !== shellBoundary)) throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
			workInProgress.flags |= 8192;
		}
	}
	function scheduleRetryEffect(workInProgress, retryQueue) {
		null !== retryQueue && (workInProgress.flags |= 4);
		workInProgress.flags & 16384 && (retryQueue = 22 !== workInProgress.tag ? claimNextRetryLane() : 536870912, workInProgress.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
	}
	function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
		if (!isHydrating) switch (renderState.tailMode) {
			case "hidden":
				hasRenderedATailFallback = renderState.tail;
				for (var lastTailNode = null; null !== hasRenderedATailFallback;) null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
				null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
				break;
			case "collapsed":
				lastTailNode = renderState.tail;
				for (var lastTailNode$113 = null; null !== lastTailNode;) null !== lastTailNode.alternate && (lastTailNode$113 = lastTailNode), lastTailNode = lastTailNode.sibling;
				null === lastTailNode$113 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$113.sibling = null;
		}
	}
	function bubbleProperties(completedWork) {
		var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
		if (didBailout) for (var child$114 = completedWork.child; null !== child$114;) newChildLanes |= child$114.lanes | child$114.childLanes, subtreeFlags |= child$114.subtreeFlags & 65011712, subtreeFlags |= child$114.flags & 65011712, child$114.return = completedWork, child$114 = child$114.sibling;
		else for (child$114 = completedWork.child; null !== child$114;) newChildLanes |= child$114.lanes | child$114.childLanes, subtreeFlags |= child$114.subtreeFlags, subtreeFlags |= child$114.flags, child$114.return = completedWork, child$114 = child$114.sibling;
		completedWork.subtreeFlags |= subtreeFlags;
		completedWork.childLanes = newChildLanes;
		return didBailout;
	}
	function completeWork(current, workInProgress, renderLanes) {
		var newProps = workInProgress.pendingProps;
		popTreeContext(workInProgress);
		switch (workInProgress.tag) {
			case 31:
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return bubbleProperties(workInProgress), null;
			case 1: return bubbleProperties(workInProgress), null;
			case 3:
				renderLanes = workInProgress.stateNode;
				newProps = null;
				null !== current && (newProps = current.memoizedState.cache);
				workInProgress.memoizedState.cache !== newProps && (workInProgress.flags |= 2048);
				popProvider(CacheContext);
				popHostContainer();
				renderLanes.pendingContext && (renderLanes.context = renderLanes.pendingContext, renderLanes.pendingContext = null);
				if (null === current || null === current.child) popHydrationState(workInProgress) ? markUpdate(workInProgress) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress.flags & 256) || (workInProgress.flags |= 1024, upgradeHydrationErrorsToRecoverable());
				bubbleProperties(workInProgress);
				return null;
			case 26: return renderLanes = workInProgress.memoizedState, null === current ? (markUpdate(workInProgress), null !== renderLanes ? (bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, renderLanes)) : (bubbleProperties(workInProgress), workInProgress.flags &= -16777217)) : renderLanes ? renderLanes !== current.memoizedState ? (markUpdate(workInProgress), bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, renderLanes)) : (bubbleProperties(workInProgress), workInProgress.flags &= -16777217) : (current.memoizedProps !== newProps && markUpdate(workInProgress), bubbleProperties(workInProgress), workInProgress.flags &= -16777217), null;
			case 27:
				popHostContext(workInProgress);
				renderLanes = rootInstanceStackCursor.current;
				var type = workInProgress.type;
				if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if (!newProps) {
						if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
						bubbleProperties(workInProgress);
						return null;
					}
					current = contextStackCursor.current;
					popHydrationState(workInProgress) ? prepareToHydrateHostInstance(workInProgress, current) : (current = resolveSingletonInstance(type, newProps, renderLanes), workInProgress.stateNode = current, markUpdate(workInProgress));
				}
				bubbleProperties(workInProgress);
				return null;
			case 5:
				popHostContext(workInProgress);
				renderLanes = workInProgress.type;
				if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if (!newProps) {
						if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
						bubbleProperties(workInProgress);
						return null;
					}
					current = contextStackCursor.current;
					if (popHydrationState(workInProgress)) prepareToHydrateHostInstance(workInProgress, current);
					else {
						type = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current);
						switch (current) {
							case 1:
								current = type.createElementNS("http://www.w3.org/2000/svg", renderLanes);
								break;
							case 2:
								current = type.createElementNS("http://www.w3.org/1998/Math/MathML", renderLanes);
								break;
							default: switch (renderLanes) {
								case "svg":
									current = type.createElementNS("http://www.w3.org/2000/svg", renderLanes);
									break;
								case "math":
									current = type.createElementNS("http://www.w3.org/1998/Math/MathML", renderLanes);
									break;
								case "script":
									current = type.createElement("div");
									current.innerHTML = "<script><\/script>";
									current = current.removeChild(current.firstChild);
									break;
								case "select":
									current = "string" === typeof newProps.is ? type.createElement("select", { is: newProps.is }) : type.createElement("select");
									newProps.multiple ? current.multiple = !0 : newProps.size && (current.size = newProps.size);
									break;
								default: current = "string" === typeof newProps.is ? type.createElement(renderLanes, { is: newProps.is }) : type.createElement(renderLanes);
							}
						}
						current[internalInstanceKey] = workInProgress;
						current[internalPropsKey] = newProps;
						a: for (type = workInProgress.child; null !== type;) {
							if (5 === type.tag || 6 === type.tag) current.appendChild(type.stateNode);
							else if (4 !== type.tag && 27 !== type.tag && null !== type.child) {
								type.child.return = type;
								type = type.child;
								continue;
							}
							if (type === workInProgress) break a;
							for (; null === type.sibling;) {
								if (null === type.return || type.return === workInProgress) break a;
								type = type.return;
							}
							type.sibling.return = type.return;
							type = type.sibling;
						}
						workInProgress.stateNode = current;
						a: switch (setInitialProperties(current, renderLanes, newProps), renderLanes) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								current = !!newProps.autoFocus;
								break a;
							case "img":
								current = !0;
								break a;
							default: current = !1;
						}
						current && markUpdate(workInProgress);
					}
				}
				bubbleProperties(workInProgress);
				workInProgress.flags &= -16777217;
				return null;
			case 6:
				if (current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if ("string" !== typeof newProps && null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
					current = rootInstanceStackCursor.current;
					if (popHydrationState(workInProgress)) {
						current = workInProgress.stateNode;
						renderLanes = workInProgress.memoizedProps;
						newProps = null;
						type = hydrationParentFiber;
						if (null !== type) switch (type.tag) {
							case 27:
							case 5: newProps = type.memoizedProps;
						}
						current[internalInstanceKey] = workInProgress;
						current = current.nodeValue === renderLanes || null !== newProps && !0 === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes) ? !0 : !1;
						current || throwOnHydrationMismatch(workInProgress);
					} else current = getOwnerDocumentFromRootContainer(current).createTextNode(newProps), current[internalInstanceKey] = workInProgress, workInProgress.stateNode = current;
				}
				bubbleProperties(workInProgress);
				return null;
			case 13:
				newProps = workInProgress.memoizedState;
				if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
					type = popHydrationState(workInProgress);
					if (null !== newProps && null !== newProps.dehydrated) {
						if (null === current) {
							if (!type) throw Error(formatProdErrorMessage(318));
							type = workInProgress.memoizedState;
							type = null !== type ? type.dehydrated : null;
							if (!type) throw Error(formatProdErrorMessage(317));
							type[internalInstanceKey] = workInProgress;
						} else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
						bubbleProperties(workInProgress);
						type = !1;
					} else type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = !0;
					if (!type) {
						if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
						popSuspenseHandler(workInProgress);
						return null;
					}
				}
				popSuspenseHandler(workInProgress);
				if (0 !== (workInProgress.flags & 128)) return workInProgress.lanes = renderLanes, workInProgress;
				renderLanes = null !== newProps;
				current = null !== current && null !== current.memoizedState;
				if (renderLanes) {
					newProps = workInProgress.child;
					type = null;
					null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool);
					var cache$127 = null;
					null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (cache$127 = newProps.memoizedState.cachePool.pool);
					cache$127 !== type && (newProps.flags |= 2048);
				}
				renderLanes !== current && renderLanes && (workInProgress.child.flags |= 8192);
				scheduleRetryEffect(workInProgress, workInProgress.updateQueue);
				bubbleProperties(workInProgress);
				return null;
			case 4: return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress.stateNode.containerInfo), bubbleProperties(workInProgress), null;
			case 10: return popProvider(workInProgress.type), bubbleProperties(workInProgress), null;
			case 19:
				pop(suspenseStackCursor);
				type = workInProgress.memoizedState;
				if (null === type) return bubbleProperties(workInProgress), null;
				newProps = 0 !== (workInProgress.flags & 128);
				cache$127 = type.rendering;
				if (null === cache$127) if (newProps) cutOffTailIfNeeded(type, !1);
				else {
					if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128)) for (current = workInProgress.child; null !== current;) {
						cache$127 = findFirstSuspended(current);
						if (null !== cache$127) {
							workInProgress.flags |= 128;
							cutOffTailIfNeeded(type, !1);
							current = cache$127.updateQueue;
							workInProgress.updateQueue = current;
							scheduleRetryEffect(workInProgress, current);
							workInProgress.subtreeFlags = 0;
							current = renderLanes;
							for (renderLanes = workInProgress.child; null !== renderLanes;) resetWorkInProgress(renderLanes, current), renderLanes = renderLanes.sibling;
							push(suspenseStackCursor, suspenseStackCursor.current & 1 | 2);
							return workInProgress.child;
						}
						current = current.sibling;
					}
					null !== type.tail && now() > workInProgressRootRenderTargetTime && (workInProgress.flags |= 128, newProps = !0, cutOffTailIfNeeded(type, !1), workInProgress.lanes = 4194304);
				}
				else {
					if (!newProps) if (current = findFirstSuspended(cache$127), null !== current) {
						if (workInProgress.flags |= 128, newProps = !0, current = current.updateQueue, workInProgress.updateQueue = current, scheduleRetryEffect(workInProgress, current), cutOffTailIfNeeded(type, !0), null === type.tail && "hidden" === type.tailMode && !cache$127.alternate && !isHydrating) return bubbleProperties(workInProgress), null;
					} else 2 * now() - type.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes && (workInProgress.flags |= 128, newProps = !0, cutOffTailIfNeeded(type, !1), workInProgress.lanes = 4194304);
					type.isBackwards ? (cache$127.sibling = workInProgress.child, workInProgress.child = cache$127) : (current = type.last, null !== current ? current.sibling = cache$127 : workInProgress.child = cache$127, type.last = cache$127);
				}
				if (null !== type.tail) return workInProgress = type.tail, type.rendering = workInProgress, type.tail = workInProgress.sibling, type.renderingStartTime = now(), workInProgress.sibling = null, current = suspenseStackCursor.current, push(suspenseStackCursor, newProps ? current & 1 | 2 : current & 1), workInProgress;
				bubbleProperties(workInProgress);
				return null;
			case 22:
			case 23: return popSuspenseHandler(workInProgress), popHiddenContext(), newProps = null !== workInProgress.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress.flags |= 8192) : newProps && (workInProgress.flags |= 8192), newProps ? 0 !== (renderLanes & 536870912) && 0 === (workInProgress.flags & 128) && (bubbleProperties(workInProgress), workInProgress.subtreeFlags & 6 && (workInProgress.flags |= 8192)) : bubbleProperties(workInProgress), renderLanes = workInProgress.updateQueue, null !== renderLanes && scheduleRetryEffect(workInProgress, renderLanes.retryQueue), renderLanes = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress.memoizedState && null !== workInProgress.memoizedState.cachePool && (newProps = workInProgress.memoizedState.cachePool.pool), newProps !== renderLanes && (workInProgress.flags |= 2048), null !== current && pop(resumedCache), null;
			case 24: return renderLanes = null, null !== current && (renderLanes = current.memoizedState.cache), workInProgress.memoizedState.cache !== renderLanes && (workInProgress.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function unwindWork(current, workInProgress) {
		popTreeContext(workInProgress);
		switch (workInProgress.tag) {
			case 1: return current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 3: return popProvider(CacheContext), popHostContainer(), current = workInProgress.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 26:
			case 27:
			case 5: return popHostContext(workInProgress), null;
			case 13:
				popSuspenseHandler(workInProgress);
				current = workInProgress.memoizedState;
				if (null !== current && null !== current.dehydrated) {
					if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
					resetHydrationState();
				}
				current = workInProgress.flags;
				return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 19: return pop(suspenseStackCursor), null;
			case 4: return popHostContainer(), null;
			case 10: return popProvider(workInProgress.type), null;
			case 22:
			case 23: return popSuspenseHandler(workInProgress), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 24: return popProvider(CacheContext), null;
			case 25: return null;
			default: return null;
		}
	}
	function unwindInterruptedWork(current, interruptedWork) {
		popTreeContext(interruptedWork);
		switch (interruptedWork.tag) {
			case 3:
				popProvider(CacheContext);
				popHostContainer();
				break;
			case 26:
			case 27:
			case 5:
				popHostContext(interruptedWork);
				break;
			case 4:
				popHostContainer();
				break;
			case 13:
				popSuspenseHandler(interruptedWork);
				break;
			case 19:
				pop(suspenseStackCursor);
				break;
			case 10:
				popProvider(interruptedWork.type);
				break;
			case 22:
			case 23:
				popSuspenseHandler(interruptedWork);
				popHiddenContext();
				null !== current && pop(resumedCache);
				break;
			case 24: popProvider(CacheContext);
		}
	}
	function commitHookEffectListMount(flags, finishedWork) {
		try {
			var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
			if (null !== lastEffect) {
				var firstEffect = lastEffect.next;
				updateQueue = firstEffect;
				do {
					if ((updateQueue.tag & flags) === flags) {
						lastEffect = void 0;
						var create = updateQueue.create, inst = updateQueue.inst;
						lastEffect = create();
						inst.destroy = lastEffect;
					}
					updateQueue = updateQueue.next;
				} while (updateQueue !== firstEffect);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
		try {
			var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
			if (null !== lastEffect) {
				var firstEffect = lastEffect.next;
				updateQueue = firstEffect;
				do {
					if ((updateQueue.tag & flags) === flags) {
						var inst = updateQueue.inst, destroy = inst.destroy;
						if (void 0 !== destroy) {
							inst.destroy = void 0;
							lastEffect = finishedWork;
							var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
							try {
								destroy_();
							} catch (error) {
								captureCommitPhaseError(lastEffect, nearestMountedAncestor, error);
							}
						}
					}
					updateQueue = updateQueue.next;
				} while (updateQueue !== firstEffect);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitClassCallbacks(finishedWork) {
		var updateQueue = finishedWork.updateQueue;
		if (null !== updateQueue) {
			var instance = finishedWork.stateNode;
			try {
				commitCallbacks(updateQueue, instance);
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
		}
	}
	function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
		instance.props = resolveClassComponentProps(current.type, current.memoizedProps);
		instance.state = current.memoizedState;
		try {
			instance.componentWillUnmount();
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		}
	}
	function safelyAttachRef(current, nearestMountedAncestor) {
		try {
			var ref = current.ref;
			if (null !== ref) {
				switch (current.tag) {
					case 26:
					case 27:
					case 5:
						var instanceToUse = current.stateNode;
						break;
					case 30:
						instanceToUse = current.stateNode;
						break;
					default: instanceToUse = current.stateNode;
				}
				"function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
			}
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		}
	}
	function safelyDetachRef(current, nearestMountedAncestor) {
		var ref = current.ref, refCleanup = current.refCleanup;
		if (null !== ref) if ("function" === typeof refCleanup) try {
			refCleanup();
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		} finally {
			current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
		}
		else if ("function" === typeof ref) try {
			ref(null);
		} catch (error$143) {
			captureCommitPhaseError(current, nearestMountedAncestor, error$143);
		}
		else ref.current = null;
	}
	function commitHostMount(finishedWork) {
		var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
		try {
			a: switch (type) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					props.autoFocus && instance.focus();
					break a;
				case "img": props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitHostUpdate(finishedWork, newProps, oldProps) {
		try {
			var domElement = finishedWork.stateNode;
			updateProperties(domElement, finishedWork.type, oldProps, newProps);
			domElement[internalPropsKey] = newProps;
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function isHostParent(fiber) {
		return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
	}
	function getHostSibling(fiber) {
		a: for (;;) {
			for (; null === fiber.sibling;) {
				if (null === fiber.return || isHostParent(fiber.return)) return null;
				fiber = fiber.return;
			}
			fiber.sibling.return = fiber.return;
			for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag;) {
				if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
				if (fiber.flags & 2) continue a;
				if (null === fiber.child || 4 === fiber.tag) continue a;
				else fiber.child.return = fiber, fiber = fiber.child;
			}
			if (!(fiber.flags & 2)) return fiber.stateNode;
		}
	}
	function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
		var tag = node.tag;
		if (5 === tag || 6 === tag) node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
		else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node)) for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node;) insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
	}
	function insertOrAppendPlacementNode(node, before, parent) {
		var tag = node.tag;
		if (5 === tag || 6 === tag) node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
		else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node)) for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node;) insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
	}
	function commitHostSingletonAcquisition(finishedWork) {
		var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
		try {
			for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length;) singleton.removeAttributeNode(attributes[0]);
			setInitialProperties(singleton, type, props);
			singleton[internalInstanceKey] = finishedWork;
			singleton[internalPropsKey] = props;
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	var offscreenSubtreeIsHidden = !1;
	var offscreenSubtreeWasHidden = !1;
	var needsFormReset = !1;
	var PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set;
	var nextEffect = null;
	function commitBeforeMutationEffects(root, firstChild) {
		root = root.containerInfo;
		eventsEnabled = _enabled;
		root = getActiveElementDeep(root);
		if (hasSelectionCapabilities(root)) {
			if ("selectionStart" in root) var JSCompiler_temp = {
				start: root.selectionStart,
				end: root.selectionEnd
			};
			else a: {
				JSCompiler_temp = (JSCompiler_temp = root.ownerDocument) && JSCompiler_temp.defaultView || window;
				var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
				if (selection && 0 !== selection.rangeCount) {
					JSCompiler_temp = selection.anchorNode;
					var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
					selection = selection.focusOffset;
					try {
						JSCompiler_temp.nodeType, focusNode.nodeType;
					} catch (e$20) {
						JSCompiler_temp = null;
						break a;
					}
					var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root, parentNode = null;
					b: for (;;) {
						for (var next;;) {
							node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
							node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
							3 === node.nodeType && (length += node.nodeValue.length);
							if (null === (next = node.firstChild)) break;
							parentNode = node;
							node = next;
						}
						for (;;) {
							if (node === root) break b;
							parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
							parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
							if (null !== (next = node.nextSibling)) break;
							node = parentNode;
							parentNode = node.parentNode;
						}
						node = next;
					}
					JSCompiler_temp = -1 === start || -1 === end ? null : {
						start,
						end
					};
				} else JSCompiler_temp = null;
			}
			JSCompiler_temp = JSCompiler_temp || {
				start: 0,
				end: 0
			};
		} else JSCompiler_temp = null;
		selectionInformation = {
			focusedElem: root,
			selectionRange: JSCompiler_temp
		};
		_enabled = !1;
		for (nextEffect = firstChild; null !== nextEffect;) if (firstChild = nextEffect, root = firstChild.child, 0 !== (firstChild.subtreeFlags & 1024) && null !== root) root.return = firstChild, nextEffect = root;
		else for (; null !== nextEffect;) {
			firstChild = nextEffect;
			focusNode = firstChild.alternate;
			root = firstChild.flags;
			switch (firstChild.tag) {
				case 0: break;
				case 11:
				case 15: break;
				case 1:
					if (0 !== (root & 1024) && null !== focusNode) {
						root = void 0;
						JSCompiler_temp = firstChild;
						anchorOffset = focusNode.memoizedProps;
						focusNode = focusNode.memoizedState;
						selection = JSCompiler_temp.stateNode;
						try {
							var resolvedPrevProps = resolveClassComponentProps(JSCompiler_temp.type, anchorOffset, JSCompiler_temp.elementType === JSCompiler_temp.type);
							root = selection.getSnapshotBeforeUpdate(resolvedPrevProps, focusNode);
							selection.__reactInternalSnapshotBeforeUpdate = root;
						} catch (error) {
							captureCommitPhaseError(JSCompiler_temp, JSCompiler_temp.return, error);
						}
					}
					break;
				case 3:
					if (0 !== (root & 1024)) {
						if (root = firstChild.stateNode.containerInfo, JSCompiler_temp = root.nodeType, 9 === JSCompiler_temp) clearContainerSparingly(root);
						else if (1 === JSCompiler_temp) switch (root.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								clearContainerSparingly(root);
								break;
							default: root.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (0 !== (root & 1024)) throw Error(formatProdErrorMessage(163));
			}
			root = firstChild.sibling;
			if (null !== root) {
				root.return = firstChild.return;
				nextEffect = root;
				break;
			}
			nextEffect = firstChild.return;
		}
	}
	function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
		var flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitHookEffectListMount(5, finishedWork);
				break;
			case 1:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				if (flags & 4) if (finishedRoot = finishedWork.stateNode, null === current) try {
					finishedRoot.componentDidMount();
				} catch (error) {
					captureCommitPhaseError(finishedWork, finishedWork.return, error);
				}
				else {
					var prevProps = resolveClassComponentProps(finishedWork.type, current.memoizedProps);
					current = current.memoizedState;
					try {
						finishedRoot.componentDidUpdate(prevProps, current, finishedRoot.__reactInternalSnapshotBeforeUpdate);
					} catch (error$142) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error$142);
					}
				}
				flags & 64 && commitClassCallbacks(finishedWork);
				flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
				break;
			case 3:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
					current = null;
					if (null !== finishedWork.child) switch (finishedWork.child.tag) {
						case 27:
						case 5:
							current = finishedWork.child.stateNode;
							break;
						case 1: current = finishedWork.child.stateNode;
					}
					try {
						commitCallbacks(finishedRoot, current);
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				break;
			case 27: null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
			case 26:
			case 5:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				null === current && flags & 4 && commitHostMount(finishedWork);
				flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
				break;
			case 12:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				break;
			case 13:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
				flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(null, finishedWork), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
				break;
			case 22:
				flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
				if (!flags) {
					current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
					prevProps = offscreenSubtreeIsHidden;
					var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
					offscreenSubtreeIsHidden = flags;
					(offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, 0 !== (finishedWork.subtreeFlags & 8772)) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
					offscreenSubtreeIsHidden = prevProps;
					offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
				}
				break;
			case 30: break;
			default: recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
		}
	}
	function detachFiberAfterEffects(fiber) {
		var alternate = fiber.alternate;
		null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
		fiber.child = null;
		fiber.deletions = null;
		fiber.sibling = null;
		5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
		fiber.stateNode = null;
		fiber.return = null;
		fiber.dependencies = null;
		fiber.memoizedProps = null;
		fiber.memoizedState = null;
		fiber.pendingProps = null;
		fiber.stateNode = null;
		fiber.updateQueue = null;
	}
	var hostParent = null;
	var hostParentIsContainer = !1;
	function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
		for (parent = parent.child; null !== parent;) commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
	}
	function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
		if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount) try {
			injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
		} catch (err) {}
		switch (deletedFiber.tag) {
			case 26:
				offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
				break;
			case 27:
				offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
				var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
				isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = !1);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				releaseSingletonInstance(deletedFiber.stateNode);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				break;
			case 5: offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
			case 6:
				prevHostParent = hostParent;
				prevHostParentIsContainer = hostParentIsContainer;
				hostParent = null;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				if (null !== hostParent) if (hostParentIsContainer) try {
					(9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
				} catch (error) {
					captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
				}
				else try {
					hostParent.removeChild(deletedFiber.stateNode);
				} catch (error) {
					captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
				}
				break;
			case 18:
				null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearSuspenseBoundary(9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, deletedFiber.stateNode), retryIfBlockedOn(finishedRoot)) : clearSuspenseBoundary(hostParent, deletedFiber.stateNode));
				break;
			case 4:
				prevHostParent = hostParent;
				prevHostParentIsContainer = hostParentIsContainer;
				hostParent = deletedFiber.stateNode.containerInfo;
				hostParentIsContainer = !0;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				offscreenSubtreeWasHidden || commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
				offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 1:
				offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, prevHostParent));
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 21:
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 22:
				offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				offscreenSubtreeWasHidden = prevHostParent;
				break;
			default: recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
		}
	}
	function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
		if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot)))) try {
			retryIfBlockedOn(finishedRoot);
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function getRetryCache(finishedWork) {
		switch (finishedWork.tag) {
			case 13:
			case 19:
				var retryCache = finishedWork.stateNode;
				null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
				return retryCache;
			case 22: return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
			default: throw Error(formatProdErrorMessage(435, finishedWork.tag));
		}
	}
	function attachSuspenseRetryListeners(finishedWork, wakeables) {
		var retryCache = getRetryCache(finishedWork);
		wakeables.forEach(function(wakeable) {
			var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
			retryCache.has(wakeable) || (retryCache.add(wakeable), wakeable.then(retry, retry));
		});
	}
	function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
		var deletions = parentFiber.deletions;
		if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
			var childToDelete = deletions[i], root = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
			a: for (; null !== parent;) {
				switch (parent.tag) {
					case 27:
						if (isSingletonScope(parent.type)) {
							hostParent = parent.stateNode;
							hostParentIsContainer = !1;
							break a;
						}
						break;
					case 5:
						hostParent = parent.stateNode;
						hostParentIsContainer = !1;
						break a;
					case 3:
					case 4:
						hostParent = parent.stateNode.containerInfo;
						hostParentIsContainer = !0;
						break a;
				}
				parent = parent.return;
			}
			if (null === hostParent) throw Error(formatProdErrorMessage(160));
			commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
			hostParent = null;
			hostParentIsContainer = !1;
			root = childToDelete.alternate;
			null !== root && (root.return = null);
			childToDelete.return = null;
		}
		if (parentFiber.subtreeFlags & 13878) for (parentFiber = parentFiber.child; null !== parentFiber;) commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
	}
	var currentHoistableRoot = null;
	function commitMutationEffectsOnFiber(finishedWork, root) {
		var current = finishedWork.alternate, flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
				break;
			case 1:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
				break;
			case 26:
				var hoistableRoot = currentHoistableRoot;
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				if (flags & 4) {
					var currentResource = null !== current ? current.memoizedState : null;
					flags = finishedWork.memoizedState;
					if (null === current) if (null === flags) if (null === finishedWork.stateNode) {
						a: {
							flags = finishedWork.type;
							current = finishedWork.memoizedProps;
							hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
							b: switch (flags) {
								case "title":
									currentResource = hoistableRoot.getElementsByTagName("title")[0];
									if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop")) currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(currentResource, hoistableRoot.querySelector("head > title"));
									setInitialProperties(currentResource, flags, current);
									currentResource[internalInstanceKey] = finishedWork;
									markNodeAsHoistable(currentResource);
									flags = currentResource;
									break a;
								case "link":
									var maybeNodes = getHydratableHoistableCache("link", "href", hoistableRoot).get(flags + (current.href || ""));
									if (maybeNodes) {
										for (var i = 0; i < maybeNodes.length; i++) if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
											maybeNodes.splice(i, 1);
											break b;
										}
									}
									currentResource = hoistableRoot.createElement(flags);
									setInitialProperties(currentResource, flags, current);
									hoistableRoot.head.appendChild(currentResource);
									break;
								case "meta":
									if (maybeNodes = getHydratableHoistableCache("meta", "content", hoistableRoot).get(flags + (current.content || ""))) {
										for (i = 0; i < maybeNodes.length; i++) if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
											maybeNodes.splice(i, 1);
											break b;
										}
									}
									currentResource = hoistableRoot.createElement(flags);
									setInitialProperties(currentResource, flags, current);
									hoistableRoot.head.appendChild(currentResource);
									break;
								default: throw Error(formatProdErrorMessage(468, flags));
							}
							currentResource[internalInstanceKey] = finishedWork;
							markNodeAsHoistable(currentResource);
							flags = currentResource;
						}
						finishedWork.stateNode = flags;
					} else mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode);
					else finishedWork.stateNode = acquireResource(hoistableRoot, flags, finishedWork.memoizedProps);
					else currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode) : acquireResource(hoistableRoot, flags, finishedWork.memoizedProps)) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
				}
				break;
			case 27:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				null !== current && flags & 4 && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
				break;
			case 5:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				if (finishedWork.flags & 32) {
					hoistableRoot = finishedWork.stateNode;
					try {
						setTextContent(hoistableRoot, "");
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(finishedWork, hoistableRoot, null !== current ? current.memoizedProps : hoistableRoot));
				flags & 1024 && (needsFormReset = !0);
				break;
			case 6:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				if (flags & 4) {
					if (null === finishedWork.stateNode) throw Error(formatProdErrorMessage(162));
					flags = finishedWork.memoizedProps;
					current = finishedWork.stateNode;
					try {
						current.nodeValue = flags;
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				break;
			case 3:
				tagCaches = null;
				hoistableRoot = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(root.containerInfo);
				recursivelyTraverseMutationEffects(root, finishedWork);
				currentHoistableRoot = hoistableRoot;
				commitReconciliationEffects(finishedWork);
				if (flags & 4 && null !== current && current.memoizedState.isDehydrated) try {
					retryIfBlockedOn(root.containerInfo);
				} catch (error) {
					captureCommitPhaseError(finishedWork, finishedWork.return, error);
				}
				needsFormReset && (needsFormReset = !1, recursivelyResetForms(finishedWork));
				break;
			case 4:
				flags = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo);
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				currentHoistableRoot = flags;
				break;
			case 12:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				break;
			case 13:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 22:
				hoistableRoot = null !== finishedWork.memoizedState;
				var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
				offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
				offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
				recursivelyTraverseMutationEffects(root, finishedWork);
				offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
				offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
				commitReconciliationEffects(finishedWork);
				if (flags & 8192) a: for (root = finishedWork.stateNode, root._visibility = hoistableRoot ? root._visibility & -2 : root._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root = finishedWork;;) {
					if (5 === root.tag || 26 === root.tag) {
						if (null === current) {
							wasHidden = current = root;
							try {
								if (currentResource = wasHidden.stateNode, hoistableRoot) maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
								else {
									i = wasHidden.stateNode;
									var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
									i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
								}
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if (6 === root.tag) {
						if (null === current) {
							wasHidden = root;
							try {
								wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if ((22 !== root.tag && 23 !== root.tag || null === root.memoizedState || root === finishedWork) && null !== root.child) {
						root.child.return = root;
						root = root.child;
						continue;
					}
					if (root === finishedWork) break a;
					for (; null === root.sibling;) {
						if (null === root.return || root.return === finishedWork) break a;
						current === root && (current = null);
						root = root.return;
					}
					current === root && (current = null);
					root.sibling.return = root.return;
					root = root.sibling;
				}
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
				break;
			case 19:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 30: break;
			case 21: break;
			default: recursivelyTraverseMutationEffects(root, finishedWork), commitReconciliationEffects(finishedWork);
		}
	}
	function commitReconciliationEffects(finishedWork) {
		var flags = finishedWork.flags;
		if (flags & 2) {
			try {
				for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber;) {
					if (isHostParent(parentFiber)) {
						hostParentFiber = parentFiber;
						break;
					}
					parentFiber = parentFiber.return;
				}
				if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
				switch (hostParentFiber.tag) {
					case 27:
						var parent = hostParentFiber.stateNode;
						insertOrAppendPlacementNode(finishedWork, getHostSibling(finishedWork), parent);
						break;
					case 5:
						var parent$144 = hostParentFiber.stateNode;
						hostParentFiber.flags & 32 && (setTextContent(parent$144, ""), hostParentFiber.flags &= -33);
						insertOrAppendPlacementNode(finishedWork, getHostSibling(finishedWork), parent$144);
						break;
					case 3:
					case 4:
						var parent$146 = hostParentFiber.stateNode.containerInfo;
						insertOrAppendPlacementNodeIntoContainer(finishedWork, getHostSibling(finishedWork), parent$146);
						break;
					default: throw Error(formatProdErrorMessage(161));
				}
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
			finishedWork.flags &= -3;
		}
		flags & 4096 && (finishedWork.flags &= -4097);
	}
	function recursivelyResetForms(parentFiber) {
		if (parentFiber.subtreeFlags & 1024) for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var fiber = parentFiber;
			recursivelyResetForms(fiber);
			5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseLayoutEffects(root, parentFiber) {
		if (parentFiber.subtreeFlags & 8772) for (parentFiber = parentFiber.child; null !== parentFiber;) commitLayoutEffectOnFiber(root, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
	}
	function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedWork = parentFiber;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 1:
					safelyDetachRef(finishedWork, finishedWork.return);
					var instance = finishedWork.stateNode;
					"function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 27: releaseSingletonInstance(finishedWork.stateNode);
				case 26:
				case 5:
					safelyDetachRef(finishedWork, finishedWork.return);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 22:
					null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 30:
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				default: recursivelyTraverseDisappearLayoutEffects(finishedWork);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
		includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 15:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					commitHookEffectListMount(4, finishedWork);
					break;
				case 1:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					current = finishedWork;
					finishedRoot = current.stateNode;
					if ("function" === typeof finishedRoot.componentDidMount) try {
						finishedRoot.componentDidMount();
					} catch (error) {
						captureCommitPhaseError(current, current.return, error);
					}
					current = finishedWork;
					finishedRoot = current.updateQueue;
					if (null !== finishedRoot) {
						var instance = current.stateNode;
						try {
							var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
							if (null !== hiddenCallbacks) for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++) callCallback(hiddenCallbacks[finishedRoot], instance);
						} catch (error) {
							captureCommitPhaseError(current, current.return, error);
						}
					}
					includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 27: commitHostSingletonAcquisition(finishedWork);
				case 26:
				case 5:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 12:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					break;
				case 13:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
					break;
				case 22:
					null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 30: break;
				default: recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function commitOffscreenPassiveMountEffects(current, finishedWork) {
		var previousCache = null;
		null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
		current = null;
		null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
		current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
	}
	function commitCachePassiveMountEffect(current, finishedWork) {
		current = null;
		null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
		finishedWork = finishedWork.memoizedState.cache;
		finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
	}
	function recursivelyTraversePassiveMountEffects(root, parentFiber, committedLanes, committedTransitions) {
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) commitPassiveMountOnFiber(root, parentFiber, committedLanes, committedTransitions), parentFiber = parentFiber.sibling;
	}
	function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
		var flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				flags & 2048 && commitHookEffectListMount(9, finishedWork);
				break;
			case 1:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 3:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
				break;
			case 12:
				if (flags & 2048) {
					recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
					finishedRoot = finishedWork.stateNode;
					try {
						var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
						"function" === typeof onPostCommit && onPostCommit(id, null === finishedWork.alternate ? "mount" : "update", finishedRoot.passiveEffectDuration, -0);
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				} else recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 13:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 23: break;
			case 22:
				_finishedWork$memoize2 = finishedWork.stateNode;
				id = finishedWork.alternate;
				null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, 0 !== (finishedWork.subtreeFlags & 10256)));
				flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
				break;
			case 24:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
				break;
			default: recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
		}
	}
	function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
		includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 10256);
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 15:
					recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
					commitHookEffectListMount(8, finishedWork);
					break;
				case 23: break;
				case 22:
					var instance = finishedWork.stateNode;
					null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects));
					includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
					break;
				case 24:
					recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
					break;
				default: recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 22:
					recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
					flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
					break;
				case 24:
					recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
					flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
					break;
				default: recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	var suspenseyCommitFlag = 8192;
	function recursivelyAccumulateSuspenseyCommit(parentFiber) {
		if (parentFiber.subtreeFlags & suspenseyCommitFlag) for (parentFiber = parentFiber.child; null !== parentFiber;) accumulateSuspenseyCommitOnFiber(parentFiber), parentFiber = parentFiber.sibling;
	}
	function accumulateSuspenseyCommitOnFiber(fiber) {
		switch (fiber.tag) {
			case 26:
				recursivelyAccumulateSuspenseyCommit(fiber);
				fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps);
				break;
			case 5:
				recursivelyAccumulateSuspenseyCommit(fiber);
				break;
			case 3:
			case 4:
				var previousHoistableRoot = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
				recursivelyAccumulateSuspenseyCommit(fiber);
				currentHoistableRoot = previousHoistableRoot;
				break;
			case 22:
				null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(fiber), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(fiber));
				break;
			default: recursivelyAccumulateSuspenseyCommit(fiber);
		}
	}
	function detachAlternateSiblings(parentFiber) {
		var previousFiber = parentFiber.alternate;
		if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
			previousFiber.child = null;
			do
				previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
			while (null !== parentFiber);
		}
	}
	function recursivelyTraversePassiveUnmountEffects(parentFiber) {
		var deletions = parentFiber.deletions;
		if (0 !== (parentFiber.flags & 16)) {
			if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
				var childToDelete = deletions[i];
				nextEffect = childToDelete;
				commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
			}
			detachAlternateSiblings(parentFiber);
		}
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
	}
	function commitPassiveUnmountOnFiber(finishedWork) {
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
				break;
			case 3:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			case 12:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			case 22:
				var instance = finishedWork.stateNode;
				null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			default: recursivelyTraversePassiveUnmountEffects(finishedWork);
		}
	}
	function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
		var deletions = parentFiber.deletions;
		if (0 !== (parentFiber.flags & 16)) {
			if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
				var childToDelete = deletions[i];
				nextEffect = childToDelete;
				commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
			}
			detachAlternateSiblings(parentFiber);
		}
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			deletions = parentFiber;
			switch (deletions.tag) {
				case 0:
				case 11:
				case 15:
					commitHookEffectListUnmount(8, deletions, deletions.return);
					recursivelyTraverseDisconnectPassiveEffects(deletions);
					break;
				case 22:
					i = deletions.stateNode;
					i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
					break;
				default: recursivelyTraverseDisconnectPassiveEffects(deletions);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
		for (; null !== nextEffect;) {
			var fiber = nextEffect;
			switch (fiber.tag) {
				case 0:
				case 11:
				case 15:
					commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
					break;
				case 23:
				case 22:
					if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
						var cache = fiber.memoizedState.cachePool.pool;
						null != cache && cache.refCount++;
					}
					break;
				case 24: releaseCache(fiber.memoizedState.cache);
			}
			cache = fiber.child;
			if (null !== cache) cache.return = fiber, nextEffect = cache;
			else a: for (fiber = deletedSubtreeRoot; null !== nextEffect;) {
				cache = nextEffect;
				var sibling = cache.sibling, returnFiber = cache.return;
				detachFiberAfterEffects(cache);
				if (cache === fiber) {
					nextEffect = null;
					break a;
				}
				if (null !== sibling) {
					sibling.return = returnFiber;
					nextEffect = sibling;
					break a;
				}
				nextEffect = returnFiber;
			}
		}
	}
	var DefaultAsyncDispatcher = { getCacheForType: function(resourceType) {
		var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
		void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
		return cacheForType;
	} };
	var PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map;
	var executionContext = 0;
	var workInProgressRoot = null;
	var workInProgress = null;
	var workInProgressRootRenderLanes = 0;
	var workInProgressSuspendedReason = 0;
	var workInProgressThrownValue = null;
	var workInProgressRootDidSkipSuspendedSiblings = !1;
	var workInProgressRootIsPrerendering = !1;
	var workInProgressRootDidAttachPingListener = !1;
	var entangledRenderLanes = 0;
	var workInProgressRootExitStatus = 0;
	var workInProgressRootSkippedLanes = 0;
	var workInProgressRootInterleavedUpdatedLanes = 0;
	var workInProgressRootPingedLanes = 0;
	var workInProgressDeferredLane = 0;
	var workInProgressSuspendedRetryLanes = 0;
	var workInProgressRootConcurrentErrors = null;
	var workInProgressRootRecoverableErrors = null;
	var workInProgressRootDidIncludeRecursiveRenderUpdate = !1;
	var globalMostRecentFallbackTime = 0;
	var workInProgressRootRenderTargetTime = Infinity;
	var workInProgressTransitions = null;
	var legacyErrorBoundariesThatAlreadyFailed = null;
	var pendingEffectsStatus = 0;
	var pendingEffectsRoot = null;
	var pendingFinishedWork = null;
	var pendingEffectsLanes = 0;
	var pendingEffectsRemainingLanes = 0;
	var pendingPassiveTransitions = null;
	var pendingRecoverableErrors = null;
	var nestedUpdateCount = 0;
	var rootWithNestedUpdates = null;
	function requestUpdateLane() {
		if (0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes) return workInProgressRootRenderLanes & -workInProgressRootRenderLanes;
		if (null !== ReactSharedInternals.T) {
			var actionScopeLane = currentEntangledLane;
			return 0 !== actionScopeLane ? actionScopeLane : requestTransitionLane();
		}
		return resolveUpdatePriority();
	}
	function requestDeferredLane() {
		0 === workInProgressDeferredLane && (workInProgressDeferredLane = 0 === (workInProgressRootRenderLanes & 536870912) || isHydrating ? claimNextTransitionLane() : 536870912);
		var suspenseHandler = suspenseHandlerStackCursor.current;
		null !== suspenseHandler && (suspenseHandler.flags |= 32);
		return workInProgressDeferredLane;
	}
	function scheduleUpdateOnFiber(root, fiber, lane) {
		if (root === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) prepareFreshStack(root, 0), markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
		markRootUpdated$1(root, lane);
		if (0 === (executionContext & 2) || root !== workInProgressRoot) root === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, !1)), ensureRootIsScheduled(root);
	}
	function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
		if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
		var shouldTimeSlice = !forceSync && 0 === (lanes & 124) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, !0), renderWasConcurrent = shouldTimeSlice;
		do {
			if (0 === exitStatus) {
				workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, !1);
				break;
			} else {
				forceSync = root$jscomp$0.current.alternate;
				if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
					exitStatus = renderRootSync(root$jscomp$0, lanes, !1);
					renderWasConcurrent = !1;
					continue;
				}
				if (2 === exitStatus) {
					renderWasConcurrent = lanes;
					if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent) var JSCompiler_inline_result = 0;
					else JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
					if (0 !== JSCompiler_inline_result) {
						lanes = JSCompiler_inline_result;
						a: {
							var root = root$jscomp$0;
							exitStatus = workInProgressRootConcurrentErrors;
							var wasRootDehydrated = root.current.memoizedState.isDehydrated;
							wasRootDehydrated && (prepareFreshStack(root, JSCompiler_inline_result).flags |= 256);
							JSCompiler_inline_result = renderRootSync(root, JSCompiler_inline_result, !1);
							if (2 !== JSCompiler_inline_result) {
								if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
									root.errorRecoveryDisabledLanes |= renderWasConcurrent;
									workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
									exitStatus = 4;
									break a;
								}
								renderWasConcurrent = workInProgressRootRecoverableErrors;
								workInProgressRootRecoverableErrors = exitStatus;
								null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, renderWasConcurrent));
							}
							exitStatus = JSCompiler_inline_result;
						}
						renderWasConcurrent = !1;
						if (2 !== exitStatus) continue;
					}
				}
				if (1 === exitStatus) {
					prepareFreshStack(root$jscomp$0, 0);
					markRootSuspended(root$jscomp$0, lanes, 0, !0);
					break;
				}
				a: {
					shouldTimeSlice = root$jscomp$0;
					renderWasConcurrent = exitStatus;
					switch (renderWasConcurrent) {
						case 0:
						case 1: throw Error(formatProdErrorMessage(345));
						case 4: if ((lanes & 4194048) !== lanes) break;
						case 6:
							markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
							break a;
						case 2:
							workInProgressRootRecoverableErrors = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(formatProdErrorMessage(329));
					}
					if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
						markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
						if (0 !== getNextLanes(shouldTimeSlice, 0, !0)) break a;
						shouldTimeSlice.timeoutHandle = scheduleTimeout(commitRootWhenReady.bind(null, shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, 2, -0, 0), exitStatus);
						break a;
					}
					commitRootWhenReady(shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, 0, -0, 0);
				}
			}
			break;
		} while (1);
		ensureRootIsScheduled(root$jscomp$0);
	}
	function commitRootWhenReady(root, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
		root.timeoutHandle = -1;
		suspendedCommitReason = finishedWork.subtreeFlags;
		if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
			if (suspendedState = {
				stylesheets: null,
				count: 0,
				unsuspend: noop
			}, accumulateSuspenseyCommitOnFiber(finishedWork), suspendedCommitReason = waitForCommitToBeReady(), null !== suspendedCommitReason) {
				root.cancelPendingCommit = suspendedCommitReason(commitRoot.bind(null, root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, exitStatus, 1, completedRenderStartTime, completedRenderEndTime));
				markRootSuspended(root, lanes, spawnedLane, !didSkipSuspendedSiblings);
				return;
			}
		}
		commitRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes);
	}
	function isRenderConsistentWithExternalStores(finishedWork) {
		for (var node = finishedWork;;) {
			var tag = node.tag;
			if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag))) for (var i = 0; i < tag.length; i++) {
				var check = tag[i], getSnapshot = check.getSnapshot;
				check = check.value;
				try {
					if (!objectIs(getSnapshot(), check)) return !1;
				} catch (error) {
					return !1;
				}
			}
			tag = node.child;
			if (node.subtreeFlags & 16384 && null !== tag) tag.return = node, node = tag;
			else {
				if (node === finishedWork) break;
				for (; null === node.sibling;) {
					if (null === node.return || node.return === finishedWork) return !0;
					node = node.return;
				}
				node.sibling.return = node.return;
				node = node.sibling;
			}
		}
		return !0;
	}
	function markRootSuspended(root, suspendedLanes, spawnedLane, didAttemptEntireTree) {
		suspendedLanes &= ~workInProgressRootPingedLanes;
		suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
		root.suspendedLanes |= suspendedLanes;
		root.pingedLanes &= ~suspendedLanes;
		didAttemptEntireTree && (root.warmLanes |= suspendedLanes);
		didAttemptEntireTree = root.expirationTimes;
		for (var lanes = suspendedLanes; 0 < lanes;) {
			var index$4 = 31 - clz32(lanes), lane = 1 << index$4;
			didAttemptEntireTree[index$4] = -1;
			lanes &= ~lane;
		}
		0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
	}
	function flushSyncWork$1() {
		return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0, !1), !1) : !0;
	}
	function resetWorkInProgressStack() {
		if (null !== workInProgress) {
			if (0 === workInProgressSuspendedReason) var interruptedWork = workInProgress.return;
			else interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState = null, thenableIndexCounter = 0, interruptedWork = workInProgress;
			for (; null !== interruptedWork;) unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
			workInProgress = null;
		}
	}
	function prepareFreshStack(root, lanes) {
		var timeoutHandle = root.timeoutHandle;
		-1 !== timeoutHandle && (root.timeoutHandle = -1, cancelTimeout(timeoutHandle));
		timeoutHandle = root.cancelPendingCommit;
		null !== timeoutHandle && (root.cancelPendingCommit = null, timeoutHandle());
		resetWorkInProgressStack();
		workInProgressRoot = root;
		workInProgress = timeoutHandle = createWorkInProgress(root.current, null);
		workInProgressRootRenderLanes = lanes;
		workInProgressSuspendedReason = 0;
		workInProgressThrownValue = null;
		workInProgressRootDidSkipSuspendedSiblings = !1;
		workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
		workInProgressRootDidAttachPingListener = !1;
		workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
		workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
		workInProgressRootDidIncludeRecursiveRenderUpdate = !1;
		0 !== (lanes & 8) && (lanes |= lanes & 32);
		var allEntangledLanes = root.entangledLanes;
		if (0 !== allEntangledLanes) for (root = root.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes;) {
			var index$2 = 31 - clz32(allEntangledLanes), lane = 1 << index$2;
			lanes |= root[index$2];
			allEntangledLanes &= ~lane;
		}
		entangledRenderLanes = lanes;
		finishQueueingConcurrentUpdates();
		return timeoutHandle;
	}
	function handleThrow(root, thrownValue) {
		currentlyRenderingFiber = null;
		ReactSharedInternals.H = ContextOnlyDispatcher;
		thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
		workInProgressThrownValue = thrownValue;
		null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current)));
	}
	function pushDispatcher() {
		var prevDispatcher = ReactSharedInternals.H;
		ReactSharedInternals.H = ContextOnlyDispatcher;
		return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
	}
	function pushAsyncDispatcher() {
		var prevAsyncDispatcher = ReactSharedInternals.A;
		ReactSharedInternals.A = DefaultAsyncDispatcher;
		return prevAsyncDispatcher;
	}
	function renderDidSuspendDelayIfPossible() {
		workInProgressRootExitStatus = 4;
		workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = !0);
		0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
	}
	function renderRootSync(root, lanes, shouldYieldForPrerendering) {
		var prevExecutionContext = executionContext;
		executionContext |= 2;
		var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
		if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) workInProgressTransitions = null, prepareFreshStack(root, lanes);
		lanes = !1;
		var exitStatus = workInProgressRootExitStatus;
		a: do
			try {
				if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
					var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
					switch (workInProgressSuspendedReason) {
						case 8:
							resetWorkInProgressStack();
							exitStatus = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							null === suspenseHandlerStackCursor.current && (lanes = !0);
							var reason = workInProgressSuspendedReason;
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
							if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
								exitStatus = 0;
								break a;
							}
							break;
						default: reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
					}
				}
				workLoopSync();
				exitStatus = workInProgressRootExitStatus;
				break;
			} catch (thrownValue$167) {
				handleThrow(root, thrownValue$167);
			}
		while (1);
		lanes && root.shellSuspendCounter++;
		lastContextDependency = currentlyRenderingFiber$1 = null;
		executionContext = prevExecutionContext;
		ReactSharedInternals.H = prevDispatcher;
		ReactSharedInternals.A = prevAsyncDispatcher;
		null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
		return exitStatus;
	}
	function workLoopSync() {
		for (; null !== workInProgress;) performUnitOfWork(workInProgress);
	}
	function renderRootConcurrent(root, lanes) {
		var prevExecutionContext = executionContext;
		executionContext |= 2;
		var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
		workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
		a: do
			try {
				if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
					lanes = workInProgress;
					var thrownValue = workInProgressThrownValue;
					b: switch (workInProgressSuspendedReason) {
						case 1:
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 1);
							break;
						case 2:
						case 9:
							if (isThenableResolved(thrownValue)) {
								workInProgressSuspendedReason = 0;
								workInProgressThrownValue = null;
								replaySuspendedUnitOfWork(lanes);
								break;
							}
							lanes = function() {
								2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root || (workInProgressSuspendedReason = 7);
								ensureRootIsScheduled(root);
							};
							thrownValue.then(lanes, lanes);
							break a;
						case 3:
							workInProgressSuspendedReason = 7;
							break a;
						case 4:
							workInProgressSuspendedReason = 5;
							break a;
						case 7:
							isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, lanes, thrownValue, 7));
							break;
						case 5:
							var resource = null;
							switch (workInProgress.tag) {
								case 26: resource = workInProgress.memoizedState;
								case 5:
								case 27:
									var hostFiber = workInProgress;
									if (resource ? preloadResource(resource) : 1) {
										workInProgressSuspendedReason = 0;
										workInProgressThrownValue = null;
										var sibling = hostFiber.sibling;
										if (null !== sibling) workInProgress = sibling;
										else {
											var returnFiber = hostFiber.return;
											null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
										}
										break b;
									}
							}
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 5);
							break;
						case 6:
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 6);
							break;
						case 8:
							resetWorkInProgressStack();
							workInProgressRootExitStatus = 6;
							break a;
						default: throw Error(formatProdErrorMessage(462));
					}
				}
				workLoopConcurrentByScheduler();
				break;
			} catch (thrownValue$169) {
				handleThrow(root, thrownValue$169);
			}
		while (1);
		lastContextDependency = currentlyRenderingFiber$1 = null;
		ReactSharedInternals.H = prevDispatcher;
		ReactSharedInternals.A = prevAsyncDispatcher;
		executionContext = prevExecutionContext;
		if (null !== workInProgress) return 0;
		workInProgressRoot = null;
		workInProgressRootRenderLanes = 0;
		finishQueueingConcurrentUpdates();
		return workInProgressRootExitStatus;
	}
	function workLoopConcurrentByScheduler() {
		for (; null !== workInProgress && !shouldYield();) performUnitOfWork(workInProgress);
	}
	function performUnitOfWork(unitOfWork) {
		var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
		unitOfWork.memoizedProps = unitOfWork.pendingProps;
		null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
	}
	function replaySuspendedUnitOfWork(unitOfWork) {
		var next = unitOfWork;
		var current = next.alternate;
		switch (next.tag) {
			case 15:
			case 0:
				next = replayFunctionComponent(current, next, next.pendingProps, next.type, void 0, workInProgressRootRenderLanes);
				break;
			case 11:
				next = replayFunctionComponent(current, next, next.pendingProps, next.type.render, next.ref, workInProgressRootRenderLanes);
				break;
			case 5: resetHooksOnUnwind(next);
			default: unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
		}
		unitOfWork.memoizedProps = unitOfWork.pendingProps;
		null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
	}
	function throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, suspendedReason) {
		lastContextDependency = currentlyRenderingFiber$1 = null;
		resetHooksOnUnwind(unitOfWork);
		thenableState = null;
		thenableIndexCounter = 0;
		var returnFiber = unitOfWork.return;
		try {
			if (throwException(root, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes)) {
				workInProgressRootExitStatus = 1;
				logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
				workInProgress = null;
				return;
			}
		} catch (error) {
			if (null !== returnFiber) throw workInProgress = returnFiber, error;
			workInProgressRootExitStatus = 1;
			logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
			workInProgress = null;
			return;
		}
		if (unitOfWork.flags & 32768) {
			if (isHydrating || 1 === suspendedReason) root = !0;
			else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912)) root = !1;
			else if (workInProgressRootDidSkipSuspendedSiblings = root = !0, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason) suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
			unwindUnitOfWork(unitOfWork, root);
		} else completeUnitOfWork(unitOfWork);
	}
	function completeUnitOfWork(unitOfWork) {
		var completedWork = unitOfWork;
		do {
			if (0 !== (completedWork.flags & 32768)) {
				unwindUnitOfWork(completedWork, workInProgressRootDidSkipSuspendedSiblings);
				return;
			}
			unitOfWork = completedWork.return;
			var next = completeWork(completedWork.alternate, completedWork, entangledRenderLanes);
			if (null !== next) {
				workInProgress = next;
				return;
			}
			completedWork = completedWork.sibling;
			if (null !== completedWork) {
				workInProgress = completedWork;
				return;
			}
			workInProgress = completedWork = unitOfWork;
		} while (null !== completedWork);
		0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
	}
	function unwindUnitOfWork(unitOfWork, skipSiblings) {
		do {
			var next = unwindWork(unitOfWork.alternate, unitOfWork);
			if (null !== next) {
				next.flags &= 32767;
				workInProgress = next;
				return;
			}
			next = unitOfWork.return;
			null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
			if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
				workInProgress = unitOfWork;
				return;
			}
			workInProgress = unitOfWork = next;
		} while (null !== unitOfWork);
		workInProgressRootExitStatus = 6;
		workInProgress = null;
	}
	function commitRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
		root.cancelPendingCommit = null;
		do
			flushPendingEffects();
		while (0 !== pendingEffectsStatus);
		if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
		if (null !== finishedWork) {
			if (finishedWork === root.current) throw Error(formatProdErrorMessage(177));
			didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
			didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
			markRootFinished(root, lanes, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes);
			root === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
			pendingFinishedWork = finishedWork;
			pendingEffectsRoot = root;
			pendingEffectsLanes = lanes;
			pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
			pendingPassiveTransitions = transitions;
			pendingRecoverableErrors = recoverableErrors;
			0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root.callbackNode = null, root.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
				flushPassiveEffects(!0);
				return null;
			})) : (root.callbackNode = null, root.callbackPriority = 0);
			recoverableErrors = 0 !== (finishedWork.flags & 13878);
			if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
				recoverableErrors = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				transitions = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				spawnedLane = executionContext;
				executionContext |= 4;
				try {
					commitBeforeMutationEffects(root, finishedWork, lanes);
				} finally {
					executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
				}
			}
			pendingEffectsStatus = 1;
			flushMutationEffects();
			flushLayoutEffects();
			flushSpawnedWork();
		}
	}
	function flushMutationEffects() {
		if (1 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
			if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
				rootMutationHasEffect = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				var previousPriority = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				var prevExecutionContext = executionContext;
				executionContext |= 4;
				try {
					commitMutationEffectsOnFiber(finishedWork, root);
					var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
					if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(priorFocusedElem.ownerDocument.documentElement, priorFocusedElem)) {
						if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
							var start = priorSelectionRange.start, end = priorSelectionRange.end;
							void 0 === end && (end = start);
							if ("selectionStart" in priorFocusedElem) priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(end, priorFocusedElem.value.length);
							else {
								var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
								if (win.getSelection) {
									var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
									!selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
									var startMarker = getNodeForCharacterOffset(priorFocusedElem, start$jscomp$0), endMarker = getNodeForCharacterOffset(priorFocusedElem, end$jscomp$0);
									if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
										var range = doc.createRange();
										range.setStart(startMarker.node, startMarker.offset);
										selection.removeAllRanges();
										start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
									}
								}
							}
						}
						doc = [];
						for (selection = priorFocusedElem; selection = selection.parentNode;) 1 === selection.nodeType && doc.push({
							element: selection,
							left: selection.scrollLeft,
							top: selection.scrollTop
						});
						"function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
						for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
							var info = doc[priorFocusedElem];
							info.element.scrollLeft = info.left;
							info.element.scrollTop = info.top;
						}
					}
					_enabled = !!eventsEnabled;
					selectionInformation = eventsEnabled = null;
				} finally {
					executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
				}
			}
			root.current = finishedWork;
			pendingEffectsStatus = 2;
		}
	}
	function flushLayoutEffects() {
		if (2 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
			if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
				rootHasLayoutEffect = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				var previousPriority = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				var prevExecutionContext = executionContext;
				executionContext |= 4;
				try {
					commitLayoutEffectOnFiber(root, finishedWork.alternate, finishedWork);
				} finally {
					executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
				}
			}
			pendingEffectsStatus = 3;
		}
	}
	function flushSpawnedWork() {
		if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			requestPaint();
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
			0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root, root.pendingLanes));
			var remainingLanes = root.pendingLanes;
			0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
			lanesToEventPriority(lanes);
			finishedWork = finishedWork.stateNode;
			if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot) try {
				injectedHook.onCommitFiberRoot(rendererID, finishedWork, void 0, 128 === (finishedWork.current.flags & 128));
			} catch (err) {}
			if (null !== recoverableErrors) {
				finishedWork = ReactSharedInternals.T;
				remainingLanes = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				ReactSharedInternals.T = null;
				try {
					for (var onRecoverableError = root.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
						var recoverableError = recoverableErrors[i];
						onRecoverableError(recoverableError.value, { componentStack: recoverableError.stack });
					}
				} finally {
					ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
				}
			}
			0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
			ensureRootIsScheduled(root);
			remainingLanes = root.pendingLanes;
			0 !== (lanes & 4194090) && 0 !== (remainingLanes & 42) ? root === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root) : nestedUpdateCount = 0;
			flushSyncWorkAcrossRoots_impl(0, !1);
		}
	}
	function releaseRootPooledCache(root, remainingLanes) {
		0 === (root.pooledCacheLanes &= remainingLanes) && (remainingLanes = root.pooledCache, null != remainingLanes && (root.pooledCache = null, releaseCache(remainingLanes)));
	}
	function flushPendingEffects(wasDelayedCommit) {
		flushMutationEffects();
		flushLayoutEffects();
		flushSpawnedWork();
		return flushPassiveEffects(wasDelayedCommit);
	}
	function flushPassiveEffects() {
		if (5 !== pendingEffectsStatus) return !1;
		var root = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
		pendingEffectsRemainingLanes = 0;
		var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
		try {
			ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
			ReactSharedInternals.T = null;
			renderPriority = pendingPassiveTransitions;
			pendingPassiveTransitions = null;
			var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
			pendingEffectsStatus = 0;
			pendingFinishedWork = pendingEffectsRoot = null;
			pendingEffectsLanes = 0;
			if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
			var prevExecutionContext = executionContext;
			executionContext |= 4;
			commitPassiveUnmountOnFiber(root$jscomp$0.current);
			commitPassiveMountOnFiber(root$jscomp$0, root$jscomp$0.current, lanes, renderPriority);
			executionContext = prevExecutionContext;
			flushSyncWorkAcrossRoots_impl(0, !1);
			if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot) try {
				injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
			} catch (err) {}
			return !0;
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root, remainingLanes);
		}
	}
	function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
		sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
		sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
		rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
		null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
	}
	function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
		if (3 === sourceFiber.tag) captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
		else for (; null !== nearestMountedAncestor;) {
			if (3 === nearestMountedAncestor.tag) {
				captureCommitPhaseErrorOnRoot(nearestMountedAncestor, sourceFiber, error);
				break;
			} else if (1 === nearestMountedAncestor.tag) {
				var instance = nearestMountedAncestor.stateNode;
				if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
					sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
					error = createClassErrorUpdate(2);
					instance = enqueueUpdate(nearestMountedAncestor, error, 2);
					null !== instance && (initializeClassErrorUpdate(error, instance, nearestMountedAncestor, sourceFiber), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
					break;
				}
			}
			nearestMountedAncestor = nearestMountedAncestor.return;
		}
	}
	function attachPingListener(root, wakeable, lanes) {
		var pingCache = root.pingCache;
		if (null === pingCache) {
			pingCache = root.pingCache = new PossiblyWeakMap();
			var threadIDs = /* @__PURE__ */ new Set();
			pingCache.set(wakeable, threadIDs);
		} else threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
		threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = !0, threadIDs.add(lanes), root = pingSuspendedRoot.bind(null, root, wakeable, lanes), wakeable.then(root, root));
	}
	function pingSuspendedRoot(root, wakeable, pingedLanes) {
		var pingCache = root.pingCache;
		null !== pingCache && pingCache.delete(wakeable);
		root.pingedLanes |= root.suspendedLanes & pingedLanes;
		root.warmLanes &= ~pingedLanes;
		workInProgressRoot === root && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
		ensureRootIsScheduled(root);
	}
	function retryTimedOutBoundary(boundaryFiber, retryLane) {
		0 === retryLane && (retryLane = claimNextRetryLane());
		boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
		null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
	}
	function retryDehydratedSuspenseBoundary(boundaryFiber) {
		var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
		null !== suspenseState && (retryLane = suspenseState.retryLane);
		retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function resolveRetryWakeable(boundaryFiber, wakeable) {
		var retryLane = 0;
		switch (boundaryFiber.tag) {
			case 13:
				var retryCache = boundaryFiber.stateNode;
				var suspenseState = boundaryFiber.memoizedState;
				null !== suspenseState && (retryLane = suspenseState.retryLane);
				break;
			case 19:
				retryCache = boundaryFiber.stateNode;
				break;
			case 22:
				retryCache = boundaryFiber.stateNode._retryCache;
				break;
			default: throw Error(formatProdErrorMessage(314));
		}
		null !== retryCache && retryCache.delete(wakeable);
		retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function scheduleCallback$1(priorityLevel, callback) {
		return scheduleCallback$3(priorityLevel, callback);
	}
	var firstScheduledRoot = null;
	var lastScheduledRoot = null;
	var didScheduleMicrotask = !1;
	var mightHavePendingSyncWork = !1;
	var isFlushingWork = !1;
	var currentEventTransitionLane = 0;
	function ensureRootIsScheduled(root) {
		root !== lastScheduledRoot && null === root.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root : lastScheduledRoot = lastScheduledRoot.next = root);
		mightHavePendingSyncWork = !0;
		didScheduleMicrotask || (didScheduleMicrotask = !0, scheduleImmediateRootScheduleTask());
	}
	function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
		if (!isFlushingWork && mightHavePendingSyncWork) {
			isFlushingWork = !0;
			do {
				var didPerformSomeWork = !1;
				for (var root$174 = firstScheduledRoot; null !== root$174;) {
					if (!onlyLegacy) if (0 !== syncTransitionLanes) {
						var pendingLanes = root$174.pendingLanes;
						if (0 === pendingLanes) var JSCompiler_inline_result = 0;
						else {
							var suspendedLanes = root$174.suspendedLanes, pingedLanes = root$174.pingedLanes;
							JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
							JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
							JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
						}
						0 !== JSCompiler_inline_result && (didPerformSomeWork = !0, performSyncWorkOnRoot(root$174, JSCompiler_inline_result));
					} else JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(root$174, root$174 === workInProgressRoot ? JSCompiler_inline_result : 0, null !== root$174.cancelPendingCommit || -1 !== root$174.timeoutHandle), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$174, JSCompiler_inline_result) || (didPerformSomeWork = !0, performSyncWorkOnRoot(root$174, JSCompiler_inline_result));
					root$174 = root$174.next;
				}
			} while (didPerformSomeWork);
			isFlushingWork = !1;
		}
	}
	function processRootScheduleInImmediateTask() {
		processRootScheduleInMicrotask();
	}
	function processRootScheduleInMicrotask() {
		mightHavePendingSyncWork = didScheduleMicrotask = !1;
		var syncTransitionLanes = 0;
		0 !== currentEventTransitionLane && (shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane), currentEventTransitionLane = 0);
		for (var currentTime = now(), prev = null, root = firstScheduledRoot; null !== root;) {
			var next = root.next, nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
			if (0 === nextLanes) root.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
			else if (prev = root, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3)) mightHavePendingSyncWork = !0;
			root = next;
		}
		flushSyncWorkAcrossRoots_impl(syncTransitionLanes, !1);
	}
	function scheduleTaskForRootDuringMicrotask(root, currentTime) {
		for (var suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes, expirationTimes = root.expirationTimes, lanes = root.pendingLanes & -62914561; 0 < lanes;) {
			var index$3 = 31 - clz32(lanes), lane = 1 << index$3, expirationTime = expirationTimes[index$3];
			if (-1 === expirationTime) {
				if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes)) expirationTimes[index$3] = computeExpirationTime(lane, currentTime);
			} else expirationTime <= currentTime && (root.expiredLanes |= lane);
			lanes &= ~lane;
		}
		currentTime = workInProgressRoot;
		suspendedLanes = workInProgressRootRenderLanes;
		suspendedLanes = getNextLanes(root, root === currentTime ? suspendedLanes : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
		pingedLanes = root.callbackNode;
		if (0 === suspendedLanes || root === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root.callbackNode = null, root.callbackPriority = 0;
		if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root, suspendedLanes)) {
			currentTime = suspendedLanes & -suspendedLanes;
			if (currentTime === root.callbackPriority) return currentTime;
			null !== pingedLanes && cancelCallback$1(pingedLanes);
			switch (lanesToEventPriority(suspendedLanes)) {
				case 2:
				case 8:
					suspendedLanes = UserBlockingPriority;
					break;
				case 32:
					suspendedLanes = NormalPriority$1;
					break;
				case 268435456:
					suspendedLanes = IdlePriority;
					break;
				default: suspendedLanes = NormalPriority$1;
			}
			pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root);
			suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
			root.callbackPriority = currentTime;
			root.callbackNode = suspendedLanes;
			return currentTime;
		}
		null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
		root.callbackPriority = 2;
		root.callbackNode = null;
		return 2;
	}
	function performWorkOnRootViaSchedulerTask(root, didTimeout) {
		if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus) return root.callbackNode = null, root.callbackPriority = 0, null;
		var originalCallbackNode = root.callbackNode;
		if (flushPendingEffects(!0) && root.callbackNode !== originalCallbackNode) return null;
		var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
		workInProgressRootRenderLanes$jscomp$0 = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
		if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
		performWorkOnRoot(root, workInProgressRootRenderLanes$jscomp$0, didTimeout);
		scheduleTaskForRootDuringMicrotask(root, now());
		return null != root.callbackNode && root.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root) : null;
	}
	function performSyncWorkOnRoot(root, lanes) {
		if (flushPendingEffects()) return null;
		performWorkOnRoot(root, lanes, !0);
	}
	function scheduleImmediateRootScheduleTask() {
		scheduleMicrotask(function() {
			0 !== (executionContext & 6) ? scheduleCallback$3(ImmediatePriority, processRootScheduleInImmediateTask) : processRootScheduleInMicrotask();
		});
	}
	function requestTransitionLane() {
		0 === currentEventTransitionLane && (currentEventTransitionLane = claimNextTransitionLane());
		return currentEventTransitionLane;
	}
	function coerceFormActionProp(actionProp) {
		return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
	}
	function createFormDataWithSubmitter(form, submitter) {
		var temp = submitter.ownerDocument.createElement("input");
		temp.name = submitter.name;
		temp.value = submitter.value;
		form.id && temp.setAttribute("form", form.id);
		submitter.parentNode.insertBefore(temp, submitter);
		form = new FormData(form);
		temp.parentNode.removeChild(temp);
		return form;
	}
	function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
		if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
			var action = coerceFormActionProp((nativeEventTarget[internalPropsKey] || null).action), submitter = nativeEvent.submitter;
			submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
			var event = new SyntheticEvent("action", "action", null, nativeEvent, nativeEventTarget);
			dispatchQueue.push({
				event,
				listeners: [{
					instance: null,
					listener: function() {
						if (nativeEvent.defaultPrevented) {
							if (0 !== currentEventTransitionLane) {
								var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
								startHostTransition(maybeTargetInst, {
									pending: !0,
									data: formData,
									method: nativeEventTarget.method,
									action
								}, null, formData);
							}
						} else "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(maybeTargetInst, {
							pending: !0,
							data: formData,
							method: nativeEventTarget.method,
							action
						}, action, formData));
					},
					currentTarget: nativeEventTarget
				}]
			});
		}
	}
	for (var i$jscomp$inline_1528 = 0; i$jscomp$inline_1528 < simpleEventPluginEvents.length; i$jscomp$inline_1528++) {
		var eventName$jscomp$inline_1529 = simpleEventPluginEvents[i$jscomp$inline_1528];
		registerSimpleEvent(eventName$jscomp$inline_1529.toLowerCase(), "on" + (eventName$jscomp$inline_1529[0].toUpperCase() + eventName$jscomp$inline_1529.slice(1)));
	}
	registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
	registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
	registerSimpleEvent(ANIMATION_START, "onAnimationStart");
	registerSimpleEvent("dblclick", "onDoubleClick");
	registerSimpleEvent("focusin", "onFocus");
	registerSimpleEvent("focusout", "onBlur");
	registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
	registerSimpleEvent(TRANSITION_START, "onTransitionStart");
	registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
	registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
	registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
	registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
	registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
	registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
	registerTwoPhaseEvent("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
	registerTwoPhaseEvent("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
	registerTwoPhaseEvent("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]);
	registerTwoPhaseEvent("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
	registerTwoPhaseEvent("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
	registerTwoPhaseEvent("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
	var nonDelegatedEvents = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes));
	function processDispatchQueue(dispatchQueue, eventSystemFlags) {
		eventSystemFlags = 0 !== (eventSystemFlags & 4);
		for (var i = 0; i < dispatchQueue.length; i++) {
			var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
			_dispatchQueue$i = _dispatchQueue$i.listeners;
			a: {
				var previousInstance = void 0;
				if (eventSystemFlags) for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
					var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
					_dispatchListeners$i = _dispatchListeners$i.listener;
					if (instance !== previousInstance && event.isPropagationStopped()) break a;
					previousInstance = _dispatchListeners$i;
					event.currentTarget = currentTarget;
					try {
						previousInstance(event);
					} catch (error) {
						reportGlobalError(error);
					}
					event.currentTarget = null;
					previousInstance = instance;
				}
				else for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
					_dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
					instance = _dispatchListeners$i.instance;
					currentTarget = _dispatchListeners$i.currentTarget;
					_dispatchListeners$i = _dispatchListeners$i.listener;
					if (instance !== previousInstance && event.isPropagationStopped()) break a;
					previousInstance = _dispatchListeners$i;
					event.currentTarget = currentTarget;
					try {
						previousInstance(event);
					} catch (error) {
						reportGlobalError(error);
					}
					event.currentTarget = null;
					previousInstance = instance;
				}
			}
		}
	}
	function listenToNonDelegatedEvent(domEventName, targetElement) {
		var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
		void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
		var listenerSetKey = domEventName + "__bubble";
		JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, !1), JSCompiler_inline_result.add(listenerSetKey));
	}
	function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
		var eventSystemFlags = 0;
		isCapturePhaseListener && (eventSystemFlags |= 4);
		addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
	}
	var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
	function listenToAllSupportedEvents(rootContainerElement) {
		if (!rootContainerElement[listeningMarker]) {
			rootContainerElement[listeningMarker] = !0;
			allNativeEvents.forEach(function(domEventName) {
				"selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, !1, rootContainerElement), listenToNativeEvent(domEventName, !0, rootContainerElement));
			});
			var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
			null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = !0, listenToNativeEvent("selectionchange", !1, ownerDocument));
		}
	}
	function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
		switch (getEventPriority(domEventName)) {
			case 2:
				var listenerWrapper = dispatchDiscreteEvent;
				break;
			case 8:
				listenerWrapper = dispatchContinuousEvent;
				break;
			default: listenerWrapper = dispatchEvent;
		}
		eventSystemFlags = listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
		listenerWrapper = void 0;
		!passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = !0);
		isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
			capture: !0,
			passive: listenerWrapper
		}) : targetContainer.addEventListener(domEventName, eventSystemFlags, !0) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, { passive: listenerWrapper }) : targetContainer.addEventListener(domEventName, eventSystemFlags, !1);
	}
	function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
		var ancestorInst = targetInst$jscomp$0;
		if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0) a: for (;;) {
			if (null === targetInst$jscomp$0) return;
			var nodeTag = targetInst$jscomp$0.tag;
			if (3 === nodeTag || 4 === nodeTag) {
				var container = targetInst$jscomp$0.stateNode.containerInfo;
				if (container === targetContainer) break;
				if (4 === nodeTag) for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag;) {
					var grandTag = nodeTag.tag;
					if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer) return;
					nodeTag = nodeTag.return;
				}
				for (; null !== container;) {
					nodeTag = getClosestInstanceFromNode(container);
					if (null === nodeTag) return;
					grandTag = nodeTag.tag;
					if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
						targetInst$jscomp$0 = ancestorInst = nodeTag;
						continue a;
					}
					container = container.parentNode;
				}
			}
			targetInst$jscomp$0 = targetInst$jscomp$0.return;
		}
		batchedUpdates$1(function() {
			var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
			a: {
				var reactName = topLevelEventsToReactNames.get(domEventName);
				if (void 0 !== reactName) {
					var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
					switch (domEventName) {
						case "keypress": if (0 === getEventCharCode(nativeEvent)) break a;
						case "keydown":
						case "keyup":
							SyntheticEventCtor = SyntheticKeyboardEvent;
							break;
						case "focusin":
							reactEventType = "focus";
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "focusout":
							reactEventType = "blur";
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "beforeblur":
						case "afterblur":
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "click": if (2 === nativeEvent.button) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							SyntheticEventCtor = SyntheticMouseEvent;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							SyntheticEventCtor = SyntheticDragEvent;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							SyntheticEventCtor = SyntheticTouchEvent;
							break;
						case ANIMATION_END:
						case ANIMATION_ITERATION:
						case ANIMATION_START:
							SyntheticEventCtor = SyntheticAnimationEvent;
							break;
						case TRANSITION_END:
							SyntheticEventCtor = SyntheticTransitionEvent;
							break;
						case "scroll":
						case "scrollend":
							SyntheticEventCtor = SyntheticUIEvent;
							break;
						case "wheel":
							SyntheticEventCtor = SyntheticWheelEvent;
							break;
						case "copy":
						case "cut":
						case "paste":
							SyntheticEventCtor = SyntheticClipboardEvent;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							SyntheticEventCtor = SyntheticPointerEvent;
							break;
						case "toggle":
						case "beforetoggle": SyntheticEventCtor = SyntheticToggleEvent;
					}
					var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
					inCapturePhase = [];
					for (var instance = targetInst, lastHostComponent; null !== instance;) {
						var _instance = instance;
						lastHostComponent = _instance.stateNode;
						_instance = _instance.tag;
						5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(createDispatchListener(instance, _instance, lastHostComponent)));
						if (accumulateTargetOnly) break;
						instance = instance.return;
					}
					0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
						event: reactName,
						listeners: inCapturePhase
					}));
				}
			}
			if (0 === (eventSystemFlags & 7)) {
				a: {
					reactName = "mouseover" === domEventName || "pointerover" === domEventName;
					SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
					if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey])) break a;
					if (SyntheticEventCtor || reactName) {
						reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
						if (SyntheticEventCtor) {
							if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase)) reactEventType = null;
						} else SyntheticEventCtor = null, reactEventType = targetInst;
						if (SyntheticEventCtor !== reactEventType) {
							inCapturePhase = SyntheticMouseEvent;
							_instance = "onMouseLeave";
							reactEventName = "onMouseEnter";
							instance = "mouse";
							if ("pointerout" === domEventName || "pointerover" === domEventName) inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
							accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
							lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
							reactName = new inCapturePhase(_instance, instance + "leave", SyntheticEventCtor, nativeEvent, nativeEventTarget);
							reactName.target = accumulateTargetOnly;
							reactName.relatedTarget = lastHostComponent;
							_instance = null;
							getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(reactEventName, instance + "enter", reactEventType, nativeEvent, nativeEventTarget), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
							accumulateTargetOnly = _instance;
							if (SyntheticEventCtor && reactEventType) b: {
								inCapturePhase = SyntheticEventCtor;
								reactEventName = reactEventType;
								instance = 0;
								for (lastHostComponent = inCapturePhase; lastHostComponent; lastHostComponent = getParent(lastHostComponent)) instance++;
								lastHostComponent = 0;
								for (_instance = reactEventName; _instance; _instance = getParent(_instance)) lastHostComponent++;
								for (; 0 < instance - lastHostComponent;) inCapturePhase = getParent(inCapturePhase), instance--;
								for (; 0 < lastHostComponent - instance;) reactEventName = getParent(reactEventName), lastHostComponent--;
								for (; instance--;) {
									if (inCapturePhase === reactEventName || null !== reactEventName && inCapturePhase === reactEventName.alternate) break b;
									inCapturePhase = getParent(inCapturePhase);
									reactEventName = getParent(reactEventName);
								}
								inCapturePhase = null;
							}
							else inCapturePhase = null;
							null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(dispatchQueue, reactName, SyntheticEventCtor, inCapturePhase, !1);
							null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(dispatchQueue, accumulateTargetOnly, reactEventType, inCapturePhase, !0);
						}
					}
				}
				a: {
					reactName = targetInst ? getNodeFromInstance(targetInst) : window;
					SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
					if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type) var getTargetInstFunc = getTargetInstForChangeEvent;
					else if (isTextInputElement(reactName)) if (isInputEventSupported) getTargetInstFunc = getTargetInstForInputOrChangeEvent;
					else {
						getTargetInstFunc = getTargetInstForInputEventPolyfill;
						var handleEventFunc = handleEventsForInputEventPolyfill;
					}
					else SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
					if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
						createAndAccumulateChangeEvent(dispatchQueue, getTargetInstFunc, nativeEvent, nativeEventTarget);
						break a;
					}
					handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
					"focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
				}
				handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
				switch (domEventName) {
					case "focusin":
						if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable) activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
						break;
					case "focusout":
						lastSelection = activeElementInst = activeElement = null;
						break;
					case "mousedown":
						mouseDown = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						mouseDown = !1;
						constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
						break;
					case "selectionchange": if (skipSelectionChangeEvent) break;
					case "keydown":
					case "keyup": constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
				}
				var fallbackData;
				if (canUseCompositionEvent) b: {
					switch (domEventName) {
						case "compositionstart":
							var eventType = "onCompositionStart";
							break b;
						case "compositionend":
							eventType = "onCompositionEnd";
							break b;
						case "compositionupdate":
							eventType = "onCompositionUpdate";
							break b;
					}
					eventType = void 0;
				}
				else isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
				eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = !0)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
					event: eventType,
					listeners: handleEventFunc
				}), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
				if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent)) eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
					event: handleEventFunc,
					listeners: eventType
				}), handleEventFunc.data = fallbackData);
				extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
			}
			processDispatchQueue(dispatchQueue, eventSystemFlags);
		});
	}
	function createDispatchListener(instance, listener, currentTarget) {
		return {
			instance,
			listener,
			currentTarget
		};
	}
	function accumulateTwoPhaseListeners(targetFiber, reactName) {
		for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber;) {
			var _instance2 = targetFiber, stateNode = _instance2.stateNode;
			_instance2 = _instance2.tag;
			5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(createDispatchListener(targetFiber, _instance2, stateNode)), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(createDispatchListener(targetFiber, _instance2, stateNode)));
			if (3 === targetFiber.tag) return listeners;
			targetFiber = targetFiber.return;
		}
		return [];
	}
	function getParent(inst) {
		if (null === inst) return null;
		do
			inst = inst.return;
		while (inst && 5 !== inst.tag && 27 !== inst.tag);
		return inst ? inst : null;
	}
	function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
		for (var registrationName = event._reactName, listeners = []; null !== target && target !== common;) {
			var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
			_instance3 = _instance3.tag;
			if (null !== alternate && alternate === common) break;
			5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(createDispatchListener(target, stateNode, alternate))) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(createDispatchListener(target, stateNode, alternate))));
			target = target.return;
		}
		0 !== listeners.length && dispatchQueue.push({
			event,
			listeners
		});
	}
	var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
	var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
	function normalizeMarkupForTextOrAttribute(markup) {
		return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
	}
	function checkForUnmatchedText(serverText, clientText) {
		clientText = normalizeMarkupForTextOrAttribute(clientText);
		return normalizeMarkupForTextOrAttribute(serverText) === clientText ? !0 : !1;
	}
	function noop$1() {}
	function setProp(domElement, tag, key, value, props, prevValue) {
		switch (key) {
			case "children":
				"string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
				break;
			case "className":
				setValueForKnownAttribute(domElement, "class", value);
				break;
			case "tabIndex":
				setValueForKnownAttribute(domElement, "tabindex", value);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				setValueForKnownAttribute(domElement, key, value);
				break;
			case "style":
				setValueForStyles(domElement, value, prevValue);
				break;
			case "data": if ("object" !== tag) {
				setValueForKnownAttribute(domElement, "data", value);
				break;
			}
			case "src":
			case "href":
				if ("" === value && ("a" !== tag || "href" !== key)) {
					domElement.removeAttribute(key);
					break;
				}
				if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
					domElement.removeAttribute(key);
					break;
				}
				value = sanitizeURL("" + value);
				domElement.setAttribute(key, value);
				break;
			case "action":
			case "formAction":
				if ("function" === typeof value) {
					domElement.setAttribute(key, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(domElement, tag, "formEncType", props.formEncType, props, null), setProp(domElement, tag, "formMethod", props.formMethod, props, null), setProp(domElement, tag, "formTarget", props.formTarget, props, null)) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
				if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
					domElement.removeAttribute(key);
					break;
				}
				value = sanitizeURL("" + value);
				domElement.setAttribute(key, value);
				break;
			case "onClick":
				null != value && (domElement.onclick = noop$1);
				break;
			case "onScroll":
				null != value && listenToNonDelegatedEvent("scroll", domElement);
				break;
			case "onScrollEnd":
				null != value && listenToNonDelegatedEvent("scrollend", domElement);
				break;
			case "dangerouslySetInnerHTML":
				if (null != value) {
					if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
					key = value.__html;
					if (null != key) {
						if (null != props.children) throw Error(formatProdErrorMessage(60));
						domElement.innerHTML = key;
					}
				}
				break;
			case "multiple":
				domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
				break;
			case "muted":
				domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
					domElement.removeAttribute("xlink:href");
					break;
				}
				key = sanitizeURL("" + value);
				domElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", key);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
				break;
			case "capture":
			case "download":
				!0 === value ? domElement.setAttribute(key, "") : !1 !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
				break;
			case "rowSpan":
			case "start":
				null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
				break;
			case "popover":
				listenToNonDelegatedEvent("beforetoggle", domElement);
				listenToNonDelegatedEvent("toggle", domElement);
				setValueForAttribute(domElement, "popover", value);
				break;
			case "xlinkActuate":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:actuate", value);
				break;
			case "xlinkArcrole":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:arcrole", value);
				break;
			case "xlinkRole":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:role", value);
				break;
			case "xlinkShow":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:show", value);
				break;
			case "xlinkTitle":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:title", value);
				break;
			case "xlinkType":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:type", value);
				break;
			case "xmlBase":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:base", value);
				break;
			case "xmlLang":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:lang", value);
				break;
			case "xmlSpace":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:space", value);
				break;
			case "is":
				setValueForAttribute(domElement, "is", value);
				break;
			case "innerText":
			case "textContent": break;
			default: if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1]) key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
		}
	}
	function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
		switch (key) {
			case "style":
				setValueForStyles(domElement, value, prevValue);
				break;
			case "dangerouslySetInnerHTML":
				if (null != value) {
					if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
					key = value.__html;
					if (null != key) {
						if (null != props.children) throw Error(formatProdErrorMessage(60));
						domElement.innerHTML = key;
					}
				}
				break;
			case "children":
				"string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
				break;
			case "onScroll":
				null != value && listenToNonDelegatedEvent("scroll", domElement);
				break;
			case "onScrollEnd":
				null != value && listenToNonDelegatedEvent("scrollend", domElement);
				break;
			case "onClick":
				null != value && (domElement.onclick = noop$1);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!registrationNameDependencies.hasOwnProperty(key)) a: {
				if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
					"function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
					domElement.addEventListener(tag, value, props);
					break a;
				}
				key in domElement ? domElement[key] = value : !0 === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
			}
		}
	}
	function setInitialProperties(domElement, tag, props) {
		switch (tag) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				listenToNonDelegatedEvent("error", domElement);
				listenToNonDelegatedEvent("load", domElement);
				var hasSrc = !1, hasSrcSet = !1, propKey;
				for (propKey in props) if (props.hasOwnProperty(propKey)) {
					var propValue = props[propKey];
					if (null != propValue) switch (propKey) {
						case "src":
							hasSrc = !0;
							break;
						case "srcSet":
							hasSrcSet = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(137, tag));
						default: setProp(domElement, tag, propKey, propValue, props, null);
					}
				}
				hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
				hasSrc && setProp(domElement, tag, "src", props.src, props, null);
				return;
			case "input":
				listenToNonDelegatedEvent("invalid", domElement);
				var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
				for (hasSrc in props) if (props.hasOwnProperty(hasSrc)) {
					var propValue$188 = props[hasSrc];
					if (null != propValue$188) switch (hasSrc) {
						case "name":
							hasSrcSet = propValue$188;
							break;
						case "type":
							propValue = propValue$188;
							break;
						case "checked":
							checked = propValue$188;
							break;
						case "defaultChecked":
							defaultChecked = propValue$188;
							break;
						case "value":
							propKey = propValue$188;
							break;
						case "defaultValue":
							defaultValue = propValue$188;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (null != propValue$188) throw Error(formatProdErrorMessage(137, tag));
							break;
						default: setProp(domElement, tag, hasSrc, propValue$188, props, null);
					}
				}
				initInput(domElement, propKey, defaultValue, checked, defaultChecked, propValue, hasSrcSet, !1);
				track(domElement);
				return;
			case "select":
				listenToNonDelegatedEvent("invalid", domElement);
				hasSrc = propValue = propKey = null;
				for (hasSrcSet in props) if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue)) switch (hasSrcSet) {
					case "value":
						propKey = defaultValue;
						break;
					case "defaultValue":
						propValue = defaultValue;
						break;
					case "multiple": hasSrc = defaultValue;
					default: setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
				}
				tag = propKey;
				props = propValue;
				domElement.multiple = !!hasSrc;
				null != tag ? updateOptions(domElement, !!hasSrc, tag, !1) : null != props && updateOptions(domElement, !!hasSrc, props, !0);
				return;
			case "textarea":
				listenToNonDelegatedEvent("invalid", domElement);
				propKey = hasSrcSet = hasSrc = null;
				for (propValue in props) if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue)) switch (propValue) {
					case "value":
						hasSrc = defaultValue;
						break;
					case "defaultValue":
						hasSrcSet = defaultValue;
						break;
					case "children":
						propKey = defaultValue;
						break;
					case "dangerouslySetInnerHTML":
						if (null != defaultValue) throw Error(formatProdErrorMessage(91));
						break;
					default: setProp(domElement, tag, propValue, defaultValue, props, null);
				}
				initTextarea(domElement, hasSrc, hasSrcSet, propKey);
				track(domElement);
				return;
			case "option":
				for (checked in props) if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc)) switch (checked) {
					case "selected":
						domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
						break;
					default: setProp(domElement, tag, checked, hasSrc, props, null);
				}
				return;
			case "dialog":
				listenToNonDelegatedEvent("beforetoggle", domElement);
				listenToNonDelegatedEvent("toggle", domElement);
				listenToNonDelegatedEvent("cancel", domElement);
				listenToNonDelegatedEvent("close", domElement);
				break;
			case "iframe":
			case "object":
				listenToNonDelegatedEvent("load", domElement);
				break;
			case "video":
			case "audio":
				for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++) listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
				break;
			case "image":
				listenToNonDelegatedEvent("error", domElement);
				listenToNonDelegatedEvent("load", domElement);
				break;
			case "details":
				listenToNonDelegatedEvent("toggle", domElement);
				break;
			case "embed":
			case "source":
			case "link": listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (defaultChecked in props) if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc)) switch (defaultChecked) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(137, tag));
					default: setProp(domElement, tag, defaultChecked, hasSrc, props, null);
				}
				return;
			default: if (isCustomElement(tag)) {
				for (propValue$188 in props) props.hasOwnProperty(propValue$188) && (hasSrc = props[propValue$188], void 0 !== hasSrc && setPropOnCustomElement(domElement, tag, propValue$188, hasSrc, props, void 0));
				return;
			}
		}
		for (defaultValue in props) props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
	}
	function updateProperties(domElement, tag, lastProps, nextProps) {
		switch (tag) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
				for (propKey in lastProps) {
					var lastProp = lastProps[propKey];
					if (lastProps.hasOwnProperty(propKey) && null != lastProp) switch (propKey) {
						case "checked": break;
						case "value": break;
						case "defaultValue": lastDefaultValue = lastProp;
						default: nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
					}
				}
				for (var propKey$205 in nextProps) {
					var propKey = nextProps[propKey$205];
					lastProp = lastProps[propKey$205];
					if (nextProps.hasOwnProperty(propKey$205) && (null != propKey || null != lastProp)) switch (propKey$205) {
						case "type":
							type = propKey;
							break;
						case "name":
							name = propKey;
							break;
						case "checked":
							checked = propKey;
							break;
						case "defaultChecked":
							defaultChecked = propKey;
							break;
						case "value":
							value = propKey;
							break;
						case "defaultValue":
							defaultValue = propKey;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (null != propKey) throw Error(formatProdErrorMessage(137, tag));
							break;
						default: propKey !== lastProp && setProp(domElement, tag, propKey$205, propKey, nextProps, lastProp);
					}
				}
				updateInput(domElement, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name);
				return;
			case "select":
				propKey = value = defaultValue = propKey$205 = null;
				for (type in lastProps) if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue) switch (type) {
					case "value": break;
					case "multiple": propKey = lastDefaultValue;
					default: nextProps.hasOwnProperty(type) || setProp(domElement, tag, type, null, nextProps, lastDefaultValue);
				}
				for (name in nextProps) if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue)) switch (name) {
					case "value":
						propKey$205 = type;
						break;
					case "defaultValue":
						defaultValue = type;
						break;
					case "multiple": value = type;
					default: type !== lastDefaultValue && setProp(domElement, tag, name, type, nextProps, lastDefaultValue);
				}
				tag = defaultValue;
				lastProps = value;
				nextProps = propKey;
				null != propKey$205 ? updateOptions(domElement, !!lastProps, propKey$205, !1) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, !0) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", !1));
				return;
			case "textarea":
				propKey = propKey$205 = null;
				for (defaultValue in lastProps) if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue)) switch (defaultValue) {
					case "value": break;
					case "children": break;
					default: setProp(domElement, tag, defaultValue, null, nextProps, name);
				}
				for (value in nextProps) if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type)) switch (value) {
					case "value":
						propKey$205 = name;
						break;
					case "defaultValue":
						propKey = name;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (null != name) throw Error(formatProdErrorMessage(91));
						break;
					default: name !== type && setProp(domElement, tag, value, name, nextProps, type);
				}
				updateTextarea(domElement, propKey$205, propKey);
				return;
			case "option":
				for (var propKey$221 in lastProps) if (propKey$205 = lastProps[propKey$221], lastProps.hasOwnProperty(propKey$221) && null != propKey$205 && !nextProps.hasOwnProperty(propKey$221)) switch (propKey$221) {
					case "selected":
						domElement.selected = !1;
						break;
					default: setProp(domElement, tag, propKey$221, null, nextProps, propKey$205);
				}
				for (lastDefaultValue in nextProps) if (propKey$205 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$205 !== propKey && (null != propKey$205 || null != propKey)) switch (lastDefaultValue) {
					case "selected":
						domElement.selected = propKey$205 && "function" !== typeof propKey$205 && "symbol" !== typeof propKey$205;
						break;
					default: setProp(domElement, tag, lastDefaultValue, propKey$205, nextProps, propKey);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var propKey$226 in lastProps) propKey$205 = lastProps[propKey$226], lastProps.hasOwnProperty(propKey$226) && null != propKey$205 && !nextProps.hasOwnProperty(propKey$226) && setProp(domElement, tag, propKey$226, null, nextProps, propKey$205);
				for (checked in nextProps) if (propKey$205 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$205 !== propKey && (null != propKey$205 || null != propKey)) switch (checked) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (null != propKey$205) throw Error(formatProdErrorMessage(137, tag));
						break;
					default: setProp(domElement, tag, checked, propKey$205, nextProps, propKey);
				}
				return;
			default: if (isCustomElement(tag)) {
				for (var propKey$231 in lastProps) propKey$205 = lastProps[propKey$231], lastProps.hasOwnProperty(propKey$231) && void 0 !== propKey$205 && !nextProps.hasOwnProperty(propKey$231) && setPropOnCustomElement(domElement, tag, propKey$231, void 0, nextProps, propKey$205);
				for (defaultChecked in nextProps) propKey$205 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$205 === propKey || void 0 === propKey$205 && void 0 === propKey || setPropOnCustomElement(domElement, tag, defaultChecked, propKey$205, nextProps, propKey);
				return;
			}
		}
		for (var propKey$236 in lastProps) propKey$205 = lastProps[propKey$236], lastProps.hasOwnProperty(propKey$236) && null != propKey$205 && !nextProps.hasOwnProperty(propKey$236) && setProp(domElement, tag, propKey$236, null, nextProps, propKey$205);
		for (lastProp in nextProps) propKey$205 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$205 === propKey || null == propKey$205 && null == propKey || setProp(domElement, tag, lastProp, propKey$205, nextProps, propKey);
	}
	var eventsEnabled = null;
	var selectionInformation = null;
	function getOwnerDocumentFromRootContainer(rootContainerElement) {
		return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
	}
	function getOwnHostContext(namespaceURI) {
		switch (namespaceURI) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function getChildHostContextProd(parentNamespace, type) {
		if (0 === parentNamespace) switch (type) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
	}
	function shouldSetTextContent(type, props) {
		return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
	}
	var currentPopstateTransitionEvent = null;
	function shouldAttemptEagerTransition() {
		var event = window.event;
		if (event && "popstate" === event.type) {
			if (event === currentPopstateTransitionEvent) return !1;
			currentPopstateTransitionEvent = event;
			return !0;
		}
		currentPopstateTransitionEvent = null;
		return !1;
	}
	var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0;
	var cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0;
	var localPromise = "function" === typeof Promise ? Promise : void 0;
	var scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
		return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
	} : scheduleTimeout;
	function handleErrorInNextTick(error) {
		setTimeout(function() {
			throw error;
		});
	}
	function isSingletonScope(type) {
		return "head" === type;
	}
	function clearSuspenseBoundary(parentInstance, suspenseInstance) {
		var node = suspenseInstance, possiblePreambleContribution = 0, depth = 0;
		do {
			var nextNode = node.nextSibling;
			parentInstance.removeChild(node);
			if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node) {
				if (0 < possiblePreambleContribution && 8 > possiblePreambleContribution) {
					node = possiblePreambleContribution;
					var ownerDocument = parentInstance.ownerDocument;
					node & 1 && releaseSingletonInstance(ownerDocument.documentElement);
					node & 2 && releaseSingletonInstance(ownerDocument.body);
					if (node & 4) for (node = ownerDocument.head, releaseSingletonInstance(node), ownerDocument = node.firstChild; ownerDocument;) {
						var nextNode$jscomp$0 = ownerDocument.nextSibling, nodeName = ownerDocument.nodeName;
						ownerDocument[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === ownerDocument.rel.toLowerCase() || node.removeChild(ownerDocument);
						ownerDocument = nextNode$jscomp$0;
					}
				}
				if (0 === depth) {
					parentInstance.removeChild(nextNode);
					retryIfBlockedOn(suspenseInstance);
					return;
				}
				depth--;
			} else "$" === node || "$?" === node || "$!" === node ? depth++ : possiblePreambleContribution = node.charCodeAt(0) - 48;
			else possiblePreambleContribution = 0;
			node = nextNode;
		} while (node);
		retryIfBlockedOn(suspenseInstance);
	}
	function clearContainerSparingly(container) {
		var nextNode = container.firstChild;
		nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
		for (; nextNode;) {
			var node = nextNode;
			nextNode = nextNode.nextSibling;
			switch (node.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					clearContainerSparingly(node);
					detachDeletedInstance(node);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if ("stylesheet" === node.rel.toLowerCase()) continue;
			}
			container.removeChild(node);
		}
	}
	function canHydrateInstance(instance, type, props, inRootOrSingleton) {
		for (; 1 === instance.nodeType;) {
			var anyProps = props;
			if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
				if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type)) break;
			} else if (!inRootOrSingleton) if ("input" === type && "hidden" === instance.type) {
				var name = null == anyProps.name ? null : "" + anyProps.name;
				if ("hidden" === anyProps.type && instance.getAttribute("name") === name) return instance;
			} else return instance;
			else if (!instance[internalHoistableMarker]) switch (type) {
				case "meta":
					if (!instance.hasAttribute("itemprop")) break;
					return instance;
				case "link":
					name = instance.getAttribute("rel");
					if ("stylesheet" === name && instance.hasAttribute("data-precedence")) break;
					else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title)) break;
					return instance;
				case "style":
					if (instance.hasAttribute("data-precedence")) break;
					return instance;
				case "script":
					name = instance.getAttribute("src");
					if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop")) break;
					return instance;
				default: return instance;
			}
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) break;
		}
		return null;
	}
	function canHydrateTextInstance(instance, text, inRootOrSingleton) {
		if ("" === text) return null;
		for (; 3 !== instance.nodeType;) {
			if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) return null;
		}
		return instance;
	}
	function isSuspenseInstanceFallback(instance) {
		return "$!" === instance.data || "$?" === instance.data && "complete" === instance.ownerDocument.readyState;
	}
	function registerSuspenseInstanceRetry(instance, callback) {
		var ownerDocument = instance.ownerDocument;
		if ("$?" !== instance.data || "complete" === ownerDocument.readyState) callback();
		else {
			var listener = function() {
				callback();
				ownerDocument.removeEventListener("DOMContentLoaded", listener);
			};
			ownerDocument.addEventListener("DOMContentLoaded", listener);
			instance._reactRetry = listener;
		}
	}
	function getNextHydratable(node) {
		for (; null != node; node = node.nextSibling) {
			var nodeType = node.nodeType;
			if (1 === nodeType || 3 === nodeType) break;
			if (8 === nodeType) {
				nodeType = node.data;
				if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "F!" === nodeType || "F" === nodeType) break;
				if ("/$" === nodeType) return null;
			}
		}
		return node;
	}
	var previousHydratableOnEnteringScopedSingleton = null;
	function getParentSuspenseInstance(targetInstance) {
		targetInstance = targetInstance.previousSibling;
		for (var depth = 0; targetInstance;) {
			if (8 === targetInstance.nodeType) {
				var data = targetInstance.data;
				if ("$" === data || "$!" === data || "$?" === data) {
					if (0 === depth) return targetInstance;
					depth--;
				} else "/$" === data && depth++;
			}
			targetInstance = targetInstance.previousSibling;
		}
		return null;
	}
	function resolveSingletonInstance(type, props, rootContainerInstance) {
		props = getOwnerDocumentFromRootContainer(rootContainerInstance);
		switch (type) {
			case "html":
				type = props.documentElement;
				if (!type) throw Error(formatProdErrorMessage(452));
				return type;
			case "head":
				type = props.head;
				if (!type) throw Error(formatProdErrorMessage(453));
				return type;
			case "body":
				type = props.body;
				if (!type) throw Error(formatProdErrorMessage(454));
				return type;
			default: throw Error(formatProdErrorMessage(451));
		}
	}
	function releaseSingletonInstance(instance) {
		for (var attributes = instance.attributes; attributes.length;) instance.removeAttributeNode(attributes[0]);
		detachDeletedInstance(instance);
	}
	var preloadPropsMap = /* @__PURE__ */ new Map();
	var preconnectsSet = /* @__PURE__ */ new Set();
	function getHoistableRoot(container) {
		return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
	}
	var previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
		f: flushSyncWork,
		r: requestFormReset,
		D: prefetchDNS,
		C: preconnect,
		L: preload,
		m: preloadModule,
		X: preinitScript,
		S: preinitStyle,
		M: preinitModuleScript
	};
	function flushSyncWork() {
		var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
		return previousWasRendering || wasRendering;
	}
	function requestFormReset(form) {
		var formInst = getInstanceFromNode(form);
		null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
	}
	var globalDocument = "undefined" === typeof document ? null : document;
	function preconnectAs(rel, href, crossOrigin) {
		var ownerDocument = globalDocument;
		if (ownerDocument && "string" === typeof href && href) {
			var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
			limitedEscapedHref = "link[rel=\"" + rel + "\"][href=\"" + limitedEscapedHref + "\"]";
			"string" === typeof crossOrigin && (limitedEscapedHref += "[crossorigin=\"" + crossOrigin + "\"]");
			preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = {
				rel,
				crossOrigin,
				href
			}, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
		}
	}
	function prefetchDNS(href) {
		previousDispatcher.D(href);
		preconnectAs("dns-prefetch", href, null);
	}
	function preconnect(href, crossOrigin) {
		previousDispatcher.C(href, crossOrigin);
		preconnectAs("preconnect", href, crossOrigin);
	}
	function preload(href, as, options) {
		previousDispatcher.L(href, as, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && href && as) {
			var preloadSelector = "link[rel=\"preload\"][as=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(as) + "\"]";
			"image" === as ? options && options.imageSrcSet ? (preloadSelector += "[imagesrcset=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSrcSet) + "\"]", "string" === typeof options.imageSizes && (preloadSelector += "[imagesizes=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSizes) + "\"]")) : preloadSelector += "[href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"]" : preloadSelector += "[href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"]";
			var key = preloadSelector;
			switch (as) {
				case "style":
					key = getStyleKey(href);
					break;
				case "script": key = getScriptKey(href);
			}
			preloadPropsMap.has(key) || (href = assign({
				rel: "preload",
				href: "image" === as && options && options.imageSrcSet ? void 0 : href,
				as
			}, options), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
		}
	}
	function preloadModule(href, options) {
		previousDispatcher.m(href, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && href) {
			var as = options && "string" === typeof options.as ? options.as : "script", preloadSelector = "link[rel=\"modulepreload\"][as=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(as) + "\"][href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"]", key = preloadSelector;
			switch (as) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": key = getScriptKey(href);
			}
			if (!preloadPropsMap.has(key) && (href = assign({
				rel: "modulepreload",
				href
			}, options), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
				switch (as) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (ownerDocument.querySelector(getScriptSelectorFromKey(key))) return;
				}
				as = ownerDocument.createElement("link");
				setInitialProperties(as, "link", href);
				markNodeAsHoistable(as);
				ownerDocument.head.appendChild(as);
			}
		}
	}
	function preinitStyle(href, precedence, options) {
		previousDispatcher.S(href, precedence, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && href) {
			var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
			precedence = precedence || "default";
			var resource = styles.get(key);
			if (!resource) {
				var state = {
					loading: 0,
					preload: null
				};
				if (resource = ownerDocument.querySelector(getStylesheetSelectorFromKey(key))) state.loading = 5;
				else {
					href = assign({
						rel: "stylesheet",
						href,
						"data-precedence": precedence
					}, options);
					(options = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options);
					var link = resource = ownerDocument.createElement("link");
					markNodeAsHoistable(link);
					setInitialProperties(link, "link", href);
					link._p = new Promise(function(resolve, reject) {
						link.onload = resolve;
						link.onerror = reject;
					});
					link.addEventListener("load", function() {
						state.loading |= 1;
					});
					link.addEventListener("error", function() {
						state.loading |= 2;
					});
					state.loading |= 4;
					insertStylesheet(resource, precedence, ownerDocument);
				}
				resource = {
					type: "stylesheet",
					instance: resource,
					count: 1,
					state
				};
				styles.set(key, resource);
			}
		}
	}
	function preinitScript(src, options) {
		previousDispatcher.X(src, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && src) {
			var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
			resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({
				src,
				async: !0
			}, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
				type: "script",
				instance: resource,
				count: 1,
				state: null
			}, scripts.set(key, resource));
		}
	}
	function preinitModuleScript(src, options) {
		previousDispatcher.M(src, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && src) {
			var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
			resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({
				src,
				async: !0,
				type: "module"
			}, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
				type: "script",
				instance: resource,
				count: 1,
				state: null
			}, scripts.set(key, resource));
		}
	}
	function getResource(type, currentProps, pendingProps, currentResource) {
		var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
		if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
		switch (type) {
			case "meta":
			case "title": return null;
			case "style": return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, pendingProps.set(currentProps, currentResource)), currentResource) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
					type = getStyleKey(pendingProps.href);
					var styles$244 = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, resource$245 = styles$244.get(type);
					resource$245 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$245 = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, styles$244.set(type, resource$245), (styles$244 = JSCompiler_inline_result.querySelector(getStylesheetSelectorFromKey(type))) && !styles$244._p && (resource$245.instance = styles$244, resource$245.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
						rel: "preload",
						as: "style",
						href: pendingProps.href,
						crossOrigin: pendingProps.crossOrigin,
						integrity: pendingProps.integrity,
						media: pendingProps.media,
						hrefLang: pendingProps.hrefLang,
						referrerPolicy: pendingProps.referrerPolicy
					}, preloadPropsMap.set(type, pendingProps), styles$244 || preloadStylesheet(JSCompiler_inline_result, type, pendingProps, resource$245.state)));
					if (currentProps && null === currentResource) throw Error(formatProdErrorMessage(528, ""));
					return resource$245;
				}
				if (currentProps && null !== currentResource) throw Error(formatProdErrorMessage(529, ""));
				return null;
			case "script": return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, pendingProps.set(currentProps, currentResource)), currentResource) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(formatProdErrorMessage(444, type));
		}
	}
	function getStyleKey(href) {
		return "href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"";
	}
	function getStylesheetSelectorFromKey(key) {
		return "link[rel=\"stylesheet\"][" + key + "]";
	}
	function stylesheetPropsFromRawProps(rawProps) {
		return assign({}, rawProps, {
			"data-precedence": rawProps.precedence,
			precedence: null
		});
	}
	function preloadStylesheet(ownerDocument, key, preloadProps, state) {
		ownerDocument.querySelector("link[rel=\"preload\"][as=\"style\"][" + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
			return state.loading |= 1;
		}), key.addEventListener("error", function() {
			return state.loading |= 2;
		}), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
	}
	function getScriptKey(src) {
		return "[src=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(src) + "\"]";
	}
	function getScriptSelectorFromKey(key) {
		return "script[async]" + key;
	}
	function acquireResource(hoistableRoot, resource, props) {
		resource.count++;
		if (null === resource.instance) switch (resource.type) {
			case "style":
				var instance = hoistableRoot.querySelector("style[data-href~=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + "\"]");
				if (instance) return resource.instance = instance, markNodeAsHoistable(instance), instance;
				var styleProps = assign({}, props, {
					"data-href": props.href,
					"data-precedence": props.precedence,
					href: null,
					precedence: null
				});
				instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement("style");
				markNodeAsHoistable(instance);
				setInitialProperties(instance, "style", styleProps);
				insertStylesheet(instance, props.precedence, hoistableRoot);
				return resource.instance = instance;
			case "stylesheet":
				styleProps = getStyleKey(props.href);
				var instance$250 = hoistableRoot.querySelector(getStylesheetSelectorFromKey(styleProps));
				if (instance$250) return resource.state.loading |= 4, resource.instance = instance$250, markNodeAsHoistable(instance$250), instance$250;
				instance = stylesheetPropsFromRawProps(props);
				(styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
				instance$250 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
				markNodeAsHoistable(instance$250);
				var linkInstance = instance$250;
				linkInstance._p = new Promise(function(resolve, reject) {
					linkInstance.onload = resolve;
					linkInstance.onerror = reject;
				});
				setInitialProperties(instance$250, "link", instance);
				resource.state.loading |= 4;
				insertStylesheet(instance$250, props.precedence, hoistableRoot);
				return resource.instance = instance$250;
			case "script":
				instance$250 = getScriptKey(props.src);
				if (styleProps = hoistableRoot.querySelector(getScriptSelectorFromKey(instance$250))) return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
				instance = props;
				if (styleProps = preloadPropsMap.get(instance$250)) instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
				hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
				styleProps = hoistableRoot.createElement("script");
				markNodeAsHoistable(styleProps);
				setInitialProperties(styleProps, "link", instance);
				hoistableRoot.head.appendChild(styleProps);
				return resource.instance = styleProps;
			case "void": return null;
			default: throw Error(formatProdErrorMessage(443, resource.type));
		}
		else "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
		return resource.instance;
	}
	function insertStylesheet(instance, precedence, root) {
		for (var nodes = root.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.dataset.precedence === precedence) prior = node;
			else if (prior !== last) break;
		}
		prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root.nodeType ? root.head : root, precedence.insertBefore(instance, precedence.firstChild));
	}
	function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
		stylesheetProps.crossOrigin ??= preloadProps.crossOrigin;
		stylesheetProps.referrerPolicy ??= preloadProps.referrerPolicy;
		stylesheetProps.title ??= preloadProps.title;
	}
	function adoptPreloadPropsForScript(scriptProps, preloadProps) {
		scriptProps.crossOrigin ??= preloadProps.crossOrigin;
		scriptProps.referrerPolicy ??= preloadProps.referrerPolicy;
		scriptProps.integrity ??= preloadProps.integrity;
	}
	var tagCaches = null;
	function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
		if (null === tagCaches) {
			var cache = /* @__PURE__ */ new Map();
			var caches = tagCaches = /* @__PURE__ */ new Map();
			caches.set(ownerDocument, cache);
		} else caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
		if (cache.has(type)) return cache;
		cache.set(type, null);
		ownerDocument = ownerDocument.getElementsByTagName(type);
		for (caches = 0; caches < ownerDocument.length; caches++) {
			var node = ownerDocument[caches];
			if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
				var nodeKey = node.getAttribute(keyAttribute) || "";
				nodeKey = type + nodeKey;
				var existing = cache.get(nodeKey);
				existing ? existing.push(node) : cache.set(nodeKey, [node]);
			}
		}
		return cache;
	}
	function mountHoistable(hoistableRoot, type, instance) {
		hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
		hoistableRoot.head.insertBefore(instance, "title" === type ? hoistableRoot.querySelector("head > title") : null);
	}
	function isHostHoistableType(type, props, hostContext) {
		if (1 === hostContext || null != props.itemProp) return !1;
		switch (type) {
			case "meta":
			case "title": return !0;
			case "style":
				if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href) break;
				return !0;
			case "link":
				if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError) break;
				switch (props.rel) {
					case "stylesheet": return type = props.disabled, "string" === typeof props.precedence && null == type;
					default: return !0;
				}
			case "script": if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src) return !0;
		}
		return !1;
	}
	function preloadResource(resource) {
		return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? !1 : !0;
	}
	var suspendedState = null;
	function noop() {}
	function suspendResource(hoistableRoot, resource, props) {
		if (null === suspendedState) throw Error(formatProdErrorMessage(475));
		var state = suspendedState;
		if ("stylesheet" === resource.type && ("string" !== typeof props.media || !1 !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
			if (null === resource.instance) {
				var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));
				if (instance) {
					hoistableRoot = instance._p;
					null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
					resource.state.loading |= 4;
					resource.instance = instance;
					markNodeAsHoistable(instance);
					return;
				}
				instance = hoistableRoot.ownerDocument || hoistableRoot;
				props = stylesheetPropsFromRawProps(props);
				(key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
				instance = instance.createElement("link");
				markNodeAsHoistable(instance);
				var linkInstance = instance;
				linkInstance._p = new Promise(function(resolve, reject) {
					linkInstance.onload = resolve;
					linkInstance.onerror = reject;
				});
				setInitialProperties(instance, "link", props);
				resource.instance = instance;
			}
			null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
			state.stylesheets.set(resource, hoistableRoot);
			(hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
		}
	}
	function waitForCommitToBeReady() {
		if (null === suspendedState) throw Error(formatProdErrorMessage(475));
		var state = suspendedState;
		state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
		return 0 < state.count ? function(commit) {
			var stylesheetTimer = setTimeout(function() {
				state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
				if (state.unsuspend) {
					var unsuspend = state.unsuspend;
					state.unsuspend = null;
					unsuspend();
				}
			}, 6e4);
			state.unsuspend = commit;
			return function() {
				state.unsuspend = null;
				clearTimeout(stylesheetTimer);
			};
		} : null;
	}
	function onUnsuspend() {
		this.count--;
		if (0 === this.count) {
			if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
			else if (this.unsuspend) {
				var unsuspend = this.unsuspend;
				this.unsuspend = null;
				unsuspend();
			}
		}
	}
	var precedencesByRoot = null;
	function insertSuspendedStylesheets(state, resources) {
		state.stylesheets = null;
		null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
	}
	function insertStylesheetIntoRoot(root, resource) {
		if (!(resource.state.loading & 4)) {
			var precedences = precedencesByRoot.get(root);
			if (precedences) var last = precedences.get(null);
			else {
				precedences = /* @__PURE__ */ new Map();
				precedencesByRoot.set(root, precedences);
				for (var nodes = root.querySelectorAll("link[data-precedence],style[data-precedence]"), i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media")) precedences.set(node.dataset.precedence, node), last = node;
				}
				last && precedences.set(null, last);
			}
			nodes = resource.instance;
			node = nodes.getAttribute("data-precedence");
			i = precedences.get(node) || last;
			i === last && precedences.set(null, nodes);
			precedences.set(node, nodes);
			this.count++;
			last = onUnsuspend.bind(this);
			nodes.addEventListener("load", last);
			nodes.addEventListener("error", last);
			i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root = 9 === root.nodeType ? root.head : root, root.insertBefore(nodes, root.firstChild));
			resource.state.loading |= 4;
		}
	}
	var HostTransitionContext = {
		$$typeof: REACT_CONTEXT_TYPE,
		Provider: null,
		Consumer: null,
		_currentValue: sharedNotPendingObject,
		_currentValue2: sharedNotPendingObject,
		_threadCount: 0
	};
	function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, formState) {
		this.tag = 1;
		this.containerInfo = containerInfo;
		this.pingCache = this.current = this.pendingChildren = null;
		this.timeoutHandle = -1;
		this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
		this.callbackPriority = 0;
		this.expirationTimes = createLaneMap(-1);
		this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
		this.entanglements = createLaneMap(0);
		this.hiddenUpdates = createLaneMap(null);
		this.identifierPrefix = identifierPrefix;
		this.onUncaughtError = onUncaughtError;
		this.onCaughtError = onCaughtError;
		this.onRecoverableError = onRecoverableError;
		this.pooledCache = null;
		this.pooledCacheLanes = 0;
		this.formState = formState;
		this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, formState) {
		containerInfo = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, formState);
		tag = 1;
		!0 === isStrictMode && (tag |= 24);
		isStrictMode = createFiberImplClass(3, null, null, tag);
		containerInfo.current = isStrictMode;
		isStrictMode.stateNode = containerInfo;
		tag = createCache();
		tag.refCount++;
		containerInfo.pooledCache = tag;
		tag.refCount++;
		isStrictMode.memoizedState = {
			element: initialChildren,
			isDehydrated: hydrate,
			cache: tag
		};
		initializeUpdateQueue(isStrictMode);
		return containerInfo;
	}
	function getContextForSubtree(parentComponent) {
		if (!parentComponent) return emptyContextObject;
		parentComponent = emptyContextObject;
		return parentComponent;
	}
	function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
		parentComponent = getContextForSubtree(parentComponent);
		null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
		container = createUpdate(lane);
		container.payload = { element };
		callback = void 0 === callback ? null : callback;
		null !== callback && (container.callback = callback);
		element = enqueueUpdate(rootFiber, container, lane);
		null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
	}
	function markRetryLaneImpl(fiber, retryLane) {
		fiber = fiber.memoizedState;
		if (null !== fiber && null !== fiber.dehydrated) {
			var a = fiber.retryLane;
			fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
		}
	}
	function markRetryLaneIfNotHydrated(fiber, retryLane) {
		markRetryLaneImpl(fiber, retryLane);
		(fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
	}
	function attemptContinuousHydration(fiber) {
		if (13 === fiber.tag) {
			var root = enqueueConcurrentRenderForLane(fiber, 67108864);
			null !== root && scheduleUpdateOnFiber(root, fiber, 67108864);
			markRetryLaneIfNotHydrated(fiber, 67108864);
		}
	}
	var _enabled = !0;
	function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
		var prevTransition = ReactSharedInternals.T;
		ReactSharedInternals.T = null;
		var previousPriority = ReactDOMSharedInternals.p;
		try {
			ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
		var prevTransition = ReactSharedInternals.T;
		ReactSharedInternals.T = null;
		var previousPriority = ReactDOMSharedInternals.p;
		try {
			ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		if (_enabled) {
			var blockedOn = findInstanceBlockingEvent(nativeEvent);
			if (null === blockedOn) dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer), clearIfContinuousEvent(domEventName, nativeEvent);
			else if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) nativeEvent.stopPropagation();
			else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
				for (; null !== blockedOn;) {
					var fiber = getInstanceFromNode(blockedOn);
					if (null !== fiber) switch (fiber.tag) {
						case 3:
							fiber = fiber.stateNode;
							if (fiber.current.memoizedState.isDehydrated) {
								var lanes = getHighestPriorityLanes(fiber.pendingLanes);
								if (0 !== lanes) {
									var root = fiber;
									root.pendingLanes |= 2;
									for (root.entangledLanes |= 2; lanes;) {
										var lane = 1 << 31 - clz32(lanes);
										root.entanglements[1] |= lane;
										lanes &= ~lane;
									}
									ensureRootIsScheduled(fiber);
									0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0, !1));
								}
							}
							break;
						case 13: root = enqueueConcurrentRenderForLane(fiber, 2), null !== root && scheduleUpdateOnFiber(root, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
					}
					fiber = findInstanceBlockingEvent(nativeEvent);
					null === fiber && dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
					if (fiber === blockedOn) break;
					blockedOn = fiber;
				}
				null !== blockedOn && nativeEvent.stopPropagation();
			} else dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
		}
	}
	function findInstanceBlockingEvent(nativeEvent) {
		nativeEvent = getEventTarget(nativeEvent);
		return findInstanceBlockingTarget(nativeEvent);
	}
	var return_targetInst = null;
	function findInstanceBlockingTarget(targetNode) {
		return_targetInst = null;
		targetNode = getClosestInstanceFromNode(targetNode);
		if (null !== targetNode) {
			var nearestMounted = getNearestMountedFiber(targetNode);
			if (null === nearestMounted) targetNode = null;
			else {
				var tag = nearestMounted.tag;
				if (13 === tag) {
					targetNode = getSuspenseInstanceFromFiber(nearestMounted);
					if (null !== targetNode) return targetNode;
					targetNode = null;
				} else if (3 === tag) {
					if (nearestMounted.stateNode.current.memoizedState.isDehydrated) return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
					targetNode = null;
				} else nearestMounted !== targetNode && (targetNode = null);
			}
		}
		return_targetInst = targetNode;
		return null;
	}
	function getEventPriority(domEventName) {
		switch (domEventName) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (getCurrentPriorityLevel()) {
				case ImmediatePriority: return 2;
				case UserBlockingPriority: return 8;
				case NormalPriority$1:
				case LowPriority: return 32;
				case IdlePriority: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hasScheduledReplayAttempt = !1;
	var queuedFocus = null;
	var queuedDrag = null;
	var queuedMouse = null;
	var queuedPointers = /* @__PURE__ */ new Map();
	var queuedPointerCaptures = /* @__PURE__ */ new Map();
	var queuedExplicitHydrationTargets = [];
	var discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function clearIfContinuousEvent(domEventName, nativeEvent) {
		switch (domEventName) {
			case "focusin":
			case "focusout":
				queuedFocus = null;
				break;
			case "dragenter":
			case "dragleave":
				queuedDrag = null;
				break;
			case "mouseover":
			case "mouseout":
				queuedMouse = null;
				break;
			case "pointerover":
			case "pointerout":
				queuedPointers.delete(nativeEvent.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": queuedPointerCaptures.delete(nativeEvent.pointerId);
		}
	}
	function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent) return existingQueuedEvent = {
			blockedOn,
			domEventName,
			eventSystemFlags,
			nativeEvent,
			targetContainers: [targetContainer]
		}, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
		existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
		blockedOn = existingQueuedEvent.targetContainers;
		null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
		return existingQueuedEvent;
	}
	function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		switch (domEventName) {
			case "focusin": return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
			case "dragenter": return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
			case "mouseover": return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
			case "pointerover":
				var pointerId = nativeEvent.pointerId;
				queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent));
				return !0;
			case "gotpointercapture": return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), !0;
		}
		return !1;
	}
	function attemptExplicitHydrationTarget(queuedTarget) {
		var targetInst = getClosestInstanceFromNode(queuedTarget.target);
		if (null !== targetInst) {
			var nearestMounted = getNearestMountedFiber(targetInst);
			if (null !== nearestMounted) {
				if (targetInst = nearestMounted.tag, 13 === targetInst) {
					if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
						queuedTarget.blockedOn = targetInst;
						runWithPriority(queuedTarget.priority, function() {
							if (13 === nearestMounted.tag) {
								var lane = requestUpdateLane();
								lane = getBumpedLaneForHydrationByLane(lane);
								var root = enqueueConcurrentRenderForLane(nearestMounted, lane);
								null !== root && scheduleUpdateOnFiber(root, nearestMounted, lane);
								markRetryLaneIfNotHydrated(nearestMounted, lane);
							}
						});
						return;
					}
				} else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
					queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
					return;
				}
			}
		}
		queuedTarget.blockedOn = null;
	}
	function attemptReplayContinuousQueuedEvent(queuedEvent) {
		if (null !== queuedEvent.blockedOn) return !1;
		for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length;) {
			var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
			if (null === nextBlockedOn) {
				nextBlockedOn = queuedEvent.nativeEvent;
				var nativeEventClone = new nextBlockedOn.constructor(nextBlockedOn.type, nextBlockedOn);
				currentReplayingEvent = nativeEventClone;
				nextBlockedOn.target.dispatchEvent(nativeEventClone);
				currentReplayingEvent = null;
			} else return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, !1;
			targetContainers.shift();
		}
		return !0;
	}
	function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
		attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
	}
	function replayUnblockedEvents() {
		hasScheduledReplayAttempt = !1;
		null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
		null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
		null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
		queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
		queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
	}
	function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
		queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = !0, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, replayUnblockedEvents)));
	}
	var lastScheduledReplayQueue = null;
	function scheduleReplayQueueIfNeeded(formReplayingQueue) {
		lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, function() {
			lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
			for (var i = 0; i < formReplayingQueue.length; i += 3) {
				var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
				if ("function" !== typeof submitterOrAction) if (null === findInstanceBlockingTarget(submitterOrAction || form)) continue;
				else break;
				var formInst = getInstanceFromNode(form);
				null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(formInst, {
					pending: !0,
					data: formData,
					method: form.method,
					action: submitterOrAction
				}, submitterOrAction, formData));
			}
		}));
	}
	function retryIfBlockedOn(unblocked) {
		function unblock(queuedEvent) {
			return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
		}
		null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
		null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
		null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
		queuedPointers.forEach(unblock);
		queuedPointerCaptures.forEach(unblock);
		for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
			var queuedTarget = queuedExplicitHydrationTargets[i];
			queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
		}
		for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn);) attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
		i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
		if (null != i) for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
			var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
			if ("function" === typeof submitterOrAction) formProps || scheduleReplayQueueIfNeeded(i);
			else if (formProps) {
				var action = null;
				if (submitterOrAction && submitterOrAction.hasAttribute("formAction")) {
					if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null) action = formProps.formAction;
					else if (null !== findInstanceBlockingTarget(form)) continue;
				} else action = formProps.action;
				"function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
				scheduleReplayQueueIfNeeded(i);
			}
		}
	}
	function ReactDOMRoot(internalRoot) {
		this._internalRoot = internalRoot;
	}
	ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
		var root = this._internalRoot;
		if (null === root) throw Error(formatProdErrorMessage(409));
		var current = root.current;
		updateContainerImpl(current, requestUpdateLane(), children, root, null, null);
	};
	ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
		var root = this._internalRoot;
		if (null !== root) {
			this._internalRoot = null;
			var container = root.containerInfo;
			updateContainerImpl(root.current, 2, null, root, null, null);
			flushSyncWork$1();
			container[internalContainerInstanceKey] = null;
		}
	};
	function ReactDOMHydrationRoot(internalRoot) {
		this._internalRoot = internalRoot;
	}
	ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
		if (target) {
			var updatePriority = resolveUpdatePriority();
			target = {
				blockedOn: null,
				target,
				priority: updatePriority
			};
			for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++);
			queuedExplicitHydrationTargets.splice(i, 0, target);
			0 === i && attemptExplicitHydrationTarget(target);
		}
	};
	var isomorphicReactPackageVersion$jscomp$inline_1785 = React.version;
	if ("19.1.5" !== isomorphicReactPackageVersion$jscomp$inline_1785) throw Error(formatProdErrorMessage(527, isomorphicReactPackageVersion$jscomp$inline_1785, "19.1.5"));
	ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
		var fiber = componentOrElement._reactInternals;
		if (void 0 === fiber) {
			if ("function" === typeof componentOrElement.render) throw Error(formatProdErrorMessage(188));
			componentOrElement = Object.keys(componentOrElement).join(",");
			throw Error(formatProdErrorMessage(268, componentOrElement));
		}
		componentOrElement = findCurrentFiberUsingSlowPath(fiber);
		componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
		componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
		return componentOrElement;
	};
	var internals$jscomp$inline_2256 = {
		bundleType: 0,
		version: "19.1.5",
		rendererPackageName: "react-dom",
		currentDispatcherRef: ReactSharedInternals,
		reconcilerVersion: "19.1.5"
	};
	if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
		var hook$jscomp$inline_2257 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!hook$jscomp$inline_2257.isDisabled && hook$jscomp$inline_2257.supportsFiber) try {
			rendererID = hook$jscomp$inline_2257.inject(internals$jscomp$inline_2256), injectedHook = hook$jscomp$inline_2257;
		} catch (err) {}
	}
	exports.createRoot = function(container, options) {
		if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
		var isStrictMode = !1, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, transitionCallbacks = null;
		null !== options && void 0 !== options && (!0 === options.unstable_strictMode && (isStrictMode = !0), void 0 !== options.identifierPrefix && (identifierPrefix = options.identifierPrefix), void 0 !== options.onUncaughtError && (onUncaughtError = options.onUncaughtError), void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError), void 0 !== options.onRecoverableError && (onRecoverableError = options.onRecoverableError), void 0 !== options.unstable_transitionCallbacks && (transitionCallbacks = options.unstable_transitionCallbacks));
		options = createFiberRoot(container, 1, !1, null, null, isStrictMode, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, transitionCallbacks, null);
		container[internalContainerInstanceKey] = options.current;
		listenToAllSupportedEvents(container);
		return new ReactDOMRoot(options);
	};
}));
// src/components/honey/HoneyLoader.tsx
var import_client = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_client_production();
})))(), 1);
var import_jsx_runtime = require_jsx_runtime();
var HEX_CELLS = [
	{
		id: "hex-a",
		delay: "0ms"
	},
	{
		id: "hex-b",
		delay: "140ms"
	},
	{
		id: "hex-c",
		delay: "280ms"
	},
	{
		id: "hex-d",
		delay: "420ms"
	},
	{
		id: "hex-e",
		delay: "560ms"
	},
	{
		id: "hex-f",
		delay: "700ms"
	},
	{
		id: "hex-g",
		delay: "840ms"
	}
];
/**
* Honeycomb loading indicator — a cluster of hexagons that pulse in sequence
* instead of a generic spinner.
*/
function HoneyLoader({ label = "Loading", className, "data-ocid": dataOcid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("output", {
		"data-ocid": dataOcid,
		"aria-live": "polite",
		className: cn("flex flex-col items-center justify-center gap-3 py-10", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-1.5",
			children: HEX_CELLS.map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "hex-clip size-3 animate-honey-glow bg-primary",
				style: { animationDelay: cell.delay }
			}, cell.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-outline-black text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground",
			children: label
		})]
	});
}
// src/hooks/useJobs.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* How often the admin dashboard re-checks the backend for new requests.
*
* Short enough that a freshly submitted request appears without a manual
* reload, long enough that it never floods the canister.
*/
var REQUESTS_REFETCH_MS = 15e3;
var jobKeys = {
	all: ["jobs"],
	list: () => [...jobKeys.all, "list"],
	detail: (id) => [
		...jobKeys.all,
		"detail",
		id.toString()
	],
	reference: (code) => [
		...jobKeys.all,
		"reference",
		code
	],
	stats: () => [...jobKeys.all, "stats"],
	role: () => ["role"],
	stripe: () => ["stripe", "configured"],
	ownerAlert: () => ["ownerAlert", "email"],
	ownerAlertPhone: () => ["ownerAlert", "phone"],
	twilio: () => ["twilio", "status"],
	bees: () => ["bees", "list"],
	visitHistory: (code) => [
		"visits",
		"reference",
		code
	],
	customerVisits: (id) => [
		"visits",
		"customer",
		id.toString()
	],
	customerMessages: (code) => [
		"messages",
		"reference",
		code
	],
	quoteByReference: (code) => [
		"quote",
		"reference",
		code
	]
};
function useIsAdmin() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.role(),
		queryFn: async () => {
			if (!actor) return false;
			return actor.isCallerAdmin();
		},
		enabled: !!actor && !isFetching
	});
}
/** Admin: the owner alert email that receives new-request notifications. */
function useOwnerAlertEmail() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.ownerAlert(),
		queryFn: async () => {
			if (!actor) return "";
			return actor.getOwnerAlertEmail();
		},
		enabled: !!actor && !isFetching
	});
}
/** Admin: the owner alert phone number that receives new-request texts. */
function useOwnerAlertPhone() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.ownerAlertPhone(),
		queryFn: async () => {
			if (!actor) return "";
			return actor.getOwnerAlertPhone();
		},
		enabled: !!actor && !isFetching
	});
}
/**
* Admin: whether the Twilio messaging credential is configured and which
* sending number it uses. Drives the "configured" state of the text channel.
*/
function useTwilioConfigStatus() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.twilio(),
		queryFn: async () => {
			if (!actor) return {
				configured: false,
				fromNumber: ""
			};
			return actor.getTwilioConfigStatus();
		},
		enabled: !!actor && !isFetching
	});
}
function useDashboardStats() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.stats(),
		queryFn: async () => {
			if (!actor) return null;
			return actor.getDashboardStats();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: REQUESTS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
function useJobRequests() {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.list(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listRequests();
		},
		enabled: !!actor && !isFetching,
		refetchInterval: REQUESTS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
/**
* Admin: how many requests are still awaiting the owner's quote.
*
* Shares the request-list query key with `useJobRequests`, so the nav badge and
* the dashboard read one cached list and one poll. Gated behind `enabled` so a
* guest never fires the admin-only `listRequests` call.
*/
function useNewRequestCount(enabled) {
	const { actor, isFetching } = useActor(createActor);
	return useQuery({
		queryKey: jobKeys.list(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listRequests();
		},
		enabled: enabled && !!actor && !isFetching,
		refetchInterval: REQUESTS_REFETCH_MS,
		refetchIntervalInBackground: false,
		select: (jobs) => countAwaitingQuote(jobs)
	});
}
function useJobByReference(referenceCode) {
	const { actor, isFetching } = useActor(createActor);
	const trimmed = referenceCode.trim();
	return useQuery({
		queryKey: jobKeys.reference(trimmed),
		queryFn: async () => {
			if (!actor || trimmed.length === 0) return null;
			return actor.getRequestByReference(trimmed);
		},
		enabled: !!actor && !isFetching && trimmed.length > 0
	});
}
/**
* Guest: the itemized quote for a job reference code, as the emailed link
* opens it.
*
* Backed by `getQuoteByReference`, which returns the same quote record the
* reference-code lookup shows, with an `expired` flag derived by the backend.
* Returns `null` when the code is unknown or the job has no quote.
*/
function useQuoteByReference(referenceCode) {
	const { actor, isFetching } = useActor(createActor);
	const trimmed = referenceCode.trim();
	return useQuery({
		queryKey: jobKeys.quoteByReference(trimmed),
		queryFn: async () => {
			if (!actor || trimmed.length === 0) return null;
			return actor.getQuoteByReference(trimmed);
		},
		enabled: !!actor && !isFetching && trimmed.length > 0
	});
}
/** Guest: newest-first visit history for a job's reference code. */
function useVisitHistory(referenceCode) {
	const { actor, isFetching } = useActor(createActor);
	const trimmed = referenceCode.trim();
	return useQuery({
		queryKey: jobKeys.visitHistory(trimmed),
		queryFn: async () => {
			if (!actor || trimmed.length === 0) return [];
			return actor.getVisitHistory(trimmed);
		},
		enabled: !!actor && !isFetching && trimmed.length > 0
	});
}
/**
* Guest: the customer's own message thread for a job reference code.
*
* The backend scopes the thread to the reference code, so a customer only ever
* sees the exchange tied to the job they are tracking.
*/
function useCustomerMessages(referenceCode) {
	const { actor, isFetching } = useActor(createActor);
	const trimmed = referenceCode.trim();
	return useQuery({
		queryKey: jobKeys.customerMessages(trimmed),
		queryFn: async () => {
			if (!actor || trimmed.length === 0) return [];
			return actor.getCustomerMessages(trimmed);
		},
		enabled: !!actor && !isFetching && trimmed.length > 0,
		refetchInterval: REQUESTS_REFETCH_MS,
		refetchIntervalInBackground: false
	});
}
function useSubmitRequest() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.submitRequest(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
function useAcceptQuote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (referenceCode) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.acceptQuote(referenceCode);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
/**
* Guest: decline the quote for a job reference code.
*
* Backed by `declineQuoteByReference`, which marks the quote `#declined`. The
* emailed decline link and the reference-code lookup write the same record, so
* the job's quote status stays consistent between them.
*/
function useDeclineQuoteByReference() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (referenceCode) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.declineQuoteByReference(referenceCode);
		},
		onSuccess: (_result, referenceCode) => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
			queryClient.invalidateQueries({ queryKey: jobKeys.quoteByReference(referenceCode.trim()) });
		}
	});
}
function useConfirmAppointment() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (referenceCode) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.confirmAppointment(referenceCode);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
function useRecordDeposit() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.recordDeposit(vars.referenceCode, vars.method);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
function useSubmitReview() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.submitReview(vars.referenceCode, vars.rating, vars.comment);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
/**
* Guest: post a message into the customer's own thread for a job reference
* code. Resolves to the backend `Result` so the thread can surface a
* `notAuthorized`/`notFound` error inline.
*/
function usePostCustomerMessage() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.postCustomerMessage(vars.referenceCode, vars.body);
		},
		onSuccess: (_result, vars) => {
			queryClient.invalidateQueries({ queryKey: jobKeys.customerMessages(vars.referenceCode.trim()) });
		}
	});
}
function useSetQuote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setQuote(vars.id, vars.amount, vars.note);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
/**
* Admin: email the customer their quote.
*
* Backed by `sendQuote`, which marks the quote `#sent`, moves the job to
* `#quoted` and emails the itemized quote with accept/decline links. Resolves
* to `Result<QuoteSendResult, JobError>` so the Quotes workspace can surface a
* per-channel delivery outcome — a failed email is reported, never swallowed.
*/
function useSendQuote() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.sendQuote(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
function useScheduleAppointment() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (vars) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.scheduleAppointment(vars.id, vars.scheduledAt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.all });
		}
	});
}
/**
* Admin: save the owner alert email.
*
* Resolves to the backend `Result` so the panel can surface the specific
* `OwnerAlertError` (invalid email vs. send failure) inline.
*/
function useSetOwnerAlertEmail() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (address) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setOwnerAlertEmail(address);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.ownerAlert() });
		}
	});
}
/**
* Admin: save the owner alert phone number.
*
* Resolves to the backend `Result` so the panel can surface the specific
* `OwnerAlertPhoneError` (invalid number vs. send failure) inline. The backend
* normalizes a valid number to E.164 and returns the stored value.
*/
function useSetOwnerAlertPhone() {
	const { actor } = useActor(createActor);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (number) => {
			if (!actor) throw new Error("Backend is not ready");
			return actor.setOwnerAlertPhone(number);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobKeys.ownerAlertPhone() });
		}
	});
}
/**
* Admin: send a sample alert to both the saved email and the saved phone.
*
* Resolves to `TestAlertResult`, whose `email` and `sms` channels each report
* `{ #sent }` or `{ #failed : Text }` so the panel can show the outcome of each
* channel separately.
*/
function useSendTestAlert() {
	const { actor } = useActor(createActor);
	return useMutation({ mutationFn: async () => {
		if (!actor) throw new Error("Backend is not ready");
		return actor.sendTestAlert();
	} });
}
/**
* Admin: every scheduled appointment across all jobs, newest visit first.
*
* Appointments live on the job view rather than a dedicated endpoint, so this
* derives the schedule from the shared request list — one cached query and one
* poll — and keeps each appointment linked to its job and customer.
*/
function useScheduledAppointments() {
	const query = useJobRequests();
	const appointments = (0, import_react.useMemo)(() => {
		return (query.data ?? []).filter((job) => job.appointment !== void 0).map((job) => ({
			jobId: job.id,
			referenceCode: job.referenceCode,
			customerName: job.customerName,
			category: job.category,
			status: job.status,
			scheduledAt: job.appointment?.scheduledAt ?? 0n,
			confirmed: job.appointment?.confirmed ?? false
		})).sort((a, b) => a.scheduledAt === b.scheduledAt ? 0 : a.scheduledAt > b.scheduledAt ? -1 : 1);
	}, [query.data]);
	return {
		...query,
		data: appointments
	};
}
/** How long the in-app new-request alert stays before it clears itself. */
var NEW_REQUEST_ALERT_MS = 8e3;
/**
* Watch the request list for genuinely new arrivals while the owner is signed
* in with the app open.
*
* The first successful load only seeds the baseline of already-existing
* requests, so opening the dashboard never fires an alert. Every later poll
* compares against that baseline and surfaces the newest arrival. Gated behind
* `enabled` so a guest never fires the admin-only `listRequests` call.
*/
function useNewRequestAlert(enabled) {
	const { actor, isFetching } = useActor(createActor);
	const [request, setRequest] = (0, import_react.useState)(null);
	const knownIdsRef = (0, import_react.useRef)(null);
	const jobs = useQuery({
		queryKey: jobKeys.list(),
		queryFn: async () => {
			if (!actor) return [];
			return actor.listRequests();
		},
		enabled: enabled && !!actor && !isFetching,
		refetchInterval: REQUESTS_REFETCH_MS,
		refetchIntervalInBackground: false
	}).data;
	(0, import_react.useEffect)(() => {
		if (!enabled) {
			knownIdsRef.current = null;
			setRequest(null);
			return;
		}
		if (!jobs) return;
		const ids = new Set(jobs.map((job) => job.id.toString()));
		const known = knownIdsRef.current;
		if (known === null) {
			knownIdsRef.current = ids;
			return;
		}
		const fresh = jobs.filter((job) => !known.has(job.id.toString()));
		knownIdsRef.current = ids;
		if (fresh.length === 0) return;
		const newest = fresh.reduce((latest, job) => job.createdAt > latest.createdAt ? job : latest);
		setRequest(newest);
	}, [enabled, jobs]);
	return {
		request,
		dismiss: (0, import_react.useCallback)(() => setRequest(null), [])
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/tiny-invariant@1.3.3/node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var prefix = "Invariant failed";
function invariant(condition, message) {
	if (condition) return;
	throw new Error(prefix);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+store@0.7.7/node_modules/@tanstack/store/dist/esm/scheduler.js
var __storeToDerived = /* @__PURE__ */ new WeakMap();
var __derivedToStore = /* @__PURE__ */ new WeakMap();
var __depsThatHaveWrittenThisTick = { current: [] };
var __isFlushing = false;
var __batchDepth = 0;
var __pendingUpdates = /* @__PURE__ */ new Set();
var __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
	const sorted = Array.from(relatedVals).sort((a, b) => {
		if (a instanceof Derived && a.options.deps.includes(b)) return 1;
		if (b instanceof Derived && b.options.deps.includes(a)) return -1;
		return 0;
	});
	for (const derived of sorted) {
		if (__depsThatHaveWrittenThisTick.current.includes(derived)) continue;
		__depsThatHaveWrittenThisTick.current.push(derived);
		derived.recompute();
		const stores = __derivedToStore.get(derived);
		if (stores) for (const store of stores) {
			const relatedLinkedDerivedVals = __storeToDerived.get(store);
			if (!relatedLinkedDerivedVals) continue;
			__flush_internals(relatedLinkedDerivedVals);
		}
	}
}
function __notifyListeners(store) {
	const value = {
		prevVal: store.prevState,
		currentVal: store.state
	};
	for (const listener of store.listeners) listener(value);
}
function __notifyDerivedListeners(derived) {
	const value = {
		prevVal: derived.prevState,
		currentVal: derived.state
	};
	for (const listener of derived.listeners) listener(value);
}
function __flush(store) {
	if (__batchDepth > 0 && !__initialBatchValues.has(store)) __initialBatchValues.set(store, store.prevState);
	__pendingUpdates.add(store);
	if (__batchDepth > 0) return;
	if (__isFlushing) return;
	try {
		__isFlushing = true;
		while (__pendingUpdates.size > 0) {
			const stores = Array.from(__pendingUpdates);
			__pendingUpdates.clear();
			for (const store2 of stores) {
				store2.prevState = __initialBatchValues.get(store2) ?? store2.prevState;
				__notifyListeners(store2);
			}
			for (const store2 of stores) {
				const derivedVals = __storeToDerived.get(store2);
				if (!derivedVals) continue;
				__depsThatHaveWrittenThisTick.current.push(store2);
				__flush_internals(derivedVals);
			}
			for (const store2 of stores) {
				const derivedVals = __storeToDerived.get(store2);
				if (!derivedVals) continue;
				for (const derived of derivedVals) __notifyDerivedListeners(derived);
			}
		}
	} finally {
		__isFlushing = false;
		__depsThatHaveWrittenThisTick.current = [];
		__initialBatchValues.clear();
	}
}
function batch(fn) {
	__batchDepth++;
	try {
		fn();
	} finally {
		__batchDepth--;
		if (__batchDepth === 0) {
			const pendingUpdateToFlush = __pendingUpdates.values().next().value;
			if (pendingUpdateToFlush) __flush(pendingUpdateToFlush);
		}
	}
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+store@0.7.7/node_modules/@tanstack/store/dist/esm/types.js
function isUpdaterFunction(updater) {
	return typeof updater === "function";
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+store@0.7.7/node_modules/@tanstack/store/dist/esm/store.js
var Store = class {
	constructor(initialState, options) {
		this.listeners = /* @__PURE__ */ new Set();
		this.subscribe = (listener) => {
			var _a, _b;
			this.listeners.add(listener);
			const unsub = (_b = (_a = this.options) == null ? void 0 : _a.onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
			return () => {
				this.listeners.delete(listener);
				unsub?.();
			};
		};
		this.prevState = initialState;
		this.state = initialState;
		this.options = options;
	}
	setState(updater) {
		var _a, _b, _c;
		this.prevState = this.state;
		if ((_a = this.options) == null ? void 0 : _a.updateFn) this.state = this.options.updateFn(this.prevState)(updater);
		else if (isUpdaterFunction(updater)) this.state = updater(this.prevState);
		else this.state = updater;
		(_c = (_b = this.options) == null ? void 0 : _b.onUpdate) == null || _c.call(_b);
		__flush(this);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+store@0.7.7/node_modules/@tanstack/store/dist/esm/derived.js
var Derived = class Derived {
	constructor(options) {
		this.listeners = /* @__PURE__ */ new Set();
		this._subscriptions = [];
		this.lastSeenDepValues = [];
		this.getDepVals = () => {
			const l = this.options.deps.length;
			const prevDepVals = new Array(l);
			const currDepVals = new Array(l);
			for (let i = 0; i < l; i++) {
				const dep = this.options.deps[i];
				prevDepVals[i] = dep.prevState;
				currDepVals[i] = dep.state;
			}
			this.lastSeenDepValues = currDepVals;
			return {
				prevDepVals,
				currDepVals,
				prevVal: this.prevState ?? void 0
			};
		};
		this.recompute = () => {
			var _a, _b;
			this.prevState = this.state;
			const depVals = this.getDepVals();
			this.state = this.options.fn(depVals);
			(_b = (_a = this.options).onUpdate) == null || _b.call(_a);
		};
		this.checkIfRecalculationNeededDeeply = () => {
			for (const dep of this.options.deps) if (dep instanceof Derived) dep.checkIfRecalculationNeededDeeply();
			let shouldRecompute = false;
			const lastSeenDepValues = this.lastSeenDepValues;
			const { currDepVals } = this.getDepVals();
			for (let i = 0; i < currDepVals.length; i++) if (currDepVals[i] !== lastSeenDepValues[i]) {
				shouldRecompute = true;
				break;
			}
			if (shouldRecompute) this.recompute();
		};
		this.mount = () => {
			this.registerOnGraph();
			this.checkIfRecalculationNeededDeeply();
			return () => {
				this.unregisterFromGraph();
				for (const cleanup of this._subscriptions) cleanup();
			};
		};
		this.subscribe = (listener) => {
			var _a, _b;
			this.listeners.add(listener);
			const unsub = (_b = (_a = this.options).onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
			return () => {
				this.listeners.delete(listener);
				unsub?.();
			};
		};
		this.options = options;
		this.state = options.fn({
			prevDepVals: void 0,
			prevVal: void 0,
			currDepVals: this.getDepVals().currDepVals
		});
	}
	registerOnGraph(deps = this.options.deps) {
		for (const dep of deps) if (dep instanceof Derived) {
			dep.registerOnGraph();
			this.registerOnGraph(dep.options.deps);
		} else if (dep instanceof Store) {
			let relatedLinkedDerivedVals = __storeToDerived.get(dep);
			if (!relatedLinkedDerivedVals) {
				relatedLinkedDerivedVals = /* @__PURE__ */ new Set();
				__storeToDerived.set(dep, relatedLinkedDerivedVals);
			}
			relatedLinkedDerivedVals.add(this);
			let relatedStores = __derivedToStore.get(this);
			if (!relatedStores) {
				relatedStores = /* @__PURE__ */ new Set();
				__derivedToStore.set(this, relatedStores);
			}
			relatedStores.add(dep);
		}
	}
	unregisterFromGraph(deps = this.options.deps) {
		for (const dep of deps) if (dep instanceof Derived) this.unregisterFromGraph(dep.options.deps);
		else if (dep instanceof Store) {
			const relatedLinkedDerivedVals = __storeToDerived.get(dep);
			if (relatedLinkedDerivedVals) relatedLinkedDerivedVals.delete(this);
			const relatedStores = __derivedToStore.get(this);
			if (relatedStores) relatedStores.delete(dep);
		}
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+history@1.131.2/node_modules/@tanstack/history/dist/esm/index.js
var stateIndexKey = "__TSR_index";
var popStateEvent = "popstate";
var beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
	let location = opts.getLocation();
	const subscribers = /* @__PURE__ */ new Set();
	const notify = (action) => {
		location = opts.getLocation();
		subscribers.forEach((subscriber) => subscriber({
			location,
			action
		}));
	};
	const handleIndexChange = (action) => {
		if (opts.notifyOnIndexChange ?? true) notify(action);
		else location = opts.getLocation();
	};
	const tryNavigation = async ({ task, navigateOpts, ...actionInfo }) => {
		var _a, _b;
		if ((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false) {
			task();
			return;
		}
		const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
		const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
		if (typeof document !== "undefined" && blockers.length && isPushOrReplace) for (const blocker of blockers) {
			const nextLocation = parseHref(actionInfo.path, actionInfo.state);
			if (await blocker.blockerFn({
				currentLocation: location,
				nextLocation,
				action: actionInfo.type
			})) {
				(_b = opts.onBlocked) == null || _b.call(opts);
				return;
			}
		}
		task();
	};
	return {
		get location() {
			return location;
		},
		get length() {
			return opts.getLength();
		},
		subscribers,
		subscribe: (cb) => {
			subscribers.add(cb);
			return () => {
				subscribers.delete(cb);
			};
		},
		push: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex + 1, state);
			tryNavigation({
				task: () => {
					opts.pushState(path, state);
					notify({ type: "PUSH" });
				},
				navigateOpts,
				type: "PUSH",
				path,
				state
			});
		},
		replace: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex, state);
			tryNavigation({
				task: () => {
					opts.replaceState(path, state);
					notify({ type: "REPLACE" });
				},
				navigateOpts,
				type: "REPLACE",
				path,
				state
			});
		},
		go: (index, navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.go(index);
					handleIndexChange({
						type: "GO",
						index
					});
				},
				navigateOpts,
				type: "GO"
			});
		},
		back: (navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.back((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
					handleIndexChange({ type: "BACK" });
				},
				navigateOpts,
				type: "BACK"
			});
		},
		forward: (navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.forward((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
					handleIndexChange({ type: "FORWARD" });
				},
				navigateOpts,
				type: "FORWARD"
			});
		},
		canGoBack: () => location.state[stateIndexKey] !== 0,
		createHref: (str) => opts.createHref(str),
		block: (blocker) => {
			var _a;
			if (!opts.setBlockers) return () => {};
			const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
			opts.setBlockers([...blockers, blocker]);
			return () => {
				var _a2, _b;
				const blockers2 = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
				(_b = opts.setBlockers) == null || _b.call(opts, blockers2.filter((b) => b !== blocker));
			};
		},
		flush: () => {
			var _a;
			return (_a = opts.flush) == null ? void 0 : _a.call(opts);
		},
		destroy: () => {
			var _a;
			return (_a = opts.destroy) == null ? void 0 : _a.call(opts);
		},
		notify
	};
}
function assignKeyAndIndex(index, state) {
	if (!state) state = {};
	const key = createRandomKey();
	return {
		...state,
		key,
		__TSR_key: key,
		[stateIndexKey]: index
	};
}
function createBrowserHistory(opts) {
	var _a, _b;
	const win = (opts == null ? void 0 : opts.window) ?? (typeof document !== "undefined" ? window : void 0);
	const originalPushState = win.history.pushState;
	const originalReplaceState = win.history.replaceState;
	let blockers = [];
	const _getBlockers = () => blockers;
	const _setBlockers = (newBlockers) => blockers = newBlockers;
	const createHref = (opts == null ? void 0 : opts.createHref) ?? ((path) => path);
	const parseLocation = (opts == null ? void 0 : opts.parseLocation) ?? (() => parseHref(`${win.location.pathname}${win.location.search}${win.location.hash}`, win.history.state));
	if (!((_a = win.history.state) == null ? void 0 : _a.__TSR_key) && !((_b = win.history.state) == null ? void 0 : _b.key)) {
		const addedKey = createRandomKey();
		win.history.replaceState({
			[stateIndexKey]: 0,
			key: addedKey,
			__TSR_key: addedKey
		}, "");
	}
	let currentLocation = parseLocation();
	let rollbackLocation;
	let nextPopIsGo = false;
	let ignoreNextPop = false;
	let skipBlockerNextPop = false;
	let ignoreNextBeforeUnload = false;
	const getLocation = () => currentLocation;
	let next;
	let scheduled;
	const flush = () => {
		if (!next) return;
		history._ignoreSubscribers = true;
		(next.isPush ? win.history.pushState : win.history.replaceState)(next.state, "", next.href);
		history._ignoreSubscribers = false;
		next = void 0;
		scheduled = void 0;
		rollbackLocation = void 0;
	};
	const queueHistoryAction = (type, destHref, state) => {
		const href = createHref(destHref);
		if (!scheduled) rollbackLocation = currentLocation;
		currentLocation = parseHref(destHref, state);
		next = {
			href,
			state,
			isPush: (next == null ? void 0 : next.isPush) || type === "push"
		};
		if (!scheduled) scheduled = Promise.resolve().then(() => flush());
	};
	const onPushPop = (type) => {
		currentLocation = parseLocation();
		history.notify({ type });
	};
	const onPushPopEvent = async () => {
		if (ignoreNextPop) {
			ignoreNextPop = false;
			return;
		}
		const nextLocation = parseLocation();
		const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
		const isForward = delta === 1;
		const isBack = delta === -1;
		const isGo = !isForward && !isBack || nextPopIsGo;
		nextPopIsGo = false;
		const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
		const notify = isGo ? {
			type: "GO",
			index: delta
		} : { type: isBack ? "BACK" : "FORWARD" };
		if (skipBlockerNextPop) skipBlockerNextPop = false;
		else {
			const blockers2 = _getBlockers();
			if (typeof document !== "undefined" && blockers2.length) {
				for (const blocker of blockers2) if (await blocker.blockerFn({
					currentLocation,
					nextLocation,
					action
				})) {
					ignoreNextPop = true;
					win.history.go(1);
					history.notify(notify);
					return;
				}
			}
		}
		currentLocation = parseLocation();
		history.notify(notify);
	};
	const onBeforeUnload = (e) => {
		if (ignoreNextBeforeUnload) {
			ignoreNextBeforeUnload = false;
			return;
		}
		let shouldBlock = false;
		const blockers2 = _getBlockers();
		if (typeof document !== "undefined" && blockers2.length) for (const blocker of blockers2) {
			const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
			if (shouldHaveBeforeUnload === true) {
				shouldBlock = true;
				break;
			}
			if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
				shouldBlock = true;
				break;
			}
		}
		if (shouldBlock) {
			e.preventDefault();
			return e.returnValue = "";
		}
	};
	const history = createHistory({
		getLocation,
		getLength: () => win.history.length,
		pushState: (href, state) => queueHistoryAction("push", href, state),
		replaceState: (href, state) => queueHistoryAction("replace", href, state),
		back: (ignoreBlocker) => {
			if (ignoreBlocker) skipBlockerNextPop = true;
			ignoreNextBeforeUnload = true;
			return win.history.back();
		},
		forward: (ignoreBlocker) => {
			if (ignoreBlocker) skipBlockerNextPop = true;
			ignoreNextBeforeUnload = true;
			win.history.forward();
		},
		go: (n) => {
			nextPopIsGo = true;
			win.history.go(n);
		},
		createHref: (href) => createHref(href),
		flush,
		destroy: () => {
			win.history.pushState = originalPushState;
			win.history.replaceState = originalReplaceState;
			win.removeEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
			win.removeEventListener(popStateEvent, onPushPopEvent);
		},
		onBlocked: () => {
			if (rollbackLocation && currentLocation !== rollbackLocation) currentLocation = rollbackLocation;
		},
		getBlockers: _getBlockers,
		setBlockers: _setBlockers,
		notifyOnIndexChange: false
	});
	win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
	win.addEventListener(popStateEvent, onPushPopEvent);
	win.history.pushState = function(...args) {
		const res = originalPushState.apply(win.history, args);
		if (!history._ignoreSubscribers) onPushPop("PUSH");
		return res;
	};
	win.history.replaceState = function(...args) {
		const res = originalReplaceState.apply(win.history, args);
		if (!history._ignoreSubscribers) onPushPop("REPLACE");
		return res;
	};
	return history;
}
function createMemoryHistory(opts = { initialEntries: ["/"] }) {
	const entries = opts.initialEntries;
	let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
	const states = entries.map((_entry, index2) => assignKeyAndIndex(index2, void 0));
	const getLocation = () => parseHref(entries[index], states[index]);
	return createHistory({
		getLocation,
		getLength: () => entries.length,
		pushState: (path, state) => {
			if (index < entries.length - 1) {
				entries.splice(index + 1);
				states.splice(index + 1);
			}
			states.push(state);
			entries.push(path);
			index = Math.max(entries.length - 1, 0);
		},
		replaceState: (path, state) => {
			states[index] = state;
			entries[index] = path;
		},
		back: () => {
			index = Math.max(index - 1, 0);
		},
		forward: () => {
			index = Math.min(index + 1, entries.length - 1);
		},
		go: (n) => {
			index = Math.min(Math.max(index + n, 0), entries.length - 1);
		},
		createHref: (path) => path
	});
}
function parseHref(href, state) {
	const hashIndex = href.indexOf("#");
	const searchIndex = href.indexOf("?");
	const addedKey = createRandomKey();
	return {
		href,
		pathname: href.substring(0, hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length),
		hash: hashIndex > -1 ? href.substring(hashIndex) : "",
		search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
		state: state || {
			[stateIndexKey]: 0,
			key: addedKey,
			__TSR_key: addedKey
		}
	};
}
function createRandomKey() {
	return (Math.random() + 1).toString(36).substring(7);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/utils.js
function last(arr) {
	return arr[arr.length - 1];
}
function isFunction(d) {
	return typeof d === "function";
}
function functionalUpdate(updater, previous) {
	if (isFunction(updater)) return updater(previous);
	return updater;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(prev, _next) {
	if (prev === _next) return prev;
	const next = _next;
	const array = isPlainArray(prev) && isPlainArray(next);
	if (!array && !(isPlainObject(prev) && isPlainObject(next))) return next;
	const prevItems = array ? prev : getEnumerableOwnKeys(prev);
	if (!prevItems) return next;
	const nextItems = array ? next : getEnumerableOwnKeys(next);
	if (!nextItems) return next;
	const prevSize = prevItems.length;
	const nextSize = nextItems.length;
	const copy = array ? new Array(nextSize) : {};
	let equalItems = 0;
	for (let i = 0; i < nextSize; i++) {
		const key = array ? i : nextItems[i];
		const p = prev[key];
		const n = next[key];
		if (p === n) {
			copy[key] = p;
			if (array ? i < prevSize : hasOwn.call(prev, key)) equalItems++;
			continue;
		}
		if (p === null || n === null || typeof p !== "object" || typeof n !== "object") {
			copy[key] = n;
			continue;
		}
		const v = replaceEqualDeep(p, n);
		copy[key] = v;
		if (v === p) equalItems++;
	}
	return prevSize === nextSize && equalItems === prevSize ? prev : copy;
}
function getEnumerableOwnKeys(o) {
	const keys = [];
	const names = Object.getOwnPropertyNames(o);
	for (const name of names) {
		if (!Object.prototype.propertyIsEnumerable.call(o, name)) return false;
		keys.push(name);
	}
	const symbols = Object.getOwnPropertySymbols(o);
	for (const symbol of symbols) {
		if (!Object.prototype.propertyIsEnumerable.call(o, symbol)) return false;
		keys.push(symbol);
	}
	return keys;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (typeof ctor === "undefined") return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function deepEqual(a, b, opts) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0, l = a.length; i < l; i++) if (!deepEqual(a[i], b[i], opts)) return false;
		return true;
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		const ignoreUndefined = (opts == null ? void 0 : opts.ignoreUndefined) ?? true;
		if (opts == null ? void 0 : opts.partial) {
			for (const k in b) if (!ignoreUndefined || b[k] !== void 0) {
				if (!deepEqual(a[k], b[k], opts)) return false;
			}
			return true;
		}
		let aCount = 0;
		if (!ignoreUndefined) aCount = Object.keys(a).length;
		else for (const k in a) if (a[k] !== void 0) aCount++;
		let bCount = 0;
		for (const k in b) if (!ignoreUndefined || b[k] !== void 0) {
			bCount++;
			if (bCount > aCount || !deepEqual(a[k], b[k], opts)) return false;
		}
		return aCount === bCount;
	}
	return false;
}
function createControlledPromise(onResolve) {
	let resolveLoadPromise;
	let rejectLoadPromise;
	const controlledPromise = new Promise((resolve, reject) => {
		resolveLoadPromise = resolve;
		rejectLoadPromise = reject;
	});
	controlledPromise.status = "pending";
	controlledPromise.resolve = (value) => {
		controlledPromise.status = "resolved";
		controlledPromise.value = value;
		resolveLoadPromise(value);
		onResolve?.(value);
	};
	controlledPromise.reject = (e) => {
		controlledPromise.status = "rejected";
		rejectLoadPromise(e);
	};
	return controlledPromise;
}
function isPromise(value) {
	return Boolean(value && typeof value === "object" && typeof value.then === "function");
}
function joinPaths(paths) {
	return cleanPath(paths.filter((val) => {
		return val !== void 0;
	}).join("/"));
}
function cleanPath(path) {
	return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
	return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
	return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
	return trimPathRight(trimPathLeft(path));
}
function removeTrailingSlash(value, basepath) {
	if ((value == null ? void 0 : value.endsWith("/")) && value !== "/" && value !== `${basepath}/`) return value.slice(0, -1);
	return value;
}
function exactPathTest(pathName1, pathName2, basepath) {
	return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
function segmentToString(segment) {
	const { type, value } = segment;
	if (type === 0) return value;
	const { prefixSegment, suffixSegment } = segment;
	if (type === 1) {
		const param = value.substring(1);
		if (prefixSegment && suffixSegment) return `${prefixSegment}{$${param}}${suffixSegment}`;
		else if (prefixSegment) return `${prefixSegment}{$${param}}`;
		else if (suffixSegment) return `{$${param}}${suffixSegment}`;
	}
	if (type === 3) {
		const param = value.substring(1);
		if (prefixSegment && suffixSegment) return `${prefixSegment}{-$${param}}${suffixSegment}`;
		else if (prefixSegment) return `${prefixSegment}{-$${param}}`;
		else if (suffixSegment) return `{-$${param}}${suffixSegment}`;
		return `{-$${param}}`;
	}
	if (type === 2) {
		if (prefixSegment && suffixSegment) return `${prefixSegment}{$}${suffixSegment}`;
		else if (prefixSegment) return `${prefixSegment}{$}`;
		else if (suffixSegment) return `{$}${suffixSegment}`;
	}
	return value;
}
function resolvePath({ basepath, base, to, trailingSlash = "never", caseSensitive, parseCache }) {
	var _a;
	base = removeBasepath(basepath, base, caseSensitive);
	to = removeBasepath(basepath, to, caseSensitive);
	let baseSegments = parseBasePathSegments(base, parseCache).slice();
	const toSegments = parseRoutePathSegments(to, parseCache);
	if (baseSegments.length > 1 && ((_a = last(baseSegments)) == null ? void 0 : _a.value) === "/") baseSegments.pop();
	for (let index = 0, length = toSegments.length; index < length; index++) {
		const toSegment = toSegments[index];
		const value = toSegment.value;
		if (value === "/") {
			if (!index) baseSegments = [toSegment];
			else if (index === length - 1) baseSegments.push(toSegment);
		} else if (value === "..") baseSegments.pop();
		else if (value === ".");
		else baseSegments.push(toSegment);
	}
	if (baseSegments.length > 1) {
		if (last(baseSegments).value === "/") {
			if (trailingSlash === "never") baseSegments.pop();
		} else if (trailingSlash === "always") baseSegments.push({
			type: 0,
			value: "/"
		});
	}
	return joinPaths([basepath, ...baseSegments.map(segmentToString)]);
}
var parseBasePathSegments = (pathname, cache) => parsePathname(pathname, cache, true);
var parseRoutePathSegments = (pathname, cache) => parsePathname(pathname, cache, false);
var parsePathname = (pathname, cache, basePathValues) => {
	if (!pathname) return [];
	const cached = cache == null ? void 0 : cache.get(pathname);
	if (cached) return cached;
	const parsed = baseParsePathname(pathname, basePathValues);
	cache?.set(pathname, parsed);
	return parsed;
};
var PARAM_RE = /^\$.{1,}$/;
var PARAM_W_CURLY_BRACES_RE = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
var OPTIONAL_PARAM_W_CURLY_BRACES_RE = /^(.*?)\{-(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
var WILDCARD_RE = /^\$$/;
var WILDCARD_W_CURLY_BRACES_RE = /^(.*?)\{\$\}(.*)$/;
function baseParsePathname(pathname, basePathValues) {
	pathname = cleanPath(pathname);
	const segments = [];
	if (pathname.slice(0, 1) === "/") {
		pathname = pathname.substring(1);
		segments.push({
			type: 0,
			value: "/"
		});
	}
	if (!pathname) return segments;
	const split = pathname.split("/").filter(Boolean);
	segments.push(...split.map((part) => {
		const partToMatch = !basePathValues && part.slice(-1) === "_" ? part.slice(0, -1) : part;
		const wildcardBracesMatch = partToMatch.match(WILDCARD_W_CURLY_BRACES_RE);
		if (wildcardBracesMatch) {
			const prefix = wildcardBracesMatch[1];
			const suffix = wildcardBracesMatch[2];
			return {
				type: 2,
				value: "$",
				prefixSegment: prefix || void 0,
				suffixSegment: suffix || void 0
			};
		}
		const optionalParamBracesMatch = partToMatch.match(OPTIONAL_PARAM_W_CURLY_BRACES_RE);
		if (optionalParamBracesMatch) {
			const prefix = optionalParamBracesMatch[1];
			const paramName = optionalParamBracesMatch[2];
			const suffix = optionalParamBracesMatch[3];
			return {
				type: 3,
				value: paramName,
				prefixSegment: prefix || void 0,
				suffixSegment: suffix || void 0
			};
		}
		const paramBracesMatch = partToMatch.match(PARAM_W_CURLY_BRACES_RE);
		if (paramBracesMatch) {
			const prefix = paramBracesMatch[1];
			const paramName = paramBracesMatch[2];
			const suffix = paramBracesMatch[3];
			return {
				type: 1,
				value: "" + paramName,
				prefixSegment: prefix || void 0,
				suffixSegment: suffix || void 0
			};
		}
		if (PARAM_RE.test(partToMatch)) return {
			type: 1,
			value: "$" + partToMatch.substring(1),
			prefixSegment: void 0,
			suffixSegment: void 0
		};
		if (WILDCARD_RE.test(partToMatch)) return {
			type: 2,
			value: "$",
			prefixSegment: void 0,
			suffixSegment: void 0
		};
		return {
			type: 0,
			value: partToMatch.includes("%25") ? partToMatch.split("%25").map((segment) => decodeURI(segment)).join("%25") : decodeURI(partToMatch)
		};
	}));
	if (pathname.slice(-1) === "/") {
		pathname = pathname.substring(1);
		segments.push({
			type: 0,
			value: "/"
		});
	}
	return segments;
}
function interpolatePath({ path, params, leaveWildcards, leaveParams, decodeCharMap, parseCache }) {
	const interpolatedPathSegments = parseRoutePathSegments(path, parseCache);
	function encodeParam(key) {
		const value = params[key];
		const isValueString = typeof value === "string";
		if (key === "*" || key === "_splat") return isValueString ? encodeURI(value) : value;
		else return isValueString ? encodePathParam(value, decodeCharMap) : value;
	}
	let isMissingParams = false;
	const usedParams = {};
	return {
		usedParams,
		interpolatedPath: joinPaths(interpolatedPathSegments.map((segment) => {
			if (segment.type === 0) return segment.value;
			if (segment.type === 2) {
				usedParams._splat = params._splat;
				usedParams["*"] = params._splat;
				const segmentPrefix = segment.prefixSegment || "";
				const segmentSuffix = segment.suffixSegment || "";
				if (!("_splat" in params)) {
					isMissingParams = true;
					if (leaveWildcards) return `${segmentPrefix}${segment.value}${segmentSuffix}`;
					if (segmentPrefix || segmentSuffix) return `${segmentPrefix}${segmentSuffix}`;
					return;
				}
				const value = encodeParam("_splat");
				if (leaveWildcards) return `${segmentPrefix}${segment.value}${value ?? ""}${segmentSuffix}`;
				return `${segmentPrefix}${value}${segmentSuffix}`;
			}
			if (segment.type === 1) {
				const key = segment.value.substring(1);
				if (!isMissingParams && !(key in params)) isMissingParams = true;
				usedParams[key] = params[key];
				const segmentPrefix = segment.prefixSegment || "";
				const segmentSuffix = segment.suffixSegment || "";
				if (leaveParams) {
					const value = encodeParam(segment.value);
					return `${segmentPrefix}${segment.value}${value ?? ""}${segmentSuffix}`;
				}
				return `${segmentPrefix}${encodeParam(key) ?? "undefined"}${segmentSuffix}`;
			}
			if (segment.type === 3) {
				const key = segment.value.substring(1);
				const segmentPrefix = segment.prefixSegment || "";
				const segmentSuffix = segment.suffixSegment || "";
				if (!(key in params) || params[key] == null) {
					if (leaveWildcards) return `${segmentPrefix}${key}${segmentSuffix}`;
					if (segmentPrefix || segmentSuffix) return `${segmentPrefix}${segmentSuffix}`;
					return;
				}
				usedParams[key] = params[key];
				if (leaveParams) {
					const value = encodeParam(segment.value);
					return `${segmentPrefix}${segment.value}${value ?? ""}${segmentSuffix}`;
				}
				if (leaveWildcards) return `${segmentPrefix}${key}${encodeParam(key) ?? ""}${segmentSuffix}`;
				return `${segmentPrefix}${encodeParam(key) ?? ""}${segmentSuffix}`;
			}
			return segment.value;
		})),
		isMissingParams
	};
}
function encodePathParam(value, decodeCharMap) {
	let encoded = encodeURIComponent(value);
	if (decodeCharMap) for (const [encodedChar, char] of decodeCharMap) encoded = encoded.replaceAll(encodedChar, char);
	return encoded;
}
function matchPathname(basepath, currentPathname, matchLocation, parseCache) {
	const pathParams = matchByPath(basepath, currentPathname, matchLocation, parseCache);
	if (matchLocation.to && !pathParams) return;
	return pathParams ?? {};
}
function removeBasepath(basepath, pathname, caseSensitive = false) {
	const normalizedBasepath = caseSensitive ? basepath : basepath.toLowerCase();
	const normalizedPathname = caseSensitive ? pathname : pathname.toLowerCase();
	switch (true) {
		case normalizedBasepath === "/": return pathname;
		case normalizedPathname === normalizedBasepath: return "";
		case pathname.length < basepath.length: return pathname;
		case normalizedPathname[normalizedBasepath.length] !== "/": return pathname;
		case normalizedPathname.startsWith(normalizedBasepath): return pathname.slice(basepath.length);
		default: return pathname;
	}
}
function matchByPath(basepath, from, { to, fuzzy, caseSensitive }, parseCache) {
	if (basepath !== "/" && !from.startsWith(basepath)) return;
	from = removeBasepath(basepath, from, caseSensitive);
	to = removeBasepath(basepath, `${to ?? "$"}`, caseSensitive);
	const baseSegments = parseBasePathSegments(from.startsWith("/") ? from : `/${from}`, parseCache);
	const routeSegments = parseRoutePathSegments(to.startsWith("/") ? to : `/${to}`, parseCache);
	const params = {};
	return isMatch(baseSegments, routeSegments, params, fuzzy, caseSensitive) ? params : void 0;
}
function isMatch(baseSegments, routeSegments, params, fuzzy, caseSensitive) {
	var _a, _b, _c;
	let baseIndex = 0;
	let routeIndex = 0;
	while (baseIndex < baseSegments.length || routeIndex < routeSegments.length) {
		const baseSegment = baseSegments[baseIndex];
		const routeSegment = routeSegments[routeIndex];
		if (routeSegment) {
			if (routeSegment.type === 2) {
				const remainingBaseSegments = baseSegments.slice(baseIndex);
				let _splat;
				if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
					if (!baseSegment) return false;
					const prefix = routeSegment.prefixSegment || "";
					const suffix = routeSegment.suffixSegment || "";
					const baseValue = baseSegment.value;
					if ("prefixSegment" in routeSegment) {
						if (!baseValue.startsWith(prefix)) return false;
					}
					if ("suffixSegment" in routeSegment) {
						if (!((_a = baseSegments[baseSegments.length - 1]) == null ? void 0 : _a.value.endsWith(suffix))) return false;
					}
					let rejoinedSplat = decodeURI(joinPaths(remainingBaseSegments.map((d) => d.value)));
					if (prefix && rejoinedSplat.startsWith(prefix)) rejoinedSplat = rejoinedSplat.slice(prefix.length);
					if (suffix && rejoinedSplat.endsWith(suffix)) rejoinedSplat = rejoinedSplat.slice(0, rejoinedSplat.length - suffix.length);
					_splat = rejoinedSplat;
				} else _splat = decodeURI(joinPaths(remainingBaseSegments.map((d) => d.value)));
				params["*"] = _splat;
				params["_splat"] = _splat;
				return true;
			}
			if (routeSegment.type === 0) {
				if (routeSegment.value === "/" && !(baseSegment == null ? void 0 : baseSegment.value)) {
					routeIndex++;
					continue;
				}
				if (baseSegment) {
					if (caseSensitive) {
						if (routeSegment.value !== baseSegment.value) return false;
					} else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) return false;
					baseIndex++;
					routeIndex++;
					continue;
				} else return false;
			}
			if (routeSegment.type === 1) {
				if (!baseSegment) return false;
				if (baseSegment.value === "/") return false;
				let _paramValue = "";
				let matched = false;
				if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
					const prefix = routeSegment.prefixSegment || "";
					const suffix = routeSegment.suffixSegment || "";
					const baseValue = baseSegment.value;
					if (prefix && !baseValue.startsWith(prefix)) return false;
					if (suffix && !baseValue.endsWith(suffix)) return false;
					let paramValue = baseValue;
					if (prefix && paramValue.startsWith(prefix)) paramValue = paramValue.slice(prefix.length);
					if (suffix && paramValue.endsWith(suffix)) paramValue = paramValue.slice(0, paramValue.length - suffix.length);
					_paramValue = decodeURIComponent(paramValue);
					matched = true;
				} else {
					_paramValue = decodeURIComponent(baseSegment.value);
					matched = true;
				}
				if (matched) {
					params[routeSegment.value.substring(1)] = _paramValue;
					baseIndex++;
				}
				routeIndex++;
				continue;
			}
			if (routeSegment.type === 3) {
				if (!baseSegment) {
					routeIndex++;
					continue;
				}
				if (baseSegment.value === "/") {
					routeIndex++;
					continue;
				}
				let _paramValue = "";
				let matched = false;
				if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
					const prefix = routeSegment.prefixSegment || "";
					const suffix = routeSegment.suffixSegment || "";
					const baseValue = baseSegment.value;
					if ((!prefix || baseValue.startsWith(prefix)) && (!suffix || baseValue.endsWith(suffix))) {
						let paramValue = baseValue;
						if (prefix && paramValue.startsWith(prefix)) paramValue = paramValue.slice(prefix.length);
						if (suffix && paramValue.endsWith(suffix)) paramValue = paramValue.slice(0, paramValue.length - suffix.length);
						_paramValue = decodeURIComponent(paramValue);
						matched = true;
					}
				} else {
					let shouldMatchOptional = true;
					for (let lookAhead = routeIndex + 1; lookAhead < routeSegments.length; lookAhead++) {
						const futureRouteSegment = routeSegments[lookAhead];
						if ((futureRouteSegment == null ? void 0 : futureRouteSegment.type) === 0 && futureRouteSegment.value === baseSegment.value) {
							shouldMatchOptional = false;
							break;
						}
						if ((futureRouteSegment == null ? void 0 : futureRouteSegment.type) === 1 || (futureRouteSegment == null ? void 0 : futureRouteSegment.type) === 2) {
							if (baseSegments.length < routeSegments.length) shouldMatchOptional = false;
							break;
						}
					}
					if (shouldMatchOptional) {
						_paramValue = decodeURIComponent(baseSegment.value);
						matched = true;
					}
				}
				if (matched) {
					params[routeSegment.value.substring(1)] = _paramValue;
					baseIndex++;
				}
				routeIndex++;
				continue;
			}
		}
		if (baseIndex < baseSegments.length && routeIndex >= routeSegments.length) {
			params["**"] = joinPaths(baseSegments.slice(baseIndex).map((d) => d.value));
			return !!fuzzy && ((_b = routeSegments[routeSegments.length - 1]) == null ? void 0 : _b.value) !== "/";
		}
		if (routeIndex < routeSegments.length && baseIndex >= baseSegments.length) {
			for (let i = routeIndex; i < routeSegments.length; i++) if (((_c = routeSegments[i]) == null ? void 0 : _c.type) !== 3) return false;
			break;
		}
		break;
	}
	return true;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/process-route-tree.js
var SLASH_SCORE = .75;
var STATIC_SEGMENT_SCORE = 1;
var REQUIRED_PARAM_BASE_SCORE = .5;
var OPTIONAL_PARAM_BASE_SCORE = .4;
var WILDCARD_PARAM_BASE_SCORE = .25;
var STATIC_AFTER_DYNAMIC_BONUS_SCORE = .2;
var BOTH_PRESENCE_BASE_SCORE = .05;
var PREFIX_PRESENCE_BASE_SCORE = .02;
var SUFFIX_PRESENCE_BASE_SCORE = .01;
var PREFIX_LENGTH_SCORE_MULTIPLIER = 2e-4;
var SUFFIX_LENGTH_SCORE_MULTIPLIER = 1e-4;
function handleParam(segment, baseScore) {
	if (segment.prefixSegment && segment.suffixSegment) return baseScore + BOTH_PRESENCE_BASE_SCORE + PREFIX_LENGTH_SCORE_MULTIPLIER * segment.prefixSegment.length + SUFFIX_LENGTH_SCORE_MULTIPLIER * segment.suffixSegment.length;
	if (segment.prefixSegment) return baseScore + PREFIX_PRESENCE_BASE_SCORE + PREFIX_LENGTH_SCORE_MULTIPLIER * segment.prefixSegment.length;
	if (segment.suffixSegment) return baseScore + SUFFIX_PRESENCE_BASE_SCORE + SUFFIX_LENGTH_SCORE_MULTIPLIER * segment.suffixSegment.length;
	return baseScore;
}
function sortRoutes(routes) {
	const scoredRoutes = [];
	routes.forEach((d, i) => {
		var _a;
		if (d.isRoot || !d.path) return;
		const trimmed = trimPathLeft(d.fullPath);
		let parsed = parseRoutePathSegments(trimmed);
		let skip = 0;
		while (parsed.length > skip + 1 && ((_a = parsed[skip]) == null ? void 0 : _a.value) === "/") skip++;
		if (skip > 0) parsed = parsed.slice(skip);
		let optionalParamCount = 0;
		let hasStaticAfter = false;
		const scores = parsed.map((segment, index) => {
			if (segment.value === "/") return SLASH_SCORE;
			if (segment.type === 0) return STATIC_SEGMENT_SCORE;
			let baseScore = void 0;
			if (segment.type === 1) baseScore = REQUIRED_PARAM_BASE_SCORE;
			else if (segment.type === 3) {
				baseScore = OPTIONAL_PARAM_BASE_SCORE;
				optionalParamCount++;
			} else baseScore = WILDCARD_PARAM_BASE_SCORE;
			for (let i2 = index + 1; i2 < parsed.length; i2++) {
				const nextSegment = parsed[i2];
				if (nextSegment.type === 0 && nextSegment.value !== "/") {
					hasStaticAfter = true;
					return handleParam(segment, baseScore + STATIC_AFTER_DYNAMIC_BONUS_SCORE);
				}
			}
			return handleParam(segment, baseScore);
		});
		scoredRoutes.push({
			child: d,
			trimmed,
			parsed,
			index: i,
			scores,
			optionalParamCount,
			hasStaticAfter
		});
	});
	return scoredRoutes.sort((a, b) => {
		const minLength = Math.min(a.scores.length, b.scores.length);
		for (let i = 0; i < minLength; i++) if (a.scores[i] !== b.scores[i]) return b.scores[i] - a.scores[i];
		if (a.scores.length !== b.scores.length) {
			if (a.optionalParamCount !== b.optionalParamCount) {
				if (a.hasStaticAfter === b.hasStaticAfter) return a.optionalParamCount - b.optionalParamCount;
				else if (a.hasStaticAfter && !b.hasStaticAfter) return -1;
				else if (!a.hasStaticAfter && b.hasStaticAfter) return 1;
			}
			return b.scores.length - a.scores.length;
		}
		for (let i = 0; i < minLength; i++) if (a.parsed[i].value !== b.parsed[i].value) return a.parsed[i].value > b.parsed[i].value ? 1 : -1;
		return a.index - b.index;
	}).map((d, i) => {
		d.child.rank = i;
		return d.child;
	});
}
function processRouteTree({ routeTree, initRoute }) {
	const routesById = {};
	const routesByPath = {};
	const recurseRoutes = (childRoutes) => {
		childRoutes.forEach((childRoute, i) => {
			initRoute?.(childRoute, i);
			const existingRoute = routesById[childRoute.id];
			invariant(!existingRoute, `Duplicate routes found with id: ${String(childRoute.id)}`);
			routesById[childRoute.id] = childRoute;
			if (!childRoute.isRoot && childRoute.path) {
				const trimmedFullPath = trimPathRight(childRoute.fullPath);
				if (!routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) routesByPath[trimmedFullPath] = childRoute;
			}
			const children = childRoute.children;
			if (children == null ? void 0 : children.length) recurseRoutes(children);
		});
	};
	recurseRoutes([routeTree]);
	return {
		routesById,
		routesByPath,
		flatRoutes: sortRoutes(Object.values(routesById))
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/not-found.js
function isNotFound(obj) {
	return !!(obj == null ? void 0 : obj.isNotFound);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/scroll-restoration.js
function getSafeSessionStorage() {
	try {
		if (typeof window !== "undefined" && typeof window.sessionStorage === "object") return window.sessionStorage;
	} catch {}
}
var storageKey = "tsr-scroll-restoration-v1_3";
var throttle = (fn, wait) => {
	let timeout;
	return (...args) => {
		if (!timeout) timeout = setTimeout(() => {
			fn(...args);
			timeout = null;
		}, wait);
	};
};
function createScrollRestorationCache() {
	const safeSessionStorage = getSafeSessionStorage();
	if (!safeSessionStorage) return;
	const persistedState = safeSessionStorage.getItem(storageKey);
	let state = persistedState ? JSON.parse(persistedState) : {};
	return {
		state,
		set: (updater) => (state = functionalUpdate(updater, state) || state, safeSessionStorage.setItem(storageKey, JSON.stringify(state)))
	};
}
var scrollRestorationCache = createScrollRestorationCache();
var defaultGetScrollRestorationKey = (location) => {
	return location.state.__TSR_key || location.href;
};
function getCssSelector(el) {
	const path = [];
	let parent;
	while (parent = el.parentNode) {
		path.push(`${el.tagName}:nth-child(${Array.prototype.indexOf.call(parent.children, el) + 1})`);
		el = parent;
	}
	return `${path.reverse().join(" > ")}`.toLowerCase();
}
var ignoreScroll = false;
function restoreScroll({ storageKey: storageKey2, key, behavior, shouldScrollRestoration, scrollToTopSelectors, location }) {
	var _a, _b;
	let byKey;
	try {
		byKey = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
	} catch (error) {
		console.error(error);
		return;
	}
	const resolvedKey = key || ((_a = window.history.state) == null ? void 0 : _a.key);
	const elementEntries = byKey[resolvedKey];
	ignoreScroll = true;
	scroll: {
		if (shouldScrollRestoration && elementEntries && Object.keys(elementEntries).length > 0) {
			for (const elementSelector in elementEntries) {
				const entry = elementEntries[elementSelector];
				if (elementSelector === "window") window.scrollTo({
					top: entry.scrollY,
					left: entry.scrollX,
					behavior
				});
				else if (elementSelector) {
					const element = document.querySelector(elementSelector);
					if (element) {
						element.scrollLeft = entry.scrollX;
						element.scrollTop = entry.scrollY;
					}
				}
			}
			break scroll;
		}
		const hash = (location ?? window.location).hash.split("#", 2)[1];
		if (hash) {
			const hashScrollIntoViewOptions = ((_b = window.history.state) == null ? void 0 : _b.__hashScrollIntoViewOptions) ?? true;
			if (hashScrollIntoViewOptions) {
				const el = document.getElementById(hash);
				if (el) el.scrollIntoView(hashScrollIntoViewOptions);
			}
			break scroll;
		}
		const scrollOptions = {
			top: 0,
			left: 0,
			behavior
		};
		window.scrollTo(scrollOptions);
		if (scrollToTopSelectors) for (const selector of scrollToTopSelectors) {
			if (selector === "window") continue;
			const element = typeof selector === "function" ? selector() : document.querySelector(selector);
			if (element) element.scrollTo(scrollOptions);
		}
	}
	ignoreScroll = false;
}
function setupScrollRestoration(router, force) {
	if (scrollRestorationCache === void 0) return;
	if (force ?? router.options.scrollRestoration ?? false) router.isScrollRestoring = true;
	if (typeof document === "undefined" || router.isScrollRestorationSetup) return;
	router.isScrollRestorationSetup = true;
	ignoreScroll = false;
	const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
	window.history.scrollRestoration = "manual";
	const onScroll = (event) => {
		if (ignoreScroll || !router.isScrollRestoring) return;
		let elementSelector = "";
		if (event.target === document || event.target === window) elementSelector = "window";
		else {
			const attrId = event.target.getAttribute("data-scroll-restoration-id");
			if (attrId) elementSelector = `[data-scroll-restoration-id="${attrId}"]`;
			else elementSelector = getCssSelector(event.target);
		}
		const restoreKey = getKey(router.state.location);
		scrollRestorationCache.set((state) => {
			const keyEntry = state[restoreKey] || (state[restoreKey] = {});
			const elementEntry = keyEntry[elementSelector] || (keyEntry[elementSelector] = {});
			if (elementSelector === "window") {
				elementEntry.scrollX = window.scrollX || 0;
				elementEntry.scrollY = window.scrollY || 0;
			} else if (elementSelector) {
				const element = document.querySelector(elementSelector);
				if (element) {
					elementEntry.scrollX = element.scrollLeft || 0;
					elementEntry.scrollY = element.scrollTop || 0;
				}
			}
			return state;
		});
	};
	if (typeof document !== "undefined") document.addEventListener("scroll", throttle(onScroll, 100), true);
	router.subscribe("onRendered", (event) => {
		const cacheKey = getKey(event.toLocation);
		if (!router.resetNextScroll) {
			router.resetNextScroll = true;
			return;
		}
		restoreScroll({
			storageKey,
			key: cacheKey,
			behavior: router.options.scrollRestorationBehavior,
			shouldScrollRestoration: router.isScrollRestoring,
			scrollToTopSelectors: router.options.scrollToTopSelectors,
			location: router.history.location
		});
		if (router.isScrollRestoring) scrollRestorationCache.set((state) => {
			state[cacheKey] || (state[cacheKey] = {});
			return state;
		});
	});
}
function handleHashScroll(router) {
	if (typeof document !== "undefined" && document.querySelector) {
		const hashScrollIntoViewOptions = router.state.location.state.__hashScrollIntoViewOptions ?? true;
		if (hashScrollIntoViewOptions && router.state.location.hash !== "") {
			const el = document.getElementById(router.state.location.hash);
			if (el) el.scrollIntoView(hashScrollIntoViewOptions);
		}
	}
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/qss.js
function encode(obj, stringify = String) {
	const result = new URLSearchParams();
	for (const key in obj) {
		const val = obj[key];
		if (val !== void 0) result.set(key, stringify(val));
	}
	return result.toString();
}
function toValue(str) {
	if (!str) return "";
	if (str === "false") return false;
	if (str === "true") return true;
	return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
	const searchParams = new URLSearchParams(str);
	const result = {};
	for (const [key, value] of searchParams.entries()) {
		const previousValue = result[key];
		if (previousValue == null) result[key] = toValue(value);
		else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
		else result[key] = [previousValue, toValue(value)];
	}
	return result;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/searchParams.js
var defaultParseSearch = parseSearchWith(JSON.parse);
var defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
function parseSearchWith(parser) {
	return (searchStr) => {
		if (searchStr[0] === "?") searchStr = searchStr.substring(1);
		const query = decode(searchStr);
		for (const key in query) {
			const value = query[key];
			if (typeof value === "string") try {
				query[key] = parser(value);
			} catch (_err) {}
		}
		return query;
	};
}
function stringifySearchWith(stringify, parser) {
	const hasParser = typeof parser === "function";
	function stringifyValue(val) {
		if (typeof val === "object" && val !== null) try {
			return stringify(val);
		} catch (_err) {}
		else if (hasParser && typeof val === "string") try {
			parser(val);
			return stringify(val);
		} catch (_err) {}
		return val;
	}
	return (search) => {
		const searchStr = encode(search, stringifyValue);
		return searchStr ? `?${searchStr}` : "";
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/root.js
var rootRouteId = "__root__";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/redirect.js
function redirect(opts) {
	opts.statusCode = opts.statusCode || opts.code || 307;
	if (!opts.reloadDocument && typeof opts.href === "string") try {
		new URL(opts.href);
		opts.reloadDocument = true;
	} catch {}
	const headers = new Headers(opts.headers);
	if (opts.href && headers.get("Location") === null) headers.set("Location", opts.href);
	const response = new Response(null, {
		status: opts.statusCode,
		headers
	});
	response.options = opts;
	if (opts.throw) throw response;
	return response;
}
function isRedirect(obj) {
	return obj instanceof Response && !!obj.options;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/lru-cache.js
function createLRUCache(max) {
	const cache = /* @__PURE__ */ new Map();
	let oldest;
	let newest;
	const touch = (entry) => {
		if (!entry.next) return;
		if (!entry.prev) {
			entry.next.prev = void 0;
			oldest = entry.next;
			entry.next = void 0;
			if (newest) {
				entry.prev = newest;
				newest.next = entry;
			}
		} else {
			entry.prev.next = entry.next;
			entry.next.prev = entry.prev;
			entry.next = void 0;
			if (newest) {
				newest.next = entry;
				entry.prev = newest;
			}
		}
		newest = entry;
	};
	return {
		get(key) {
			const entry = cache.get(key);
			if (!entry) return void 0;
			touch(entry);
			return entry.value;
		},
		set(key, value) {
			if (cache.size >= max && oldest) {
				const toDelete = oldest;
				cache.delete(toDelete.key);
				if (toDelete.next) {
					oldest = toDelete.next;
					toDelete.next.prev = void 0;
				}
				if (toDelete === newest) newest = void 0;
			}
			const existing = cache.get(key);
			if (existing) {
				existing.value = value;
				touch(existing);
			} else {
				const entry = {
					key,
					value,
					prev: newest
				};
				if (newest) newest.next = entry;
				newest = entry;
				if (!oldest) oldest = entry;
				cache.set(key, entry);
			}
		}
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/load-matches.js
var triggerOnReady = (inner) => {
	var _a;
	if (!inner.rendered) {
		inner.rendered = true;
		return (_a = inner.onReady) == null ? void 0 : _a.call(inner);
	}
};
var resolvePreload = (inner, matchId) => {
	return !!(inner.preload && !inner.router.state.matches.some((d) => d.id === matchId));
};
var _handleNotFound = (inner, err) => {
	var _a;
	const routeCursor = inner.router.routesById[err.routeId ?? ""] ?? inner.router.routeTree;
	if (!routeCursor.options.notFoundComponent && ((_a = inner.router.options) == null ? void 0 : _a.defaultNotFoundComponent)) routeCursor.options.notFoundComponent = inner.router.options.defaultNotFoundComponent;
	invariant(routeCursor.options.notFoundComponent, "No notFoundComponent found. Please set a notFoundComponent on your route or provide a defaultNotFoundComponent to the router.");
	const matchForRoute = inner.matches.find((m) => m.routeId === routeCursor.id);
	invariant(matchForRoute, "Could not find match for route: " + routeCursor.id);
	inner.updateMatch(matchForRoute.id, (prev) => ({
		...prev,
		status: "notFound",
		error: err,
		isFetching: false
	}));
	if (err.routerCode === "BEFORE_LOAD" && routeCursor.parentRoute) {
		err.routeId = routeCursor.parentRoute.id;
		_handleNotFound(inner, err);
	}
};
var handleRedirectAndNotFound = (inner, match, err) => {
	var _a, _b, _c;
	if (!isRedirect(err) && !isNotFound(err)) return;
	if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
	if (match) {
		(_a = match._nonReactive.beforeLoadPromise) == null || _a.resolve();
		(_b = match._nonReactive.loaderPromise) == null || _b.resolve();
		match._nonReactive.beforeLoadPromise = void 0;
		match._nonReactive.loaderPromise = void 0;
		const status = isRedirect(err) ? "redirected" : "notFound";
		inner.updateMatch(match.id, (prev) => ({
			...prev,
			status,
			isFetching: false,
			error: err
		}));
		if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
		(_c = match._nonReactive.loadPromise) == null || _c.resolve();
	}
	if (isRedirect(err)) {
		inner.rendered = true;
		err.options._fromLocation = inner.location;
		err.redirectHandled = true;
		err = inner.router.resolveRedirect(err);
		throw err;
	} else {
		_handleNotFound(inner, err);
		throw err;
	}
};
var shouldSkipLoader = (inner, matchId) => {
	const match = inner.router.getMatch(matchId);
	if (!inner.router.isServer && match._nonReactive.dehydrated) return true;
	if (inner.router.isServer && match.ssr === false) return true;
	return false;
};
var handleSerialError = (inner, index, err, routerCode) => {
	var _a, _b;
	const { id: matchId, routeId } = inner.matches[index];
	const route = inner.router.looseRoutesById[routeId];
	if (err instanceof Promise) throw err;
	err.routerCode = routerCode;
	inner.firstBadMatchIndex ?? (inner.firstBadMatchIndex = index);
	handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
	try {
		(_b = (_a = route.options).onError) == null || _b.call(_a, err);
	} catch (errorHandlerErr) {
		err = errorHandlerErr;
		handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
	}
	inner.updateMatch(matchId, (prev) => {
		var _a2, _b2;
		(_a2 = prev._nonReactive.beforeLoadPromise) == null || _a2.resolve();
		prev._nonReactive.beforeLoadPromise = void 0;
		(_b2 = prev._nonReactive.loadPromise) == null || _b2.resolve();
		return {
			...prev,
			error: err,
			status: "error",
			isFetching: false,
			updatedAt: Date.now(),
			abortController: new AbortController()
		};
	});
};
var isBeforeLoadSsr = (inner, matchId, index, route) => {
	var _a;
	const existingMatch = inner.router.getMatch(matchId);
	const parentMatchId = (_a = inner.matches[index - 1]) == null ? void 0 : _a.id;
	const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
	if (inner.router.isShell()) {
		existingMatch.ssr = matchId === rootRouteId;
		return;
	}
	if ((parentMatch == null ? void 0 : parentMatch.ssr) === false) {
		existingMatch.ssr = false;
		return;
	}
	const parentOverride = (tempSsr2) => {
		if (tempSsr2 === true && (parentMatch == null ? void 0 : parentMatch.ssr) === "data-only") return "data-only";
		return tempSsr2;
	};
	const defaultSsr = inner.router.options.defaultSsr ?? true;
	if (route.options.ssr === void 0) {
		existingMatch.ssr = parentOverride(defaultSsr);
		return;
	}
	if (typeof route.options.ssr !== "function") {
		existingMatch.ssr = parentOverride(route.options.ssr);
		return;
	}
	const { search, params } = existingMatch;
	const ssrFnContext = {
		search: makeMaybe(search, existingMatch.searchError),
		params: makeMaybe(params, existingMatch.paramsError),
		location: inner.location,
		matches: inner.matches.map((match) => ({
			index: match.index,
			pathname: match.pathname,
			fullPath: match.fullPath,
			staticData: match.staticData,
			id: match.id,
			routeId: match.routeId,
			search: makeMaybe(match.search, match.searchError),
			params: makeMaybe(match.params, match.paramsError),
			ssr: match.ssr
		}))
	};
	const tempSsr = route.options.ssr(ssrFnContext);
	if (isPromise(tempSsr)) return tempSsr.then((ssr) => {
		existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
	});
	existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
};
var setupPendingTimeout = (inner, matchId, route, match) => {
	var _a;
	if (match._nonReactive.pendingTimeout !== void 0) return;
	const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
	if (!!(inner.onReady && !inner.router.isServer && !resolvePreload(inner, matchId) && (route.options.loader || route.options.beforeLoad || routeNeedsPreload(route)) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? ((_a = inner.router.options) == null ? void 0 : _a.defaultPendingComponent)))) {
		const pendingTimeout = setTimeout(() => {
			triggerOnReady(inner);
		}, pendingMs);
		match._nonReactive.pendingTimeout = pendingTimeout;
	}
};
var preBeforeLoadSetup = (inner, matchId, route) => {
	const existingMatch = inner.router.getMatch(matchId);
	if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
	setupPendingTimeout(inner, matchId, route, existingMatch);
	const then = () => {
		const match = inner.router.getMatch(matchId);
		if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
	};
	return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
var executeBeforeLoad = (inner, matchId, index, route) => {
	var _a;
	const match = inner.router.getMatch(matchId);
	const prevLoadPromise = match._nonReactive.loadPromise;
	match._nonReactive.loadPromise = createControlledPromise(() => {
		prevLoadPromise?.resolve();
	});
	const { paramsError, searchError } = match;
	if (paramsError) handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
	if (searchError) handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
	setupPendingTimeout(inner, matchId, route, match);
	const abortController = new AbortController();
	const parentMatchId = (_a = inner.matches[index - 1]) == null ? void 0 : _a.id;
	const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
	const context = {
		...(parentMatch == null ? void 0 : parentMatch.context) ?? inner.router.options.context ?? void 0,
		...match.__routeContext
	};
	let isPending = false;
	const pending = () => {
		if (isPending) return;
		isPending = true;
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: "beforeLoad",
			fetchCount: prev.fetchCount + 1,
			abortController,
			context
		}));
	};
	const resolve = () => {
		var _a2;
		(_a2 = match._nonReactive.beforeLoadPromise) == null || _a2.resolve();
		match._nonReactive.beforeLoadPromise = void 0;
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: false
		}));
	};
	if (!route.options.beforeLoad) {
		batch(() => {
			pending();
			resolve();
		});
		return;
	}
	match._nonReactive.beforeLoadPromise = createControlledPromise();
	const { search, params, cause } = match;
	const preload = resolvePreload(inner, matchId);
	const beforeLoadFnContext = {
		search,
		abortController,
		params,
		preload,
		context,
		location: inner.location,
		navigate: (opts) => inner.router.navigate({
			...opts,
			_fromLocation: inner.location
		}),
		buildLocation: inner.router.buildLocation,
		cause: preload ? "preload" : cause,
		matches: inner.matches
	};
	const updateContext = (beforeLoadContext2) => {
		if (beforeLoadContext2 === void 0) {
			batch(() => {
				pending();
				resolve();
			});
			return;
		}
		if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
			pending();
			handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
		}
		batch(() => {
			pending();
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				__beforeLoadContext: beforeLoadContext2,
				context: {
					...prev.context,
					...beforeLoadContext2
				}
			}));
			resolve();
		});
	};
	let beforeLoadContext;
	try {
		beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
		if (isPromise(beforeLoadContext)) {
			pending();
			return beforeLoadContext.catch((err) => {
				handleSerialError(inner, index, err, "BEFORE_LOAD");
			}).then(updateContext);
		}
	} catch (err) {
		pending();
		handleSerialError(inner, index, err, "BEFORE_LOAD");
	}
	updateContext(beforeLoadContext);
};
var handleBeforeLoad = (inner, index) => {
	const { id: matchId, routeId } = inner.matches[index];
	const route = inner.router.looseRoutesById[routeId];
	const serverSsr = () => {
		if (inner.router.isServer) {
			const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
			if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
		}
		return queueExecution();
	};
	const queueExecution = () => {
		if (shouldSkipLoader(inner, matchId)) return;
		const result = preBeforeLoadSetup(inner, matchId, route);
		return isPromise(result) ? result.then(execute) : execute();
	};
	const execute = () => executeBeforeLoad(inner, matchId, index, route);
	return serverSsr();
};
var executeHead = (inner, matchId, route) => {
	var _a, _b, _c, _d, _e, _f;
	const match = inner.router.getMatch(matchId);
	if (!match) return;
	if (!route.options.head && !route.options.scripts && !route.options.headers) return;
	const assetContext = {
		matches: inner.matches,
		match,
		params: match.params,
		loaderData: match.loaderData
	};
	return Promise.all([
		(_b = (_a = route.options).head) == null ? void 0 : _b.call(_a, assetContext),
		(_d = (_c = route.options).scripts) == null ? void 0 : _d.call(_c, assetContext),
		(_f = (_e = route.options).headers) == null ? void 0 : _f.call(_e, assetContext)
	]).then(([headFnContent, scripts, headers]) => {
		return {
			meta: headFnContent == null ? void 0 : headFnContent.meta,
			links: headFnContent == null ? void 0 : headFnContent.links,
			headScripts: headFnContent == null ? void 0 : headFnContent.scripts,
			headers,
			scripts,
			styles: headFnContent == null ? void 0 : headFnContent.styles
		};
	});
};
var getLoaderContext = (inner, matchId, index, route) => {
	const parentMatchPromise = inner.matchPromises[index - 1];
	const { params, loaderDeps, abortController, context, cause } = inner.router.getMatch(matchId);
	const preload = resolvePreload(inner, matchId);
	return {
		params,
		deps: loaderDeps,
		preload: !!preload,
		parentMatchPromise,
		abortController,
		context,
		location: inner.location,
		navigate: (opts) => inner.router.navigate({
			...opts,
			_fromLocation: inner.location
		}),
		cause: preload ? "preload" : cause,
		route
	};
};
var runLoader = async (inner, matchId, index, route) => {
	var _a, _b, _c, _d;
	try {
		const match = inner.router.getMatch(matchId);
		try {
			if (!inner.router.isServer || match.ssr === true) loadRouteChunk(route);
			const loaderResult = (_b = (_a = route.options).loader) == null ? void 0 : _b.call(_a, getLoaderContext(inner, matchId, index, route));
			const loaderResultIsPromise = route.options.loader && isPromise(loaderResult);
			if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
				...prev,
				isFetching: "loader"
			}));
			if (route.options.loader) {
				const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
				handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
				if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
					...prev,
					loaderData
				}));
			}
			if (route._lazyPromise) await route._lazyPromise;
			const headResult = executeHead(inner, matchId, route);
			const head = headResult ? await headResult : void 0;
			const pendingPromise = match._nonReactive.minPendingPromise;
			if (pendingPromise) await pendingPromise;
			if (route._componentsPromise) await route._componentsPromise;
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				error: void 0,
				status: "success",
				isFetching: false,
				updatedAt: Date.now(),
				...head
			}));
		} catch (e) {
			let error = e;
			const pendingPromise = match._nonReactive.minPendingPromise;
			if (pendingPromise) await pendingPromise;
			handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
			try {
				(_d = (_c = route.options).onError) == null || _d.call(_c, e);
			} catch (onErrorError) {
				error = onErrorError;
				handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
			}
			const headResult = executeHead(inner, matchId, route);
			const head = headResult ? await headResult : void 0;
			inner.updateMatch(matchId, (prev) => ({
				...prev,
				error,
				status: "error",
				isFetching: false,
				...head
			}));
		}
	} catch (err) {
		const match = inner.router.getMatch(matchId);
		if (match) {
			const headResult = executeHead(inner, matchId, route);
			if (headResult) {
				const head = await headResult;
				inner.updateMatch(matchId, (prev) => ({
					...prev,
					...head
				}));
			}
			match._nonReactive.loaderPromise = void 0;
		}
		handleRedirectAndNotFound(inner, match, err);
	}
};
var loadRouteMatch = async (inner, index) => {
	var _a, _b;
	const { id: matchId, routeId } = inner.matches[index];
	let loaderShouldRunAsync = false;
	let loaderIsRunningAsync = false;
	const route = inner.router.looseRoutesById[routeId];
	if (shouldSkipLoader(inner, matchId)) {
		if (inner.router.isServer) {
			const headResult = executeHead(inner, matchId, route);
			if (headResult) {
				const head = await headResult;
				inner.updateMatch(matchId, (prev) => ({
					...prev,
					...head
				}));
			}
			return inner.router.getMatch(matchId);
		}
	} else {
		const prevMatch = inner.router.getMatch(matchId);
		if (prevMatch._nonReactive.loaderPromise) {
			if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload) return prevMatch;
			await prevMatch._nonReactive.loaderPromise;
			const match2 = inner.router.getMatch(matchId);
			if (match2.error) handleRedirectAndNotFound(inner, match2, match2.error);
		} else {
			const age = Date.now() - prevMatch.updatedAt;
			const preload = resolvePreload(inner, matchId);
			const staleAge = preload ? route.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
			const shouldReloadOption = route.options.shouldReload;
			const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchId, index, route)) : shouldReloadOption;
			const nextPreload = !!preload && !inner.router.state.matches.some((d) => d.id === matchId);
			const match2 = inner.router.getMatch(matchId);
			match2._nonReactive.loaderPromise = createControlledPromise();
			if (nextPreload !== match2.preload) inner.updateMatch(matchId, (prev) => ({
				...prev,
				preload: nextPreload
			}));
			const { status, invalid } = match2;
			loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? age > staleAge));
			if (preload && route.options.preload === false);
			else if (loaderShouldRunAsync && !inner.sync) {
				loaderIsRunningAsync = true;
				(async () => {
					var _a2, _b2;
					try {
						await runLoader(inner, matchId, index, route);
						const match3 = inner.router.getMatch(matchId);
						(_a2 = match3._nonReactive.loaderPromise) == null || _a2.resolve();
						(_b2 = match3._nonReactive.loadPromise) == null || _b2.resolve();
						match3._nonReactive.loaderPromise = void 0;
					} catch (err) {
						if (isRedirect(err)) await inner.router.navigate(err.options);
					}
				})();
			} else if (status !== "success" || loaderShouldRunAsync && inner.sync) await runLoader(inner, matchId, index, route);
			else {
				const headResult = executeHead(inner, matchId, route);
				if (headResult) {
					const head = await headResult;
					inner.updateMatch(matchId, (prev) => ({
						...prev,
						...head
					}));
				}
			}
		}
	}
	const match = inner.router.getMatch(matchId);
	if (!loaderIsRunningAsync) {
		(_a = match._nonReactive.loaderPromise) == null || _a.resolve();
		(_b = match._nonReactive.loadPromise) == null || _b.resolve();
	}
	clearTimeout(match._nonReactive.pendingTimeout);
	match._nonReactive.pendingTimeout = void 0;
	if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
	match._nonReactive.dehydrated = void 0;
	const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
	if (nextIsFetching !== match.isFetching || match.invalid !== false) {
		inner.updateMatch(matchId, (prev) => ({
			...prev,
			isFetching: nextIsFetching,
			invalid: false
		}));
		return inner.router.getMatch(matchId);
	} else return match;
};
async function loadMatches(arg) {
	const inner = Object.assign(arg, { matchPromises: [] });
	if (!inner.router.isServer && inner.router.state.matches.some((d) => d._forcePending)) triggerOnReady(inner);
	try {
		for (let i = 0; i < inner.matches.length; i++) {
			const beforeLoad = handleBeforeLoad(inner, i);
			if (isPromise(beforeLoad)) await beforeLoad;
		}
		const max = inner.firstBadMatchIndex ?? inner.matches.length;
		for (let i = 0; i < max; i++) inner.matchPromises.push(loadRouteMatch(inner, i));
		await Promise.all(inner.matchPromises);
		const readyPromise = triggerOnReady(inner);
		if (isPromise(readyPromise)) await readyPromise;
	} catch (err) {
		if (isNotFound(err) && !inner.preload) {
			const readyPromise = triggerOnReady(inner);
			if (isPromise(readyPromise)) await readyPromise;
			throw err;
		}
		if (isRedirect(err)) throw err;
	}
	return inner.matches;
}
async function loadRouteChunk(route) {
	if (!route._lazyLoaded && route._lazyPromise === void 0) {
		if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
			const { id: _id, ...options } = lazyRoute.options;
			Object.assign(route.options, options);
			route._lazyLoaded = true;
			route._lazyPromise = void 0;
		});
		else route._lazyLoaded = true;
	}
	if (!route._componentsLoaded && route._componentsPromise === void 0) {
		const loadComponents = () => {
			var _a;
			const preloads = [];
			for (const type of componentTypes) {
				const preload = (_a = route.options[type]) == null ? void 0 : _a.preload;
				if (preload) preloads.push(preload());
			}
			if (preloads.length) return Promise.all(preloads).then(() => {
				route._componentsLoaded = true;
				route._componentsPromise = void 0;
			});
			route._componentsLoaded = true;
			route._componentsPromise = void 0;
		};
		route._componentsPromise = route._lazyPromise ? route._lazyPromise.then(loadComponents) : loadComponents();
	}
	return route._componentsPromise;
}
function makeMaybe(value, error) {
	if (error) return {
		status: "error",
		error
	};
	return {
		status: "success",
		value
	};
}
function routeNeedsPreload(route) {
	var _a;
	for (const componentType of componentTypes) if ((_a = route.options[componentType]) == null ? void 0 : _a.preload) return true;
	return false;
}
var componentTypes = [
	"component",
	"errorComponent",
	"pendingComponent",
	"notFoundComponent"
];
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/router.js
function getLocationChangeInfo(routerState) {
	const fromLocation = routerState.resolvedLocation;
	const toLocation = routerState.location;
	return {
		fromLocation,
		toLocation,
		pathChanged: (fromLocation == null ? void 0 : fromLocation.pathname) !== toLocation.pathname,
		hrefChanged: (fromLocation == null ? void 0 : fromLocation.href) !== toLocation.href,
		hashChanged: (fromLocation == null ? void 0 : fromLocation.hash) !== toLocation.hash
	};
}
var RouterCore = class {
	/**
	* @deprecated Use the `createRouter` function instead
	*/
	constructor(options) {
		this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
		this.resetNextScroll = true;
		this.shouldViewTransition = void 0;
		this.isViewTransitionTypesSupported = void 0;
		this.subscribers = /* @__PURE__ */ new Set();
		this.isScrollRestoring = false;
		this.isScrollRestorationSetup = false;
		this.startTransition = (fn) => fn();
		this.update = (newOptions) => {
			var _a;
			if (newOptions.notFoundRoute) console.warn("The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.");
			const previousOptions = this.options;
			this.options = {
				...this.options,
				...newOptions
			};
			this.isServer = this.options.isServer ?? typeof document === "undefined";
			this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(this.options.pathParamsAllowedCharacters.map((char) => [encodeURIComponent(char), char])) : void 0;
			if (!this.basepath || newOptions.basepath && newOptions.basepath !== previousOptions.basepath) {
				if (newOptions.basepath === void 0 || newOptions.basepath === "" || newOptions.basepath === "/") this.basepath = "/";
				else this.basepath = `/${trimPath(newOptions.basepath)}`;
			}
			if (!this.history || this.options.history && this.options.history !== this.history) {
				this.history = this.options.history ?? (this.isServer ? createMemoryHistory({ initialEntries: [this.basepath || "/"] }) : createBrowserHistory());
				this.updateLatestLocation();
			}
			if (this.options.routeTree !== this.routeTree) {
				this.routeTree = this.options.routeTree;
				this.buildRouteTree();
			}
			if (!this.__store) {
				this.__store = new Store(getInitialRouterState(this.latestLocation), { onUpdate: () => {
					this.__store.state = {
						...this.state,
						cachedMatches: this.state.cachedMatches.filter((d) => !["redirected"].includes(d.status))
					};
				} });
				setupScrollRestoration(this);
			}
			if (typeof window !== "undefined" && "CSS" in window && typeof ((_a = window.CSS) == null ? void 0 : _a.supports) === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a)");
		};
		this.updateLatestLocation = () => {
			this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
		};
		this.buildRouteTree = () => {
			const { routesById, routesByPath, flatRoutes } = processRouteTree({
				routeTree: this.routeTree,
				initRoute: (route, i) => {
					route.init({ originalIndex: i });
				}
			});
			this.routesById = routesById;
			this.routesByPath = routesByPath;
			this.flatRoutes = flatRoutes;
			const notFoundRoute = this.options.notFoundRoute;
			if (notFoundRoute) {
				notFoundRoute.init({ originalIndex: 99999999999 });
				this.routesById[notFoundRoute.id] = notFoundRoute;
			}
		};
		this.subscribe = (eventType, fn) => {
			const listener = {
				eventType,
				fn
			};
			this.subscribers.add(listener);
			return () => {
				this.subscribers.delete(listener);
			};
		};
		this.emit = (routerEvent) => {
			this.subscribers.forEach((listener) => {
				if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
			});
		};
		this.parseLocation = (locationToParse, previousLocation) => {
			const parse = ({ pathname, search, hash, state }) => {
				const parsedSearch = this.options.parseSearch(search);
				const searchStr = this.options.stringifySearch(parsedSearch);
				return {
					pathname,
					searchStr,
					search: replaceEqualDeep(previousLocation == null ? void 0 : previousLocation.search, parsedSearch),
					hash: hash.split("#").reverse()[0] ?? "",
					href: `${pathname}${searchStr}${hash}`,
					state: replaceEqualDeep(previousLocation == null ? void 0 : previousLocation.state, state)
				};
			};
			const location = parse(locationToParse);
			const { __tempLocation, __tempKey } = location.state;
			if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
				const parsedTempLocation = parse(__tempLocation);
				parsedTempLocation.state.key = location.state.key;
				parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
				delete parsedTempLocation.state.__tempLocation;
				return {
					...parsedTempLocation,
					maskedLocation: location
				};
			}
			return location;
		};
		this.resolvePathWithBase = (from, path) => {
			return resolvePath({
				basepath: this.basepath,
				base: from,
				to: cleanPath(path),
				trailingSlash: this.options.trailingSlash,
				caseSensitive: this.options.caseSensitive,
				parseCache: this.parsePathnameCache
			});
		};
		this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
			if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
				pathname: pathnameOrNext,
				search: locationSearchOrOpts
			}, opts);
			return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
		};
		this.parsePathnameCache = createLRUCache(1e3);
		this.getMatchedRoutes = (pathname, routePathname) => {
			return getMatchedRoutes({
				pathname,
				routePathname,
				basepath: this.basepath,
				caseSensitive: this.options.caseSensitive,
				routesByPath: this.routesByPath,
				routesById: this.routesById,
				flatRoutes: this.flatRoutes,
				parseCache: this.parsePathnameCache
			});
		};
		this.cancelMatch = (id) => {
			const match = this.getMatch(id);
			if (!match) return;
			match.abortController.abort();
			clearTimeout(match._nonReactive.pendingTimeout);
			match._nonReactive.pendingTimeout = void 0;
		};
		this.cancelMatches = () => {
			var _a;
			(_a = this.state.pendingMatches) == null || _a.forEach((match) => {
				this.cancelMatch(match.id);
			});
		};
		this.buildLocation = (opts) => {
			const build = (dest = {}) => {
				var _a, _b;
				const currentLocation = dest._fromLocation || this.latestLocation;
				const lastMatch = last(this.matchRoutes(currentLocation, { _buildLocation: true }));
				if (dest.from && false);
				const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lastMatch.fullPath;
				const fromPath = this.resolvePathWithBase(defaultedFromPath, ".");
				const fromSearch = lastMatch.search;
				const fromParams = { ...lastMatch.params };
				const nextTo = dest.to ? this.resolvePathWithBase(fromPath, `${dest.to}`) : this.resolvePathWithBase(fromPath, ".");
				const nextParams = dest.params === false || dest.params === null ? {} : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate(dest.params, fromParams));
				const interpolatedNextTo = interpolatePath({
					path: nextTo,
					params: nextParams,
					parseCache: this.parsePathnameCache
				}).interpolatedPath;
				const destRoutes = this.matchRoutes(interpolatedNextTo, void 0, { _buildLocation: true }).map((d) => this.looseRoutesById[d.routeId]);
				if (Object.keys(nextParams).length > 0) for (const route of destRoutes) {
					const fn = ((_a = route.options.params) == null ? void 0 : _a.stringify) ?? route.options.stringifyParams;
					if (fn) Object.assign(nextParams, fn(nextParams));
				}
				const nextPathname = interpolatePath({
					path: nextTo,
					params: nextParams,
					leaveWildcards: false,
					leaveParams: opts.leaveParams,
					decodeCharMap: this.pathParamsDecodeCharMap,
					parseCache: this.parsePathnameCache
				}).interpolatedPath;
				let nextSearch = fromSearch;
				if (opts._includeValidateSearch && ((_b = this.options.search) == null ? void 0 : _b.strict)) {
					const validatedSearch = {};
					destRoutes.forEach((route) => {
						if (route.options.validateSearch) try {
							Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
								...validatedSearch,
								...nextSearch
							}));
						} catch {}
					});
					nextSearch = validatedSearch;
				}
				nextSearch = applySearchMiddleware({
					search: nextSearch,
					dest,
					destRoutes,
					_includeValidateSearch: opts._includeValidateSearch
				});
				nextSearch = replaceEqualDeep(fromSearch, nextSearch);
				const searchStr = this.options.stringifySearch(nextSearch);
				const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate(dest.hash, currentLocation.hash) : void 0;
				const hashStr = hash ? `#${hash}` : "";
				let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate(dest.state, currentLocation.state) : {};
				nextState = replaceEqualDeep(currentLocation.state, nextState);
				return {
					pathname: nextPathname,
					search: nextSearch,
					searchStr,
					state: nextState,
					hash: hash ?? "",
					href: `${nextPathname}${searchStr}${hashStr}`,
					unmaskOnReload: dest.unmaskOnReload
				};
			};
			const buildWithMatches = (dest = {}, maskedDest) => {
				var _a;
				const next = build(dest);
				let maskedNext = maskedDest ? build(maskedDest) : void 0;
				if (!maskedNext) {
					let params = {};
					const foundMask = (_a = this.options.routeMasks) == null ? void 0 : _a.find((d) => {
						const match = matchPathname(this.basepath, next.pathname, {
							to: d.from,
							caseSensitive: false,
							fuzzy: false
						}, this.parsePathnameCache);
						if (match) {
							params = match;
							return true;
						}
						return false;
					});
					if (foundMask) {
						const { from: _from, ...maskProps } = foundMask;
						maskedDest = {
							from: opts.from,
							...maskProps,
							params
						};
						maskedNext = build(maskedDest);
					}
				}
				if (maskedNext) next.maskedLocation = maskedNext;
				return next;
			};
			if (opts.mask) return buildWithMatches(opts, {
				from: opts.from,
				...opts.mask
			});
			return buildWithMatches(opts);
		};
		this.commitLocation = ({ viewTransition, ignoreBlocker, ...next }) => {
			const isSameState = () => {
				const ignoredProps = [
					"key",
					"__TSR_key",
					"__TSR_index",
					"__hashScrollIntoViewOptions"
				];
				ignoredProps.forEach((prop) => {
					next.state[prop] = this.latestLocation.state[prop];
				});
				const isEqual = deepEqual(next.state, this.latestLocation.state);
				ignoredProps.forEach((prop) => {
					delete next.state[prop];
				});
				return isEqual;
			};
			const isSameUrl = this.latestLocation.href === next.href;
			const previousCommitPromise = this.commitLocationPromise;
			this.commitLocationPromise = createControlledPromise(() => {
				previousCommitPromise?.resolve();
			});
			if (isSameUrl && isSameState()) this.load();
			else {
				let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
				if (maskedLocation) {
					nextHistory = {
						...maskedLocation,
						state: {
							...maskedLocation.state,
							__tempKey: void 0,
							__tempLocation: {
								...nextHistory,
								search: nextHistory.searchStr,
								state: {
									...nextHistory.state,
									__tempKey: void 0,
									__tempLocation: void 0,
									__TSR_key: void 0,
									key: void 0
								}
							}
						}
					};
					if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
				}
				nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
				this.shouldViewTransition = viewTransition;
				this.history[next.replace ? "replace" : "push"](nextHistory.href, nextHistory.state, { ignoreBlocker });
			}
			this.resetNextScroll = next.resetScroll ?? true;
			if (!this.history.subscribers.size) this.load();
			return this.commitLocationPromise;
		};
		this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
			if (href) {
				const currentIndex = this.history.location.state.__TSR_index;
				const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
				rest.to = parsed.pathname;
				rest.search = this.options.parseSearch(parsed.search);
				rest.hash = parsed.hash.slice(1);
			}
			const location = this.buildLocation({
				...rest,
				_includeValidateSearch: true
			});
			return this.commitLocation({
				...location,
				viewTransition,
				replace,
				resetScroll,
				hashScrollIntoView,
				ignoreBlocker
			});
		};
		this.navigate = ({ to, reloadDocument, href, ...rest }) => {
			if (!reloadDocument && href) try {
				new URL(`${href}`);
				reloadDocument = true;
			} catch {}
			if (reloadDocument) {
				if (!href) {
					const location = this.buildLocation({
						to,
						...rest
					});
					href = this.history.createHref(location.href);
				}
				if (rest.replace) window.location.replace(href);
				else window.location.href = href;
				return Promise.resolve();
			}
			return this.buildAndCommitLocation({
				...rest,
				href,
				to,
				_isNavigate: true
			});
		};
		this.beforeLoad = () => {
			this.cancelMatches();
			this.updateLatestLocation();
			if (this.isServer) {
				const nextLocation = this.buildLocation({
					to: this.latestLocation.pathname,
					search: true,
					params: true,
					hash: true,
					state: true,
					_includeValidateSearch: true
				});
				const normalizeUrl = (url) => {
					try {
						return encodeURI(decodeURI(url));
					} catch {
						return url;
					}
				};
				if (trimPath(normalizeUrl(this.latestLocation.href)) !== trimPath(normalizeUrl(nextLocation.href))) throw redirect({ href: nextLocation.href });
			}
			const pendingMatches = this.matchRoutes(this.latestLocation);
			this.__store.setState((s) => ({
				...s,
				status: "pending",
				statusCode: 200,
				isLoading: true,
				location: this.latestLocation,
				pendingMatches,
				cachedMatches: s.cachedMatches.filter((d) => !pendingMatches.some((e) => e.id === d.id))
			}));
		};
		this.load = async (opts) => {
			let redirect2;
			let notFound;
			let loadPromise;
			loadPromise = new Promise((resolve) => {
				this.startTransition(async () => {
					var _a;
					try {
						this.beforeLoad();
						const next = this.latestLocation;
						const prevLocation = this.state.resolvedLocation;
						if (!this.state.redirect) this.emit({
							type: "onBeforeNavigate",
							...getLocationChangeInfo({
								resolvedLocation: prevLocation,
								location: next
							})
						});
						this.emit({
							type: "onBeforeLoad",
							...getLocationChangeInfo({
								resolvedLocation: prevLocation,
								location: next
							})
						});
						await loadMatches({
							router: this,
							sync: opts == null ? void 0 : opts.sync,
							matches: this.state.pendingMatches,
							location: next,
							updateMatch: this.updateMatch,
							onReady: async () => {
								this.startViewTransition(async () => {
									let exitingMatches;
									let enteringMatches;
									let stayingMatches;
									batch(() => {
										this.__store.setState((s) => {
											const previousMatches = s.matches;
											const newMatches = s.pendingMatches || s.matches;
											exitingMatches = previousMatches.filter((match) => !newMatches.some((d) => d.id === match.id));
											enteringMatches = newMatches.filter((match) => !previousMatches.some((d) => d.id === match.id));
											stayingMatches = previousMatches.filter((match) => newMatches.some((d) => d.id === match.id));
											return {
												...s,
												isLoading: false,
												loadedAt: Date.now(),
												matches: newMatches,
												pendingMatches: void 0,
												cachedMatches: [...s.cachedMatches, ...exitingMatches.filter((d) => d.status !== "error")]
											};
										});
										this.clearExpiredCache();
									});
									[
										[exitingMatches, "onLeave"],
										[enteringMatches, "onEnter"],
										[stayingMatches, "onStay"]
									].forEach(([matches, hook]) => {
										matches.forEach((match) => {
											var _a2, _b;
											(_b = (_a2 = this.looseRoutesById[match.routeId].options)[hook]) == null || _b.call(_a2, match);
										});
									});
								});
							}
						});
					} catch (err) {
						if (isRedirect(err)) {
							redirect2 = err;
							if (!this.isServer) this.navigate({
								...redirect2.options,
								replace: true,
								ignoreBlocker: true
							});
						} else if (isNotFound(err)) notFound = err;
						this.__store.setState((s) => ({
							...s,
							statusCode: redirect2 ? redirect2.status : notFound ? 404 : s.matches.some((d) => d.status === "error") ? 500 : 200,
							redirect: redirect2
						}));
					}
					if (this.latestLoadPromise === loadPromise) {
						(_a = this.commitLocationPromise) == null || _a.resolve();
						this.latestLoadPromise = void 0;
						this.commitLocationPromise = void 0;
					}
					resolve();
				});
			});
			this.latestLoadPromise = loadPromise;
			await loadPromise;
			while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
			if (this.hasNotFoundMatch()) this.__store.setState((s) => ({
				...s,
				statusCode: 404
			}));
		};
		this.startViewTransition = (fn) => {
			const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
			delete this.shouldViewTransition;
			if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
				let startViewTransitionParams;
				if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
					const next = this.latestLocation;
					const prevLocation = this.state.resolvedLocation;
					startViewTransitionParams = {
						update: fn,
						types: typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo({
							resolvedLocation: prevLocation,
							location: next
						})) : shouldViewTransition.types
					};
				} else startViewTransitionParams = fn;
				document.startViewTransition(startViewTransitionParams);
			} else fn();
		};
		this.updateMatch = (id, updater) => {
			var _a;
			const matchesKey = ((_a = this.state.pendingMatches) == null ? void 0 : _a.some((d) => d.id === id)) ? "pendingMatches" : this.state.matches.some((d) => d.id === id) ? "matches" : this.state.cachedMatches.some((d) => d.id === id) ? "cachedMatches" : "";
			if (matchesKey) this.__store.setState((s) => {
				var _a2;
				return {
					...s,
					[matchesKey]: (_a2 = s[matchesKey]) == null ? void 0 : _a2.map((d) => d.id === id ? updater(d) : d)
				};
			});
		};
		this.getMatch = (matchId) => {
			var _a;
			const findFn = (d) => d.id === matchId;
			return this.state.cachedMatches.find(findFn) ?? ((_a = this.state.pendingMatches) == null ? void 0 : _a.find(findFn)) ?? this.state.matches.find(findFn);
		};
		this.invalidate = (opts) => {
			const invalidate = (d) => {
				var _a;
				if (((_a = opts == null ? void 0 : opts.filter) == null ? void 0 : _a.call(opts, d)) ?? true) return {
					...d,
					invalid: true,
					...(opts == null ? void 0 : opts.forcePending) || d.status === "error" ? {
						status: "pending",
						error: void 0
					} : void 0
				};
				return d;
			};
			this.__store.setState((s) => {
				var _a;
				return {
					...s,
					matches: s.matches.map(invalidate),
					cachedMatches: s.cachedMatches.map(invalidate),
					pendingMatches: (_a = s.pendingMatches) == null ? void 0 : _a.map(invalidate)
				};
			});
			this.shouldViewTransition = false;
			return this.load({ sync: opts == null ? void 0 : opts.sync });
		};
		this.resolveRedirect = (redirect2) => {
			if (!redirect2.options.href) {
				redirect2.options.href = this.buildLocation(redirect2.options).href;
				redirect2.headers.set("Location", redirect2.options.href);
			}
			if (!redirect2.headers.get("Location")) redirect2.headers.set("Location", redirect2.options.href);
			return redirect2;
		};
		this.clearCache = (opts) => {
			const filter = opts == null ? void 0 : opts.filter;
			if (filter !== void 0) this.__store.setState((s) => {
				return {
					...s,
					cachedMatches: s.cachedMatches.filter((m) => !filter(m))
				};
			});
			else this.__store.setState((s) => {
				return {
					...s,
					cachedMatches: []
				};
			});
		};
		this.clearExpiredCache = () => {
			const filter = (d) => {
				const route = this.looseRoutesById[d.routeId];
				if (!route.options.loader) return true;
				const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 3e5;
				if (d.status === "error") return true;
				return Date.now() - d.updatedAt >= gcTime;
			};
			this.clearCache({ filter });
		};
		this.loadRouteChunk = loadRouteChunk;
		this.preloadRoute = async (opts) => {
			const next = this.buildLocation(opts);
			let matches = this.matchRoutes(next, {
				throwOnError: true,
				preload: true,
				dest: opts
			});
			const activeMatchIds = new Set([...this.state.matches, ...this.state.pendingMatches ?? []].map((d) => d.id));
			const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.state.cachedMatches.map((d) => d.id)]);
			batch(() => {
				matches.forEach((match) => {
					if (!loadedMatchIds.has(match.id)) this.__store.setState((s) => ({
						...s,
						cachedMatches: [...s.cachedMatches, match]
					}));
				});
			});
			try {
				matches = await loadMatches({
					router: this,
					matches,
					location: next,
					preload: true,
					updateMatch: (id, updater) => {
						if (activeMatchIds.has(id)) matches = matches.map((d) => d.id === id ? updater(d) : d);
						else this.updateMatch(id, updater);
					}
				});
				return matches;
			} catch (err) {
				if (isRedirect(err)) {
					if (err.options.reloadDocument) return;
					return await this.preloadRoute({
						...err.options,
						_fromLocation: next
					});
				}
				if (!isNotFound(err)) console.error(err);
				return;
			}
		};
		this.matchRoute = (location, opts) => {
			const matchLocation = {
				...location,
				to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
				params: location.params || {},
				leaveParams: true
			};
			const next = this.buildLocation(matchLocation);
			if ((opts == null ? void 0 : opts.pending) && this.state.status !== "pending") return false;
			const baseLocation = ((opts == null ? void 0 : opts.pending) === void 0 ? !this.state.isLoading : opts.pending) ? this.latestLocation : this.state.resolvedLocation || this.state.location;
			const match = matchPathname(this.basepath, baseLocation.pathname, {
				...opts,
				to: next.pathname
			}, this.parsePathnameCache);
			if (!match) return false;
			if (location.params) {
				if (!deepEqual(match, location.params, { partial: true })) return false;
			}
			if (match && ((opts == null ? void 0 : opts.includeSearch) ?? true)) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match : false;
			return match;
		};
		this.hasNotFoundMatch = () => {
			return this.__store.state.matches.some((d) => d.status === "notFound" || d.globalNotFound);
		};
		this.update({
			defaultPreloadDelay: 50,
			defaultPendingMs: 1e3,
			defaultPendingMinMs: 500,
			context: void 0,
			...options,
			caseSensitive: options.caseSensitive ?? false,
			notFoundMode: options.notFoundMode ?? "fuzzy",
			stringifySearch: options.stringifySearch ?? defaultStringifySearch,
			parseSearch: options.parseSearch ?? defaultParseSearch
		});
		if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
	}
	isShell() {
		return !!this.options.isShell;
	}
	isPrerendering() {
		return !!this.options.isPrerendering;
	}
	get state() {
		return this.__store.state;
	}
	get looseRoutesById() {
		return this.routesById;
	}
	matchRoutesInternal(next, opts) {
		var _a;
		const { foundRoute, matchedRoutes, routeParams } = this.getMatchedRoutes(next.pathname, (_a = opts == null ? void 0 : opts.dest) == null ? void 0 : _a.to);
		let isGlobalNotFound = false;
		if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) {
			if (this.options.notFoundRoute) matchedRoutes.push(this.options.notFoundRoute);
			else isGlobalNotFound = true;
		}
		const globalNotFoundRouteId = (() => {
			if (!isGlobalNotFound) return;
			if (this.options.notFoundMode !== "root") for (let i = matchedRoutes.length - 1; i >= 0; i--) {
				const route = matchedRoutes[i];
				if (route.children) return route.id;
			}
			return rootRouteId;
		})();
		const matches = [];
		const getParentContext = (parentMatch) => {
			return !(parentMatch == null ? void 0 : parentMatch.id) ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
		};
		matchedRoutes.forEach((route, index) => {
			var _a2, _b, _c;
			const parentMatch = matches[index - 1];
			const [preMatchSearch, strictMatchSearch, searchError] = (() => {
				const parentSearch = (parentMatch == null ? void 0 : parentMatch.search) ?? next.search;
				const parentStrictSearch = (parentMatch == null ? void 0 : parentMatch._strictSearch) ?? void 0;
				try {
					const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
					return [
						{
							...parentSearch,
							...strictSearch
						},
						{
							...parentStrictSearch,
							...strictSearch
						},
						void 0
					];
				} catch (err) {
					let searchParamError = err;
					if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
					if (opts == null ? void 0 : opts.throwOnError) throw searchParamError;
					return [
						parentSearch,
						{},
						searchParamError
					];
				}
			})();
			const loaderDeps = ((_b = (_a2 = route.options).loaderDeps) == null ? void 0 : _b.call(_a2, { search: preMatchSearch })) ?? "";
			const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
			const { interpolatedPath, usedParams } = interpolatePath({
				path: route.fullPath,
				params: routeParams,
				decodeCharMap: this.pathParamsDecodeCharMap
			});
			const matchId = interpolatePath({
				path: route.id,
				params: routeParams,
				leaveWildcards: true,
				decodeCharMap: this.pathParamsDecodeCharMap,
				parseCache: this.parsePathnameCache
			}).interpolatedPath + loaderDepsHash;
			const existingMatch = this.getMatch(matchId);
			const previousMatch = this.state.matches.find((d) => d.routeId === route.id);
			const strictParams = (existingMatch == null ? void 0 : existingMatch._strictParams) ?? usedParams;
			let paramsError = void 0;
			if (!existingMatch) {
				const strictParseParams = ((_c = route.options.params) == null ? void 0 : _c.parse) ?? route.options.parseParams;
				if (strictParseParams) try {
					Object.assign(strictParams, strictParseParams(strictParams));
				} catch (err) {
					paramsError = new PathParamError(err.message, { cause: err });
					if (opts == null ? void 0 : opts.throwOnError) throw paramsError;
				}
			}
			Object.assign(routeParams, strictParams);
			const cause = previousMatch ? "stay" : "enter";
			let match;
			if (existingMatch) match = {
				...existingMatch,
				cause,
				params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
				_strictParams: strictParams,
				search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : replaceEqualDeep(existingMatch.search, preMatchSearch),
				_strictSearch: strictMatchSearch
			};
			else {
				const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
				match = {
					id: matchId,
					index,
					routeId: route.id,
					params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
					_strictParams: strictParams,
					pathname: joinPaths([this.basepath, interpolatedPath]),
					updatedAt: Date.now(),
					search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
					_strictSearch: strictMatchSearch,
					searchError: void 0,
					status,
					isFetching: false,
					error: void 0,
					paramsError,
					__routeContext: void 0,
					_nonReactive: { loadPromise: createControlledPromise() },
					__beforeLoadContext: void 0,
					context: {},
					abortController: new AbortController(),
					fetchCount: 0,
					cause,
					loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
					invalid: false,
					preload: false,
					links: void 0,
					scripts: void 0,
					headScripts: void 0,
					meta: void 0,
					staticData: route.options.staticData || {},
					fullPath: route.fullPath
				};
			}
			if (!(opts == null ? void 0 : opts.preload)) match.globalNotFound = globalNotFoundRouteId === route.id;
			match.searchError = searchError;
			const parentContext = getParentContext(parentMatch);
			match.context = {
				...parentContext,
				...match.__routeContext,
				...match.__beforeLoadContext
			};
			matches.push(match);
		});
		matches.forEach((match, index) => {
			const route = this.looseRoutesById[match.routeId];
			if (!this.getMatch(match.id) && (opts == null ? void 0 : opts._buildLocation) !== true) {
				const parentMatch = matches[index - 1];
				const parentContext = getParentContext(parentMatch);
				if (route.options.context) {
					const contextFnContext = {
						deps: match.loaderDeps,
						params: match.params,
						context: parentContext ?? {},
						location: next,
						navigate: (opts2) => this.navigate({
							...opts2,
							_fromLocation: next
						}),
						buildLocation: this.buildLocation,
						cause: match.cause,
						abortController: match.abortController,
						preload: !!match.preload,
						matches
					};
					match.__routeContext = route.options.context(contextFnContext) ?? void 0;
				}
				match.context = {
					...parentContext,
					...match.__routeContext,
					...match.__beforeLoadContext
				};
			}
		});
		return matches;
	}
};
var SearchParamError = class extends Error {};
var PathParamError = class extends Error {};
function getInitialRouterState(location) {
	return {
		loadedAt: 0,
		isLoading: false,
		isTransitioning: false,
		status: "idle",
		resolvedLocation: void 0,
		location,
		matches: [],
		pendingMatches: [],
		cachedMatches: [],
		statusCode: 200
	};
}
function validateSearch(validateSearch2, input) {
	if (validateSearch2 == null) return {};
	if ("~standard" in validateSearch2) {
		const result = validateSearch2["~standard"].validate(input);
		if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
		if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
		return result.value;
	}
	if ("parse" in validateSearch2) return validateSearch2.parse(input);
	if (typeof validateSearch2 === "function") return validateSearch2(input);
	return {};
}
function getMatchedRoutes({ pathname, routePathname, basepath, caseSensitive, routesByPath, routesById, flatRoutes, parseCache }) {
	let routeParams = {};
	const trimmedPath = trimPathRight(pathname);
	const getMatchedParams = (route) => {
		var _a;
		return matchPathname(basepath, trimmedPath, {
			to: route.fullPath,
			caseSensitive: ((_a = route.options) == null ? void 0 : _a.caseSensitive) ?? caseSensitive,
			fuzzy: true
		}, parseCache);
	};
	let foundRoute = routePathname !== void 0 ? routesByPath[routePathname] : void 0;
	if (foundRoute) routeParams = getMatchedParams(foundRoute);
	else {
		let fuzzyMatch = void 0;
		for (const route of flatRoutes) {
			const matchedParams = getMatchedParams(route);
			if (matchedParams) {
				if (route.path !== "/" && matchedParams["**"]) {
					if (!fuzzyMatch) fuzzyMatch = {
						foundRoute: route,
						routeParams: matchedParams
					};
				} else {
					foundRoute = route;
					routeParams = matchedParams;
					break;
				}
			}
		}
		if (!foundRoute && fuzzyMatch) {
			foundRoute = fuzzyMatch.foundRoute;
			routeParams = fuzzyMatch.routeParams;
		}
	}
	let routeCursor = foundRoute || routesById["__root__"];
	const matchedRoutes = [routeCursor];
	while (routeCursor.parentRoute) {
		routeCursor = routeCursor.parentRoute;
		matchedRoutes.push(routeCursor);
	}
	matchedRoutes.reverse();
	return {
		matchedRoutes,
		routeParams,
		foundRoute
	};
}
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
	const allMiddlewares = destRoutes.reduce((acc, route) => {
		var _a;
		const middlewares = [];
		if ("search" in route.options) {
			if ((_a = route.options.search) == null ? void 0 : _a.middlewares) middlewares.push(...route.options.search.middlewares);
		} else if (route.options.preSearchFilters || route.options.postSearchFilters) {
			const legacyMiddleware = ({ search: search2, next }) => {
				let nextSearch = search2;
				if ("preSearchFilters" in route.options && route.options.preSearchFilters) nextSearch = route.options.preSearchFilters.reduce((prev, next2) => next2(prev), search2);
				const result = next(nextSearch);
				if ("postSearchFilters" in route.options && route.options.postSearchFilters) return route.options.postSearchFilters.reduce((prev, next2) => next2(prev), result);
				return result;
			};
			middlewares.push(legacyMiddleware);
		}
		if (_includeValidateSearch && route.options.validateSearch) {
			const validate = ({ search: search2, next }) => {
				const result = next(search2);
				try {
					return {
						...result,
						...validateSearch(route.options.validateSearch, result) ?? void 0
					};
				} catch {
					return result;
				}
			};
			middlewares.push(validate);
		}
		return acc.concat(middlewares);
	}, []) ?? [];
	const final = ({ search: search2 }) => {
		if (!dest.search) return {};
		if (dest.search === true) return search2;
		return functionalUpdate(dest.search, search2);
	};
	allMiddlewares.push(final);
	const applyNext = (index, currentSearch) => {
		if (index >= allMiddlewares.length) return currentSearch;
		const middleware = allMiddlewares[index];
		const next = (newSearch) => {
			return applyNext(index + 1, newSearch);
		};
		return middleware({
			search: currentSearch,
			next
		});
	};
	return applyNext(0, search);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/link.js
var preloadWarning = "Error preloading route! ☝️";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+router-core@1.131.50/node_modules/@tanstack/router-core/dist/esm/route.js
var BaseRoute = class {
	constructor(options) {
		this.init = (opts) => {
			var _a, _b;
			this.originalIndex = opts.originalIndex;
			const options2 = this.options;
			const isRoot = !(options2 == null ? void 0 : options2.path) && !(options2 == null ? void 0 : options2.id);
			this.parentRoute = (_b = (_a = this.options).getParentRoute) == null ? void 0 : _b.call(_a);
			if (isRoot) this._path = rootRouteId;
			else if (!this.parentRoute) invariant(false, `Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a Route instance.`);
			let path = isRoot ? rootRouteId : options2 == null ? void 0 : options2.path;
			if (path && path !== "/") path = trimPathLeft(path);
			const customId = (options2 == null ? void 0 : options2.id) || path;
			let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
			if (path === "__root__") path = "/";
			if (id !== "__root__") id = joinPaths(["/", id]);
			const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
			this._path = path;
			this._id = id;
			this._fullPath = fullPath;
			this._to = fullPath;
		};
		this.clone = (other) => {
			this._path = other._path;
			this._id = other._id;
			this._fullPath = other._fullPath;
			this._to = other._to;
			this.options.getParentRoute = other.options.getParentRoute;
			this.children = other.children;
		};
		this.addChildren = (children) => {
			return this._addFileChildren(children);
		};
		this._addFileChildren = (children) => {
			if (Array.isArray(children)) this.children = children;
			if (typeof children === "object" && children !== null) this.children = Object.values(children);
			return this;
		};
		this._addFileTypes = () => {
			return this;
		};
		this.updateLoader = (options2) => {
			Object.assign(this.options, options2);
			return this;
		};
		this.update = (options2) => {
			Object.assign(this.options, options2);
			return this;
		};
		this.lazy = (lazyFn) => {
			this.lazyFn = lazyFn;
			return this;
		};
		this.options = options || {};
		this.isRoot = !(options == null ? void 0 : options.getParentRoute);
		if ((options == null ? void 0 : options.id) && (options == null ? void 0 : options.path)) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
	}
	get to() {
		return this._to;
	}
	get id() {
		return this._id;
	}
	get path() {
		return this._path;
	}
	get fullPath() {
		return this._fullPath;
	}
};
var BaseRootRoute = class extends BaseRoute {
	constructor(options) {
		super(options);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js
function CatchBoundary(props) {
	const errorComponent = props.errorComponent ?? ErrorComponent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundaryImpl, {
		getResetKey: props.getResetKey,
		onCatch: props.onCatch,
		children: ({ error, reset }) => {
			if (error) return import_react.createElement(errorComponent, {
				error,
				reset
			});
			return props.children;
		}
	});
}
var CatchBoundaryImpl = class extends import_react.Component {
	constructor() {
		super(...arguments);
		this.state = { error: null };
	}
	static getDerivedStateFromProps(props) {
		return { resetKey: props.getResetKey() };
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	reset() {
		this.setState({ error: null });
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.error && prevState.resetKey !== this.state.resetKey) this.reset();
	}
	componentDidCatch(error, errorInfo) {
		if (this.props.onCatch) this.props.onCatch(error, errorInfo);
	}
	render() {
		return this.props.children({
			error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
			reset: () => {
				this.reset();
			}
		});
	}
};
function ErrorComponent({ error }) {
	const [show, setShow] = import_react.useState(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: ".5rem",
			maxWidth: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: ".5rem"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					style: { fontSize: "1rem" },
					children: "Something went wrong!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					style: {
						appearance: "none",
						fontSize: ".6em",
						border: "1px solid currentColor",
						padding: ".1rem .2rem",
						fontWeight: "bold",
						borderRadius: ".25rem"
					},
					onClick: () => setShow((d) => !d),
					children: show ? "Hide Error" : "Show Error"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: ".25rem" } }),
			show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				style: {
					fontSize: ".7em",
					border: "1px solid red",
					borderRadius: ".25rem",
					padding: ".3rem",
					color: "red",
					overflow: "auto"
				},
				children: error.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: error.message }) : null
			}) }) : null
		]
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/ClientOnly.js
function ClientOnly({ children, fallback = null }) {
	return useHydrated() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: fallback });
}
function useHydrated() {
	return import_react.useSyncExternalStore(subscribe, () => true, () => false);
}
function subscribe() {
	return () => {};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.1.5/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useState = React.useState;
	var useEffect = React.useEffect;
	var useLayoutEffect = React.useLayoutEffect;
	var useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.1.5/node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_production();
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.1.5/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
/**
* @license React
* use-sync-external-store-shim/with-selector.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_with_selector_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	var shim = require_shim();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useSyncExternalStore = shim.useSyncExternalStore;
	var useRef = React.useRef;
	var useEffect = React.useEffect;
	var useMemo = React.useMemo;
	var useDebugValue = React.useDebugValue;
	exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
		var instRef = useRef(null);
		if (null === instRef.current) {
			var inst = {
				hasValue: !1,
				value: null
			};
			instRef.current = inst;
		} else inst = instRef.current;
		instRef = useMemo(function() {
			function memoizedSelector(nextSnapshot) {
				if (!hasMemo) {
					hasMemo = !0;
					memoizedSnapshot = nextSnapshot;
					nextSnapshot = selector(nextSnapshot);
					if (void 0 !== isEqual && inst.hasValue) {
						var currentSelection = inst.value;
						if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
					}
					return memoizedSelection = nextSnapshot;
				}
				currentSelection = memoizedSelection;
				if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
				var nextSelection = selector(nextSnapshot);
				if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
				memoizedSnapshot = nextSnapshot;
				return memoizedSelection = nextSelection;
			}
			var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
			return [function() {
				return memoizedSelector(getSnapshot());
			}, null === maybeGetServerSnapshot ? void 0 : function() {
				return memoizedSelector(maybeGetServerSnapshot());
			}];
		}, [
			getSnapshot,
			getServerSnapshot,
			selector,
			isEqual
		]);
		var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
		useEffect(function() {
			inst.hasValue = !0;
			inst.value = value;
		}, [value]);
		useDebugValue(value);
		return value;
	};
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-store@0.7.7_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-store/dist/esm/index.js
var import_with_selector = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_with_selector_production();
})))();
function useStore(store, selector = (d) => d) {
	return (0, import_with_selector.useSyncExternalStoreWithSelector)(store.subscribe, () => store.state, () => store.state, selector, shallow);
}
function shallow(objA, objB) {
	if (Object.is(objA, objB)) return true;
	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
	if (objA instanceof Map && objB instanceof Map) {
		if (objA.size !== objB.size) return false;
		for (const [k, v] of objA) if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
		return true;
	}
	if (objA instanceof Set && objB instanceof Set) {
		if (objA.size !== objB.size) return false;
		for (const v of objA) if (!objB.has(v)) return false;
		return true;
	}
	if (objA instanceof Date && objB instanceof Date) {
		if (objA.getTime() !== objB.getTime()) return false;
		return true;
	}
	const keysA = getOwnKeys(objA);
	if (keysA.length !== getOwnKeys(objB).length) return false;
	for (let i = 0; i < keysA.length; i++) if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) return false;
	return true;
}
function getOwnKeys(obj) {
	return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/routerContext.js
var routerContext = import_react.createContext(null);
function getRouterContext() {
	if (typeof document === "undefined") return routerContext;
	if (window.__TSR_ROUTER_CONTEXT__) return window.__TSR_ROUTER_CONTEXT__;
	window.__TSR_ROUTER_CONTEXT__ = routerContext;
	return routerContext;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useRouter.js
function useRouter(opts) {
	const value = import_react.useContext(getRouterContext());
	opts == null || opts.warn;
	return value;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useRouterState.js
function useRouterState(opts) {
	const contextRouter = useRouter({ warn: (opts == null ? void 0 : opts.router) === void 0 });
	const router = (opts == null ? void 0 : opts.router) || contextRouter;
	const previousResult = (0, import_react.useRef)(void 0);
	return useStore(router.__store, (state) => {
		if (opts == null ? void 0 : opts.select) {
			if (opts.structuralSharing ?? router.options.defaultStructuralSharing) {
				const newSlice = replaceEqualDeep(previousResult.current, opts.select(state));
				previousResult.current = newSlice;
				return newSlice;
			}
			return opts.select(state);
		}
		return state;
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/matchContext.js
var matchContext = import_react.createContext(void 0);
var dummyMatchContext = import_react.createContext(void 0);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useMatch.js
function useMatch(opts) {
	const nearestMatchId = import_react.useContext(opts.from ? dummyMatchContext : matchContext);
	return useRouterState({
		select: (state) => {
			const match = state.matches.find((d) => opts.from ? opts.from === d.routeId : d.id === nearestMatchId);
			invariant(!((opts.shouldThrow ?? true) && !match), `Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`);
			if (match === void 0) return;
			return opts.select ? opts.select(match) : match;
		},
		structuralSharing: opts.structuralSharing
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useLoaderData.js
function useLoaderData(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		structuralSharing: opts.structuralSharing,
		select: (s) => {
			return opts.select ? opts.select(s.loaderData) : s.loaderData;
		}
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useLoaderDeps.js
function useLoaderDeps(opts) {
	const { select, ...rest } = opts;
	return useMatch({
		...rest,
		select: (s) => {
			return select ? select(s.loaderDeps) : s.loaderDeps;
		}
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useParams.js
function useParams(opts) {
	return useMatch({
		from: opts.from,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		strict: opts.strict,
		select: (match) => {
			const params = opts.strict === false ? match.params : match._strictParams;
			return opts.select ? opts.select(params) : params;
		}
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useSearch.js
function useSearch(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.search) : match.search;
		}
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/useNavigate.js
function useNavigate(_defaultOpts) {
	const router = useRouter();
	return import_react.useCallback((options) => {
		return router.navigate({
			...options,
			from: options.from ?? (_defaultOpts == null ? void 0 : _defaultOpts.from)
		});
	}, [_defaultOpts == null ? void 0 : _defaultOpts.from, router]);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/utils.js
var useLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
function usePrevious(value) {
	const ref = import_react.useRef({
		value,
		prev: null
	});
	const current = ref.current.value;
	if (value !== current) ref.current = {
		value,
		prev: current
	};
	return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
	import_react.useEffect(() => {
		if (!ref.current || options.disabled || typeof IntersectionObserver !== "function") return;
		const observer = new IntersectionObserver(([entry]) => {
			callback(entry);
		}, intersectionObserverOptions);
		observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, [
		callback,
		intersectionObserverOptions,
		options.disabled,
		ref
	]);
}
function useForwardedRef(ref) {
	const innerRef = import_react.useRef(null);
	import_react.useImperativeHandle(ref, () => innerRef.current, []);
	return innerRef;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/link.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function useLinkProps(options, forwardedRef) {
	const router = useRouter();
	const [isTransitioning, setIsTransitioning] = import_react.useState(false);
	const hasRenderFetched = import_react.useRef(false);
	const innerRef = useForwardedRef(forwardedRef);
	const { activeProps, inactiveProps, activeOptions, to, preload: userPreload, preloadDelay: userPreloadDelay, hashScrollIntoView, replace, startTransition, resetScroll, viewTransition, children, target, disabled, style, className, onClick, onFocus, onMouseEnter, onMouseLeave, onTouchStart, ignoreBlocker, params: _params, search: _search, hash: _hash, state: _state, mask: _mask, reloadDocument: _reloadDocument, unsafeRelative: _unsafeRelative, from: _from, _fromLocation, ...propsSafeToSpread } = options;
	const type = import_react.useMemo(() => {
		try {
			new URL(to);
			return "external";
		} catch {}
		return "internal";
	}, [to]);
	const currentSearch = useRouterState({
		select: (s) => s.location.search,
		structuralSharing: true
	});
	const from = options.from;
	const _options = import_react.useMemo(() => {
		return {
			...options,
			from
		};
	}, [
		router,
		currentSearch,
		from,
		options._fromLocation,
		options.hash,
		options.to,
		options.search,
		options.params,
		options.state,
		options.mask,
		options.unsafeRelative
	]);
	const next = import_react.useMemo(() => router.buildLocation({ ..._options }), [router, _options]);
	const isExternal = type === "external";
	const preload = options.reloadDocument || isExternal ? false : userPreload ?? router.options.defaultPreload;
	const preloadDelay = userPreloadDelay ?? router.options.defaultPreloadDelay ?? 0;
	const isActive = useRouterState({ select: (s) => {
		if (isExternal) return false;
		if (activeOptions == null ? void 0 : activeOptions.exact) {
			if (!exactPathTest(s.location.pathname, next.pathname, router.basepath)) return false;
		} else {
			const currentPathSplit = removeTrailingSlash(s.location.pathname, router.basepath);
			const nextPathSplit = removeTrailingSlash(next.pathname, router.basepath);
			if (!(currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/"))) return false;
		}
		if ((activeOptions == null ? void 0 : activeOptions.includeSearch) ?? true) {
			if (!deepEqual(s.location.search, next.search, {
				partial: !(activeOptions == null ? void 0 : activeOptions.exact),
				ignoreUndefined: !(activeOptions == null ? void 0 : activeOptions.explicitUndefined)
			})) return false;
		}
		if (activeOptions == null ? void 0 : activeOptions.includeHash) return s.location.hash === next.hash;
		return true;
	} });
	const doPreload = import_react.useCallback(() => {
		router.preloadRoute({ ..._options }).catch((err) => {
			console.warn(err);
			console.warn(preloadWarning);
		});
	}, [router, _options]);
	useIntersectionObserver(innerRef, import_react.useCallback((entry) => {
		if (entry == null ? void 0 : entry.isIntersecting) doPreload();
	}, [doPreload]), intersectionObserverOptions, { disabled: !!disabled || !(preload === "viewport") });
	import_react.useEffect(() => {
		if (hasRenderFetched.current) return;
		if (!disabled && preload === "render") {
			doPreload();
			hasRenderFetched.current = true;
		}
	}, [
		disabled,
		doPreload,
		preload
	]);
	const handleClick = (e) => {
		const elementTarget = e.currentTarget.target;
		const effectiveTarget = target !== void 0 ? target : elementTarget;
		if (!disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
			e.preventDefault();
			(0, import_react_dom.flushSync)(() => {
				setIsTransitioning(true);
			});
			const unsub = router.subscribe("onResolved", () => {
				unsub();
				setIsTransitioning(false);
			});
			router.navigate({
				..._options,
				replace,
				resetScroll,
				hashScrollIntoView,
				startTransition,
				viewTransition,
				ignoreBlocker
			});
		}
	};
	if (isExternal) return {
		...propsSafeToSpread,
		ref: innerRef,
		type,
		href: to,
		...children && { children },
		...target && { target },
		...disabled && { disabled },
		...style && { style },
		...className && { className },
		...onClick && { onClick },
		...onFocus && { onFocus },
		...onMouseEnter && { onMouseEnter },
		...onMouseLeave && { onMouseLeave },
		...onTouchStart && { onTouchStart }
	};
	const handleFocus = (_) => {
		if (disabled) return;
		if (preload) doPreload();
	};
	const handleTouchStart = handleFocus;
	const handleEnter = (e) => {
		if (disabled || !preload) return;
		if (!preloadDelay) doPreload();
		else {
			const eventTarget = e.target;
			if (timeoutMap.has(eventTarget)) return;
			const id = setTimeout(() => {
				timeoutMap.delete(eventTarget);
				doPreload();
			}, preloadDelay);
			timeoutMap.set(eventTarget, id);
		}
	};
	const handleLeave = (e) => {
		if (disabled || !preload || !preloadDelay) return;
		const eventTarget = e.target;
		const id = timeoutMap.get(eventTarget);
		if (id) {
			clearTimeout(id);
			timeoutMap.delete(eventTarget);
		}
	};
	const resolvedActiveProps = isActive ? functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
	const resolvedInactiveProps = isActive ? STATIC_EMPTY_OBJECT : functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
	const resolvedClassName = [
		className,
		resolvedActiveProps.className,
		resolvedInactiveProps.className
	].filter(Boolean).join(" ");
	const resolvedStyle = (style || resolvedActiveProps.style || resolvedInactiveProps.style) && {
		...style,
		...resolvedActiveProps.style,
		...resolvedInactiveProps.style
	};
	return {
		...propsSafeToSpread,
		...resolvedActiveProps,
		...resolvedInactiveProps,
		href: disabled ? void 0 : next.maskedLocation ? router.history.createHref(next.maskedLocation.href) : router.history.createHref(next.href),
		ref: innerRef,
		onClick: composeHandlers([onClick, handleClick]),
		onFocus: composeHandlers([onFocus, handleFocus]),
		onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
		onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
		onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
		disabled: !!disabled,
		target,
		...resolvedStyle && { style: resolvedStyle },
		...resolvedClassName && { className: resolvedClassName },
		...disabled && STATIC_DISABLED_PROPS,
		...isActive && STATIC_ACTIVE_PROPS,
		...isTransitioning && STATIC_TRANSITIONING_PROPS
	};
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var STATIC_DISABLED_PROPS = {
	role: "link",
	"aria-disabled": true
};
var STATIC_ACTIVE_PROPS = {
	"data-status": "active",
	"aria-current": "page"
};
var STATIC_TRANSITIONING_PROPS = { "data-transitioning": "transitioning" };
var timeoutMap = /* @__PURE__ */ new WeakMap();
var intersectionObserverOptions = { rootMargin: "100px" };
var composeHandlers = (handlers) => (e) => {
	for (const handler of handlers) {
		if (!handler) continue;
		if (e.defaultPrevented) return;
		handler(e);
	}
};
var Link = import_react.forwardRef((props, ref) => {
	const { _asChild, ...rest } = props;
	const { type: _type, ref: innerRef, ...linkProps } = useLinkProps(rest, ref);
	const children = typeof rest.children === "function" ? rest.children({ isActive: linkProps["data-status"] === "active" }) : rest.children;
	if (_asChild === void 0) delete linkProps.disabled;
	return import_react.createElement(_asChild ? _asChild : "a", {
		...linkProps,
		ref: innerRef
	}, children);
});
function isCtrlEvent(e) {
	return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/route.js
var Route = class extends BaseRoute {
	/**
	* @deprecated Use the `createRoute` function instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				select: opts == null ? void 0 : opts.select,
				from: this.id,
				structuralSharing: opts == null ? void 0 : opts.structuralSharing
			});
		};
		this.useRouteContext = (opts) => {
			return useMatch({
				...opts,
				from: this.id,
				select: (d) => (opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				select: opts == null ? void 0 : opts.select,
				structuralSharing: opts == null ? void 0 : opts.structuralSharing,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				select: opts == null ? void 0 : opts.select,
				structuralSharing: opts == null ? void 0 : opts.structuralSharing,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
		this.$$typeof = Symbol.for("react.memo");
	}
};
function createRoute(options) {
	return new Route(options);
}
var RootRoute = class extends BaseRootRoute {
	/**
	* @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				select: opts == null ? void 0 : opts.select,
				from: this.id,
				structuralSharing: opts == null ? void 0 : opts.structuralSharing
			});
		};
		this.useRouteContext = (opts) => {
			return useMatch({
				...opts,
				from: this.id,
				select: (d) => (opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				select: opts == null ? void 0 : opts.select,
				structuralSharing: opts == null ? void 0 : opts.structuralSharing,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				select: opts == null ? void 0 : opts.select,
				structuralSharing: opts == null ? void 0 : opts.structuralSharing,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
		this.$$typeof = Symbol.for("react.memo");
	}
};
function createRootRoute(options) {
	return new RootRoute(options);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/fileRoute.js
function createFileRoute(path) {
	if (typeof path === "object") return new FileRoute(path, { silent: true }).createRoute(path);
	return new FileRoute(path, { silent: true }).createRoute;
}
var FileRoute = class {
	constructor(path, _opts) {
		this.path = path;
		this.createRoute = (options) => {
			this.silent;
			const route = createRoute(options);
			route.isRoot = false;
			return route;
		};
		this.silent = _opts == null ? void 0 : _opts.silent;
	}
};
var LazyRoute = class {
	constructor(opts) {
		this.useMatch = (opts2) => {
			return useMatch({
				select: opts2 == null ? void 0 : opts2.select,
				from: this.options.id,
				structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing
			});
		};
		this.useRouteContext = (opts2) => {
			return useMatch({
				from: this.options.id,
				select: (d) => (opts2 == null ? void 0 : opts2.select) ? opts2.select(d.context) : d.context
			});
		};
		this.useSearch = (opts2) => {
			return useSearch({
				select: opts2 == null ? void 0 : opts2.select,
				structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
				from: this.options.id
			});
		};
		this.useParams = (opts2) => {
			return useParams({
				select: opts2 == null ? void 0 : opts2.select,
				structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
				from: this.options.id
			});
		};
		this.useLoaderDeps = (opts2) => {
			return useLoaderDeps({
				...opts2,
				from: this.options.id
			});
		};
		this.useLoaderData = (opts2) => {
			return useLoaderData({
				...opts2,
				from: this.options.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: useRouter().routesById[this.options.id].fullPath });
		};
		this.options = opts;
		this.$$typeof = Symbol.for("react.memo");
	}
};
function createLazyFileRoute(id) {
	if (typeof id === "object") return new LazyRoute(id);
	return (opts) => new LazyRoute({
		id,
		...opts
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/Transitioner.js
function Transitioner() {
	const router = useRouter();
	const mountLoadForRouter = import_react.useRef({
		router,
		mounted: false
	});
	const [isTransitioning, setIsTransitioning] = import_react.useState(false);
	const { hasPendingMatches, isLoading } = useRouterState({
		select: (s) => ({
			isLoading: s.isLoading,
			hasPendingMatches: s.matches.some((d) => d.status === "pending")
		}),
		structuralSharing: true
	});
	const previousIsLoading = usePrevious(isLoading);
	const isAnyPending = isLoading || isTransitioning || hasPendingMatches;
	const previousIsAnyPending = usePrevious(isAnyPending);
	const isPagePending = isLoading || hasPendingMatches;
	const previousIsPagePending = usePrevious(isPagePending);
	router.startTransition = (fn) => {
		setIsTransitioning(true);
		import_react.startTransition(() => {
			fn();
			setIsTransitioning(false);
		});
	};
	import_react.useEffect(() => {
		const unsub = router.history.subscribe(router.load);
		const nextLocation = router.buildLocation({
			to: router.latestLocation.pathname,
			search: true,
			params: true,
			hash: true,
			state: true,
			_includeValidateSearch: true
		});
		if (trimPathRight(router.latestLocation.href) !== trimPathRight(nextLocation.href)) router.commitLocation({
			...nextLocation,
			replace: true
		});
		return () => {
			unsub();
		};
	}, [router, router.history]);
	useLayoutEffect(() => {
		if (typeof window !== "undefined" && router.ssr || mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted) return;
		mountLoadForRouter.current = {
			router,
			mounted: true
		};
		const tryLoad = async () => {
			try {
				await router.load();
			} catch (err) {
				console.error(err);
			}
		};
		tryLoad();
	}, [router]);
	useLayoutEffect(() => {
		if (previousIsLoading && !isLoading) router.emit({
			type: "onLoad",
			...getLocationChangeInfo(router.state)
		});
	}, [
		previousIsLoading,
		router,
		isLoading
	]);
	useLayoutEffect(() => {
		if (previousIsPagePending && !isPagePending) router.emit({
			type: "onBeforeRouteMount",
			...getLocationChangeInfo(router.state)
		});
	}, [
		isPagePending,
		previousIsPagePending,
		router
	]);
	useLayoutEffect(() => {
		if (previousIsAnyPending && !isAnyPending) {
			router.emit({
				type: "onResolved",
				...getLocationChangeInfo(router.state)
			});
			router.__store.setState((s) => ({
				...s,
				status: "idle",
				resolvedLocation: s.location
			}));
			handleHashScroll(router);
		}
	}, [
		isAnyPending,
		previousIsAnyPending,
		router
	]);
	return null;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/not-found.js
function CatchNotFound(props) {
	const resetKey = useRouterState({ select: (s) => `not-found-${s.location.pathname}-${s.status}` });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundary, {
		getResetKey: () => resetKey,
		onCatch: (error, errorInfo) => {
			var _a;
			if (isNotFound(error)) (_a = props.onCatch) == null || _a.call(props, error, errorInfo);
			else throw error;
		},
		errorComponent: ({ error }) => {
			var _a;
			if (isNotFound(error)) return (_a = props.fallback) == null ? void 0 : _a.call(props, error);
			else throw error;
		},
		children: props.children
	});
}
function DefaultGlobalNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not Found" });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js
function SafeFragment(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: props.children });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/renderRouteNotFound.js
function renderRouteNotFound(router, route, data) {
	if (!route.options.notFoundComponent) {
		if (router.options.defaultNotFoundComponent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.defaultNotFoundComponent, { data });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultGlobalNotFound, {});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(route.options.notFoundComponent, { data });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/ScriptOnce.js
function ScriptOnce({ children }) {
	if (typeof document !== "undefined") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		className: "$tsr",
		dangerouslySetInnerHTML: { __html: [children].filter(Boolean).join("\n") }
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/scroll-restoration.js
function ScrollRestoration() {
	const router = useRouter();
	const userKey = (router.options.getScrollRestorationKey || defaultGetScrollRestorationKey)(router.latestLocation);
	const resolvedKey = userKey !== defaultGetScrollRestorationKey(router.latestLocation) ? userKey : void 0;
	if (!router.isScrollRestoring || !router.isServer) return null;
	const restoreScrollOptions = {
		storageKey,
		shouldScrollRestoration: true
	};
	if (resolvedKey) restoreScrollOptions.key = resolvedKey;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptOnce, { children: `(${restoreScroll.toString()})(${JSON.stringify(restoreScrollOptions)})` });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/Match.js
var Match = import_react.memo(function MatchImpl({ matchId }) {
	var _a, _b;
	const router = useRouter();
	const matchState = useRouterState({
		select: (s) => {
			const match = s.matches.find((d) => d.id === matchId);
			invariant(match, `Could not find match for matchId "${matchId}". Please file an issue!`);
			return {
				routeId: match.routeId,
				ssr: match.ssr,
				_displayPending: match._displayPending
			};
		},
		structuralSharing: true
	});
	const route = router.routesById[matchState.routeId];
	const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
	const pendingElement = PendingComponent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingComponent, {}) : null;
	const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
	const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
	const routeNotFoundComponent = route.isRoot ? route.options.notFoundComponent ?? ((_a = router.options.notFoundRoute) == null ? void 0 : _a.options.component) : route.options.notFoundComponent;
	const resolvedNoSsr = matchState.ssr === false || matchState.ssr === "data-only";
	const ResolvedSuspenseBoundary = (!route.isRoot || route.options.wrapInSuspense || resolvedNoSsr) && (route.options.wrapInSuspense ?? PendingComponent ?? (((_b = route.options.errorComponent) == null ? void 0 : _b.preload) || resolvedNoSsr)) ? import_react.Suspense : SafeFragment;
	const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
	const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
	const resetKey = useRouterState({ select: (s) => s.loadedAt });
	const parentRouteId = useRouterState({ select: (s) => {
		var _a2;
		const index = s.matches.findIndex((d) => d.id === matchId);
		return (_a2 = s.matches[index - 1]) == null ? void 0 : _a2.routeId;
	} });
	const ShellComponent = route.isRoot ? route.options.shellComponent ?? SafeFragment : SafeFragment;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ShellComponent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(matchContext.Provider, {
		value: matchId,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedSuspenseBoundary, {
			fallback: pendingElement,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedCatchBoundary, {
				getResetKey: () => resetKey,
				errorComponent: routeErrorComponent || ErrorComponent,
				onCatch: (error, errorInfo) => {
					if (isNotFound(error)) throw error;
					`${matchId}`;
					routeOnCatch?.(error, errorInfo);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolvedNotFoundBoundary, {
					fallback: (error) => {
						if (!routeNotFoundComponent || error.routeId && error.routeId !== matchState.routeId || !error.routeId && !route.isRoot) throw error;
						return import_react.createElement(routeNotFoundComponent, error);
					},
					children: resolvedNoSsr || matchState._displayPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
						fallback: pendingElement,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchInner, { matchId })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchInner, { matchId })
				})
			})
		})
	}), parentRouteId === "__root__" && router.options.scrollRestoration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnRendered, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollRestoration, {})] }) : null] });
});
function OnRendered() {
	const router = useRouter();
	const prevLocationRef = import_react.useRef(void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		suppressHydrationWarning: true,
		ref: (el) => {
			if (el && (prevLocationRef.current === void 0 || prevLocationRef.current.href !== router.latestLocation.href)) {
				router.emit({
					type: "onRendered",
					...getLocationChangeInfo(router.state)
				});
				prevLocationRef.current = router.latestLocation;
			}
		}
	}, router.latestLocation.state.__TSR_key);
}
var MatchInner = import_react.memo(function MatchInnerImpl({ matchId }) {
	var _a, _b, _c, _d;
	const router = useRouter();
	const { match, key, routeId } = useRouterState({
		select: (s) => {
			const match2 = s.matches.find((d) => d.id === matchId);
			const routeId2 = match2.routeId;
			const remountFn = router.routesById[routeId2].options.remountDeps ?? router.options.defaultRemountDeps;
			const remountDeps = remountFn == null ? void 0 : remountFn({
				routeId: routeId2,
				loaderDeps: match2.loaderDeps,
				params: match2._strictParams,
				search: match2._strictSearch
			});
			return {
				key: remountDeps ? JSON.stringify(remountDeps) : void 0,
				routeId: routeId2,
				match: {
					id: match2.id,
					status: match2.status,
					error: match2.error,
					_forcePending: match2._forcePending,
					_displayPending: match2._displayPending
				}
			};
		},
		structuralSharing: true
	});
	const route = router.routesById[routeId];
	const out = import_react.useMemo(() => {
		const Comp = route.options.component ?? router.options.defaultComponent;
		if (Comp) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {}, key);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	}, [
		key,
		route.options.component,
		router.options.defaultComponent
	]);
	if (match._displayPending) throw (_a = router.getMatch(match.id)) == null ? void 0 : _a._nonReactive.displayPendingPromise;
	if (match._forcePending) throw (_b = router.getMatch(match.id)) == null ? void 0 : _b._nonReactive.minPendingPromise;
	if (match.status === "pending") {
		const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
		if (pendingMinMs) {
			const routerMatch = router.getMatch(match.id);
			if (routerMatch && !routerMatch._nonReactive.minPendingPromise) {
				if (!router.isServer) {
					const minPendingPromise = createControlledPromise();
					routerMatch._nonReactive.minPendingPromise = minPendingPromise;
					setTimeout(() => {
						minPendingPromise.resolve();
						routerMatch._nonReactive.minPendingPromise = void 0;
					}, pendingMinMs);
				}
			}
		}
		throw (_c = router.getMatch(match.id)) == null ? void 0 : _c._nonReactive.loadPromise;
	}
	if (match.status === "notFound") {
		invariant(isNotFound(match.error), "Expected a notFound error");
		return renderRouteNotFound(router, route, match.error);
	}
	if (match.status === "redirected") {
		invariant(isRedirect(match.error), "Expected a redirect error");
		throw (_d = router.getMatch(match.id)) == null ? void 0 : _d._nonReactive.loadPromise;
	}
	if (match.status === "error") {
		if (router.isServer) {
			const RouteErrorComponent = (route.options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteErrorComponent, {
				error: match.error,
				reset: void 0,
				info: { componentStack: "" }
			});
		}
		throw match.error;
	}
	return out;
});
var Outlet = import_react.memo(function OutletImpl() {
	const router = useRouter();
	const matchId = import_react.useContext(matchContext);
	const routeId = useRouterState({ select: (s) => {
		var _a;
		return (_a = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a.routeId;
	} });
	const route = router.routesById[routeId];
	const parentGlobalNotFound = useRouterState({ select: (s) => {
		const parentMatch = s.matches.find((d) => d.id === matchId);
		invariant(parentMatch, `Could not find parent match for matchId "${matchId}"`);
		return parentMatch.globalNotFound;
	} });
	const childMatchId = useRouterState({ select: (s) => {
		var _a;
		const matches = s.matches;
		return (_a = matches[matches.findIndex((d) => d.id === matchId) + 1]) == null ? void 0 : _a.id;
	} });
	const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.defaultPendingComponent, {}) : null;
	if (parentGlobalNotFound) return renderRouteNotFound(router, route, void 0);
	if (!childMatchId) return null;
	const nextMatch = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, { matchId: childMatchId });
	if (matchId === "__root__") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: pendingElement,
		children: nextMatch
	});
	return nextMatch;
});
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/Matches.js
function Matches() {
	const router = useRouter();
	const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.defaultPendingComponent, {}) : null;
	const ResolvedSuspense = router.isServer || typeof document !== "undefined" && router.ssr ? SafeFragment : import_react.Suspense;
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ResolvedSuspense, {
		fallback: pendingElement,
		children: [!router.isServer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transitioner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchesInner, {})]
	});
	return router.options.InnerWrap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.InnerWrap, { children: inner }) : inner;
}
function MatchesInner() {
	const router = useRouter();
	const matchId = useRouterState({ select: (s) => {
		var _a;
		return (_a = s.matches[0]) == null ? void 0 : _a.id;
	} });
	const resetKey = useRouterState({ select: (s) => s.loadedAt });
	const matchComponent = matchId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, { matchId }) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(matchContext.Provider, {
		value: matchId,
		children: router.options.disableGlobalCatchBoundary ? matchComponent : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundary, {
			getResetKey: () => resetKey,
			errorComponent: ErrorComponent,
			onCatch: (error) => {
				error.message || error.toString();
			},
			children: matchComponent
		})
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/router.js
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options);
	}
};
if (typeof globalThis !== "undefined") {
	globalThis.createFileRoute = createFileRoute;
	globalThis.createLazyFileRoute = createLazyFileRoute;
} else if (typeof window !== "undefined") {
	window.createFileRoute = createFileRoute;
	window.createLazyFileRoute = createLazyFileRoute;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tanstack+react-router@1.131.50_react-dom@19.1.5_react@19.1.5__react@19.1.5/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js
function RouterContextProvider({ router, children, ...rest }) {
	if (Object.keys(rest).length > 0) router.update({
		...router.options,
		...rest,
		context: {
			...router.options.context,
			...rest.context
		}
	});
	const routerContext = getRouterContext();
	const provider = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(routerContext.Provider, {
		value: router,
		children
	});
	if (router.options.Wrap) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.Wrap, { children: provider });
	return provider;
}
function RouterProvider({ router, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterContextProvider, {
		router,
		...rest,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Matches, {})
	});
}
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowRight = createLucideIcon("arrow-right", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "m12 5 7 7-7 7",
	key: "xquz4c"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BellRing = createLucideIcon("bell-ring", [
	["path", {
		d: "M10.268 21a2 2 0 0 0 3.464 0",
		key: "vwvbt9"
	}],
	["path", {
		d: "M22 8c0-2.3-.8-4.3-2-6",
		key: "5bb3ad"
	}],
	["path", {
		d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
		key: "11g9vi"
	}],
	["path", {
		d: "M4 2C2.8 3.7 2 5.7 2 8",
		key: "tap9e0"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bell = createLucideIcon("bell", [["path", {
	d: "M10.268 21a2 2 0 0 0 3.464 0",
	key: "vwvbt9"
}], ["path", {
	d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
	key: "11g9vi"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CalendarDays = createLucideIcon("calendar-days", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M16 14h.01",
		key: "1gbofw"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M16 18h.01",
		key: "kzsmim"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ClipboardList = createLucideIcon("clipboard-list", [
	["rect", {
		width: "8",
		height: "4",
		x: "8",
		y: "2",
		rx: "1",
		ry: "1",
		key: "tgr4d6"
	}],
	["path", {
		d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
		key: "116196"
	}],
	["path", {
		d: "M12 11h4",
		key: "1jrz19"
	}],
	["path", {
		d: "M12 16h4",
		key: "n85exb"
	}],
	["path", {
		d: "M8 11h.01",
		key: "1dfujw"
	}],
	["path", {
		d: "M8 16h.01",
		key: "18s6g9"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Inbox = createLucideIcon("inbox", [["polyline", {
	points: "22 12 16 12 14 15 10 15 8 12 2 12",
	key: "o97t9d"
}], ["path", {
	d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
	key: "oot6mr"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LayoutDashboard = createLucideIcon("layout-dashboard", [
	["rect", {
		width: "7",
		height: "9",
		x: "3",
		y: "3",
		rx: "1",
		key: "10lvy0"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "14",
		y: "3",
		rx: "1",
		key: "16une8"
	}],
	["rect", {
		width: "7",
		height: "9",
		x: "14",
		y: "12",
		rx: "1",
		key: "1hutg5"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "3",
		y: "16",
		rx: "1",
		key: "ldoo1y"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LogIn = createLucideIcon("log-in", [
	["path", {
		d: "m10 17 5-5-5-5",
		key: "1bsop3"
	}],
	["path", {
		d: "M15 12H3",
		key: "6jk70r"
	}],
	["path", {
		d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",
		key: "u53s6r"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LogOut = createLucideIcon("log-out", [
	["path", {
		d: "m16 17 5-5-5-5",
		key: "1bji2h"
	}],
	["path", {
		d: "M21 12H9",
		key: "dn1m92"
	}],
	["path", {
		d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
		key: "1uf3rs"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Menu = createLucideIcon("menu", [
	["path", {
		d: "M4 12h16",
		key: "1lakjw"
	}],
	["path", {
		d: "M4 18h16",
		key: "19g7jn"
	}],
	["path", {
		d: "M4 6h16",
		key: "1o0s65"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessagesSquare = createLucideIcon("messages-square", [["path", {
	d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z",
	key: "p1xzt8"
}], ["path", {
	d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1",
	key: "1cx29u"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Phone = createLucideIcon("phone", [["path", {
	d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
	key: "9njp5v"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Quote = createLucideIcon("quote", [["path", {
	d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
	key: "rib7q0"
}], ["path", {
	d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
	key: "1ymkrd"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Settings = createLucideIcon("settings", [["path", {
	d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
	key: "1qme2f"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ShieldCheck = createLucideIcon("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Users = createLucideIcon("users", [
	["path", {
		d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
		key: "1yyitq"
	}],
	["path", {
		d: "M16 3.128a4 4 0 0 1 0 7.744",
		key: "16gr8j"
	}],
	["path", {
		d: "M22 21v-2a4 4 0 0 0-3-3.87",
		key: "kshegd"
	}],
	["circle", {
		cx: "9",
		cy: "7",
		r: "4",
		key: "nufk8"
	}]
]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Wallet = createLucideIcon("wallet", [["path", {
	d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
	key: "18etb6"
}], ["path", {
	d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
	key: "xoc0q4"
}]]);
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var X = createLucideIcon("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
// src/components/NewRequestAlert.tsx
function resolveAudioContextCtor() {
	if (typeof window === "undefined") return null;
	const scoped = globalThis;
	return scoped.AudioContext ?? scoped.webkitAudioContext ?? null;
}
var sharedContext = null;
function getAudioContext() {
	if (sharedContext) return sharedContext;
	const Ctor = resolveAudioContextCtor();
	if (!Ctor) return null;
	try {
		sharedContext = new Ctor();
	} catch {
		sharedContext = null;
	}
	return sharedContext;
}
/** Emit the two-note chime on an already-running context. */
function emitDing(ctx) {
	const start = ctx.currentTime;
	for (const note of [{
		at: 0,
		freq: 880
	}, {
		at: .14,
		freq: 1318.5
	}]) {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(note.freq, start + note.at);
		gain.gain.setValueAtTime(1e-4, start + note.at);
		gain.gain.exponentialRampToValueAtTime(.16, start + note.at + .02);
		gain.gain.exponentialRampToValueAtTime(1e-4, start + note.at + .32);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(start + note.at);
		osc.stop(start + note.at + .36);
	}
}
/**
* In-app alert for a genuinely new service request.
*
* Mounted once in the app shell. It only watches and dings while the owner is
* signed in with admin access, names the new request (customer and service),
* links to the dashboard, and clears itself after a short time. The visual
* entrance is gated behind `motion-safe:` so it honors reduced motion.
*/
function NewRequestAlert() {
	const { data: isAdmin } = useIsAdmin();
	const { isAuthenticated } = useInternetIdentity();
	const { request, dismiss } = useNewRequestAlert(isAdmin === true && isAuthenticated);
	const pendingDingRef = (0, import_react.useRef)(false);
	const playDing = (0, import_react.useCallback)(() => {
		const ctx = getAudioContext();
		if (!ctx) return;
		if (ctx.state === "running") {
			emitDing(ctx);
			return;
		}
		pendingDingRef.current = true;
		ctx.resume().then(() => {
			if (pendingDingRef.current && ctx.state === "running") {
				pendingDingRef.current = false;
				emitDing(ctx);
			}
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!request) return;
		playDing();
	}, [request, playDing]);
	(0, import_react.useEffect)(() => {
		const unlock = () => {
			if (!pendingDingRef.current) return;
			const ctx = getAudioContext();
			if (!ctx) return;
			ctx.resume().then(() => {
				if (pendingDingRef.current && ctx.state === "running") {
					pendingDingRef.current = false;
					emitDing(ctx);
				}
			});
		};
		window.addEventListener("pointerdown", unlock);
		window.addEventListener("keydown", unlock);
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!request) return;
		const timer = window.setTimeout(dismiss, NEW_REQUEST_ALERT_MS);
		return () => window.clearTimeout(timer);
	}, [request, dismiss]);
	if (!request) return null;
	const serviceLabel = getService(request.category).label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "alert",
		"data-ocid": "new_request_alert",
		className: "fixed right-4 top-20 z-[60] w-[min(22rem,calc(100vw-2rem))] motion-safe:animate-honey-drop",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "notification-panel relative overflow-hidden rounded-2xl border border-accent/50 p-4 shadow-honey-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "hex-clip-flat flex size-10 shrink-0 items-center justify-center bg-primary/20 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-outline-black-strong font-display text-base font-bold text-gold-gradient",
								children: "New request"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 truncate text-sm font-semibold text-foreground",
								children: request.customerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm text-muted-foreground",
								children: [
									serviceLabel,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-1.5 text-border",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: request.referenceCode
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-ocid": "new_request_alert.dismiss_button",
						"aria-label": "Dismiss new request alert",
						onClick: dismiss,
						className: "flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition-smooth hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin",
				"data-ocid": "new_request_alert.dashboard_link",
				onClick: dismiss,
				className: "mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-accent/40 honey-surface px-4 text-sm font-semibold text-primary-foreground transition-smooth hover:-translate-y-0.5 hover:shadow-honey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				children: ["View on the dashboard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
			})]
		})
	});
}
// src/components/honey/BeeAccent.tsx
/**
* The Honey Do's bee — the single shared realistic, glossy 3D honeybee rendered
* as layered SVG so it matches the logo exactly at any size. Plump fuzzy body
* with alternating dark-brown and golden-amber bands, two pairs of elongated
* semi-translucent pale-amber wings with fine dark veins and an iridescent rim,
* thin dark segmented antennae, six dark jointed legs, a stinger, and a warm
* gold rim light with strong specular highlights. Never cartoon, flat, or emoji.
*
* The artwork is drawn in a 120x96 viewBox with a soft radial "hive glow"
* behind the body so the bee reads as a dimensional object rather than a flat
* icon at every size it is used (hero badge, nav accent, crew cards, swarm).
*/
function BeeAccent({ className, motion = "hover", label }) {
	const decorative = !label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("pointer-events-none inline-block h-6 w-8 select-none", motion === "hover" ? "animate-bee-hover" : "animate-bee-drift", className),
		"aria-hidden": decorative || void 0,
		role: decorative ? void 0 : "img",
		"aria-label": label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 96",
			className: "h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)]",
			"aria-hidden": "true",
			focusable: "false",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "bee-abdomen",
						x1: "0.1",
						y1: "0",
						x2: "0.2",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.74 0.15 68)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "34%",
								stopColor: "oklch(0.6 0.13 58)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "72%",
								stopColor: "oklch(0.4 0.08 52)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.24 0.04 50)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "bee-band",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.94 0.14 94)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "48%",
								stopColor: "oklch(0.82 0.17 82)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.6 0.14 62)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
						id: "bee-thorax",
						cx: "0.36",
						cy: "0.28",
						r: "0.9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.56 0.1 64)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "52%",
								stopColor: "oklch(0.32 0.055 56)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.16 0.02 52)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
						id: "bee-head",
						cx: "0.34",
						cy: "0.28",
						r: "0.95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "oklch(0.46 0.07 60)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "oklch(0.14 0.02 52)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "bee-wing",
						x1: "0.1",
						y1: "0",
						x2: "0.9",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.99 0.045 96 / 0.78)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "52%",
								stopColor: "oklch(0.92 0.075 90 / 0.44)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.84 0.09 84 / 0.2)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "bee-wing-rim",
						x1: "0",
						y1: "0",
						x2: "1",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.99 0.06 96 / 0.95)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "46%",
								stopColor: "oklch(0.88 0.12 88 / 0.55)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.74 0.13 300 / 0.4)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "bee-rim",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.97 0.13 96 / 0.98)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "42%",
								stopColor: "oklch(0.84 0.15 82 / 0.4)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.6 0.12 66 / 0)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
						id: "bee-spec",
						cx: "0.5",
						cy: "0.5",
						r: "0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "oklch(0.99 0.04 96 / 0.95)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "oklch(0.99 0.04 96 / 0)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
						id: "bee-halo",
						cx: "0.5",
						cy: "0.5",
						r: "0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "oklch(0.86 0.16 84 / 0.4)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "oklch(0.86 0.16 84 / 0)"
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "62",
					cy: "48",
					rx: "52",
					ry: "34",
					fill: "url(#bee-halo)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "66",
						cy: "20",
						rx: "27",
						ry: "12",
						fill: "url(#bee-wing)",
						stroke: "url(#bee-wing-rim)",
						strokeWidth: "1.3",
						transform: "rotate(-26 66 20)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "58",
						cy: "25",
						rx: "30",
						ry: "13.5",
						fill: "url(#bee-wing)",
						stroke: "url(#bee-wing-rim)",
						strokeWidth: "1.4",
						transform: "rotate(-15 58 25)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "74",
						cy: "33",
						rx: "19",
						ry: "9",
						fill: "url(#bee-wing)",
						stroke: "url(#bee-wing-rim)",
						strokeWidth: "1.1",
						transform: "rotate(9 74 33)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						stroke: "oklch(0.3 0.045 58 / 0.6)",
						strokeWidth: "0.8",
						fill: "none",
						strokeLinecap: "round",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M38 30c10-8 23-12 39-12" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M43 33c12-4 25-5 38-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M50 36c10-1 21 0 31 3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M60 27l8-8" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M68 30l9-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M63 38l10 3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M78 30l7-3" })
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					stroke: "oklch(0.18 0.02 52)",
					strokeWidth: "2.4",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					fill: "none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M42 52l-6 10-5 5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M50 55l-3 11-4 6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M59 55l3 11 5 6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M68 52l7 9 6 4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M37 47l-9 6-6 2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M73 47l9 5 6 1" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "66",
					cy: "45",
					rx: "30",
					ry: "19",
					fill: "url(#bee-abdomen)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M51 28.5c-4.6 9.6-4.6 22.4 0 32",
					stroke: "url(#bee-band)",
					strokeWidth: "6.6",
					strokeLinecap: "round",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M66 26c-4 11-4 26 0 37",
					stroke: "url(#bee-band)",
					strokeWidth: "6.6",
					strokeLinecap: "round",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M81 29.5c-3.2 9.4-3.2 21.6 0 31",
					stroke: "url(#bee-band)",
					strokeWidth: "5.6",
					strokeLinecap: "round",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					stroke: "oklch(0.88 0.13 88 / 0.55)",
					strokeWidth: "1",
					strokeLinecap: "round",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M94 37l5-2.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M96 45l5 0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M94 53l5 2.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M38 40l-5-2.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M36 48l-5 0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M38 56l-5 2.5" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M38 40c8-10 23-14 38-11",
					stroke: "url(#bee-rim)",
					strokeWidth: "3.2",
					strokeLinecap: "round",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "58",
					cy: "36",
					rx: "12",
					ry: "5.6",
					fill: "url(#bee-spec)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "82",
					cy: "42",
					rx: "5",
					ry: "3",
					fill: "url(#bee-spec)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "33",
					cy: "43",
					r: "14",
					fill: "url(#bee-thorax)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "19",
					cy: "40",
					r: "9.4",
					fill: "url(#bee-head)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "30",
					cy: "37",
					rx: "7",
					ry: "3.8",
					fill: "url(#bee-spec)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "16",
					cy: "38",
					rx: "3.9",
					ry: "4.8",
					fill: "oklch(0.1 0.01 52)",
					transform: "rotate(-12 16 38)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "14.6",
					cy: "36.2",
					rx: "1.4",
					ry: "1.8",
					fill: "url(#bee-spec)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					stroke: "oklch(0.16 0.02 52)",
					strokeWidth: "1.8",
					strokeLinecap: "round",
					fill: "none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 32c-3-5-6.4-8-10.6-9.6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16.5 30.5c-1.6-5.4-3.8-9-7-11.2" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "3",
					cy: "21.6",
					r: "1.9",
					fill: "oklch(0.18 0.02 52)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "18.6",
					r: "1.9",
					fill: "oklch(0.18 0.02 52)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M95 45l9 2.4-9 2.4z",
					fill: "oklch(0.16 0.02 52)"
				})
			]
		})
	});
}
/** Hexagon bullet that replaces generic list dots and dividers. */
function HexBullet({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("hex-clip inline-block size-2.5 shrink-0 bg-primary/80", className),
		"aria-hidden": "true",
		children
	});
}
/** Hexagon-centred divider that replaces generic horizontal rules. */
function HexDivider({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": "true",
		className: cn("flex items-center justify-center gap-3", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hex-clip size-2.5 bg-primary/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hex-clip size-1.5 bg-primary/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hex-clip size-2.5 bg-primary/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" })
		]
	});
}
// src/components/honey/HoneyButton.tsx
var VARIANT_CLASS = {
	primary: "honey-surface text-primary-foreground border border-accent/40 hover:-translate-y-0.5 hover:shadow-honey-lg active:translate-y-0 active:shadow-honey-inset",
	secondary: "border border-primary/45 bg-secondary/60 text-foreground hover:border-primary/70 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-honey",
	ghost: "border border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
	danger: "border border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25 hover:-translate-y-0.5"
};
var SIZE_CLASS = {
	sm: "min-h-10 px-4 text-sm",
	md: "min-h-12 px-6 text-base",
	lg: "min-h-14 px-8 text-base md:text-lg"
};
/**
* Glossy, substantial honey-gold button. Pill shaped with a shine sweep on
* hover and a full 44px+ touch target on mobile.
*/
function HoneyButton({ variant = "primary", size = "md", className, children, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type,
		className: cn("text-outline-black group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-smooth", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", "disabled:pointer-events-none disabled:opacity-55", VARIANT_CLASS[variant], SIZE_CLASS[size], className),
		...props,
		children: [variant === "primary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative z-10 inline-flex items-center gap-2",
			children
		})]
	});
}
// src/components/layout/AppLayout.tsx
var LOGO_SRC = "/assets/generated/honey-dos-logo.dim_1024x1024.png";
/** Owner's direct line — always reachable from the footer. */
var OWNER_PHONE_DISPLAY = "405-312-4987";
var OWNER_PHONE_HREF = "tel:+14053124987";
var NAV_ITEMS = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/request",
		label: "New Request"
	},
	{
		to: "/track",
		label: "Track Job"
	},
	{
		to: "/admin",
		label: "Dashboard",
		adminOnly: true
	}
];
/**
* The full admin menu. Every destination is a working route registered in
* App.tsx; the menu is rendered only for a signed-in admin.
*/
var ADMIN_NAV_ITEMS = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/admin/requests",
		label: "Requests",
		icon: Inbox
	},
	{
		to: "/admin/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/admin/customers",
		label: "Customers",
		icon: Users,
		matchPrefix: "/admin/customers"
	},
	{
		to: "/admin/quotes",
		label: "Quotes",
		icon: Quote
	},
	{
		to: "/admin/jobs",
		label: "Jobs",
		icon: ClipboardList
	},
	{
		to: "/admin/payments",
		label: "Payments",
		icon: Wallet
	},
	{
		to: "/admin/messages",
		label: "Messages",
		icon: MessagesSquare
	},
	{
		to: "/admin/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings
	}
];
/**
* Count badge for the Dashboard nav item — how many requests are still waiting
* on the owner's quote. Renders nothing at zero so the nav stays quiet.
*/
function NewRequestBadge({ count }) {
	if (count <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"data-ocid": "nav.new_request_badge",
		"aria-label": `${count} ${count === 1 ? "request" : "requests"} awaiting a quote`,
		className: "text-outline-black inline-flex min-w-5 items-center justify-center rounded-full border border-accent/50 bg-primary px-1.5 py-0.5 font-mono text-[0.65rem] font-bold leading-none text-primary-foreground shadow-honey",
		children: count > 99 ? "99+" : count
	});
}
/**
* The admin sub-navigation: a horizontally scrollable tab bar of every admin
* destination. Rendered only inside the admin area for a signed-in admin, so
* the customer-facing header stays unchanged.
*/
function AdminNav({ pathname }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Admin",
		"data-ocid": "nav.admin_menu",
		className: "border-t border-border bg-card/95",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-6xl px-3 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "scrollbar-honey flex items-center gap-1 overflow-x-auto py-2",
				children: ADMIN_NAV_ITEMS.map((item) => {
					const active = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.to;
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							"data-ocid": `nav.admin_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`,
							"aria-current": active ? "page" : void 0,
							className: cn("inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-smooth", active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								"aria-hidden": "true",
								className: "size-4"
							}), item.label]
						})
					}, item.to);
				})
			})
		})
	});
}
function AppLayout({ children }) {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const { data: isAdmin } = useIsAdmin();
	const { data: newRequestCount } = useNewRequestCount(isAdmin === true);
	const { isAuthenticated, login, clear } = useInternetIdentity();
	const pathname = useRouterState()?.location?.pathname ?? "";
	const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin === true);
	const isLoggedIn = isAuthenticated;
	const badgeCount = newRequestCount ?? 0;
	const isAdminArea = pathname.startsWith("/admin");
	const showAdminNav = isAdmin === true && isAdminArea;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-outline-black relative flex min-h-dvh flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-hidden": "true",
				className: "honeycomb-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "comb-plane comb-plane-far" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "comb-plane comb-plane-mid" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "comb-plane comb-plane-near" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "comb-breathe" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "comb-honey-sheen" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary/10 to-transparent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "honey-drip pointer-events-none fixed inset-x-0 top-0 -z-10 h-1.5 opacity-80"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "honey-drip pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-2 opacity-70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewRequestAlert, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								"data-ocid": "nav.logo_link",
								className: "group flex min-w-0 items-center gap-3",
								onClick: () => setMenuOpen(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: LOGO_SRC,
										alt: "Honey Do's",
										className: "size-20 rounded-2xl border border-primary/40 object-cover shadow-honey transition-smooth group-hover:shadow-honey-lg sm:size-24 md:size-28"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, { className: "absolute -right-4 -top-3 h-7 w-10 sm:h-8 sm:w-11 md:h-9 md:w-12" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-outline-black-strong block truncate font-display text-2xl font-bold leading-none text-gold-gradient sm:text-3xl md:text-4xl",
										children: "Honey Do's"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 hidden text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block",
										children: "Little jobs. Big relief."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								"aria-label": "Primary",
								className: "hidden items-center gap-1 md:flex",
								children: visibleItems.map((item) => {
									const active = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.to;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										"data-ocid": `nav.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`,
										className: cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-smooth", active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
										children: [item.label, item.adminOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewRequestBadge, { count: badgeCount })]
									}, item.to);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
									variant: "secondary",
									size: "sm",
									"data-ocid": "nav.logout_button",
									onClick: () => clear(),
									className: "hidden sm:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
									variant: "secondary",
									size: "sm",
									"data-ocid": "nav.login_button",
									onClick: () => login(),
									className: "hidden sm:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-ocid": "nav.menu_toggle",
									"aria-label": menuOpen ? "Close menu" : "Open menu",
									"aria-expanded": menuOpen,
									onClick: () => setMenuOpen((open) => !open),
									className: "flex size-11 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-smooth hover:border-primary/50 md:hidden",
									children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})]
							})
						]
					}),
					menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Mobile",
						className: "border-t border-border bg-card/95 px-5 pb-4 pt-3 md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "flex flex-col gap-1",
							children: [
								visibleItems.map((item) => {
									const active = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.to;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										"data-ocid": `nav.mobile_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`,
										onClick: () => setMenuOpen(false),
										className: cn("flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold transition-smooth", active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "hex-clip size-2.5 bg-current"
											}),
											item.label,
											item.adminOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewRequestBadge, { count: badgeCount })
											})
										]
									}) }, item.to);
								}),
								isAdmin === true && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "mt-2 border-t border-border/70 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground",
										children: "Admin"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 flex flex-col gap-1",
										children: ADMIN_NAV_ITEMS.map((item) => {
											const active = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.to;
											const Icon = item.icon;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: item.to,
												"data-ocid": `nav.mobile_admin_${item.label.toLowerCase().replace(/\s+/g, "_")}_link`,
												onClick: () => setMenuOpen(false),
												className: cn("flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold transition-smooth", active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
													"aria-hidden": "true",
													className: "size-4"
												}), item.label]
											}) }, item.to);
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "pt-2",
									children: isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
										variant: "secondary",
										size: "md",
										"data-ocid": "nav.mobile_logout_button",
										onClick: () => {
											clear();
											setMenuOpen(false);
										},
										className: "w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HoneyButton, {
										variant: "secondary",
										size: "md",
										"data-ocid": "nav.mobile_login_button",
										onClick: () => {
											login();
											setMenuOpen(false);
										},
										className: "w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Sign in"]
									})
								})
							]
						})
					}),
					showAdminNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, { pathname })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative flex-1 bg-background/80",
				children
			}),
			!isAdminArea && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-40 border-t border-border bg-background/90 px-5 py-3 backdrop-blur-md md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/request",
					"data-ocid": "nav.sticky_request_button",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyButton, {
						size: "lg",
						className: "w-full",
						children: "Request a Honey Do"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border bg-muted/40 honeycomb-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: "hex-clip size-3 bg-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-outline-black-strong font-display text-lg font-bold text-gold-gradient",
										children: "Honey Do's"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeeAccent, { className: "h-5 w-7" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: "Friendly neighborhood help for the little jobs that make a big difference around the home."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Footer",
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground",
								children: "Explore"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-2",
								children: visibleItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									"data-ocid": `footer.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`,
									className: "inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: "hex-clip size-2 bg-primary/70"
									}), item.label]
								}) }, item.to))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground",
									children: "Call the owner"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: OWNER_PHONE_HREF,
									"data-ocid": "footer.phone_link",
									className: "inline-flex min-h-11 items-center gap-2 text-base font-semibold text-primary transition-smooth hover:text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), OWNER_PHONE_DISPLAY]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), isAdmin ? "Signed in with admin access" : "Sign in to manage requests"]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border/70 px-5 py-5 text-center sm:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							". Built with love using",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
								target: "_blank",
								rel: "noreferrer",
								className: "font-semibold text-primary underline-offset-4 hover:underline",
								children: "caffeine.ai"
							})
						]
					})
				})]
			})
		]
	});
}
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// src/App.tsx
var HomePage = (0, import_react.lazy)(() => __vitePreload(() => import("./Home-CsyKSq69.js").then((module) => ({ default: module.HomePage })), __vite__mapDeps([0,1,2,3,4,5])));
var RequestPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Request-D2TLFZ8E.js").then((module) => ({ default: module.RequestPage })), __vite__mapDeps([6,2,7,1,8,4,9,10,5,11,12])));
var TrackPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Track-CimmWi0p.js").then((module) => ({ default: module.TrackPage })), __vite__mapDeps([13,2,1,3,8,14,15,16,9,10,17,7,5,11,12,18])));
var AdminPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Dashboard-B5tY-ag5.js").then((module) => ({ default: module.DashboardPage })), __vite__mapDeps([19,2,7,1,20,21,22,23,10,24,25,26,17,27,28])));
var RequestsPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Requests-B6J63pFm.js").then((module) => ({ default: module.RequestsPage })), __vite__mapDeps([29,2,7,1,23,10,25,17,27,28])));
var CalendarPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Calendar-C0K83M12.js").then((module) => ({ default: module.CalendarPage })), __vite__mapDeps([30,2,1,21,31,22,23,10,32,17,7,27,28])));
var CustomersPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Customers-ByKDLgb4.js").then((module) => ({ default: module.CustomersPage })), __vite__mapDeps([33,2,7,1,34,32,25,26,9,10,27,35,5])));
var CustomerProfilePage = (0, import_react.lazy)(() => __vitePreload(() => import("./CustomerProfile-nNmq-7cS.js").then((module) => ({ default: module.CustomerProfilePage })), __vite__mapDeps([36,2,7,1,37,8,23,10,34,14,24,15,25,27,28,35])));
var QuotesPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Quotes-CXwtRCwy.js").then((module) => ({ default: module.QuotesPage })), __vite__mapDeps([38,2,7,1,39,20,8,22,23,10,24,15,25,16,40,17,27])));
var JobsPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Jobs-BVHZHOtg.js").then((module) => ({ default: module.JobsPage })), __vite__mapDeps([41,2,7,1,39,21,23,10,25,17,27,28])));
var PaymentsPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Payments-C7_MpPpE.js").then((module) => ({ default: module.PaymentsPage })), __vite__mapDeps([42,2,7,1,39,23,10,17,28])));
var MessagesPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Messages-PLr5NS6Q.js").then((module) => ({ default: module.MessagesPage })), __vite__mapDeps([43,2,7,1,37,23,10,14,15,25,27,35])));
var NotificationsPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Notifications-DNjriS4-.js").then((module) => ({ default: module.NotificationsPage })), __vite__mapDeps([44,2,1,23,10,27,7,35])));
var SettingsPage = (0, import_react.lazy)(() => __vitePreload(() => import("./Settings-Bqr-VNGZ.js").then((module) => ({ default: module.SettingsPage })), __vite__mapDeps([45,2,7,1,39,23,10,34,14,24,40,17,27,28])));
var SchedulePage = (0, import_react.lazy)(() => __vitePreload(() => import("./Schedule-D28mbD0O.js").then((module) => ({ default: module.SchedulePage })), __vite__mapDeps([46,2,7,1,20,21,8,31,4,25,9,10,27,5,11,18])));
function PageFallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoneyLoader, { label: "Warming the hive" });
}
var rootRoute = createRootRoute({ component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
	fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageFallback, {}),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
}) }) });
var homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: HomePage
});
var requestRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/request",
	validateSearch: (search) => {
		const value = search.service;
		if (typeof value === "string" && Object.values(ServiceCategory).includes(value)) return { service: value };
		return {};
	},
	component: RequestPage
});
var trackRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/track",
	component: TrackPage
});
var adminRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin",
	component: AdminPage
});
var adminRequestsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/requests",
	component: RequestsPage
});
var adminCalendarRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/calendar",
	component: CalendarPage
});
var customersRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/customers",
	component: CustomersPage
});
var customerProfileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/customers/$customerId",
	component: CustomerProfilePage
});
var quotesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/quotes",
	component: QuotesPage
});
var jobsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/jobs",
	component: JobsPage
});
var paymentsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/payments",
	component: PaymentsPage
});
var messagesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/messages",
	component: MessagesPage
});
var notificationsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/notifications",
	component: NotificationsPage
});
var settingsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/settings",
	component: SettingsPage
});
var scheduleRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/schedule",
	component: SchedulePage
});
var router = createRouter({
	routeTree: rootRoute.addChildren([
		homeRoute,
		requestRoute,
		trackRoute,
		adminRoute,
		adminRequestsRoute,
		adminCalendarRoute,
		customersRoute,
		customerProfileRoute,
		quotesRoute,
		jobsRoute,
		paymentsRoute,
		messagesRoute,
		notificationsRoute,
		settingsRoute,
		scheduleRoute
	]),
	defaultPreload: "intent"
});
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router });
}
// src/main.tsx
BigInt.prototype.toJSON = function() {
	return this.toString();
};
var queryClient = new QueryClient();
import_client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
	client: queryClient,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InternetIdentityProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}) })
}));
export { useQuoteByReference as A, useSubmitReview as B, useDeclineQuoteByReference as C, useOwnerAlertEmail as D, useJobRequests as E, useSendTestAlert as F, useVisitHistory as H, useSetOwnerAlertEmail as I, useSetOwnerAlertPhone as L, useScheduleAppointment as M, useScheduledAppointments as N, useOwnerAlertPhone as O, useSendQuote as P, useSetQuote as R, useDashboardStats as S, useJobByReference as T, HoneyLoader as U, useTwilioConfigStatus as V, useSearch as _, X as a, useConfirmAppointment as b, Phone as c, Inbox as d, ClipboardList as f, Link as g, BellRing as h, HexDivider as i, useRecordDeposit as j, usePostCustomerMessage as k, MessagesSquare as l, Bell as m, BeeAccent as n, Wallet as o, CalendarDays as p, HexBullet as r, Users as s, HoneyButton as t, LogIn as u, useParams as v, useIsAdmin as w, useCustomerMessages as x, useAcceptQuote as y, useSubmitRequest as z };
