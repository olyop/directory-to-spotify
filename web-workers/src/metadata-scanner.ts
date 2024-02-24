declare const self: WorkerGlobalScope;

self.addEventListener("message", event => {
	console.log("metadata-scanner: message received from main thread");
	console.log(event);
});
