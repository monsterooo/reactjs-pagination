export function range(start = 0, stop = null, step = 1) {
	let [_start, _stop] = [0, start];
	if(stop !== null) {
		[_start, _stop] = [start, stop];
	}
	const length = Math.max(Math.ceil((_stop - _start) / step), 0);
	const range = Array(length);
	for(let idx = 0; idx < length; idx++, _start += step) {
		range[idx] = _start;
	}

	return range;
}
